import { InputSignal, Signal, Type } from '@angular/core';
import { Question, QuestionType } from './question.model';

export interface QuestionComponent {
  readonly question: InputSignal<Question>;
}

export interface QuestionTagComponent {
  readonly tag: Signal<string>;
}

export interface QuestionAttemptComponent {
  readonly question: InputSignal<Question>;
}

export type QuestionComponentMap = Record<QuestionType, Type<QuestionComponent>>;
export type QuestionTagMap = Record<QuestionType, Type<QuestionTagComponent>>;
export type QuestionAttemptComponentMap = Record<QuestionType, Type<QuestionAttemptComponent>>;