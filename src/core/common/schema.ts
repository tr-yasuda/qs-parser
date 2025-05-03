/**
 * Common schema methods that can be used across all schema types
 */
import type { ParseResult } from './types.js';

/**
 * Makes a schema accept undefined values
 *
 * @param schema - The schema to make optional
 * @returns A new schema that accepts undefined values
 */
export function optional<
  T,
  S extends { parse: (value: unknown) => ParseResult<T> },
>(schema: S): S & { parse: (value: unknown) => ParseResult<T | undefined> } {
  const originalParse = schema.parse;

  // Create a new schema with the same methods but a modified parse function
  const newSchema = Object.create(schema);

  // Override the parse method to handle undefined values
  newSchema.parse = (value: unknown): ParseResult<T | undefined> => {
    // If the value is undefined, return a successful result
    if (value === undefined) {
      return {
        success: true,
        value: undefined,
      };
    }

    // Otherwise, use the original parse method
    return originalParse.call(schema, value);
  };

  return newSchema;
}

/**
 * Makes a schema accept null values
 *
 * @param schema - The schema to make nullable
 * @returns A new schema that accepts null values
 */
export function nullable<
  T,
  S extends { parse: (value: unknown) => ParseResult<T> },
>(schema: S): S & { parse: (value: unknown) => ParseResult<T | null> } {
  const originalParse = schema.parse;

  // Create a new schema with the same methods but a modified parse function
  const newSchema = Object.create(schema);

  // Override the parse method to handle null values
  newSchema.parse = (value: unknown): ParseResult<T | null> => {
    // If the value is null, return a successful result
    if (value === null) {
      return {
        success: true,
        value: null,
      };
    }

    // Otherwise, use the original parse method
    return originalParse.call(schema, value);
  };

  return newSchema;
}

/**
 * Sets a default value for a schema when the input is undefined
 *
 * @param schema - The schema to set a default value for
 * @param defaultValue - The default value to use when the input is undefined
 * @returns A new schema that uses the default value when the input is undefined
 */
export function defaultValue<
  T,
  S extends { parse: (value: unknown) => ParseResult<T> },
>(schema: S, defaultValue: T): S {
  const originalParse = schema.parse;

  // Create a new schema with the same methods but a modified parse function
  const newSchema = Object.create(schema);

  // Override the parse method to handle undefined values
  newSchema.parse = (value: unknown): ParseResult<T> => {
    // If the value is undefined, use the default value
    if (value === undefined) {
      return {
        success: true,
        value: defaultValue,
      };
    }

    // Otherwise, use the original parse method
    return originalParse.call(schema, value);
  };

  return newSchema;
}
