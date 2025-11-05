import { isHoliday } from '../services/holidayService';
import { addHours } from 'date-fns';
import { getColombiaHour, getColombiaMinutes, setColombiaTime } from './dateUtils';

/**
 * Horarios laborales en Colombia
 */
export const WORK_START_HOUR: number = 8; // 8:00 AM
export const WORK_END_HOUR: number = 17; // 5:00 PM
export const LUNCH_START_HOUR: number = 12; // 12:00 PM
export const LUNCH_END_HOUR: number = 13; // 1:00 PM

/**
 * Verifica si una fecha es un día de la semana (lunes a viernes)
 * @param date - Fecha a verificar
 * @returns true si es lunes a viernes, false en caso contrario
 */
export function isWeekday(date: Date): boolean {
  const dayOfWeek: number = date.getDay();
  // 0 = domingo, 6 = sábado
  // 1-5 = lunes a viernes
  return dayOfWeek >= 1 && dayOfWeek <= 5;
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
  
  const workStartMinutes: number = WORK_START_HOUR * 60; // 480 minutos (8:00 AM)
  const workEndMinutes: number = WORK_END_HOUR * 60; // 1020 minutos (5:00 PM)
  const lunchStartMinutes: number = LUNCH_START_HOUR * 60; // 720 minutos (12:00 PM)
  const lunchEndMinutes: number = LUNCH_END_HOUR * 60; // 780 minutos (1:00 PM)
  
  // Verificar si está antes del inicio del horario laboral
  if (timeInMinutes < workStartMinutes) {
    return false;
  }
  
  // Verificar si está después del fin del horario laboral
  if (timeInMinutes >= workEndMinutes) {
    return false;
  }
  
  // Verificar si está en horario de almuerzo
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
  
  // Si no es día hábil, retroceder al último día hábil a las 5:00 PM
  let isWorkingDayDate: boolean = await isWorkingDay(normalizedDate);
  
  while (!isWorkingDayDate) {
    // Retroceder un día
    normalizedDate = addHours(normalizedDate, -24);
    // Ajustar a las 5:00 PM (fin del día laboral)
    normalizedDate = setColombiaTime(normalizedDate, WORK_END_HOUR, 0);
    
    isWorkingDayDate = await isWorkingDay(normalizedDate);
  }
  
  // Verificar si está en horario laboral
  if (!isWorkingHours(normalizedDate)) {
    const hour: number = getColombiaHour(normalizedDate);
    const minutes: number = getColombiaMinutes(normalizedDate);
    const timeInMinutes: number = hour * 60 + minutes;
    
    const workStartMinutes: number = WORK_START_HOUR * 60;
    const lunchStartMinutes: number = LUNCH_START_HOUR * 60;
    const lunchEndMinutes: number = LUNCH_END_HOUR * 60;
    const workEndMinutes: number = WORK_END_HOUR * 60;
    
    // Si está antes de las 8:00 AM, ajustar a las 8:00 AM
    if (timeInMinutes < workStartMinutes) {
      normalizedDate = setColombiaTime(normalizedDate, WORK_START_HOUR, 0);
    }
    // Si está en horario de almuerzo (12:00 PM - 1:00 PM), ajustar a las 12:00 PM
    else if (timeInMinutes >= lunchStartMinutes && timeInMinutes < lunchEndMinutes) {
      normalizedDate = setColombiaTime(normalizedDate, LUNCH_START_HOUR, 0);
    }
    // Si está después de las 5:00 PM, ajustar a las 5:00 PM
    else if (timeInMinutes >= workEndMinutes) {
      normalizedDate = setColombiaTime(normalizedDate, WORK_END_HOUR, 0);
    }
  }
  
  return normalizedDate;
}

