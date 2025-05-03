/**
 * Validation functions for date schema
 */
import type { DateParseResult } from '../common.js';
import { DateErrorCode, DateErrorMessages, formatMessage } from '../error.js';

/**
 * Validate that a value is a date
 * @param value - The value to validate
 * @returns The validation result with the original input value preserved in error cases.
 *          Note: The type assertion (value as Date) does not perform any transformation
 *          at runtime; it only informs TypeScript about the expected type.
 */
export const validateType = (value: unknown): DateParseResult => {
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
 * @returns The validation result
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
 * @returns The validation result
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
    if (value < min || value > max) {
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
    const valueDay = new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
    );
    const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (valueDay.getTime() !== nowDay.getTime()) {
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
