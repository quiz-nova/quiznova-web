import { test } from '@playwright/test';
import { loginAsStudent } from '../helpers/auth';
import { assertPageIsAccessible } from '../helpers/a11y';

test.describe('Student Dashboard Accessibility', () => {
  test('Dashboard should be accessible', async ({ page }) => {
    await loginAsStudent(page);
    await assertPageIsAccessible(page);
  });
});
