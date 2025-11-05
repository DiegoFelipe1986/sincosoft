import { 
  normalizeToWorkingTime, 
  isWorkingDay, 
  WORK_START_HOUR,
  WORK_END_HOUR,
  LUNCH_START_HOUR,
  LUNCH_END_HOUR
} from '../utils/workingDaysUtils';
import { addDays, addHours } from 'date-fns';
import { getColombiaHour, getColombiaMinutes, setColombiaTime } from '../utils/dateUtils';

/**
 * Calcula la fecha resultante después de sumar días y horas hábiles
 * @param startDate - Fecha inicial en zona horaria de Colombia
 * @param days - Número de días hábiles a sumar
 * @param hours - Número de horas hábiles a sumar
 * @returns Promise<Date> Fecha resultante en zona horaria de Colombia
 */
export async function calculateWorkingDays(
  startDate: Date,
  days: number,
  hours: number
): Promise<Date> {
  // 1. Normalizar la fecha inicial (aproximar hacia atrás si es necesario)
  let currentDate: Date = await normalizeToWorkingTime(startDate);
  
  // 2. Sumar días hábiles primero (si se proporciona)
  if (days > 0) {
    currentDate = await addWorkingDays(currentDate, days);
  }
  
  // 3. Sumar horas hábiles después (si se proporciona)
  if (hours > 0) {
    currentDate = await addWorkingHours(currentDate, hours);
  }
  
  return currentDate;
}

/**
 * Suma días hábiles a una fecha
 * @param date - Fecha inicial en zona horaria de Colombia
 * @param days - Número de días hábiles a sumar
 * @returns Promise<Date> Fecha resultante después de sumar los días hábiles
 */
async function addWorkingDays(date: Date, days: number): Promise<Date> {
  let currentDate: Date = new Date(date);
  let remainingDays: number = days;
  
  while (remainingDays > 0) {
    // Avanzar un día
    currentDate = addDays(currentDate, 1);
    // Ajustar a las 8:00 AM (inicio del día laboral) en hora de Colombia
    currentDate = setColombiaTime(currentDate, WORK_START_HOUR, 0);
    
    // Si es día hábil, contar este día
    const isWorkingDayDate: boolean = await isWorkingDay(currentDate);
    if (isWorkingDayDate) {
      remainingDays--;
    }
  }
  
  return currentDate;
}

/**
 * Suma horas hábiles a una fecha
 * @param date - Fecha inicial en zona horaria de Colombia (debe estar en horario laboral)
 * @param hours - Número de horas hábiles a sumar
 * @returns Promise<Date> Fecha resultante después de sumar las horas hábiles
 */
async function addWorkingHours(date: Date, hours: number): Promise<Date> {
  let currentDate: Date = new Date(date);
  let remainingHours: number = hours;
  
  while (remainingHours > 0) {
    const currentHour: number = getColombiaHour(currentDate);
    const currentMinutes: number = getColombiaMinutes(currentDate);
    const timeInMinutes: number = currentHour * 60 + currentMinutes;
    
    const workEndMinutes: number = WORK_END_HOUR * 60; // 1020
    const lunchStartMinutes: number = LUNCH_START_HOUR * 60; // 720
    const lunchEndMinutes: number = LUNCH_END_HOUR * 60; // 780
    
    // Calcular minutos hasta el próximo límite (almuerzo o fin de día)
    let minutesUntilLimit: number;
    
    if (timeInMinutes < lunchStartMinutes) {
      // Antes del almuerzo: calcular hasta el almuerzo o fin de día, lo que venga primero
      const minutesUntilLunch: number = lunchStartMinutes - timeInMinutes;
      const minutesUntilEnd: number = workEndMinutes - timeInMinutes;
      minutesUntilLimit = Math.min(minutesUntilLunch, minutesUntilEnd);
    } else if (timeInMinutes < lunchEndMinutes) {
      // En horario de almuerzo: avanzar al fin del almuerzo
      minutesUntilLimit = lunchEndMinutes - timeInMinutes;
    } else {
      // Después del almuerzo: calcular hasta el fin del día
      minutesUntilLimit = workEndMinutes - timeInMinutes;
    }
    
    // Si las horas restantes caben en el día actual
    const hoursToAdd: number = Math.min(remainingHours, minutesUntilLimit / 60);
    
    if (hoursToAdd > 0) {
      currentDate = addHours(currentDate, hoursToAdd);
      remainingHours -= hoursToAdd;
    }
    
    // Si aún quedan horas, avanzar al siguiente día hábil
    if (remainingHours > 0) {
      // Avanzar al siguiente día hábil
      currentDate = await advanceToNextWorkingDay(currentDate);
    }
  }
  
  return currentDate;
}

/**
 * Avanza al siguiente día hábil a las 8:00 AM
 * @param date - Fecha actual
 * @returns Promise<Date> Siguiente día hábil a las 8:00 AM
 */
async function advanceToNextWorkingDay(date: Date): Promise<Date> {
  let nextDate: Date = addDays(date, 1);
  nextDate = setColombiaTime(nextDate, WORK_START_HOUR, 0);
  
  // Buscar el siguiente día hábil
  while (!(await isWorkingDay(nextDate))) {
    nextDate = addDays(nextDate, 1);
    nextDate = setColombiaTime(nextDate, WORK_START_HOUR, 0);
  }
  
  return nextDate;
}

