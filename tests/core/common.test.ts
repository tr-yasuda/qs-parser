import { describe, expect, it } from 'vitest';
import { q } from '../../src/index.js';

describe('Common schema utilities', () => {
  describe('optional', () => {
    it('should make a string schema accept undefined values', () => {
      const schema = q.string().optional();

      // Valid string should pass
      const validResult = schema.parse('hello');
      expect(validResult.success).toBe(true);
      expect(validResult.value).toBe('hello');

      // Undefined should pass
      const undefinedResult = schema.parse(undefined);
      expect(undefinedResult.success).toBe(true);
      expect(undefinedResult.value).toBe(undefined);

      // Null should still fail
      const nullResult = schema.parse(null);
      expect(nullResult.success).toBe(false);
    });

    it('should make a number schema accept undefined values', () => {
      const schema = q.number().optional();

      // Valid number should pass
      const validResult = schema.parse(42);
      expect(validResult.success).toBe(true);
      expect(validResult.value).toBe(42);

      // Undefined should pass
      const undefinedResult = schema.parse(undefined);
      expect(undefinedResult.success).toBe(true);
      expect(undefinedResult.value).toBe(undefined);

      // Null should still fail
      const nullResult = schema.parse(null);
      expect(nullResult.success).toBe(false);
    });

    it('should make a boolean schema accept undefined values', () => {
      const schema = q.boolean().optional();

      // Valid boolean should pass
      const validResult = schema.parse(true);
      expect(validResult.success).toBe(true);
      expect(validResult.value).toBe(true);

      // Undefined should pass
      const undefinedResult = schema.parse(undefined);
      expect(undefinedResult.success).toBe(true);
      expect(undefinedResult.value).toBe(undefined);

      // Null should still fail
      const nullResult = schema.parse(null);
      expect(nullResult.success).toBe(false);
    });

    it('should make a date schema accept undefined values', () => {
      const schema = q.date().optional();
      const testDate = new Date('2023-01-01');

      // Valid date should pass
      const validResult = schema.parse(testDate);
      expect(validResult.success).toBe(true);
      expect(validResult.value).toEqual(testDate);

      // Undefined should pass
      const undefinedResult = schema.parse(undefined);
      expect(undefinedResult.success).toBe(true);
      expect(undefinedResult.value).toBe(undefined);

      // Null should still fail
      const nullResult = schema.parse(null);
      expect(nullResult.success).toBe(false);
    });
  });

  describe('nullable', () => {
    it('should make a string schema accept null values', () => {
      const schema = q.string().nullable();

      // Valid string should pass
      const validResult = schema.parse('hello');
      expect(validResult.success).toBe(true);
      expect(validResult.value).toBe('hello');

      // Null should pass
      const nullResult = schema.parse(null);
      expect(nullResult.success).toBe(true);
      expect(nullResult.value).toBe(null);

      // Undefined should still fail
      const undefinedResult = schema.parse(undefined);
      expect(undefinedResult.success).toBe(false);
    });

    it('should make a number schema accept null values', () => {
      const schema = q.number().nullable();

      // Valid number should pass
      const validResult = schema.parse(42);
      expect(validResult.success).toBe(true);
      expect(validResult.value).toBe(42);

      // Null should pass
      const nullResult = schema.parse(null);
      expect(nullResult.success).toBe(true);
      expect(nullResult.value).toBe(null);

      // Undefined should still fail
      const undefinedResult = schema.parse(undefined);
      expect(undefinedResult.success).toBe(false);
    });

    it('should make a boolean schema accept null values', () => {
      const schema = q.boolean().nullable();

      // Valid boolean should pass
      const validResult = schema.parse(true);
      expect(validResult.success).toBe(true);
      expect(validResult.value).toBe(true);

      // Null should pass
      const nullResult = schema.parse(null);
      expect(nullResult.success).toBe(true);
      expect(nullResult.value).toBe(null);

      // Undefined should still fail
      const undefinedResult = schema.parse(undefined);
      expect(undefinedResult.success).toBe(false);
    });

    it('should make a date schema accept null values', () => {
      const schema = q.date().nullable();
      const testDate = new Date('2023-01-01');

      // Valid date should pass
      const validResult = schema.parse(testDate);
      expect(validResult.success).toBe(true);
      expect(validResult.value).toEqual(testDate);

      // Null should pass
      const nullResult = schema.parse(null);
      expect(nullResult.success).toBe(true);
      expect(nullResult.value).toBe(null);

      // Undefined should still fail
      const undefinedResult = schema.parse(undefined);
      expect(undefinedResult.success).toBe(false);
    });
  });

  describe('default', () => {
    it('should use default value for undefined in string schema', () => {
      const defaultStr = 'default value';
      const schema = q.string().default(defaultStr);

      // Valid string should pass
      const validResult = schema.parse('hello');
      expect(validResult.success).toBe(true);
      expect(validResult.value).toBe('hello');

      // Undefined should use default value
      const undefinedResult = schema.parse(undefined);
      expect(undefinedResult.success).toBe(true);
      expect(undefinedResult.value).toBe(defaultStr);

      // Null should still fail
      const nullResult = schema.parse(null);
      expect(nullResult.success).toBe(false);
    });

    it('should use default value for undefined in number schema', () => {
      const defaultNum = 42;
      const schema = q.number().default(defaultNum);

      // Valid number should pass
      const validResult = schema.parse(123);
      expect(validResult.success).toBe(true);
      expect(validResult.value).toBe(123);

      // Undefined should use default value
      const undefinedResult = schema.parse(undefined);
      expect(undefinedResult.success).toBe(true);
      expect(undefinedResult.value).toBe(defaultNum);

      // Null should still fail
      const nullResult = schema.parse(null);
      expect(nullResult.success).toBe(false);
    });

    it('should use default value for undefined in boolean schema', () => {
      const defaultBool = true;
      const schema = q.boolean().default(defaultBool);

      // Valid boolean should pass
      const validResult = schema.parse(false);
      expect(validResult.success).toBe(true);
      expect(validResult.value).toBe(false);

      // Undefined should use default value
      const undefinedResult = schema.parse(undefined);
      expect(undefinedResult.success).toBe(true);
      expect(undefinedResult.value).toBe(defaultBool);

      // Null should still fail
      const nullResult = schema.parse(null);
      expect(nullResult.success).toBe(false);
    });

    it('should use default value for undefined in date schema', () => {
      const defaultDate = new Date('2023-01-01');
      const schema = q.date().default(defaultDate);
      const testDate = new Date('2023-12-31');

      // Valid date should pass
      const validResult = schema.parse(testDate);
      expect(validResult.success).toBe(true);
      expect(validResult.value).toEqual(testDate);

      // Undefined should use default value
      const undefinedResult = schema.parse(undefined);
      expect(undefinedResult.success).toBe(true);
      expect(undefinedResult.value).toEqual(defaultDate);

      // Null should still fail
      const nullResult = schema.parse(null);
      expect(nullResult.success).toBe(false);
    });
  });

  describe('Combining utilities', () => {
    it('should allow combining optional and nullable', () => {
      const schema = q.string().optional().nullable();

      // Valid string should pass
      const validResult = schema.parse('hello');
      expect(validResult.success).toBe(true);
      expect(validResult.value).toBe('hello');

      // Null should pass
      const nullResult = schema.parse(null);
      expect(nullResult.success).toBe(true);
      expect(nullResult.value).toBe(null);

      // Undefined should pass
      const undefinedResult = schema.parse(undefined);
      expect(undefinedResult.success).toBe(true);
      expect(undefinedResult.value).toBe(undefined);
    });

    it('should allow combining default and nullable', () => {
      const defaultStr = 'default value';
      const schema = q.string().nullable().default(defaultStr);

      // Valid string should pass
      const validResult = schema.parse('hello');
      expect(validResult.success).toBe(true);
      expect(validResult.value).toBe('hello');

      // Null should pass
      const nullResult = schema.parse(null);
      expect(nullResult.success).toBe(true);
      expect(nullResult.value).toBe(null);

      // Undefined should use default value
      const undefinedResult = schema.parse(undefined);
      expect(undefinedResult.success).toBe(true);
      expect(undefinedResult.value).toBe(defaultStr);
    });

    it('should work with schema constraints', () => {
      const schema = q.string().min(5).max(10).optional();

      // Valid string should pass
      const validResult = schema.parse('hello world'.substring(0, 10));
      expect(validResult.success).toBe(true);

      // Too short string should fail
      const shortResult = schema.parse('hi');
      expect(shortResult.success).toBe(false);

      // Too long string should fail
      const longResult = schema.parse('this is too long');
      expect(longResult.success).toBe(false);

      // Undefined should pass
      const undefinedResult = schema.parse(undefined);
      expect(undefinedResult.success).toBe(true);
      expect(undefinedResult.value).toBe(undefined);
    });
  });
});
