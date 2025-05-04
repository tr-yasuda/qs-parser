/**
 * Type definitions for number schema
 */

import type { NumberParseResult } from '../common/index.js';

/**
 * Options for number schema creation
 */
export type NumberSchemaOptions = {
  /**
   * Custom error message to use when validation fails
   */
  message?: string;
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
 * Constraints for number validation
 */
export type NumberConstraints = {
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
  /**
   * Custom error message to use when type validation fails
   */
  customErrorMessage?: string;
  /**
   * Custom error message to use when min validation fails
   */
  minErrorMessage?: string;
  /**
   * Custom error message to use when max validation fails
   */
  maxErrorMessage?: string;
  /**
   * Custom error message to use when gt validation fails
   */
  gtErrorMessage?: string;
  /**
   * Custom error message to use when lt validation fails
   */
  ltErrorMessage?: string;
  /**
   * Custom error message to use when int validation fails
   */
  intErrorMessage?: string;
  /**
   * Custom error message to use when positive validation fails
   */
  positiveErrorMessage?: string;
  /**
   * Custom error message to use when nonNegative validation fails
   */
  nonNegativeErrorMessage?: string;
  /**
   * Custom error message to use when negative validation fails
   */
  negativeErrorMessage?: string;
  /**
   * Custom error message to use when nonPositive validation fails
   */
  nonPositiveErrorMessage?: string;
  /**
   * Custom error message to use when multipleOf validation fails
   */
  multipleOfErrorMessage?: string;
  /**
   * Custom error message to use when finite validation fails
   */
  finiteErrorMessage?: string;
  /**
   * Custom error message to use when safe validation fails
   */
  safeErrorMessage?: string;
};

/**
 * Number schema type
 * Defines the interface for number validation schemas
 */
export type NumberSchema = {
  /**
   * Makes the schema accept undefined values
   * @returns A new schema that accepts undefined values
   */
  optional: () => NumberSchema & {
    parse: (
      value: unknown,
    ) => NumberParseResult | { success: true; value: undefined };
  };

  /**
   * Makes the schema accept null values
   * @returns A new schema that accepts null values
   */
  nullable: () => NumberSchema & {
    parse: (
      value: unknown,
    ) => NumberParseResult | { success: true; value: null };
  };

  /**
   * Sets a default value for the schema when the input is undefined
   * @param defaultValue - The default value to use when the input is undefined
   * @returns A new schema that uses the default value when the input is undefined
   */
  default: (defaultValue: number) => NumberSchema;
  /**
   * Parse a value as a number
   * @param value - The value to parse
   * @returns The parse result
   */
  parse: (value: unknown) => NumberParseResult;

  /**
   * Set a minimum value constraint (inclusive, >=)
   * @param value - The minimum allowed value
   * @param options - Optional validation options
   * @returns A new number schema with the constraint
   */
  min: (value: number, options?: ValidationOptions) => NumberSchema;

  /**
   * Set a greater than or equal to constraint (alias for min)
   * @param value - The minimum allowed value
   * @param options - Optional validation options
   * @returns A new number schema with the constraint
   */
  gte: (value: number, options?: ValidationOptions) => NumberSchema;

  /**
   * Set a greater than constraint (exclusive, >)
   * @param value - The value that the number must be greater than
   * @param options - Optional validation options
   * @returns A new number schema with the constraint
   */
  gt: (value: number, options?: ValidationOptions) => NumberSchema;

  /**
   * Set a maximum value constraint (inclusive, <=)
   * @param value - The maximum allowed value
   * @param options - Optional validation options
   * @returns A new number schema with the constraint
   */
  max: (value: number, options?: ValidationOptions) => NumberSchema;

  /**
   * Set a less than or equal to constraint (alias for max)
   * @param value - The maximum allowed value
   * @param options - Optional validation options
   * @returns A new number schema with the constraint
   */
  lte: (value: number, options?: ValidationOptions) => NumberSchema;

  /**
   * Set a less than constraint (exclusive, <)
   * @param value - The value that the number must be lower than
   * @param options - Optional validation options
   * @returns A new number schema with the constraint
   */
  lt: (value: number, options?: ValidationOptions) => NumberSchema;

  /**
   * Set an integer constraint
   * @param options - Optional validation options
   * @returns A new number schema with the constraint
   */
  int: (options?: ValidationOptions) => NumberSchema;

  /**
   * Set a positive number constraint (> 0)
   * @param options - Optional validation options
   * @returns A new number schema with the constraint
   */
  positive: (options?: ValidationOptions) => NumberSchema;

  /**
   * Set a non-negative number constraint (>= 0)
   * @param options - Optional validation options
   * @returns A new number schema with the constraint
   */
  nonNegative: (options?: ValidationOptions) => NumberSchema;

  /**
   * Set a negative number constraint (< 0)
   * @param options - Optional validation options
   * @returns A new number schema with the constraint
   */
  negative: (options?: ValidationOptions) => NumberSchema;

  /**
   * Set a non-positive number constraint (<= 0)
   * @param options - Optional validation options
   * @returns A new number schema with the constraint
   */
  nonPositive: (options?: ValidationOptions) => NumberSchema;

  /**
   * Set a multiple of constraint
   * @param value - The value that the number must be a multiple of
   * @param options - Optional validation options
   * @returns A new number schema with the constraint
   */
  multipleOf: (value: number, options?: ValidationOptions) => NumberSchema;

  /**
   * Set a step constraint (alias for multipleOf)
   * @param value - The value that the number must be a multiple of
   * @param options - Optional validation options
   * @returns A new number schema with the constraint
   */
  step: (value: number, options?: ValidationOptions) => NumberSchema;

  /**
   * Set a finite number constraint
   * @param options - Optional validation options
   * @returns A new number schema with the constraint
   */
  finite: (options?: ValidationOptions) => NumberSchema;

  /**
   * Set a safe integer constraint
   * @param options - Optional validation options
   * @returns A new number schema with the constraint
   */
  safe: (options?: ValidationOptions) => NumberSchema;
};
