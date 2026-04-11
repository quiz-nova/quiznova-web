import { InputSignal, Signal, Type } from '@angular/core';
import { Essay } from '../../../features/instructor/create-quiz/essay';
import { Mcq } from '../../../features/instructor/create-quiz/mcq';
import { TrueFalse } from '../../../features/instructor/create-quiz/true-false';
import { EssayTag } from '../../components/questions-tags/essay-tag';
import { TrueFalseTag } from '../../components/questions-tags/true-false-tag';
import { McqTag } from '../../components/questions-tags/mcq-tag';
import { EssayAttempt } from '../../../features/student/quiz-attempt/essay-attempt';
import { TrueFalseAttempt } from '../../../features/student/true-false-attempt/true-false-attempt';
import { McqAttempt } from '../../../features/student/quiz-attempt/mcq-attempt';

export const QuestionType = {
  MultipleChoice: 'multiple-choice',
  TrueFalse: 'true-false',
  Essay: 'essay',
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  marks: number;
  type: QuestionType;
}

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

export const QUESTION_ATTEMPT_COMPONENT_MAP: QuestionAttemptComponentMap = {
  [QuestionType.MultipleChoice]: McqAttempt,
  [QuestionType.TrueFalse]: TrueFalseAttempt,
  [QuestionType.Essay]: EssayAttempt,
};
export const QUESTION_COMPONENT_MAP: QuestionComponentMap = {
  [QuestionType.MultipleChoice]: Mcq,
  [QuestionType.TrueFalse]: TrueFalse,
  [QuestionType.Essay]: Essay,
};

export const QUESTION_TAG_MAP: QuestionTagMap = {
  [QuestionType.MultipleChoice]: McqTag,
  [QuestionType.TrueFalse]: TrueFalseTag,
  [QuestionType.Essay]: EssayTag,
};
