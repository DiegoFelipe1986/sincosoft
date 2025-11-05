/**
 * Tipo para la respuesta de la API de días festivos
 */
export interface HolidayApiResponse {
  workingDays: string[];
}

/**
 * Tipo para almacenar días festivos en formato Date
 */
export type HolidayCache = Set<string>;

