/**
 * Validation functions for number schema
 */

import type { NumberParseResult } from '../common/index.js';
import {
  NumberErrorCode,
  NumberErrorMessages,
  formatMessage,
} from '../error.js';

/**
 * Validate that a value is a number
 * @param value - The value to validate
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result with the original input value preserved in error cases.
 *          Note: The type assertion (value as number) does not perform any transformation
 *          at runtime; it only informs TypeScript about the expected type.
 */
export const validateType = (
  value: unknown,
  customErrorMessage?: string,
): NumberParseResult => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    const defaultMessage = `${NumberErrorMessages[NumberErrorCode.TYPE]}, got ${typeof value}${
      typeof value === 'number' && Number.isNaN(value) ? ' (NaN)' : ''
    }`;
    return {
      success: false,
      value: value as number, // Preserve original value with type assertion
      error: {
        code: NumberErrorCode.TYPE,
        message: customErrorMessage ?? defaultMessage,
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate minimum value constraint (inclusive, >=)
 * @param value - The number to validate
 * @param min - The minimum allowed value
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateMin = (
  value: number,
  min?: number,
  customErrorMessage?: string,
): NumberParseResult => {
  if (min !== undefined && value < min) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.MIN,
        message:
          customErrorMessage ??
          formatMessage(NumberErrorMessages[NumberErrorCode.MIN], min),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate greater than constraint (exclusive, >)
 * @param value - The number to validate
 * @param gt - The value that the number must be greater than
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateGt = (
  value: number,
  gt?: number,
  customErrorMessage?: string,
): NumberParseResult => {
  if (gt !== undefined && value <= gt) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.GT,
        message:
          customErrorMessage ??
          formatMessage(NumberErrorMessages[NumberErrorCode.GT], gt),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate maximum value constraint (inclusive, <=)
 * @param value - The number to validate
 * @param max - The maximum allowed value
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateMax = (
  value: number,
  max?: number,
  customErrorMessage?: string,
): NumberParseResult => {
  if (max !== undefined && value > max) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.MAX,
        message:
          customErrorMessage ??
          formatMessage(NumberErrorMessages[NumberErrorCode.MAX], max),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate less than constraint (exclusive, <)
 * @param value - The number to validate
 * @param lt - The value that the number must be lower than
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateLt = (
  value: number,
  lt?: number,
  customErrorMessage?: string,
): NumberParseResult => {
  if (lt !== undefined && value >= lt) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.LT,
        message:
          customErrorMessage ??
          formatMessage(NumberErrorMessages[NumberErrorCode.LT], lt),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate integer constraint
 * @param value - The number to validate
 * @param isInt - Whether to validate as integer
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateInt = (
  value: number,
  isInt?: boolean,
  customErrorMessage?: string,
): NumberParseResult => {
  if (isInt && !Number.isInteger(value)) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.INT,
        message: customErrorMessage ?? NumberErrorMessages[NumberErrorCode.INT],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate positive number constraint
 * @param value - The number to validate
 * @param isPositive - Whether to validate as positive
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validatePositive = (
  value: number,
  isPositive?: boolean,
  customErrorMessage?: string,
): NumberParseResult => {
  if (isPositive && value <= 0) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.POSITIVE,
        message:
          customErrorMessage ?? NumberErrorMessages[NumberErrorCode.POSITIVE],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate non-negative number constraint
 * @param value - The number to validate
 * @param isNonNegative - Whether to validate as non-negative
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateNonNegative = (
  value: number,
  isNonNegative?: boolean,
  customErrorMessage?: string,
): NumberParseResult => {
  if (isNonNegative && value < 0) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.NON_NEGATIVE,
        message:
          customErrorMessage ??
          NumberErrorMessages[NumberErrorCode.NON_NEGATIVE],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate negative number constraint
 * @param value - The number to validate
 * @param isNegative - Whether to validate as negative
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateNegative = (
  value: number,
  isNegative?: boolean,
  customErrorMessage?: string,
): NumberParseResult => {
  if (isNegative && value >= 0) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.NEGATIVE,
        message:
          customErrorMessage ?? NumberErrorMessages[NumberErrorCode.NEGATIVE],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate non-positive number constraint
 * @param value - The number to validate
 * @param isNonPositive - Whether to validate as non-positive
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateNonPositive = (
  value: number,
  isNonPositive?: boolean,
  customErrorMessage?: string,
): NumberParseResult => {
  if (isNonPositive && value > 0) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.NON_POSITIVE,
        message:
          customErrorMessage ??
          NumberErrorMessages[NumberErrorCode.NON_POSITIVE],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate multiple of constraint
 * @param value - The number to validate
 * @param multipleOf - The value that the number must be a multiple of
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateMultipleOf = (
  value: number,
  multipleOf?: number,
  customErrorMessage?: string,
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
          message:
            customErrorMessage ??
            formatMessage(
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
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateFinite = (
  value: number,
  isValueFinite?: boolean,
  customErrorMessage?: string,
): NumberParseResult => {
  if (isValueFinite && !Number.isFinite(value)) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.FINITE,
        message:
          customErrorMessage ?? NumberErrorMessages[NumberErrorCode.FINITE],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate safe integer constraint
 * @param value - The number to validate
 * @param isSafe - Whether to validate as safe integer
 * @param customErrorMessage - Optional custom error message
 * @returns The validations result
 */
export const validateSafe = (
  value: number,
  isSafe?: boolean,
  customErrorMessage?: string,
): NumberParseResult => {
  if (isSafe && !Number.isSafeInteger(value)) {
    return {
      success: false,
      value,
      error: {
        code: NumberErrorCode.SAFE,
        message:
          customErrorMessage ?? NumberErrorMessages[NumberErrorCode.SAFE],
      },
    };
  }
  return { success: true, value };
};
