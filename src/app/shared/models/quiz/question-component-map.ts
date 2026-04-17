import { Essay } from '../../../features/instructor/create-quiz/essay';
import { Mcq } from '../../../features/instructor/create-quiz/mcq';
import { TrueFalse } from '../../../features/instructor/create-quiz/true-false';
import { EssayAttempt } from '../../../features/student/quiz-attempt/essay-attempt';
import { McqAttempt } from '../../../features/student/quiz-attempt/mcq-attempt';
import { TrueFalseAttempt } from '../../../features/student/quiz-attempt/true-false-attempt';
import { EssayTag } from '../../components/questions-tags/essay-tag';
import { McqTag } from '../../components/questions-tags/mcq-tag';
import { TrueFalseTag } from '../../components/questions-tags/true-false-tag';
import {
  QuestionAttemptComponentMap,
  QuestionComponentMap,
  QuestionTagMap,
} from './question-component.contracts';
import { QuestionType } from './question.model';

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
