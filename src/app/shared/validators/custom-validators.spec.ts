import { FormControl } from '@angular/forms';

import { describe, it, expect } from 'vitest';

import { CustomValidators } from './custom-validators';

// Helper to create a FormControl with a given value
const ctrl = (value: unknown) => new FormControl(value);

describe('CustomValidators.trimMinLength', () => {
  const validator = CustomValidators.trimMinLength(3);

  it('returns null for null/undefined value', () => {
    expect(validator(ctrl(null))).toBeNull();
    expect(validator(ctrl(undefined))).toBeNull();
  });

  it('returns null for non-string value', () => {
    expect(validator(ctrl(123))).toBeNull();
  });

  it('returns null when trimmed value is empty (defers to required)', () => {
    expect(validator(ctrl('   '))).toBeNull();
  });

  it('returns null when trimmed length meets minLength', () => {
    expect(validator(ctrl('abc'))).toBeNull();
    expect(validator(ctrl('  abc  '))).toBeNull(); // trimmed = 3
    expect(validator(ctrl('abcd'))).toBeNull();
  });

  it('returns minlength error when trimmed length is below minLength', () => {
    expect(validator(ctrl('ab'))).toEqual({
      minlength: { requiredLength: 3, actualLength: 2 },
    });

    expect(validator(ctrl('  a  '))).toEqual({
      minlength: { requiredLength: 3, actualLength: 1 },
    });
  });
});

describe('CustomValidators.trimMaxLength', () => {
  const validator = CustomValidators.trimMaxLength(5);

  it('returns null for null/undefined value', () => {
    expect(validator(ctrl(null))).toBeNull();
  });

  it('returns null for non-string value', () => {
    expect(validator(ctrl(42))).toBeNull();
  });

  it('returns null when trimmed length is within maxLength', () => {
    expect(validator(ctrl('abc'))).toBeNull();
    expect(validator(ctrl('abcde'))).toBeNull();
    expect(validator(ctrl('  abc  '))).toBeNull();
  });

  it('returns maxlength error when trimmed length exceeds maxLength', () => {
    expect(validator(ctrl('abcdef'))).toEqual({
      maxlength: { requiredLength: 5, actualLength: 6 },
    });

    expect(validator(ctrl('  abcdef  '))).toEqual({
      maxlength: { requiredLength: 5, actualLength: 6 },
    });
  });
});

describe('CustomValidators.strongPassword', () => {
  const validator = CustomValidators.strongPassword();

  it('returns null for null/undefined/non-string values', () => {
    expect(validator(ctrl(null))).toBeNull();
    expect(validator(ctrl(undefined))).toBeNull();
    expect(validator(ctrl(123))).toBeNull();
  });

  it('returns null for a fully valid password', () => {
    expect(validator(ctrl('Abcdef1@'))).toBeNull();
    expect(validator(ctrl('P@ssw0rd!'))).toBeNull();
  });

  it('returns error when uppercase is missing', () => {
    const result = validator(ctrl('abcdef1@'));
    expect(result).toEqual({
      strongPassword: {
        hasUpperCase: false,
        hasLowerCase: true,
        hasNumeric: true,
        hasSpecial: true,
      },
    });
  });

  it('returns error when lowercase is missing', () => {
    const result = validator(ctrl('ABCDEF1@'));
    expect(result?.['strongPassword'].hasLowerCase).toBe(false);
    expect(result?.['strongPassword'].hasUpperCase).toBe(true);
  });

  it('returns error when numeric is missing', () => {
    const result = validator(ctrl('Abcdef!@'));
    expect(result?.['strongPassword'].hasNumeric).toBe(false);
  });

  it('returns error when special character is missing', () => {
    const result = validator(ctrl('Abcdef123'));
    expect(result?.['strongPassword'].hasSpecial).toBe(false);
  });

  it('returns error with all flags false for a weak password', () => {
    const result = validator(ctrl('weakpassword'));
    expect(result).toEqual({
      strongPassword: {
        hasUpperCase: false,
        hasLowerCase: true,
        hasNumeric: false,
        hasSpecial: false,
      },
    });
  });
});
