/**
 * Type definitions for object schema
 */
import type { ObjectParseResult } from '../common/index.js';

/**
 * Function to create an object schema
 * @param shape - Optional shape definition for the object
 * @returns A new object schema
 */
export type ObjectSchemaCreator = {
  (): ObjectSchema;
  (shape: Record<string, unknown>): ObjectSchema;
};

/**
 * Object schema type
 * Defines the interface for object validation schemas
 */
export type ObjectSchema = {
  /**
   * Internal shape definition for the object
   * @internal
   */
  _shapeDefinition: ShapeDefinition | null;

  /**
   * Internal flag for strict mode
   * @internal
   */
  _isStrict: boolean;

  /**
   * Makes the schema accept undefined values
   * @returns A new schema that accepts undefined values
   */
  optional: () => ObjectSchema & {
    parse: (
      value: unknown,
    ) => ObjectParseResult | { success: true; value: undefined };
  };

  /**
   * Makes the schema accept null values
   * @returns A new schema that accepts null values
   */
  nullable: () => ObjectSchema & {
    parse: (
      value: unknown,
    ) => ObjectParseResult | { success: true; value: null };
  };

  /**
   * Sets a default value for the schema when the input is undefined
   * @param defaultValue - The default value to use when the input is undefined
   * @returns A new schema
   * that uses the default value when the input is undefined
   */
  default: (defaultValue: Record<string, unknown>) => ObjectSchema;

  /**
   * Specifies that the object should not contain any keys not defined in the shape
   * @returns A new schema that rejects objects with unknown keys
   */
  strict: () => ObjectSchema;

  /**
   * Parse and validate a value as an object
   * @param value - The value to validate
   * @returns A parse result containing:
   *   - success: true if validation passed, false otherwise
   *   - value: the original input value (preserved without coercion in error cases)
   *   - error: validation error details if success is false
   */
  parse: (value: unknown) => ObjectParseResult;
};

/**
 * Shape definition for object schemas
 */
export type ShapeDefinition = Record<string, unknown>;
