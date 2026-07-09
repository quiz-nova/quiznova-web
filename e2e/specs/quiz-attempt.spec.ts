import { test, expect, Page } from '@playwright/test';

import { SeededCredentials } from '../helpers/SeededCredentials';
import { ConfirmActionModalPage } from '../pages/confirm-action-modal.page';
import { CreateQuizPage } from '../pages/create-quiz.page';
import { LoginPage } from '../pages/login.page';
import { QuizAttemptPage } from '../pages/quiz-attempt.page';

async function createQuizViaUI(
  page: Page,
  title: string,
  questionTypes: {
    type: 'mcq' | 'tf' | 'essay';
    text: string;
    marks: string;
    choices?: string[];
    correctChoiceIndex?: number;
    correctTf?: boolean;
    expectedAnswer?: string;
  }[],
  startsInMinutes = 0,
  endsInMinutes = 30,
) {
  const loginPage = new LoginPage(page);
  await loginPage.login(
    SeededCredentials.instructor.email,
    SeededCredentials.instructor.password,
    'Instructor',
  );
  await expect(page).toHaveURL('/instructor/dashboard');

  const createQuizPage = new CreateQuizPage(page);
  const createResponsePromise = page.waitForResponse(
    (response) => response.url().includes('/quizzes') && response.request().method() === 'POST',
  );

  await createQuizPage.createQuizViaUI(title, questionTypes, startsInMinutes, endsInMinutes);

  await createResponsePromise;

  // Logout / Clear session
  await page.evaluate(() => localStorage.clear());
  await page.goto('/auth/login');
}

async function loginStudent(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.login(
    SeededCredentials.student.email,
    SeededCredentials.student.password,
    'Student',
  );
  await expect(page).toHaveURL('/student/dashboard');
}

test.describe('Quiz Attempt E2E & Gradual Submissions (Real Backend)', () => {
  let quizAttemptPage: QuizAttemptPage;

  test.beforeEach(async ({ page }) => {
    quizAttemptPage = new QuizAttemptPage(page);
  });

  test('Scenario 1 - Solve All MCQ-only quiz with gradual submissions', async ({ page }) => {
    const quizTitle = `E2E MCQ Quiz ${Date.now()}`;
    await createQuizViaUI(page, quizTitle, [
      {
        type: 'mcq',
        text: 'What is Playwright?',
        marks: '3',
        choices: ['Testing library', 'Game'],
        correctChoiceIndex: 0,
      },
    ]);

    await loginStudent(page);
    await page.waitForTimeout(15000);
    await quizAttemptPage.clickQuizzesTab();
    await expect(page).toHaveURL('/student/quizzes');

    await quizAttemptPage.startQuiz(quizTitle);
    await expect(quizAttemptPage.headerTitle).toContainText(quizTitle);

    // Answer and click "Save Answer" (gradual submission)
    await expect(quizAttemptPage.headerQuestionCount).toContainText('Question 0 of 1');
    await quizAttemptPage.answerCurrentQuestion('mcq');

    await quizAttemptPage.submitQuiz();

    await expect(quizAttemptPage.seeResultsButton).toBeVisible({ timeout: 20000 });
    await quizAttemptPage.seeResultsButton.click();
    await expect(page).toHaveURL('/student/results');
  });

  test('Scenario 1 - Solve only one TF-only quiz with gradual submissions', async ({ page }) => {
    const quizTitle = `E2E TF Quiz ${Date.now()}`;
    await createQuizViaUI(page, quizTitle, [
      { type: 'tf', text: 'Playwright is awesome?', marks: '2', correctTf: true },
      { type: 'tf', text: 'C# is dynamically typed?', marks: '2', correctTf: false },
    ]);

    await loginStudent(page);
    await page.waitForTimeout(15000);
    await quizAttemptPage.clickQuizzesTab();
    await quizAttemptPage.startQuiz(quizTitle);

    await expect(quizAttemptPage.headerQuestionCount).toContainText('Question 0 of 2');
    await quizAttemptPage.answerCurrentQuestion('tf');

    // Skip second question, just submit the quiz directly
    await quizAttemptPage.submitQuiz();
    await expect(quizAttemptPage.seeResultsButton).toBeVisible({ timeout: 20000 });
  });

  test('Scenario 1 - Solve nothing on Essay-only quiz', async ({ page }) => {
    const quizTitle = `E2E Essay Quiz ${Date.now()}`;
    await createQuizViaUI(page, quizTitle, [
      {
        type: 'essay',
        text: 'Explain E2E testing benefits.',
        marks: '5',
        expectedAnswer: 'Reliability and confidence',
      },
    ]);

    await loginStudent(page);
    await page.waitForTimeout(15000);
    await quizAttemptPage.clickQuizzesTab();
    await quizAttemptPage.startQuiz(quizTitle);

    // Submit directly without answering (solve nothing)
    await expect(quizAttemptPage.headerQuestionCount).toContainText('Question 0 of 1');
    await quizAttemptPage.submitQuiz();
    await expect(quizAttemptPage.seeResultsButton).toBeVisible({ timeout: 20000 });
  });

  test('Scenario 2 - Connection lost / Navigate away and Resume Quiz Attempt', async ({ page }) => {
    const quizTitle = `E2E Resume Quiz ${Date.now()}`;
    await createQuizViaUI(page, quizTitle, [
      {
        type: 'mcq',
        text: 'What is Playwright?',
        marks: '3',
        choices: ['Testing library', 'Game'],
        correctChoiceIndex: 0,
      },
      { type: 'tf', text: 'Playwright is awesome?', marks: '2', correctTf: true },
    ]);

    await loginStudent(page);
    await page.waitForTimeout(15000);
    await quizAttemptPage.clickQuizzesTab();
    await quizAttemptPage.startQuiz(quizTitle);

    await expect(quizAttemptPage.headerQuestionCount).toContainText('Question 0 of 2');
    await quizAttemptPage.answerCurrentQuestion('mcq');

    // Navigate back to quizzes list (Triggering CanDeactivate)
    await quizAttemptPage.clickQuizzesTab();
    const confirmModal = new ConfirmActionModalPage(page);
    await confirmModal.confirm('leave', 'I understand, leave');

    // Now we are back in Quizzes tab. The button should be "Continue"
    await expect(page).toHaveURL('/student/quizzes');
    await quizAttemptPage.continueQuiz(quizTitle);

    // Check we navigated back to attempt page and query param contains attemptId
    await expect(page).toHaveURL(new RegExp(`/student/quiz-attempt/`));
    await expect(page.url()).toContain('attemptId=');

    await quizAttemptPage.nextButton.click();
    await expect(quizAttemptPage.headerQuestionCount).toContainText('Question 1 of 2');
    await quizAttemptPage.answerCurrentQuestion('tf');

    await quizAttemptPage.submitQuiz();
    await expect(quizAttemptPage.seeResultsButton).toBeVisible({ timeout: 20000 });
  });

  test('Scenario 3 - Prevention of double attempts', async ({ page }) => {
    const quizTitle = `E2E Double Quiz ${Date.now()}`;
    await createQuizViaUI(page, quizTitle, [
      {
        type: 'mcq',
        text: 'Question 1',
        marks: '3',
        choices: ['Choice A', 'Choice B'],
        correctChoiceIndex: 0,
      },
    ]);

    await loginStudent(page);
    await page.waitForTimeout(15000);
    await quizAttemptPage.clickQuizzesTab();
    await quizAttemptPage.startQuiz(quizTitle);

    // Wait for the quiz attempt page to fully load to prevent CanDeactivate check from evaluating early
    await expect(quizAttemptPage.headerQuestionCount).toContainText('Question 0 of 1');
    await page.waitForTimeout(1000);

    const attemptUrl = page.url();
    const match = attemptUrl.match(/\/student\/quiz-attempt\/([a-fA-F0-9-]+)/);
    const quizId = match ? match[1] : '';

    await quizAttemptPage.clickQuizzesTab();
    const confirmModal = new ConfirmActionModalPage(page);
    await confirmModal.confirm('leave', 'I understand, leave');

    // Try to navigate directly to the quiz attempt page without passing an attemptId
    await page.goto(`/student/quiz-attempt/${quizId}`);

    // Verify it fails to start and shows the operation-failed component containing the error message
    await expect(quizAttemptPage.operationFailed).toBeVisible();
    await expect(quizAttemptPage.operationFailed).toContainText(/already has an attempt/i);
  });

  test('Scenario 4 - Expiration and auto-submission on timeout', async ({ page }) => {
    const quizTitle = `Expiring Quiz ${Date.now()}`;

    // Create a quiz with a 12-minute duration (starts now, ends in 12 minutes)
    await createQuizViaUI(
      page,
      quizTitle,
      [
        {
          type: 'mcq',
          text: 'Question 1',
          marks: '3',
          choices: ['Choice A', 'Choice B'],
          correctChoiceIndex: 0,
        },
      ],
      0,
      12,
    );

    await loginStudent(page);
    await page.waitForTimeout(15000);
    await quizAttemptPage.clickQuizzesTab();
    await quizAttemptPage.startQuiz(quizTitle);

    await expect(quizAttemptPage.headerTitle).toContainText(quizTitle);

    // Install mock clock after the page is loaded and stable
    await page.clock.install();

    // Fast forward by 12 minutes and 10 seconds to trigger expiration
    await page.clock.fastForward(730000);

    // Verify that the submit PUT endpoint was triggered and the save button is disabled
    await expect(quizAttemptPage.saveAnswerButton).toBeDisabled();
  });
});
