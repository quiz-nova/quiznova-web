import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { QuizHeaderFormGroup } from '@Features/instructor/create-quiz/quiz-metadata-form';

export function timeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const formGroup = group as QuizHeaderFormGroup;
    const startsAtControl = formGroup.controls.startsAtUtc;
    const endsAtControl = formGroup.controls.endsAtUtc;

    const startsAt = startsAtControl.value;
    const endsAt = endsAtControl.value;

    if (!startsAt || !endsAt) {
      return null;
    }

    const startsAtDate = new Date(startsAt);
    const endsAtDate = new Date(endsAt);

    if (isNaN(startsAtDate.getTime()) || isNaN(endsAtDate.getTime())) {
      return null;
    }

    const now = new Date();

    // 1. StartsAt in the past (with a 1 minute tolerance to avoid immediate form load errors)
    const startsAtErrors = { ...startsAtControl.errors };
    delete startsAtErrors['past'];
    if (startsAtDate.getTime() < now.getTime() - 60000) {
      startsAtErrors['past'] = true;
    }
    startsAtControl.setErrors(Object.keys(startsAtErrors).length > 0 ? startsAtErrors : null);

    const timeDiff = endsAtDate.getTime() - startsAtDate.getTime();
    const endsAtErrors = { ...endsAtControl.errors };
    delete endsAtErrors['beforeStart'];
    delete endsAtErrors['lessThanTenMinutes'];

    if (timeDiff < 0) {
      endsAtErrors['beforeStart'] = true;
    } else if (timeDiff < 10 * 60 * 1000) {
      endsAtErrors['lessThanTenMinutes'] = true;
    }
    endsAtControl.setErrors(Object.keys(endsAtErrors).length > 0 ? endsAtErrors : null);

    return null;
  };
}
