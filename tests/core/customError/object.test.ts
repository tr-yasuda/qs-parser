import { describe, expect, it } from 'vitest';
import { q } from '../../../src/index.js';

describe('object schema with custom error message', () => {
  it('should use custom error message when validation fails', () => {
    const customMessage = 'This is a custom error message';
    const schema = q.object({ message: customMessage });

    // Test with a non-object value
    const result = schema.parse('not an object');
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(customMessage);
  });

  it('should use default error message when no custom message is provided', () => {
    const schema = q.object();

    // Test with a non-object value
    const result = schema.parse('not an object');
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('Expected object');
  });

  it('should maintain custom error message through method chaining', () => {
    const customMessage = 'This is a custom error message';
    const schema = q.object({ message: customMessage }).nullable().optional();

    // Test with a non-object value
    const result = schema.parse('not an object');
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(customMessage);
  });

  it('should support custom error messages for strict mode', () => {
    const typeMessage = 'Must be an object';
    const unknownKeysMessage = 'Unknown keys are not allowed';

    // Create a schema with custom error messages
    const shape = { name: q.string(), age: q.number() };
    const schema = q
      .object(shape, { message: typeMessage })
      .strict({ message: unknownKeysMessage });

    // Test type validation
    const result1 = schema.parse('not an object');
    expect(result1.success).toBe(false);
    expect(result1.error?.message).toBe(typeMessage);

    // Test unknown keys validation
    const result2 = schema.parse({ name: 'John', age: 30, extra: 'field' });
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toBe(unknownKeysMessage);

    // Test valid object
    const result3 = schema.parse({ name: 'John', age: 30 });
    expect(result3.success).toBe(true);
  });

  it('should work with shape validation', () => {
    const customMessage = 'This is a custom error message';
    const shape = { name: q.string(), age: q.number() };
    const schema = q.object(shape, { message: customMessage });

    // Test with a non-object value
    const result1 = schema.parse('not an object');
    expect(result1.success).toBe(false);
    expect(result1.error?.message).toBe(customMessage);

    // Test with an object missing required keys
    const result2 = schema.parse({ name: 'John' });
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain('Required key "age" is missing');

    // Test with a valid object
    const result3 = schema.parse({ name: 'John', age: 30 });
    expect(result3.success).toBe(true);
  });

  it('should work with nullable and optional modifiers', () => {
    const customMessage = 'This is a custom error message';

    // Test nullable
    const nullableSchema = q.object({ message: customMessage }).nullable();
    const nullResult = nullableSchema.parse(null);
    expect(nullResult.success).toBe(true);
    expect(nullResult.value).toBe(null);

    // Test optional
    const optionalSchema = q.object({ message: customMessage }).optional();
    const undefinedResult = optionalSchema.parse(undefined);
    expect(undefinedResult.success).toBe(true);
    expect(undefinedResult.value).toBe(undefined);

    // Test with non-object, non-null, non-undefined value
    const invalidResult = nullableSchema.parse('not an object');
    expect(invalidResult.success).toBe(false);
    expect(invalidResult.error?.message).toBe(customMessage);
  });

  it('should work with default values', () => {
    const customMessage = 'This is a custom error message';
    const defaultValue = { name: 'Default', age: 0 };
    const schema = q.object({ message: customMessage }).default(defaultValue);

    // Test with undefined (should use default)
    const result1 = schema.parse(undefined);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(defaultValue);

    // Test with non-object value (should fail with custom message)
    const result2 = schema.parse('not an object');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toBe(customMessage);
  });
});
