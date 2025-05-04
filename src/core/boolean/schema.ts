/**
 * Boolean schema implementation for qs-parser
 */
import type { BooleanParseResult } from '../common/index.js';
import {
  defaultValue as makeDefault,
  nullable as makeNullable,
  optional as makeOptional,
} from '../common/schema.js';
import type {
  BooleanConstraints,
  BooleanSchema,
  BooleanSchemaOptions,
} from './types.js';
import * as validators from './validators.js';

/**
 * Create a boolean schema
 * @param options - Optional configuration options for the schema
 * @returns A new boolean schema
 */
const boolean = (options?: BooleanSchemaOptions): BooleanSchema => {
  // Store constraints
  const constraints: BooleanConstraints = {
    customErrorMessage: options?.message,
  };

  // Helper function to create a new schema with updated constraints
  const createBooleanSchema = (
    newConstraints: typeof constraints,
  ): BooleanSchema => {
    // Create a new schema object with the new constraints
    return {
      optional: function () {
        return makeOptional(this);
      },

      nullable: function () {
        return makeNullable(this);
      },

      default: function (defaultValue: boolean) {
        return makeDefault(this, defaultValue);
      },

      parse: (value: unknown): BooleanParseResult => {
        // Validate that the value is a boolean
        return validators.validateType(
          value,
          newConstraints.customErrorMessage,
        );
      },
    };
  };

  // Create the schema object with the common methods
  return createBooleanSchema(constraints);
};

export default boolean;
