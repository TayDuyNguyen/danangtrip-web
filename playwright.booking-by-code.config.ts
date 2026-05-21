import { defineConfig, devices } from '@playwright/test';

/**
 * playwright.booking-by-code.config.ts
 *
 * Standalone config for user-booking-by-code E2E tests.
 * - Skips globalSetup (no real backend required).
 * - Uses pre-seeded mock auth-state.json for authenticated context.
 * - All API responses are mocked via page.route() inside the spec.
 */
export default defineConfig({
  testDir: './tests',
  testMatch: 'user-booking-by-code.spec.ts',
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 120000,
  outputDir: 'test-results/artifacts',

  // No globalSetup — auth-state.json is pre-seeded manually

  use: {
    baseURL: 'http://localhost:3000',
    storageState: 'test-results/auth-state.json',
    trace: 'off',
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
