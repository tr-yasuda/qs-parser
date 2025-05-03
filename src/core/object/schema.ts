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
  ObjectSchema,
  ObjectSchemaCreator,
  ShapeDefinition,
} from './types.js';
import * as validators from './validators.js';

/**
 * Create an object schema
 * @param shape - Optional shape definition for the object
 * @returns A new object schema
 */
const object = (shape?: Record<string, unknown>): ObjectSchema => {
  // Create the schema object with the common methods
  return {
    // Internal state that will be properly copied to new instances
    _shapeDefinition: shape || (null as ShapeDefinition | null),
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

    strict: function () {
      const newSchema = Object.create(this);
      newSchema._isStrict = true;
      return newSchema;
    },

    parse: function (value: unknown): ObjectParseResult {
      // Validate that the value is an object
      const typeResult = validators.validateType(value);
      if (!typeResult.success) {
        return typeResult;
      }

      // If a shape is defined, validate against it
      if (this._shapeDefinition) {
        return validators.validateShape(
          typeResult.value,
          this._shapeDefinition,
          this._isStrict,
        );
      }

      return typeResult;
    },
  };
};

export default object as ObjectSchemaCreator;
