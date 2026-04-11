import { Component } from '@angular/core';

@Component({
  selector: 'app-attempt-button',
  imports: [],
  template: ` <button type="button" class="btn submit-btn">Submit Quiz</button> `,
  styles: `
    :host {
      display: block;
    }

    .submit-btn {
      border: 1px solid #ff8f8f;
      background: var(--clr-white);
      color: #d14343;
      font-weight: 700;
      font-size: 0.95rem;
    }
  `,
})
export class AttemptButton {}
