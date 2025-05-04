/**
 * Validation functions for date schema
 */
import type { DateParseResult } from '../common/index.js';
import { DateErrorCode, DateErrorMessages, formatMessage } from '../error.js';

/**
 * Validate that a value is a date
 * @param value - The value to validate
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result with the original input value preserved in error cases.
 *          If the value is a string in YYYY-MM-DD format, it will be parsed into a Date.
 *          Note: The type assertion (value as unknown as Date) does not perform any transformation
 *          at runtime; it only informs TypeScript about the expected type.
 * @remarks
 * IMPORTANT: This validator only accepts string dates in the 'YYYY-MM-DD' format (e.g., '2023-01-31').
 * Other date formats like 'MM/DD/YYYY', 'DD-MM-YYYY', or ISO date strings with time components
 * are not supported and will result in validation errors.
 */
export const validateType = (
  value: unknown,
  customErrorMessage?: string,
): DateParseResult => {
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
    const defaultMessage = `${DateErrorMessages[DateErrorCode.TYPE]}, got ${typeof value}. Expected a Date object or a string in 'YYYY-MM-DD' format`;
    return {
      success: false,
      // Original value preserved without coercion
      value: value as unknown as Date,
      error: {
        code: DateErrorCode.TYPE,
        message: customErrorMessage ?? defaultMessage,
      },
    };
  }

  // Check if the value is a Date object
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    const defaultMessage = `${DateErrorMessages[DateErrorCode.TYPE]}, got ${typeof value}. Expected a Date object or a string in 'YYYY-MM-DD' format`;
    return {
      success: false,
      value: value as Date, // Preserve original value with type assertion
      error: {
        code: DateErrorCode.TYPE,
        message: customErrorMessage ?? defaultMessage,
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate minimum date constraint (inclusive, >=)
 * @param value - The date to validate
 * @param minDate - The minimum allowed date
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateMin = (
  value: Date,
  minDate?: Date,
  customErrorMessage?: string,
): DateParseResult => {
  if (minDate !== undefined && value < minDate) {
    return {
      success: false,
      value,
      error: {
        code: DateErrorCode.MIN,
        message:
          customErrorMessage ??
          formatMessage(
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
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateMax = (
  value: Date,
  maxDate?: Date,
  customErrorMessage?: string,
): DateParseResult => {
  if (maxDate !== undefined && value > maxDate) {
    return {
      success: false,
      value,
      error: {
        code: DateErrorCode.MAX,
        message:
          customErrorMessage ??
          formatMessage(
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
 * @param customErrorMessage - Optional custom error message
 * @returns The validations result
 */
export const validatePast = (
  value: Date,
  isPast?: boolean,
  customErrorMessage?: string,
): DateParseResult => {
  if (isPast) {
    const now = new Date();
    if (value >= now) {
      return {
        success: false,
        value,
        error: {
          code: DateErrorCode.PAST,
          message: customErrorMessage ?? DateErrorMessages[DateErrorCode.PAST],
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
 * @param customErrorMessage - Optional custom error message
 * @returns The validations result
 */
export const validateFuture = (
  value: Date,
  isFuture?: boolean,
  customErrorMessage?: string,
): DateParseResult => {
  if (isFuture) {
    const now = new Date();
    if (value <= now) {
      return {
        success: false,
        value,
        error: {
          code: DateErrorCode.FUTURE,
          message:
            customErrorMessage ?? DateErrorMessages[DateErrorCode.FUTURE],
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
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateBetween = (
  value: Date,
  betweenDates?: [Date, Date],
  customErrorMessage?: string,
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
          message:
            customErrorMessage ??
            formatMessage(
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
          message:
            customErrorMessage ??
            formatMessage(
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
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateToday = (
  value: Date,
  isToday?: boolean,
  customErrorMessage?: string,
): DateParseResult => {
  if (isToday) {
    const now = new Date();
    if (!isSameDay(value, now)) {
      return {
        success: false,
        value,
        error: {
          code: DateErrorCode.TODAY,
          message: customErrorMessage ?? DateErrorMessages[DateErrorCode.TODAY],
        },
      };
    }
  }
  return { success: true, value };
};
