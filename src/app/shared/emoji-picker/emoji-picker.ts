import { Component, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';

import { InputTextModule } from 'primeng/inputtext';
import { OverlayModule, Overlay } from 'primeng/overlay';
import 'emoji-picker-element';

import { Button } from '@shared/components/button/button';

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [InputTextModule, OverlayModule, Button],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="picker-wrapper">
      <input
        #myInput
        [value]="value()"
        (input)="valueChange.emit($any($event.target).value)"
        (keydown.enter)="send.emit()"
        type="text"
        pInputText
        [placeholder]="placeholder()"
      />
      <button appButton variant="gray" (click)="showEmojiPicker($event)" type="button">
        <i class="fa-regular fa-face-smile"></i>
      </button>
      <p-overlay #emojiOverlay>
        <emoji-picker (emoji-click)="addEmoji($event)"></emoji-picker>
      </p-overlay>
    </div>
  `,
  styles: `
    .picker-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
    }

    input {
      flex: 1;
    }
  `,
})
export class EmojiPicker {
  readonly value = input('');
  readonly placeholder = input('Type a message...');
  readonly valueChange = output<string>();
  readonly send = output<void>();

  @ViewChild('myInput') inputElement!: ElementRef<HTMLInputElement>;
  @ViewChild('emojiOverlay') emojiOverlay!: Overlay;

  showEmojiPicker(event: Event): void {
    this.emojiOverlay.show(event.target as HTMLElement);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- emoji-picker-element event
  addEmoji(event: any): void {
    const emoji = event.detail.unicode;
    const input = this.inputElement.nativeElement;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const currentText = input.value;
    const newText = currentText.substring(0, start) + emoji + currentText.substring(end);
    this.valueChange.emit(newText);
    this.emojiOverlay.hide();

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  }
}
