import { describe, expect, it } from 'vitest';
import { q } from '../../../src/index.js';

describe('array schema with custom error message', () => {
  it('should use custom error message when validation fails', () => {
    const customMessage = 'This is a custom error message';
    const schema = q.array({ message: customMessage });

    // Test with a non-array value
    const result = schema.parse(123);
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(customMessage);
  });

  it('should use default error message when no custom message is provided', () => {
    const schema = q.array();

    // Test with a non-array value
    const result = schema.parse(123);
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('Expected array');
  });

  it('should maintain custom error message through method chaining', () => {
    const customMessage = 'This is a custom error message';
    const schema = q.array({ message: customMessage }).min(2).max(5);

    // Test with a non-array value
    const result = schema.parse(123);
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(customMessage);
  });

  it('should work with item schema', () => {
    const customMessage = 'This is a custom error message';
    // Create a schema with a custom error message and a number item schema
    const schema = q.array({ message: customMessage });

    // Test with a non-array value
    const result = schema.parse('not an array');
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(customMessage);
  });

  it('should support custom error messages for specific validations', () => {
    const typeMessage = 'Must be an array';
    const minMessage = 'Array must have at least 3 items';
    const maxMessage = 'Array must have at most 5 items';

    // Create a schema with custom error messages for each validation
    const schema = q
      .array({ message: typeMessage })
      .min(3, { message: minMessage })
      .max(5, { message: maxMessage });

    // Test type validation
    const result1 = schema.parse('not an array');
    expect(result1.success).toBe(false);
    expect(result1.error?.message).toBe(typeMessage);

    // Test min length validation
    const result2 = schema.parse([1, 2]);
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toBe(minMessage);

    // Test max length validation
    const result3 = schema.parse([1, 2, 3, 4, 5, 6]);
    expect(result3.success).toBe(false);
    expect(result3.error?.message).toBe(maxMessage);

    // Test valid array
    const result4 = schema.parse([1, 2, 3, 4]);
    expect(result4.success).toBe(true);
  });

  it('should support custom error messages with length method', () => {
    const lengthMessage = 'Array must have exactly 3 items';

    // Create a schema with custom error message for length validation
    const schema = q.array().length(3, { message: lengthMessage });

    // Test with too few items
    const result1 = schema.parse([1, 2]);
    expect(result1.success).toBe(false);
    expect(result1.error?.message).toBe(lengthMessage);

    // Test with too many items
    const result2 = schema.parse([1, 2, 3, 4]);
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toBe(lengthMessage);

    // Test with exact length
    const result3 = schema.parse([1, 2, 3]);
    expect(result3.success).toBe(true);
  });

  it('should support custom error messages with length range', () => {
    const rangeMessage = 'Array must have between 2 and 4 items';

    // Create a schema with custom error message for length range validation
    const schema = q.array().length(2, 4, { message: rangeMessage });

    // Test with too few items
    const result1 = schema.parse([1]);
    expect(result1.success).toBe(false);
    expect(result1.error?.message).toBe(rangeMessage);

    // Test with too many items
    const result2 = schema.parse([1, 2, 3, 4, 5]);
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toBe(rangeMessage);

    // Test with valid length
    const result3 = schema.parse([1, 2, 3]);
    expect(result3.success).toBe(true);
  });
});
