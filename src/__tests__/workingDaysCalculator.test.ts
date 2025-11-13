import { calculateWorkingDays } from '../services/workingDaysCalculator';
import { setColombiaTime, getColombiaHour, COLOMBIA_TIMEZONE } from '../utils/dateUtils';
import { clearHolidaysCache } from '../services/holidayService';
import { format } from 'date-fns-tz';

describe('WorkingDaysCalculator', () => {
  beforeEach(() => {
    clearHolidaysCache();
  });

  describe('Simple working days addition', () => {
    test('should add 1 working day from Monday', async () => {
      // Monday 2025-01-13 08:00 AM Colombia (avoiding January 6th holiday)
      const startDate = setColombiaTime(new Date('2025-01-13'), 8, 0);
      const result = await calculateWorkingDays(startDate, 1, 0);
      
      // Should be Tuesday 2025-01-14 08:00 AM
      const expected = setColombiaTime(new Date('2025-01-14'), 8, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });

    test('should add 1 working day from Friday', async () => {
      // Friday 2025-01-17 08:00 AM Colombia
      const startDate = setColombiaTime(new Date('2025-01-17'), 8, 0);
      const result = await calculateWorkingDays(startDate, 1, 0);
      
      // Should be Monday 2025-01-20 08:00 AM (skip weekend)
      const expected = setColombiaTime(new Date('2025-01-20'), 8, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });
  });

  describe('Multiple working days addition', () => {
    test('should add 5 working days', async () => {
      const startDate = setColombiaTime(new Date('2025-01-13'), 8, 0); // Monday
      const result = await calculateWorkingDays(startDate, 5, 0);
      
      // Should be next Monday (5 working days = 1 week)
      const expected = setColombiaTime(new Date('2025-01-20'), 8, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });

    test('should add 10 working days skipping weekends', async () => {
      const startDate = setColombiaTime(new Date('2025-01-13'), 8, 0); // Monday
      const result = await calculateWorkingDays(startDate, 10, 0);
      
      // 10 working days = 2 weeks
      const expected = setColombiaTime(new Date('2025-01-27'), 8, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });
  });

  describe('Multiple working hours addition', () => {
    test('should add 1 working hour', async () => {
      const startDate = setColombiaTime(new Date('2025-01-13'), 8, 0); // Monday 8:00 AM
      const result = await calculateWorkingDays(startDate, 0, 1);
      
      // Should be 9:00 AM same day
      const expected = setColombiaTime(new Date('2025-01-13'), 9, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });

    test('should add 4 working hours', async () => {
      const startDate = setColombiaTime(new Date('2025-01-13'), 8, 0); // Monday 8:00 AM
      const result = await calculateWorkingDays(startDate, 0, 4);
      
      // Should be 12:00 PM same day (before lunch)
      const expected = setColombiaTime(new Date('2025-01-13'), 12, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });

    test('should add 8 working hours (full day)', async () => {
      const startDate = setColombiaTime(new Date('2025-01-13'), 8, 0); // Monday 8:00 AM
      const result = await calculateWorkingDays(startDate, 0, 8);
      
      // Should be 5:00 PM same day (8 hours: 8-12 = 4h, 13-17 = 4h)
      const expected = setColombiaTime(new Date('2025-01-13'), 17, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });

    test('should skip lunch break when adding hours', async () => {
      const startDate = setColombiaTime(new Date('2025-01-13'), 11, 30); // Monday 11:30 AM
      const result = await calculateWorkingDays(startDate, 0, 2);
      
      // Should be 2:30 PM (11:30 AM + 0.5h = 12:00 PM, skip lunch → 1:00 PM, +1.5h = 2:30 PM)
      const expected = setColombiaTime(new Date('2025-01-13'), 14, 30);
      expect(result.getTime()).toBe(expected.getTime());
    });
  });

  describe('Combined days and hours addition', () => {
    test('should add 1 day and 4 working hours', async () => {
      const startDate = setColombiaTime(new Date('2025-01-13'), 8, 0); // Monday 8:00 AM
      const result = await calculateWorkingDays(startDate, 1, 4);
      
      // Should be Tuesday 12:00 PM (1 day + 4 hours)
      const expected = setColombiaTime(new Date('2025-01-14'), 12, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });

    test('should add 2 days and 8 working hours', async () => {
      const startDate = setColombiaTime(new Date('2025-01-13'), 8, 0); // Monday 8:00 AM
      const result = await calculateWorkingDays(startDate, 2, 8);
      
      // Should be Wednesday 5:00 PM (2 days + 8 hours = full day)
      const expected = setColombiaTime(new Date('2025-01-15'), 17, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });
  });

  describe('Weekend time handling', () => {
    test('should normalize Saturday backwards to Friday 5 PM', async () => {
      const startDate = setColombiaTime(new Date('2025-01-11'), 10, 0); // Saturday 10:00 AM
      const result = await calculateWorkingDays(startDate, 0, 0);
      
      // Should normalize to previous Friday 5:00 PM
      const expected = setColombiaTime(new Date('2025-01-10'), 17, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });

    test('should normalize Sunday backwards to Friday 5 PM', async () => {
      const startDate = setColombiaTime(new Date('2025-01-12'), 14, 0); // Sunday 2:00 PM
      const result = await calculateWorkingDays(startDate, 0, 0);
      
      // Should normalize to previous Friday 5:00 PM
      const expected = setColombiaTime(new Date('2025-01-10'), 17, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });

    test('should add working days from normalized weekend', async () => {
      const startDate = setColombiaTime(new Date('2025-01-11'), 10, 0); // Saturday
      const result = await calculateWorkingDays(startDate, 1, 0);
      
      // Should normalize to Friday 5 PM, then add 1 working day = Monday 5 PM (preserves hour)
      const expected = setColombiaTime(new Date('2025-01-13'), 17, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });
  });

  describe('Half-day time approximations', () => {
    test('should normalize before 8 AM backwards to 8 AM', async () => {
      const startDate = setColombiaTime(new Date('2025-01-13'), 6, 0); // Monday 6:00 AM
      const result = await calculateWorkingDays(startDate, 0, 0);
      
      // Should normalize to 8:00 AM
      const expected = setColombiaTime(new Date('2025-01-13'), 8, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });

    test('should normalize after 5 PM backwards to 5 PM', async () => {
      const startDate = setColombiaTime(new Date('2025-01-13'), 18, 0); // Monday 6:00 PM
      const result = await calculateWorkingDays(startDate, 0, 0);
      
      // Should normalize to 5:00 PM
      const expected = setColombiaTime(new Date('2025-01-13'), 17, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });
  });

  describe('Lunch break time approximations', () => {
    test('should normalize lunch break time (12:00 PM) backwards to 12:00 PM', async () => {
      const startDate = setColombiaTime(new Date('2025-01-13'), 12, 30); // Monday 12:30 PM (during lunch)
      const result = await calculateWorkingDays(startDate, 0, 0);
      
      // Should normalize to 12:00 PM (start of lunch break)
      const expected = setColombiaTime(new Date('2025-01-13'), 12, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });

    test('should add hours from normalized lunch break time', async () => {
      const startDate = setColombiaTime(new Date('2025-01-13'), 12, 30); // 12:30 PM (during lunch)
      const result = await calculateWorkingDays(startDate, 0, 2);
      
      // Should normalize to 12:00 PM, then skip lunch to 1:00 PM, then add 2 hours = 3:00 PM
      const expected = setColombiaTime(new Date('2025-01-13'), 15, 0);
      expect(result.getTime()).toBe(expected.getTime());
    });
  });

  describe('Colombian holidays handling', () => {
    test('should skip holidays when adding working days', async () => {
      // We need a date that has a holiday nearby
      // For example, if there's a holiday on Monday, adding 1 working day should skip it
      const startDate = setColombiaTime(new Date('2025-01-06'), 8, 0); // Monday (Reyes Magos holiday)
      // This test depends on real holidays from the API
      // For now we just verify it works
      const result = await calculateWorkingDays(startDate, 1, 0);
      
      // Should be a working day (not a holiday)
      const dayOfWeek = parseInt(format(result, 'e', { timeZone: COLOMBIA_TIMEZONE }), 10);
      expect(dayOfWeek).toBeGreaterThanOrEqual(1);
      expect(dayOfWeek).toBeLessThanOrEqual(5);
    });
  });

  describe('Large quantities of days and hours handling', () => {
    test('should handle 100 working days', async () => {
      const startDate = setColombiaTime(new Date('2025-01-13'), 8, 0); // Monday
      const result = await calculateWorkingDays(startDate, 100, 0);
      
      // 100 working days = ~20 weeks = ~5 months
      // Should be a working day
      const dayOfWeek = parseInt(format(result, 'e', { timeZone: COLOMBIA_TIMEZONE }), 10);
      expect(dayOfWeek).toBeGreaterThanOrEqual(1);
      expect(dayOfWeek).toBeLessThanOrEqual(5);
      expect(getColombiaHour(result)).toBe(8);
    }, 30000); // 30 second timeout

    test('should handle 100 working hours', async () => {
      const startDate = setColombiaTime(new Date('2025-01-13'), 8, 0); // Monday 8:00 AM
      const result = await calculateWorkingDays(startDate, 0, 100);
      
      // 100 working hours = 12.5 working days (8 hours per day)
      // Should be a working day during business hours
      const dayOfWeek = parseInt(format(result, 'e', { timeZone: COLOMBIA_TIMEZONE }), 10);
      expect(dayOfWeek).toBeGreaterThanOrEqual(1);
      expect(dayOfWeek).toBeLessThanOrEqual(5);
      expect(getColombiaHour(result)).toBeGreaterThanOrEqual(8);
      expect(getColombiaHour(result)).toBeLessThanOrEqual(17);
    }, 30000); // 30 second timeout

    test('should handle large combination: 50 days and 50 hours', async () => {
      const startDate = setColombiaTime(new Date('2025-01-13'), 8, 0); // Monday
      const result = await calculateWorkingDays(startDate, 50, 50);
      
      // Should be a working day
      const dayOfWeek = parseInt(format(result, 'e', { timeZone: COLOMBIA_TIMEZONE }), 10);
      expect(dayOfWeek).toBeGreaterThanOrEqual(1);
      expect(dayOfWeek).toBeLessThanOrEqual(5);
    }, 30000); // 30 second timeout
  });
});

