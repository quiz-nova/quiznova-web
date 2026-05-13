import { Choice, MCQ } from '@shared/models/quiz/mcq.model';
import { Question, QuestionType } from '@shared/models/quiz/question.model';
import { Tf } from '@shared/models/quiz/tf.model';

export interface CreateQuestionContext {
  quizId: string;
  questionId?: string;
  remainingMarks: number;
}

type QuestionMapper = (context: CreateQuestionContext) => Question | null;

const DEFAULT_MARKS = 5;

function createChoice(questionId: string, displayOrder: number): Choice {
  return {
    id: crypto.randomUUID(),
    questionId,
    text: '',
    displayOrder,
  };
}

function resolveMarks(remainingMarks: number): number | null {
  if (remainingMarks >= DEFAULT_MARKS) {
    return DEFAULT_MARKS;
  }

  if (remainingMarks > 0) {
    return remainingMarks;
  }

  return null;
}

const QUESTION_MAPPERS: Record<QuestionType, QuestionMapper> = {
  [QuestionType.Mcq]: (context): MCQ | null => {
    const marks = resolveMarks(context.remainingMarks);
    if (marks === null) {
      return null;
    }

    const questionId = context.questionId ?? crypto.randomUUID();

    return {
      id: questionId,
      quizId: context.quizId,
      questionText: '',
      marks,
      type: QuestionType.Mcq,
      numberOfChoices: 2,
      correctChoiceId: '',
      choices: [createChoice(questionId, 1), createChoice(questionId, 2)],
    };
  },
  [QuestionType.Tf]: (context): Tf | null => {
    const marks = resolveMarks(context.remainingMarks);
    if (marks === null) {
      return null;
    }

    return {
      id: context.questionId ?? crypto.randomUUID(),
      quizId: context.quizId,
      questionText: '',
      marks,
      type: QuestionType.Tf,
      correctChoice: true,
    };
  },
};

export function mapQuestionTypeToQuestion(
  questionType: QuestionType,
  context: CreateQuestionContext,
): Question | null {
  return QUESTION_MAPPERS[questionType](context);
}
