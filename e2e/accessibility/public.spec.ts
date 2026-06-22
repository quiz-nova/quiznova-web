import { test } from '@playwright/test';

import { assertPageIsAccessible } from './helpers/a11y';

const PUBLIC_ROUTES = ['/', '/auth/login'];

test.describe('Public Pages Accessibility Audits', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`Route "${route}" should have no accessibility violations`, async ({ page }) => {
      await page.goto(route);
      await assertPageIsAccessible(page);
    });
  }
});
