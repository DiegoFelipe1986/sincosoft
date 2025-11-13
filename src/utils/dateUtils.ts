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
 * Obtiene la hora de una fecha en zona horaria de Colombia
 * @param date - Fecha a obtener la hora
 * @returns Hora en Colombia (0-23)
 */
export function getColombiaHour(date: Date): number {
  return parseInt(format(date, 'H', { timeZone: COLOMBIA_TIMEZONE }), 10);
}

/**
 * Obtiene los minutos de una fecha en zona horaria de Colombia
 * @param date - Fecha a obtener los minutos
 * @returns Minutos (0-59)
 */
export function getColombiaMinutes(date: Date): number {
  return parseInt(format(date, 'm', { timeZone: COLOMBIA_TIMEZONE }), 10);
}

/**
 * Crea una nueva fecha con hora específica en zona horaria de Colombia
 * @param date - Fecha base
 * @param hours - Hora en Colombia (0-23)
 * @param minutes - Minutos (0-59, opcional, por defecto 0)
 * @returns Nueva fecha con la hora especificada en Colombia
 */
export function setColombiaTime(date: Date, hours: number, minutes: number = 0): Date {
  // Get date components directly from base date
  // Use UTC methods to get year, month and day without timezone conversion
  const year: number = date.getUTCFullYear();
  const month: number = date.getUTCMonth() + 1; // getUTCMonth() returns 0-11
  const day: number = date.getUTCDate();
  
  // Create ISO format string for date/time in Colombia
  const dateStr: string = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const timeStr: string = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  const colombiaDateTimeStr: string = `${dateStr}T${timeStr}`;
  
  // zonedTimeToUtc takes a date/time string and interprets it as if it were in the specified timezone
  // and returns the UTC equivalent
  const colombiaDate: Date = zonedTimeToUtc(colombiaDateTimeStr, COLOMBIA_TIMEZONE);
  return colombiaDate;
}

/**
 * Adds hours to a date respecting Colombia timezone
 * @param date - Base date (in Colombia timezone)
 * @param hours - Number of hours to add (can be decimal)
 * @returns New date with hours added in Colombia timezone
 */
export function addColombiaHours(date: Date, hours: number): Date {
  // Get current time in Colombia
  const currentHour: number = getColombiaHour(date);
  const currentMinutes: number = getColombiaMinutes(date);
  
  // Convert to total minutes
  const totalMinutes: number = currentHour * 60 + currentMinutes;
  
  // Add hours (convert to minutes)
  const hoursInMinutes: number = hours * 60;
  const newTotalMinutes: number = totalMinutes + hoursInMinutes;
  
  // Calculate new hour and minutes
  const newHour: number = Math.floor(newTotalMinutes / 60);
  const newMinutes: number = newTotalMinutes % 60;
  
  // Create new date with resulting time
  return setColombiaTime(date, newHour, newMinutes);
}

/**
 * Formats a date to ISO 8601 with Z (UTC)
 * @param date - Date to format (must be in UTC)
 * @returns String in ISO 8601 UTC format
 */
export function formatToUtcIso8601(date: Date): string {
  // Date object is already in UTC, we just need to format it
  const isoString: string = date.toISOString();
  // Remove milliseconds if present and return format without milliseconds
  return isoString.replace(/\.\d{3}Z$/, 'Z');
}

