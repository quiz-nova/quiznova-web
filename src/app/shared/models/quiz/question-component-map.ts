import { EssayAnswerGrading } from '@Features/instructor/grade-review/essay-answer-grading';
import { McqAnswerReview } from '@Features/instructor/grade-review/mcq-answer-review';
import { TfAnswerReview } from '@Features/instructor/grade-review/tf-answer-review';
import { EssayForm } from '@Features/instructor/shared/essay-form';
import { McqForm } from '@Features/instructor/shared/mcq-form';
import { TfForm } from '@Features/instructor/shared/tf-form';
import { EssayAttempt } from '@Features/student/quiz-attempt/essay-attempt';
import { McqAttempt } from '@Features/student/quiz-attempt/mcq-attempt';
import { TfAttempt } from '@Features/student/quiz-attempt/tf-attempt';
import { StudentEssayAnswerReview } from '@Features/student/review-quiz/essay-answer-review';
import { EssayNotAnswered } from '@Features/student/review-quiz/essay-not-answered';
import { McqAnswerReview as StudentMcqAnswerReview } from '@Features/student/review-quiz/mcq-answer-review';
import { McqNotAnswered } from '@Features/student/review-quiz/mcq-not-answered';
import { TfAnswerReview as StudentTfAnswerReview } from '@Features/student/review-quiz/tf-answer-review';
import { TfNotAnswered } from '@Features/student/review-quiz/tf-not-answered';

import { EssayTag } from '@shared/components/questions-tags/essay-tag';
import { McqTag } from '@shared/components/questions-tags/mcq-tag';
import { TfTag } from '@shared/components/questions-tags/tf-tag';
import {
  QuestionFormMap,
  QuestionAttemptMap,
  QuestionTagMap,
  AnswerReviewMap,
  QuestionNotAnsweredMap,
  StudentAnswerReviewMap,
} from '@shared/models/quiz/question-component.contracts';
import { QuestionType } from '@shared/models/quiz/question.model';

export const QUESTION_ATTEMPT_COMPONENT_MAP: QuestionAttemptMap = {
  [QuestionType.Mcq]: McqAttempt,
  [QuestionType.Tf]: TfAttempt,
  [QuestionType.Essay]: EssayAttempt,
};

export const QUESTION_FORM_COMPONENT_MAP: QuestionFormMap = {
  [QuestionType.Mcq]: McqForm,
  [QuestionType.Tf]: TfForm,
  [QuestionType.Essay]: EssayForm,
};

export const QUESTION_TAG_MAP: QuestionTagMap = {
  [QuestionType.Mcq]: McqTag,
  [QuestionType.Tf]: TfTag,
  [QuestionType.Essay]: EssayTag,
};

export const ANSWER_REVIEW_COMPONENT_MAP: AnswerReviewMap = {
  [QuestionType.Mcq]: McqAnswerReview,
  [QuestionType.Tf]: TfAnswerReview,
  [QuestionType.Essay]: EssayAnswerGrading,
};

export const QUESTION_NOT_ANSWERED_COMPONENT_MAP: QuestionNotAnsweredMap = {
  [QuestionType.Mcq]: McqNotAnswered,
  [QuestionType.Tf]: TfNotAnswered,
  [QuestionType.Essay]: EssayNotAnswered,
};

export const STUDENT_ANSWER_REVIEW_COMPONENT_MAP: StudentAnswerReviewMap = {
  [QuestionType.Mcq]: StudentMcqAnswerReview,
  [QuestionType.Tf]: StudentTfAnswerReview,
  [QuestionType.Essay]: StudentEssayAnswerReview,
};

