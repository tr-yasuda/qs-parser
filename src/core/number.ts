import type { NumberParseResult } from './common.js';
/**
 * Number schema implementation for qs-parser
 * Provides methods for creating and validating number schemas
 */
import {
  NumberErrorCode,
  NumberErrorMessages,
  formatMessage,
} from './error.js';

/**
 * Constraints for number validation
 */
type NumberConstraints = {
  min?: number;
  max?: number;
  gt?: number;
  lt?: number;
  isInt?: boolean;
  isPositive?: boolean;
  isNonNegative?: boolean;
  isNegative?: boolean;
  isNonPositive?: boolean;
  multipleOf?: number;
  isFinite?: boolean;
  isSafe?: boolean;
};

/**
 * Number schema type
 * Defines the interface for number validation schemas
 */
export type NumberSchema = {
  /**
   * Parse a value as a number
   * @param value - The value to parse
   * @returns The parse result
   */
  parse: (value: unknown) => NumberParseResult;

  /**
   * Set a minimum value constraint (inclusive, >=)
   * @param value - The minimum allowed value
   * @returns A new number schema with the constraint
   */
  min: (value: number) => NumberSchema;

  /**
   * Set a greater than or equal to constraint (alias for min)
   * @param value - The minimum allowed value
   * @returns A new number schema with the constraint
   */
  gte: (value: number) => NumberSchema;

  /**
   * Set a greater than constraint (exclusive, >)
   * @param value - The value that the number must be greater than
   * @returns A new number schema with the constraint
   */
  gt: (value: number) => NumberSchema;

  /**
   * Set a maximum value constraint (inclusive, <=)
   * @param value - The maximum allowed value
   * @returns A new number schema with the constraint
   */
  max: (value: number) => NumberSchema;

  /**
   * Set a less than or equal to constraint (alias for max)
   * @param value - The maximum allowed value
   * @returns A new number schema with the constraint
   */
  lte: (value: number) => NumberSchema;

  /**
   * Set a less than constraint (exclusive, <)
   * @param value - The value that the number must be lower than
   * @returns A new number schema with the constraint
   */
  lt: (value: number) => NumberSchema;

  /**
   * Set an integer constraint
   * @returns A new number schema with the constraint
   */
  int: () => NumberSchema;

  /**
   * Set a positive number constraint (> 0)
   * @returns A new number schema with the constraint
   */
  positive: () => NumberSchema;

  /**
   * Set a non-negative number constraint (>= 0)
   * @returns A new number schema with the constraint
   */
  nonNegative: () => NumberSchema;

  /**
   * Set a negative number constraint (< 0)
   * @returns A new number schema with the constraint
   */
  negative: () => NumberSchema;

  /**
   * Set a non-positive number constraint (<= 0)
   * @returns A new number schema with the constraint
   */
  nonPositive: () => NumberSchema;

  /**
   * Set a multiple of constraint
   * @param value - The value that the number must be a multiple of
   * @returns A new number schema with the constraint
   */
  multipleOf: (value: number) => NumberSchema;

  /**
   * Set a step constraint (alias for multipleOf)
   * @param value - The value that the number must be a multiple of
   * @returns A new number schema with the constraint
   */
  step: (value: number) => NumberSchema;

  /**
   * Set a finite number constraint
   * @returns A new number schema with the constraint
   */
  finite: () => NumberSchema;

  /**
   * Set a safe integer constraint
   * @returns A new number schema with the constraint
   */
  safe: () => NumberSchema;
};

/**
 * Validation functions for number constraints
 */

/**
 * Validate that a value is a number
 * @param value - The value to validate
 * @returns The validation result with the original input value preserved in error cases.
 *          Note: The type assertion (value as number) does not perform any transformation
 *          at runtime; it only informs TypeScript about the expected type.
 */
const validateType = (value: unknown): NumberParseResult => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    const message = `${NumberErrorMessages[NumberErrorCode.TYPE]}, got ${typeof value}${
      typeof value === 'number' && Number.isNaN(value) ? ' (NaN)' : ''
    }`;
    return {
      success: false,
      value: value as number, // Original value preserved without coercion
      error: {
        code: NumberErrorCode.TYPE,
        message,
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate minimum value constraint (inclusive, >=)
 * @param value - The number to validate
 * @param min - The minimum allowed value
 * @returns The validation result
 */
const validateMin = (value: number, min?: number): NumberParseResult => {
  if (min !== undefined && value < min) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.MIN,
        message: formatMessage(NumberErrorMessages[NumberErrorCode.MIN], min),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate greater than constraint (exclusive, >)
 * @param value - The number to validate
 * @param gt - The value that the number must be greater than
 * @returns The validation result
 */
const validateGt = (value: number, gt?: number): NumberParseResult => {
  if (gt !== undefined && value <= gt) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.GT,
        message: formatMessage(NumberErrorMessages[NumberErrorCode.GT], gt),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate maximum value constraint (inclusive, <=)
 * @param value - The number to validate
 * @param max - The maximum allowed value
 * @returns The validation result
 */
const validateMax = (value: number, max?: number): NumberParseResult => {
  if (max !== undefined && value > max) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.MAX,
        message: formatMessage(NumberErrorMessages[NumberErrorCode.MAX], max),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate less than constraint (exclusive, <)
 * @param value - The number to validate
 * @param lt - The value that the number must be lower than
 * @returns The validation result
 */
const validateLt = (value: number, lt?: number): NumberParseResult => {
  if (lt !== undefined && value >= lt) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.LT,
        message: formatMessage(NumberErrorMessages[NumberErrorCode.LT], lt),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate integer constraint
 * @param value - The number to validate
 * @param isInt - Whether to validate as integer
 * @returns The validation result
 */
const validateInt = (value: number, isInt?: boolean): NumberParseResult => {
  if (isInt && !Number.isInteger(value)) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.INT,
        message: NumberErrorMessages[NumberErrorCode.INT],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate positive number constraint
 * @param value - The number to validate
 * @param isPositive - Whether to validate as positive
 * @returns The validation result
 */
const validatePositive = (
  value: number,
  isPositive?: boolean,
): NumberParseResult => {
  if (isPositive && value <= 0) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.POSITIVE,
        message: NumberErrorMessages[NumberErrorCode.POSITIVE],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate non-negative number constraint
 * @param value - The number to validate
 * @param isNonNegative - Whether to validate as non-negative
 * @returns The validation result
 */
const validateNonNegative = (
  value: number,
  isNonNegative?: boolean,
): NumberParseResult => {
  if (isNonNegative && value < 0) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.NON_NEGATIVE,
        message: NumberErrorMessages[NumberErrorCode.NON_NEGATIVE],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate negative number constraint
 * @param value - The number to validate
 * @param isNegative - Whether to validate as negative
 * @returns The validation result
 */
const validateNegative = (
  value: number,
  isNegative?: boolean,
): NumberParseResult => {
  if (isNegative && value >= 0) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.NEGATIVE,
        message: NumberErrorMessages[NumberErrorCode.NEGATIVE],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate non-positive number constraint
 * @param value - The number to validate
 * @param isNonPositive - Whether to validate as non-positive
 * @returns The validation result
 */
const validateNonPositive = (
  value: number,
  isNonPositive?: boolean,
): NumberParseResult => {
  if (isNonPositive && value > 0) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.NON_POSITIVE,
        message: NumberErrorMessages[NumberErrorCode.NON_POSITIVE],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate multiple of constraint
 * @param value - The number to validate
 * @param multipleOf - The value that the number must be a multiple of
 * @returns The validation result
 */
const validateMultipleOf = (
  value: number,
  multipleOf?: number,
): NumberParseResult => {
  if (multipleOf !== undefined) {
    // Handle division by zero
    if (multipleOf === 0) {
      return {
        success: false,
        value,
        error: {
          code: NumberErrorCode.MULTIPLE_OF_ZERO,
          message: NumberErrorMessages[NumberErrorCode.MULTIPLE_OF_ZERO],
        },
      };
    }

    // Check if the value is a multiple of the specified number
    if (value % multipleOf !== 0) {
      return {
        success: false,
        value,
        error: {
          code: NumberErrorCode.MULTIPLE_OF,
          message: formatMessage(
            NumberErrorMessages[NumberErrorCode.MULTIPLE_OF],
            multipleOf,
          ),
        },
      };
    }
  }
  return { success: true, value };
};

/**
 * Validate finite number constraint
 * @param value - The number to validate
 * @param isValueFinite - Whether to validate as finite
 * @returns The validation result
 */
const validateFinite = (
  value: number,
  isValueFinite?: boolean,
): NumberParseResult => {
  if (isValueFinite && !Number.isFinite(value)) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.FINITE,
        message: NumberErrorMessages[NumberErrorCode.FINITE],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate safe integer constraint
 * @param value - The number to validate
 * @param isSafe - Whether to validate as safe integer
 * @returns The validations result
 */
const validateSafe = (value: number, isSafe?: boolean): NumberParseResult => {
  if (isSafe && !Number.isSafeInteger(value)) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.SAFE,
        message: NumberErrorMessages[NumberErrorCode.SAFE],
      },
    };
  }
  return { success: true, value };
};

/**
 * Create a number schema
 * @returns A new number schema
 */
const number = (): NumberSchema => {
  // Store constraints
  const constraints: NumberConstraints = {};

  // Create the schema object
  const schema: NumberSchema = {
    parse: (value: unknown): NumberParseResult => {
      // First, validate that the value is a number
      const typeResult = validateType(value);
      if (!typeResult.success) {
        return typeResult;
      }

      // Now we know the value is a number
      const numberValue = typeResult.value;

      // Validate each constraint
      const validations = [
        validateMin(numberValue, constraints.min),
        validateGt(numberValue, constraints.gt),
        validateMax(numberValue, constraints.max),
        validateLt(numberValue, constraints.lt),
        validateInt(numberValue, constraints.isInt),
        validatePositive(numberValue, constraints.isPositive),
        validateNonNegative(numberValue, constraints.isNonNegative),
        validateNegative(numberValue, constraints.isNegative),
        validateNonPositive(numberValue, constraints.isNonPositive),
        validateMultipleOf(numberValue, constraints.multipleOf),
        validateFinite(numberValue, constraints.isFinite),
        validateSafe(numberValue, constraints.isSafe),
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
      return createSchemaWithConstraints(newConstraints);
    },

    gte: (value: number): NumberSchema => {
      // Alias for min
      return schema.min(value);
    },

    gt: (value: number): NumberSchema => {
      // Create a new schema with the greater than constraint
      const newConstraints = { ...constraints, gt: value };
      return createSchemaWithConstraints(newConstraints);
    },

    max: (value: number): NumberSchema => {
      // Create a new schema with the max value constraint
      const newConstraints = { ...constraints, max: value };
      return createSchemaWithConstraints(newConstraints);
    },

    lte: (value: number): NumberSchema => {
      // Alias for max
      return schema.max(value);
    },

    lt: (value: number): NumberSchema => {
      // Create a new schema with the less than constraint
      return createSchemaWithConstraints({ ...constraints, lt: value });
    },

    int: (): NumberSchema => {
      // Create a new schema with the integer constraint
      return createSchemaWithConstraints({ ...constraints, isInt: true });
    },

    positive: (): NumberSchema => {
      // Create a new schema with the positive constraint
      return createSchemaWithConstraints({ ...constraints, isPositive: true });
    },

    nonNegative: (): NumberSchema => {
      // Create a new schema with the non-negative constraint
      return createSchemaWithConstraints({
        ...constraints,
        isNonNegative: true,
      });
    },

    negative: (): NumberSchema => {
      // Create a new schema with the negative constraint
      return createSchemaWithConstraints({ ...constraints, isNegative: true });
    },

    nonPositive: (): NumberSchema => {
      // Create a new schema with the non-positive constraint
      return createSchemaWithConstraints({
        ...constraints,
        isNonPositive: true,
      });
    },

    multipleOf: (value: number): NumberSchema => {
      // Create a new schema with the multiple of constraint
      return createSchemaWithConstraints({ ...constraints, multipleOf: value });
    },

    step: (value: number): NumberSchema => {
      // Alias for multipleOf
      return schema.multipleOf(value);
    },

    finite: (): NumberSchema => {
      // Create a new schema with the finite constraint
      return createSchemaWithConstraints({ ...constraints, isFinite: true });
    },

    safe: (): NumberSchema => {
      // Create a new schema with the safe integer constraint
      return createSchemaWithConstraints({ ...constraints, isSafe: true });
    },
  };

  // Helper function to create a new schema with updated constraints
  const createSchemaWithConstraints = (
    newConstraints: typeof constraints,
  ): NumberSchema => {
    // Create a new schema object with the new constraints
    return {
      parse: (value: unknown): NumberParseResult => {
        // First, validate that the value is a number
        const typeResult = validateType(value);
        if (!typeResult.success) {
          return typeResult;
        }

        // Now we know the value is a number
        const numberValue = typeResult.value;

        // Validate each constraint with the new constraints
        const validations = [
          validateMin(numberValue, newConstraints.min),
          validateGt(numberValue, newConstraints.gt),
          validateMax(numberValue, newConstraints.max),
          validateLt(numberValue, newConstraints.lt),
          validateInt(numberValue, newConstraints.isInt),
          validatePositive(numberValue, newConstraints.isPositive),
          validateNonNegative(numberValue, newConstraints.isNonNegative),
          validateNegative(numberValue, newConstraints.isNegative),
          validateNonPositive(numberValue, newConstraints.isNonPositive),
          validateMultipleOf(numberValue, newConstraints.multipleOf),
          validateFinite(numberValue, newConstraints.isFinite),
          validateSafe(numberValue, newConstraints.isSafe),
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
        return createSchemaWithConstraints({ ...newConstraints, min: value });
      },

      gte: (value: number): NumberSchema => {
        // Alias for min
        return createSchemaWithConstraints(newConstraints).min(value);
      },

      gt: (value: number): NumberSchema => {
        return createSchemaWithConstraints({ ...newConstraints, gt: value });
      },

      max: (value: number): NumberSchema => {
        return createSchemaWithConstraints({ ...newConstraints, max: value });
      },

      lte: (value: number): NumberSchema => {
        // Alias for max
        return createSchemaWithConstraints(newConstraints).max(value);
      },

      lt: (value: number): NumberSchema => {
        return createSchemaWithConstraints({ ...newConstraints, lt: value });
      },

      int: (): NumberSchema => {
        return createSchemaWithConstraints({ ...newConstraints, isInt: true });
      },

      positive: (): NumberSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isPositive: true,
        });
      },

      nonNegative: (): NumberSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isNonNegative: true,
        });
      },

      negative: (): NumberSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isNegative: true,
        });
      },

      nonPositive: (): NumberSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isNonPositive: true,
        });
      },

      multipleOf: (value: number): NumberSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          multipleOf: value,
        });
      },

      step: (value: number): NumberSchema => {
        // Alias for multipleOf
        return createSchemaWithConstraints(newConstraints).multipleOf(value);
      },

      finite: (): NumberSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isFinite: true,
        });
      },

      safe: (): NumberSchema => {
        return createSchemaWithConstraints({ ...newConstraints, isSafe: true });
      },
    };
  };

  return schema;
};

// Export the number schema creator
export default number;
