/**
 * Type definitions for date schema
 */
import type { DateParseResult } from '../common/index.js';

/**
 * Options for date schema creation
 */
export type DateSchemaOptions = {
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
 * Constraints for date validation
 */
export type DateConstraints = {
  minDate?: Date;
  maxDate?: Date;
  isPast?: boolean;
  isFuture?: boolean;
  betweenDates?: [Date, Date];
  isToday?: boolean;
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
   * Custom error message to use when past validation fails
   */
  pastErrorMessage?: string;
  /**
   * Custom error message to use when future validation fails
   */
  futureErrorMessage?: string;
  /**
   * Custom error message to use when between validation fails
   */
  betweenErrorMessage?: string;
  /**
   * Custom error message to use when today validation fails
   */
  todayErrorMessage?: string;
};

/**
 * Date schema type
 * Defines the interface for date validation schemas
 */
export type DateSchema = {
  /**
   * Makes the schema accept undefined values
   * @returns A new schema that accepts undefined values
   */
  optional: () => DateSchema & {
    parse: (
      value: unknown,
    ) => DateParseResult | { success: true; value: undefined };
  };

  /**
   * Makes the schema accept null values
   * @returns A new schema that accepts null values
   */
  nullable: () => DateSchema & {
    parse: (value: unknown) => DateParseResult | { success: true; value: null };
  };

  /**
   * Sets a default value for the schema when the input is undefined
   * @param defaultValue - The default value to use when the input is undefined
   * @returns A new schema
   * that uses the default value when the input is undefined
   */
  default: (defaultValue: Date) => DateSchema;
  /**
   * Parse and validate a value as a date
   * @param value - The value to validate
   * @returns A parse result containing:
   *   - success: true if validation passed, false otherwise
   *   - value: the original input value (preserved without coercion in error cases)
   *   - error: validation error details if success is false
   * @remarks
   * IMPORTANT: When passing a string as input, only the 'YYYY-MM-DD' format (e.g., '2023-01-31') is supported.
   * Other date formats will result in validation errors.
   */
  parse: (value: unknown) => DateParseResult;

  /**
   * Set a minimum date constraint (inclusive, >=)
   * @param date - The minimum allowed date
   * @param options - Optional validation options
   * @returns A new date schema with the constraint
   */
  min: (date: Date, options?: ValidationOptions) => DateSchema;

  /**
   * Set a maximum date constraint (inclusive, <=)
   * @param date - The maximum allowed date
   * @param options - Optional validation options
   * @returns A new date schema with the constraint
   */
  max: (date: Date, options?: ValidationOptions) => DateSchema;

  /**
   * Set a past date constraint (< now)
   * @param options - Optional validation options
   * @returns A new date schema with the constraint
   */
  past: (options?: ValidationOptions) => DateSchema;

  /**
   * Set a future date constraint (> now)
   * @param options - Optional validation options
   * @returns A new date schema with the constraint
   */
  future: (options?: ValidationOptions) => DateSchema;

  /**
   * Set a between dates constraint (inclusive)
   * @param min - The minimum allowed date
   * @param max - The maximum allowed date
   * @param options - Optional validation options
   * @returns A new date schema with the constraint
   */
  between: (min: Date, max: Date, options?: ValidationOptions) => DateSchema;

  /**
   * Set a today constraint (same day as now)
   * @param options - Optional validation options
   * @returns A new date schema with the constraint
   */
  today: (options?: ValidationOptions) => DateSchema;
};
