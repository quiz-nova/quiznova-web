import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-quiz-countdown-tag',
  imports: [],
  template: `
    <span class="countdown" [class.countdown--expired]="isExpired()" [attr.aria-label]="ariaLabel()">
      <i class="fa-regular fa-clock" aria-hidden="true"></i>
      {{ timeLabel() }}
    </span>
  `,
  styles: `
    .countdown {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      min-height: 1.85rem;
      padding: 0.25rem 0.7rem;
      border: 1px solid color-mix(in srgb, var(--clr-green-500) 30%, var(--clr-white));
      border-radius: 999px;
      background-color: var(--clr-green-100);
      color: var(--clr-green-500);
      font-size: var(--fs-300);
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .countdown--expired {
      border-color: color-mix(in srgb, var(--clr-red-500) 35%, var(--clr-white));
      background-color: color-mix(in srgb, var(--clr-red-100) 45%, var(--clr-white));
      color: var(--clr-red-500);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizCountdownTag {
  readonly endsAtUtc = input.required<string>();
  readonly serverUtc = input.required<string>();
  readonly expired = output<void>();

  private readonly nowMs = signal<number>(0);
  private hasEmittedExpired = false;

  protected readonly remainingSeconds = computed(() => {
    const endMs = new Date(this.endsAtUtc()).getTime();
    const nowMs = this.nowMs();

    if (!Number.isFinite(endMs) || !Number.isFinite(nowMs)) {
      return 0;
    }

    return Math.max(0, Math.floor((endMs - nowMs) / 1000));
  });

  protected readonly isExpired = computed(() => this.remainingSeconds() === 0);

  protected readonly timeLabel = computed(() => {
    const totalSeconds = this.remainingSeconds();
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  protected readonly ariaLabel = computed(() => {
    if (this.isExpired()) {
      return 'Time is over';
    }

    return `Time remaining ${this.timeLabel()}`;
  });

  constructor(private readonly destroyRef: DestroyRef) {
    effect(() => {
      const initialServerMs = new Date(this.serverUtc()).getTime();
      const startsAt = Number.isFinite(initialServerMs) ? initialServerMs : Date.now();

      this.nowMs.set(startsAt);
      this.hasEmittedExpired = false;

      const intervalId = window.setInterval(() => {
        this.nowMs.update((current) => current + 1000);
      }, 1000);

      this.destroyRef.onDestroy(() => {
        window.clearInterval(intervalId);
      });

      return () => {
        window.clearInterval(intervalId);
      };
    });

    effect(() => {
      if (this.isExpired() && !this.hasEmittedExpired) {
        this.hasEmittedExpired = true;
        this.expired.emit();
      }
    });
  }
}
