/**
 * Type definitions for number schema
 */

import type { NumberParseResult } from '../common/index.js';

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
