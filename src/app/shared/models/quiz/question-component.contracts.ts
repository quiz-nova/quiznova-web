import { InputSignal, OutputEmitterRef, Signal, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Question, QuestionType } from '@shared/models/quiz/question.model';
import { QuestionAnswer } from '@shared/models/quiz-attempt/question-answer.model';

export interface QuestionFormContract {
  readonly initialData: InputSignal<Question>;
  readonly formReady: OutputEmitterRef<FormGroup>;
  readonly formDestroyed: OutputEmitterRef<FormGroup>;
  readonly valueChange: OutputEmitterRef<Question>;
  readonly blurEvent: OutputEmitterRef<Question>;
  readonly questionTextBlur?: OutputEmitterRef<{ questionId: string; text: string }>;
  readonly deleteChoice?: OutputEmitterRef<{ questionId: string; choiceId: string }>;
}

export interface QuestionTagContract {
  readonly tag: Signal<string>;
}

export interface QuestionAttemptContract {
  readonly question: InputSignal<Question>;
}

export interface AnswerReviewContract {
  readonly question: InputSignal<Question>;
  readonly answer: InputSignal<QuestionAnswer | null>;
  readonly graded?: OutputEmitterRef<void>;
}

export type QuestionFormMap = Record<QuestionType, Type<QuestionFormContract>>;
export type QuestionTagMap = Record<QuestionType, Type<QuestionTagContract>>;
export type QuestionAttemptMap = Record<QuestionType, Type<QuestionAttemptContract>>;
export type AnswerReviewMap = Record<QuestionType, Type<AnswerReviewContract>>;
export type QuestionNotAnsweredMap = Record<QuestionType, Type<QuestionNotAnsweredContract>>;

export interface QuestionNotAnsweredContract {
  readonly question: InputSignal<Question>;
  readonly questionNumber: InputSignal<number>;
}

export interface StudentAnswerReviewContract {
  readonly question: InputSignal<Question>;
  readonly answer: InputSignal<QuestionAnswer>;
  readonly questionNumber: InputSignal<number>;
}

export type StudentAnswerReviewMap = Partial<Record<QuestionType, Type<StudentAnswerReviewContract>>>;
