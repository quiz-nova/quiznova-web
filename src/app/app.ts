import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { APP_SETTINGS } from '@Core/config/app.settings';
import { TranslateService } from '@ngx-translate/core';
import * as Sentry from '@sentry/angular';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
@Component({
  selector: 'qn-app',
  imports: [RouterOutlet, Toast, Button],
  templateUrl: './app.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly translate = inject(TranslateService);
  protected readonly isProduction = this.appSettings.isProduction;
  protected readonly title = signal(this.appSettings.appName);
  ngOnInit(): void {
    this.translate.use('en');
  }
  changeLanguage(lang: string): void {
    this.translate.use(lang);
  }

  public throwTestError(): void {
    if (this.isProduction) {
      return;
    }
    // Send a log before throwing the error
    Sentry.logger.info(Sentry.logger.fmt`User ${'sentry-test'} triggered test error button`, {
      action: 'test_error_button_click',
    });
    // Send a test metric before throwing the error
    Sentry.metrics.count('test_counter', 1);
    throw new Error('Sentry Test Error');
  }
}
