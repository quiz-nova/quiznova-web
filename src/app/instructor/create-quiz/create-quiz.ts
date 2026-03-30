import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgComponentOutlet } from '@angular/common';

import { AddQuestion } from './add-question/add-question';
import { CreateQuizService } from '../../shared/services/quiz.service';
import { QuestionHeader } from './question-header/question-header';
import { QuizHeader } from './quiz-header/quiz-header';
import { NoQuestions } from './no-questions/no-questions';

@Component({
  selector: 'app-create-quiz',
  imports: [
    ReactiveFormsModule,
    AddQuestion,
    NgComponentOutlet,
    QuestionHeader,
    QuestionHeader,
    QuizHeader,
    NoQuestions,
  ],
  templateUrl: './create-quiz.html',
  styleUrl: './create-quiz.css',
})
export class CreateQuiz {
  quizService = inject(CreateQuizService);
}
