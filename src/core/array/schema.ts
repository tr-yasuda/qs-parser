/**
 * Array schema implementation for qs-parser
 */
import type { ArrayParseResult } from '../common/index.js';
import {
  defaultValue as makeDefault,
  nullable as makeNullable,
  optional as makeOptional,
} from '../common/schema.js';
import { createSchemaWithConstraints } from '../utils/schema.js';
import type {
  ArrayConstraints,
  ArraySchema,
  ParseableSchema,
} from './types.js';
import * as validators from './validators.js';

// Type guard to check if a value is a parseable schema
const isParseable = (value: unknown): value is ParseableSchema => {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const obj = value as Record<string, unknown>;
  return 'parse' in obj && typeof obj.parse === 'function';
};

/**
 * Create an array schema
 * @param itemSchema - Optional schema for array items
 * @returns A new array schema
 */
const array = (itemSchema?: unknown): ArraySchema => {
  // Store constraints
  const constraints: ArrayConstraints = {};

  // Helper function to create a new schema with updated constraints
  const createArraySchema = (
    newConstraints: typeof constraints,
  ): ArraySchema => {
    // Create a new schema object with the new constraints
    return {
      // Internal state that will be properly copied to new instances
      _itemSchema: itemSchema && isParseable(itemSchema) ? itemSchema : null,
      _constraints: newConstraints,

      optional: function () {
        return makeOptional(this);
      },

      nullable: function () {
        return makeNullable(this);
      },

      default: function (defaultValue: unknown[]) {
        return makeDefault(this, defaultValue);
      },

      min: (length: number): ArraySchema =>
        createSchemaWithConstraints(
          { ...newConstraints, minLength: length },
          createArraySchema,
        ),

      max: (length: number): ArraySchema =>
        createSchemaWithConstraints(
          { ...newConstraints, maxLength: length },
          createArraySchema,
        ),

      length: (min: number, max?: number): ArraySchema => {
        if (max === undefined) {
          // If max is not provided, set both min and max to the same value
          return createSchemaWithConstraints(
            { ...newConstraints, minLength: min, maxLength: min },
            createArraySchema,
          );
        }
        return createSchemaWithConstraints(
          { ...newConstraints, minLength: min, maxLength: max },
          createArraySchema,
        );
      },

      parse: function (value: unknown): ArrayParseResult {
        // Validate that the value is an array
        const typeResult = validators.validateType(value);
        if (!typeResult.success) {
          return typeResult;
        }

        // Now we know the value is an array
        const arrayValue = typeResult.value;

        // Validate constraints
        const minLengthResult = validators.validateMinLength(
          arrayValue,
          this._constraints.minLength,
        );
        if (!minLengthResult.success) {
          return minLengthResult;
        }

        const maxLengthResult = validators.validateMaxLength(
          arrayValue,
          this._constraints.maxLength,
        );
        if (!maxLengthResult.success) {
          return maxLengthResult;
        }

        // Validate items if an item schema is provided
        const itemsResult = validators.validateItems(
          arrayValue,
          this._itemSchema,
        );
        if (!itemsResult.success) {
          return itemsResult;
        }

        // All validations passed
        return { success: true, value: arrayValue };
      },
    };
  };

  // Create the schema object with the common methods
  return createArraySchema(constraints);
};

export default array;
