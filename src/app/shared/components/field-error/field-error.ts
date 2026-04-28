import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-field-error',
  imports: [],
  template: `
    @if (errorText()) {
      <div class="field-error">
        {{ errorText() }}
      </div>
    }
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
  readonly errorText = input.required<string>();
}
