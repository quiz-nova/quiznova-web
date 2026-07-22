import { signal } from '@angular/core';

import { render, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';

import { QuizHeader } from './quiz-header';
import { CreateQuizStore } from '../../stores/create-quiz.store';

describe('QuizHeader Component', () => {
  it('should render stat pills for question count, total marks, and remaining marks', async () => {
    const mockStore = {
      numberOfQuestions: signal(3),
      totalMarks: signal(12),
      effectiveRemainingMarks: signal(8),
    };

    await render(QuizHeader, {
      componentProviders: [{ provide: CreateQuizStore, useValue: mockStore }],
    });

    expect(screen.getByText('3 Questions')).toBeInTheDocument();
    expect(screen.getByText('12 Marks')).toBeInTheDocument();
    expect(screen.getByText('8 Remaining')).toBeInTheDocument();
  });
});
