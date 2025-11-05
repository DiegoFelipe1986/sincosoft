/**
 * Tipo para la respuesta de la API de días festivos
 * La API devuelve directamente un array de strings con fechas
 */
export type HolidayApiResponse = string[];

/**
 * Tipo para almacenar días festivos en formato Date
 */
export type HolidayCache = Set<string>;

