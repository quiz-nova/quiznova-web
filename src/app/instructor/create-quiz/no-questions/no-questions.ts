import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-no-questions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="no-questions">
      <div class="icon">
        <i class="fa-regular fa-clipboard" aria-hidden="true"></i>
      </div>
      <h6 class="no-questions-title">No questions yet</h6>
      <p class="no-questions-sub-title">
        Select a question type above and click "Add Question" to start building your quiz.
      </p>
    </div>
  `,
  styles: `
    .no-questions {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 2rem;
      text-align: center;
    }

    .icon {
      color: var(--clr-gray-300);
      line-height: 1;
    }

    .icon i {
      font-size: 3rem;
    }

    .no-questions-title {
      color: var(--clr-gray-800);
      font-size: var(--fs-500);
    }

    .no-questions-sub-title {
      color: var(--clr-gray-600);
      font-size: var(--fs-400);
      word-spacing: 3px;
    }
  `,
})
export class NoQuestions {}
