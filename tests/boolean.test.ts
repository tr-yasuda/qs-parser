import { describe, expect, it } from 'vitest';
import { BooleanErrorCode, BooleanErrorMessages } from '../src/core/error.js';
import { q } from '../src/index.js';

describe('boolean schema', () => {
  it('should validate booleans', () => {
    const schema = q.boolean();

    // Valid boolean (true)
    const result1 = schema.parse(true);
    expect(result1.success).toBe(true);
    expect(result1.value).toBe(true);

    // Valid boolean (false)
    const result2 = schema.parse(false);
    expect(result2.success).toBe(true);
    expect(result2.value).toBe(false);

    // Non-boolean value (string)
    const result3 = schema.parse('true');
    expect(result3.success).toBe(false);
    expect(result3.error?.message).toContain(
      BooleanErrorMessages[BooleanErrorCode.TYPE],
    );
    expect(result3.error?.code).toBe(BooleanErrorCode.TYPE);

    // Non-boolean value (number)
    const result4 = schema.parse(1);
    expect(result4.success).toBe(false);
    expect(result4.error?.message).toContain(
      BooleanErrorMessages[BooleanErrorCode.TYPE],
    );
    expect(result4.error?.code).toBe(BooleanErrorCode.TYPE);

    // Non-boolean value (object)
    const result5 = schema.parse({});
    expect(result5.success).toBe(false);
    expect(result5.error?.message).toContain(
      BooleanErrorMessages[BooleanErrorCode.TYPE],
    );
    expect(result5.error?.code).toBe(BooleanErrorCode.TYPE);

    // Non-boolean value (null)
    const result6 = schema.parse(null);
    expect(result6.success).toBe(false);
    expect(result6.error?.message).toContain(
      BooleanErrorMessages[BooleanErrorCode.TYPE],
    );
    expect(result6.error?.code).toBe(BooleanErrorCode.TYPE);

    // Non-boolean value (undefined)
    const result7 = schema.parse(undefined);
    expect(result7.success).toBe(false);
    expect(result7.error?.message).toContain(
      BooleanErrorMessages[BooleanErrorCode.TYPE],
    );
    expect(result7.error?.code).toBe(BooleanErrorCode.TYPE);
  });
});
