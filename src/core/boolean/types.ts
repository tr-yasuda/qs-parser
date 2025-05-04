/**
 * Type definitions for boolean schema
 */
import type { BooleanParseResult } from '../common/index.js';

/**
 * Options for boolean schema creation
 */
export type BooleanSchemaOptions = {
  /**
   * Custom error message to use when validation fails
   */
  message?: string;
};

/**
 * Constraints for boolean validation
 */
export type BooleanConstraints = {
  /**
   * Custom error message to use when type validation fails
   */
  customErrorMessage?: string;
};

/**
 * Boolean schema type
 * Defines the interface for boolean validation schemas
 */
export type BooleanSchema = {
  /**
   * Makes the schema accept undefined values
   * @returns A new schema that accepts undefined values
   */
  optional: () => BooleanSchema & {
    parse: (
      value: unknown,
    ) => BooleanParseResult | { success: true; value: undefined };
  };

  /**
   * Makes the schema accept null values
   * @returns A new schema that accepts null values
   */
  nullable: () => BooleanSchema & {
    parse: (
      value: unknown,
    ) => BooleanParseResult | { success: true; value: null };
  };

  /**
   * Sets a default value for the schema when the input is undefined
   * @param defaultValue - The default value to use when the input is undefined
   * @returns A new schema
   * that uses the default value when the input is undefined
   */
  default: (defaultValue: boolean) => BooleanSchema;
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
