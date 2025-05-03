import { describe, expect, it } from 'vitest';
import { q } from '../src/index.js';

describe('number schema', () => {
  it('should validate numbers', () => {
    const schema = q.number();

    // Valid number
    const result1 = schema.parse(123);
    expect(result1.success).toBe(true);
    expect(result1.value).toBe(123);

    // Non-number value
    const result2 = schema.parse('123');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('Expected number');

    // NaN value
    const result3 = schema.parse(Number.NaN);
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('Expected number');
  });

  it('should validate min value', () => {
    const schema = q.number().min(5);

    // Valid (above min)
    const result1 = schema.parse(10);
    expect(result1.success).toBe(true);

    // Valid (equal to min)
    const result2 = schema.parse(5);
    expect(result2.success).toBe(true);

    // Invalid (below min)
    const result3 = schema.parse(4);
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('at least 5');
  });

  it('should validate gte (alias for min)', () => {
    const schema = q.number().gte(5);

    // Valid (above min)
    const result1 = schema.parse(10);
    expect(result1.success).toBe(true);

    // Valid (equal to min)
    const result2 = schema.parse(5);
    expect(result2.success).toBe(true);

    // Invalid (below min)
    const result3 = schema.parse(4);
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('at least 5');
  });

  it('should validate gt (greater than)', () => {
    const schema = q.number().gt(5);

    // Valid (above the threshold)
    const result1 = schema.parse(6);
    expect(result1.success).toBe(true);

    // Invalid (equal to the threshold)
    const result2 = schema.parse(5);
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('greater than 5');

    // Invalid (below the threshold)
    const result3 = schema.parse(4);
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('greater than 5');
  });

  it('should validate max value', () => {
    const schema = q.number().max(10);

    // Valid (below max)
    const result1 = schema.parse(5);
    expect(result1.success).toBe(true);

    // Valid (equal to max)
    const result2 = schema.parse(10);
    expect(result2.success).toBe(true);

    // Invalid (above max)
    const result3 = schema.parse(11);
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('at most 10');
  });

  it('should validate lte (alias for max)', () => {
    const schema = q.number().lte(10);

    // Valid (below max)
    const result1 = schema.parse(5);
    expect(result1.success).toBe(true);

    // Valid (equal to max)
    const result2 = schema.parse(10);
    expect(result2.success).toBe(true);

    // Invalid (above max)
    const result3 = schema.parse(11);
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('at most 10');
  });

  it('should validate lt (less than)', () => {
    const schema = q.number().lt(10);

    // Valid (below the threshold)
    const result1 = schema.parse(9);
    expect(result1.success).toBe(true);

    // Invalid (equal to the threshold)
    const result2 = schema.parse(10);
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('less than 10');

    // Invalid (above the threshold)
    const result3 = schema.parse(11);
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('less than 10');
  });

  it('should validate integer', () => {
    const schema = q.number().int();

    // Valid integer
    const result1 = schema.parse(42);
    expect(result1.success).toBe(true);

    // Invalid (decimal)
    const result2 = schema.parse(42.5);
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('integer');
  });

  it('should validate positive', () => {
    const schema = q.number().positive();

    // Valid positive
    const result1 = schema.parse(42);
    expect(result1.success).toBe(true);

    // Invalid (zero)
    const result2 = schema.parse(0);
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('positive');

    // Invalid (negative)
    const result3 = schema.parse(-42);
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('positive');
  });

  it('should validate nonNegative', () => {
    const schema = q.number().nonNegative();

    // Valid positive
    const result1 = schema.parse(42);
    expect(result1.success).toBe(true);

    // Valid (zero)
    const result2 = schema.parse(0);
    expect(result2.success).toBe(true);

    // Invalid (negative)
    const result3 = schema.parse(-42);
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('non-negative');
  });

  it('should validate negative', () => {
    const schema = q.number().negative();

    // Valid negative
    const result1 = schema.parse(-42);
    expect(result1.success).toBe(true);

    // Invalid (zero)
    const result2 = schema.parse(0);
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('negative');

    // Invalid (positive)
    const result3 = schema.parse(42);
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('negative');
  });

  it('should validate nonPositive', () => {
    const schema = q.number().nonPositive();

    // Valid negative
    const result1 = schema.parse(-42);
    expect(result1.success).toBe(true);

    // Valid (zero)
    const result2 = schema.parse(0);
    expect(result2.success).toBe(true);

    // Invalid (positive)
    const result3 = schema.parse(42);
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('non-positive');
  });

  it('should validate multipleOf', () => {
    const schema = q.number().multipleOf(5);

    // Valid multiple
    const result1 = schema.parse(15);
    expect(result1.success).toBe(true);

    // Invalid (not a multiple)
    const result2 = schema.parse(17);
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('multiple of 5');

    // Error case (multiple of zero)
    const schema2 = q.number().multipleOf(0);
    const result3 = schema2.parse(42);
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('Cannot check for multiples of zero');
  });

  it('should validate step (alias for multipleOf)', () => {
    const schema = q.number().step(5);

    // Valid multiple
    const result1 = schema.parse(15);
    expect(result1.success).toBe(true);

    // Invalid (not a multiple)
    const result2 = schema.parse(17);
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('multiple of 5');
  });

  it('should validate finite', () => {
    const schema = q.number().finite();

    // Valid finite number
    const result1 = schema.parse(42);
    expect(result1.success).toBe(true);

    const result2 = schema.parse(Number.POSITIVE_INFINITY);
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('finite');

    // Invalid (-Infinity)
    const result3 = schema.parse(Number.NEGATIVE_INFINITY);
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('finite');
  });

  it('should validate safe', () => {
    const schema = q.number().safe();

    // Valid safe integer
    const result1 = schema.parse(42);
    expect(result1.success).toBe(true);

    // Invalid (too large)
    const result2 = schema.parse(Number.MAX_SAFE_INTEGER + 1);
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('safe integer');

    // Invalid (decimal)
    const result3 = schema.parse(42.5);
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('safe integer');
  });

  it('should chain multiple constraints', () => {
    const schema = q.number().gt(0).lt(100).int().step(5);

    // Valid number
    const result1 = schema.parse(25);
    expect(result1.success).toBe(true);

    // Too small
    const result2 = schema.parse(-5);
    expect(result2.success).toBe(false);

    // Too large
    const result3 = schema.parse(105);
    expect(result3.success).toBe(false);

    // Not an integer
    const result4 = schema.parse(25.5);
    expect(result4.success).toBe(false);

    // Not a multiple of 5
    const result5 = schema.parse(27);
    expect(result5.success).toBe(false);
  });
});
