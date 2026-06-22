import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';
const PUBLIC_ROUTES = ['/', '/auth/login'];
test.describe('Public Pages Accessibility Audits', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`Route "${route}" should have no accessibility violations`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
