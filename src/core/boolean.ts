/**
 * Boolean schema implementation for qs-parser
 * Provides methods for creating and validating boolean schemas
 */
import type { BooleanParseResult } from './common.js';
import { BooleanErrorCode, BooleanErrorMessages } from './error.js';

/**
 * Boolean schema type
 */
type BooleanSchema = {
  parse: (value: unknown) => BooleanParseResult;
};

/**
 * Validate that a value is a boolean
 * @param value - The value to validate
 * @returns The validation result
 */
const validateType = (value: unknown): BooleanParseResult => {
  if (typeof value !== 'boolean') {
    return {
      success: false,
      value: Boolean(value),
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
  const schema: BooleanSchema = {
    parse: (value: unknown): BooleanParseResult => {
      // Validate that the value is a boolean
      return validateType(value);
    },
  };

  return schema;
};

// Export the boolean schema creator
export default boolean;
