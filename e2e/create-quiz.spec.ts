import { test, expect, type Locator } from '@playwright/test';

test.describe('Quiz Creation E2E & Validations', () => {
  // Reusable, strongly-typed locators
  let titleInput: Locator;
  let startsAtInput: Locator;
  let endsAtInput: Locator;
  let publishBtn: Locator;
  let addQuestionBtn: Locator;
  let courseSelect: Locator;
  let questionTypeSelect: Locator;

  // MCQ locators
  let mcqForm: Locator;
  let mcqTitleArea: Locator;
  let mcqChoiceInputs: Locator;
  let mcqRadios: Locator;
  let mcqDeleteButtons: Locator;
  let mcqAddChoiceBtn: Locator;
  let mcqMarksInput: Locator;

  // Essay locators
  let essayTitleArea: Locator;
  let essayReferenceArea: Locator;
  let essayMarksInput: Locator;

  // TF locators
  let tfTitleArea: Locator;
  let tfRadios: Locator;
  let tfMarksInput: Locator;

  test.beforeEach(async ({ page }) => {
    // 1. Log in as Instructor
    await page.goto('/auth/login');
    await page.locator('#login-email').fill('instructor1@quiznova.local');
    await page.locator('#login-password').fill('Instructor123!');
    await page.locator('.role-box').filter({ hasText: 'Instructor' }).click();
    await page.locator('button.auth-submit').click();

    await expect(page).toHaveURL('/instructor/dashboard');

    // 2. Go to Create Quiz page
    await page.goto('/instructor/create-quiz');

    // 3. Initialize lazily-evaluated locators
    titleInput = page.locator('#quiz-title');
    startsAtInput = page.locator('#quiz-starts-at input');
    endsAtInput = page.locator('#quiz-ends-at input');
    publishBtn = page.locator('button:has-text("Publish Quiz")');
    addQuestionBtn = page.locator('app-add-question:not(.pill-style) button');
    courseSelect = page.locator('p-select[inputid="quiz-course"]');
    questionTypeSelect = page.locator('app-add-question:not(.pill-style) p-select[inputid="questionType"]');

    // MCQ
    mcqForm = page.locator('app-mcq-form');
    mcqTitleArea = page.locator('app-mcq-form app-question-title textarea');
    mcqChoiceInputs = page.locator('app-mcq-form input.choice-input');
    mcqRadios = page.locator('app-mcq-form p-radiobutton input[type="radio"]');
    mcqDeleteButtons = page.locator('app-mcq-form app-delete-button button');
    mcqAddChoiceBtn = page.locator('app-mcq-form button:has-text("+Add Choice")');
    mcqMarksInput = page.locator('app-question-header input[type="number"]').nth(0);

    // Essay
    essayTitleArea = page.locator('app-essay-form app-question-title textarea');
    essayReferenceArea = page.locator('app-essay-form textarea#answerReference');
    essayMarksInput = page.locator('app-question-header input[type="number"]').nth(1);

    // TF
    tfTitleArea = page.locator('app-tf-form app-question-title textarea');
    tfRadios = page.locator('app-tf-form p-radiobutton input[type="radio"]');
    tfMarksInput = page.locator('app-question-header input[type="number"]').nth(2);
  });

  test('should disable Add Question when no course is selected and enable when selected', async ({
    page,
  }) => {
    // Initially, no course is selected. Add Question button should be disabled.
    await expect(addQuestionBtn).toBeDisabled();

    // Select course "Backend Fundamentals"
    await courseSelect.click();
    await page.locator('.p-select-option').filter({ hasText: 'Backend Fundamentals' }).click();

    // Add Question button should now be enabled
    await expect(addQuestionBtn).toBeEnabled();
  });

  test('should validate Quiz Title and time interval constraints', async ({ page }) => {
    // Select course first
    await courseSelect.click();
    await page.locator('.p-select-option').filter({ hasText: 'Backend Fundamentals' }).click();

    // 1. Validate title length < 3 chars
    await titleInput.fill('ab');
    await titleInput.blur();
    await expect(page.locator('app-field-error#quiz-title-minlength-error')).toContainText(
      'Quiz title must be at least 3 characters.',
    );
    await expect(publishBtn).toBeDisabled();

    // 2. Validate title length > 30 chars
    await titleInput.fill('a'.repeat(31));
    await titleInput.blur();
    await expect(page.locator('app-field-error#quiz-title-maxlength-error')).toContainText(
      'Quiz title cannot exceed 30 characters.',
    );
    await expect(publishBtn).toBeDisabled();

    // Fix title
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
    // Select course
    await courseSelect.click();
    await page.locator('.p-select-option').filter({ hasText: 'Backend Fundamentals' }).click();

    // Click Add Question (default type MCQ is selected)
    await addQuestionBtn.click();

    await expect(mcqForm).toBeVisible();

    // Initially there are 2 choices (minimum)
    await expect(mcqDeleteButtons).toHaveCount(2);
    // Delete buttons should be disabled because choices count is 2
    await expect(mcqDeleteButtons.nth(0)).toBeDisabled();
    await expect(mcqDeleteButtons.nth(1)).toBeDisabled();

    // Add Choice up to 5 (maximum)
    await mcqAddChoiceBtn.click(); // 3 choices
    await mcqAddChoiceBtn.click(); // 4 choices
    await mcqAddChoiceBtn.click(); // 5 choices

    await expect(mcqAddChoiceBtn).toBeDisabled(); // Disabled at 5 choices

    // Verify delete buttons are now enabled
    await expect(mcqDeleteButtons.nth(0)).toBeEnabled();

    // Try to pick an empty choice as correct choice BEFORE entering text
    await mcqRadios.nth(4).click({ force: true }); // Click the 5th empty choice radio button
    await expect(mcqRadios.nth(4)).toBeChecked();

    // Now fill the text for the 5th choice
    await mcqChoiceInputs.nth(4).fill('Special Fifth Option');

    // Delete the 5th choice (which is the correct choice)
    await mcqForm.locator('app-delete-button').nth(4).click();

    // Verify it was deleted (choices count goes back to 4)
    await expect(mcqChoiceInputs).toHaveCount(4);

    // Verify that correctChoiceId was reset and no radio option is checked
    for (let i = 0; i < 4; i++) {
      await expect(mcqRadios.nth(i)).not.toBeChecked();
    }
  });

  test('should successfully publish a quiz with MCQ, TF, and Essay questions (Happy Path)', async ({
    page,
  }) => {
    // Select course
    await courseSelect.click();
    await page.locator('.p-select-option').filter({ hasText: 'Backend Fundamentals' }).click();

    // Fill valid metadata
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

    // 1. Add MCQ Question
    await addQuestionBtn.click();

    // Fill MCQ details
    await mcqTitleArea.fill('What is the capital of France?');
    await mcqTitleArea.blur();

    await mcqChoiceInputs.nth(0).fill('Paris');
    await mcqChoiceInputs.nth(1).fill('London');
    await mcqChoiceInputs.nth(0).blur();
    await mcqChoiceInputs.nth(1).blur();

    // Select Paris as correct choice
    await mcqRadios.nth(0).click({ force: true });

    // Set MCQ Marks to 3
    await mcqMarksInput.fill('3');
    await mcqMarksInput.blur();

    // 2. Add Essay Question
    await questionTypeSelect.click();
    await page.locator('.p-select-option').filter({ hasText: 'Essay' }).click();
    await addQuestionBtn.click();

    await essayTitleArea.fill('Explain polymorphism in Object-Oriented Programming.');
    await essayTitleArea.blur();

    await essayReferenceArea.fill(
      'Polymorphism is the ability of an object to take on many forms.',
    );
    await essayReferenceArea.blur();

    // Set Essay Marks to 2
    await essayMarksInput.fill('2');
    await essayMarksInput.blur();

    // 3. Add True/False Question
    await questionTypeSelect.click();
    await page.locator('.p-select-option').filter({ hasText: 'True/False' }).click();
    await addQuestionBtn.click();

    await tfTitleArea.fill('C# is an object-oriented programming language.');
    await tfTitleArea.blur();

    // Select True
    await tfRadios.nth(0).click({ force: true });

    // Set TF Marks to 1
    await tfMarksInput.fill('1');
    await tfMarksInput.blur();

    // Verify publish button is enabled (we have 3 questions, valid times, and title)
    await expect(publishBtn).toBeEnabled();

    // Set up a promise to wait for the POST request to **/quizzes
    const createQuizResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/quizzes') && response.request().method() === 'POST',
    );

    // Listen to window alert success dialog and accept it
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Quiz published successfully.');
      await dialog.accept();
    });

    await publishBtn.click();

    // Wait for the backend response and verify status is 200 or 201
    const createQuizResponse = await createQuizResponsePromise;
    expect([200, 201]).toContain(createQuizResponse.status());
  });
});
