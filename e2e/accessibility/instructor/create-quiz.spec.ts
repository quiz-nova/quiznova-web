import { test } from '@playwright/test';
import { loginAsInstructor } from '../helpers/auth';
import { assertPageIsAccessible } from '../helpers/a11y';

test.describe('Instructor Create Quiz Accessibility', () => {
  test('Create quiz screen should be accessible', async ({ page }) => {
    await loginAsInstructor(page);
    await page.goto('/instructor/create-quiz');
    await assertPageIsAccessible(page);
  });
});
