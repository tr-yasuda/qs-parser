import { describe, expect, it } from 'vitest';
import { StringErrorCode, StringErrorMessages } from '../src/core/error.js';
import { q } from '../src/index.js';
import { formatMessage } from './helper.js';

describe('string schema', () => {
  it('should validate strings', () => {
    const schema = q.string();

    // Valid string
    const result1 = schema.parse('hello');
    expect(result1.success).toBe(true);
    expect(result1.value).toBe('hello');

    // Non-string value
    const result2 = schema.parse(123);
    expect(result2.success).toBe(false);
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
    const schema = q.string().uuidv4();

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
    const schema = q.string().uuidv7();

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
    expect(result3.error?.message).toContain('CIDR notation');
    expect(result3.error?.code).toBe(StringErrorCode.CIDR);

    // Invalid CIDR (invalid prefix)
    const result4 = schema.parse('192.168.1.0/33');
    expect(result4.success).toBe(false);
    expect(result4.error?.message).toContain('CIDR notation');
    expect(result4.error?.code).toBe(StringErrorCode.CIDR);
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

    // Too long
    const result3 = schema.parse('hello-world-too-long');
    expect(result3.success).toBe(false);
    expect(result3.error?.code).toBe(StringErrorCode.MAX_LENGTH);

    // Invalid pattern
    const result4 = schema.parse('Hello123');
    expect(result4.success).toBe(false);
    expect(result4.error?.code).toBe(StringErrorCode.PATTERN);
  });
});
