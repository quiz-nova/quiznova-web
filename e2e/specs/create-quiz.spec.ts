import { test, expect, type Locator } from '@playwright/test';

import { SeededCredentials } from '../helpers/SeededCredentials';

test.describe('Quiz Creation E2E & Validations', () => {
  let titleInput: Locator;
  let startsAtInput: Locator;
  let endsAtInput: Locator;
  let publishBtn: Locator;
  let addQuestionBtn: Locator;
  let courseSelect: Locator;
  let questionTypeSelect: Locator;

  let mcqForm: Locator;
  let mcqTitleArea: Locator;
  let mcqChoiceInputs: Locator;
  let mcqRadios: Locator;
  let mcqDeleteButtons: Locator;
  let mcqAddChoiceBtn: Locator;
  let mcqMarksInput: Locator;

  let essayTitleArea: Locator;
  let essayReferenceArea: Locator;
  let essayMarksInput: Locator;

  let tfTitleArea: Locator;
  let tfRadios: Locator;
  let tfMarksInput: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.locator('#login-email').fill(SeededCredentials.instructor.email);
    await page.locator('#login-password').fill(SeededCredentials.instructor.password);
    await page.locator('label.role-box').filter({ hasText: 'Instructor' }).click();
    await page.locator('button.auth-submit').click();

    await expect(page).toHaveURL('/instructor/dashboard');

    await page.goto('/instructor/create-quiz');

    titleInput = page.locator('#quiz-title');
    startsAtInput = page.locator('#quiz-starts-at input');
    endsAtInput = page.locator('#quiz-ends-at input');
    publishBtn = page.locator('button:has-text("Publish Quiz")');
    addQuestionBtn = page.locator('app-add-question:not(.pill-style) button');
    courseSelect = page.locator('p-select[inputid="quiz-course"]');
    questionTypeSelect = page.locator('app-add-question:not(.pill-style) p-select[inputid="questionType"]');

    mcqForm = page.locator('app-mcq-form');
    mcqTitleArea = page.locator('app-mcq-form app-question-title textarea');
    mcqChoiceInputs = page.locator('app-mcq-form input.choice-input');
    mcqRadios = page.locator('app-mcq-form p-radiobutton input[type="radio"]');
    mcqDeleteButtons = page.locator('app-mcq-form app-delete-button button');
    mcqAddChoiceBtn = page.locator('app-mcq-form button:has-text("+Add Choice")');
    mcqMarksInput = page.locator('app-question-header input[type="number"]').nth(0);

    essayTitleArea = page.locator('app-essay-form app-question-title textarea');
    essayReferenceArea = page.locator('app-essay-form textarea#answerReference');
    essayMarksInput = page.locator('app-question-header input[type="number"]').nth(1);

    tfTitleArea = page.locator('app-tf-form app-question-title textarea');
    tfRadios = page.locator('app-tf-form p-radiobutton input[type="radio"]');
    tfMarksInput = page.locator('app-question-header input[type="number"]').nth(2);
  });

  test('should disable Add Question when no course is selected and enable when selected', async ({
    page,
  }) => {
    await expect(addQuestionBtn).toBeDisabled();
    await expect(publishBtn).toBeDisabled();

    await courseSelect.click();
    await page.locator('.p-select-option').filter({ hasText: 'Backend Fundamentals' }).click();

    await expect(addQuestionBtn).toBeEnabled();
    await expect(publishBtn).toBeDisabled();
  });

  test('should validate Quiz Title and time interval constraints', async ({ page }) => {
    await courseSelect.click();
    await page.locator('.p-select-option').filter({ hasText: 'Backend Fundamentals' }).click();

    await titleInput.fill('ab');
    await titleInput.blur();
    await expect(page.locator('app-field-error#quiz-title-minlength-error')).toContainText(
      'Quiz title must be at least 3 characters.',
    );
    await expect(publishBtn).toBeDisabled();

    await titleInput.fill('a'.repeat(31));
    await titleInput.blur();
    await expect(page.locator('app-field-error#quiz-title-maxlength-error')).toContainText(
      'Quiz title cannot exceed 30 characters.',
    );
    await expect(publishBtn).toBeDisabled();

    await titleInput.fill('Valid Quiz Title');
    await titleInput.blur();

    await startsAtInput.click();
    await startsAtInput.press('Control+A');
    await startsAtInput.pressSequentially('12/12/2026 12:00 PM');
    await startsAtInput.press('Enter');

    await endsAtInput.click();
    await endsAtInput.press('Control+A');
    await endsAtInput.pressSequentially('12/12/2026 11:50 AM');
    await endsAtInput.press('Enter');

    await expect(page.locator('app-field-error#ends-at-before-start-error')).toContainText(
      'End time must be after start time.',
    );
    await expect(publishBtn).toBeDisabled();

    await endsAtInput.click();
    await endsAtInput.press('Control+A');
    await endsAtInput.pressSequentially('12/12/2026 12:05 PM');
    await endsAtInput.press('Enter');

    await expect(page.locator('app-field-error#ends-at-less-than-ten-error')).toContainText(
      'The difference between start and end time must be at least 10 minutes.',
    );
    await expect(publishBtn).toBeDisabled();

    await startsAtInput.click();
    await startsAtInput.press('Control+A');
    await startsAtInput.pressSequentially('01/01/2020 10:00 AM');
    await startsAtInput.press('Enter');

    await expect(page.locator('app-field-error#starts-at-past-error')).toContainText(
      'Start time cannot be in the past.',
    );
    await expect(publishBtn).toBeDisabled();
  });

  test('should handle MCQ choice controls, selection of empty choice, and limits', async ({
    page,
  }) => {
    await courseSelect.click();
    await page.locator('.p-select-option').filter({ hasText: 'Backend Fundamentals' }).click();

    await addQuestionBtn.click();

    await expect(mcqForm).toBeVisible();

    await expect(mcqDeleteButtons).toHaveCount(2);
    await expect(mcqDeleteButtons.nth(0)).toBeDisabled();
    await expect(mcqDeleteButtons.nth(1)).toBeDisabled();

    await mcqAddChoiceBtn.click();
    await mcqAddChoiceBtn.click();
    await mcqAddChoiceBtn.click();

    await expect(mcqAddChoiceBtn).toBeDisabled();

    await expect(mcqDeleteButtons.nth(0)).toBeEnabled();

    await mcqRadios.nth(4).click({ force: true });
    await expect(mcqRadios.nth(4)).toBeChecked();

    await mcqChoiceInputs.nth(4).fill('Special Fifth Option');

    await mcqForm.locator('app-delete-button').nth(4).click();

    await expect(mcqChoiceInputs).toHaveCount(4);

    for (let i = 0; i < 4; i++) {
      await expect(mcqRadios.nth(i)).not.toBeChecked();
    }
  });

  test('should successfully publish a quiz with MCQ, TF, and Essay questions (Happy Path)', async ({
    page,
  }) => {
    await courseSelect.click();
    await page.locator('.p-select-option').filter({ hasText: 'Backend Fundamentals' }).click();

    await titleInput.fill('E2E Integration Quiz');
    await titleInput.blur();

    const futureStart = new Date();
    futureStart.setMinutes(futureStart.getMinutes() + 5);
    const futureEnd = new Date();
    futureEnd.setHours(futureEnd.getHours() + 2);

    const formatTime = (d: Date) => {
      return d.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).replace(',', '');
    };

    await startsAtInput.click();
    await startsAtInput.press('Control+A');
    await startsAtInput.pressSequentially(formatTime(futureStart));
    await startsAtInput.press('Enter');

    await endsAtInput.click();
    await endsAtInput.press('Control+A');
    await endsAtInput.pressSequentially(formatTime(futureEnd));
    await endsAtInput.press('Enter');

    await addQuestionBtn.click();

    await mcqTitleArea.fill('What is the capital of France?');
    await mcqTitleArea.blur();

    await mcqChoiceInputs.nth(0).fill('Paris');
    await mcqChoiceInputs.nth(1).fill('London');
    await mcqChoiceInputs.nth(0).blur();
    await mcqChoiceInputs.nth(1).blur();

    await mcqRadios.nth(0).click({ force: true });

    await mcqMarksInput.fill('3');
    await mcqMarksInput.blur();

    await questionTypeSelect.click();
    await page.locator('.p-select-option').filter({ hasText: 'Essay' }).click();
    await addQuestionBtn.click();

    await essayTitleArea.fill('Explain polymorphism in Object-Oriented Programming.');
    await essayTitleArea.blur();

    await essayReferenceArea.fill(
      'Polymorphism is the ability of an object to take on many forms.',
    );
    await essayReferenceArea.blur();

    await essayMarksInput.fill('2');
    await essayMarksInput.blur();

    await questionTypeSelect.click();
    await page.locator('.p-select-option').filter({ hasText: 'True/False' }).click();
    await addQuestionBtn.click();

    await tfTitleArea.fill('C# is an object-oriented programming language.');
    await tfTitleArea.blur();

    await tfRadios.nth(0).click({ force: true });

    await tfMarksInput.fill('1');
    await tfMarksInput.blur();

    await expect(publishBtn).toBeEnabled();

    const createQuizResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/quizzes') && response.request().method() === 'POST',
    );

    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Quiz published successfully.');
      await dialog.accept();
    });

    await publishBtn.click();

    const createQuizResponse = await createQuizResponsePromise;
    expect([200, 201]).toContain(createQuizResponse.status());
  });
});
