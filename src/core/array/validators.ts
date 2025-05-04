/**
 * Validation functions for array schema
 */
import type { ArrayParseResult } from '../common/index.js';
import { ArrayErrorCode, ArrayErrorMessages, formatMessage } from '../error.js';

/**
 * Validate that a value is an array
 * @param value - The value to validate
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result with the original input value preserved in error cases.
 */
export const validateType = (
  value: unknown,
  customErrorMessage?: string,
): ArrayParseResult => {
  if (!Array.isArray(value)) {
    // In error case, preserve the original input value
    // Type assertion is necessary here because ArrayParseResult expects unknown[]
    // but we want to return the original non-array value for better error reporting
    return {
      success: false,
      value: value as unknown[], // Preserve original value with type assertion
      error: {
        code: ArrayErrorCode.TYPE,
        message: customErrorMessage ?? ArrayErrorMessages[ArrayErrorCode.TYPE],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate the minimum length of an array
 * @param value - The array to validate
 * @param minLength - The minimum length
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateMinLength = (
  value: unknown[],
  minLength?: number,
  customErrorMessage?: string,
): ArrayParseResult => {
  if (minLength !== undefined && value.length < minLength) {
    return {
      success: false,
      value,
      error: {
        code: ArrayErrorCode.MIN_LENGTH,
        message:
          customErrorMessage ??
          formatMessage(
            ArrayErrorMessages[ArrayErrorCode.MIN_LENGTH],
            minLength,
          ),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate the maximum length of an array
 * @param value - The array to validate
 * @param maxLength - The maximum length
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result
 */
export const validateMaxLength = (
  value: unknown[],
  maxLength?: number,
  customErrorMessage?: string,
): ArrayParseResult => {
  if (maxLength !== undefined && value.length > maxLength) {
    return {
      success: false,
      value,
      error: {
        code: ArrayErrorCode.MAX_LENGTH,
        message:
          customErrorMessage ??
          formatMessage(
            ArrayErrorMessages[ArrayErrorCode.MAX_LENGTH],
            maxLength,
          ),
      },
    };
  }
  return { success: true, value };
};

/**
 * Interface for schemas with a parse method
 */
interface ParseableSchema {
  parse: (value: unknown) => { success: boolean };
}

/**
 * Type guard to check if a value is a parseable schema
 * @param value - The value to check
 * @returns True if the value is a parseable schema
 */
const isParseable = (value: unknown): value is ParseableSchema => {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const obj = value as Record<string, unknown>;
  return 'parse' in obj && typeof obj.parse === 'function';
};

/**
 * Validate each item in the array against a schema
 * @param value - The array to validate
 * @param itemSchema - The schema to validate each item against
 * @returns The validation result
 */
export const validateItems = (
  value: unknown[],
  itemSchema: ParseableSchema | null,
): ArrayParseResult => {
  if (itemSchema && isParseable(itemSchema)) {
    for (let i = 0; i < value.length; i++) {
      const itemResult = itemSchema.parse(value[i]);
      if (!itemResult.success) {
        return {
          success: false,
          value,
          error: {
            code: ArrayErrorCode.ITEM_INVALID,
            message: formatMessage(
              ArrayErrorMessages[ArrayErrorCode.ITEM_INVALID],
              i,
            ),
          },
        };
      }
    }
  }
  return { success: true, value };
};
