import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Subscription, switchMap, timer } from 'rxjs';

import { Quiz } from '@shared/models/quiz/quiz.model';
import { QuizService } from '@shared/services/quiz.service';

import { QuizAttemptStore } from './quiz-attempt.store';

@Component({
  selector: 'app-quiz-attempt-header',
  imports: [],
  template: `
    <header class="attempt-header">
      <div>
        <h1>{{ quiz()?.title }}</h1>
        <p>
          Question {{ this.quizAttemptStore.currentQuestionIndex() }} of
          {{ quiz()?.questions?.length }}
        </p>
      </div>

      <div class="attempt-meta" aria-label="Quiz status">
        <span class="chip"
          >{{ this.quizAttemptStore.numberOfSolvedQuestions() }}/{{
            quiz()?.questions?.length
          }}</span
        >
        <span class="chip">{{ remainingTime() }}</span>
      </div>
    </header>
  `,
  styles: `
    :host {
      display: block;
    }

    .attempt-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 0.75rem;
      background: var(--clr-white);
    }

    h1 {
      margin: 0;
      font-size: 1.25rem;
    }

    p {
      margin: 0.25rem 0 0;
      color: var(--clr-gray-600);
      font-size: 0.875rem;
    }

    .attempt-meta {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: end;
    }

    .chip {
      padding: 0.35rem 0.65rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: 999px;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--clr-gray-600);
    }

    @media (width <= 40rem) {
      .attempt-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `,
})
export class QuizAttemptHeader implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly quizAttemptStore = inject(QuizAttemptStore);
  protected readonly quizService = inject(QuizService);
  private countdownSubscription: Subscription | null = null;
  private quizTimedOut = false;
  protected readonly remainingSeconds = signal(0);

  // user-friendly remaining time in format mm:ss
  protected readonly remainingTime = computed(() => {
    const seconds = this.remainingSeconds();
    const minutes = Math.floor(seconds / 60);
    const secondsPart = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secondsPart.toString().padStart(2, '0')}`;
  });
  protected readonly quiz = toSignal(
    toObservable(this.quizAttemptStore.quizId).pipe(
      switchMap((quizId) => this.quizService.getQuizById(quizId)),
    ),
  );

  ngOnInit(): void {
    toObservable(this.quiz)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((quiz) => {
        if (!quiz) {
          return;
        }

        this.startCountdown(quiz);
      });
  }

  private startCountdown(quiz: Quiz): void {
    this.countdownSubscription?.unsubscribe();

    const serverUtcMs = quiz.serverUtc ? new Date(quiz.serverUtc).getTime() : Date.now();
    const endsAtUtcMs = new Date(quiz.endsAtUtc).getTime();

    if (!Number.isFinite(serverUtcMs) || !Number.isFinite(endsAtUtcMs)) {
      this.remainingSeconds.set(0);
      return;
    }

    const secondsUntilEnd = Math.max(0, Math.floor((endsAtUtcMs - serverUtcMs) / 1000));
    this.remainingSeconds.set(secondsUntilEnd);
    this.quizTimedOut = false;

    if (secondsUntilEnd === 0) {
      this.submitQuizOnTimeout();
      return;
    }

    this.countdownSubscription = timer(1000, 1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const next = Math.max(0, this.remainingSeconds() - 1);
        this.remainingSeconds.set(next);

        if (next === 0) {
          this.countdownSubscription?.unsubscribe();
          this.submitQuizOnTimeout();
        }
      });
  }

  private submitQuizOnTimeout(): void {
    if (this.quizTimedOut) {
      return;
    }

    this.quizTimedOut = true;
    this.quizAttemptStore.SubmitQuiz();
  }
}
