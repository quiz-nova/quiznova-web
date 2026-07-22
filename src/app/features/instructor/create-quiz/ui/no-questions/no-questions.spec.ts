import { TestBed } from '@angular/core/testing';

import { render, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';

import { NoQuestions } from './no-questions';

describe('NoQuestions Component', () => {
  it('should render empty state message', async () => {
    await TestBed.configureTestingModule({
      imports: [NoQuestions],
    }).compileComponents();

    await render(NoQuestions);

    expect(screen.getByText('No questions yet')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Select a question type above and click "Add Question" to start building your quiz/i,
      ),
    ).toBeInTheDocument();
  });
});
