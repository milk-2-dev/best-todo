import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: "./.env.test" });

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"]],
  /* Global teardown - cleanup test data after all tests */
  globalTeardown: "./global-teardown.ts",
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:5173",
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
    ...(!process.env.CI
      ? [
          { name: "firefox", use: { ...devices["Desktop Firefox"] } },
          { name: "webkit", use: { ...devices["Desktop Safari"] } },
        ]
      : []),
  ],

  webServer: {
    // command: "npm run dev",
    // url: "http://localhost:5173",
    // reuseExistingServer: !process.env.CI,
    command: "npm run start",
    timeout: 120 * 1000,
  },
});
