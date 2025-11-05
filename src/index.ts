import express, { Request, Response } from 'express';
import { WorkingDaysQueryParams, WorkingDaysResponse, ErrorResponse } from './types/apiTypes';
import { parsePositiveInteger, parseIso8601Date } from './utils/validators';
import { convertUtcToColombiaTime, convertColombiaTimeToUtc, getCurrentColombiaTime, formatToUtcIso8601 } from './utils/dateUtils';
import { calculateWorkingDays } from './services/workingDaysCalculator';

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.get('/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok' });
});

app.get('/working-days', async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams: WorkingDaysQueryParams = req.query as WorkingDaysQueryParams;
    
    // Validar que al menos uno de days o hours esté presente
    if (!queryParams.days && !queryParams.hours) {
      const errorResponse: ErrorResponse = {
        error: 'InvalidParameters',
        message: 'Al menos uno de los parámetros "days" o "hours" debe estar presente'
      };
      res.status(400).json(errorResponse);
      return;
    }
    
    // Validar y parsear days
    let days: number = 0;
    if (queryParams.days) {
      const parsedDays: number | null = parsePositiveInteger(queryParams.days);
      if (parsedDays === null) {
        const errorResponse: ErrorResponse = {
          error: 'InvalidParameters',
          message: 'El parámetro "days" debe ser un entero positivo'
        };
        res.status(400).json(errorResponse);
        return;
      }
      days = parsedDays;
    }
    
    // Validar y parsear hours
    let hours: number = 0;
    if (queryParams.hours) {
      const parsedHours: number | null = parsePositiveInteger(queryParams.hours);
      if (parsedHours === null) {
        const errorResponse: ErrorResponse = {
          error: 'InvalidParameters',
          message: 'El parámetro "hours" debe ser un entero positivo'
        };
        res.status(400).json(errorResponse);
        return;
      }
      hours = parsedHours;
    }
    
    // Validar y parsear date si está presente
    let startDate: Date;
    if (queryParams.date) {
      const parsedDate: Date | null = parseIso8601Date(queryParams.date);
      if (parsedDate === null) {
        const errorResponse: ErrorResponse = {
          error: 'InvalidParameters',
          message: 'El parámetro "date" debe ser una fecha ISO 8601 válida con sufijo Z (UTC)'
        };
        res.status(400).json(errorResponse);
        return;
      }
      // Convertir de UTC a hora de Colombia
      startDate = convertUtcToColombiaTime(parsedDate);
    } else {
      // Si no se proporciona date, usar la hora actual en Colombia
      startDate = getCurrentColombiaTime();
    }
    
    // Calcular la fecha resultante
    const resultDate: Date = await calculateWorkingDays(startDate, days, hours);
    
    // Convertir de Colombia a UTC
    const resultDateUtc: Date = convertColombiaTimeToUtc(resultDate);
    
    // Formatear la respuesta
    const response: WorkingDaysResponse = {
      date: formatToUtcIso8601(resultDateUtc)
    };
    
    res.status(200).json(response);
  } catch (error: unknown) {
    const errorMessage: string = error instanceof Error ? error.message : 'Error desconocido';
    const errorResponse: ErrorResponse = {
      error: 'ServiceUnavailable',
      message: errorMessage
    };
    res.status(503).json(errorResponse);
  }
});

app.listen(PORT, (): void => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

