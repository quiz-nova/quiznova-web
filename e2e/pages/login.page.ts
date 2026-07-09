import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly roleBox: (role: string) => Locator;
  readonly submitButton: Locator;

  constructor(private page: Page) {
    this.emailInput = page.locator('#login-email');
    this.passwordInput = page.locator('#login-password');
    this.roleBox = (role: string) => page.locator('label.role-box').filter({ hasText: role });
    this.submitButton = page.locator('button.auth-submit');
  }

  async login(email: string, password: string, role: string): Promise<void> {
    await this.page.goto('/auth/login');
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.roleBox(role).click();
    await this.submitButton.click();
  }
}
