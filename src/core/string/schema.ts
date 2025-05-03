/**
 * String schema implementation for qs-parser
 */
import type { StringParseResult } from '../common/index.js';
import {
  defaultValue as makeDefault,
  nullable as makeNullable,
  optional as makeOptional,
} from '../common/schema.js';
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
      optional: function () {
        return makeOptional(this);
      },

      nullable: function () {
        return makeNullable(this);
      },

      default: function (defaultValue: string) {
        return makeDefault(this, defaultValue);
      },

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
          validators.validateUuidV4(stringValue, newConstraints.isUuidV4),
          validators.validateUuidV7(stringValue, newConstraints.isUuidV7),
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

      uuidV4: (): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isUuidV4: true,
          },
          createStringSchema,
        );
      },

      uuidV7: (): StringSchema => {
        return createSchemaWithConstraints(
          {
            ...newConstraints,
            isUuidV7: true,
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

  // Create the schema object with the common methods
  return createStringSchema(constraints);
};

export default string;
