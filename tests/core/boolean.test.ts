import { describe, expect, it } from 'vitest';
import {
  BooleanErrorCode,
  BooleanErrorMessages,
} from '../../src/core/error.js';
import { q } from '../../src/index.js';

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
    const stringValue = 'true';
    const result3 = schema.parse(stringValue);
    expect(result3.success).toBe(false);
    expect(result3.value).toBe(stringValue); // Original value is preserved
    expect(result3.error?.message).toContain(
      BooleanErrorMessages[BooleanErrorCode.TYPE],
    );
    expect(result3.error?.code).toBe(BooleanErrorCode.TYPE);

    // Non-boolean value (number)
    const numberValue = 1;
    const result4 = schema.parse(numberValue);
    expect(result4.success).toBe(false);
    expect(result4.value).toBe(numberValue); // Original value is preserved
    expect(result4.error?.message).toContain(
      BooleanErrorMessages[BooleanErrorCode.TYPE],
    );
    expect(result4.error?.code).toBe(BooleanErrorCode.TYPE);

    // Non-boolean value (object)
    const objectValue = {};
    const result5 = schema.parse(objectValue);
    expect(result5.success).toBe(false);
    expect(result5.value).toBe(objectValue); // Original value is preserved
    expect(result5.error?.message).toContain(
      BooleanErrorMessages[BooleanErrorCode.TYPE],
    );
    expect(result5.error?.code).toBe(BooleanErrorCode.TYPE);

    // Non-boolean value (null)
    const nullValue = null;
    const result6 = schema.parse(nullValue);
    expect(result6.success).toBe(false);
    expect(result6.value).toBe(nullValue); // Original value is preserved
    expect(result6.error?.message).toContain(
      BooleanErrorMessages[BooleanErrorCode.TYPE],
    );
    expect(result6.error?.code).toBe(BooleanErrorCode.TYPE);

    // Non-boolean value (undefined)
    const undefinedValue = undefined;
    const result7 = schema.parse(undefinedValue);
    expect(result7.success).toBe(false);
    expect(result7.value).toBe(undefinedValue); // Original value is preserved
    expect(result7.error?.message).toContain(
      BooleanErrorMessages[BooleanErrorCode.TYPE],
    );
    expect(result7.error?.code).toBe(BooleanErrorCode.TYPE);
  });
});
