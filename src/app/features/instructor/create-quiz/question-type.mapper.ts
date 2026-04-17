import { EssayQuestion } from '../../../shared/models/quiz/essay.model';
import { Choice, MCQ } from '../../../shared/models/quiz/mcq.model';
import { Question, QuestionType } from '../../../shared/models/quiz/question.model';
import { TrueFalseQuestion } from '../../../shared/models/quiz/true-false.model';

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
  [QuestionType.MultipleChoice]: (context): MCQ => {
    const questionId = context.questionId ?? crypto.randomUUID();

    return {
      id: questionId,
      quizId: context.quizId,
      questionText: '',
      marks: DEFAULT_MARKS,
      type: QuestionType.MultipleChoice,
      numberOfChoices: 2,
      correctChoiceId: '',
      choices: [createChoice(questionId, 1), createChoice(questionId, 2)],
    };
  },
  [QuestionType.TrueFalse]: (context): TrueFalseQuestion => ({
    id: context.questionId ?? crypto.randomUUID(),
    quizId: context.quizId,
    questionText: '',
    marks: DEFAULT_MARKS,
    type: QuestionType.TrueFalse,
    correctChoice: true,
  }),
  [QuestionType.Essay]: (context): EssayQuestion => ({
    id: context.questionId ?? crypto.randomUUID(),
    quizId: context.quizId,
    questionText: '',
    marks: DEFAULT_MARKS,
    type: QuestionType.Essay,
  }),
};

export function mapQuestionTypeToQuestion(
  questionType: QuestionType,
  context: CreateQuestionContext,
): Question {
  return QUESTION_MAPPERS[questionType](context);
}
