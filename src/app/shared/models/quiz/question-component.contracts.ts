import { InputSignal, Signal, Type } from '@angular/core';

import {Question, QuestionType} from '@shared/models/quiz/question.model';


export interface CreateQuestionContract {
  readonly index: InputSignal<number>;
}

export interface QuestionTagContract {
  readonly tag: Signal<string>;
}

export interface QuestionAttemptContract {
  readonly question: InputSignal<Question>;
}

export type CreateQuestionMap = Record<QuestionType, Type<CreateQuestionContract>>;
export type QuestionTagMap = Record<QuestionType, Type<QuestionTagContract>>;
export type QuestionAttemptMap = Record<QuestionType, Type<QuestionAttemptContract>>;
