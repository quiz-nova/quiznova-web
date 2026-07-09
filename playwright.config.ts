import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    deviceScaleFactor: 2,
    viewport: { width: 1920, height: 1080 },
    video:
      process.env['VIDEO'] === 'on' || process.env['CI']
        ? { mode: 'on', size: { width: 1920, height: 1080 } }
        : 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  ...(!process.env['CI']
    ? {
        webServer: {
          command:
            'bash -c "trap \\"docker compose --project-directory ../../ down -v\\" EXIT; docker compose --project-directory ../../ up --build --abort-on-container-exit db api client"',
          url: 'http://localhost:4200',
          reuseExistingServer: true,
          timeout: 120 * 1000,
        },
      }
    : {}),
});
