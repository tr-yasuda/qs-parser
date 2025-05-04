import { describe, expect, it } from 'vitest';
import {
  ObjectErrorCode,
  ObjectErrorMessages,
  formatMessage,
} from '../../src/core/error.js';
import { q } from '../../src/index.js';

describe('object schema', () => {
  it('should validate objects', () => {
    const schema = q.object();

    // Valid object (empty)
    const result1 = schema.parse({});
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual({});

    // Valid object (with properties)
    const objectValue = { name: 'John', age: 30 };
    const result2 = schema.parse(objectValue);
    expect(result2.success).toBe(true);
    expect(result2.value).toEqual(objectValue);

    // Non-object value (string)
    const stringValue = 'not an object';
    const result3 = schema.parse(stringValue);
    expect(result3.success).toBe(false);
    expect(result3.value).toBe(stringValue); // Original value is preserved
    expect(result3.error?.message).toContain(
      ObjectErrorMessages[ObjectErrorCode.TYPE],
    );
    expect(result3.error?.code).toBe(ObjectErrorCode.TYPE);

    // Non-object value (number)
    const numberValue = 123;
    const result4 = schema.parse(numberValue);
    expect(result4.success).toBe(false);
    expect(result4.value).toBe(numberValue); // Original value is preserved
    expect(result4.error?.message).toContain(
      ObjectErrorMessages[ObjectErrorCode.TYPE],
    );
    expect(result4.error?.code).toBe(ObjectErrorCode.TYPE);

    // Non-object value (boolean)
    const booleanValue = true;
    const result5 = schema.parse(booleanValue);
    expect(result5.success).toBe(false);
    expect(result5.value).toBe(booleanValue); // Original value is preserved
    expect(result5.error?.message).toContain(
      ObjectErrorMessages[ObjectErrorCode.TYPE],
    );
    expect(result5.error?.code).toBe(ObjectErrorCode.TYPE);

    // Non-object value (null)
    const nullValue = null;
    const result6 = schema.parse(nullValue);
    expect(result6.success).toBe(false);
    expect(result6.value).toBe(nullValue); // Original value is preserved
    expect(result6.error?.message).toContain(
      ObjectErrorMessages[ObjectErrorCode.TYPE],
    );
    expect(result6.error?.code).toBe(ObjectErrorCode.TYPE);

    // Non-object value (array)
    const arrayValue = [1, 2, 3];
    const result7 = schema.parse(arrayValue);
    expect(result7.success).toBe(false);
    expect(result7.value).toBe(arrayValue); // Original value is preserved
    expect(result7.error?.message).toContain(
      ObjectErrorMessages[ObjectErrorCode.TYPE],
    );
    expect(result7.error?.code).toBe(ObjectErrorCode.TYPE);

    // Non-object value (undefined)
    const undefinedValue = undefined;
    const result8 = schema.parse(undefinedValue);
    expect(result8.success).toBe(false);
    expect(result8.value).toBe(undefinedValue); // Original value is preserved
    expect(result8.error?.message).toContain(
      ObjectErrorMessages[ObjectErrorCode.TYPE],
    );
    expect(result8.error?.code).toBe(ObjectErrorCode.TYPE);
  });

  it('should validate object shape', () => {
    // Create a schema with a shape
    const shape = {
      name: q.string(),
      age: q.number(),
    };
    const schema = q.object(shape);

    // Valid object (matching shape)
    const validObject = { name: 'John', age: 30 };
    const result1 = schema.parse(validObject);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validObject);

    // Invalid object (missing required property)
    const missingProperty = { name: 'John' };
    const result2 = schema.parse(missingProperty);
    expect(result2.success).toBe(false);
    expect(result2.value).toEqual(missingProperty);
    expect(result2.error?.code).toBe(ObjectErrorCode.REQUIRED);
    expect(result2.error?.message).toContain(
      formatMessage(ObjectErrorMessages[ObjectErrorCode.REQUIRED], 'age'),
    );

    // Valid object (extra properties allowed by default)
    const extraProperties = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
    };
    const result3 = schema.parse(extraProperties);
    expect(result3.success).toBe(true);
    expect(result3.value).toEqual(extraProperties);
  });

  it('should validate strict mode', () => {
    // Create a schema with a shape and strict mode
    const shape = {
      name: q.string(),
      age: q.number(),
    };
    const schema = q.object(shape).strict();

    // Valid object (matching shape exactly)
    const validObject = { name: 'John', age: 30 };
    const result1 = schema.parse(validObject);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validObject);

    // Invalid object (extra properties not allowed in strict mode)
    const extraProperties = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
    };
    const result2 = schema.parse(extraProperties);
    expect(result2.success).toBe(false);
    expect(result2.value).toEqual(extraProperties);
    expect(result2.error?.code).toBe(ObjectErrorCode.UNKNOWN_KEYS);
    expect(result2.error?.message).toContain(
      formatMessage(ObjectErrorMessages[ObjectErrorCode.UNKNOWN_KEYS], 'email'),
    );
  });

  it('should validate q.object(shape).strict() with nested objects and multiple unknown keys', () => {
    // Create a schema with nested shapes and strict mode
    const addressShape = {
      street: q.string(),
      city: q.string(),
      zipCode: q.string(),
    };

    const userShape = {
      name: q.string(),
      age: q.number(),
      address: q.object(addressShape),
    };

    const schema = q.object(userShape).strict();

    // Valid object (matching shape exactly)
    const validObject = {
      name: 'John',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'New York',
        zipCode: '10001',
      },
    };
    const result1 = schema.parse(validObject);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validObject);

    // Invalid object (multiple extra properties not allowed in strict mode)
    const extraProperties = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
      phone: '123-456-7890',
      address: {
        street: '123 Main St',
        city: 'New York',
        zipCode: '10001',
      },
    };
    const result2 = schema.parse(extraProperties);
    expect(result2.success).toBe(false);
    expect(result2.value).toEqual(extraProperties);
    expect(result2.error?.code).toBe(ObjectErrorCode.UNKNOWN_KEYS);
    // Should contain both unknown keys in the error message
    expect(result2.error?.message).toContain('email');
    expect(result2.error?.message).toContain('phone');

    // Test with a non-strict nested object inside strict parent
    const mixedSchema = q
      .object({
        name: q.string(),
        profile: q.object({
          bio: q.string(),
          skills: q.string(),
        }), // non-strict nested object
      })
      .strict(); // strict parent

    const validMixedObject = {
      name: 'John',
      profile: {
        bio: 'Developer',
        skills: 'JavaScript, TypeScript',
        // Extra property in a non-strict nested object should be allowed
        experience: '5 years',
      },
    };

    const result3 = mixedSchema.parse(validMixedObject);
    expect(result3.success).toBe(true);
    expect(result3.value).toEqual(validMixedObject);

    // But extra properties at the top level should still be rejected
    const invalidMixedObject = {
      name: 'John',
      profile: {
        bio: 'Developer',
        skills: 'JavaScript, TypeScript',
      },
      extraTopLevel: true,
    };

    const result4 = mixedSchema.parse(invalidMixedObject);
    expect(result4.success).toBe(false);
    expect(result4.error?.code).toBe(ObjectErrorCode.UNKNOWN_KEYS);
    expect(result4.error?.message).toContain('extraTopLevel');
  });

  it('should support optional objects', () => {
    const schema = q.object().optional();

    // Valid object
    const validObject = { name: 'John' };
    const result1 = schema.parse(validObject);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validObject);

    // Undefined value (allowed with optional)
    const result2 = schema.parse(undefined);
    expect(result2.success).toBe(true);
    expect(result2.value).toBe(undefined);

    // Null value (not allowed with optional)
    const result3 = schema.parse(null);
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(ObjectErrorCode.TYPE);
  });

  it('should support nullable objects', () => {
    const schema = q.object().nullable();

    // Valid object
    const validObject = { name: 'John' };
    const result1 = schema.parse(validObject);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validObject);

    // Null value (allowed with nullable)
    const result2 = schema.parse(null);
    expect(result2.success).toBe(true);
    expect(result2.value).toBe(null);

    // Undefined value (not allowed with nullable)
    const result3 = schema.parse(undefined);
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(ObjectErrorCode.TYPE);
  });

  it('should support default values', () => {
    const defaultValue = { name: 'Default', age: 0 };
    const schema = q.object().default(defaultValue);

    // Valid object
    const validObject = { name: 'John', age: 30 };
    const result1 = schema.parse(validObject);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validObject);

    // Undefined value (uses default)
    const result2 = schema.parse(undefined);
    expect(result2.success).toBe(true);
    expect(result2.value).toEqual(defaultValue);

    // Null value (not allowed with default)
    const result3 = schema.parse(null);
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(ObjectErrorCode.TYPE);
  });

  it('should support chaining methods', () => {
    const defaultValue = { name: 'Default', age: 0 };
    const shape = {
      name: q.string(),
      age: q.number(),
    };

    // Chain multiple methods
    const schema = q.object(shape).nullable().default(defaultValue);

    // Valid object
    const validObject = { name: 'John', age: 30 };
    const result1 = schema.parse(validObject);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validObject);

    // Null value (allowed with nullable)
    const result2 = schema.parse(null);
    expect(result2.success).toBe(true);
    expect(result2.value).toBe(null);

    // Undefined value (uses default)
    const result3 = schema.parse(undefined);
    expect(result3.success).toBe(true);
    expect(result3.value).toEqual(defaultValue);

    // Invalid object (missing required property)
    const missingProperty = { name: 'John' };
    const result4 = schema.parse(missingProperty);
    expect(result4.success).toBe(false);
    expect(result4.error?.code).toBe(ObjectErrorCode.REQUIRED);
  });
});
