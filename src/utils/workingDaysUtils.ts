import { isHoliday } from '../services/holidayService';
import { subDays } from 'date-fns';
import { format } from 'date-fns-tz';
import { getColombiaHour, getColombiaMinutes, setColombiaTime, COLOMBIA_TIMEZONE } from './dateUtils';

/**
 * Horarios laborales en Colombia
 */
export const WORK_START_HOUR: number = 8; // 8:00 AM
export const WORK_END_HOUR: number = 17; // 5:00 PM
export const LUNCH_START_HOUR: number = 12; // 12:00 PM
export const LUNCH_END_HOUR: number = 13; // 1:00 PM

/**
 * Verifica si una fecha es un día de la semana (lunes a viernes) en zona horaria de Colombia
 * @param date - Fecha a verificar (Date object que representa una fecha/hora en UTC)
 * @returns true si es lunes a viernes, false en caso contrario
 */
export function isWeekday(date: Date): boolean {
  // Get day of week in Colombia timezone
  // Use format with 'EEEE' to get day name and then verify
  // date-fns may return names in English or Spanish depending on configuration
  const dayName: string = format(date, 'EEEE', { timeZone: COLOMBIA_TIMEZONE });
  const weekdaysEn: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const weekdaysEs: string[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
  return weekdaysEn.includes(dayName) || weekdaysEs.includes(dayName.toLowerCase());
}

/**
 * Verifica si una fecha es día hábil (lunes a viernes y no es festivo)
 * @param date - Fecha a verificar (en zona horaria de Colombia)
 * @returns Promise<boolean> true si es día hábil, false en caso contrario
 */
export async function isWorkingDay(date: Date): Promise<boolean> {
  if (!isWeekday(date)) {
    return false;
  }
  
  const isHolidayDate: boolean = await isHoliday(date);
  
  return !isHolidayDate;
}

/**
 * Verifica si una fecha está dentro del horario laboral
 * Horario laboral: 8:00 AM - 5:00 PM, excluyendo 12:00 PM - 1:00 PM (almuerzo)
 * @param date - Fecha a verificar (en zona horaria de Colombia)
 * @returns true si está en horario laboral, false en caso contrario
 */
export function isWorkingHours(date: Date): boolean {
  const hour: number = getColombiaHour(date);
  const minutes: number = getColombiaMinutes(date);
  const timeInMinutes: number = hour * 60 + minutes;
  
  const workStartMinutes: number = WORK_START_HOUR * 60; // 480 minutes (8:00 AM)
  const workEndMinutes: number = WORK_END_HOUR * 60; // 1020 minutes (5:00 PM)
  const lunchStartMinutes: number = LUNCH_START_HOUR * 60; // 720 minutes (12:00 PM)
  const lunchEndMinutes: number = LUNCH_END_HOUR * 60; // 780 minutes (1:00 PM)
  
  // Check if before start of working hours
  if (timeInMinutes < workStartMinutes) {
    return false;
  }
  
  // Check if after end of working hours
  if (timeInMinutes >= workEndMinutes) {
    return false;
  }
  
  // Check if in lunch break
  if (timeInMinutes >= lunchStartMinutes && timeInMinutes < lunchEndMinutes) {
    return false;
  }
  
  return true;
}

/**
 * Normaliza una fecha aproximándola hacia atrás al día y hora laboral más cercano
 * Si la fecha está fuera del horario laboral o no es día hábil, la aproxima hacia atrás
 * @param date - Fecha a normalizar (en zona horaria de Colombia)
 * @returns Promise<Date> Fecha normalizada al tiempo laboral más cercano
 */
export async function normalizeToWorkingTime(date: Date): Promise<Date> {
  let normalizedDate: Date = new Date(date);
  
  // If not a working day, go back to last working day at 5:00 PM
  let isWorkingDayDate: boolean = await isWorkingDay(normalizedDate);
  
  while (!isWorkingDayDate) {
    // Go back one day
    normalizedDate = subDays(normalizedDate, 1);
    // Adjust to 5:00 PM (end of working day)
    normalizedDate = setColombiaTime(normalizedDate, WORK_END_HOUR, 0);
    
    isWorkingDayDate = await isWorkingDay(normalizedDate);
  }
  
  // Check if in working hours
  if (!isWorkingHours(normalizedDate)) {
    const hour: number = getColombiaHour(normalizedDate);
    const minutes: number = getColombiaMinutes(normalizedDate);
    const timeInMinutes: number = hour * 60 + minutes;
    
    const workStartMinutes: number = WORK_START_HOUR * 60;
    const lunchStartMinutes: number = LUNCH_START_HOUR * 60;
    const lunchEndMinutes: number = LUNCH_END_HOUR * 60;
    const workEndMinutes: number = WORK_END_HOUR * 60;
    
    // If before 8:00 AM, adjust to 8:00 AM
    if (timeInMinutes < workStartMinutes) {
      normalizedDate = setColombiaTime(normalizedDate, WORK_START_HOUR, 0);
    }
    // If in lunch break (12:00 PM - 1:00 PM), adjust to 12:00 PM
    else if (timeInMinutes >= lunchStartMinutes && timeInMinutes < lunchEndMinutes) {
      normalizedDate = setColombiaTime(normalizedDate, LUNCH_START_HOUR, 0);
    }
    // If after 5:00 PM, adjust to 5:00 PM
    else if (timeInMinutes >= workEndMinutes) {
      normalizedDate = setColombiaTime(normalizedDate, WORK_END_HOUR, 0);
    }
  }
  
  return normalizedDate;
}

