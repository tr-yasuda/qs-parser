/**
 * Type definitions for string schema
 */
import type { StringParseResult } from '../common.js';

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
  isUuidv4?: boolean;
  isUuidv7?: boolean;
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
};

/**
 * String schema type
 * Defines the interface for string validation schemas
 */
export type StringSchema = {
  /**
   * Parse and validate a value as a string
   * @param value - The value to validate
   * @returns A parse result containing:
   *   - success: true if validation passed, false otherwise
   *   - value: the original input value (preserved without coercion in error cases)
   *   - error: validation error details if success is false
   */
  parse: (value: unknown) => StringParseResult;
  max: (length: number) => StringSchema;
  min: (length: number) => StringSchema;
  pattern: (regex: RegExp) => StringSchema;
  email: () => StringSchema;
  url: () => StringSchema;
  emoji: () => StringSchema;
  uuid: () => StringSchema;
  uuidv4: () => StringSchema;
  uuidv7: () => StringSchema;
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
