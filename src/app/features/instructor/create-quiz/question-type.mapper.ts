import { Choice, MCQ } from '@shared/models/quiz/mcq.model';
import { Question, QuestionType } from '@shared/models/quiz/question.model';
import { Tf } from '@shared/models/quiz/tf.model';

interface CreateQuestionContext {
  quizId: string;
  questionId?: string;
}

type QuestionMapper = (context: CreateQuestionContext) => Question;

const DEFAULT_MARKS = 5;

function createChoice(questionId: string, displayOrder: number): Choice {
  return {
    id: crypto.randomUUID(),
    questionId,
    text: '',
    displayOrder,
  };
}

const QUESTION_MAPPERS: Record<QuestionType, QuestionMapper> = {
  [QuestionType.Mcq]: (context): MCQ => {
    const questionId = context.questionId ?? crypto.randomUUID();

    return {
      id: questionId,
      quizId: context.quizId,
      questionText: '',
      marks: DEFAULT_MARKS,
      type: QuestionType.Mcq,
      numberOfChoices: 2,
      correctChoiceId: '',
      choices: [createChoice(questionId, 1), createChoice(questionId, 2)],
    };
  },
  [QuestionType.Tf]: (context): Tf => ({
    id: context.questionId ?? crypto.randomUUID(),
    quizId: context.quizId,
    questionText: '',
    marks: DEFAULT_MARKS,
    type: QuestionType.Tf,
    correctChoice: true,
  }),
};

export function mapQuestionTypeToQuestion(
  questionType: QuestionType,
  context: CreateQuestionContext,
): Question {
  return QUESTION_MAPPERS[questionType](context);
}
