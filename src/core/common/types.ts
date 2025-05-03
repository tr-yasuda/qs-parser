/**
 * Common types for qs-parser schemas
 */
import type { ValidationError } from '../error.js';

/**
 * Generic parse result interface
 */
export interface ParseResult<T> {
  success: boolean;
  value: T;
  error?: ValidationError;
}

/**
 * Type for string parse results
 */
export type StringParseResult = ParseResult<string>;

/**
 * Type for number parse results
 */
export type NumberParseResult = ParseResult<number>;

/**
 * Type for boolean parse results
 */
export type BooleanParseResult = ParseResult<boolean>;

/**
 * Type for date parse results
 */
export type DateParseResult = ParseResult<Date>;
