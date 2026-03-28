import { InputSignal, Type } from '@angular/core';
import { Essay } from '../../../instructor/create-quiz/essay/essay';
import { MultipleChoice } from '../../../instructor/create-quiz/multiple-choice/multiple-choice';
import { TrueFalse } from '../../../instructor/create-quiz/true-false/true-false';

export enum QuestionType {
  MultipleChoice = 'multiple-choice',
  TrueFalse = 'true-false',
  Essay = 'essay',
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  marks: number;
  type: QuestionType;
}

export interface QuestionComponent {
  question: InputSignal<Question>;
}

export type QuestionComponentMap = Record<QuestionType, Type<QuestionComponent>>;

export const QUESTION_COMPONENT_MAP: QuestionComponentMap = {
  [QuestionType.MultipleChoice]: MultipleChoice,
  [QuestionType.TrueFalse]: TrueFalse,
  [QuestionType.Essay]: Essay,
};
