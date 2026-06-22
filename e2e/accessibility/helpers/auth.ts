import { Page, expect } from '@playwright/test';

async function performLogin(
  page: Page,
  email: string,
  password: string,
  role: 'Student' | 'Instructor' | 'Admin',
  redirectUrl: string,
) {
  await page.goto('/auth/login');
  await page.locator('#login-email').fill(email);
  await page.locator('#login-password').fill(password);
  await page.locator('.role-box').filter({ hasText: role }).click();
  await page.locator('button.auth-submit').click();
  await expect(page).toHaveURL(redirectUrl);
}

export async function loginAsStudent(page: Page) {
  await performLogin(
    page,
    'student1@quiznova.local',
    'Student123!',
    'Student',
    '/student/dashboard',
  );
}

export async function loginAsInstructor(page: Page) {
  await performLogin(
    page,
    'instructor1@quiznova.local',
    'Instructor123!',
    'Instructor',
    '/instructor/dashboard',
  );
}

export async function loginAsAdmin(page: Page) {
  await performLogin(page, 'admin@quiznova.local', 'Admin123!', 'Admin', '/admin/dashboard');
}
