import { defineConfig, devices } from '@playwright/test'

// End-to-end browser tests. `npm test` (node:test) still owns the unit and
// integration suites in tests/*.test.js — Playwright only picks up tests/e2e/.
//
// By default the config boots the Vite dev server on :3000 itself. Point
// E2E_BASE_URL at a running instance (staging, a preview deploy, an already
// open `npm run dev`) to test that instead and skip the managed server.
const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000'
const usesExternalServer = Boolean(process.env.E2E_BASE_URL)

export default defineConfig({
  testDir: './tests/e2e',
  // Vite dev + lazy route chunks make the first navigation of a run slow.
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : [['list']],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      // Same Chromium binary, phone viewport — the nav collapses below md.
      name: 'mobile',
      use: { ...devices['Pixel 7'] }
    }
  ],

  webServer: usesExternalServer
    ? undefined
    : {
        command: 'npm run dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stdout: 'ignore',
        stderr: 'pipe'
      }
})
