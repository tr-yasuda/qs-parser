import { describe, expect, it } from 'vitest';
import { DateErrorCode, DateErrorMessages } from '../src/core/error.js';
import { q } from '../src/index.js';
import { formatMessage } from './helper.js';

describe('date schema', () => {
  it('should validate dates', () => {
    const schema = q.date();

    // Valid date
    const validDate = new Date('2023-01-01');
    const result1 = schema.parse(validDate);
    expect(result1.success).toBe(true);
    expect(result1.value).toBe(validDate);

    // Invalid date (not a Date object)
    const stringValue = '2023-01-01';
    const result2 = schema.parse(stringValue);
    expect(result2.success).toBe(false);
    expect(result2.value).toBe(stringValue); // Original value is preserved
    expect(result2.error?.message).toContain(
      DateErrorMessages[DateErrorCode.TYPE],
    );
    expect(result2.error?.code).toBe(DateErrorCode.TYPE);

    // Invalid date (Invalid Date)
    const invalidDate = new Date('invalid-date');
    const result3 = schema.parse(invalidDate);
    expect(result3.success).toBe(false);
    expect(result3.value).toBe(invalidDate); // Original value is preserved
    expect(result3.error?.message).toContain(
      DateErrorMessages[DateErrorCode.TYPE],
    );
    expect(result3.error?.code).toBe(DateErrorCode.TYPE);
  });

  it('should validate min date', () => {
    const minDate = new Date('2023-01-01');
    const schema = q.date().min(minDate);

    // Valid date (equal to min)
    const result1 = schema.parse(new Date('2023-01-01'));
    expect(result1.success).toBe(true);

    // Valid date (after min)
    const result2 = schema.parse(new Date('2023-01-02'));
    expect(result2.success).toBe(true);

    // Invalid date (before min)
    const result3 = schema.parse(new Date('2022-12-31'));
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(DateErrorCode.MIN);
    expect(result3.error?.message).toContain(
      formatMessage(
        DateErrorMessages[DateErrorCode.MIN],
        minDate.toISOString(),
      ),
    );
  });

  it('should validate max date', () => {
    const maxDate = new Date('2023-01-01');
    const schema = q.date().max(maxDate);

    // Valid date (equal to max)
    const result1 = schema.parse(new Date('2023-01-01'));
    expect(result1.success).toBe(true);

    // Valid date (before max)
    const result2 = schema.parse(new Date('2022-12-31'));
    expect(result2.success).toBe(true);

    // Invalid date (after max)
    const result3 = schema.parse(new Date('2023-01-02'));
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(DateErrorCode.MAX);
    expect(result3.error?.message).toContain(
      formatMessage(
        DateErrorMessages[DateErrorCode.MAX],
        maxDate.toISOString(),
      ),
    );
  });

  it('should validate past date', () => {
    const schema = q.date().past();
    const now = new Date();

    // Create a date in the past (1 day ago)
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - 1);

    // Create a date in the future (1 day from now)
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + 1);

    // Valid date (in the past)
    const result1 = schema.parse(pastDate);
    expect(result1.success).toBe(true);

    // Invalid date (in the future)
    const result2 = schema.parse(futureDate);
    expect(result2.success).toBe(false);
    expect(result2.error?.code).toBe(DateErrorCode.PAST);
    expect(result2.error?.message).toBe(DateErrorMessages[DateErrorCode.PAST]);
  });

  it('should validate future date', () => {
    const schema = q.date().future();
    const now = new Date();

    // Create a date in the past (1 day ago)
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - 1);

    // Create a date in the future (1 day from now)
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + 1);

    // Valid date (in the future)
    const result1 = schema.parse(futureDate);
    expect(result1.success).toBe(true);

    // Invalid date (in the past)
    const result2 = schema.parse(pastDate);
    expect(result2.success).toBe(false);
    expect(result2.error?.code).toBe(DateErrorCode.FUTURE);
    expect(result2.error?.message).toBe(
      DateErrorMessages[DateErrorCode.FUTURE],
    );
  });

  it('should validate between dates', () => {
    const minDate = new Date('2023-01-01');
    const maxDate = new Date('2023-01-31');
    const schema = q.date().between(minDate, maxDate);

    // Valid date (equal to min)
    const result1 = schema.parse(new Date('2023-01-01'));
    expect(result1.success).toBe(true);

    // Valid date (equal to max)
    const result2 = schema.parse(new Date('2023-01-31'));
    expect(result2.success).toBe(true);

    // Valid date (between min and max)
    const result3 = schema.parse(new Date('2023-01-15'));
    expect(result3.success).toBe(true);

    // Invalid date (before min)
    const result4 = schema.parse(new Date('2022-12-31'));
    expect(result4.success).toBe(false);
    expect(result4.error?.code).toBe(DateErrorCode.BETWEEN);
    expect(result4.error?.message).toContain(
      formatMessage(
        DateErrorMessages[DateErrorCode.BETWEEN],
        minDate.toISOString(),
        maxDate.toISOString(),
      ),
    );

    // Invalid date (after max)
    const result5 = schema.parse(new Date('2023-02-01'));
    expect(result5.success).toBe(false);
    expect(result5.error?.code).toBe(DateErrorCode.BETWEEN);
    expect(result5.error?.message).toContain(
      formatMessage(
        DateErrorMessages[DateErrorCode.BETWEEN],
        minDate.toISOString(),
        maxDate.toISOString(),
      ),
    );
  });

  it('should validate today', () => {
    const schema = q.date().today();
    const now = new Date();

    // Create a date for today (same year, month, day)
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      12, // Different hour
      0,
      0,
    );

    // Create a date for yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    // Create a date for tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    // Valid date (today)
    const result1 = schema.parse(today);
    expect(result1.success).toBe(true);

    // Invalid date (yesterday)
    const result2 = schema.parse(yesterday);
    expect(result2.success).toBe(false);
    expect(result2.error?.code).toBe(DateErrorCode.TODAY);
    expect(result2.error?.message).toBe(DateErrorMessages[DateErrorCode.TODAY]);

    // Invalid date (tomorrow)
    const result3 = schema.parse(tomorrow);
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(DateErrorCode.TODAY);
    expect(result3.error?.message).toBe(DateErrorMessages[DateErrorCode.TODAY]);
  });

  it('should chain multiple constraints', () => {
    const now = new Date();
    const minDate = new Date(now);
    minDate.setDate(now.getDate() - 30); // 30 days ago

    const maxDate = new Date(now);
    maxDate.setDate(now.getDate() - 1); // Yesterday

    // Create a schema that requires a date in the past, between minDate and maxDate
    const schema = q.date().past().between(minDate, maxDate);

    // Valid date (in the past, between minDate and maxDate)
    const validDate = new Date(now);
    validDate.setDate(now.getDate() - 15); // 15 days ago
    const result1 = schema.parse(validDate);
    expect(result1.success).toBe(true);

    // Invalid date (in the future)
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + 1); // Tomorrow
    const result2 = schema.parse(futureDate);
    expect(result2.success).toBe(false);
    expect(result2.error?.code).toBe(DateErrorCode.PAST);

    // Invalid date (in the past, but before minDate)
    const tooOldDate = new Date(now);
    tooOldDate.setDate(now.getDate() - 31); // 31 days ago
    const result3 = schema.parse(tooOldDate);
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(DateErrorCode.BETWEEN);
  });
});
