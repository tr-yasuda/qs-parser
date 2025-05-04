/**
 * Number schema implementation for qs-parser
 */
import type { NumberParseResult } from '../common/index.js';
import {
  defaultValue as makeDefault,
  nullable as makeNullable,
  optional as makeOptional,
} from '../common/schema.js';
import { createSchemaWithConstraints } from '../utils/schema.js';
import type {
  NumberConstraints,
  NumberSchema,
  NumberSchemaOptions,
  ValidationOptions,
} from './types.js';
import * as validators from './validators.js';

/**
 * Create a number schema
 * @param options - Optional configuration options for the schema
 * @returns A new number schema
 */
const number = (options?: NumberSchemaOptions): NumberSchema => {
  // Store constraints
  const constraints: NumberConstraints = {
    customErrorMessage: options?.message,
  };

  // Helper function to create a new schema with updated constraints
  const createNumberSchema = (
    newConstraints: typeof constraints,
  ): NumberSchema => {
    // Create a new schema object with the new constraints
    return {
      optional: function () {
        return makeOptional(this);
      },

      nullable: function () {
        return makeNullable(this);
      },

      default: function (defaultValue: number) {
        return makeDefault(this, defaultValue);
      },

      parse: (value: unknown): NumberParseResult => {
        // First, validate that the value is a number
        const typeResult = validators.validateType(
          value,
          newConstraints.customErrorMessage,
        );
        if (!typeResult.success) {
          return typeResult;
        }

        // Now we know the value is a number
        const numberValue = typeResult.value;

        // Validate each constraint with the new constraints
        const validations = [
          validators.validateMin(
            numberValue,
            newConstraints.min,
            newConstraints.minErrorMessage,
          ),
          validators.validateGt(
            numberValue,
            newConstraints.gt,
            newConstraints.gtErrorMessage,
          ),
          validators.validateMax(
            numberValue,
            newConstraints.max,
            newConstraints.maxErrorMessage,
          ),
          validators.validateLt(
            numberValue,
            newConstraints.lt,
            newConstraints.ltErrorMessage,
          ),
          validators.validateInt(
            numberValue,
            newConstraints.isInt,
            newConstraints.intErrorMessage,
          ),
          validators.validatePositive(
            numberValue,
            newConstraints.isPositive,
            newConstraints.positiveErrorMessage,
          ),
          validators.validateNonNegative(
            numberValue,
            newConstraints.isNonNegative,
            newConstraints.nonNegativeErrorMessage,
          ),
          validators.validateNegative(
            numberValue,
            newConstraints.isNegative,
            newConstraints.negativeErrorMessage,
          ),
          validators.validateNonPositive(
            numberValue,
            newConstraints.isNonPositive,
            newConstraints.nonPositiveErrorMessage,
          ),
          validators.validateMultipleOf(
            numberValue,
            newConstraints.multipleOf,
            newConstraints.multipleOfErrorMessage,
          ),
          validators.validateFinite(
            numberValue,
            newConstraints.isFinite,
            newConstraints.finiteErrorMessage,
          ),
          validators.validateSafe(
            numberValue,
            newConstraints.isSafe,
            newConstraints.safeErrorMessage,
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
          value: numberValue,
        };
      },

      min: (value: number, options?: ValidationOptions): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            min: value,
            minErrorMessage: options?.message,
          },
          createNumberSchema,
        );
      },

      gte: (value: number, options?: ValidationOptions): NumberSchema => {
        // Alias for min
        return createSchemaWithConstraints(
          newConstraints,
          createNumberSchema,
        ).min(value, options);
      },

      gt: (value: number, options?: ValidationOptions): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            gt: value,
            gtErrorMessage: options?.message,
          },
          createNumberSchema,
        );
      },

      max: (value: number, options?: ValidationOptions): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            max: value,
            maxErrorMessage: options?.message,
          },
          createNumberSchema,
        );
      },

      lte: (value: number, options?: ValidationOptions): NumberSchema => {
        // Alias for max
        return createSchemaWithConstraints(
          newConstraints,
          createNumberSchema,
        ).max(value, options);
      },

      lt: (value: number, options?: ValidationOptions): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            lt: value,
            ltErrorMessage: options?.message,
          },
          createNumberSchema,
        );
      },

      int: (options?: ValidationOptions): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isInt: true,
            intErrorMessage: options?.message,
          },
          createNumberSchema,
        );
      },

      positive: (options?: ValidationOptions): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isPositive: true,
            positiveErrorMessage: options?.message,
          },
          createNumberSchema,
        );
      },

      nonNegative: (options?: ValidationOptions): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isNonNegative: true,
            nonNegativeErrorMessage: options?.message,
          },
          createNumberSchema,
        );
      },

      negative: (options?: ValidationOptions): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isNegative: true,
            negativeErrorMessage: options?.message,
          },
          createNumberSchema,
        );
      },

      nonPositive: (options?: ValidationOptions): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isNonPositive: true,
            nonPositiveErrorMessage: options?.message,
          },
          createNumberSchema,
        );
      },

      multipleOf: (
        value: number,
        options?: ValidationOptions,
      ): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            multipleOf: value,
            multipleOfErrorMessage: options?.message,
          },
          createNumberSchema,
        );
      },

      step: (value: number, options?: ValidationOptions): NumberSchema => {
        // Alias for multipleOf
        return createSchemaWithConstraints(
          newConstraints,
          createNumberSchema,
        ).multipleOf(value, options);
      },

      finite: (options?: ValidationOptions): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isFinite: true,
            finiteErrorMessage: options?.message,
          },
          createNumberSchema,
        );
      },

      safe: (options?: ValidationOptions): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isSafe: true,
            safeErrorMessage: options?.message,
          },
          createNumberSchema,
        );
      },
    };
  };

  // Create the schema object with the common methods
  return createNumberSchema(constraints);
};

export default number;
