import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CourseChatStore } from './course-chat.store';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  template: `
    <header class="chat-header">
      <div class="course-info">
        <h2>Course Chat</h2>
        <div class="connection-status" [class.connected]="store.isConnected()">
          <span class="status-indicator"></span>
          {{ store.isConnected() ? 'Connected' : 'Connecting...' }}
        </div>
      </div>
    </header>
  `,
  styles: `
    .chat-header {
      background: var(--clr-white);
      border-bottom: 1px solid var(--clr-gray-200);
      padding: 1.25rem 2rem;
    }

    .course-info h2 {
      margin: 0 0 0.25rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--clr-blue-900);
    }

    .connection-status {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      color: var(--clr-gray-600);
    }

    .status-indicator {
      width: 6px;
      height: 6px;
      background: var(--clr-gray-300);
      border-radius: 50%;
    }

    .connection-status.connected {
      color: var(--clr-green-600);
    }

    .connection-status.connected .status-indicator {
      background: var(--clr-green-400);
      box-shadow: 0 0 8px var(--clr-green-400);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatHeader {
  readonly store = inject(CourseChatStore);
}
