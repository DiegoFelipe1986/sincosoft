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
  // Formatear la fecha con la hora deseada en Colombia
  const dateStr: string = format(date, 'yyyy-MM-dd', { timeZone: COLOMBIA_TIMEZONE });
  const timeStr: string = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  
  // Crear un string en formato ISO para la fecha/hora en Colombia
  const colombiaDateTimeStr: string = `${dateStr}T${timeStr}`;
  
  // zonedTimeToUtc toma un string de fecha/hora y lo interpreta como si fuera en la zona horaria especificada
  // y devuelve el equivalente en UTC
  const colombiaDate: Date = zonedTimeToUtc(colombiaDateTimeStr, COLOMBIA_TIMEZONE);
  return colombiaDate;
}

/**
 * Formatea una fecha a ISO 8601 con Z (UTC)
 * @param date - Fecha a formatear (debe estar en UTC)
 * @returns String en formato ISO 8601 UTC
 */
export function formatToUtcIso8601(date: Date): string {
  // El objeto Date ya está en UTC, solo necesitamos formatearlo
  const isoString: string = date.toISOString();
  // Eliminar los milisegundos si están presentes y retornar formato sin milisegundos
  return isoString.replace(/\.\d{3}Z$/, 'Z');
}

