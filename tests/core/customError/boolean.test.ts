import { describe, expect, it } from 'vitest';
import { q } from '../../../src/index.js';

describe('boolean schema with custom error message', () => {
  it('should use custom error message when validation fails', () => {
    const customMessage = 'This is a custom error message';
    const schema = q.boolean({ message: customMessage });

    // Test with a non-boolean value
    const result = schema.parse(123);
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(customMessage);
  });

  it('should use default error message when no custom message is provided', () => {
    const schema = q.boolean();

    // Test with a non-boolean value
    const result = schema.parse(123);
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('Expected boolean');
  });

  it('should maintain custom error message through method chaining', () => {
    const customMessage = 'This is a custom error message';
    const schema = q.boolean({ message: customMessage }).nullable().optional();

    // Test with a non-boolean value
    const result = schema.parse(123);
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(customMessage);
  });

  it('should work with valid boolean values', () => {
    const customMessage = 'This is a custom error message';
    const schema = q.boolean({ message: customMessage });

    // Test with valid boolean values
    const result1 = schema.parse(true);
    expect(result1.success).toBe(true);
    expect(result1.value).toBe(true);

    const result2 = schema.parse(false);
    expect(result2.success).toBe(true);
    expect(result2.value).toBe(false);
  });

  it('should work with nullable and optional modifiers', () => {
    const customMessage = 'This is a custom error message';

    // Test nullable
    const nullableSchema = q.boolean({ message: customMessage }).nullable();
    const nullResult = nullableSchema.parse(null);
    expect(nullResult.success).toBe(true);
    expect(nullResult.value).toBe(null);

    // Test optional
    const optionalSchema = q.boolean({ message: customMessage }).optional();
    const undefinedResult = optionalSchema.parse(undefined);
    expect(undefinedResult.success).toBe(true);
    expect(undefinedResult.value).toBe(undefined);

    // Test with non-boolean, non-null, non-undefined value
    const invalidResult = nullableSchema.parse('not a boolean');
    expect(invalidResult.success).toBe(false);
    expect(invalidResult.error?.message).toBe(customMessage);
  });

  it('should work with default values', () => {
    const customMessage = 'This is a custom error message';
    const defaultValue = true;
    const schema = q.boolean({ message: customMessage }).default(defaultValue);

    // Test with undefined (should use default)
    const result1 = schema.parse(undefined);
    expect(result1.success).toBe(true);
    expect(result1.value).toBe(defaultValue);

    // Test with non-boolean value (should fail with the custom message)
    const result2 = schema.parse('not a boolean');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toBe(customMessage);
  });
});
