import { AuthService } from '@Features/auth/auth.service';
import { render, screen } from '@testing-library/angular';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { CoursesService } from '@shared/services/courses.service';
import { QuizService } from '@shared/services/quiz.service';

import { CreateQuiz } from './create-quiz';

describe('CreateQuiz Container Component', () => {
  const mockAuthService = {
    currentUser: vi.fn().mockReturnValue({ id: 'inst-1', role: 'Instructor' }),
  };

  const mockCoursesService = {
    getInstructorCourses: vi.fn().mockReturnValue(of([])),
    getCourseById: vi.fn().mockReturnValue(of({ remainingMarks: 20 })),
  };

  const mockQuizService = {
    createQuiz: vi.fn().mockReturnValue(of({})),
  };

  const mockMessageService = {
    add: vi.fn(),
  };

  it('should render page title, publish panel, and empty questions prompt initially', async () => {
    await render(CreateQuiz, {
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CoursesService, useValue: mockCoursesService },
        { provide: QuizService, useValue: mockQuizService },
        { provide: MessageService, useValue: mockMessageService },
      ],
    });

    expect(screen.getByText('Create Quiz')).toBeInTheDocument();
    expect(screen.getByText('No questions yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Publish Quiz/i })).toBeDisabled();
  });
});
