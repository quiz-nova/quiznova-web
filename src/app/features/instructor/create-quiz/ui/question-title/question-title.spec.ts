import { FormControl, Validators } from '@angular/forms';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { QuestionTitle } from './question-title';

describe('QuestionTitle Component', () => {
  it('should display textarea with provided control value', async () => {
    const control = new FormControl('What is TypeScript?', { nonNullable: true });

    await render(QuestionTitle, {
      inputs: { control },
    });

    const textarea = screen.getByLabelText(/Question Text/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe('What is TypeScript?');
  });

  it('should display error message on blur if control is required and empty', async () => {
    const control = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    });

    await render(QuestionTitle, {
      inputs: { control },
    });

    const user = userEvent.setup();
    const textarea = screen.getByLabelText(/Question Text/i);

    await user.click(textarea);
    await user.tab();

    const errorMsg = await screen.findByText('Question text is required.');
    expect(errorMsg).toBeInTheDocument();
  });

  it('should emit titleBlur when textarea loses focus', async () => {
    const control = new FormControl('Sample Question', { nonNullable: true });
    const titleBlurSpy = vi.fn();

    await render(QuestionTitle, {
      inputs: { control },
      on: { titleBlur: titleBlurSpy },
    });

    const user = userEvent.setup();
    const textarea = screen.getByLabelText(/Question Text/i);

    await user.click(textarea);
    await user.tab();

    expect(titleBlurSpy).toHaveBeenCalledWith('Sample Question');
  });
});
