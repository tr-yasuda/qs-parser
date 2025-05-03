/**
 * Validation functions for boolean schema
 */
import type { BooleanParseResult } from '../common/index.js';
import { BooleanErrorCode, BooleanErrorMessages } from '../error.js';

/**
 * Validate that a value is a boolean
 * @param value - The value to validate
 * @returns The validation result with the original input value preserved in error cases.
 *          Note: The type assertion (value as boolean) does not perform any transformation
 *          at runtime; it only informs TypeScript about the expected type.
 */
export const validateType = (value: unknown): BooleanParseResult => {
  if (typeof value !== 'boolean') {
    return {
      success: false,
      value: value as boolean, // Original value preserved without coercion
      error: {
        code: BooleanErrorCode.TYPE,
        message: `${BooleanErrorMessages[BooleanErrorCode.TYPE]}, got ${typeof value}`,
      },
    };
  }
  return { success: true, value };
};
