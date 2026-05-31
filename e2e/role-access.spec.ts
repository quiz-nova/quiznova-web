import { test, expect } from '@playwright/test';

test.describe('Role-Based Access Guards (E2E)', () => {

  test.describe('Student Access Boundaries', () => {
    test.beforeEach(async ({ page }) => {
      // Log in as a Student
      await page.goto('/auth/login');
      await page.locator('#login-email').fill('student1@quiznova.local');
      await page.locator('#login-password').fill('Student123!');
      await page.locator('.role-box').filter({ hasText: 'Student' }).click();
      await page.locator('button.auth-submit').click();
      await expect(page).toHaveURL('/student/dashboard');
    });

    test('should redirect Student away from Admin Dashboard to Student Dashboard', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await expect(page).toHaveURL('/student/dashboard');
    });

    test('should redirect Student away from Instructor Dashboard to Student Dashboard', async ({ page }) => {
      await page.goto('/instructor/dashboard');
      await expect(page).toHaveURL('/student/dashboard');
    });
  });

  test.describe('Instructor Access Boundaries', () => {
    test.beforeEach(async ({ page }) => {
      // Log in as an Instructor
      await page.goto('/auth/login');
      await page.locator('#login-email').fill('instructor1@quiznova.local');
      await page.locator('#login-password').fill('Instructor123!');
      await page.locator('.role-box').filter({ hasText: 'Instructor' }).click();
      await page.locator('button.auth-submit').click();
      await expect(page).toHaveURL('/instructor/dashboard');
    });

    test('should redirect Instructor away from Admin Dashboard to Instructor Dashboard', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await expect(page).toHaveURL('/instructor/dashboard');
    });

    test('should redirect Instructor away from Student Dashboard to Instructor Dashboard', async ({ page }) => {
      await page.goto('/student/dashboard');
      await expect(page).toHaveURL('/instructor/dashboard');
    });
  });

  test.describe('Admin Access Boundaries', () => {
    test.beforeEach(async ({ page }) => {
      // Log in as an Admin
      await page.goto('/auth/login');
      await page.locator('#login-email').fill('admin@quiznova.local');
      await page.locator('#login-password').fill('Admin123!');
      await page.locator('.role-box').filter({ hasText: 'Admin' }).click();
      await page.locator('button.auth-submit').click();
      await expect(page).toHaveURL('/admin/dashboard');
    });

    test('should redirect Admin away from Student Dashboard to Admin Dashboard', async ({ page }) => {
      await page.goto('/student/dashboard');
      await expect(page).toHaveURL('/admin/dashboard');
    });

    test('should redirect Admin away from Instructor Dashboard to Admin Dashboard', async ({ page }) => {
      await page.goto('/instructor/dashboard');
      await expect(page).toHaveURL('/admin/dashboard');
    });
  });

  test.describe('Unauthenticated Access Boundaries', () => {
    test('should redirect anonymous user from Student routes to Login', async ({ page }) => {
      await page.goto('/student/dashboard');
      await expect(page).toHaveURL('/auth/login');
    });

    test('should redirect anonymous user from Instructor routes to Login', async ({ page }) => {
      await page.goto('/instructor/dashboard');
      await expect(page).toHaveURL('/auth/login');
    });

    test('should redirect anonymous user from Admin routes to Login', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await expect(page).toHaveURL('/auth/login');
    });
  });
});
