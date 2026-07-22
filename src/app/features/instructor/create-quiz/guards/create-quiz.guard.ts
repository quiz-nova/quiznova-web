import { CanDeactivateFn } from '@angular/router';

import { CreateQuiz } from '@Features/instructor/create-quiz/create-quiz';

export const canDeactivateCreateQuiz: CanDeactivateFn<CreateQuiz> = (component) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
