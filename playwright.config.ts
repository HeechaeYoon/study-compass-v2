import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173";
const useExternalServer = Boolean(process.env.PLAYWRIGHT_BASE_URL);
const enableWebKit = process.env.ENABLE_WEBKIT === "true";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: false,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    locale: "ko-KR",
    timezoneId: "Asia/Seoul",
    colorScheme: "light",
    deviceScaleFactor: 1,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  ...(useExternalServer
    ? {}
    : {
      webServer: {
        command:
          "MASTER_CODE=development-master-code VITE_ENABLE_FIXTURES=true npm run build && npm run preview -- --host 127.0.0.1",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
    }),
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    ...(enableWebKit
      ? [
          {
            name: "webkit",
            testMatch: /e2e\/.*\.spec\.ts/,
            use: { ...devices["Desktop Safari"] },
          },
        ]
      : []),
  ],
});
