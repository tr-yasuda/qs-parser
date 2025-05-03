/**
 * Boolean schema implementation for qs-parser
 */
import type { BooleanParseResult } from '../common.js';
import type { BooleanSchema } from './types.js';
import * as validators from './validators.js';

/**
 * Create a boolean schema
 * @returns A new boolean schema
 */
const boolean = (): BooleanSchema => {
  // Create the schema object
  return {
    parse: (value: unknown): BooleanParseResult => {
      // Validate that the value is a boolean
      return validators.validateType(value);
    },
  };
};

export default boolean;
