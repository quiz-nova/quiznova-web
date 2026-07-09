import { expect, type Locator, type Page, test } from '@playwright/test';

import { SeededCredentials } from '../helpers/SeededCredentials';
import { LoginPage } from '../pages/login.page';

async function login(
  page: Page,
  email: string,
  password: string,
  role: 'Student' | 'Instructor' | 'Admin',
): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.login(email, password, role);
}

test.describe('Login flow', () => {
  let emailInput: Locator;
  let passwordInput: Locator;
  let submitButton: Locator;
  let loginError: Locator;
  let emailRequiredError: Locator;
  let emailInvalidError: Locator;
  let passwordRequiredError: Locator;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto('/auth/login');
    emailInput = loginPage.emailInput;
    passwordInput = loginPage.passwordInput;
    submitButton = loginPage.submitButton;
    loginError = page.getByRole('alert');
    emailRequiredError = page.getByText('Email is required.');
    emailInvalidError = page.getByText('Please enter a valid email address.');
    passwordRequiredError = page.getByText('Password is required.');
  });

  test('should display the login page with all elements', async ({ page }) => {
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(page.locator('label.role-box:has-text("Student")')).toBeVisible();
    await expect(page.locator('label.role-box:has-text("Instructor")')).toBeVisible();
    await expect(page.locator('label.role-box:has-text("Admin")')).toBeVisible();
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeDisabled();

    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('should show field validation errors on empty submit', async () => {
    await emailInput.click();
    await passwordInput.click();
    await emailInput.blur();
    await passwordInput.blur();

    await expect(emailRequiredError).toBeVisible();
    await expect(passwordRequiredError).toBeVisible();
  });

  test('should show email format validation error', async () => {
    await emailInput.fill('not-an-email');
    await emailInput.blur();

    await expect(emailRequiredError).toBeHidden();
    await expect(emailInvalidError).toBeVisible();
  });

  test('should login successfully as Student', async ({ page }) => {
    await login(
      page,
      SeededCredentials.student.email,
      SeededCredentials.student.password,
      'Student',
    );
    await expect(page).toHaveURL(/\/student\/dashboard/);
  });

  test('should login successfully as Instructor', async ({ page }) => {
    await login(
      page,
      SeededCredentials.instructor.email,
      SeededCredentials.instructor.password,
      'Instructor',
    );
    await expect(page).toHaveURL(/\/instructor\/dashboard/);
  });

  test('should login successfully as Admin', async ({ page }) => {
    await login(page, SeededCredentials.admin.email, SeededCredentials.admin.password, 'Admin');
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test('should show error for wrong credentials', async ({ page }) => {
    await login(page, SeededCredentials.student.email, 'WrongPassword!', 'Student');
    await expect(loginError).toBeVisible();
    await expect(loginError).toContainText('The login information you entered is incorrect.');
  });

  test('should show error for role mismatch', async ({ page }) => {
    await login(page, SeededCredentials.student.email, SeededCredentials.student.password, 'Admin');
    await expect(loginError).toBeVisible();
    await expect(loginError).toContainText('The login information you entered is incorrect.');
  });

  test.describe('unauthorized route access', () => {
    test.describe('unauthenticated user', () => {
      for (const { path, label } of [
        { path: '/student/dashboard', label: 'student' },
        { path: '/instructor/dashboard', label: 'instructor' },
        { path: '/admin/dashboard', label: 'admin' },
      ] as const) {
        test(`should redirect to /auth/login when accessing ${label} route`, async ({ page }) => {
          await page.goto(path);
          await expect(page).toHaveURL(/\/auth\/login/);
        });
      }
    });

    test.describe('authenticated as Student', () => {
      test.beforeEach(async ({ page }) => {
        await login(
          page,
          SeededCredentials.student.email,
          SeededCredentials.student.password,
          'Student',
        );
        await page.waitForURL(/\/student\/dashboard/);
      });

      test('should redirect to student dashboard when navigating to /admin/dashboard', async ({
        page,
      }) => {
        await page.goto('/admin/dashboard');
        await expect(page).toHaveURL(/\/student\/dashboard/);
      });

      test('should redirect to student dashboard when navigating to /instructor/dashboard', async ({
        page,
      }) => {
        await page.goto('/instructor/dashboard');
        await expect(page).toHaveURL(/\/student\/dashboard/);
      });
    });

    test.describe('authenticated as Instructor', () => {
      test.beforeEach(async ({ page }) => {
        await login(
          page,
          SeededCredentials.instructor.email,
          SeededCredentials.instructor.password,
          'Instructor',
        );
        await page.waitForURL(/\/instructor\/dashboard/);
      });

      test('should redirect to instructor dashboard when navigating to /admin/dashboard', async ({
        page,
      }) => {
        await page.goto('/admin/dashboard');
        await expect(page).toHaveURL(/\/instructor\/dashboard/);
      });

      test('should redirect to instructor dashboard when navigating to /student/dashboard', async ({
        page,
      }) => {
        await page.goto('/student/dashboard');
        await expect(page).toHaveURL(/\/instructor\/dashboard/);
      });
    });

    test.describe('authenticated as Admin', () => {
      test.beforeEach(async ({ page }) => {
        await login(page, SeededCredentials.admin.email, SeededCredentials.admin.password, 'Admin');
        await page.waitForURL(/\/admin\/dashboard/);
      });

      test('should redirect to admin dashboard when navigating to /student/dashboard', async ({
        page,
      }) => {
        await page.goto('/student/dashboard');
        await expect(page).toHaveURL(/\/admin\/dashboard/);
      });

      test('should redirect to admin dashboard when navigating to /instructor/dashboard', async ({
        page,
      }) => {
        await page.goto('/instructor/dashboard');
        await expect(page).toHaveURL(/\/admin\/dashboard/);
      });
    });
  });
});
