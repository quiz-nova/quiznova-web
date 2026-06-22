import { test } from '@playwright/test';
import { loginAsInstructor } from '../helpers/auth';
import { assertPageIsAccessible } from '../helpers/a11y';

test.describe('Instructor Dashboard Accessibility', () => {
  test('Dashboard should be accessible', async ({ page }) => {
    await loginAsInstructor(page);
    await assertPageIsAccessible(page);
  });
});
