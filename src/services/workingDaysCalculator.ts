import { 
  normalizeToWorkingTime, 
  isWorkingDay, 
  WORK_START_HOUR,
  WORK_END_HOUR,
  LUNCH_START_HOUR,
  LUNCH_END_HOUR
} from '../utils/workingDaysUtils';
import { addDays } from 'date-fns';
import { getColombiaHour, getColombiaMinutes, setColombiaTime, addColombiaHours } from '../utils/dateUtils';

/**
 * Calculates the resulting date after adding working days and hours
 * @param startDate - Initial date in Colombia timezone
 * @param days - Number of working days to add
 * @param hours - Number of working hours to add
 * @returns Promise<Date> Resulting date in Colombia timezone
 */
export async function calculateWorkingDays(
  startDate: Date,
  days: number,
  hours: number
): Promise<Date> {
  // 1. Normalize initial date (approximate backwards if necessary)
  let currentDate: Date = await normalizeToWorkingTime(startDate);
  
  // Save initial day time to preserve it when adding days
  const initialHour: number = getColombiaHour(currentDate);
  const initialMinutes: number = getColombiaMinutes(currentDate);
  
  // 2. Add working days first (if provided)
  if (days > 0) {
    currentDate = await addWorkingDays(currentDate, days, initialHour, initialMinutes);
  }
  
  // 3. Add working hours after (if provided)
  if (hours > 0) {
    currentDate = await addWorkingHours(currentDate, hours);
  }
  
  return currentDate;
}

/**
 * Adds working days to a date
 * @param date - Initial date in Colombia timezone
 * @param days - Number of working days to add
 * @param preserveHour - Hour to preserve (0-23)
 * @param preserveMinutes - Minutes to preserve (0-59)
 * @returns Promise<Date> Resulting date after adding working days
 */
async function addWorkingDays(
  date: Date, 
  days: number, 
  preserveHour?: number, 
  preserveMinutes?: number
): Promise<Date> {
  let currentDate: Date = new Date(date);
  let remainingDays: number = days;
  
  // Determine time to use: preserve original time if in working hours, otherwise use 8:00 AM
  let targetHour: number = WORK_START_HOUR;
  let targetMinutes: number = 0;
  
  if (preserveHour !== undefined && preserveMinutes !== undefined) {
    const timeInMinutes: number = preserveHour * 60 + preserveMinutes;
    const workStartMinutes: number = WORK_START_HOUR * 60;
    const workEndMinutes: number = WORK_END_HOUR * 60;
    const lunchStartMinutes: number = LUNCH_START_HOUR * 60;
    const lunchEndMinutes: number = LUNCH_END_HOUR * 60;
    
    // If preserved time is in working hours, use it
    if (timeInMinutes >= workStartMinutes && timeInMinutes < workEndMinutes &&
        !(timeInMinutes >= lunchStartMinutes && timeInMinutes < lunchEndMinutes)) {
      targetHour = preserveHour;
      targetMinutes = preserveMinutes;
    } else if (timeInMinutes >= workEndMinutes) {
      // If after 5:00 PM, use 5:00 PM
      targetHour = WORK_END_HOUR;
      targetMinutes = 0;
    } else if (timeInMinutes >= lunchStartMinutes && timeInMinutes < lunchEndMinutes) {
      // If in lunch break, use 12:00 PM
      targetHour = LUNCH_START_HOUR;
      targetMinutes = 0;
    }
  }
  
  while (remainingDays > 0) {
    // Advance one day
    currentDate = addDays(currentDate, 1);
    // Adjust to target time in Colombia timezone
    currentDate = setColombiaTime(currentDate, targetHour, targetMinutes);
    
    // If it's a working day, count this day
    const isWorkingDayDate: boolean = await isWorkingDay(currentDate);
    if (isWorkingDayDate) {
      remainingDays--;
    }
    // If not a working day, continue searching (we already advanced the day)
  }
  
  return currentDate;
}

/**
 * Adds working hours to a date
 * @param date - Initial date in Colombia timezone (must be in working hours)
 * @param hours - Number of working hours to add
 * @returns Promise<Date> Resulting date after adding working hours
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
    
    // If we're in lunch break, skip it first
    if (timeInMinutes >= lunchStartMinutes && timeInMinutes < lunchEndMinutes) {
      currentDate = setColombiaTime(currentDate, LUNCH_END_HOUR, 0);
      continue; // Restart loop from after lunch
    }
    
    // Calculate minutes until next limit (lunch or end of day)
    let minutesUntilLimit: number;
    
    if (timeInMinutes < lunchStartMinutes) {
      // Before lunch: calculate until lunch or end of day, whichever comes first
      const minutesUntilLunch: number = lunchStartMinutes - timeInMinutes;
      const minutesUntilEnd: number = workEndMinutes - timeInMinutes;
      minutesUntilLimit = Math.min(minutesUntilLunch, minutesUntilEnd);
      
      // If remaining hours fit in current day
      const hoursToAdd: number = Math.min(remainingHours, minutesUntilLimit / 60);
      
      if (hoursToAdd > 0) {
        currentDate = addColombiaHours(currentDate, hoursToAdd);
        remainingHours -= hoursToAdd;
        
        // Check if we reached lunch break after adding hours
        const newTimeInMinutes: number = getColombiaHour(currentDate) * 60 + getColombiaMinutes(currentDate);
        if (newTimeInMinutes >= lunchStartMinutes && newTimeInMinutes < lunchEndMinutes && remainingHours > 0) {
          // If we reached lunch break and still have hours to add, skip it
          currentDate = setColombiaTime(currentDate, LUNCH_END_HOUR, 0);
          continue; // Restart loop from after lunch
        }
      }
    } else if (timeInMinutes >= lunchEndMinutes && timeInMinutes < workEndMinutes) {
      // After lunch: calculate until end of day
      minutesUntilLimit = workEndMinutes - timeInMinutes;
      
      // If remaining hours fit in current day
      const hoursToAdd: number = Math.min(remainingHours, minutesUntilLimit / 60);
      
      if (hoursToAdd > 0) {
        currentDate = addColombiaHours(currentDate, hoursToAdd);
        remainingHours -= hoursToAdd;
      }
    } else {
      // After end of working day: no minutes available in this day
      minutesUntilLimit = 0;
    }
    
    // If hours still remain, advance to next working day
    if (remainingHours > 0) {
      currentDate = await advanceToNextWorkingDay(currentDate);
    }
  }
  
  return currentDate;
}

/**
 * Advances to next working day at 8:00 AM
 * @param date - Current date
 * @returns Promise<Date> Next working day at 8:00 AM
 */
async function advanceToNextWorkingDay(date: Date): Promise<Date> {
  let nextDate: Date = addDays(date, 1);
  nextDate = setColombiaTime(nextDate, WORK_START_HOUR, 0);
  
  // Find next working day
  while (!(await isWorkingDay(nextDate))) {
    nextDate = addDays(nextDate, 1);
    nextDate = setColombiaTime(nextDate, WORK_START_HOUR, 0);
  }
  
  return nextDate;
}

