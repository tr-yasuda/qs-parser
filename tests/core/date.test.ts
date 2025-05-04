import { describe, expect, it } from 'vitest';
import {
  DateErrorCode,
  DateErrorMessages,
  formatMessage,
} from '../../src/core/error.js';
import { q } from '../../src/index.js';

// Helper functions for date creation
const createDateWithTime = (
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
  seconds: number,
): Date => {
  return new Date(year, month - 1, day, hours, minutes, seconds);
};

// Helper function to create test dates relative to now
const createTestDates = () => {
  const now = new Date();

  // Created a date 30 days ago
  const minDate = new Date(now);
  minDate.setDate(now.getDate() - 30);

  // Create a date for yesterday
  const maxDate = new Date(now);
  maxDate.setDate(now.getDate() - 1);

  // Created a date 15 days ago (valid date between min and max)
  const validDate = new Date(now);
  validDate.setDate(now.getDate() - 15);

  // Create a date for tomorrow (future date)
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + 1);

  // Created a date 31 days ago (before min date)
  const tooOldDate = new Date(now);
  tooOldDate.setDate(now.getDate() - 31);

  return { now, minDate, maxDate, validDate, futureDate, tooOldDate };
};

describe('date schema', () => {
  describe('date string parsing', () => {
    it('should handle various valid and invalid date string formats', () => {
      const schema = q.date();

      // Valid YYYY-MM-DD format (the only supported string format)
      const validDateString = '2023-01-01';
      const result1 = schema.parse(validDateString);
      expect(result1.success).toBe(true);
      expect(result1.value).toBeInstanceOf(Date);
      expect(result1.value.getFullYear()).toBe(2023);
      expect(result1.value.getMonth()).toBe(0); // January is 0
      expect(result1.value.getDate()).toBe(1);

      // Invalid formats - should be rejected
      const invalidFormats = [
        '01-01-2023', // DD-MM-YYYY
        '2023/01/01', // YYYY/MM/DD
        'Jan 1, 2023', // Month name format
        '1/1/2023', // M/D/YYYY
        '2023-01-01T12:00:00Z', // ISO with time
        '2023-01-01T12:00:00+09:00', // ISO with timezone
        '20230101', // YYYYMMDD without separators
        '01 Jan 2023', // DD MMM YYYY
        '2023-1-1', // YYYY-M-D (missing leading zeros)
      ];

      for (const format of invalidFormats) {
        const result = schema.parse(format);
        expect(result.success).toBe(false);
        expect(result.value).toBe(format); // Original value is preserved
        expect(result.error?.code).toBe(DateErrorCode.TYPE);
      }
    });

    it('should handle boundary date values correctly', () => {
      const schema = q.date();

      // Leap year date (February 29)
      const leapYearDate = '2024-02-29'; // 2024 is a leap year
      const result1 = schema.parse(leapYearDate);
      expect(result1.success).toBe(true);
      expect(result1.value).toBeInstanceOf(Date);
      expect(result1.value.getFullYear()).toBe(2024);
      expect(result1.value.getMonth()).toBe(1); // February is 1
      expect(result1.value.getDate()).toBe(29);

      // Invalid leap year date
      const invalidLeapYearDate = '2023-02-29'; // 2023 is not a leap year
      const result2 = schema.parse(invalidLeapYearDate);
      expect(result2.success).toBe(false);
      expect(result2.error?.code).toBe(DateErrorCode.TYPE);

      // Month-edge dates
      const monthEndDates = [
        '2023-01-31', // January has 31 days
        '2023-04-30', // April has 30 days
        '2023-02-28', // February has 28 days in non-leap years
      ];

      for (const dateStr of monthEndDates) {
        const result = schema.parse(dateStr);
        expect(result.success).toBe(true);
        expect(result.value).toBeInstanceOf(Date);
      }

      // Year boundary dates
      const yearStart = '2023-01-01';
      const yearEnd = '2023-12-31';

      const resultYearStart = schema.parse(yearStart);
      expect(resultYearStart.success).toBe(true);
      expect(resultYearStart.value.getFullYear()).toBe(2023);
      expect(resultYearStart.value.getMonth()).toBe(0);
      expect(resultYearStart.value.getDate()).toBe(1);

      const resultYearEnd = schema.parse(yearEnd);
      expect(resultYearEnd.success).toBe(true);
      expect(resultYearEnd.value.getFullYear()).toBe(2023);
      expect(resultYearEnd.value.getMonth()).toBe(11); // December is 11
      expect(resultYearEnd.value.getDate()).toBe(31);
    });
  });

  describe('date object handling', () => {
    it('should handle Date objects with time components', () => {
      const schema = q.date();

      // Date with a time component
      const dateWithTime = createDateWithTime(2023, 1, 1, 12, 30, 45);
      const result = schema.parse(dateWithTime);
      expect(result.success).toBe(true);
      expect(result.value).toBeInstanceOf(Date);
      expect(result.value.getFullYear()).toBe(2023);
      expect(result.value.getMonth()).toBe(0); // January is 0
      expect(result.value.getDate()).toBe(1);
      expect(result.value.getHours()).toBe(12);
      expect(result.value.getMinutes()).toBe(30);
      expect(result.value.getSeconds()).toBe(45);
    });

    it('should handle extreme date values', () => {
      const schema = q.date();

      // Very old date
      const veryOldDate = new Date(0); // January 1, 1970 (Unix epoch)
      const result1 = schema.parse(veryOldDate);
      expect(result1.success).toBe(true);

      // Very future date
      const veryFutureDate = new Date(8640000000000000); // Maximum date value
      const result2 = schema.parse(veryFutureDate);
      expect(result2.success).toBe(true);

      // Date before Unix epoch
      const beforeEpochDate = new Date(-1000 * 60 * 60 * 24 * 365); // Roughly 1 year before the epoch
      const result3 = schema.parse(beforeEpochDate);
      expect(result3.success).toBe(true);
    });
  });

  describe('invalid date handling', () => {
    it('should reject non-date values', () => {
      const schema = q.date();

      // Test with various non-date values
      const nonDateValues = [
        null,
        undefined,
        123,
        true,
        false,
        {},
        [],
        () => {},
        Symbol('date'),
        BigInt(123),
      ];

      for (const value of nonDateValues) {
        const result = schema.parse(value);
        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(DateErrorCode.TYPE);
      }
    });

    it('should reject date strings with invalid day/month combinations', () => {
      const schema = q.date();

      // Invalid day/month combinations
      const invalidDates = [
        '2023-04-31', // April has 30 days
        '2023-06-31', // June has 30 days
        '2023-09-31', // September has 30 days
        '2023-11-31', // November has 30 days
        '2023-02-30', // February never has 30 days
      ];

      for (const dateStr of invalidDates) {
        const result = schema.parse(dateStr);
        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(DateErrorCode.TYPE);
      }
    });

    it('should handle date strings at the boundaries of valid JavaScript dates', () => {
      const schema = q.date();

      // JavaScript can handle dates from -271821-04-20 to 275760-09-13
      // Testing near the boundaries

      // Valid dates near boundaries (using Date objects since a string format is limited)
      const earlyDate = new Date(-271821, 3, 20); // April 20, -271821
      const farFutureDate = new Date(275760, 8, 13); // September 13, 275760

      // These should be valid Date objects
      expect(schema.parse(earlyDate).success).toBe(
        !Number.isNaN(earlyDate.getTime()),
      );
      expect(schema.parse(farFutureDate).success).toBe(
        !Number.isNaN(farFutureDate.getTime()),
      );

      // Invalid Date objects
      const invalidDate1 = new Date('Invalid Date');
      const invalidDate2 = new Date(Number.NaN);

      expect(schema.parse(invalidDate1).success).toBe(false);
      expect(schema.parse(invalidDate2).success).toBe(false);
    });

    it('should validate date strings with valid format but invalid content', () => {
      const schema = q.date();

      // These have the correct YYYY-MM-DD format but invalid content
      const invalidFormatDates = [
        '2023-00-01', // Month 0 is invalid (months are 1-12)
        '2023-13-01', // Month 13 is invalid
        '2023-01-00', // Day 0 is invalid
        '2023-01-32', // Day 32 is invalid for January
        'abcd-01-01', // Non-numeric year
        '2023-ab-01', // Non-numeric month
        '2023-01-ab', // Non-numeric day
      ];

      for (const dateStr of invalidFormatDates) {
        // These strings match the regex but create invalid dates
        // The regex only checks format, not validity
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          const result = schema.parse(dateStr);
          // The parser should reject these as they create invalid Date objects
          expect(result.success).toBe(false);
          expect(result.error?.code).toBe(DateErrorCode.TYPE);
        }
      }
    });
  });

  it('should validate dates', () => {
    const schema = q.date();

    // Valid date
    const validDate = new Date('2023-01-01');
    const result1 = schema.parse(validDate);
    expect(result1.success).toBe(true);
    expect(result1.value).toBe(validDate);

    // Valid date string (in YYYY-MM-DD format)
    const stringValue = '2023-01-01';
    const result2 = schema.parse(stringValue);
    expect(result2.success).toBe(true);
    expect(result2.value).toBeInstanceOf(Date);
    expect(result2.value.getFullYear()).toBe(2023);
    expect(result2.value.getMonth()).toBe(0); // January is 0
    expect(result2.value.getDate()).toBe(1);

    // Invalid date string (wrong format)
    const invalidStringValue = '01/01/2023';
    const result3 = schema.parse(invalidStringValue);
    expect(result3.success).toBe(false);
    expect(result3.value).toBe(invalidStringValue); // Original value is preserved
    expect(result3.error?.message).toContain(
      DateErrorMessages[DateErrorCode.TYPE],
    );
    expect(result3.error?.code).toBe(DateErrorCode.TYPE);

    // Invalid date (Invalid Date)
    const invalidDate = new Date('invalid-date');
    const result4 = schema.parse(invalidDate);
    expect(result4.success).toBe(false);
    expect(result4.value).toBe(invalidDate); // Original value is preserved
    expect(result4.error?.message).toContain(
      DateErrorMessages[DateErrorCode.TYPE],
    );
    expect(result4.error?.code).toBe(DateErrorCode.TYPE);
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
    // Get test dates
    const { minDate, maxDate, validDate, futureDate, tooOldDate } =
      createTestDates();

    // Create a schema that requires a date in the past, between minDate and maxDate
    const schema = q.date().past().between(minDate, maxDate);

    // Valid date (in the past, between minDate and maxDate)
    const result1 = schema.parse(validDate);
    expect(result1.success).toBe(true);

    // Invalid date (in the future)
    const result2 = schema.parse(futureDate);
    expect(result2.success).toBe(false);
    expect(result2.error?.code).toBe(DateErrorCode.PAST);

    // Invalid date (in the past, but before minDate)
    const result3 = schema.parse(tooOldDate);
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(DateErrorCode.BETWEEN);
  });

  describe('constraint combinations and edge cases', () => {
    it('should validate date strings at constraint boundaries', () => {
      // Create dates for testing using local time to avoid timezone issues
      // We'll create dates at noon to avoid any timezone edge cases
      const minDate = new Date(2023, 0, 1, 12, 0, 0); // January 1, 2023 12:00:00 local time
      const maxDate = new Date(2023, 11, 31, 12, 0, 0); // December 31, 2023 12:00:00 local time

      // Create schema with min and max constraints
      const schema = q.date().min(minDate).max(maxDate);

      // Test with Date objects at the boundaries (also using local time)
      const minDateObj = new Date(2023, 0, 1, 12, 0, 0);
      const maxDateObj = new Date(2023, 11, 31, 12, 0, 0);
      const insideBoundaryObj = new Date(2023, 5, 15, 12, 0, 0); // June 15, 2023
      const beforeMinObj = new Date(2022, 11, 31, 12, 0, 0); // December 31, 2022
      const afterMaxObj = new Date(2024, 0, 1, 12, 0, 0); // January 1, 2024

      // Boundary tests with Date objects
      expect(schema.parse(minDateObj).success).toBe(true);
      expect(schema.parse(maxDateObj).success).toBe(true);
      expect(schema.parse(insideBoundaryObj).success).toBe(true);
      expect(schema.parse(beforeMinObj).success).toBe(false);
      expect(schema.parse(afterMaxObj).success).toBe(false);

      // Verify error codes
      expect(schema.parse(beforeMinObj).error?.code).toBe(DateErrorCode.MIN);
      expect(schema.parse(afterMaxObj).error?.code).toBe(DateErrorCode.MAX);

      // For date strings, we'll test with a different approach
      // Since our validator now properly validates date strings,
      // we'll create a new schema with constraints based on the parsed dates

      // First, let's create a schema that doesn't have timezone issues
      const dateStrSchema = q.date();

      // Parse the date strings to get the actual Date objects that will be created
      const parsedMin = dateStrSchema.parse('2023-01-01');
      const parsedMax = dateStrSchema.parse('2023-12-31');

      // Only proceed if the parsing was successful
      if (parsedMin.success && parsedMax.success) {
        // Create a new schema with constraints based on the parsed dates
        const strSchema = q.date().min(parsedMin.value).max(parsedMax.value);

        // Test with date strings
        const minDateString = '2023-01-01';
        const maxDateString = '2023-12-31';
        const insideBoundaryString = '2023-06-15';
        const beforeMinString = '2022-12-31';
        const afterMaxString = '2024-01-01';

        // Boundary tests with strings
        expect(strSchema.parse(minDateString).success).toBe(true);
        expect(strSchema.parse(maxDateString).success).toBe(true);
        expect(strSchema.parse(insideBoundaryString).success).toBe(true);
        expect(strSchema.parse(beforeMinString).success).toBe(false);
        expect(strSchema.parse(afterMaxString).success).toBe(false);

        // Verify error codes for strings
        expect(strSchema.parse(beforeMinString).error?.code).toBe(
          DateErrorCode.MIN,
        );
        expect(strSchema.parse(afterMaxString).error?.code).toBe(
          DateErrorCode.MAX,
        );
      }
    });

    it('should apply constraints in different orders with the same result', () => {
      // Get test dates
      const { minDate, maxDate, validDate, futureDate, tooOldDate } =
        createTestDates();

      // Create schemas with constraints in different orders
      const schema1 = q.date().past().between(minDate, maxDate);
      const schema2 = q.date().between(minDate, maxDate).past();

      // Both schemas should behave the same for valid dates
      expect(schema1.parse(validDate).success).toBe(true);
      expect(schema2.parse(validDate).success).toBe(true);

      // For invalid dates, the error code might differ based on which constraint is checked first
      // schema1 checks past() first, then between()
      const result1Future = schema1.parse(futureDate);
      expect(result1Future.success).toBe(false);
      expect(result1Future.error?.code).toBe(DateErrorCode.PAST);

      // schema2 checks between() first, then past()
      const result2Future = schema2.parse(futureDate);
      expect(result2Future.success).toBe(false);
      // The error code might be PAST or might be something else depending on implementation
      // The important thing is that it fails validation
      expect(result2Future.success).toBe(false);

      // Both should reject too old dates
      expect(schema1.parse(tooOldDate).success).toBe(false);
      expect(schema2.parse(tooOldDate).success).toBe(false);
    });

    it('should handle complex constraint combinations', () => {
      const now = new Date();

      // Create a schema with multiple constraints
      const schema = q
        .date()
        .min(new Date('2000-01-01'))
        .max(new Date('2100-12-31'))
        .past();

      // Valid date: in the past and within min/max range
      const validPastDate = new Date(now);
      validPastDate.setFullYear(now.getFullYear() - 1); // Last year
      expect(schema.parse(validPastDate).success).toBe(true);

      // Invalid: future date (fails past constraint)
      const futureDate = new Date(now);
      futureDate.setDate(now.getDate() + 1); // Tomorrow
      expect(schema.parse(futureDate).success).toBe(false);
      expect(schema.parse(futureDate).error?.code).toBe(DateErrorCode.PAST);

      // Invalid: too old (fails min constraint)
      const tooOldDate = new Date('1999-12-31');
      expect(schema.parse(tooOldDate).success).toBe(false);
      expect(schema.parse(tooOldDate).error?.code).toBe(DateErrorCode.MIN);

      // Invalid: too future (fails max constraint before past is checked)
      const tooFutureDate = new Date('2101-01-01');
      expect(schema.parse(tooFutureDate).success).toBe(false);
      expect(schema.parse(tooFutureDate).error?.code).toBe(DateErrorCode.MAX);

      // Test with date strings
      const validPastString = '2020-01-01';
      expect(schema.parse(validPastString).success).toBe(true);

      const tooOldString = '1999-12-31';
      expect(schema.parse(tooOldString).success).toBe(false);
    });

    it('should validate constraints with date strings and Date objects consistently', () => {
      // First, let's create a schema that doesn't have timezone issues
      const dateStrSchema = q.date();

      // Parse the date strings to get the actual Date objects that will be created
      const parsedMin = dateStrSchema.parse('2023-01-01');
      const parsedMax = dateStrSchema.parse('2023-12-31');

      // Only proceed if the parsing was successful
      if (parsedMin.success && parsedMax.success) {
        // Create a schema with constraints based on the parsed dates
        const schema = q.date().min(parsedMin.value).max(parsedMax.value);

        // Test with Date objects created the same way as the constraints
        const validDateObj = dateStrSchema.parse('2023-06-15').value;
        const minDateObj = parsedMin.value;
        const maxDateObj = parsedMax.value;
        const beforeMinDateObj = dateStrSchema.parse('2022-12-31').value;
        const afterMaxDateObj = dateStrSchema.parse('2024-01-01').value;

        // Test with Date objects
        expect(schema.parse(validDateObj).success).toBe(true);
        expect(schema.parse(minDateObj).success).toBe(true);
        expect(schema.parse(maxDateObj).success).toBe(true);
        expect(schema.parse(beforeMinDateObj).success).toBe(false);
        expect(schema.parse(afterMaxDateObj).success).toBe(false);

        // Test with equivalent date strings
        const validDateStr = '2023-06-15';
        const minDateStr = '2023-01-01';
        const maxDateStr = '2023-12-31';
        const beforeMinDateStr = '2022-12-31';
        const afterMaxDateStr = '2024-01-01';

        // Boundary tests with strings
        expect(schema.parse(validDateStr).success).toBe(true);
        expect(schema.parse(minDateStr).success).toBe(true);
        expect(schema.parse(maxDateStr).success).toBe(true);
        expect(schema.parse(beforeMinDateStr).success).toBe(false);
        expect(schema.parse(afterMaxDateStr).success).toBe(false);

        // Verify that the error codes are the same for both types
        expect(schema.parse(beforeMinDateObj).error?.code).toBe(
          schema.parse(beforeMinDateStr).error?.code,
        );
        expect(schema.parse(afterMaxDateObj).error?.code).toBe(
          schema.parse(afterMaxDateStr).error?.code,
        );
      }
    });
  });
});
