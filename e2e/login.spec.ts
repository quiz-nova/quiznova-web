import { test, expect } from '@playwright/test';

test.describe('Authentication - Real Integration E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
  });

  test('should successfully log in as an Instructor and redirect to /instructor/dashboard', async ({
    page,
  }) => {
    await page.locator('#login-email').fill('instructor1@quiznova.local');
    await page.locator('#login-password').fill('Instructor123!');

    await page.locator('.role-box').filter({ hasText: 'Instructor' }).click();

    await page.locator('button.auth-submit').click();

    await expect(page).toHaveURL('/instructor/dashboard');

    const token = await page.evaluate(() => localStorage.getItem('access_token'));
    const storedUser = await page.evaluate(() => localStorage.getItem('current_user'));
    expect(token).toBeTruthy();

    // This is the UserDto in the backend and the auth.service.ts saves it in the browser
    const parsedUser = JSON.parse(storedUser || '{}');
    expect(parsedUser.role).toBe('instructor');
    expect(parsedUser.name).toBe('Instructor One');
  });

  test('should successfully log in as a Student and redirect to /student/dashboard', async ({
    page,
  }) => {
    await page.locator('#login-email').fill('student1@quiznova.local');
    await page.locator('#login-password').fill('Student123!');
    await page.locator('.role-box').filter({ hasText: 'Student' }).click();
    await page.locator('button.auth-submit').click();

    await expect(page).toHaveURL('/student/dashboard');
  });

  test('should successfully log in as an Admin and redirect to /admin/dashboard', async ({
    page,
  }) => {
    await page.locator('#login-email').fill('admin@quiznova.local');
    await page.locator('#login-password').fill('Admin123!');
    await page.locator('.role-box').filter({ hasText: 'Admin' }).click();
    await page.locator('button.auth-submit').click();

    await expect(page).toHaveURL('/admin/dashboard');
  });

  test('should show validation/incorrect login error on invalid credentials', async ({ page }) => {
    await page.locator('#login-email').fill('instructor1@quiznova.local');
    await page.locator('#login-password').fill('WrongPassword!');
    await page.locator('.role-box').filter({ hasText: 'Instructor' }).click();
    await page.locator('button.auth-submit').click();

    const alert = page.locator('.login-failed');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('The login information you entered is incorrect.');
  });

  test('should show error when logging in with a role mismatch', async ({ page }) => {
    await page.locator('#login-email').fill('student1@quiznova.local');
    await page.locator('#login-password').fill('Student123!');
    await page.locator('.role-box').filter({ hasText: 'Admin' }).click();
    await page.locator('button.auth-submit').click();

    const alert = page.locator('.login-failed');
    await expect(alert).toBeVisible();
  });
});

test.describe('Authentication - Mocked Network E2E (Fast & Decoupled)', () => {
  // These tests mock the HTTP layer completely, allowing front-end layout,
  // form submission states, and routing logic to be tested offline or in fast CI/CD.

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
  });

  test('should mock successful student login and transition page correctly', async ({ page }) => {
    // Mock the backend auth endpoint
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: {
            accessToken: 'mocked-jwt-token-xyz',
          },
          user: {
            id: 'mocked-id-123',
            name: 'Mocked Student',
            email: 'student-mock@quiznova.local',
            phoneNumber: '01000000000',
            role: 'student',
          },
        }),
      });
    });

    await page.locator('#login-email').fill('student-mock@quiznova.local');
    await page.locator('#login-password').fill('AnyPassword!');
    await page.locator('.role-box').filter({ hasText: 'Student' }).click();
    await page.locator('button.auth-submit').click();

    await expect(page).toHaveURL('/student/dashboard');
  });

  test('should mock backend internal server failure gracefully', async ({ page }) => {
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.locator('#login-email').fill('student-mock@quiznova.local');
    await page.locator('#login-password').fill('AnyPassword!');
    await page.locator('.role-box').filter({ hasText: 'Student' }).click();
    await page.locator('button.auth-submit').click();

    const alert = page.locator('.login-failed');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('The login information you entered is incorrect.');
  });
});
