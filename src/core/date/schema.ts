/**
 * Date schema implementation for qs-parser
 */
import type { DateParseResult } from '../common/index.js';
import {
  defaultValue as makeDefault,
  nullable as makeNullable,
  optional as makeOptional,
} from '../common/schema.js';
import { createSchemaWithConstraints } from '../utils/schema.js';
import type {
  DateConstraints,
  DateSchema,
  DateSchemaOptions,
  ValidationOptions,
} from './types.js';
import * as validators from './validators.js';

/**
 * Create a date schema
 * @param options - Optional configuration options for the schema
 * @returns A new date schema
 * @remarks
 * IMPORTANT: When validating string inputs, only the 'YYYY-MM-DD' format (e.g., '2023-01-31') is supported.
 * Other date formats will result in validation errors.
 */
const date = (options?: DateSchemaOptions): DateSchema => {
  // Store constraints
  const constraints: DateConstraints = {
    customErrorMessage: options?.message,
  };

  // Helper function to create a new schema with updated constraints
  const createDateSchema = (newConstraints: typeof constraints): DateSchema => {
    // Create a new schema object with the new constraints
    return {
      optional: function () {
        return makeOptional(this);
      },

      nullable: function () {
        return makeNullable(this);
      },

      default: function (defaultValue: Date) {
        return makeDefault(this, defaultValue);
      },

      parse: (value: unknown): DateParseResult => {
        // First, validate that the value is a date
        const typeResult = validators.validateType(
          value,
          newConstraints.customErrorMessage,
        );
        if (!typeResult.success) {
          return typeResult;
        }

        // Now we know the value is a date
        const dateValue = typeResult.value;

        // Validate each constraint with the new constraints
        const validations = [
          validators.validateMin(
            dateValue,
            newConstraints.minDate,
            newConstraints.minErrorMessage,
          ),
          validators.validateMax(
            dateValue,
            newConstraints.maxDate,
            newConstraints.maxErrorMessage,
          ),
          validators.validatePast(
            dateValue,
            newConstraints.isPast,
            newConstraints.pastErrorMessage,
          ),
          validators.validateFuture(
            dateValue,
            newConstraints.isFuture,
            newConstraints.futureErrorMessage,
          ),
          validators.validateBetween(
            dateValue,
            newConstraints.betweenDates,
            newConstraints.betweenErrorMessage,
          ),
          validators.validateToday(
            dateValue,
            newConstraints.isToday,
            newConstraints.todayErrorMessage,
          ),
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

      min: (date: Date, options?: ValidationOptions): DateSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            minDate: date,
            minErrorMessage: options?.message,
          },
          createDateSchema,
        );
      },

      max: (date: Date, options?: ValidationOptions): DateSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            maxDate: date,
            maxErrorMessage: options?.message,
          },
          createDateSchema,
        );
      },

      past: (options?: ValidationOptions): DateSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isPast: true,
            pastErrorMessage: options?.message,
          },
          createDateSchema,
        );
      },

      future: (options?: ValidationOptions): DateSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isFuture: true,
            futureErrorMessage: options?.message,
          },
          createDateSchema,
        );
      },

      between: (
        min: Date,
        max: Date,
        options?: ValidationOptions,
      ): DateSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            betweenDates: [min, max] as [Date, Date],
            betweenErrorMessage: options?.message,
          },
          createDateSchema,
        );
      },

      today: (options?: ValidationOptions): DateSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isToday: true,
            todayErrorMessage: options?.message,
          },
          createDateSchema,
        );
      },
    };
  };

  // Create the schema object with the common methods
  return createDateSchema(constraints);
};

export default date;
