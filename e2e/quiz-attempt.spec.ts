import { test, expect, Page, Locator } from '@playwright/test';

class QuizAttemptPage {
  readonly headerTitle: Locator;
  readonly headerQuestionCount: Locator;
  readonly submitButton: Locator;
  readonly essayTextareas: Locator;

  constructor(private page: Page) {
    this.headerTitle = page.locator('app-quiz-attempt-header h1');
    this.headerQuestionCount = page.locator('app-quiz-attempt-header p');
    this.submitButton = page.locator('button[appButton]');
    this.essayTextareas = page.locator('app-essay-form textarea');
  }

  optionButton(text: string): Locator {
    return this.page.locator('button.option').filter({ hasText: text });
  }
}

test.describe('Quiz Attempt E2E & Countdown', () => {
  let quizAttemptPage: QuizAttemptPage;

  test.beforeEach(async ({ page }) => {
    quizAttemptPage = new QuizAttemptPage(page);

    // 1. Mock authentication state/login redirect
    await page.goto('/auth/login');
    await page.locator('#login-email').fill('student1@quiznova.local');
    await page.locator('#login-password').fill('Student123!');
    await page.locator('.role-box').filter({ hasText: 'Student' }).click();

    await page.route(`**/students/*/quiz-attempts`, async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: '{}',
      });
    });

    await page.locator('button.auth-submit').click();
    await expect(page).toHaveURL('/student/dashboard');
  });

  test('should load, attempt, and submit an auto-only graded quiz (3 auto questions)', async ({
    page,
  }) => {
    const quizId = 'quiz-auto-123';
    const endsAt = new Date();
    endsAt.setMinutes(endsAt.getMinutes() + 10);

    // Mock GET response for auto-only quiz
    await page.route(`**/quizzes/${quizId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          quizId: quizId,
          title: 'Auto-Graded Only Quiz',
          courseName: 'Backend Fundamentals',
          instructorName: 'John Doe',
          marks: 8,
          startsAtUtc: new Date().toISOString(),
          endsAtUtc: endsAt.toISOString(),
          serverUtc: new Date().toISOString(),
          state: 'Published',
          courseId: 'course-111',
          instructorId: 'instructor-222',
          questions: [
            {
              id: 'q1',
              quizId: quizId,
              questionText: 'Is TypeScript type-safe?',
              type: 'tf',
              marks: 2,
              displayOrder: 1,
              correctChoice: true,
            },
            {
              id: 'q2',
              quizId: quizId,
              questionText: 'What is 2 + 2?',
              type: 'mcq',
              marks: 3,
              displayOrder: 2,
              correctChoiceId: 'c2',
              choices: [
                { id: 'c1', questionId: 'q2', text: '3', displayOrder: 1 },
                { id: 'c2', questionId: 'q2', text: '4', displayOrder: 2 },
              ],
            },
            {
              id: 'q3',
              quizId: quizId,
              questionText: 'Which language is used for browser scripting?',
              type: 'mcq',
              marks: 3,
              displayOrder: 3,
              correctChoiceId: 'c4',
              choices: [
                { id: 'c3', questionId: 'q3', text: 'Python', displayOrder: 1 },
                { id: 'c4', questionId: 'q3', text: 'JavaScript', displayOrder: 2 },
              ],
            },
          ],
        }),
      });
    });

    await page.goto(`/student/quiz-attempt/${quizId}`);

    // Verify title and question count
    await expect(quizAttemptPage.headerTitle).toContainText('Auto-Graded Only Quiz');
    await expect(quizAttemptPage.headerQuestionCount).toContainText('Question 0 of 3');

    // Solve Question 1 (True/False)
    await quizAttemptPage.optionButton('True').click();

    // Solve Question 2 (MCQ) - Option 4
    await quizAttemptPage.optionButton('4').click();

    // Solve Question 3 (MCQ) - Option JavaScript
    await quizAttemptPage.optionButton('JavaScript').click();

    // Submit the quiz
    await expect(quizAttemptPage.submitButton).toBeEnabled();
    await quizAttemptPage.submitButton.click();
  });

  test('should load, attempt, and submit a manual-only graded quiz (3 manual essay questions)', async ({
    page,
  }) => {
    const quizId = 'quiz-manual-123';
    const endsAt = new Date();
    endsAt.setMinutes(endsAt.getMinutes() + 10);

    // Mock GET response for manual-only quiz
    await page.route(`**/quizzes/${quizId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          quizId: quizId,
          title: 'Manually-Graded Only Quiz',
          courseName: 'System Design',
          instructorName: 'Alice Smith',
          marks: 15,
          startsAtUtc: new Date().toISOString(),
          endsAtUtc: endsAt.toISOString(),
          serverUtc: new Date().toISOString(),
          state: 'Published',
          courseId: 'course-222',
          instructorId: 'instructor-333',
          questions: [
            {
              id: 'q1',
              quizId: quizId,
              questionText: 'Explain polymorphism in OOP.',
              type: 'essay',
              marks: 5,
              displayOrder: 1,
              answerReference:
                'Polymorphism allows objects of different classes to be treated as objects of a common superclass.',
            },
            {
              id: 'q2',
              quizId: quizId,
              questionText: 'Describe MVC architecture.',
              type: 'essay',
              marks: 5,
              displayOrder: 2,
              answerReference: 'MVC divides an application into Model, View, and Controller.',
            },
            {
              id: 'q3',
              quizId: quizId,
              questionText: 'What is Dependency Injection?',
              type: 'essay',
              marks: 5,
              displayOrder: 3,
              answerReference:
                'Dependency Injection is a technique for achieving Inversion of Control (IoC).',
            },
          ],
        }),
      });
    });

    await page.goto(`/student/quiz-attempt/${quizId}`);

    // Verify title and question count
    await expect(quizAttemptPage.headerTitle).toContainText('Manually-Graded Only Quiz');
    await expect(quizAttemptPage.headerQuestionCount).toContainText('Question 0 of 3');

    // Solve Essay Questions by typing in textareas
    await expect(quizAttemptPage.essayTextareas).toHaveCount(3);
    await quizAttemptPage.essayTextareas.nth(0).fill('Polymorphism is many forms.');
    await quizAttemptPage.essayTextareas.nth(1).fill('MVC stands for Model View Controller.');
    await quizAttemptPage.essayTextareas.nth(2).fill('DI helps inject dependencies.');

    // Submit the quiz
    await expect(quizAttemptPage.submitButton).toBeEnabled();
    await quizAttemptPage.submitButton.click();
  });

  test('should load, attempt, and submit a hybrid quiz (1 MCQ, 1 TF, 1 Essay)', async ({
    page,
  }) => {
    const quizId = 'quiz-hybrid-123';
    const endsAt = new Date();
    endsAt.setMinutes(endsAt.getMinutes() + 10);

    // Mock GET response for hybrid quiz
    await page.route(`**/quizzes/${quizId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          quizId: quizId,
          title: 'Hybrid Graded Quiz',
          courseName: 'Backend Fundamentals',
          instructorName: 'John Doe',
          marks: 10,
          startsAtUtc: new Date().toISOString(),
          endsAtUtc: endsAt.toISOString(),
          serverUtc: new Date().toISOString(),
          state: 'Published',
          courseId: 'course-111',
          instructorId: 'instructor-222',
          questions: [
            {
              id: 'q1',
              quizId: quizId,
              questionText: 'What is 2 + 2?',
              type: 'mcq',
              marks: 3,
              displayOrder: 1,
              correctChoiceId: 'c2',
              choices: [
                { id: 'c1', questionId: 'q1', text: '3', displayOrder: 1 },
                { id: 'c2', questionId: 'q1', text: '4', displayOrder: 2 },
              ],
            },
            {
              id: 'q2',
              quizId: quizId,
              questionText: 'Is TypeScript type-safe?',
              type: 'tf',
              marks: 2,
              displayOrder: 2,
              correctChoice: true,
            },
            {
              id: 'q3',
              quizId: quizId,
              questionText: 'Explain polymorphism in OOP.',
              type: 'essay',
              marks: 5,
              displayOrder: 3,
              answerReference:
                'Polymorphism allows objects to be treated as instances of their parent class.',
            },
          ],
        }),
      });
    });

    await page.goto(`/student/quiz-attempt/${quizId}`);

    // Verify title and question count
    await expect(quizAttemptPage.headerTitle).toContainText('Hybrid Graded Quiz');
    await expect(quizAttemptPage.headerQuestionCount).toContainText('Question 0 of 3');

    // Solve MCQ (Question 1)
    await quizAttemptPage.optionButton('4').click();

    // Solve TF (Question 2)
    await quizAttemptPage.optionButton('True').click();

    // Solve Essay (Question 3)
    await quizAttemptPage.essayTextareas.first().fill('OOP polymorphism explanation.');

    // Submit the quiz
    await expect(quizAttemptPage.submitButton).toBeEnabled();
    await quizAttemptPage.submitButton.click();
  });

  test('should submit automatically when the quiz countdown times out (Hybrid Quiz)', async ({
    page,
  }) => {
    const quizId = 'quiz-timeout-123';
    // Mock quiz with a very short remaining time (3 seconds)
    await page.route(`**/quizzes/${quizId}`, async (route) => {
      const endsAt = new Date();
      endsAt.setSeconds(endsAt.getSeconds() + 3);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          quizId: quizId,
          title: 'Timeout Hybrid Quiz',
          courseName: 'Backend Fundamentals',
          instructorName: 'John Doe',
          marks: 10,
          startsAtUtc: new Date().toISOString(),
          endsAtUtc: endsAt.toISOString(),
          serverUtc: new Date().toISOString(),
          state: 'Published',
          courseId: 'course-111',
          instructorId: 'instructor-222',
          questions: [
            {
              id: 'q1',
              quizId: quizId,
              questionText: 'Is TypeScript type-safe?',
              type: 'tf',
              marks: 2,
              displayOrder: 1,
              correctChoice: true,
            },
            {
              id: 'q2',
              quizId: quizId,
              questionText: 'What is 2 + 2?',
              type: 'mcq',
              marks: 3,
              displayOrder: 2,
              correctChoiceId: 'c2',
              choices: [
                { id: 'c1', questionId: 'q2', text: '3', displayOrder: 1 },
                { id: 'c2', questionId: 'q2', text: '4', displayOrder: 2 },
              ],
            },
            {
              id: 'q3',
              quizId: quizId,
              questionText: 'Explain polymorphism in OOP.',
              type: 'essay',
              marks: 5,
              displayOrder: 3,
              answerReference: 'Polymorphism allows OOP objects to take multiple forms.',
            },
          ],
        }),
      });
    });

    let autoSubmitCalled = false;
    await page.route(`**/students/*/quiz-attempts`, async (route) => {
      autoSubmitCalled = true;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: '{}',
      });
    });

    // Go to quiz attempt
    await page.goto(`/student/quiz-attempt/${quizId}`);

    // Wait for the timer to reach 00:00 (approx 3.5s)
    await page.waitForTimeout(4000);

    // Verify automatic submission triggered by store effect
    expect(autoSubmitCalled).toBe(true);
  });
});
