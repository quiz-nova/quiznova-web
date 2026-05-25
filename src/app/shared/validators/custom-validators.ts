import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static trimMinLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || typeof control.value !== 'string') return null;

      const trimmedLength = control.value.trim().length;
      if (trimmedLength === 0) return null; // Let Validators.required handle empty values

      return trimmedLength >= minLength
        ? null
        : { minlength: { requiredLength: minLength, actualLength: trimmedLength } };
    };
  }

  static trimMaxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || typeof control.value !== 'string') return null;

      const trimmedLength = control.value.trim().length;
      return trimmedLength <= maxLength
        ? null
        : { maxlength: { requiredLength: maxLength, actualLength: trimmedLength } };
    };
  }

  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value || typeof value !== 'string') {
        return null; // Let Validators.required handle empty values
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);

      const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

      return !passwordValid
          ? { strongPassword: { hasUpperCase, hasLowerCase, hasNumeric, hasSpecial } }
          : null;
    };
  }
}
