/**
 * Object schema implementation for qs-parser
 */
import type { ObjectParseResult } from '../common/index.js';
import {
  defaultValue as makeDefault,
  nullable as makeNullable,
  optional as makeOptional,
} from '../common/schema.js';
import type {
  ObjectConstraints,
  ObjectSchema,
  ObjectSchemaCreator,
  ObjectSchemaOptions,
  ValidationOptions,
} from './types.js';
import * as validators from './validators.js';

/**
 * Create an object schema
 * @param shapeOrOptions - Optional shape definition or options for the object
 * @param options - Optional configuration options for the schema
 * @returns A new object schema
 */
const object = (
  shapeOrOptions?: Record<string, unknown> | ObjectSchemaOptions,
  options?: ObjectSchemaOptions,
): ObjectSchema => {
  // Determine if the first argument is a shape or options
  let shape: Record<string, unknown> | undefined;
  let schemaOptions: ObjectSchemaOptions | undefined;

  if (
    shapeOrOptions &&
    typeof shapeOrOptions === 'object' &&
    'message' in shapeOrOptions
  ) {
    // First argument is options
    schemaOptions = shapeOrOptions as ObjectSchemaOptions;
  } else {
    // First argument is shape
    shape = shapeOrOptions;
    schemaOptions = options;
  }

  // Store constraints
  const constraints: ObjectConstraints = {
    customErrorMessage: schemaOptions?.message,
  };

  // Create the schema object with the common methods
  return {
    // Internal state that will be properly copied to new instances
    _shapeDefinition: shape || null,
    _isStrict: false,

    optional: function () {
      return makeOptional(this);
    },

    nullable: function () {
      return makeNullable(this);
    },

    default: function (defaultValue: Record<string, unknown>) {
      return makeDefault(this, defaultValue);
    },

    strict: function (options?: ValidationOptions) {
      const newSchema = {
        ...this,
        _shapeDefinition: this._shapeDefinition
          ? { ...this._shapeDefinition }
          : null,
      };
      newSchema._isStrict = true;

      // Update constraints with the new error message if provided
      if (options?.message) {
        constraints.unknownKeysErrorMessage = options.message;
      }

      return newSchema;
    },

    parse: function (value: unknown): ObjectParseResult {
      // Validate that the value is an object
      const typeResult = validators.validateType(
        value,
        constraints.customErrorMessage,
      );
      if (!typeResult.success) {
        return typeResult;
      }

      // If a shape is defined, validate against it
      if (this._shapeDefinition) {
        return validators.validateShape(
          typeResult.value,
          this._shapeDefinition,
          this._isStrict,
          constraints.requiredErrorMessage,
          constraints.unknownKeysErrorMessage,
        );
      }

      return typeResult;
    },
  };
};

export default object as ObjectSchemaCreator;
