import { Component, effect, inject, input } from '@angular/core';

import { YourCourses } from '@shared/components/your-courses/your-courses';

import { ChatFooter } from './chat-footer';
import { ChatHeader } from './chat-header';
import { CourseChatStore } from './course-chat.store';
import { MessageWindow } from './message-window';
import { NoCourseChatSelectedPlaceholder } from './no-course-chat-selected-placeholder';

@Component({
  selector: 'app-course-chat',
  standalone: true,
  imports: [YourCourses, ChatFooter, ChatHeader, MessageWindow, NoCourseChatSelectedPlaceholder],
  providers: [CourseChatStore],
  template: `
    <div class="chat-layout">
      <aside class="sidebar-aside">
        <app-your-courses></app-your-courses>
      </aside>

      <main class="chat-viewport">
        @if (store.selectedCourseId()) {
          <div class="chat-room-container">
            <app-chat-header />

            <app-message-window />

            <app-chat-footer />
          </div>
        } @else {
          <app-no-course-chat-selected-placeholder />
        }
      </main>
    </div>
  `,
  styles: `
    .chat-layout {
      display: flex;
      height: calc(100vh - 4.5rem);
      background: var(--clr-white);
      overflow: hidden;
    }

    .sidebar-aside {
      width: 320px;
      flex-shrink: 0;
      height: 100%;
      border-right: 1px solid var(--clr-gray-200);
    }

    .chat-viewport {
      flex: 1;
      height: 100%;
      position: relative;
    }

    .chat-room-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  `,
})
export class CourseChat {
  readonly store = inject(CourseChatStore);
  readonly courseId = input<string | null>(null);

  constructor() {
    effect(() => {
      this.store.init(this.courseId());
    });
  }
}
