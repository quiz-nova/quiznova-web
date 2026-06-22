import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';
test.describe('Protected Pages Accessibility Audits', () => {
  test('Student Dashboard should be accessible', async ({ page }) => {
    // 1. Perform login
    await page.goto('/auth/login');
    await page.locator('#login-email').fill('student1@quiznova.local');
    await page.locator('#login-password').fill('Student123!');
    await page.locator('.role-box').filter({ hasText: 'Student' }).click();
    await page.locator('button.auth-submit').click();
    // 2. Wait for transition to the student dashboard
    await expect(page).toHaveURL('/student/dashboard');
    await page.waitForLoadState('networkidle');
    // 3. Perform the accessibility check on the active dashboard state
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });
  test('Instructor Dashboard should be accessible', async ({ page }) => {
    // 1. Perform login
    await page.goto('/auth/login');
    await page.locator('#login-email').fill('instructor1@quiznova.local');
    await page.locator('#login-password').fill('Instructor123!');
    await page.locator('.role-box').filter({ hasText: 'Instructor' }).click();
    await page.locator('button.auth-submit').click();
    // 2. Wait for transition
    await expect(page).toHaveURL('/instructor/dashboard');
    await page.waitForLoadState('networkidle');
    // 3. Run accessibility check
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });
});
