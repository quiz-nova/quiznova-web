import { test } from '@playwright/test';

import { assertPageIsAccessible } from '../helpers/a11y';
import { loginAsStudent } from '../helpers/auth';

test.describe('Student Quiz Attempt Accessibility', () => {
  test('Quiz attempt screen should be accessible', async ({ page }) => {
    const quizId = 'quiz-a11y-123';

    // Mock the quiz data endpoint
    await page.route(`**/quizzes/${quizId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          quizId: quizId,
          title: 'Accessibility Verification Quiz',
          courseName: 'Backend Fundamentals',
          instructorName: 'John Doe',
          marks: 5,
          startsAtUtc: new Date().toISOString(),
          endsAtUtc: new Date(Date.now() + 600000).toISOString(),
          serverUtc: new Date().toISOString(),
          state: 'Published',
          courseId: 'course-111',
          instructorId: 'instructor-222',
          questions: [
            {
              id: 'q1',
              quizId: quizId,
              questionText: 'Is accessibility testing automated or manual?',
              type: 'mcq',
              marks: 5,
              displayOrder: 1,
              correctChoiceId: 'c1',
              choices: [
                { id: 'c1', questionId: 'q1', text: 'Both', displayOrder: 1 },
                { id: 'c2', questionId: 'q1', text: 'Only automated', displayOrder: 2 },
              ],
            },
          ],
        }),
      });
    });

    await loginAsStudent(page);
    await page.goto(`/student/quiz-attempt/${quizId}`);
    await assertPageIsAccessible(page);
  });
});
