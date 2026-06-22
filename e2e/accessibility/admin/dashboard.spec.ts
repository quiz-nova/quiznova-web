import { test } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth';
import { assertPageIsAccessible } from '../helpers/a11y';

test.describe('Admin Dashboard Accessibility', () => {
  test('Dashboard should be accessible', async ({ page }) => {
    await loginAsAdmin(page);
    await assertPageIsAccessible(page);
  });
});
