import { Locator, Page, expect } from '@playwright/test';

export class ConfirmActionModalPage {
  readonly modal: Locator;
  readonly confirmInput: Locator;
  readonly confirmButton: (text: string) => Locator;

  constructor(private page: Page) {
    this.modal = page.locator('.modal-backdrop');
    this.confirmInput = page.locator('#confirm-action-input, .modal-confirm-input');
    this.confirmButton = (text: string) =>
      page.locator('.modal-actions button').filter({ hasText: text });
  }

  async confirm(phrase: string, buttonText: string): Promise<void> {
    await expect(this.modal).toBeVisible();
    await this.confirmInput.fill(phrase);
    await this.confirmButton(buttonText).click();
    await expect(this.modal).not.toBeVisible();
  }

  async cancel(): Promise<void> {
    await expect(this.modal).toBeVisible();
    await this.confirmButton('Cancel').click();
    await expect(this.modal).not.toBeVisible();
  }
}
