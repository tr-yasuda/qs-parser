/**
 * Validation functions for date schema
 */
import type { DateParseResult } from '../common.js';
import { DateErrorCode, DateErrorMessages, formatMessage } from '../error.js';

/**
 * Validate that a value is a date
 * @param value - The value to validate
 * @returns The validation result with the original input value preserved in error cases.
 *          If the value is a string in YYYY-MM-DD format, it will be parsed into a Date.
 *          Note: The type assertion (value as unknown as Date) does not perform any transformation
 *          at runtime; it only informs TypeScript about the expected type.
 */
export const validateType = (value: unknown): DateParseResult => {
  // If the value is a string, try to parse it as a Date
  if (typeof value === 'string') {
    // Check if the string is in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(value)) {
      // Extract the year, month, and day from the string
      const [yearStr, monthStr, dayStr] = value.split('-');
      const year = Number.parseInt(yearStr, 10);
      const month = Number.parseInt(monthStr, 10) - 1; // JavaScript months are 0-based
      const day = Number.parseInt(dayStr, 10);

      // Create a new Date object
      const parsedDate = new Date(year, month, day);

      // Check if the date is valid by comparing the original components with the parsed ones
      // If JavaScript adjusted the date (e.g., April 31 -> May 1), the components won't match
      if (
        !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.getFullYear() === year &&
        parsedDate.getMonth() === month &&
        parsedDate.getDate() === day
      ) {
        return { success: true, value: parsedDate };
      }
    }

    // If it's not a valid date string, return an error
    return {
      success: false,
      // Original value preserved without coercion
      value: value as unknown as Date,
      error: {
        code: DateErrorCode.TYPE,
        message: `${DateErrorMessages[DateErrorCode.TYPE]}, got ${typeof value}`,
      },
    };
  }

  // Check if the value is a Date object
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return {
      success: false,
      value: value as Date, // Original value preserved without coercion
      error: {
        code: DateErrorCode.TYPE,
        message: `${DateErrorMessages[DateErrorCode.TYPE]}, got ${typeof value}`,
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate minimum date constraint (inclusive, >=)
 * @param value - The date to validate
 * @param minDate - The minimum allowed date
 * @returns The validation result
 */
export const validateMin = (value: Date, minDate?: Date): DateParseResult => {
  if (minDate !== undefined && value < minDate) {
    return {
      success: false,
      value,
      error: {
        code: DateErrorCode.MIN,
        message: formatMessage(
          DateErrorMessages[DateErrorCode.MIN],
          minDate.toISOString(),
        ),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate maximum date constraint (inclusive, <=)
 * @param value - The date to validate
 * @param maxDate - The maximum allowed date
 * @returns The validation result
 */
export const validateMax = (value: Date, maxDate?: Date): DateParseResult => {
  if (maxDate !== undefined && value > maxDate) {
    return {
      success: false,
      value,
      error: {
        code: DateErrorCode.MAX,
        message: formatMessage(
          DateErrorMessages[DateErrorCode.MAX],
          maxDate.toISOString(),
        ),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate past date constraint (< now)
 * @param value - The date to validate
 * @param isPast - Whether to validate as past date
 * @returns The validations result
 */
export const validatePast = (
  value: Date,
  isPast?: boolean,
): DateParseResult => {
  if (isPast) {
    const now = new Date();
    if (value >= now) {
      return {
        success: false,
        value,
        error: {
          code: DateErrorCode.PAST,
          message: DateErrorMessages[DateErrorCode.PAST],
        },
      };
    }
  }
  return { success: true, value };
};

/**
 * Validate future date constraint (> now)
 * @param value - The date to validate
 * @param isFuture - Whether to validate as future date
 * @returns The validations result
 */
export const validateFuture = (
  value: Date,
  isFuture?: boolean,
): DateParseResult => {
  if (isFuture) {
    const now = new Date();
    if (value <= now) {
      return {
        success: false,
        value,
        error: {
          code: DateErrorCode.FUTURE,
          message: DateErrorMessages[DateErrorCode.FUTURE],
        },
      };
    }
  }
  return { success: true, value };
};

/**
 * Validate between dates constraint (inclusive)
 * @param value - The date to validate
 * @param betweenDates - The minimum and maximum allowed dates
 * @returns The validation result
 */
export const validateBetween = (
  value: Date,
  betweenDates?: [Date, Date],
): DateParseResult => {
  if (betweenDates !== undefined) {
    const [min, max] = betweenDates;

    // Check if the value is less than min
    const minResult = validateMin(value, min);
    if (!minResult.success) {
      return {
        success: false,
        value,
        error: {
          code: DateErrorCode.BETWEEN,
          message: formatMessage(
            DateErrorMessages[DateErrorCode.BETWEEN],
            min.toISOString(),
            max.toISOString(),
          ),
        },
      };
    }

    // Check if the value is greater than max
    const maxResult = validateMax(value, max);
    if (!maxResult.success) {
      return {
        success: false,
        value,
        error: {
          code: DateErrorCode.BETWEEN,
          message: formatMessage(
            DateErrorMessages[DateErrorCode.BETWEEN],
            min.toISOString(),
            max.toISOString(),
          ),
        },
      };
    }
  }
  return { success: true, value };
};

/**
 * Extract the date part (year, month, day) from a Date object
 * @param date - The date to extract from
 * @returns A new Date object with only the year, month, and day components
 */
const extractDatePart = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * Check if two dates are the same day
 * @param date1 - The first date
 * @param date2 - The second date
 * @returns True if the dates are the same day, false otherwise
 */
const isSameDay = (date1: Date, date2: Date): boolean => {
  const day1 = extractDatePart(date1);
  const day2 = extractDatePart(date2);
  return day1.getTime() === day2.getTime();
};

/**
 * Validate today constraint (same day as now)
 * @param value - The date to validate
 * @param isToday - Whether to validate as today
 * @returns The validation result
 */
export const validateToday = (
  value: Date,
  isToday?: boolean,
): DateParseResult => {
  if (isToday) {
    const now = new Date();
    if (!isSameDay(value, now)) {
      return {
        success: false,
        value,
        error: {
          code: DateErrorCode.TODAY,
          message: DateErrorMessages[DateErrorCode.TODAY],
        },
      };
    }
  }
  return { success: true, value };
};
