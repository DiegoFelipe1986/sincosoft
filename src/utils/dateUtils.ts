import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz';

/**
 * Zona horaria de Colombia
 */
export const COLOMBIA_TIMEZONE: string = 'America/Bogota';

/**
 * Convierte una fecha UTC a la zona horaria de Colombia
 * @param utcDate - Fecha en UTC
 * @returns Fecha en zona horaria de Colombia
 */
export function convertUtcToColombiaTime(utcDate: Date): Date {
  return utcToZonedTime(utcDate, COLOMBIA_TIMEZONE);
}

/**
 * Convierte una fecha de Colombia a UTC
 * @param colombiaDate - Fecha en zona horaria de Colombia
 * @returns Fecha en UTC
 */
export function convertColombiaTimeToUtc(colombiaDate: Date): Date {
  return zonedTimeToUtc(colombiaDate, COLOMBIA_TIMEZONE);
}

/**
 * Obtiene la fecha y hora actual en Colombia
 * @returns Fecha actual en zona horaria de Colombia
 */
export function getCurrentColombiaTime(): Date {
  const now: Date = new Date();
  return convertUtcToColombiaTime(now);
}

/**
 * Formatea una fecha a ISO 8601 con Z (UTC)
 * @param date - Fecha a formatear
 * @returns String en formato ISO 8601 UTC
 */
export function formatToUtcIso8601(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'", { timeZone: 'UTC' });
}

