import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-field-error',
  imports: [],
  template: `
    <div class="field-error" [attr.id]="id()" aria-live="polite" role="status">
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    .field-error {
      min-height: 1.25rem;
      color: var(--clr-red-500);
      font-size: var(--fs-300);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldError {
  readonly id = input.required<string>();
}
