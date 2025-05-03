/**
 * Type definitions for boolean schema
 */
import type { BooleanParseResult } from '../common.js';

/**
 * Boolean schema type
 * Defines the interface for boolean validation schemas
 */
export type BooleanSchema = {
  /**
   * Parse and validate a value as a boolean
   * @param value - The value to validate
   * @returns A parse result containing:
   *   - success: true if validation passed, false otherwise
   *   - value: the original input value (preserved without coercion in error cases)
   *   - error: validation error details if success is false
   */
  parse: (value: unknown) => BooleanParseResult;
};
