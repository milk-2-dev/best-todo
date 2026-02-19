import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

// Load environment variables
if (!process.env.CI) {
  dotenv.config()
}

const PORT = process.env.PORT;
console.log(`Playwright Project_id is ${process.env.APPWRITE_PROJECT_ID} `)

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 15 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  /* Global teardown - cleanup test data after all tests */
  globalTeardown: "./global-teardown.ts",
  use: {
    baseURL: `http://localhost:${PORT}/`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // Firefox & WebKit only local
    // ...(!process.env.CI
    //   ? [
    //       { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    //       { name: "webkit", use: { ...devices["Desktop Safari"] } },
    //     ]
    //   : []),
  ],

  webServer: {
    command: process.env.CI ? "npm run start" : "npm run dev",
    port: Number(PORT),
    timeout: 60 * 1000,
    reuseExistingServer: true,
    stdout: "pipe",
    stderr: "pipe",
  },
});
