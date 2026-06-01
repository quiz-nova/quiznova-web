import { test, expect, type Locator } from '@playwright/test';

test.describe('Authentication - Real Integration E2E', () => {
  let emailInput: Locator;
  let passwordInput: Locator;
  let roleBox: Locator;
  let submitButton: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    emailInput = page.locator('#login-email');
    passwordInput = page.locator('#login-password');
    roleBox = page.locator('.role-box');
    submitButton = page.locator('button.auth-submit');
  });

  test('should successfully log in as an Instructor and redirect to /instructor/dashboard', async ({
    page,
  }) => {
    await emailInput.fill('instructor1@quiznova.local');
    await passwordInput.fill('Instructor123!');

    await roleBox.filter({ hasText: 'Instructor' }).click();

    await submitButton.click();

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
    await emailInput.fill('student1@quiznova.local');
    await passwordInput.fill('Student123!');
    await roleBox.filter({ hasText: 'Student' }).click();
    await submitButton.click();

    await expect(page).toHaveURL('/student/dashboard');
  });

  test('should successfully log in as an Admin and redirect to /admin/dashboard', async ({
    page,
  }) => {
    await emailInput.fill('admin@quiznova.local');
    await passwordInput.fill('Admin123!');
    await roleBox.filter({ hasText: 'Admin' }).click();
    await submitButton.click();

    await expect(page).toHaveURL('/admin/dashboard');
  });

  test('should show validation/incorrect login error on invalid credentials', async ({ page }) => {
    await emailInput.fill('instructor1@quiznova.local');
    await passwordInput.fill('WrongPassword!');
    await roleBox.filter({ hasText: 'Instructor' }).click();
    await submitButton.click();

    const alert = page.locator('.login-failed');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('The login information you entered is incorrect.');
  });

  test('should show error when logging in with a role mismatch', async ({ page }) => {
    await emailInput.fill('student1@quiznova.local');
    await passwordInput.fill('Student123!');
    await roleBox.filter({ hasText: 'Admin' }).click();
    await submitButton.click();

    const alert = page.locator('.login-failed');
    await expect(alert).toBeVisible();
  });
});

test.describe('Authentication - Mocked Network E2E (Fast & Decoupled)', () => {
  // These tests mock the HTTP layer completely, allowing front-end layout,
  // form submission states, and routing logic to be tested offline or in fast CI/CD.
  let emailInput: Locator;
  let passwordInput: Locator;
  let roleBox: Locator;
  let submitButton: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    emailInput = page.locator('#login-email');
    passwordInput = page.locator('#login-password');
    roleBox = page.locator('.role-box');
    submitButton = page.locator('button.auth-submit');
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

    await emailInput.fill('student-mock@quiznova.local');
    await passwordInput.fill('AnyPassword!');
    await roleBox.filter({ hasText: 'Student' }).click();
    await submitButton.click();

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

    await emailInput.fill('student-mock@quiznova.local');
    await passwordInput.fill('AnyPassword!');
    await roleBox.filter({ hasText: 'Student' }).click();
    await submitButton.click();

    const alert = page.locator('.login-failed');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('The login information you entered is incorrect.');
  });
});
