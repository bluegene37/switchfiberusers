import { test, expect } from '@playwright/test'

test.describe('desktop navigation', () => {
  // The main nav is hidden below lg; the mobile project covers the drawer.
  test.skip(({ isMobile }) => isMobile, 'desktop-only navigation bar')

  test('nav links move between views without a full page load', async ({ page }) => {
    await page.goto('/')

    const nav = page.locator('nav').first()
    await nav.getByRole('link', { name: 'Fiber Plans' }).click()
    await expect(page).toHaveURL(/\/plans$/)

    await nav.getByRole('link', { name: 'Contact Us' }).click()
    await expect(page).toHaveURL(/\/contact$/)

    // Client-side routing: the app never reloaded, so this marker survives.
    await page.evaluate(() => { window.__spaMarker = true })
    await nav.getByRole('link', { name: 'Home' }).click()
    await expect(page).toHaveURL(/\/$/)
    expect(await page.evaluate(() => window.__spaMarker)).toBe(true)
  })

  test('the Apply Online CTA opens the registration wizard', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Apply Online' }).first().click()
    await expect(page).toHaveURL(/\/register$/)
    await expect(page.locator('#main-content')).toBeVisible()
  })
})

test.describe('mobile navigation', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile-only drawer')

  test('the hamburger menu opens and routes', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: 'Toggle navigation menu' }).click()
    await page.getByRole('link', { name: 'Area Coverage' }).first().click()

    await expect(page).toHaveURL(/\/coverage$/)
  })
})

test('the theme toggle flips the dark class and persists across reloads', async ({ page, isMobile }) => {
  await page.goto('/')

  // The navbar renders two toggles; only one is mounted per breakpoint.
  const toggle = page.locator(isMobile ? '#theme-toggle-btn-mobile' : '#theme-toggle-btn')
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains('dark'))
  const before = await isDark()

  await toggle.click()
  await expect.poll(isDark).toBe(!before)

  await page.reload()
  expect(await isDark()).toBe(!before)
})
