import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-no-course-chat-selected-placeholder',
  standalone: true,
  template: `
    <div class="select-course-placeholder">
      <div class="placeholder-card">
        <div class="placeholder-icon">
          <i class="fa-solid fa-comments"></i>
        </div>
        <h3>Course Chat Rooms</h3>
        <p>
          Select a course from the sidebar to join its active chat room and connect with
          classmates and instructors.
        </p>
      </div>
    </div>
  `,
  styles: `
    .select-course-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 2rem;
    }

    .placeholder-card {
      max-width: 420px;
      text-align: center;
      background: var(--clr-white);
      border: 1px solid var(--clr-gray-200);
      border-radius: 24px;
      padding: 3rem 2.5rem;
    }

    .placeholder-icon {
      font-size: 3rem;
      color: var(--clr-green-400);
      margin-bottom: 1.5rem;
      display: inline-block;
      padding: 1.25rem;
      background: var(--clr-green-50);
      border-radius: 20px;
    }

    .placeholder-card h3 {
      margin: 0 0 0.75rem;
      font-size: 1.35rem;
      font-weight: 600;
      color: var(--clr-blue-900);
    }

    .placeholder-card p {
      margin: 0;
      color: var(--clr-gray-600);
      font-size: 0.95rem;
      line-height: 1.6;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoCourseChatSelectedPlaceholder {}
