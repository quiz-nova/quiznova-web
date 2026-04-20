import { Mcq } from '../../../features/instructor/create-quiz/mcq';
import { TrueFalse } from '../../../features/instructor/create-quiz/true-false';
import { McqAttempt } from '../../../features/student/quiz-attempt/mcq-attempt';
import { TrueFalseAttempt } from '../../../features/student/quiz-attempt/true-false-attempt';
import { McqTag } from '../../components/questions-tags/mcq-tag';
import { TrueFalseTag } from '../../components/questions-tags/true-false-tag';
import {
  QuestionAttemptComponentMap,
  QuestionComponentMap,
  QuestionTagMap,
} from './question-component.contracts';
import { QuestionType } from './question.model';

export const QUESTION_ATTEMPT_COMPONENT_MAP: QuestionAttemptComponentMap = {
  [QuestionType.Mcq]: McqAttempt,
  [QuestionType.TrueFalse]: TrueFalseAttempt,
};

export const QUESTION_COMPONENT_MAP: QuestionComponentMap = {
  [QuestionType.Mcq]: Mcq,
  [QuestionType.TrueFalse]: TrueFalse,
};

export const QUESTION_TAG_MAP: QuestionTagMap = {
  [QuestionType.Mcq]: McqTag,
  [QuestionType.TrueFalse]: TrueFalseTag,
};
