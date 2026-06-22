import AxeBuilder from '@axe-core/playwright';
import { Page, expect } from '@playwright/test';

export async function assertPageIsAccessible(
  page: Page,
  options: { include?: string; exclude?: string[] } = {}
) {
  // Wait for any lazy loading or rendering to complete
  await page.waitForLoadState('networkidle');

  let builder = new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);

  if (options.include) {
    builder = builder.include(options.include);
  }
  if (options.exclude) {
    builder = builder.exclude(options.exclude);
  }

  const results = await builder.analyze();
  expect(results.violations).toEqual([]);
}
