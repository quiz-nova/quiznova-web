import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { FieldError } from '@shared/components/field-error/field-error';
import { CustomValidators } from '@shared/validators/custom-validators';

import { CourseChatStore } from './course-chat.store';

@Component({
  selector: 'app-chat-footer',
  standalone: true,
  imports: [ReactiveFormsModule, FieldError],
  template: `
    <footer class="chat-footer">
      @if (store.replyingTo(); as reply) {
        <div class="replying-to-bar">
          <div class="replying-content">
            <span class="replying-label"
              >Replying to {{ reply.sender.personalInformation.name }}</span
            >
            <p class="replying-snippet">{{ reply.content.text }}</p>
          </div>
          <button class="cancel-reply-btn" (click)="store.cancelReply()" aria-label="Cancel reply">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      }

      <div class="input-form">
        <input
          class="flex-1 chat-input"
          id="chat-message-input"
          [formControl]="messageControl"
          (keydown.enter)="sendMessage()"
          aria-label="Chat message"
          placeholder="Type a message..."
          type="text"
        />
        <button
          class="send-btn"
          [disabled]="messageControl.invalid"
          (click)="sendMessage()"
          aria-label="Send message"
        >
          <i class="fa-regular fa-paper-plane"></i>
        </button>
      </div>

      @if (messageControl.invalid && messageControl.touched) {
        @if (messageControl.hasError('maxlength')) {
          <app-field-error id="message-maxlength-error"
            >Message cannot exceed 500 characters.</app-field-error
          >
        }
      }
    </footer>
  `,
  styles: `
    .chat-footer {
      background: var(--clr-white);
      border-top: 1px solid var(--clr-gray-200);
      padding: 1.25rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .replying-to-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--clr-green-50);
      border: 1px solid var(--clr-green-300);
      border-left: 4px solid var(--clr-green-400);
      border-radius: var(--radius-sm);
      padding: 0.5rem 1rem;
    }

    .replying-content {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      overflow: hidden;
    }

    .replying-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--clr-green-600);
    }

    .replying-snippet {
      margin: 0;
      font-size: 0.8rem;
      color: var(--clr-gray-600);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .cancel-reply-btn {
      background: transparent;
      border: none;
      color: var(--clr-gray-500);
      cursor: pointer;
      padding: 0.25rem;
      transition: color 0.2s ease;
    }

    .cancel-reply-btn:hover {
      color: var(--clr-blue-900);
    }

    .input-form {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .flex-1 {
      flex: 1;
    }

    .chat-input {
      padding: 0.75rem 1rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: var(--radius-md);
      font-size: var(--fs-300);
      color: var(--clr-blue-900);
      background-color: var(--clr-gray-50);
      transition:
        border-color 0.2s ease,
        background-color 0.2s ease;
    }

    .chat-input::placeholder {
      color: var(--clr-gray-500);
    }

    .send-btn {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--clr-green-400);
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      box-shadow: 0 4px 12px color-mix(in srgb, var(--clr-green-400) 25%, transparent);
      transition: all 0.2s ease;
    }

    .send-btn:hover:not(:disabled) {
      background: var(--clr-green-600);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px color-mix(in srgb, var(--clr-green-400) 35%, transparent);
    }

    .send-btn:disabled {
      background: var(--clr-gray-200);
      color: var(--clr-gray-500);
      cursor: not-allowed;
      box-shadow: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatFooter {
  readonly store = inject(CourseChatStore);
  readonly messageControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      CustomValidators.trimMinLength(1),
      CustomValidators.trimMaxLength(500),
    ],
  });

  sendMessage(): void {
    if (this.messageControl.invalid) return;
    this.store.sendChatMessage(this.messageControl.value.trim());
    this.messageControl.setValue('');
  }
}
