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
  ArraySchemaOptions,
  ParseableSchema,
  ValidationOptions,
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
 * @param itemSchemaOrOptions - Optional schema for array items or options
 * @returns A new array schema
 */
const array = (itemSchemaOrOptions?: unknown): ArraySchema => {
  // Determine if the first argument is options or an item schema
  let itemSchema: unknown = undefined;
  let options: ArraySchemaOptions | undefined = undefined;

  if (
    itemSchemaOrOptions !== undefined &&
    typeof itemSchemaOrOptions === 'object' &&
    itemSchemaOrOptions !== null &&
    !Array.isArray(itemSchemaOrOptions) &&
    'message' in itemSchemaOrOptions
  ) {
    options = itemSchemaOrOptions as ArraySchemaOptions;
  } else {
    itemSchema = itemSchemaOrOptions;
  }

  // Store constraints
  const constraints: ArrayConstraints = {
    customErrorMessage: options?.message,
  };

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

      min: (length: number, options?: ValidationOptions): ArraySchema =>
        createSchemaWithConstraints(
          {
            ...newConstraints,
            minLength: length,
            minLengthErrorMessage: options?.message,
          },
          createArraySchema,
        ),

      max: (length: number, options?: ValidationOptions): ArraySchema =>
        createSchemaWithConstraints(
          {
            ...newConstraints,
            maxLength: length,
            maxLengthErrorMessage: options?.message,
          },
          createArraySchema,
        ),

      /**
       * Sets both minimum and maximum length for the array
       * @param min - The minimum length
       * @param maxOrOptions - Either the maximum length or validation options.
       *                       If a number, it sets the maximum length.
       *                       If an object, it provides validation options and min=max.
       * @param optionsParam - Validation options when maxOrOptions is a number
       * @returns A new schema with the length constraints
       * @example
       * // Set exact length of 5 with custom error message
       * q.array().length(5, { message: 'Array must have exactly 5 items' })
       * 
       * // Set length between 2 and 10
       * q.array().length(2, 10)
       * 
       * // Set length between 2 and 10 with custom error message
       * q.array().length(2, 10, { message: 'Array length must be between 2 and 10' })
       */
      length: (
        min: number,
        maxOrOptions?: number | ValidationOptions,
        optionsParam?: ValidationOptions,
      ): ArraySchema => {
        // Handle the case where the second argument is options
        const isMaxOptions = typeof maxOrOptions === 'object';
        const localOptions = isMaxOptions ? maxOrOptions : optionsParam;
        const max = typeof maxOrOptions === 'number' ? maxOrOptions : min;

        if (maxOrOptions === undefined || isMaxOptions) {
          // If max is not provided or is options,
          // set both min and max to the same value
          return createSchemaWithConstraints(
            {
              ...newConstraints,
              minLength: min,
              maxLength: min,
              minLengthErrorMessage: localOptions?.message,
              maxLengthErrorMessage: localOptions?.message,
            },
            createArraySchema,
          );
        }

        return createSchemaWithConstraints(
          {
            ...newConstraints,
            minLength: min,
            maxLength: max,
            minLengthErrorMessage: localOptions?.message,
            maxLengthErrorMessage: localOptions?.message,
          },
          createArraySchema,
        );
      },

      parse: function (value: unknown): ArrayParseResult {
        // Validate that the value is an array
        const typeResult = validators.validateType(
          value,
          this._constraints.customErrorMessage,
        );
        if (!typeResult.success) {
          return typeResult;
        }

        // Now we know the value is an array
        const arrayValue = typeResult.value;

        // Validate constraints
        const minLengthResult = validators.validateMinLength(
          arrayValue,
          this._constraints.minLength,
          this._constraints.minLengthErrorMessage,
        );
        if (!minLengthResult.success) {
          return minLengthResult;
        }

        const maxLengthResult = validators.validateMaxLength(
          arrayValue,
          this._constraints.maxLength,
          this._constraints.maxLengthErrorMessage,
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
