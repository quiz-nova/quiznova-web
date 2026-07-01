import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { Message, React } from '@shared/models/chat/chat.model';

import { CourseChatStore } from './course-chat.store';

@Component({
  selector: 'app-reaction-list',
  standalone: true,
  template: `
    @if (groups().length > 0) {
      <div class="reactions-list">
        @for (group of groups(); track group.emoji) {
          <button
            class="reaction-badge"
            [class.user-reacted]="group.hasReacted"
            (click)="store.toggleReaction(message().id, group.emoji)"
          >
            <span class="emoji">{{ group.emoji }}</span>
            <span class="count">{{ group.count }}</span>
          </button>
        }
      </div>
    }
  `,
  styles: `
    .reactions-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
      margin-top: 0.25rem;
    }

    .reaction-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      background: var(--clr-white);
      border: 1px solid var(--clr-gray-200);
      border-radius: 12px;
      padding: 0.15rem 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.75rem;
    }

    .reaction-badge:hover {
      background: var(--clr-gray-100);
    }

    .reaction-badge.user-reacted {
      background: var(--clr-green-50);
      border-color: var(--clr-green-400);
    }

    .reaction-badge .count {
      color: var(--clr-gray-600);
      font-weight: 500;
    }

    .reaction-badge.user-reacted .count {
      color: var(--clr-green-600);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactionList {
  readonly store = inject(CourseChatStore);
  readonly message = input.required<Message>();

  readonly groups = computed(() => {
    const groups: Record<string, React[]> = {};
    this.message().reacts.forEach((r) => {
      if (!groups[r.emoji]) {
        groups[r.emoji] = [];
      }
      groups[r.emoji].push(r);
    });

    return Object.keys(groups).map((emoji) => ({
      emoji,
      count: groups[emoji].length,
      hasReacted: groups[emoji].some((r) => r.reactorId === this.store.userId()),
    }));
  });
}
