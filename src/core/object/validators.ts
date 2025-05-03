/**
 * Validation functions for object schema
 */
import type { ObjectParseResult } from '../common/index.js';
import { ObjectErrorCode, ObjectErrorMessages } from '../error.js';
import type { ShapeDefinition } from './types.js';

/**
 * Get a string representation of a value's type
 * @param value - The value to get the type of
 * @returns A string representation of the value's type
 */
const getValueType = (value: unknown): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

/**
 * Validate that a value is an object
 * @param value - The value to validate
 * @returns The validation result with the original input value preserved in error cases.
 */
export const validateType = (value: unknown): ObjectParseResult => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {
      success: false,
      value: value as Record<string, unknown>,
      error: {
        code: ObjectErrorCode.TYPE,
        message: `${ObjectErrorMessages[ObjectErrorCode.TYPE]}, got ${getValueType(value)}`,
      },
    };
  }
  return { success: true, value: value as Record<string, unknown> };
};

/**
 * Validate that an object matches a shape definition
 * @param value - The object to validate
 * @param shape - The shape definition to validate against
 * @param strict - Whether to reject unknown keys
 * @returns The validation result
 */
export const validateShape = (
  value: Record<string, unknown>,
  shape: ShapeDefinition,
  strict = false,
): ObjectParseResult => {
  // Check for required keys
  for (const key of Object.keys(shape)) {
    if (!(key in value)) {
      return {
        success: false,
        value,
        error: {
          code: ObjectErrorCode.REQUIRED,
          message: ObjectErrorMessages[ObjectErrorCode.REQUIRED].replace(
            '{0}',
            key,
          ),
        },
      };
    }
  }

  // Check for unknown keys if strict mode is enabled
  if (strict) {
    const unknownKeys = Object.keys(value).filter((key) => !(key in shape));
    if (unknownKeys.length > 0) {
      return {
        success: false,
        value,
        error: {
          code: ObjectErrorCode.UNKNOWN_KEYS,
          message: ObjectErrorMessages[ObjectErrorCode.UNKNOWN_KEYS].replace(
            '{0}',
            unknownKeys.join(', '),
          ),
        },
      };
    }
  }

  return { success: true, value };
};
