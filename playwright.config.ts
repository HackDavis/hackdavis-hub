// import { defineConfig, devices } from '@playwright/test';
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
// import { fileURLToPath } from 'url';

// Read from ".env" file.
dotenv.config({ path: path.resolve(__dirname, '.env') });

// export const STORAGE_STATE = path.join(
//   path.dirname(fileURLToPath(import.meta.url)),
//   'playwright/.auth/user.json'
// );
// console.log(devices);
// https://playwright.dev/docs/test-configuration.
export default defineConfig({
  testDir: './tests',
  // testMatch: '*tests/**/*.spec.ts',
  /* Run tests in files in parallel */
  // fullyParallel: true,

  // TODO: CI test run configs
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  // forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  // retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: process.env.CI ? 'dot' : 'list',

  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
    },
    {
      name: 'integration tests: API and database',
      testMatch: '**/*db.spec.ts',
      dependencies: ['setup'],
    },
    {
      name: 'integration tests: UI and server actions',
      testMatch: '**/*actions.spec.ts',
      dependencies: ['setup'],
    },
  ],

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
  },

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
  },
});
