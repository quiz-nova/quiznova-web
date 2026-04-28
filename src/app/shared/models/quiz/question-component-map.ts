import { CreateMcq } from '@Features/instructor/create-quiz/create-mcq';
import { CreateTf } from '@Features/instructor/create-quiz/create-tf';
import { McqAttempt } from '@Features/student/quiz-attempt/mcq-attempt';
import { TfAttempt } from '@Features/student/quiz-attempt/tf-attempt';

import { McqTag } from '@shared/components/questions-tags/mcq-tag';
import { TfTag } from '@shared/components/questions-tags/tf-tag';

import {
  CreateQuestionMap,
  QuestionAttemptMap,
  QuestionTagMap,
} from '@shared/models/quiz/question-component.contracts';
import { QuestionType } from '@shared/models/quiz/question.model';

export const QUESTION_ATTEMPT_COMPONENT_MAP: QuestionAttemptMap = {
  [QuestionType.Mcq]: McqAttempt,
  [QuestionType.Tf]: TfAttempt,
};

export const CREATE_QUESTION_COMPONENT_MAP: CreateQuestionMap = {
  [QuestionType.Mcq]: CreateMcq,
  [QuestionType.Tf]: CreateTf,
};

export const QUESTION_TAG_MAP: QuestionTagMap = {
  [QuestionType.Mcq]: McqTag,
  [QuestionType.Tf]: TfTag,
};
