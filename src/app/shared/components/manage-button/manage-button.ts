import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-manage-button',
  imports: [],
  template: `
    <button
      class="btn btn-gray"
      [attr.aria-label]="ariaLabel()"
      [disabled]="isDisabled()"
      (click)="manageButtonClicked.emit()"
      type="button"
    >
      Manage
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageButton {
  readonly ariaLabel = input.required();
  readonly isDisabled = input(false);
  readonly manageButtonClicked = output<void>();
}
