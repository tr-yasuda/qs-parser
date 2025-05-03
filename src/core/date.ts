/**
 * Date schema implementation for qs-parser
 * Provides methods for creating and validating date schemas
 */
import type { DateParseResult } from './common.js';
import { DateErrorCode, DateErrorMessages, formatMessage } from './error.js';

/**
 * Constraints for date validation
 */
type DateConstraints = {
  minDate?: Date;
  maxDate?: Date;
  isPast?: boolean;
  isFuture?: boolean;
  betweenDates?: [Date, Date];
  isToday?: boolean;
};

/**
 * Date schema type
 * Defines the interface for date validation schemas
 */
export type DateSchema = {
  /**
   * Parse and validate a value as a date
   * @param value - The value to validate
   * @returns A parse result containing:
   *   - success: true if validation passed, false otherwise
   *   - value: the original input value (preserved without coercion in error cases)
   *   - error: validation error details if success is false
   */
  parse: (value: unknown) => DateParseResult;

  /**
   * Set a minimum date constraint (inclusive, >=)
   * @param date - The minimum allowed date
   * @returns A new date schema with the constraint
   */
  min: (date: Date) => DateSchema;

  /**
   * Set a maximum date constraint (inclusive, <=)
   * @param date - The maximum allowed date
   * @returns A new date schema with the constraint
   */
  max: (date: Date) => DateSchema;

  /**
   * Set a past date constraint (< now)
   * @returns A new date schema with the constraint
   */
  past: () => DateSchema;

  /**
   * Set a future date constraint (> now)
   * @returns A new date schema with the constraint
   */
  future: () => DateSchema;

  /**
   * Set a between dates constraint (inclusive)
   * @param min - The minimum allowed date
   * @param max - The maximum allowed date
   * @returns A new date schema with the constraint
   */
  between: (min: Date, max: Date) => DateSchema;

  /**
   * Set a today constraint (same day as now)
   * @returns A new date schema with the constraint
   */
  today: () => DateSchema;
};

/**
 * Validation functions for date constraints
 */

/**
 * Validate that a value is a date
 * @param value - The value to validate
 * @returns The validation result with the original input value preserved in error cases.
 *          Note: The type assertion (value as Date) does not perform any transformation
 *          at runtime; it only informs TypeScript about the expected type.
 */
const validateType = (value: unknown): DateParseResult => {
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
const validateMin = (value: Date, minDate?: Date): DateParseResult => {
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
const validateMax = (value: Date, maxDate?: Date): DateParseResult => {
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
const validatePast = (value: Date, isPast?: boolean): DateParseResult => {
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
const validateFuture = (value: Date, isFuture?: boolean): DateParseResult => {
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
const validateBetween = (
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
const validateToday = (value: Date, isToday?: boolean): DateParseResult => {
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

/**
 * Create a date schema
 * @returns A new date schema
 */
const date = (): DateSchema => {
  // Store constraints
  const constraints: DateConstraints = {};

  // Create the schema object
  const schema: DateSchema = {
    parse: (value: unknown): DateParseResult => {
      // First, validate that the value is a date
      const typeResult = validateType(value);
      if (!typeResult.success) {
        return typeResult;
      }

      // Now we know the value is a date
      const dateValue = typeResult.value;

      // Validate each constraint
      const validations = [
        validateMin(dateValue, constraints.minDate),
        validateMax(dateValue, constraints.maxDate),
        validatePast(dateValue, constraints.isPast),
        validateFuture(dateValue, constraints.isFuture),
        validateBetween(dateValue, constraints.betweenDates),
        validateToday(dateValue, constraints.isToday),
      ];

      // Return the first validation failure, if any
      for (const validation of validations) {
        if (!validation.success) {
          return validation;
        }
      }

      // All constraints passed
      return {
        success: true,
        value: dateValue,
      };
    },

    min: (date: Date): DateSchema => {
      // Create a new schema with the min date constraint
      const newConstraints = { ...constraints, minDate: date };
      return createSchemaWithConstraints(newConstraints);
    },

    max: (date: Date): DateSchema => {
      // Create a new schema with the max date constraint
      const newConstraints = { ...constraints, maxDate: date };
      return createSchemaWithConstraints(newConstraints);
    },

    past: (): DateSchema => {
      // Create a new schema with the past constraint
      const newConstraints = { ...constraints, isPast: true };
      return createSchemaWithConstraints(newConstraints);
    },

    future: (): DateSchema => {
      // Create a new schema with the future constraint
      const newConstraints = { ...constraints, isFuture: true };
      return createSchemaWithConstraints(newConstraints);
    },

    between: (min: Date, max: Date): DateSchema => {
      // Create a new schema with the between constraint
      const newConstraints = {
        ...constraints,
        betweenDates: [min, max] as [Date, Date],
      };
      return createSchemaWithConstraints(newConstraints);
    },

    today: (): DateSchema => {
      // Create a new schema with the today constraint
      const newConstraints = { ...constraints, isToday: true };
      return createSchemaWithConstraints(newConstraints);
    },
  };

  // Helper function to create a new schema with updated constraints
  const createSchemaWithConstraints = (
    newConstraints: typeof constraints,
  ): DateSchema => {
    // Create a new schema object with the new constraints
    return {
      parse: (value: unknown): DateParseResult => {
        // First, validate that the value is a date
        const typeResult = validateType(value);
        if (!typeResult.success) {
          return typeResult;
        }

        // Now we know the value is a date
        const dateValue = typeResult.value;

        // Validate each constraint with the new constraints
        const validations = [
          validateMin(dateValue, newConstraints.minDate),
          validateMax(dateValue, newConstraints.maxDate),
          validatePast(dateValue, newConstraints.isPast),
          validateFuture(dateValue, newConstraints.isFuture),
          validateBetween(dateValue, newConstraints.betweenDates),
          validateToday(dateValue, newConstraints.isToday),
        ];

        // Return the first validation failure, if any
        for (const validation of validations) {
          if (!validation.success) {
            return validation;
          }
        }

        // All constraints passed
        return {
          success: true,
          value: dateValue,
        };
      },

      min: (date: Date): DateSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          minDate: date,
        });
      },

      max: (date: Date): DateSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          maxDate: date,
        });
      },

      past: (): DateSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isPast: true,
        });
      },

      future: (): DateSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isFuture: true,
        });
      },

      between: (min: Date, max: Date): DateSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          betweenDates: [min, max] as [Date, Date],
        });
      },

      today: (): DateSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isToday: true,
        });
      },
    };
  };

  return schema;
};

// Export the date schema creator
export default date;
