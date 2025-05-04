/**
 * Type definitions for string schema
 */

import type { StringParseResult } from '../common/index.js';

/**
 * Options for string schema creation
 */
export type StringSchemaOptions = {
  /**
   * Custom error message to use when validation fails
   */
  message?: string;
};

/**
 * Options for validation methods
 */
export type ValidationOptions = {
  /**
   * Custom error message to use when validation fails
   */
  message?: string;
};

/**
 * Constraints for string validation
 */
export type StringConstraints = {
  maxLength?: number;
  minLength?: number;
  pattern?: RegExp;
  isEmail?: boolean;
  isUrl?: boolean;
  isEmoji?: boolean;
  isUuid?: boolean;
  isUuidV4?: boolean;
  isUuidV7?: boolean;
  isCuid?: boolean;
  isCuid2?: boolean;
  isUlid?: boolean;
  includesSubstring?: string;
  startsWithPrefix?: string;
  endsWithSuffix?: string;
  isDatetime?: boolean;
  isIp?: boolean;
  isCidr?: boolean;
  isDate?: boolean;
  isTime?: boolean;
  isDuration?: boolean;
  isBase64?: boolean;
  trim?: boolean;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
  /**
   * Custom error message to use when type validation fails
   */
  customErrorMessage?: string;
  /**
   * Custom error message to use when min length validation fails
   */
  minLengthErrorMessage?: string;
  /**
   * Custom error message to use when max length validation fails
   */
  maxLengthErrorMessage?: string;
  /**
   * Custom error message to use when pattern validation fails
   */
  patternErrorMessage?: string;
  /**
   * Custom error message to use when email validation fails
   */
  emailErrorMessage?: string;
  /**
   * Custom error message to use when URL validation fails
   */
  urlErrorMessage?: string;
  // Add more custom error messages for other validations as needed
};

/**
 * String schema type
 * Defines the interface for string validation schemas
 */
export type StringSchema = {
  /**
   * Makes the schema accept undefined values
   * @returns A new schema that accepts undefined values
   */
  optional: () => StringSchema & {
    parse: (
      value: unknown,
    ) => StringParseResult | { success: true; value: undefined };
  };

  /**
   * Makes the schema accept null values
   * @returns A new schema that accepts null values
   */
  nullable: () => StringSchema & {
    parse: (
      value: unknown,
    ) => StringParseResult | { success: true; value: null };
  };

  /**
   * Sets a default value for the schema when the input is undefined
   * @param defaultValue - The default value to use when the input is undefined
   * @returns A new schema
   * that uses the default value when the input is undefined
   */
  default: (defaultValue: string) => StringSchema;
  /**
   * Parse and validate a value as a string
   * @param value - The value to validate
   * @returns A parse result containing:
   *   - success: true if validation passed, false otherwise
   *   - value: the original input value (preserved without coercion in error cases)
   *   - error: validation error details if success is false
   */
  parse: (value: unknown) => StringParseResult;
  max: (length: number, options?: ValidationOptions) => StringSchema;
  min: (length: number, options?: ValidationOptions) => StringSchema;
  pattern: (regex: RegExp, options?: ValidationOptions) => StringSchema;
  email: (options?: ValidationOptions) => StringSchema;
  url: (options?: ValidationOptions) => StringSchema;
  emoji: () => StringSchema;
  uuid: () => StringSchema;
  uuidV4: () => StringSchema;
  uuidV7: () => StringSchema;
  cuid: () => StringSchema;
  cuid2: () => StringSchema;
  ulid: () => StringSchema;
  includes: (substring: string) => StringSchema;
  startsWith: (prefix: string) => StringSchema;
  endsWith: (suffix: string) => StringSchema;
  datetime: () => StringSchema;
  ip: () => StringSchema;
  cidr: () => StringSchema;
  date: () => StringSchema;
  time: () => StringSchema;
  duration: () => StringSchema;
  base64: () => StringSchema;
  trim: () => StringSchema;
  toLowerCase: () => StringSchema;
  toUpperCase: () => StringSchema;
};
