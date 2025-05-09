/**
 * Common error types and utilities for qs-parser
 */

/**
 * Error codes for date validation
 */
export enum DateErrorCode {
  TYPE = 'date.type',
  MIN = 'date.min',
  MAX = 'date.max',
  PAST = 'date.past',
  FUTURE = 'date.future',
  BETWEEN = 'date.between',
  TODAY = 'date.today',
}

/**
 * Error messages for date validation
 */
export const DateErrorMessages = {
  [DateErrorCode.TYPE]: 'Expected date',
  [DateErrorCode.MIN]: 'Date must be at or after {0}',
  [DateErrorCode.MAX]: 'Date must be at or before {0}',
  [DateErrorCode.PAST]: 'Date must be in the past',
  [DateErrorCode.FUTURE]: 'Date must be in the future',
  [DateErrorCode.BETWEEN]: 'Date must be between {0} and {1}',
  [DateErrorCode.TODAY]: 'Date must be today',
};

/**
 * Error codes for boolean validation
 */
export enum BooleanErrorCode {
  TYPE = 'boolean.type',
}

/**
 * Error messages for boolean validation
 */
export const BooleanErrorMessages = {
  [BooleanErrorCode.TYPE]: 'Expected boolean',
};

/**
 * Error codes for string validation
 */
export enum StringErrorCode {
  TYPE = 'string.type',
  MAX_LENGTH = 'string.maxLength',
  MIN_LENGTH = 'string.minLength',
  PATTERN = 'string.pattern',
  EMAIL = 'string.email',
  URL = 'string.url',
  EMOJI = 'string.emoji',
  UUID = 'string.uuid',
  UUID_V4 = 'string.uuidV4',
  UUID_V7 = 'string.uuidV7',
  CUID = 'string.cuid',
  CUID2 = 'string.cuid2',
  ULID = 'string.ulid',
  INCLUDES = 'string.includes',
  STARTS_WITH = 'string.startsWith',
  ENDS_WITH = 'string.endsWith',
  DATETIME = 'string.datetime',
  IP = 'string.ip',
  CIDR = 'string.cidr',
  CIDR_INVALID_IP = 'string.cidr.invalidIp',
  DATE = 'string.date',
  TIME = 'string.time',
  DURATION = 'string.duration',
  BASE64 = 'string.base64',
}

/**
 * Error messages for string validation
 */
export const StringErrorMessages = {
  [StringErrorCode.TYPE]: 'Expected string',
  [StringErrorCode.MAX_LENGTH]: 'String must be at most {0} characters long',
  [StringErrorCode.MIN_LENGTH]: 'String must be at least {0} characters long',
  [StringErrorCode.PATTERN]: 'String must match pattern {0}',
  [StringErrorCode.EMAIL]: 'String must be a valid email address',
  [StringErrorCode.URL]: 'String must be a valid URL',
  [StringErrorCode.EMOJI]: 'String must contain at least one emoji',
  [StringErrorCode.UUID]: 'String must be a valid UUID',
  [StringErrorCode.UUID_V4]: 'String must be a valid UUID v4',
  [StringErrorCode.UUID_V7]: 'String must be a valid UUID v7',
  [StringErrorCode.CUID]: 'String must be a valid CUID',
  [StringErrorCode.CUID2]: 'String must be a valid CUID2',
  [StringErrorCode.ULID]: 'String must be a valid ULID',
  [StringErrorCode.INCLUDES]: 'String must include "{0}"',
  [StringErrorCode.STARTS_WITH]: 'String must start with "{0}"',
  [StringErrorCode.ENDS_WITH]: 'String must end with "{0}"',
  [StringErrorCode.DATETIME]: 'String must be a valid datetime',
  [StringErrorCode.IP]: 'String must be a valid IP address (IPv4 or IPv6)',
  [StringErrorCode.CIDR]:
    'String must be a valid CIDR notation with a prefix length between 0 and {0}',
  [StringErrorCode.CIDR_INVALID_IP]:
    'String must be a valid CIDR notation with a valid IP address',
  [StringErrorCode.DATE]: 'String must be a valid date',
  [StringErrorCode.TIME]: 'String must be a valid time (HH:MM:SS)',
  [StringErrorCode.DURATION]: 'String must be a valid duration (e.g., PT1H30M)',
  [StringErrorCode.BASE64]: 'String must be a valid base64 encoded string',
};

/**
 * Error codes for number validation
 */
export enum NumberErrorCode {
  TYPE = 'number.type',
  MIN = 'number.min',
  MAX = 'number.max',
  GT = 'number.gt',
  LT = 'number.lt',
  INT = 'number.int',
  POSITIVE = 'number.positive',
  NON_NEGATIVE = 'number.nonNegative',
  NEGATIVE = 'number.negative',
  NON_POSITIVE = 'number.nonPositive',
  MULTIPLE_OF = 'number.multipleOf',
  MULTIPLE_OF_ZERO = 'number.multipleOfZero',
  FINITE = 'number.finite',
  SAFE = 'number.safe',
}

/**
 * Error messages for number validation
 */
export const NumberErrorMessages = {
  [NumberErrorCode.TYPE]: 'Expected number',
  [NumberErrorCode.MIN]: 'Number must be at least {0}',
  [NumberErrorCode.MAX]: 'Number must be at most {0}',
  [NumberErrorCode.GT]: 'Number must be greater than {0}',
  [NumberErrorCode.LT]: 'Number must be less than {0}',
  [NumberErrorCode.INT]: 'Number must be an integer',
  [NumberErrorCode.POSITIVE]: 'Number must be positive',
  [NumberErrorCode.NON_NEGATIVE]: 'Number must be non-negative',
  [NumberErrorCode.NEGATIVE]: 'Number must be negative',
  [NumberErrorCode.NON_POSITIVE]: 'Number must be non-positive',
  [NumberErrorCode.MULTIPLE_OF]: 'Number must be a multiple of {0}',
  [NumberErrorCode.MULTIPLE_OF_ZERO]: 'Cannot check for multiples of zero',
  [NumberErrorCode.FINITE]: 'Number must be finite',
  [NumberErrorCode.SAFE]: 'Number must be a safe integer',
};

/**
 * Error object structure
 */
export type ValidationError = {
  code: string;
  message: string;
};

/**
 * Error codes for object validation
 */
export enum ObjectErrorCode {
  TYPE = 'object.type',
  REQUIRED = 'object.required',
  UNKNOWN_KEYS = 'object.unknownKeys',
}

/**
 * Error messages for object validation
 */
export const ObjectErrorMessages = {
  [ObjectErrorCode.TYPE]: 'Expected object',
  [ObjectErrorCode.REQUIRED]: 'Required key "{0}" is missing',
  [ObjectErrorCode.UNKNOWN_KEYS]: 'Unknown key(s): {0}',
};

/**
 * Error codes for array validation
 */
export enum ArrayErrorCode {
  TYPE = 'array.type',
  MIN_LENGTH = 'array.minLength',
  MAX_LENGTH = 'array.maxLength',
  ITEM_INVALID = 'array.itemInvalid',
}

/**
 * Error messages for array validation
 */
export const ArrayErrorMessages = {
  [ArrayErrorCode.TYPE]: 'Expected array',
  [ArrayErrorCode.MIN_LENGTH]: 'Array must contain at least {0} item(s)',
  [ArrayErrorCode.MAX_LENGTH]: 'Array must contain at most {0} item(s)',
  [ArrayErrorCode.ITEM_INVALID]: 'Invalid item at index {0}',
};

/**
 * Format a message with parameters
 * @param message - The message template
 * @param params - The parameters to insert
 * @returns The formatted message
 */
export const formatMessage = (
  message: string,
  ...params: (string | number | RegExp)[]
): string => {
  return message.replace(/{(\d+)}/g, (match, index) => {
    return params[Number.parseInt(index)] !== undefined
      ? String(params[Number.parseInt(index)])
      : match;
  });
};
