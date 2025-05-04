/**
 * Validation functions for boolean schema
 */
import type { BooleanParseResult } from '../common/index.js';
import { BooleanErrorCode, BooleanErrorMessages } from '../error.js';

/**
 * Validate that a value is a boolean
 * @param value - The value to validate
 * @param customErrorMessage - Optional custom error message
 * @returns The validation result with the original input value preserved in error cases.
 *          Note: The type assertion (value as boolean) does not perform any transformation
 *          at runtime; it only informs TypeScript about the expected type.
 */
export const validateType = (
  value: unknown,
  customErrorMessage?: string,
): BooleanParseResult => {
  if (typeof value !== 'boolean') {
    return {
      success: false,
      value: value as boolean, // Preserve original value with type assertion
      error: {
        code: BooleanErrorCode.TYPE,
        message:
          customErrorMessage ??
          `${BooleanErrorMessages[BooleanErrorCode.TYPE]}, got ${typeof value}`,
      },
    };
  }
  return { success: true, value };
};
