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
    // The First argument is options
    schemaOptions = shapeOrOptions as ObjectSchemaOptions;
  } else {
    // The First argument is shape
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

    /**
     * Specifies that the object should not contain any keys not defined in the shape
     * @param options - Optional validation options
     * @returns A new schema that rejects objects with unknown keys
     * @remarks
     * If a custom error message is provided in the options, it will be used
     * specifically for unknown keys validation errors.
     * This allows for targeted
     * error messages when unknown properties are detected in strict mode.
     */
    strict: function (options?: ValidationOptions) {
      const newSchema = {
        ...this,
        _shapeDefinition: this._shapeDefinition
          ? { ...this._shapeDefinition }
          : null,
      };
      newSchema._isStrict = true;

      // Create a new constraints object to avoid mutating the shared one
      // This custom message will be used specifically for unknown keys validation errors
      const newConstraints = { ...constraints };
      if (options?.message) {
        newConstraints.unknownKeysErrorMessage = options.message;
      }

      // Store the new constraints in the schema
      Object.defineProperty(newSchema, '_constraints', {
        value: newConstraints,
        writable: true,
        enumerable: false,
        configurable: true,
      });

      return newSchema;
    },

    parse: function (value: unknown): ObjectParseResult {
      // Use instance-specific constraints if available,
      // otherwise use shared constraints
      const effectiveConstraints = this._constraints || constraints;

      // Validate that the value is an object
      const typeResult = validators.validateType(
        value,
        effectiveConstraints.customErrorMessage,
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
          effectiveConstraints.requiredErrorMessage,
          effectiveConstraints.unknownKeysErrorMessage,
        );
      }

      return typeResult;
    },
  };
};

export default object as ObjectSchemaCreator;
