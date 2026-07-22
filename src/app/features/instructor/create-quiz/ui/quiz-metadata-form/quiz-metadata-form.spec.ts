import { AuthService } from '@Features/auth/auth.service';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { CoursesService } from '@shared/services/courses.service';

import { QuizMetadataForm } from './quiz-metadata-form';

describe('QuizMetadataForm Component', () => {
  const mockCourses = [
    { id: 'c-1', courseName: 'Computer Science 101' },
    { id: 'c-2', courseName: 'Database Systems' },
  ];

  const mockAuthService = {
    currentUser: vi.fn().mockReturnValue({ id: 'inst-1', role: 'Instructor' }),
  };

  const mockCoursesService = {
    getInstructorCourses: vi.fn().mockReturnValue(of(mockCourses)),
  };

  it('should initialize form fields with default values', async () => {
    await render(QuizMetadataForm, {
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CoursesService, useValue: mockCoursesService },
      ],
    });

    const titleInput = screen.getByLabelText(/Quiz Title/i) as HTMLInputElement;
    expect(titleInput.value).toBe('');
  });

  it('should show validation error when Quiz Title is empty on blur', async () => {
    await render(QuizMetadataForm, {
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CoursesService, useValue: mockCoursesService },
      ],
    });

    const user = userEvent.setup();
    const titleInput = screen.getByLabelText(/Quiz Title/i);

    await user.click(titleInput);
    await user.tab();

    const errorMsg = await screen.findByText('Quiz title is required.');
    expect(errorMsg).toBeInTheDocument();
  });

  it('should emit valueChange when inputs are updated', async () => {
    const valueChangeSpy = vi.fn();

    await render(QuizMetadataForm, {
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CoursesService, useValue: mockCoursesService },
      ],
      on: { valueChange: valueChangeSpy },
    });

    const user = userEvent.setup();
    const titleInput = screen.getByLabelText(/Quiz Title/i);

    await user.type(titleInput, 'Midterm Exam');

    expect(valueChangeSpy).toHaveBeenCalled();
    const lastEmit = valueChangeSpy.mock.calls.at(-1)![0];
    expect(lastEmit.title).toBe('Midterm Exam');
  });
});
