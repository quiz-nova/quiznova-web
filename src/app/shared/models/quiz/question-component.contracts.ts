import { InputSignal, OutputEmitterRef, Signal, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';

import {Question, QuestionType} from '@shared/models/quiz/question.model';


export interface QuestionFormContract {
  readonly initialData: InputSignal<Question>;
  readonly formReady: OutputEmitterRef<FormGroup>;
  readonly formDestroyed: OutputEmitterRef<FormGroup>;
  readonly valueChange: OutputEmitterRef<Question>;
  readonly blurEvent: OutputEmitterRef<Question>;
}

export interface QuestionTagContract {
  readonly tag: Signal<string>;
}

export interface QuestionAttemptContract {
  readonly question: InputSignal<Question>;
}

export type QuestionFormMap = Record<QuestionType, Type<QuestionFormContract>>;
export type QuestionTagMap = Record<QuestionType, Type<QuestionTagContract>>;
export type QuestionAttemptMap = Record<QuestionType, Type<QuestionAttemptContract>>;
