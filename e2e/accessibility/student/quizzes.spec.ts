import { test } from '@playwright/test';
import { loginAsStudent } from '../helpers/auth';
import { assertPageIsAccessible } from '../helpers/a11y';

test.describe('Student Quizzes Page Accessibility', () => {
  test('Quizzes list should be accessible', async ({ page }) => {
    await loginAsStudent(page);
    await page.goto('/student/quizzes');
    await assertPageIsAccessible(page);
  });
});
