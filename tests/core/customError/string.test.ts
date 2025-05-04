import { describe, expect, it } from 'vitest';
import { q } from '../../../src/index.js';

describe('string schema with custom error message', () => {
  it('should use custom error message when validation fails', () => {
    const customMessage = 'This is a custom error message';
    const schema = q.string({ message: customMessage });

    // Test with a non-string value
    const result = schema.parse(123);
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(customMessage);
  });

  it('should use default error message when no custom message is provided', () => {
    const schema = q.string();

    // Test with a non-string value
    const result = schema.parse(123);
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('Expected string');
  });

  it('should maintain custom error message through method chaining', () => {
    const customMessage = 'This is a custom error message';
    const schema = q.string({ message: customMessage }).min(5).max(10);

    // Test with a non-string value
    const result = schema.parse(123);
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(customMessage);
  });

  it('should support custom error messages for specific validations', () => {
    const typeMessage = 'Must be a string';
    const minMessage = 'String must have at least 5 characters';
    const maxMessage = 'String must have at most 10 characters';
    const patternMessage = 'String must match the pattern';

    // Create a schema with custom error messages for each validation
    const schema = q
      .string({ message: typeMessage })
      .min(5, { message: minMessage })
      .max(10, { message: maxMessage })
      .pattern(/^[a-z]+$/, { message: patternMessage });

    // Test type validation
    const result1 = schema.parse(123);
    expect(result1.success).toBe(false);
    expect(result1.error?.message).toBe(typeMessage);

    // Test min length validation
    const result2 = schema.parse('abc');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toBe(minMessage);

    // Test max length validation
    const result3 = schema.parse('abcdefghijklmnop');
    expect(result3.success).toBe(false);
    expect(result3.error?.message).toBe(maxMessage);

    // Test pattern validation
    const result4 = schema.parse('ABCDEF');
    expect(result4.success).toBe(false);
    expect(result4.error?.message).toBe(patternMessage);

    // Test valid string
    const result5 = schema.parse('abcdef');
    expect(result5.success).toBe(true);
  });

  it('should support custom error messages for email and url validations', () => {
    const emailMessage = 'Invalid email format';
    const urlMessage = 'Invalid URL format';

    // Create schemas with custom error messages
    const emailSchema = q.string().email({ message: emailMessage });
    const urlSchema = q.string().url({ message: urlMessage });

    // Test email validation
    const emailResult = emailSchema.parse('not-an-email');
    expect(emailResult.success).toBe(false);
    expect(emailResult.error?.message).toBe(emailMessage);

    // Test URL validation
    const urlResult = urlSchema.parse('not-a-url');
    expect(urlResult.success).toBe(false);
    expect(urlResult.error?.message).toBe(urlMessage);

    // Test valid email
    const validEmailResult = emailSchema.parse('test@example.com');
    expect(validEmailResult.success).toBe(true);

    // Test valid URL
    const validUrlResult = urlSchema.parse('https://example.com');
    expect(validUrlResult.success).toBe(true);
  });
});
