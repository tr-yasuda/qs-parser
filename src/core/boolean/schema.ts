/**
 * Boolean schema implementation for qs-parser
 */
import type { BooleanParseResult } from '../common/index.js';
import {
  defaultValue as makeDefault,
  nullable as makeNullable,
  optional as makeOptional,
} from '../common/schema.js';
import type { BooleanSchema } from './types.js';
import * as validators from './validators.js';

/**
 * Create a boolean schema
 * @returns A new boolean schema
 */
const boolean = (): BooleanSchema => {
  // Create the schema object with the common methods
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
      return validators.validateType(value);
    },
  };
};

export default boolean;
