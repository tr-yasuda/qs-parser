import { describe, expect, it } from 'vitest';
import {
  StringErrorCode,
  StringErrorMessages,
  formatMessage,
} from '../../src/core/error.js';
import { q } from '../../src/index.js';

describe('string schema', () => {
  it('should validate strings', () => {
    const schema = q.string();

    // Valid string
    const result1 = schema.parse('hello');
    expect(result1.success).toBe(true);
    expect(result1.value).toBe('hello');

    // Non-string value
    const numberValue = 123;
    const result2 = schema.parse(numberValue);
    expect(result2.success).toBe(false);
    expect(result2.value).toBe(numberValue); // Original value is preserved
    expect(result2.error?.message).toContain(
      StringErrorMessages[StringErrorCode.TYPE],
    );
    expect(result2.error?.code).toBe(StringErrorCode.TYPE);
  });

  it('should validate max length', () => {
    const maxLength = 5;
    const schema = q.string().max(maxLength);

    // Valid length
    const result1 = schema.parse('hello');
    expect(result1.success).toBe(true);

    // Invalid length
    const result2 = schema.parse('hello world');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      formatMessage(StringErrorMessages[StringErrorCode.MAX_LENGTH], maxLength),
    );
    expect(result2.error?.code).toBe(StringErrorCode.MAX_LENGTH);
  });

  it('should validate min length', () => {
    const minLength = 5;
    const schema = q.string().min(minLength);

    // Valid length
    const result1 = schema.parse('hello');
    expect(result1.success).toBe(true);

    // Invalid length
    const result2 = schema.parse('hi');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      formatMessage(StringErrorMessages[StringErrorCode.MIN_LENGTH], minLength),
    );
    expect(result2.error?.code).toBe(StringErrorCode.MIN_LENGTH);
  });

  it('should validate pattern', () => {
    const pattern = /^[a-z]+$/;
    const schema = q.string().pattern(pattern);

    // Valid pattern
    const result1 = schema.parse('hello');
    expect(result1.success).toBe(true);

    // Invalid pattern
    const result2 = schema.parse('Hello123');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      formatMessage(StringErrorMessages[StringErrorCode.PATTERN], pattern),
    );
    expect(result2.error?.code).toBe(StringErrorCode.PATTERN);
  });

  it('should validate email', () => {
    const schema = q.string().email();

    // Valid email
    const result1 = schema.parse('test@example.com');
    expect(result1.success).toBe(true);

    // Invalid email
    const result2 = schema.parse('not-an-email');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      StringErrorMessages[StringErrorCode.EMAIL],
    );
    expect(result2.error?.code).toBe(StringErrorCode.EMAIL);
  });

  it('should validate url', () => {
    const schema = q.string().url();

    // Valid URL
    const result1 = schema.parse('https://example.com');
    expect(result1.success).toBe(true);

    // Invalid URL
    const result2 = schema.parse('not-a-url');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      StringErrorMessages[StringErrorCode.URL],
    );
    expect(result2.error?.code).toBe(StringErrorCode.URL);
  });

  it('should validate emoji', () => {
    const schema = q.string().emoji();

    // Valid emoji
    const result1 = schema.parse('😀');
    expect(result1.success).toBe(true);

    // Invalid (no emoji)
    const result2 = schema.parse('hello');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      StringErrorMessages[StringErrorCode.EMOJI],
    );
    expect(result2.error?.code).toBe(StringErrorCode.EMOJI);
  });

  it('should validate uuid', () => {
    const schema = q.string().uuid();

    // Valid UUID
    const result1 = schema.parse('123e4567-e89b-12d3-a456-426614174000');
    expect(result1.success).toBe(true);

    // Invalid UUID
    const result2 = schema.parse('not-a-uuid');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      StringErrorMessages[StringErrorCode.UUID],
    );
    expect(result2.error?.code).toBe(StringErrorCode.UUID);
  });

  it('should validate uuid v4', () => {
    const schema = q.string().uuidV4();

    // Valid UUIDv4
    const result1 = schema.parse('123e4567-e89b-42d3-a456-426614174000');
    expect(result1.success).toBe(true);

    // Invalid UUIDv4 (wrong version number)
    const result2 = schema.parse('123e4567-e89b-12d3-a456-426614174000');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      StringErrorMessages[StringErrorCode.UUID_V4],
    );
    expect(result2.error?.code).toBe(StringErrorCode.UUID_V4);

    // Invalid UUIDv4 (not a UUID)
    const result3 = schema.parse('not-a-uuid');
    expect(result3.success).toBe(false);
    expect(result3.error?.message).toContain(
      StringErrorMessages[StringErrorCode.UUID_V4],
    );
    expect(result3.error?.code).toBe(StringErrorCode.UUID_V4);
  });

  it('should validate uuid v7', () => {
    const schema = q.string().uuidV7();

    // Valid UUIDv7
    const result1 = schema.parse('123e4567-e89b-72d3-a456-426614174000');
    expect(result1.success).toBe(true);

    // Invalid UUIDv7 (wrong version number)
    const result2 = schema.parse('123e4567-e89b-12d3-a456-426614174000');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      StringErrorMessages[StringErrorCode.UUID_V7],
    );
    expect(result2.error?.code).toBe(StringErrorCode.UUID_V7);

    // Invalid UUIDv7 (not a UUID)
    const result3 = schema.parse('not-a-uuid');
    expect(result3.success).toBe(false);
    expect(result3.error?.message).toContain(
      StringErrorMessages[StringErrorCode.UUID_V7],
    );
    expect(result3.error?.code).toBe(StringErrorCode.UUID_V7);
  });

  it('should validate cuid', () => {
    const schema = q.string().cuid();

    // Valid CUID
    const result1 = schema.parse('cjld2cjxh0000qzrmn831i7rn');
    expect(result1.success).toBe(true);

    // Invalid CUID
    const result2 = schema.parse('not-a-cuid');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      StringErrorMessages[StringErrorCode.CUID],
    );
    expect(result2.error?.code).toBe(StringErrorCode.CUID);
  });

  it('should validate cuid2', () => {
    const schema = q.string().cuid2();

    // Valid CUID2 (24 characters, alphanumeric)
    const result1 = schema.parse('abcdef1234567890abcdef12');
    expect(result1.success).toBe(true);

    // Invalid CUID2 (wrong format)
    const result2 = schema.parse('not-a-cuid2');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      StringErrorMessages[StringErrorCode.CUID2],
    );
    expect(result2.error?.code).toBe(StringErrorCode.CUID2);

    // Invalid CUID2 (wrong length)
    const result3 = schema.parse('abcdef');
    expect(result3.success).toBe(false);
    expect(result3.error?.message).toContain(
      StringErrorMessages[StringErrorCode.CUID2],
    );
    expect(result3.error?.code).toBe(StringErrorCode.CUID2);
  });

  it('should validate ulid', () => {
    const schema = q.string().ulid();

    // Valid ULID
    const result1 = schema.parse('01ARZ3NDEKTSV4RRFFQ69G5FAV');
    expect(result1.success).toBe(true);

    // Invalid ULID
    const result2 = schema.parse('not-a-ulid');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      StringErrorMessages[StringErrorCode.ULID],
    );
    expect(result2.error?.code).toBe(StringErrorCode.ULID);
  });

  it('should validate includes', () => {
    const substring = 'world';
    const schema = q.string().includes(substring);

    // Valid (contains substring)
    const result1 = schema.parse('hello world');
    expect(result1.success).toBe(true);

    // Invalid (doesn't contain substring)
    const result2 = schema.parse('hello');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      formatMessage(StringErrorMessages[StringErrorCode.INCLUDES], substring),
    );
    expect(result2.error?.code).toBe(StringErrorCode.INCLUDES);
  });

  it('should validate startsWith', () => {
    const prefix = 'hello';
    const schema = q.string().startsWith(prefix);

    // Valid (starts with prefix)
    const result1 = schema.parse('hello world');
    expect(result1.success).toBe(true);

    // Invalid (doesn't start with prefix)
    const result2 = schema.parse('hi world');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      formatMessage(StringErrorMessages[StringErrorCode.STARTS_WITH], prefix),
    );
    expect(result2.error?.code).toBe(StringErrorCode.STARTS_WITH);
  });

  it('should validate endsWith', () => {
    const suffix = 'world';
    const schema = q.string().endsWith(suffix);

    // Valid (ends with suffix)
    const result1 = schema.parse('hello world');
    expect(result1.success).toBe(true);

    // Invalid (doesn't end with suffix)
    const result2 = schema.parse('hello there');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      formatMessage(StringErrorMessages[StringErrorCode.ENDS_WITH], suffix),
    );
    expect(result2.error?.code).toBe(StringErrorCode.ENDS_WITH);
  });

  it('should validate datetime', () => {
    const schema = q.string().datetime();

    // Valid datetime
    const result1 = schema.parse('2023-01-01T12:00:00Z');
    expect(result1.success).toBe(true);

    // Invalid datetime
    const result2 = schema.parse('not-a-date');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      StringErrorMessages[StringErrorCode.DATETIME],
    );
    expect(result2.error?.code).toBe(StringErrorCode.DATETIME);
  });

  it('should validate ip', () => {
    const schema = q.string().ip();

    // Valid IPv4
    const result1 = schema.parse('192.168.1.1');
    expect(result1.success).toBe(true);

    // Valid IPv6
    const result2 = schema.parse('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
    expect(result2.success).toBe(true);

    // Invalid IP
    const result3 = schema.parse('not-an-ip');
    expect(result3.success).toBe(false);
    expect(result3.error?.message).toContain(
      StringErrorMessages[StringErrorCode.IP],
    );
    expect(result3.error?.code).toBe(StringErrorCode.IP);
  });

  it('should validate cidr', () => {
    const schema = q.string().cidr();

    // Valid IPv4 CIDR
    const result1 = schema.parse('192.168.1.0/24');
    expect(result1.success).toBe(true);

    // Valid IPv6 CIDR
    const result2 = schema.parse('2001:db8::/32');
    expect(result2.success).toBe(true);

    // Invalid CIDR (invalid IP)
    const result3 = schema.parse('not-a-cidr/24');
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(StringErrorCode.CIDR_INVALID_IP);
    expect(result3.error?.message).toBe(
      StringErrorMessages[StringErrorCode.CIDR_INVALID_IP],
    );

    // Invalid CIDR (invalid prefix)
    const result4 = schema.parse('192.168.1.0/33');
    expect(result4.success).toBe(false);
    expect(result4.error?.code).toBe(StringErrorCode.CIDR);
    expect(result4.error?.message).toContain(
      formatMessage(StringErrorMessages[StringErrorCode.CIDR], 32),
    );
  });

  it('should validate date', () => {
    const schema = q.string().date();

    // Valid date
    const result1 = schema.parse('2023-01-01');
    expect(result1.success).toBe(true);

    // Invalid date format
    const result2 = schema.parse('01/01/2023');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      StringErrorMessages[StringErrorCode.DATE],
    );
    expect(result2.error?.code).toBe(StringErrorCode.DATE);

    // Invalid date value
    const result3 = schema.parse('2023-13-01');
    expect(result3.success).toBe(false);
    expect(result3.error?.message).toContain(
      StringErrorMessages[StringErrorCode.DATE],
    );
    expect(result3.error?.code).toBe(StringErrorCode.DATE);
  });

  it('should validate time', () => {
    const schema = q.string().time();

    // Valid time
    const result1 = schema.parse('12:30:45');
    expect(result1.success).toBe(true);

    // Invalid time format
    const result2 = schema.parse('12:30');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      StringErrorMessages[StringErrorCode.TIME],
    );
    expect(result2.error?.code).toBe(StringErrorCode.TIME);

    // Invalid time value
    const result3 = schema.parse('25:30:45');
    expect(result3.success).toBe(false);
    expect(result3.error?.message).toContain(
      StringErrorMessages[StringErrorCode.TIME],
    );
    expect(result3.error?.code).toBe(StringErrorCode.TIME);
  });

  it('should validate duration', () => {
    const schema = q.string().duration();

    // Valid durations
    const result1 = schema.parse('PT1H30M');
    expect(result1.success).toBe(true);

    const result2 = schema.parse('PT10S');
    expect(result2.success).toBe(true);

    const result3 = schema.parse('PT1H30M10S');
    expect(result3.success).toBe(true);

    // Invalid duration format
    const result4 = schema.parse('1h30m');
    expect(result4.success).toBe(false);
    expect(result4.error?.message).toContain(
      StringErrorMessages[StringErrorCode.DURATION],
    );
    expect(result4.error?.code).toBe(StringErrorCode.DURATION);

    // Empty duration
    const result5 = schema.parse('PT');
    expect(result5.success).toBe(false);
    expect(result5.error?.message).toContain(
      StringErrorMessages[StringErrorCode.DURATION],
    );
    expect(result5.error?.code).toBe(StringErrorCode.DURATION);
  });

  it('should validate base64', () => {
    const schema = q.string().base64();

    // Valid base64
    const result1 = schema.parse('SGVsbG8gV29ybGQ=');
    expect(result1.success).toBe(true);

    // Invalid base64 characters
    const result2 = schema.parse('SGVsbG8gV29ybGQ!');
    expect(result2.success).toBe(false);
    expect(result2.error?.message).toContain(
      StringErrorMessages[StringErrorCode.BASE64],
    );
    expect(result2.error?.code).toBe(StringErrorCode.BASE64);

    // Invalid base64 length (not a multiple of 4)
    const result3 = schema.parse('SGVsbG8gV29ybG');
    expect(result3.success).toBe(false);
    expect(result3.error?.message).toContain(
      StringErrorMessages[StringErrorCode.BASE64],
    );
    expect(result3.error?.code).toBe(StringErrorCode.BASE64);
  });

  it('should trim strings', () => {
    const schema = q.string().trim();

    // String with whitespace
    const result = schema.parse('  hello world  ');
    expect(result.success).toBe(true);
    expect(result.value).toBe('hello world');

    // String without whitespace
    const result2 = schema.parse('hello');
    expect(result2.success).toBe(true);
    expect(result2.value).toBe('hello');
  });

  it('should convert strings to lowercase', () => {
    const schema = q.string().toLowerCase();

    // Mixed case string
    const result = schema.parse('Hello World');
    expect(result.success).toBe(true);
    expect(result.value).toBe('hello world');

    // Already lowercase
    const result2 = schema.parse('hello');
    expect(result2.success).toBe(true);
    expect(result2.value).toBe('hello');
  });

  it('should convert strings to uppercase', () => {
    const schema = q.string().toUpperCase();

    // Mixed case string
    const result = schema.parse('Hello World');
    expect(result.success).toBe(true);
    expect(result.value).toBe('HELLO WORLD');

    // Already uppercase
    const result2 = schema.parse('HELLO');
    expect(result2.success).toBe(true);
    expect(result2.value).toBe('HELLO');
  });

  it('should chain transformation methods', () => {
    const schema = q.string().trim().toLowerCase();

    // String with whitespace and mixed case
    const result = schema.parse('  Hello World  ');
    expect(result.success).toBe(true);
    expect(result.value).toBe('hello world');
  });

  it('should chain multiple constraints', () => {
    const minLength = 5;
    const maxLength = 10;
    const pattern = /^[a-z]+$/;
    const schema = q.string().min(minLength).max(maxLength).pattern(pattern);

    // Valid string
    const result1 = schema.parse('hello');
    expect(result1.success).toBe(true);

    // Too short
    const result2 = schema.parse('hi');
    expect(result2.success).toBe(false);
    expect(result2.error?.code).toBe(StringErrorCode.MIN_LENGTH);
    expect(result2.error?.message).toContain(
      formatMessage(StringErrorMessages[StringErrorCode.MIN_LENGTH], minLength),
    );

    // Too long
    const result3 = schema.parse('hello-world-too-long');
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(StringErrorCode.MAX_LENGTH);
    expect(result3.error?.message).toContain(
      formatMessage(StringErrorMessages[StringErrorCode.MAX_LENGTH], maxLength),
    );

    // Invalid pattern
    const result4 = schema.parse('Hello123');
    expect(result4.success).toBe(false);
    expect(result4.error?.code).toBe(StringErrorCode.PATTERN);
    expect(result4.error?.message).toContain(
      formatMessage(StringErrorMessages[StringErrorCode.PATTERN], pattern),
    );
  });
});
