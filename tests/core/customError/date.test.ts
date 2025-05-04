import { describe, expect, it } from 'vitest';
import { q } from '../../../src/index.js';

describe('date schema with custom error message', () => {
  it('should use custom error message when validation fails', () => {
    const customMessage = 'This is a custom error message';
    const schema = q.date({ message: customMessage });

    // Test with a non-date value
    const result = schema.parse('not a date');
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(customMessage);
  });

  it('should use default error message when no custom message is provided', () => {
    const schema = q.date();

    // Test with a non-date value
    const result = schema.parse('not a date');
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('Expected date');
  });

  it('should maintain custom error message through method chaining', () => {
    const customMessage = 'This is a custom error message';
    const minDate = new Date('2023-01-01');
    const maxDate = new Date('2023-12-31');
    const schema = q.date({ message: customMessage }).min(minDate).max(maxDate);

    // Test with a non-date value
    const result = schema.parse('not a date');
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe(customMessage);
  });

  it('should support custom error messages for specific validations', () => {
    const typeMessage = 'Must be a date';
    const minMessage = 'Date must be at or after 2023-01-01';
    const maxMessage = 'Date must be at or before 2023-12-31';
    const pastMessage = 'Date must be in the past';
    const futureMessage = 'Date must be in the future';
    const betweenMessage = 'Date must be between 2023-01-01 and 2023-12-31';
    const todayMessage = 'Date must be today';

    // Create separate schemas for each validation to test them independently
    const minDate = new Date('2023-01-01');
    const maxDate = new Date('2023-12-31');
    const typeSchema = q.date({ message: typeMessage });
    const minSchema = q.date().min(minDate, { message: minMessage });
    const maxSchema = q.date().max(maxDate, { message: maxMessage });
    const pastSchema = q.date().past({ message: pastMessage });
    const futureSchema = q.date().future({ message: futureMessage });
    const betweenSchema = q
      .date()
      .between(minDate, maxDate, { message: betweenMessage });
    const todaySchema = q.date().today({ message: todayMessage });

    // Test type validation
    const result1 = typeSchema.parse('not a date');
    expect(result1.success).toBe(false);
    expect(result1.error?.message).toBe(typeMessage);

    // Test min validation with a date before the minimum
    const beforeMinDate = new Date('2022-12-31');
    const result2 = minSchema.parse(beforeMinDate);
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toBe(minMessage);

    // Test max validation with a date after the maximum
    const afterMaxDate = new Date('2024-01-01');
    const result3 = maxSchema.parse(afterMaxDate);
    expect(result3.success).toBe(false);
    expect(result3.error?.message).toBe(maxMessage);

    // Test past validation with a future date
    // Note: This test might be flaky if run exactly at midnight
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const result4 = pastSchema.parse(tomorrow);
    expect(result4.success).toBe(false);
    expect(result4.error?.message).toBe(pastMessage);

    // Test future validation with a past date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const result5 = futureSchema.parse(yesterday);
    expect(result5.success).toBe(false);
    expect(result5.error?.message).toBe(futureMessage);

    // Test between validation with a date outside the range
    const outsideRangeDate = new Date('2022-01-01');
    const result6 = betweenSchema.parse(outsideRangeDate);
    expect(result6.success).toBe(false);
    expect(result6.error?.message).toBe(betweenMessage);

    // Test today validation with a non-today date
    const notToday = new Date();
    notToday.setDate(notToday.getDate() - 1);
    const result7 = todaySchema.parse(notToday);
    expect(result7.success).toBe(false);
    expect(result7.error?.message).toBe(todayMessage);
  });

  it('should work with valid date values', () => {
    const customMessage = 'This is a custom error message';
    const schema = q.date({ message: customMessage });

    // Test with valid date values
    const result1 = schema.parse(new Date());
    expect(result1.success).toBe(true);

    // Test with valid date string in YYYY-MM-DD format
    const result2 = schema.parse('2023-01-01');
    expect(result2.success).toBe(true);
    expect(result2.value).toBeInstanceOf(Date);
  });

  it('should work with nullable and optional modifiers', () => {
    const customMessage = 'This is a custom error message';

    // Test nullable
    const nullableSchema = q.date({ message: customMessage }).nullable();
    const nullResult = nullableSchema.parse(null);
    expect(nullResult.success).toBe(true);
    expect(nullResult.value).toBe(null);

    // Test optional
    const optionalSchema = q.date({ message: customMessage }).optional();
    const undefinedResult = optionalSchema.parse(undefined);
    expect(undefinedResult.success).toBe(true);
    expect(undefinedResult.value).toBe(undefined);

    // Test with non-date, non-null, non-undefined value
    const invalidResult = nullableSchema.parse('not a date');
    expect(invalidResult.success).toBe(false);
    expect(invalidResult.error?.message).toBe(customMessage);
  });

  it('should work with default values', () => {
    const customMessage = 'This is a custom error message';
    const defaultValue = new Date('2023-01-01');
    const schema = q.date({ message: customMessage }).default(defaultValue);

    // Test with undefined (should use default)
    const result1 = schema.parse(undefined);
    expect(result1.success).toBe(true);
    expect(result1.value).toEqual(defaultValue);

    // Test with non-date value (should fail with custom message)
    const result2 = schema.parse('not a date');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toBe(customMessage);
  });
});
