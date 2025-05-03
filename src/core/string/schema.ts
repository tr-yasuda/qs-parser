/**
 * String schema implementation for qs-parser
 */
import type { StringParseResult } from '../common.js';
import * as processors from './processors.js';
import type { StringConstraints, StringSchema } from './types.js';
import * as validators from './validators.js';

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
      const typeResult = validators.validateType(value);
      if (!typeResult.success) {
        return typeResult;
      }

      // Now we know the value is a string
      let stringValue = typeResult.value;

      // Apply transformations if specified
      stringValue = processors.processTrim(stringValue, constraints.trim);
      stringValue = processors.processToLowerCase(
        stringValue,
        constraints.toLowerCase,
      );
      stringValue = processors.processToUpperCase(
        stringValue,
        constraints.toUpperCase,
      );

      // Validate each constraint
      const validations = [
        validators.validateMaxLength(stringValue, constraints.maxLength),
        validators.validateMinLength(stringValue, constraints.minLength),
        validators.validatePattern(stringValue, constraints.pattern),
        validators.validateEmail(stringValue, constraints.isEmail),
        validators.validateUrl(stringValue, constraints.isUrl),
        validators.validateEmoji(stringValue, constraints.isEmoji),
        validators.validateUuid(stringValue, constraints.isUuid),
        validators.validateUuidv4(stringValue, constraints.isUuidv4),
        validators.validateUuidv7(stringValue, constraints.isUuidv7),
        validators.validateCuid(stringValue, constraints.isCuid),
        validators.validateCuid2(stringValue, constraints.isCuid2),
        validators.validateUlid(stringValue, constraints.isUlid),
        validators.validateIncludes(stringValue, constraints.includesSubstring),
        validators.validateStartsWith(
          stringValue,
          constraints.startsWithPrefix,
        ),
        validators.validateEndsWith(stringValue, constraints.endsWithSuffix),
        validators.validateDatetime(stringValue, constraints.isDatetime),
        validators.validateIp(stringValue, constraints.isIp),
        validators.validateCidr(stringValue, constraints.isCidr),
        validators.validateDate(stringValue, constraints.isDate),
        validators.validateTime(stringValue, constraints.isTime),
        validators.validateDuration(stringValue, constraints.isDuration),
        validators.validateBase64(stringValue, constraints.isBase64),
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

    date: (): StringSchema => {
      // Create a new schema with the date constraint
      const newConstraints = { ...constraints, isDate: true };
      return createSchemaWithConstraints(newConstraints);
    },

    time: (): StringSchema => {
      // Create a new schema with the time constraint
      const newConstraints = { ...constraints, isTime: true };
      return createSchemaWithConstraints(newConstraints);
    },

    duration: (): StringSchema => {
      // Create a new schema with the duration constraint
      const newConstraints = { ...constraints, isDuration: true };
      return createSchemaWithConstraints(newConstraints);
    },

    base64: (): StringSchema => {
      // Create a new schema with the base64 constraint
      const newConstraints = { ...constraints, isBase64: true };
      return createSchemaWithConstraints(newConstraints);
    },

    trim: (): StringSchema => {
      // Create a new schema with the trim constraint
      const newConstraints = { ...constraints, trim: true };
      return createSchemaWithConstraints(newConstraints);
    },

    toLowerCase: (): StringSchema => {
      // Create a new schema with the toLowerCase constraint
      const newConstraints = { ...constraints, toLowerCase: true };
      return createSchemaWithConstraints(newConstraints);
    },

    toUpperCase: (): StringSchema => {
      // Create a new schema with the toUpperCase constraint
      const newConstraints = { ...constraints, toUpperCase: true };
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
        const typeResult = validators.validateType(value);
        if (!typeResult.success) {
          return typeResult;
        }

        // Now we know the value is a string
        let stringValue = typeResult.value;

        // Apply transformations if specified
        stringValue = processors.processTrim(stringValue, newConstraints.trim);
        stringValue = processors.processToLowerCase(
          stringValue,
          newConstraints.toLowerCase,
        );
        stringValue = processors.processToUpperCase(
          stringValue,
          newConstraints.toUpperCase,
        );

        // Validate each constraint with the new constraints
        const validations = [
          validators.validateMaxLength(stringValue, newConstraints.maxLength),
          validators.validateMinLength(stringValue, newConstraints.minLength),
          validators.validatePattern(stringValue, newConstraints.pattern),
          validators.validateEmail(stringValue, newConstraints.isEmail),
          validators.validateUrl(stringValue, newConstraints.isUrl),
          validators.validateEmoji(stringValue, newConstraints.isEmoji),
          validators.validateUuid(stringValue, newConstraints.isUuid),
          validators.validateUuidv4(stringValue, newConstraints.isUuidv4),
          validators.validateUuidv7(stringValue, newConstraints.isUuidv7),
          validators.validateCuid(stringValue, newConstraints.isCuid),
          validators.validateCuid2(stringValue, newConstraints.isCuid2),
          validators.validateUlid(stringValue, newConstraints.isUlid),
          validators.validateIncludes(
            stringValue,
            newConstraints.includesSubstring,
          ),
          validators.validateStartsWith(
            stringValue,
            newConstraints.startsWithPrefix,
          ),
          validators.validateEndsWith(
            stringValue,
            newConstraints.endsWithSuffix,
          ),
          validators.validateDatetime(stringValue, newConstraints.isDatetime),
          validators.validateIp(stringValue, newConstraints.isIp),
          validators.validateCidr(stringValue, newConstraints.isCidr),
          validators.validateDate(stringValue, newConstraints.isDate),
          validators.validateTime(stringValue, newConstraints.isTime),
          validators.validateDuration(stringValue, newConstraints.isDuration),
          validators.validateBase64(stringValue, newConstraints.isBase64),
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
        return createSchemaWithConstraints({
          ...newConstraints,
          maxLength: length,
        });
      },

      min: (length: number): StringSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          minLength: length,
        });
      },

      pattern: (regex: RegExp): StringSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          pattern: regex,
        });
      },

      email: (): StringSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isEmail: true,
        });
      },

      url: (): StringSchema => {
        return createSchemaWithConstraints({ ...newConstraints, isUrl: true });
      },

      emoji: (): StringSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isEmoji: true,
        });
      },

      uuid: (): StringSchema => {
        return createSchemaWithConstraints({ ...newConstraints, isUuid: true });
      },

      uuidv4: (): StringSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isUuidv4: true,
        });
      },

      uuidv7: (): StringSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isUuidv7: true,
        });
      },

      cuid: (): StringSchema => {
        return createSchemaWithConstraints({ ...newConstraints, isCuid: true });
      },

      cuid2: (): StringSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isCuid2: true,
        });
      },

      ulid: (): StringSchema => {
        return createSchemaWithConstraints({ ...newConstraints, isUlid: true });
      },

      includes: (substring: string): StringSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          includesSubstring: substring,
        });
      },

      startsWith: (prefix: string): StringSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          startsWithPrefix: prefix,
        });
      },

      endsWith: (suffix: string): StringSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          endsWithSuffix: suffix,
        });
      },

      datetime: (): StringSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isDatetime: true,
        });
      },

      ip: (): StringSchema => {
        return createSchemaWithConstraints({ ...newConstraints, isIp: true });
      },

      cidr: (): StringSchema => {
        return createSchemaWithConstraints({ ...newConstraints, isCidr: true });
      },

      date: (): StringSchema => {
        return createSchemaWithConstraints({ ...newConstraints, isDate: true });
      },

      time: (): StringSchema => {
        return createSchemaWithConstraints({ ...newConstraints, isTime: true });
      },

      duration: (): StringSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isDuration: true,
        });
      },

      base64: (): StringSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          isBase64: true,
        });
      },

      trim: (): StringSchema => {
        return createSchemaWithConstraints({ ...newConstraints, trim: true });
      },

      toLowerCase: (): StringSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          toLowerCase: true,
        });
      },

      toUpperCase: (): StringSchema => {
        return createSchemaWithConstraints({
          ...newConstraints,
          toUpperCase: true,
        });
      },
    };
  };

  return schema;
};

export default string;
