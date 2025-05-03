/**
 * String schema implementation for qs-parser
 * Provides methods for creating and validating string schemas
 */
import { ipVersion, isIP } from 'is-ip';
import { StringErrorCode, StringErrorMessages, formatMessage } from './error.js';
import { StringParseResult } from './common.js';

/**
 * Constraints for string validation
 */
type StringConstraints = {
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
};

/**
 * String schema type
 */
type StringSchema = {
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
};

/**
 * Validation functions for string constraints
 */

/**
 * Validate that a value is a string
 * @param value - The value to validate
 * @returns The validation result
 */
const validateType = (value: unknown): StringParseResult => {
  if (typeof value !== 'string') {
    return {
      success: false,
      value: String(value),
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
const validateMaxLength = (
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
const validateMinLength = (
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
const validatePattern = (
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
const validateEmail = (value: string, isEmail?: boolean): StringParseResult => {
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
const validateUrl = (value: string, isUrl?: boolean): StringParseResult => {
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
const validateEmoji = (value: string, isEmoji?: boolean): StringParseResult => {
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
const validateUuid = (value: string, isUuid?: boolean): StringParseResult => {
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
const validateUuidv4 = (
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
const validateUuidv7 = (
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
const validateCuid = (value: string, isCuid?: boolean): StringParseResult => {
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
const validateCuid2 = (value: string, isCuid2?: boolean): StringParseResult => {
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
const validateUlid = (value: string, isUlid?: boolean): StringParseResult => {
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
const validateIncludes = (
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
const validateStartsWith = (
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
const validateEndsWith = (
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
const validateDatetime = (
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
const validateIp = (value: string, isIp?: boolean): StringParseResult => {
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
const validateCidr = (value: string, isCidr?: boolean): StringParseResult => {
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
          code: StringErrorCode.CIDR,
          message:
            'String must be a valid CIDR notation with a valid IP address',
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
 * Create a string schema
 * @returns A new string schema
 */
const string = (): StringSchema => {
  // Store constraints
  const constraints: StringConstraints = {};

  // Create the schema object
  const schema: StringSchema = {
    parse: (value: unknown): StringParseResult => {
      // First, validate that the value is a string
      const typeResult = validateType(value);
      if (!typeResult.success) {
        return typeResult;
      }

      // Now we know the value is a string
      const stringValue = typeResult.value;

      // Validate each constraint
      const validations = [
        validateMaxLength(stringValue, constraints.maxLength),
        validateMinLength(stringValue, constraints.minLength),
        validatePattern(stringValue, constraints.pattern),
        validateEmail(stringValue, constraints.isEmail),
        validateUrl(stringValue, constraints.isUrl),
        validateEmoji(stringValue, constraints.isEmoji),
        validateUuid(stringValue, constraints.isUuid),
        validateUuidv4(stringValue, constraints.isUuidv4),
        validateUuidv7(stringValue, constraints.isUuidv7),
        validateCuid(stringValue, constraints.isCuid),
        validateCuid2(stringValue, constraints.isCuid2),
        validateUlid(stringValue, constraints.isUlid),
        validateIncludes(stringValue, constraints.includesSubstring),
        validateStartsWith(stringValue, constraints.startsWithPrefix),
        validateEndsWith(stringValue, constraints.endsWithSuffix),
        validateDatetime(stringValue, constraints.isDatetime),
        validateIp(stringValue, constraints.isIp),
        validateCidr(stringValue, constraints.isCidr),
      ];

      // Return the first validation failure, if any
      for (const validation of validations) {
        if (!validation.success) {
          return validation;
        }
      }

      // All constraints passed
      return {
        success: true,
        value: stringValue,
      };
    },

    max: (length: number): StringSchema => {
      // Create a new schema with the max length constraint
      const newConstraints = { ...constraints, maxLength: length };
      return createSchemaWithConstraints(newConstraints);
    },

    min: (length: number): StringSchema => {
      // Create a new schema with the min length constraint
      const newConstraints = { ...constraints, minLength: length };
      return createSchemaWithConstraints(newConstraints);
    },

    pattern: (regex: RegExp): StringSchema => {
      // Create a new schema with the pattern constraint
      const newConstraints = { ...constraints, pattern: regex };
      return createSchemaWithConstraints(newConstraints);
    },

    email: (): StringSchema => {
      // Create a new schema with the email constraint
      const newConstraints = { ...constraints, isEmail: true };
      return createSchemaWithConstraints(newConstraints);
    },

    url: (): StringSchema => {
      // Create a new schema with the URL constraint
      const newConstraints = { ...constraints, isUrl: true };
      return createSchemaWithConstraints(newConstraints);
    },

    emoji: (): StringSchema => {
      // Create a new schema with the emoji constraint
      const newConstraints = { ...constraints, isEmoji: true };
      return createSchemaWithConstraints(newConstraints);
    },

    uuid: (): StringSchema => {
      // Create a new schema with the UUID constraint
      const newConstraints = { ...constraints, isUuid: true };
      return createSchemaWithConstraints(newConstraints);
    },

    uuidv4: (): StringSchema => {
      // Create a new schema with the UUID v4 constraint
      const newConstraints = { ...constraints, isUuidv4: true };
      return createSchemaWithConstraints(newConstraints);
    },

    uuidv7: (): StringSchema => {
      // Create a new schema with the UUID v7 constraint
      const newConstraints = { ...constraints, isUuidv7: true };
      return createSchemaWithConstraints(newConstraints);
    },

    cuid: (): StringSchema => {
      // Create a new schema with the CUID constraint
      const newConstraints = { ...constraints, isCuid: true };
      return createSchemaWithConstraints(newConstraints);
    },

    cuid2: (): StringSchema => {
      // Create a new schema with the CUID2 constraint
      const newConstraints = { ...constraints, isCuid2: true };
      return createSchemaWithConstraints(newConstraints);
    },

    ulid: (): StringSchema => {
      // Create a new schema with the ULID constraint
      const newConstraints = { ...constraints, isUlid: true };
      return createSchemaWithConstraints(newConstraints);
    },

    includes: (substring: string): StringSchema => {
      // Create a new schema with the includes constraint
      const newConstraints = { ...constraints, includesSubstring: substring };
      return createSchemaWithConstraints(newConstraints);
    },

    startsWith: (prefix: string): StringSchema => {
      // Create a new schema with the startsWith constraint
      const newConstraints = { ...constraints, startsWithPrefix: prefix };
      return createSchemaWithConstraints(newConstraints);
    },

    endsWith: (suffix: string): StringSchema => {
      // Create a new schema with the endsWith constraint
      const newConstraints = { ...constraints, endsWithSuffix: suffix };
      return createSchemaWithConstraints(newConstraints);
    },

    datetime: (): StringSchema => {
      // Create a new schema with the datetime constraint
      const newConstraints = { ...constraints, isDatetime: true };
      return createSchemaWithConstraints(newConstraints);
    },

    ip: (): StringSchema => {
      // Create a new schema with the IP address constraint
      const newConstraints = { ...constraints, isIp: true };
      return createSchemaWithConstraints(newConstraints);
    },

    cidr: (): StringSchema => {
      // Create a new schema with the CIDR notation constraint
      const newConstraints = { ...constraints, isCidr: true };
      return createSchemaWithConstraints(newConstraints);
    },
  };

  // Helper function to create a new schema with updated constraints
  const createSchemaWithConstraints = (
    newConstraints: typeof constraints,
  ): StringSchema => {
    // Create a new schema object with the new constraints
    return {
      parse: (value: unknown): StringParseResult => {
        // First, validate that the value is a string
        const typeResult = validateType(value);
        if (!typeResult.success) {
          return typeResult;
        }

        // Now we know the value is a string
        const stringValue = typeResult.value;

        // Validate each constraint with the new constraints
        const validations = [
          validateMaxLength(stringValue, newConstraints.maxLength),
          validateMinLength(stringValue, newConstraints.minLength),
          validatePattern(stringValue, newConstraints.pattern),
          validateEmail(stringValue, newConstraints.isEmail),
          validateUrl(stringValue, newConstraints.isUrl),
          validateEmoji(stringValue, newConstraints.isEmoji),
          validateUuid(stringValue, newConstraints.isUuid),
          validateUuidv4(stringValue, newConstraints.isUuidv4),
          validateUuidv7(stringValue, newConstraints.isUuidv7),
          validateCuid(stringValue, newConstraints.isCuid),
          validateCuid2(stringValue, newConstraints.isCuid2),
          validateUlid(stringValue, newConstraints.isUlid),
          validateIncludes(stringValue, newConstraints.includesSubstring),
          validateStartsWith(stringValue, newConstraints.startsWithPrefix),
          validateEndsWith(stringValue, newConstraints.endsWithSuffix),
          validateDatetime(stringValue, newConstraints.isDatetime),
          validateIp(stringValue, newConstraints.isIp),
          validateCidr(stringValue, newConstraints.isCidr),
        ];

        // Return the first validation failure, if any
        for (const validation of validations) {
          if (!validation.success) {
            return validation;
          }
        }

        // All constraints passed
        return {
          success: true,
          value: stringValue,
        };
      },

      max: (length: number): StringSchema => {
        const updatedConstraints = { ...newConstraints, maxLength: length };
        return createSchemaWithConstraints(updatedConstraints);
      },

      min: (length: number): StringSchema => {
        const updatedConstraints = { ...newConstraints, minLength: length };
        return createSchemaWithConstraints(updatedConstraints);
      },

      pattern: (regex: RegExp): StringSchema => {
        const updatedConstraints = { ...newConstraints, pattern: regex };
        return createSchemaWithConstraints(updatedConstraints);
      },

      email: (): StringSchema => {
        const updatedConstraints = { ...newConstraints, isEmail: true };
        return createSchemaWithConstraints(updatedConstraints);
      },

      url: (): StringSchema => {
        const updatedConstraints = { ...newConstraints, isUrl: true };
        return createSchemaWithConstraints(updatedConstraints);
      },

      emoji: (): StringSchema => {
        const updatedConstraints = { ...newConstraints, isEmoji: true };
        return createSchemaWithConstraints(updatedConstraints);
      },

      uuid: (): StringSchema => {
        const updatedConstraints = { ...newConstraints, isUuid: true };
        return createSchemaWithConstraints(updatedConstraints);
      },

      uuidv4: (): StringSchema => {
        const updatedConstraints = { ...newConstraints, isUuidv4: true };
        return createSchemaWithConstraints(updatedConstraints);
      },

      uuidv7: (): StringSchema => {
        const updatedConstraints = { ...newConstraints, isUuidv7: true };
        return createSchemaWithConstraints(updatedConstraints);
      },

      cuid: (): StringSchema => {
        const updatedConstraints = { ...newConstraints, isCuid: true };
        return createSchemaWithConstraints(updatedConstraints);
      },

      cuid2: (): StringSchema => {
        const updatedConstraints = { ...newConstraints, isCuid2: true };
        return createSchemaWithConstraints(updatedConstraints);
      },

      ulid: (): StringSchema => {
        const updatedConstraints = { ...newConstraints, isUlid: true };
        return createSchemaWithConstraints(updatedConstraints);
      },

      includes: (substring: string): StringSchema => {
        const updatedConstraints = {
          ...newConstraints,
          includesSubstring: substring,
        };
        return createSchemaWithConstraints(updatedConstraints);
      },

      startsWith: (prefix: string): StringSchema => {
        const updatedConstraints = {
          ...newConstraints,
          startsWithPrefix: prefix,
        };
        return createSchemaWithConstraints(updatedConstraints);
      },

      endsWith: (suffix: string): StringSchema => {
        const updatedConstraints = {
          ...newConstraints,
          endsWithSuffix: suffix,
        };
        return createSchemaWithConstraints(updatedConstraints);
      },

      datetime: (): StringSchema => {
        const updatedConstraints = { ...newConstraints, isDatetime: true };
        return createSchemaWithConstraints(updatedConstraints);
      },

      ip: (): StringSchema => {
        const updatedConstraints = { ...newConstraints, isIp: true };
        return createSchemaWithConstraints(updatedConstraints);
      },

      cidr: (): StringSchema => {
        const updatedConstraints = { ...newConstraints, isCidr: true };
        return createSchemaWithConstraints(updatedConstraints);
      },
    };
  };

  return schema;
};

// Export the string schema creator
export default string;
