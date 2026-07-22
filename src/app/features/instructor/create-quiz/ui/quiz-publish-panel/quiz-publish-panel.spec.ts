import { signal } from '@angular/core';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { QuizPublishPanel } from './quiz-publish-panel';
import { CreateQuizStore } from '../../stores/create-quiz.store';

describe('QuizPublishPanel Component', () => {
  it('should render disabled publish button and hint text when quiz is invalid', async () => {
    const mockStore = {
      isEntireQuizValid: signal(false),
      publishDisabledReason: signal('Add at least 1 question'),
    };

    await render(QuizPublishPanel, {
      componentProviders: [{ provide: CreateQuizStore, useValue: mockStore }],
    });

    const publishBtn = screen.getByRole('button', { name: /Publish Quiz/i });
    expect(publishBtn).toBeDisabled();
    expect(screen.getByText('Add at least 1 question')).toBeInTheDocument();
  });

  it('should enable publish button and emit publish event when quiz is valid', async () => {
    const mockStore = {
      isEntireQuizValid: signal(true),
      publishDisabledReason: signal(''),
    };

    const publishSpy = vi.fn();

    await render(QuizPublishPanel, {
      componentProviders: [{ provide: CreateQuizStore, useValue: mockStore }],
      on: { publish: publishSpy },
    });

    const user = userEvent.setup();
    const publishBtn = screen.getByRole('button', { name: /Publish Quiz/i });

    expect(publishBtn).toBeEnabled();
    await user.click(publishBtn);

    expect(publishSpy).toHaveBeenCalled();
  });
});
