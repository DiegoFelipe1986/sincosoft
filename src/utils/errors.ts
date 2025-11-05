/**
 * Clase base para errores personalizados de la aplicación
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;

  constructor(message: string, statusCode: number, errorCode: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error para parámetros inválidos (400)
 */
export class InvalidParametersError extends AppError {
  constructor(message: string) {
    super(message, 400, 'InvalidParameters');
  }
}

/**
 * Error cuando el servicio externo no está disponible (503)
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string) {
    super(message, 503, 'ServiceUnavailable');
  }
}

/**
 * Error cuando falla la obtención de días festivos
 */
export class HolidaysFetchError extends ServiceUnavailableError {
  constructor(message: string) {
    super(`Error al obtener días festivos: ${message}`);
  }
}

