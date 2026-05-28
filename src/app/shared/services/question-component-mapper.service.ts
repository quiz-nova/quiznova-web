import { Injectable, type Type } from '@angular/core';

import {
  QUESTION_FORM_COMPONENT_MAP,
  QUESTION_ATTEMPT_COMPONENT_MAP,
  QUESTION_TAG_MAP,
  ANSWER_REVIEW_COMPONENT_MAP,
  QUESTION_NOT_ANSWERED_COMPONENT_MAP,
  STUDENT_ANSWER_REVIEW_COMPONENT_MAP,
} from '@shared/models/quiz/question-component-map';
import {
  QuestionAttemptContract,
  QuestionFormContract,
  QuestionTagContract,
  AnswerReviewContract,
  QuestionNotAnsweredContract,
  StudentAnswerReviewContract,
} from '@shared/models/quiz/question-component.contracts';
import { QuestionType } from '@shared/models/quiz/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionComponentMapperService {
  getSuitableQuestionFormComponent(questionType: QuestionType): Type<QuestionFormContract> | null {
    return QUESTION_FORM_COMPONENT_MAP[questionType] || null;
  }

  getSuitableQuestionTag(questionType: QuestionType): Type<QuestionTagContract> | null {
    return QUESTION_TAG_MAP[questionType] || null;
  }

  getSuitableQuestionAttemptComponent(
    questionType: QuestionType,
  ): Type<QuestionAttemptContract> | null {
    return QUESTION_ATTEMPT_COMPONENT_MAP[questionType] || null;
  }

  getSuitableAnswerReviewComponent(questionType: QuestionType): Type<AnswerReviewContract> | null {
    return ANSWER_REVIEW_COMPONENT_MAP[questionType] || null;
  }

  getSuitableQuestionNotAnsweredComponent(
    questionType: QuestionType,
  ): Type<QuestionNotAnsweredContract> | null {
    return QUESTION_NOT_ANSWERED_COMPONENT_MAP[questionType] || null;
  }

  getSuitableStudentAnswerReviewComponent(
    questionType: QuestionType,
  ): Type<StudentAnswerReviewContract> | null {
    return STUDENT_ANSWER_REVIEW_COMPONENT_MAP[questionType] || null;
  }
}
