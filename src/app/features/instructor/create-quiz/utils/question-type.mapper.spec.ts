import { describe, expect, it } from 'vitest';

import { QuestionType } from '@shared/models/quiz/question.model';
import { isMcq } from '@shared/models/quiz/questions/mcq.model';
import { isTf } from '@shared/models/quiz/questions/tf.model';

import { mapQuestionTypeToQuestion } from './question-type.mapper';

describe('question-type.mapper', () => {
  it('should map MCQ question type to default Mcq model with 2 choices and default marks', () => {
    const question = mapQuestionTypeToQuestion(QuestionType.Mcq, {
      remainingMarks: 15,
      displayOrder: 1,
    });

    expect(question).not.toBeNull();
    expect(question?.type).toBe(QuestionType.Mcq);
    expect(question?.marks).toBe(5);
    if (question && isMcq(question)) {
      expect(question.choices).toHaveLength(2);
    }
  });

  it('should map Tf question type to default Tf model', () => {
    const question = mapQuestionTypeToQuestion(QuestionType.Tf, {
      remainingMarks: 10,
      displayOrder: 2,
    });

    expect(question).not.toBeNull();
    expect(question?.type).toBe(QuestionType.Tf);
    if (question && isTf(question)) {
      expect(question.correctChoice).toBe(true);
    }
  });

  it('should map Essay question type to default Essay model', () => {
    const question = mapQuestionTypeToQuestion(QuestionType.Essay, {
      remainingMarks: 10,
      displayOrder: 3,
    });

    expect(question).not.toBeNull();
    expect(question?.type).toBe(QuestionType.Essay);
  });

  it('should clamp initial marks to remainingMarks if remainingMarks is less than 5', () => {
    const question = mapQuestionTypeToQuestion(QuestionType.Mcq, {
      remainingMarks: 3,
      displayOrder: 1,
    });

    expect(question?.marks).toBe(3);
  });

  it('should return null if remainingMarks is 0', () => {
    const question = mapQuestionTypeToQuestion(QuestionType.Mcq, {
      remainingMarks: 0,
      displayOrder: 1,
    });

    expect(question).toBeNull();
  });
});
