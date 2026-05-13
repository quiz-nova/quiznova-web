
import { McqForm } from '@Features/instructor/shared/mcq-form';
import { TfForm } from '@Features/instructor/shared/tf-form';
import { McqAttempt } from '@Features/student/quiz-attempt/mcq-attempt';
import { TfAttempt } from '@Features/student/quiz-attempt/tf-attempt';

import { McqTag } from '@shared/components/questions-tags/mcq-tag';
import { TfTag } from '@shared/components/questions-tags/tf-tag';
import {
  QuestionFormMap,
  QuestionAttemptMap,
  QuestionTagMap,
} from '@shared/models/quiz/question-component.contracts';
import { QuestionType } from '@shared/models/quiz/question.model';

export const QUESTION_ATTEMPT_COMPONENT_MAP: QuestionAttemptMap = {
  [QuestionType.Mcq]: McqAttempt,
  [QuestionType.Tf]: TfAttempt,
};

export const QUESTION_FORM_COMPONENT_MAP: QuestionFormMap = {
  [QuestionType.Mcq]: McqForm,
  [QuestionType.Tf]: TfForm,
};

export const QUESTION_TAG_MAP: QuestionTagMap = {
  [QuestionType.Mcq]: McqTag,
  [QuestionType.Tf]: TfTag,
};
