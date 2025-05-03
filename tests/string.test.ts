import { describe, expect, it } from 'vitest';
import { q } from '../src/index.js';

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
    expect(result2.error).toContain('Expected string');
  });

  it('should validate max length', () => {
    const schema = q.string().max(5);

    // Valid length
    const result1 = schema.parse('hello');
    expect(result1.success).toBe(true);

    // Invalid length
    const result2 = schema.parse('hello world');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('at most 5 characters');
  });

  it('should validate min length', () => {
    const schema = q.string().min(5);

    // Valid length
    const result1 = schema.parse('hello');
    expect(result1.success).toBe(true);

    // Invalid length
    const result2 = schema.parse('hi');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('at least 5 characters');
  });

  it('should validate pattern', () => {
    const schema = q.string().pattern(/^[a-z]+$/);

    // Valid pattern
    const result1 = schema.parse('hello');
    expect(result1.success).toBe(true);

    // Invalid pattern
    const result2 = schema.parse('Hello123');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('match pattern');
  });

  it('should validate email', () => {
    const schema = q.string().email();

    // Valid email
    const result1 = schema.parse('test@example.com');
    expect(result1.success).toBe(true);

    // Invalid email
    const result2 = schema.parse('not-an-email');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('valid email');
  });

  it('should validate url', () => {
    const schema = q.string().url();

    // Valid URL
    const result1 = schema.parse('https://example.com');
    expect(result1.success).toBe(true);

    // Invalid URL
    const result2 = schema.parse('not-a-url');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('valid URL');
  });

  it('should validate emoji', () => {
    const schema = q.string().emoji();

    // Valid emoji
    const result1 = schema.parse('😀');
    expect(result1.success).toBe(true);

    // Invalid (no emoji)
    const result2 = schema.parse('hello');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('emoji');
  });

  it('should validate uuid', () => {
    const schema = q.string().uuid();

    // Valid UUID
    const result1 = schema.parse('123e4567-e89b-12d3-a456-426614174000');
    expect(result1.success).toBe(true);

    // Invalid UUID
    const result2 = schema.parse('not-a-uuid');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('UUID');
  });

  it('should validate uuid v4', () => {
    const schema = q.string().uuidv4();

    // Valid UUIDv4
    const result1 = schema.parse('123e4567-e89b-42d3-a456-426614174000');
    expect(result1.success).toBe(true);

    // Invalid UUIDv4 (wrong version number)
    const result2 = schema.parse('123e4567-e89b-12d3-a456-426614174000');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('UUID v4');

    // Invalid UUIDv4 (not a UUID)
    const result3 = schema.parse('not-a-uuid');
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('UUID v4');
  });

  it('should validate uuid v7', () => {
    const schema = q.string().uuidv7();

    // Valid UUIDv7
    const result1 = schema.parse('123e4567-e89b-72d3-a456-426614174000');
    expect(result1.success).toBe(true);

    // Invalid UUIDv7 (wrong version number)
    const result2 = schema.parse('123e4567-e89b-12d3-a456-426614174000');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('UUID v7');

    // Invalid UUIDv7 (not a UUID)
    const result3 = schema.parse('not-a-uuid');
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('UUID v7');
  });

  it('should validate cuid', () => {
    const schema = q.string().cuid();

    // Valid CUID
    const result1 = schema.parse('cjld2cjxh0000qzrmn831i7rn');
    expect(result1.success).toBe(true);

    // Invalid CUID
    const result2 = schema.parse('not-a-cuid');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('CUID');
  });

  it('should validate cuid2', () => {
    const schema = q.string().cuid2();

    // Valid CUID2 (24 characters, alphanumeric)
    const result1 = schema.parse('abcdef1234567890abcdef12');
    expect(result1.success).toBe(true);

    // Invalid CUID2 (wrong format)
    const result2 = schema.parse('not-a-cuid2');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('CUID2');

    // Invalid CUID2 (wrong length)
    const result3 = schema.parse('abcdef');
    expect(result3.success).toBe(false);
    expect(result3.error).toContain('CUID2');
  });

  it('should validate ulid', () => {
    const schema = q.string().ulid();

    // Valid ULID
    const result1 = schema.parse('01ARZ3NDEKTSV4RRFFQ69G5FAV');
    expect(result1.success).toBe(true);

    // Invalid ULID
    const result2 = schema.parse('not-a-ulid');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('ULID');
  });

  it('should validate includes', () => {
    const schema = q.string().includes('world');

    // Valid (contains substring)
    const result1 = schema.parse('hello world');
    expect(result1.success).toBe(true);

    // Invalid (doesn't contain substring)
    const result2 = schema.parse('hello');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('include');
  });

  it('should validate startsWith', () => {
    const schema = q.string().startsWith('hello');

    // Valid (starts with prefix)
    const result1 = schema.parse('hello world');
    expect(result1.success).toBe(true);

    // Invalid (doesn't start with prefix)
    const result2 = schema.parse('hi world');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('start with');
  });

  it('should validate endsWith', () => {
    const schema = q.string().endsWith('world');

    // Valid (ends with suffix)
    const result1 = schema.parse('hello world');
    expect(result1.success).toBe(true);

    // Invalid (doesn't end with suffix)
    const result2 = schema.parse('hello there');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('end with');
  });

  it('should validate datetime', () => {
    const schema = q.string().datetime();

    // Valid datetime
    const result1 = schema.parse('2023-01-01T12:00:00Z');
    expect(result1.success).toBe(true);

    // Invalid datetime
    const result2 = schema.parse('not-a-date');
    expect(result2.success).toBe(false);
    expect(result2.error).toContain('datetime');
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
    expect(result3.error).toContain('IP address');
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
    expect(result3.error).toContain('CIDR');

    // Invalid CIDR (invalid prefix)
    const result4 = schema.parse('192.168.1.0/33');
    expect(result4.success).toBe(false);
    expect(result4.error).toContain('CIDR');
  });

  it('should chain multiple constraints', () => {
    const schema = q
      .string()
      .min(5)
      .max(10)
      .pattern(/^[a-z]+$/);

    // Valid string
    const result1 = schema.parse('hello');
    expect(result1.success).toBe(true);

    // Too short
    const result2 = schema.parse('hi');
    expect(result2.success).toBe(false);

    // Too long
    const result3 = schema.parse('hello-world-too-long');
    expect(result3.success).toBe(false);

    // Invalid pattern
    const result4 = schema.parse('Hello123');
    expect(result4.success).toBe(false);
  });
});
