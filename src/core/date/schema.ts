/**
 * Date schema implementation for qs-parser
 */
import type { DateParseResult } from '../common.js';
import { createSchemaWithConstraints } from '../utils/schema.js';
import type { DateConstraints, DateSchema } from './types.js';
import * as validators from './validators.js';

/**
 * Create a date schema
 * @returns A new date schema
 * @remarks
 * IMPORTANT: When validating string inputs, only the 'YYYY-MM-DD' format (e.g., '2023-01-31') is supported.
 * Other date formats will result in validation errors.
 */
const date = (): DateSchema => {
  // Store constraints
  const constraints: DateConstraints = {};

  // Helper function to create a new schema with updated constraints
  const createDateSchema = (newConstraints: typeof constraints): DateSchema => {
    // Create a new schema object with the new constraints
    return {
      parse: (value: unknown): DateParseResult => {
        // First, validate that the value is a date
        const typeResult = validators.validateType(value);
        if (!typeResult.success) {
          return typeResult;
        }

        // Now we know the value is a date
        const dateValue = typeResult.value;

        // Validate each constraint with the new constraints
        const validations = [
          validators.validateMin(dateValue, newConstraints.minDate),
          validators.validateMax(dateValue, newConstraints.maxDate),
          validators.validatePast(dateValue, newConstraints.isPast),
          validators.validateFuture(dateValue, newConstraints.isFuture),
          validators.validateBetween(dateValue, newConstraints.betweenDates),
          validators.validateToday(dateValue, newConstraints.isToday),
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
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            minDate: date,
          },
          createDateSchema,
        );
      },

      max: (date: Date): DateSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            maxDate: date,
          },
          createDateSchema,
        );
      },

      past: (): DateSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isPast: true,
          },
          createDateSchema,
        );
      },

      future: (): DateSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isFuture: true,
          },
          createDateSchema,
        );
      },

      between: (min: Date, max: Date): DateSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            betweenDates: [min, max] as [Date, Date],
          },
          createDateSchema,
        );
      },

      today: (): DateSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isToday: true,
          },
          createDateSchema,
        );
      },
    };
  };

  // Create the schema object
  return {
    parse: (value: unknown): DateParseResult => {
      // First, validate that the value is a date
      const typeResult = validators.validateType(value);
      if (!typeResult.success) {
        return typeResult;
      }

      // Now we know the value is a date
      const dateValue = typeResult.value;

      // Validate each constraint
      const validations = [
        validators.validateMin(dateValue, constraints.minDate),
        validators.validateMax(dateValue, constraints.maxDate),
        validators.validatePast(dateValue, constraints.isPast),
        validators.validateFuture(dateValue, constraints.isFuture),
        validators.validateBetween(dateValue, constraints.betweenDates),
        validators.validateToday(dateValue, constraints.isToday),
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
      return createSchemaWithConstraints(newConstraints, createDateSchema);
    },

    max: (date: Date): DateSchema => {
      // Create a new schema with the max date constraint
      const newConstraints = { ...constraints, maxDate: date };
      return createSchemaWithConstraints(newConstraints, createDateSchema);
    },

    past: (): DateSchema => {
      // Create a new schema with the past constraint
      const newConstraints = { ...constraints, isPast: true };
      return createSchemaWithConstraints(newConstraints, createDateSchema);
    },

    future: (): DateSchema => {
      // Create a new schema with the future constraint
      const newConstraints = { ...constraints, isFuture: true };
      return createSchemaWithConstraints(newConstraints, createDateSchema);
    },

    between: (min: Date, max: Date): DateSchema => {
      // Create a new schema with the between constraint
      const newConstraints = {
        ...constraints,
        betweenDates: [min, max] as [Date, Date],
      };
      return createSchemaWithConstraints(newConstraints, createDateSchema);
    },

    today: (): DateSchema => {
      // Create a new schema with the today constraint
      const newConstraints = { ...constraints, isToday: true };
      return createSchemaWithConstraints(newConstraints, createDateSchema);
    },
  };
};

export default date;
