/**
 * Number schema implementation for qs-parser
 */
import type { NumberParseResult } from '../common.js';
import { createSchemaWithConstraints } from '../utils/schema.js';
import type { NumberConstraints, NumberSchema } from './types.js';
import * as validators from './validators.js';

/**
 * Create a number schema
 * @returns A new number schema
 */
const number = (): NumberSchema => {
  // Store constraints
  const constraints: NumberConstraints = {};

  // Helper function to create a new schema with updated constraints
  const createNumberSchema = (
    newConstraints: typeof constraints,
  ): NumberSchema => {
    // Create a new schema object with the new constraints
    return {
      parse: (value: unknown): NumberParseResult => {
        // First, validate that the value is a number
        const typeResult = validators.validateType(value);
        if (!typeResult.success) {
          return typeResult;
        }

        // Now we know the value is a number
        const numberValue = typeResult.value;

        // Validate each constraint with the new constraints
        const validations = [
          validators.validateMin(numberValue, newConstraints.min),
          validators.validateGt(numberValue, newConstraints.gt),
          validators.validateMax(numberValue, newConstraints.max),
          validators.validateLt(numberValue, newConstraints.lt),
          validators.validateInt(numberValue, newConstraints.isInt),
          validators.validatePositive(numberValue, newConstraints.isPositive),
          validators.validateNonNegative(
            numberValue,
            newConstraints.isNonNegative,
          ),
          validators.validateNegative(numberValue, newConstraints.isNegative),
          validators.validateNonPositive(
            numberValue,
            newConstraints.isNonPositive,
          ),
          validators.validateMultipleOf(numberValue, newConstraints.multipleOf),
          validators.validateFinite(numberValue, newConstraints.isFinite),
          validators.validateSafe(numberValue, newConstraints.isSafe),
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

      min: (value: number): NumberSchema => {
        return createSchemaWithConstraints(
          { ...newConstraints, min: value },
          createNumberSchema,
        );
      },

      gte: (value: number): NumberSchema => {
        // Alias for min
        return createSchemaWithConstraints(
          newConstraints,
          createNumberSchema,
        ).min(value);
      },

      gt: (value: number): NumberSchema => {
        return createSchemaWithConstraints(
          { ...newConstraints, gt: value },
          createNumberSchema,
        );
      },

      max: (value: number): NumberSchema => {
        return createSchemaWithConstraints(
          { ...newConstraints, max: value },
          createNumberSchema,
        );
      },

      lte: (value: number): NumberSchema => {
        // Alias for max
        return createSchemaWithConstraints(
          newConstraints,
          createNumberSchema,
        ).max(value);
      },

      lt: (value: number): NumberSchema => {
        return createSchemaWithConstraints(
          { ...newConstraints, lt: value },
          createNumberSchema,
        );
      },

      int: (): NumberSchema => {
        return createSchemaWithConstraints(
          { ...newConstraints, isInt: true },
          createNumberSchema,
        );
      },

      positive: (): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isPositive: true,
          },
          createNumberSchema,
        );
      },

      nonNegative: (): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isNonNegative: true,
          },
          createNumberSchema,
        );
      },

      negative: (): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isNegative: true,
          },
          createNumberSchema,
        );
      },

      nonPositive: (): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isNonPositive: true,
          },
          createNumberSchema,
        );
      },

      multipleOf: (value: number): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            multipleOf: value,
          },
          createNumberSchema,
        );
      },

      step: (value: number): NumberSchema => {
        // Alias for multipleOf
        return createSchemaWithConstraints(
          newConstraints,
          createNumberSchema,
        ).multipleOf(value);
      },

      finite: (): NumberSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isFinite: true,
          },
          createNumberSchema,
        );
      },

      safe: (): NumberSchema => {
        return createSchemaWithConstraints(
          { ...newConstraints, isSafe: true },
          createNumberSchema,
        );
      },
    };
  };

  // Create the schema object
  const schema: NumberSchema = {
    parse: (value: unknown): NumberParseResult => {
      // First, validate that the value is a number
      const typeResult = validators.validateType(value);
      if (!typeResult.success) {
        return typeResult;
      }

      // Now we know the value is a number
      const numberValue = typeResult.value;

      // Validate each constraint
      const validations = [
        validators.validateMin(numberValue, constraints.min),
        validators.validateGt(numberValue, constraints.gt),
        validators.validateMax(numberValue, constraints.max),
        validators.validateLt(numberValue, constraints.lt),
        validators.validateInt(numberValue, constraints.isInt),
        validators.validatePositive(numberValue, constraints.isPositive),
        validators.validateNonNegative(numberValue, constraints.isNonNegative),
        validators.validateNegative(numberValue, constraints.isNegative),
        validators.validateNonPositive(numberValue, constraints.isNonPositive),
        validators.validateMultipleOf(numberValue, constraints.multipleOf),
        validators.validateFinite(numberValue, constraints.isFinite),
        validators.validateSafe(numberValue, constraints.isSafe),
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

    min: (value: number): NumberSchema => {
      // Create a new schema with the min value constraint
      const newConstraints = { ...constraints, min: value };
      return createSchemaWithConstraints(newConstraints, createNumberSchema);
    },

    gte: (value: number): NumberSchema => {
      // Alias for min
      return schema.min(value);
    },

    gt: (value: number): NumberSchema => {
      // Create a new schema with the greater than constraint
      const newConstraints = { ...constraints, gt: value };
      return createSchemaWithConstraints(newConstraints, createNumberSchema);
    },

    max: (value: number): NumberSchema => {
      // Create a new schema with the max value constraint
      const newConstraints = { ...constraints, max: value };
      return createSchemaWithConstraints(newConstraints, createNumberSchema);
    },

    lte: (value: number): NumberSchema => {
      // Alias for max
      return schema.max(value);
    },

    lt: (value: number): NumberSchema => {
      // Create a new schema with the less than constraint
      return createSchemaWithConstraints(
        { ...constraints, lt: value },
        createNumberSchema,
      );
    },

    int: (): NumberSchema => {
      // Create a new schema with the integer constraint
      return createSchemaWithConstraints(
        { ...constraints, isInt: true },
        createNumberSchema,
      );
    },

    positive: (): NumberSchema => {
      // Create a new schema with the positive constraint
      return createSchemaWithConstraints(
        { ...constraints, isPositive: true },
        createNumberSchema,
      );
    },

    nonNegative: (): NumberSchema => {
      // Create a new schema with the non-negative constraint
      return createSchemaWithConstraints(
        {
          ...constraints,
          isNonNegative: true,
        },
        createNumberSchema,
      );
    },

    negative: (): NumberSchema => {
      // Create a new schema with the negative constraint
      return createSchemaWithConstraints(
        { ...constraints, isNegative: true },
        createNumberSchema,
      );
    },

    nonPositive: (): NumberSchema => {
      // Create a new schema with the non-positive constraint
      return createSchemaWithConstraints(
        {
          ...constraints,
          isNonPositive: true,
        },
        createNumberSchema,
      );
    },

    multipleOf: (value: number): NumberSchema => {
      // Create a new schema with the multiple of constraint
      return createSchemaWithConstraints(
        { ...constraints, multipleOf: value },
        createNumberSchema,
      );
    },

    step: (value: number): NumberSchema => {
      // Alias for multipleOf
      return schema.multipleOf(value);
    },

    finite: (): NumberSchema => {
      // Create a new schema with the finite constraint
      return createSchemaWithConstraints(
        { ...constraints, isFinite: true },
        createNumberSchema,
      );
    },

    safe: (): NumberSchema => {
      // Create a new schema with the safe integer constraint
      return createSchemaWithConstraints(
        { ...constraints, isSafe: true },
        createNumberSchema,
      );
    },
  };

  return schema;
};

export default number;
