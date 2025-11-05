/**
 * Parámetros de query string para la API
 */
export interface WorkingDaysQueryParams {
  days?: string;
  hours?: string;
  date?: string;
}

/**
 * Respuesta exitosa de la API
 */
export interface WorkingDaysResponse {
  date: string;
}

/**
 * Respuesta de error de la API
 */
export interface ErrorResponse {
  error: string;
  message: string;
}

