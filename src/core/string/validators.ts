/**
 * Validation functions for string schema
 */
import { ipVersion, isIP } from 'is-ip';
import type { StringParseResult } from '../common.js';
import {
  StringErrorCode,
  StringErrorMessages,
  formatMessage,
} from '../error.js';

/**
 * Validate that a value is a string
 * @param value - The value to validate
 * @returns The validation result with the original input value preserved in error cases.
 *          Note: The type assertion (value as string) does not perform any transformation
 *          at runtime; it only informs TypeScript about the expected type.
 */
export const validateType = (value: unknown): StringParseResult => {
  if (typeof value !== 'string') {
    return {
      success: false,
      value: value as string, // Original value preserved without coercion
      error: {
        code: StringErrorCode.TYPE,
        message: `${StringErrorMessages[StringErrorCode.TYPE]}, got ${typeof value}`,
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate maximum length constraint
 * @param value - The string to validate
 * @param maxLength - The maximum allowed length
 * @returns The validation result
 */
export const validateMaxLength = (
  value: string,
  maxLength?: number,
): StringParseResult => {
  if (maxLength !== undefined && value.length > maxLength) {
    return {
      success: false,
      value,
      error: {
        code: StringErrorCode.MAX_LENGTH,
        message: formatMessage(
          StringErrorMessages[StringErrorCode.MAX_LENGTH],
          maxLength,
        ),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate minimum length constraint
 * @param value - The string to validate
 * @param minLength - The minimum allowed length
 * @returns The validation result
 */
export const validateMinLength = (
  value: string,
  minLength?: number,
): StringParseResult => {
  if (minLength !== undefined && value.length < minLength) {
    return {
      success: false,
      value,
      error: {
        code: StringErrorCode.MIN_LENGTH,
        message: formatMessage(
          StringErrorMessages[StringErrorCode.MIN_LENGTH],
          minLength,
        ),
      },
    };
  }

  return { success: true, value };
};

/**
 * Validate pattern constraint
 * @param value - The string to validate
 * @param pattern - The pattern to match
 * @returns The validation result
 */
export const validatePattern = (
  value: string,
  pattern?: RegExp,
): StringParseResult => {
  if (pattern !== undefined && !pattern.test(value)) {
    return {
      success: false,
      value,
      error: {
        code: StringErrorCode.PATTERN,
        message: formatMessage(
          StringErrorMessages[StringErrorCode.PATTERN],
          pattern,
        ),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate email constraint
 * @param value - The string to validate
 * @param isEmail - Whether to validate as email
 * @returns The validation result
 */
export const validateEmail = (
  value: string,
  isEmail?: boolean,
): StringParseResult => {
  if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return {
      success: false,
      value,
      error: {
        code: StringErrorCode.EMAIL,
        message: StringErrorMessages[StringErrorCode.EMAIL],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate URL constraint
 * @param value - The string to validate
 * @param isUrl - Whether to validate as URL
 * @returns The validation result
 */
export const validateUrl = (
  value: string,
  isUrl?: boolean,
): StringParseResult => {
  if (isUrl) {
    try {
      new URL(value);
    } catch (_) {
      return {
        success: false,
        value,
        error: {
          code: StringErrorCode.URL,
          message: StringErrorMessages[StringErrorCode.URL],
        },
      };
    }
  }
  return { success: true, value };
};

/**
 * Validate emoji constraint
 * @param value - The string to validate
 * @param isEmoji - Whether to validate as containing emoji
 * @returns The validation result
 */
export const validateEmoji = (
  value: string,
  isEmoji?: boolean,
): StringParseResult => {
  if (isEmoji && !/\p{Emoji}/u.test(value)) {
    return {
      success: false,
      value,
      error: {
        code: StringErrorCode.EMOJI,
        message: StringErrorMessages[StringErrorCode.EMOJI],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate UUID constraint
 * @param value - The string to validate
 * @param isUuid - Whether to validate as UUID
 * @returns The validation result
 */
export const validateUuid = (
  value: string,
  isUuid?: boolean,
): StringParseResult => {
  if (
    isUuid &&
    !/^[\da-f]{8}-[\da-f]{4}-[1-5][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(
      value,
    )
  ) {
    return {
      success: false,
      value,
      error: {
        code: StringErrorCode.UUID,
        message: StringErrorMessages[StringErrorCode.UUID],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate UUID v4 constraint
 * @param value - The string to validate
 * @param isUuidv4 - Whether to validate as UUID v4
 * @returns The validation result
 */
export const validateUuidv4 = (
  value: string,
  isUuidv4?: boolean,
): StringParseResult => {
  if (
    isUuidv4 &&
    !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(
      value,
    )
  ) {
    return {
      success: false,
      value,
      error: {
        code: StringErrorCode.UUID_V4,
        message: StringErrorMessages[StringErrorCode.UUID_V4],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate UUID v7 constraint
 * @param value - The string to validate
 * @param isUuidv7 - Whether to validate as UUID v7
 * @returns The validation result
 */
export const validateUuidv7 = (
  value: string,
  isUuidv7?: boolean,
): StringParseResult => {
  if (
    isUuidv7 &&
    !/^[\da-f]{8}-[\da-f]{4}-7[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(
      value,
    )
  ) {
    return {
      success: false,
      value,
      error: {
        code: StringErrorCode.UUID_V7,
        message: StringErrorMessages[StringErrorCode.UUID_V7],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate CUID constraint
 * @param value - The string to validate
 * @param isCuid - Whether to validate as CUID
 * @returns The validation result
 */
export const validateCuid = (
  value: string,
  isCuid?: boolean,
): StringParseResult => {
  if (isCuid && !/^c[a-z\d]{24}$/i.test(value)) {
    return {
      success: false,
      value,
      error: {
        code: StringErrorCode.CUID,
        message: StringErrorMessages[StringErrorCode.CUID],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate CUID2 constraint
 * @param value - The string to validate
 * @param isCuid2 - Whether to validate as CUID2
 * @returns The validation result
 */
export const validateCuid2 = (
  value: string,
  isCuid2?: boolean,
): StringParseResult => {
  // CUID2 is typically 24 characters long and uses base36 (0-9, a-z)
  if (isCuid2 && !/^[a-z0-9]{24}$/i.test(value)) {
    return {
      success: false,
      value,
      error: {
        code: StringErrorCode.CUID2,
        message: StringErrorMessages[StringErrorCode.CUID2],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate ULID constraint
 * @param value - The string to validate
 * @param isUlid - Whether to validate as ULID
 * @returns The validation result
 */
export const validateUlid = (
  value: string,
  isUlid?: boolean,
): StringParseResult => {
  if (isUlid && !/^[\dA-HJKMNP-TV-Z]{26}$/i.test(value)) {
    return {
      success: false,
      value,
      error: {
        code: StringErrorCode.ULID,
        message: StringErrorMessages[StringErrorCode.ULID],
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate includes constraint
 * @param value - The string to validate
 * @param includesSubstring - The substring that must be included
 * @returns The validation result
 */
export const validateIncludes = (
  value: string,
  includesSubstring?: string,
): StringParseResult => {
  if (includesSubstring !== undefined && !value.includes(includesSubstring)) {
    return {
      success: false,
      value,
      error: {
        code: StringErrorCode.INCLUDES,
        message: formatMessage(
          StringErrorMessages[StringErrorCode.INCLUDES],
          includesSubstring,
        ),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate startsWith constraint
 * @param value - The string to validate
 * @param startsWithPrefix - The prefix that the string must start with
 * @returns The validation result
 */
export const validateStartsWith = (
  value: string,
  startsWithPrefix?: string,
): StringParseResult => {
  if (startsWithPrefix !== undefined && !value.startsWith(startsWithPrefix)) {
    return {
      success: false,
      value,
      error: {
        code: StringErrorCode.STARTS_WITH,
        message: formatMessage(
          StringErrorMessages[StringErrorCode.STARTS_WITH],
          startsWithPrefix,
        ),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate endsWith constraint
 * @param value - The string to validate
 * @param endsWithSuffix - The suffix that the string must end with
 * @returns The validation result
 */
export const validateEndsWith = (
  value: string,
  endsWithSuffix?: string,
): StringParseResult => {
  if (endsWithSuffix !== undefined && !value.endsWith(endsWithSuffix)) {
    return {
      success: false,
      value,
      error: {
        code: StringErrorCode.ENDS_WITH,
        message: formatMessage(
          StringErrorMessages[StringErrorCode.ENDS_WITH],
          endsWithSuffix,
        ),
      },
    };
  }
  return { success: true, value };
};

/**
 * Validate datetime constraint
 * @param value - The string to validate
 * @param isDatetime - Whether to validate as datetime
 * @returns The validation result
 */
export const validateDatetime = (
  value: string,
  isDatetime?: boolean,
): StringParseResult => {
  if (isDatetime) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return {
        success: false,
        value,
        error: {
          code: StringErrorCode.DATETIME,
          message: StringErrorMessages[StringErrorCode.DATETIME],
        },
      };
    }
  }
  return { success: true, value };
};

/**
 * Validate IP address constraint
 * @param value - The string to validate
 * @param isIp - Whether to validate as IP address
 * @returns The validation result
 */
export const validateIp = (
  value: string,
  isIp?: boolean,
): StringParseResult => {
  if (isIp) {
    // Use is-ip package instead of Node.js built-in isIP function
    // isIP returns true for valid IP addresses (IPv4 or IPv6), false otherwise
    if (!isIP(value)) {
      return {
        success: false,
        value,
        error: {
          code: StringErrorCode.IP,
          message: StringErrorMessages[StringErrorCode.IP],
        },
      };
    }
  }
  return { success: true, value };
};

/**
 * Validate CIDR notation constraint
 * @param value - The string to validate
 * @param isCidr - Whether to validate as CIDR notation
 * @returns The validations result
 */
export const validateCidr = (
  value: string,
  isCidr?: boolean,
): StringParseResult => {
  if (isCidr) {
    // Split the CIDR notation into IP address and prefix length
    const [ipAddress, prefixLength] = value.split('/');

    // Check if the IP address is valid using ipVersion from is-ip package
    // ipVersion returns 4 for IPv4, 6 for IPv6, or undefined for invalid IP
    const version = ipVersion(ipAddress);
    if (version === undefined) {
      return {
        success: false,
        value,
        error: {
          code: StringErrorCode.CIDR_INVALID_IP,
          message: StringErrorMessages[StringErrorCode.CIDR_INVALID_IP],
        },
      };
    }

    // Check if the prefix length is valid
    const prefix = Number(prefixLength);
    const maxPrefix = version === 4 ? 32 : 128; // IPv4 max is 32, IPv6 max is 128

    if (Number.isNaN(prefix) || prefix < 0 || prefix > maxPrefix) {
      return {
        success: false,
        value,
        error: {
          code: StringErrorCode.CIDR,
          message: formatMessage(
            StringErrorMessages[StringErrorCode.CIDR],
            maxPrefix,
          ),
        },
      };
    }
  }
  return { success: true, value };
};

/**
 * Validate date constraint
 * @param value - The string to validate
 * @param isDate - Whether to validate as date
 * @returns The validation result
 */
export const validateDate = (
  value: string,
  isDate?: boolean,
): StringParseResult => {
  if (isDate) {
    // Check if the string is a valid date in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return {
        success: false,
        value,
        error: {
          code: StringErrorCode.DATE,
          message: StringErrorMessages[StringErrorCode.DATE],
        },
      };
    }

    // Check if the date is valid
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return {
        success: false,
        value,
        error: {
          code: StringErrorCode.DATE,
          message: StringErrorMessages[StringErrorCode.DATE],
        },
      };
    }
  }
  return { success: true, value };
};

/**
 * Validate time constraint
 * @param value - The string to validate
 * @param isTime - Whether to validate as time
 * @returns The validation result
 */
export const validateTime = (
  value: string,
  isTime?: boolean,
): StringParseResult => {
  if (isTime) {
    // Check if the string is a valid time in HH:MM:SS format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!timeRegex.test(value)) {
      return {
        success: false,
        value,
        error: {
          code: StringErrorCode.TIME,
          message: StringErrorMessages[StringErrorCode.TIME],
        },
      };
    }
  }
  return { success: true, value };
};

/**
 * Validate duration constraint
 * @param value - The string to validate
 * @param isDuration - Whether to validate as duration
 * @returns The validation result
 */
export const validateDuration = (
  value: string,
  isDuration?: boolean,
): StringParseResult => {
  if (isDuration) {
    // Check if the string is a valid ISO 8601 duration
    // Format: PT[nH][nM][nS] where n is a number
    // Examples: PT1H30M, PT10S, PT1H30M10S
    const durationRegex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    if (!durationRegex.test(value) || value === 'PT') {
      return {
        success: false,
        value,
        error: {
          code: StringErrorCode.DURATION,
          message: StringErrorMessages[StringErrorCode.DURATION],
        },
      };
    }
  }
  return { success: true, value };
};

/**
 * Validate base64 constraint
 * @param value - The string to validate
 * @param isBase64 - Whether to validate as base64
 * @returns The validation result
 */
export const validateBase64 = (
  value: string,
  isBase64?: boolean,
): StringParseResult => {
  if (isBase64) {
    // Check if the string is a valid base64 encoded string
    // Base64 characters: A-Z, a-z, 0-9, +, /, and = for padding
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(value)) {
      return {
        success: false,
        value,
        error: {
          code: StringErrorCode.BASE64,
          message: StringErrorMessages[StringErrorCode.BASE64],
        },
      };
    }

    // Check if the length is valid (must be a multiple of 4)
    if (value.length % 4 !== 0) {
      return {
        success: false,
        value,
        error: {
          code: StringErrorCode.BASE64,
          message: StringErrorMessages[StringErrorCode.BASE64],
        },
      };
    }
  }
  return { success: true, value };
};
