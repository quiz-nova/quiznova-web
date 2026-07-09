import { CanDeactivateFn } from '@angular/router';

import { QuizAttempt } from '@Features/student/quiz-attempt/quiz-attempt';

export const canDeactivateQuizAttempt: CanDeactivateFn<QuizAttempt> = (component) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
