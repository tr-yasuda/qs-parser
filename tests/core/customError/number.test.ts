import { describe, expect, it } from 'vitest';
import { q } from '../../../src/index.js';

describe('number schema with custom error message', () => {
  it('should use custom error message when validation fails', () => {
    const customMessage = 'This is a custom error message';
    const schema = q.number({ message: customMessage });

    // Test with a non-number value
    const result = schema.parse('not a number');
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(customMessage);
  });

  it('should use default error message when no custom message is provided', () => {
    const schema = q.number();

    // Test with a non-number value
    const result = schema.parse('not a number');
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('Expected number');
  });

  it('should maintain custom error message through method chaining', () => {
    const customMessage = 'This is a custom error message';
    const schema = q.number({ message: customMessage }).min(5).max(10);

    // Test with a non-number value
    const result = schema.parse('not a number');
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(customMessage);
  });

  it('should support custom error messages for specific validations', () => {
    const typeMessage = 'Must be a number';
    const minMessage = 'Number must be at least 5';
    const maxMessage = 'Number must be at most 10';
    const intMessage = 'Number must be an integer';
    const positiveMessage = 'Number must be positive';

    // Create separate schemas for each validation to test them independently
    const typeSchema = q.number({ message: typeMessage });
    const minSchema = q.number().min(5, { message: minMessage });
    const maxSchema = q.number().max(10, { message: maxMessage });
    const intSchema = q.number().int({ message: intMessage });
    const positiveSchema = q.number().positive({ message: positiveMessage });

    // Test type validation
    const result1 = typeSchema.parse('not a number');
    expect(result1.success).toBe(false);
    expect(result1.error?.message).toBe(typeMessage);

    // Test min validation
    const result2 = minSchema.parse(3);
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toBe(minMessage);

    // Test max validation
    const result3 = maxSchema.parse(15);
    expect(result3.success).toBe(false);
    expect(result3.error?.message).toBe(maxMessage);

    // Test int validation
    const result4 = intSchema.parse(7.5);
    expect(result4.success).toBe(false);
    expect(result4.error?.message).toBe(intMessage);

    // Test positive validation with a negative number
    const result5 = positiveSchema.parse(-7);
    expect(result5.success).toBe(false);
    expect(result5.error?.message).toBe(positiveMessage);

    // Test a combined schema with a valid number
    const combinedSchema = q.number().min(5).max(10).int().positive();
    const result6 = combinedSchema.parse(7);
    expect(result6.success).toBe(true);
  });

  it('should support custom error messages for gt, lt, and other validations', () => {
    const gtMessage = 'Number must be greater than 5';
    const ltMessage = 'Number must be less than 10';
    const nonNegativeMessage = 'Number must be non-negative';
    const multipleOfMessage = 'Number must be a multiple of 2';

    // Create schemas with custom error messages
    const gtSchema = q.number().gt(5, { message: gtMessage });
    const ltSchema = q.number().lt(10, { message: ltMessage });
    const nonNegativeSchema = q
      .number()
      .nonNegative({ message: nonNegativeMessage });
    const multipleOfSchema = q
      .number()
      .multipleOf(2, { message: multipleOfMessage });

    // Test gt validation
    const gtResult = gtSchema.parse(5);
    expect(gtResult.success).toBe(false);
    expect(gtResult.error?.message).toBe(gtMessage);

    // Test lt validation
    const ltResult = ltSchema.parse(10);
    expect(ltResult.success).toBe(false);
    expect(ltResult.error?.message).toBe(ltMessage);

    // Test nonNegative validation
    const nonNegativeResult = nonNegativeSchema.parse(-1);
    expect(nonNegativeResult.success).toBe(false);
    expect(nonNegativeResult.error?.message).toBe(nonNegativeMessage);

    // Test multipleOf validation
    const multipleOfResult = multipleOfSchema.parse(3);
    expect(multipleOfResult.success).toBe(false);
    expect(multipleOfResult.error?.message).toBe(multipleOfMessage);
  });

  it('should work with valid number values', () => {
    const customMessage = 'This is a custom error message';
    const schema = q.number({ message: customMessage });

    // Test with valid number values
    const result1 = schema.parse(42);
    expect(result1.success).toBe(true);
    expect(result1.value).toBe(42);

    const result2 = schema.parse(3.14);
    expect(result2.success).toBe(true);
    expect(result2.value).toBe(3.14);
  });

  it('should work with nullable and optional modifiers', () => {
    const customMessage = 'This is a custom error message';

    // Test nullable
    const nullableSchema = q.number({ message: customMessage }).nullable();
    const nullResult = nullableSchema.parse(null);
    expect(nullResult.success).toBe(true);
    expect(nullResult.value).toBe(null);

    // Test optional
    const optionalSchema = q.number({ message: customMessage }).optional();
    const undefinedResult = optionalSchema.parse(undefined);
    expect(undefinedResult.success).toBe(true);
    expect(undefinedResult.value).toBe(undefined);

    // Test with non-number, non-null, non-undefined value
    const invalidResult = nullableSchema.parse('not a number');
    expect(invalidResult.success).toBe(false);
    expect(invalidResult.error?.message).toBe(customMessage);
  });

  it('should work with default values', () => {
    const customMessage = 'This is a custom error message';
    const defaultValue = 42;
    const schema = q.number({ message: customMessage }).default(defaultValue);

    // Test with undefined (should use default)
    const result1 = schema.parse(undefined);
    expect(result1.success).toBe(true);
    expect(result1.value).toBe(defaultValue);

    // Test with non-number value (should fail with the custom message)
    const result2 = schema.parse('not a number');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toBe(customMessage);
  });
});
