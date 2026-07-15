import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';

import { Message } from '@shared/models/chat/chat.model';
import { UserRole } from '@shared/models/users/user-role.model';

import { CourseChatStore } from './course-chat.store';
import { ReactionList } from './reaction-list';

@Component({
  selector: 'app-message-window',
  standalone: true,
  imports: [CommonModule, ReactionList],
  template: `
    <div class="messages-window" #scrollContainer>
      @if (store.isPending()('loadChatRoom')) {
        <div class="centered-state">
          <i class="fa-solid fa-spinner fa-spin"></i> Loading message history...
        </div>
      } @else if (store.messages().length === 0) {
        <div class="centered-state">No messages yet. Start the conversation!</div>
      } @else {
        <div class="messages-list">
          @for (msg of store.messages(); track msg.id) {
            <div class="message-wrapper" [class.outgoing]="msg.sender.id === store.userId()">
              <div class="message-avatar">
                {{ msg.sender.personalInformation.name.charAt(0).toUpperCase() }}
              </div>
              <div class="message-meta-container">
                <div class="message-sender-info">
                  <span class="sender-name">{{ msg.sender.personalInformation.name }}</span>
                  <span
                    class="role-badge"
                    [class.instructor]="msg.sender.role === UserRole.instructor"
                  >
                    {{ msg.sender.role }}
                  </span>
                  <time class="message-time" [attr.datetime]="msg.createdAt">
                    {{ msg.createdAt | date: 'shortTime' }}
                  </time>
                </div>

                @if (msg.replyOnId) {
                  @if (getMessageById(msg.replyOnId); as repliedMsg) {
                    <div class="replied-preview">
                      <span class="replied-sender">
                        {{ repliedMsg.sender.personalInformation.name }}
                      </span>
                      <p class="replied-text">
                        {{ repliedMsg.content.text }}
                      </p>
                    </div>
                  }
                }

                <div class="message-bubble-row">
                  <div class="message-bubble">
                    <p class="message-text">{{ msg.content.text }}</p>
                  </div>

                  <div class="bubble-actions">
                    <button class="action-btn" (click)="store.setReplyTo(msg)" title="Reply">
                      <i class="fa-solid fa-reply"></i>
                    </button>
                  </div>
                </div>

                <app-reaction-list [message]="msg" />
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    .messages-window {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      background: var(--clr-gray-50);
    }

    .messages-window::-webkit-scrollbar {
      width: 6px;
    }

    .messages-window::-webkit-scrollbar-thumb {
      background: var(--clr-gray-200);
      border-radius: var(--radius-sm);
    }

    .centered-state {
      margin: auto;
      color: var(--clr-gray-600);
      font-size: 0.95rem;
    }

    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .message-wrapper {
      display: flex;
      gap: 0.85rem;
      max-width: 70%;
    }

    .message-wrapper.outgoing {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      background: var(--clr-gray-200);
      color: var(--clr-blue-900);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.95rem;
      flex-shrink: 0;
    }

    .outgoing .message-avatar {
      background: var(--clr-green-400);
      color: var(--clr-white);
    }

    .message-meta-container {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .message-sender-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
    }

    .sender-name {
      font-weight: 500;
      color: var(--clr-blue-900);
    }

    .role-badge {
      background: var(--clr-gray-100);
      color: var(--clr-gray-600);
      padding: 0.15rem 0.4rem;
      border-radius: var(--radius-sm);
      font-size: 0.7rem;
      font-weight: 500;
    }

    .role-badge.instructor {
      background: var(--clr-green-50);
      color: var(--clr-green-600);
    }

    .message-time {
      color: var(--clr-gray-500);
    }

    .message-bubble-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .outgoing .message-bubble-row {
      flex-direction: row-reverse;
    }

    .message-bubble {
      background: var(--clr-white);
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-lg);
      border-top-left-radius: 4px;
      padding: 0.75rem 1rem;
      color: var(--clr-blue-900);
      position: relative;
    }

    .outgoing .message-bubble {
      background: var(--clr-green-50);
      border-color: var(--clr-green-200);
      border-radius: var(--radius-lg);
      border-top-right-radius: 4px;
    }

    .message-text {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.45;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .bubble-actions {
      display: flex;
      align-items: center;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .message-bubble-row:hover .bubble-actions {
      opacity: 1;
    }

    .action-btn {
      background: transparent;
      border: none;
      color: var(--clr-gray-600);
      padding: 0.35rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background: var(--clr-gray-100);
      color: var(--clr-green-600);
    }

    .replied-preview {
      background: var(--clr-white);
      border: 1px solid var(--clr-green-300);
      border-left: 3px solid var(--clr-green-400); /* impeccable-disable-line side-tab */
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-sm);
      margin-bottom: 0.25rem;
      font-size: 0.8rem;
      max-width: 100%;
    }

    .replied-sender {
      font-weight: 600;
      color: var(--clr-green-600);
      display: block;
      margin-bottom: 0.15rem;
    }

    .replied-text {
      margin: 0;
      color: var(--clr-gray-500);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageWindow {
  readonly store = inject(CourseChatStore);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  readonly UserRole = UserRole;

  constructor() {
    effect(() => {
      this.store.messages();
      this.scrollToBottom();
    });
  }

  getMessageById(id: string): Message | undefined {
    return this.store.messages().find((m) => m.id === id);
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        if (this.scrollContainer) {
          this.scrollContainer.nativeElement.scrollTop =
            this.scrollContainer.nativeElement.scrollHeight;
        }
      });
    } catch (err) {
      console.debug(err);
    }
  }
}
