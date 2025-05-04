import { describe, expect, it } from 'vitest';
import {
  ArrayErrorCode,
  ArrayErrorMessages,
  formatMessage,
} from '../../src/core/error.js';
import { q } from '../../src/index.js';

describe('array schema', () => {
  it('should validate arrays', () => {
    const schema = q.array();

    // Valid array (empty)
    const result1 = schema.parse([]);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual([]);

    // Valid array (with items)
    const arrayValue = [1, 'string', true, {}];
    const result2 = schema.parse(arrayValue);
    expect(result2.success).toBe(true);
    expect(result2.value).toEqual(arrayValue);

    // Non-array value (string)
    const stringValue = 'not an array';
    const result3 = schema.parse(stringValue);
    expect(result3.success).toBe(false);
    expect(result3.value).toBe(stringValue); // Original value is preserved
    expect(result3.error?.message).toContain(
      ArrayErrorMessages[ArrayErrorCode.TYPE],
    );
    expect(result3.error?.code).toBe(ArrayErrorCode.TYPE);

    // Non-array value (number)
    const numberValue = 123;
    const result4 = schema.parse(numberValue);
    expect(result4.success).toBe(false);
    expect(result4.value).toBe(numberValue); // Original value is preserved
    expect(result4.error?.message).toContain(
      ArrayErrorMessages[ArrayErrorCode.TYPE],
    );
    expect(result4.error?.code).toBe(ArrayErrorCode.TYPE);

    // Non-array value (boolean)
    const booleanValue = true;
    const result5 = schema.parse(booleanValue);
    expect(result5.success).toBe(false);
    expect(result5.value).toBe(booleanValue); // Original value is preserved
    expect(result5.error?.message).toContain(
      ArrayErrorMessages[ArrayErrorCode.TYPE],
    );
    expect(result5.error?.code).toBe(ArrayErrorCode.TYPE);

    // Non-array value (object)
    const objectValue = { key: 'value' };
    const result6 = schema.parse(objectValue);
    expect(result6.success).toBe(false);
    expect(result6.value).toBe(objectValue); // Original value is preserved
    expect(result6.error?.message).toContain(
      ArrayErrorMessages[ArrayErrorCode.TYPE],
    );
    expect(result6.error?.code).toBe(ArrayErrorCode.TYPE);

    // Non-array value (null)
    const nullValue = null;
    const result7 = schema.parse(nullValue);
    expect(result7.success).toBe(false);
    expect(result7.value).toBe(nullValue); // Original value is preserved
    expect(result7.error?.message).toContain(
      ArrayErrorMessages[ArrayErrorCode.TYPE],
    );
    expect(result7.error?.code).toBe(ArrayErrorCode.TYPE);

    // Non-array value (undefined)
    const undefinedValue = undefined;
    const result8 = schema.parse(undefinedValue);
    expect(result8.success).toBe(false);
    expect(result8.value).toBe(undefinedValue); // Original value is preserved
    expect(result8.error?.message).toContain(
      ArrayErrorMessages[ArrayErrorCode.TYPE],
    );
    expect(result8.error?.code).toBe(ArrayErrorCode.TYPE);
  });

  it('should validate array with min length constraint', () => {
    const minLength = 2;
    const schema = q.array().min(minLength);

    // Valid array (length >= minLength)
    const validArray = [1, 2, 3];
    const result1 = schema.parse(validArray);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validArray);

    // Valid array (length exactly minLength)
    const exactArray = [1, 2];
    const result2 = schema.parse(exactArray);
    expect(result2.success).toBe(true);
    expect(result2.value).toEqual(exactArray);

    // Invalid array (length < minLength)
    const shortArray = [1];
    const result3 = schema.parse(shortArray);
    expect(result3.success).toBe(false);
    expect(result3.value).toEqual(shortArray);
    expect(result3.error?.code).toBe(ArrayErrorCode.MIN_LENGTH);
    expect(result3.error?.message).toContain(
      formatMessage(ArrayErrorMessages[ArrayErrorCode.MIN_LENGTH], minLength),
    );

    // Invalid array (empty)
    const emptyArray: unknown[] = [];
    const result4 = schema.parse(emptyArray);
    expect(result4.success).toBe(false);
    expect(result4.value).toEqual(emptyArray);
    expect(result4.error?.code).toBe(ArrayErrorCode.MIN_LENGTH);
    expect(result4.error?.message).toContain(
      formatMessage(ArrayErrorMessages[ArrayErrorCode.MIN_LENGTH], minLength),
    );
  });

  it('should validate array with max length constraint', () => {
    const maxLength = 3;
    const schema = q.array().max(maxLength);

    // Valid array (length <= maxLength)
    const validArray = [1, 2];
    const result1 = schema.parse(validArray);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validArray);

    // Valid array (length exactly maxLength)
    const exactArray = [1, 2, 3];
    const result2 = schema.parse(exactArray);
    expect(result2.success).toBe(true);
    expect(result2.value).toEqual(exactArray);

    // Invalid array (length > maxLength)
    const longArray = [1, 2, 3, 4];
    const result3 = schema.parse(longArray);
    expect(result3.success).toBe(false);
    expect(result3.value).toEqual(longArray);
    expect(result3.error?.code).toBe(ArrayErrorCode.MAX_LENGTH);
    expect(result3.error?.message).toContain(
      formatMessage(ArrayErrorMessages[ArrayErrorCode.MAX_LENGTH], maxLength),
    );

    // Valid array (empty)
    const emptyArray: unknown[] = [];
    const result4 = schema.parse(emptyArray);
    expect(result4.success).toBe(true);
    expect(result4.value).toEqual(emptyArray);
  });

  it('should validate array with length constraint (min and max)', () => {
    const minLength = 2;
    const maxLength = 4;
    const schema = q.array().length(minLength, maxLength);

    // Valid array (length between min and max)
    const validArray = [1, 2, 3];
    const result1 = schema.parse(validArray);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validArray);

    // Valid array (length exactly min)
    const minArray = [1, 2];
    const result2 = schema.parse(minArray);
    expect(result2.success).toBe(true);
    expect(result2.value).toEqual(minArray);

    // Valid array (length exactly max)
    const maxArray = [1, 2, 3, 4];
    const result3 = schema.parse(maxArray);
    expect(result3.success).toBe(true);
    expect(result3.value).toEqual(maxArray);

    // Invalid array (length < min)
    const shortArray = [1];
    const result4 = schema.parse(shortArray);
    expect(result4.success).toBe(false);
    expect(result4.value).toEqual(shortArray);
    expect(result4.error?.code).toBe(ArrayErrorCode.MIN_LENGTH);
    expect(result4.error?.message).toContain(
      formatMessage(ArrayErrorMessages[ArrayErrorCode.MIN_LENGTH], minLength),
    );

    // Invalid array (length > max)
    const longArray = [1, 2, 3, 4, 5];
    const result5 = schema.parse(longArray);
    expect(result5.success).toBe(false);
    expect(result5.value).toEqual(longArray);
    expect(result5.error?.code).toBe(ArrayErrorCode.MAX_LENGTH);
    expect(result5.error?.message).toContain(
      formatMessage(ArrayErrorMessages[ArrayErrorCode.MAX_LENGTH], maxLength),
    );
  });

  it('should validate array with exact length constraint', () => {
    const exactLength = 3;
    const schema = q.array().length(exactLength);

    // Valid array (length exactly exactLength)
    const validArray = [1, 2, 3];
    const result1 = schema.parse(validArray);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validArray);

    // Invalid array (length < exactLength)
    const shortArray = [1, 2];
    const result2 = schema.parse(shortArray);
    expect(result2.success).toBe(false);
    expect(result2.value).toEqual(shortArray);
    expect(result2.error?.code).toBe(ArrayErrorCode.MIN_LENGTH);
    expect(result2.error?.message).toContain(
      formatMessage(ArrayErrorMessages[ArrayErrorCode.MIN_LENGTH], exactLength),
    );

    // Invalid array (length > exactLength)
    const longArray = [1, 2, 3, 4];
    const result3 = schema.parse(longArray);
    expect(result3.success).toBe(false);
    expect(result3.value).toEqual(longArray);
    expect(result3.error?.code).toBe(ArrayErrorCode.MAX_LENGTH);
    expect(result3.error?.message).toContain(
      formatMessage(ArrayErrorMessages[ArrayErrorCode.MAX_LENGTH], exactLength),
    );
  });

  it('should validate array with item schema', () => {
    // Create a schema with a number item schema
    const schema = q.array(q.number());

    // Valid array (all items are numbers)
    const validArray = [1, 2, 3];
    const result1 = schema.parse(validArray);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validArray);

    // Invalid array (contains non-number items)
    const invalidArray = [1, 'string', 3];
    const result2 = schema.parse(invalidArray);
    expect(result2.success).toBe(false);
    expect(result2.value).toEqual(invalidArray);
    expect(result2.error?.code).toBe(ArrayErrorCode.ITEM_INVALID);
    expect(result2.error?.message).toContain(
      formatMessage(ArrayErrorMessages[ArrayErrorCode.ITEM_INVALID], 1),
    );

    // Valid array (empty)
    const emptyArray: unknown[] = [];
    const result3 = schema.parse(emptyArray);
    expect(result3.success).toBe(true);
    expect(result3.value).toEqual(emptyArray);
  });

  it('should validate array with complex item schema', () => {
    // Create a schema with a complex object item schema
    const personSchema = q.object({
      name: q.string(),
      age: q.number(),
    });
    const schema = q.array(personSchema);

    // Valid array (all items match the schema)
    const validArray = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ];
    const result1 = schema.parse(validArray);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validArray);

    // Invalid array (item missing required property)
    const invalidArray1 = [
      { name: 'Alice', age: 30 },
      { name: 'Charlie' }, // missing age
    ];
    const result2 = schema.parse(invalidArray1);
    expect(result2.success).toBe(false);
    expect(result2.value).toEqual(invalidArray1);
    expect(result2.error?.code).toBe(ArrayErrorCode.ITEM_INVALID);
    expect(result2.error?.message).toContain(
      formatMessage(ArrayErrorMessages[ArrayErrorCode.ITEM_INVALID], 1),
    );

    // Invalid array (non-object item)
    const invalidArray3 = [{ name: 'Alice', age: 30 }, 'not an object'];
    const result4 = schema.parse(invalidArray3);
    expect(result4.success).toBe(false);
    expect(result4.value).toEqual(invalidArray3);
    expect(result4.error?.code).toBe(ArrayErrorCode.ITEM_INVALID);
    expect(result4.error?.message).toContain(
      formatMessage(ArrayErrorMessages[ArrayErrorCode.ITEM_INVALID], 1),
    );
  });

  it('should support optional arrays', () => {
    const schema = q.array().optional();

    // Valid array
    const validArray = [1, 2, 3];
    const result1 = schema.parse(validArray);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validArray);

    // Undefined value (allowed with optional)
    const result2 = schema.parse(undefined);
    expect(result2.success).toBe(true);
    expect(result2.value).toBe(undefined);

    // Null value (not allowed with optional)
    const result3 = schema.parse(null);
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(ArrayErrorCode.TYPE);
  });

  it('should support nullable arrays', () => {
    const schema = q.array().nullable();

    // Valid array
    const validArray = [1, 2, 3];
    const result1 = schema.parse(validArray);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validArray);

    // Null value (allowed with nullable)
    const result2 = schema.parse(null);
    expect(result2.success).toBe(true);
    expect(result2.value).toBe(null);

    // Undefined value (not allowed with nullable)
    const result3 = schema.parse(undefined);
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(ArrayErrorCode.TYPE);
  });

  it('should support default values', () => {
    const defaultValue = [1, 2, 3];
    const schema = q.array().default(defaultValue);

    // Valid array
    const validArray = [4, 5, 6];
    const result1 = schema.parse(validArray);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validArray);

    // Undefined value (uses default)
    const result2 = schema.parse(undefined);
    expect(result2.success).toBe(true);
    expect(result2.value).toEqual(defaultValue);

    // Null value (not allowed with default)
    const result3 = schema.parse(null);
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(ArrayErrorCode.TYPE);
  });

  it('should support chaining methods', () => {
    const defaultValue = [1, 2, 3];
    const minLength = 2;
    const maxLength = 5;

    // Chain multiple methods
    const schema = q
      .array(q.number())
      .min(minLength)
      .max(maxLength)
      .nullable()
      .default(defaultValue);

    // Valid array (all constraints satisfied)
    const validArray = [4, 5, 6];
    const result1 = schema.parse(validArray);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(validArray);

    // Null value (allowed with nullable)
    const result2 = schema.parse(null);
    expect(result2.success).toBe(true);
    expect(result2.value).toBe(null);

    // Undefined value (uses default)
    const result3 = schema.parse(undefined);
    expect(result3.success).toBe(true);
    expect(result3.value).toEqual(defaultValue);

    // Invalid array (too short)
    const shortArray = [1];
    const result4 = schema.parse(shortArray);
    expect(result4.success).toBe(false);
    expect(result4.error?.code).toBe(ArrayErrorCode.MIN_LENGTH);

    // Invalid array (too long)
    const longArray = [1, 2, 3, 4, 5, 6];
    const result5 = schema.parse(longArray);
    expect(result5.success).toBe(false);
    expect(result5.error?.code).toBe(ArrayErrorCode.MAX_LENGTH);

    // Invalid array (contains non-number items)
    const invalidArray = [1, 2, 'string'];
    const result6 = schema.parse(invalidArray);
    expect(result6.success).toBe(false);
    expect(result6.error?.code).toBe(ArrayErrorCode.ITEM_INVALID);
  });
});
