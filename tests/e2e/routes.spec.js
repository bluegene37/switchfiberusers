import { test, expect } from '@playwright/test'

const SITE_NAME = 'SwitchFiber - Public'

// Mirrors src/router/index.js. `heading` is false for views that lead with the
// registration wizard instead of an <h1>.
const ROUTES = [
  { path: '/', title: 'Home', heading: true },
  { path: '/about', title: 'About Us', heading: true },
  { path: '/plans', title: 'Fiber Plans & Pricing', heading: true },
  { path: '/coverage', title: 'Area Coverage in Rizal', heading: true },
  { path: '/contact', title: 'Contact Us', heading: true },
  { path: '/register', title: 'Apply Online', heading: false },
  { path: '/status', title: 'Track Application Status', heading: true },
  { path: '/pay-bills', title: 'Pay Bills', heading: true },
  { path: '/tech-support', title: 'Router & Wi-Fi Setup Guide', heading: true },
  { path: '/help', title: 'Help Center & User Guide', heading: true },
  { path: '/careers', title: 'Sales Agent Careers', heading: true }
]

for (const route of ROUTES) {
  test(`${route.path} renders without runtime errors`, async ({ page }) => {
    const pageErrors = []
    page.on('pageerror', err => pageErrors.push(err.message))

    await page.goto(route.path)

    await expect(page).toHaveTitle(`${SITE_NAME} | ${route.title}`)
    await expect(page.locator('#main-content')).toBeVisible()
    if (route.heading) {
      await expect(page.locator('h1').first()).toBeVisible()
    }
    expect(pageErrors, `uncaught errors on ${route.path}`).toEqual([])
  })
}

test('unknown URLs fall through to the not-found view', async ({ page }) => {
  await page.goto('/this-route-does-not-exist')

  await expect(page).toHaveTitle(`${SITE_NAME} | Page Not Found`)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
})

test('each route sets its own canonical URL and description', async ({ page }) => {
  await page.goto('/plans')

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/plans$/)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /Compare Switch Fiber plans/
  )
})
