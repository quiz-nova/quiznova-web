import AxeBuilder from '@axe-core/playwright';
import { expect, Page, test } from '@playwright/test';

import { SeededCredentials } from '../helpers/SeededCredentials';
import { LoginPage } from '../pages/login.page';

async function checkAccessibility(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

  const criticalViolations = results.violations.filter((v) => v.impact === 'critical');
  if (criticalViolations.length > 0) {
    console.error(
      'Critical accessibility violations found:',
      JSON.stringify(criticalViolations, null, 2),
    );
  }
  expect(criticalViolations).toHaveLength(0);
}

test.describe('Public Routes Accessibility', () => {
  const routes = ['/', '/auth/login', '/non-existent-route'];

  for (const route of routes) {
    test(`route "${route}" should have no critical accessibility violations`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await checkAccessibility(page);
    });
  }
});

test.describe('Student Routes Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(
      SeededCredentials.student.email,
      SeededCredentials.student.password,
      'Student',
    );
    await page.waitForURL(/\/student\/dashboard/);
  });

  const routes = [
    '/student/dashboard',
    '/student/my-courses',
    '/student/quizzes',
    '/student/results',
    '/student/course-chat',
    '/student/course-chat/00000000-0000-0000-0000-000000000000',
    '/student/quiz-attempt/00000000-0000-0000-0000-000000000000',
    '/student/review-quiz/00000000-0000-0000-0000-000000000000',
  ];

  for (const route of routes) {
    test(`route "${route}" should have no critical accessibility violations`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      // Wait a tiny bit extra for component initialization and potential redirects to settle
      await page.waitForTimeout(500);
      await checkAccessibility(page);
    });
  }
});

test.describe('Instructor Routes Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(
      SeededCredentials.instructor.email,
      SeededCredentials.instructor.password,
      'Instructor',
    );
    await page.waitForURL(/\/instructor\/dashboard/);
  });

  const routes = [
    '/instructor/dashboard',
    '/instructor/my-courses',
    '/instructor/create-quiz',
    '/instructor/grade',
    '/instructor/course-chat',
    '/instructor/course-chat/00000000-0000-0000-0000-000000000000',
    '/instructor/grade/00000000-0000-0000-0000-000000000000',
  ];

  for (const route of routes) {
    test(`route "${route}" should have no critical accessibility violations`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      await checkAccessibility(page);
    });
  }
});

test.describe('Admin Routes Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(SeededCredentials.admin.email, SeededCredentials.admin.password, 'Admin');
    await page.waitForURL(/\/admin\/dashboard/);
  });

  const routes = [
    '/admin/dashboard',
    '/admin/instructors',
    '/admin/students',
    '/admin/courses',
    '/admin/quizzes',
    '/admin/quiz-attempts',
    '/admin/admins',
  ];

  for (const route of routes) {
    test(`route "${route}" should have no critical accessibility violations`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      await checkAccessibility(page);
    });
  }
});
