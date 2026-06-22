import { CanDeactivateFn } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate?: () => boolean;
}

export const canDeactivateQuizAttempt: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
