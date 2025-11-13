import 'dotenv/config';
import express, { Request, Response } from 'express';
import { WorkingDaysQueryParams, WorkingDaysResponse, ErrorResponse } from './types/apiTypes';
import { parsePositiveInteger, parseIso8601Date } from './utils/validators';
import { convertUtcToColombiaTime, convertColombiaTimeToUtc, getCurrentColombiaTime, formatToUtcIso8601 } from './utils/dateUtils';
import { calculateWorkingDays } from './services/workingDaysCalculator';
import { AppError, InvalidParametersError } from './utils/errors';

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.get('/', (_req: Request, res: Response): void => {
  res.status(200).json({
    message: 'API de Fechas Hábiles - Colombia',
    endpoints: {
      health: '/health',
      workingDays: '/working-days?days=<number>&hours=<number>&date=<ISO8601>'
    }
  });
});

app.get('/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok' });
});

app.get('/working-days', async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams: WorkingDaysQueryParams = req.query as WorkingDaysQueryParams;
    
    // Validate that at least one of days or hours is present
    if (!queryParams.days && !queryParams.hours) {
      throw new InvalidParametersError('Al menos uno de los parámetros "days" o "hours" debe estar presente');
    }
    
    // Validate and parse days
    let days: number = 0;
    if (queryParams.days) {
      const parsedDays: number | null = parsePositiveInteger(queryParams.days);
      if (parsedDays === null) {
        throw new InvalidParametersError('El parámetro "days" debe ser un entero positivo');
      }
      days = parsedDays;
    }
    
    // Validate and parse hours
    let hours: number = 0;
    if (queryParams.hours) {
      const parsedHours: number | null = parsePositiveInteger(queryParams.hours);
      if (parsedHours === null) {
        throw new InvalidParametersError('El parámetro "hours" debe ser un entero positivo');
      }
      hours = parsedHours;
    }
    
    // Validate and parse date if present
    let startDate: Date;
    if (queryParams.date) {
      const parsedDate: Date | null = parseIso8601Date(queryParams.date);
      if (parsedDate === null) {
        throw new InvalidParametersError('El parámetro "date" debe ser una fecha ISO 8601 válida con sufijo Z (UTC)');
      }
      // Convert from UTC to Colombia time
      startDate = convertUtcToColombiaTime(parsedDate);
    } else {
      // If date is not provided, use current time in Colombia
      startDate = getCurrentColombiaTime();
    }
    
    // Calculate resulting date
    const resultDate: Date = await calculateWorkingDays(startDate, days, hours);
    
    // Convert from Colombia to UTC
    const resultDateUtc: Date = convertColombiaTimeToUtc(resultDate);
    
    // Format response
    const response: WorkingDaysResponse = {
      date: formatToUtcIso8601(resultDateUtc)
    };
    
    res.status(200).json(response);
  } catch (error: unknown) {
    // Handle application errors
    if (error instanceof AppError) {
      const errorResponse: ErrorResponse = {
        error: error.errorCode,
        message: error.message
      };
      
      // Log error (in production could use a more robust logger)
      console.error(`[${error.errorCode}] ${error.message}`);
      
      res.status(error.statusCode).json(errorResponse);
      return;
    }
    
    // Handle unexpected errors
    console.error('Unexpected error:', error);
    
    const errorResponse: ErrorResponse = {
      error: 'ServiceUnavailable',
      message: 'Error interno del servidor'
    };
    res.status(503).json(errorResponse);
  }
});

// Exportar app para uso en Lambda
export default app;

// Solo iniciar servidor si no estamos en Lambda
if (require.main === module) {
  app.listen(PORT, (): void => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

