/**
 * String schema implementation for qs-parser
 */
import type { StringParseResult } from '../common.js';
import { createSchemaWithConstraints } from '../utils/schema.js';
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

  // Helper function to create a new schema with updated constraints
  const createStringSchema = (
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
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            maxLength: length,
          },
          createStringSchema,
        );
      },

      min: (length: number): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            minLength: length,
          },
          createStringSchema,
        );
      },

      pattern: (regex: RegExp): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            pattern: regex,
          },
          createStringSchema,
        );
      },

      email: (): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isEmail: true,
          },
          createStringSchema,
        );
      },

      url: (): StringSchema => {
        return createSchemaWithConstraints(
          { ...newConstraints, isUrl: true },
          createStringSchema,
        );
      },

      emoji: (): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isEmoji: true,
          },
          createStringSchema,
        );
      },

      uuid: (): StringSchema => {
        return createSchemaWithConstraints(
          { ...newConstraints, isUuid: true },
          createStringSchema,
        );
      },

      uuidv4: (): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isUuidv4: true,
          },
          createStringSchema,
        );
      },

      uuidv7: (): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isUuidv7: true,
          },
          createStringSchema,
        );
      },

      cuid: (): StringSchema => {
        return createSchemaWithConstraints(
          { ...newConstraints, isCuid: true },
          createStringSchema,
        );
      },

      cuid2: (): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isCuid2: true,
          },
          createStringSchema,
        );
      },

      ulid: (): StringSchema => {
        return createSchemaWithConstraints(
          { ...newConstraints, isUlid: true },
          createStringSchema,
        );
      },

      includes: (substring: string): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            includesSubstring: substring,
          },
          createStringSchema,
        );
      },

      startsWith: (prefix: string): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            startsWithPrefix: prefix,
          },
          createStringSchema,
        );
      },

      endsWith: (suffix: string): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            endsWithSuffix: suffix,
          },
          createStringSchema,
        );
      },

      datetime: (): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isDatetime: true,
          },
          createStringSchema,
        );
      },

      ip: (): StringSchema => {
        return createSchemaWithConstraints(
          { ...newConstraints, isIp: true },
          createStringSchema,
        );
      },

      cidr: (): StringSchema => {
        return createSchemaWithConstraints(
          { ...newConstraints, isCidr: true },
          createStringSchema,
        );
      },

      date: (): StringSchema => {
        return createSchemaWithConstraints(
          { ...newConstraints, isDate: true },
          createStringSchema,
        );
      },

      time: (): StringSchema => {
        return createSchemaWithConstraints(
          { ...newConstraints, isTime: true },
          createStringSchema,
        );
      },

      duration: (): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isDuration: true,
          },
          createStringSchema,
        );
      },

      base64: (): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isBase64: true,
          },
          createStringSchema,
        );
      },

      trim: (): StringSchema => {
        return createSchemaWithConstraints(
          { ...newConstraints, trim: true },
          createStringSchema,
        );
      },

      toLowerCase: (): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            toLowerCase: true,
          },
          createStringSchema,
        );
      },

      toUpperCase: (): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            toUpperCase: true,
          },
          createStringSchema,
        );
      },
    };
  };

  // Create the schema object
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
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    min: (length: number): StringSchema => {
      // Create a new schema with the min length constraint
      const newConstraints = { ...constraints, minLength: length };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    pattern: (regex: RegExp): StringSchema => {
      // Create a new schema with the pattern constraint
      const newConstraints = { ...constraints, pattern: regex };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    email: (): StringSchema => {
      // Create a new schema with the email constraint
      const newConstraints = { ...constraints, isEmail: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    url: (): StringSchema => {
      // Create a new schema with the URL constraint
      const newConstraints = { ...constraints, isUrl: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    emoji: (): StringSchema => {
      // Create a new schema with the emoji constraint
      const newConstraints = { ...constraints, isEmoji: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    uuid: (): StringSchema => {
      // Create a new schema with the UUID constraint
      const newConstraints = { ...constraints, isUuid: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    uuidv4: (): StringSchema => {
      // Create a new schema with the UUID v4 constraint
      const newConstraints = { ...constraints, isUuidv4: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    uuidv7: (): StringSchema => {
      // Create a new schema with the UUID v7 constraint
      const newConstraints = { ...constraints, isUuidv7: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    cuid: (): StringSchema => {
      // Create a new schema with the CUID constraint
      const newConstraints = { ...constraints, isCuid: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    cuid2: (): StringSchema => {
      // Create a new schema with the CUID2 constraint
      const newConstraints = { ...constraints, isCuid2: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    ulid: (): StringSchema => {
      // Create a new schema with the ULID constraint
      const newConstraints = { ...constraints, isUlid: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    includes: (substring: string): StringSchema => {
      // Create a new schema with the includes constraint
      const newConstraints = { ...constraints, includesSubstring: substring };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    startsWith: (prefix: string): StringSchema => {
      // Create a new schema with the startsWith constraint
      const newConstraints = { ...constraints, startsWithPrefix: prefix };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    endsWith: (suffix: string): StringSchema => {
      // Create a new schema with the endsWith constraint
      const newConstraints = { ...constraints, endsWithSuffix: suffix };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    datetime: (): StringSchema => {
      // Create a new schema with the datetime constraint
      const newConstraints = { ...constraints, isDatetime: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    ip: (): StringSchema => {
      // Create a new schema with the IP address constraint
      const newConstraints = { ...constraints, isIp: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    cidr: (): StringSchema => {
      // Create a new schema with the CIDR notation constraint
      const newConstraints = { ...constraints, isCidr: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    date: (): StringSchema => {
      // Create a new schema with the date constraint
      const newConstraints = { ...constraints, isDate: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    time: (): StringSchema => {
      // Create a new schema with the time constraint
      const newConstraints = { ...constraints, isTime: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    duration: (): StringSchema => {
      // Create a new schema with the duration constraint
      const newConstraints = { ...constraints, isDuration: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    base64: (): StringSchema => {
      // Create a new schema with the base64 constraint
      const newConstraints = { ...constraints, isBase64: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    trim: (): StringSchema => {
      // Create a new schema with the trim constraint
      const newConstraints = { ...constraints, trim: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    toLowerCase: (): StringSchema => {
      // Create a new schema with the toLowerCase constraint
      const newConstraints = { ...constraints, toLowerCase: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },

    toUpperCase: (): StringSchema => {
      // Create a new schema with the toUpperCase constraint
      const newConstraints = { ...constraints, toUpperCase: true };
      return createSchemaWithConstraints(newConstraints, createStringSchema);
    },
  };
};

export default string;
