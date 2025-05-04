/**
 * Type definitions for array schema
 */
import type { ArrayParseResult } from '../common/index.js';

/**
 * Options for array schema creation
 */
export type ArraySchemaOptions = {
  /**
   * Custom error message to use when validation fails
   */
  message?: string;
};

/**
 * Interface for schemas with a parse method
 */
export interface ParseableSchema {
  parse: (value: unknown) => { success: boolean };
}

/**
 * Array schema type
 * Defines the interface for array validation schemas
 */
export type ArraySchema = {
  /**
   * Internal item schema for array validation
   * @internal
   */
  _itemSchema: ParseableSchema | null;

  /**
   * Internal constraints for array validation
   * @internal
   */
  _constraints: ArrayConstraints;

  /**
   * Makes the schema accept undefined values
   * @returns A new schema that accepts undefined values
   */
  optional: () => ArraySchema & {
    parse: (
      value: unknown,
    ) => ArrayParseResult | { success: true; value: undefined };
  };

  /**
   * Makes the schema accept null values
   * @returns A new schema that accepts null values
   */
  nullable: () => ArraySchema & {
    parse: (
      value: unknown,
    ) => ArrayParseResult | { success: true; value: null };
  };

  /**
   * Sets a default value for the schema when the input is undefined
   * @param defaultValue - The default value to use when the input is undefined
   * @returns A new schema that uses the default value when the input is undefined
   */
  default: (defaultValue: unknown[]) => ArraySchema;

  /**
   * Sets a minimum length for the array
   * @param length - The minimum length
   * @param options - Optional validation options
   * @returns A new schema with the minimum length constraint
   */
  min: (length: number, options?: ValidationOptions) => ArraySchema;

  /**
   * Sets a maximum length for the array
   * @param length - The maximum length
   * @param options - Optional validation options
   * @returns A new schema with the maximum length constraint
   */
  max: (length: number, options?: ValidationOptions) => ArraySchema;

  /**
   * Sets both minimum and maximum length for the array
   * @param min - The minimum length
   * @param max - The maximum length or validation options
   * @param options - Optional validation options
   * @returns A new schema with the length constraints
   */
  length: (
    min: number,
    max?: number | ValidationOptions,
    options?: ValidationOptions,
  ) => ArraySchema;

  /**
   * Parse and validate a value as an array
   * @param value - The value to validate
   * @returns A parse result containing:
   *   - success: true if validation passed, false otherwise
   *   - value: the original input value (preserved without coercion in error cases)
   *   - error: validation error details if success is false
   */
  parse: (value: unknown) => ArrayParseResult;
};

/**
 * Options for validation methods
 */
export type ValidationOptions = {
  /**
   * Custom error message to use when validation fails
   */
  message?: string;
};

/**
 * Constraints for array schemas
 */
export type ArrayConstraints = {
  minLength?: number;
  maxLength?: number;
  /**
   * Custom error message to use when type validation fails
   */
  customErrorMessage?: string;
  /**
   * Custom error message to use when min length validation fails
   */
  minLengthErrorMessage?: string;
  /**
   * Custom error message to use when max length validation fails
   */
  maxLengthErrorMessage?: string;
};
