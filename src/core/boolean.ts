/**
 * Boolean schema implementation for qs-parser
 * Provides methods for creating and validating boolean schemas
 */
import type { BooleanParseResult } from './common.js';
import { BooleanErrorCode, BooleanErrorMessages } from './error.js';

/**
 * Boolean schema type
 * Defines the interface for boolean validation schemas
 */
export type BooleanSchema = {
  /**
   * Parse and validate a value as a boolean
   * @param value - The value to validate
   * @returns A parse result containing:
   *   - success: true if validation passed, false otherwise
   *   - value: the original input value (preserved without coercion in error cases)
   *   - error: validation error details if success is false
   */
  parse: (value: unknown) => BooleanParseResult;
};

/**
 * Validate that a value is a boolean
 * @param value - The value to validate
 * @returns The validation result with the original input value preserved in error cases.
 *          Note: The type assertion (value as boolean) does not perform any transformation
 *          at runtime; it only informs TypeScript about the expected type.
 */
const validateType = (value: unknown): BooleanParseResult => {
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

/**
 * Create a boolean schema
 * @returns A new boolean schema
 */
const boolean = (): BooleanSchema => {
  // Create the schema object
  return {
    parse: (value: unknown): BooleanParseResult => {
      // Validate that the value is a boolean
      return validateType(value);
    },
  };
};

// Export the boolean schema creator
export default boolean;
