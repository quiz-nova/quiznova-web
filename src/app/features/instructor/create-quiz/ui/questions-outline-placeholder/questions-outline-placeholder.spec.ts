import { TestBed } from '@angular/core/testing';

import { render, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';

import { QuestionsOutlinePlaceholder } from './questions-outline-placeholder';

describe('QuestionsOutlinePlaceholder Component', () => {
  it('should render outline placeholder text', async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionsOutlinePlaceholder],
    }).compileComponents();

    await render(QuestionsOutlinePlaceholder);

    expect(
      screen.getByText('Your quiz outline will appear here as you add questions.'),
    ).toBeInTheDocument();
  });
});
