import { describe, expect, it } from 'vitest';
import { NumberErrorCode, NumberErrorMessages } from '../src/core/error.js';
import { q } from '../src/index.js';
import { formatMessage } from './helper.js';

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
    expect(result2.error?.message).toContain(
      NumberErrorMessages[NumberErrorCode.TYPE],
    );
    expect(result2.error?.code).toBe(NumberErrorCode.TYPE);

    // NaN value
    const result3 = schema.parse(Number.NaN);
    expect(result3.success).toBe(false);
    expect(result3.error?.message).toContain(
      NumberErrorMessages[NumberErrorCode.TYPE],
    );
    expect(result3.error?.code).toBe(NumberErrorCode.TYPE);
  });

  // Parameterized tests for comparison constraints
  describe.each([
    {
      name: 'min',
      method: 'min',
      schema: q.number().min(5),
      value: 5,
      validEqual: true,
      errorCode: NumberErrorCode.MIN,
    },
    {
      name: 'gte (alias for min)',
      method: 'gte',
      schema: q.number().gte(5),
      value: 5,
      validEqual: true,
      errorCode: NumberErrorCode.MIN,
    },
    {
      name: 'gt (greater than)',
      method: 'gt',
      schema: q.number().gt(5),
      value: 5,
      validEqual: false,
      errorCode: NumberErrorCode.GT,
    },
    {
      name: 'max',
      method: 'max',
      schema: q.number().max(10),
      value: 10,
      validEqual: true,
      errorCode: NumberErrorCode.MAX,
    },
    {
      name: 'lte (alias for max)',
      method: 'lte',
      schema: q.number().lte(10),
      value: 10,
      validEqual: true,
      errorCode: NumberErrorCode.MAX,
    },
    {
      name: 'lt (less than)',
      method: 'lt',
      schema: q.number().lt(10),
      value: 10,
      validEqual: false,
      errorCode: NumberErrorCode.LT,
    },
  ])('$name constraint', ({ method, value, schema, validEqual, errorCode }) => {
    it('validates correctly', () => {
      // For min/gte/gt: above = higher value, below = lower value
      // For max/lte/lt: above = higher value, below = lower value
      const isMinType = method === 'min' || method === 'gte' || method === 'gt';

      // Test value above the threshold (higher number)
      const higherValue = value + 5;
      const result1 = schema.parse(higherValue);
      expect(result1.success).toBe(isMinType);
      if (!result1.success) {
        expect(result1.error?.code).toBe(errorCode);
        // Check the message format based on error code
        if (errorCode === NumberErrorCode.MAX) {
          expect(result1.error?.message).toContain(
            formatMessage(NumberErrorMessages[NumberErrorCode.MAX], value),
          );
        } else if (errorCode === NumberErrorCode.LT) {
          expect(result1.error?.message).toContain(
            formatMessage(NumberErrorMessages[NumberErrorCode.LT], value),
          );
        }
      }

      // Test value equal to the threshold
      const result2 = schema.parse(value);
      expect(result2.success).toBe(validEqual);
      if (!validEqual) {
        expect(result2.error?.code).toBe(errorCode);
        // Check the message format based on error code
        if (errorCode === NumberErrorCode.GT) {
          expect(result2.error?.message).toContain(
            formatMessage(NumberErrorMessages[NumberErrorCode.GT], value),
          );
        } else if (errorCode === NumberErrorCode.LT) {
          expect(result2.error?.message).toContain(
            formatMessage(NumberErrorMessages[NumberErrorCode.LT], value),
          );
        }
      }

      // Test value below the threshold (lower number)
      const lowerValue = value - 1;
      const result3 = schema.parse(lowerValue);
      expect(result3.success).toBe(!isMinType);
      if (!result3.success) {
        expect(result3.error?.code).toBe(errorCode);
        // Check the message format based on error code
        if (errorCode === NumberErrorCode.MIN) {
          expect(result3.error?.message).toContain(
            formatMessage(NumberErrorMessages[NumberErrorCode.MIN], value),
          );
        } else if (errorCode === NumberErrorCode.GT) {
          expect(result3.error?.message).toContain(
            formatMessage(NumberErrorMessages[NumberErrorCode.GT], value),
          );
        }
      }
    });
  });

  // Parameterized tests for sign constraints
  describe.each([
    {
      method: 'positive',
      schema: q.number().positive(),
      validPositive: true,
      validZero: false,
      validNegative: false,
      errorCode: NumberErrorCode.POSITIVE,
    },
    {
      method: 'nonNegative',
      schema: q.number().nonNegative(),
      validPositive: true,
      validZero: true,
      validNegative: false,
      errorCode: NumberErrorCode.NON_NEGATIVE,
    },
    {
      method: 'negative',
      schema: q.number().negative(),
      validPositive: false,
      validZero: false,
      validNegative: true,
      errorCode: NumberErrorCode.NEGATIVE,
    },
    {
      method: 'nonPositive',
      schema: q.number().nonPositive(),
      validPositive: false,
      validZero: true,
      validNegative: true,
      errorCode: NumberErrorCode.NON_POSITIVE,
    },
  ])(
    '$name constraint',
    ({ schema, validPositive, validZero, validNegative, errorCode }) => {
      it('validates correctly', () => {
        // Test positive value
        const result1 = schema.parse(42);
        expect(result1.success).toBe(validPositive);
        if (!validPositive) {
          expect(result1.error?.code).toBe(errorCode);
          expect(result1.error?.message).toContain(
            NumberErrorMessages[errorCode],
          );
        }

        // Test zero
        const result2 = schema.parse(0);
        expect(result2.success).toBe(validZero);
        if (!validZero) {
          expect(result2.error?.code).toBe(errorCode);
          expect(result2.error?.message).toContain(
            NumberErrorMessages[errorCode],
          );
        }

        // Test negative value
        const result3 = schema.parse(-42);
        expect(result3.success).toBe(validNegative);
        if (!validNegative) {
          expect(result3.error?.code).toBe(errorCode);
          expect(result3.error?.message).toContain(
            NumberErrorMessages[errorCode],
          );
        }
      });
    },
  );

  // Parameterized tests for type constraints
  describe.each([
    {
      name: 'integer',
      schema: q.number().int(),
      validInteger: true,
      validDecimal: false,
      errorCode: NumberErrorCode.INT,
    },
    {
      name: 'safe integer',
      schema: q.number().safe(),
      validInteger: true,
      validDecimal: false,
      validUnsafe: false,
      errorCode: NumberErrorCode.SAFE,
    },
  ])(
    '$name constraint',
    ({ schema, validInteger, validDecimal, validUnsafe, errorCode }) => {
      it('validates correctly', () => {
        // Test integer value
        const result1 = schema.parse(42);
        expect(result1.success).toBe(validInteger);

        // Test decimal value
        const result2 = schema.parse(42.5);
        expect(result2.success).toBe(validDecimal);
        if (!validDecimal) {
          expect(result2.error?.code).toBe(errorCode);
          expect(result2.error?.message).toContain(
            NumberErrorMessages[errorCode],
          );
        }

        // Test unsafe integer if applicable
        if (validUnsafe !== undefined) {
          const result3 = schema.parse(Number.MAX_SAFE_INTEGER + 1);
          expect(result3.success).toBe(validUnsafe);
          if (!validUnsafe) {
            expect(result3.error?.code).toBe(errorCode);
            expect(result3.error?.message).toContain(
              NumberErrorMessages[errorCode],
            );
          }
        }
      });
    },
  );

  // Test for finite constraint separately due to its unique test cases
  it('should validate finite', () => {
    const schema = q.number().finite();

    // Valid finite number
    const result1 = schema.parse(42);
    expect(result1.success).toBe(true);

    // Invalid (Infinity)
    const result2 = schema.parse(Number.POSITIVE_INFINITY);
    expect(result2.success).toBe(false);
    expect(result2.error?.code).toBe(NumberErrorCode.FINITE);
    expect(result2.error?.message).toContain(
      NumberErrorMessages[NumberErrorCode.FINITE],
    );

    // Invalid (-Infinity)
    const result3 = schema.parse(Number.NEGATIVE_INFINITY);
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(NumberErrorCode.FINITE);
    expect(result3.error?.message).toContain(
      NumberErrorMessages[NumberErrorCode.FINITE],
    );
  });

  // Parameterized tests for multiple constraints
  describe.each([
    {
      name: 'multipleOf',
      schema: q.number().multipleOf(5),
      value: 5,
    },
    {
      name: 'step (alias for multipleOf)',
      schema: q.number().step(5),
      value: 5,
    },
  ])('$name constraint', ({ schema, value }) => {
    it('validates correctly', () => {
      // Valid multiple
      const result1 = schema.parse(15);
      expect(result1.success).toBe(true);

      // Invalid (not a multiple)
      const result2 = schema.parse(17);
      expect(result2.success).toBe(false);
      expect(result2.error?.code).toBe(NumberErrorCode.MULTIPLE_OF);
      expect(result2.error?.message).toContain(
        formatMessage(NumberErrorMessages[NumberErrorCode.MULTIPLE_OF], value),
      );
    });
  });

  // Special case for multipleOf with zero
  it('should handle multipleOf with zero', () => {
    const schema = q.number().multipleOf(0);
    const result = schema.parse(42);
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(NumberErrorCode.MULTIPLE_OF_ZERO);
    expect(result.error?.message).toContain(
      NumberErrorMessages[NumberErrorCode.MULTIPLE_OF_ZERO],
    );
  });

  it('should chain multiple constraints', () => {
    const schema = q.number().gt(0).lt(100).int().step(5);

    // Valid number
    const result1 = schema.parse(25);
    expect(result1.success).toBe(true);

    // Too small
    const result2 = schema.parse(-5);
    expect(result2.success).toBe(false);
    expect(result2.error?.code).toBe(NumberErrorCode.GT);
    expect(result2.error?.message).toContain(
      formatMessage(NumberErrorMessages[NumberErrorCode.GT], 0)
    );

    // Too large
    const result3 = schema.parse(105);
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(NumberErrorCode.LT);
    expect(result3.error?.message).toContain(
      formatMessage(NumberErrorMessages[NumberErrorCode.LT], 100)
    );

    // Not an integer
    const result4 = schema.parse(25.5);
    expect(result4.success).toBe(false);
    expect(result4.error?.code).toBe(NumberErrorCode.INT);
    expect(result4.error?.message).toContain(
      NumberErrorMessages[NumberErrorCode.INT]
    );

    // Not a multiple of 5
    const result5 = schema.parse(27);
    expect(result5.success).toBe(false);
    expect(result5.error?.code).toBe(NumberErrorCode.MULTIPLE_OF);
    expect(result5.error?.message).toContain(
      formatMessage(NumberErrorMessages[NumberErrorCode.MULTIPLE_OF], 5)
    );
  });
});
