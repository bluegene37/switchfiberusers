import { test, expect } from '@playwright/test'

test.describe('Customer Concern & Complaint Submission Flow', () => {
  test('displays Service and Ticketing support area on /contact route', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('#concern-form')).toBeVisible()
    await expect(page.locator('a[href="#concern-form"]')).toBeVisible()
  })

  test('displays only email input for subscriber intake, keeping other info hidden', async ({ page }) => {
    await page.goto('/contact')

    // Click hero shortcut
    const cta = page.locator('a[href="#concern-form"]').first()
    await expect(cta).toBeVisible()
    await cta.click()

    // Verify form container is present
    const formSection = page.locator('#concern-form')
    await expect(formSection).toBeVisible()

    // Verify Subscriber Email is visible and prominent
    await expect(page.locator('#sf-email')).toBeVisible()

    // Verify old design fields are completely removed from the DOM
    await expect(page.locator('#sf-account-lookup')).toHaveCount(0)
    await expect(page.locator('#sf-fullname')).toHaveCount(0)
    await expect(page.locator('#sf-contact')).toHaveCount(0)
    await expect(page.locator('#sf-address')).toHaveCount(0)
    await expect(page.locator('#sf-category')).toHaveCount(0)
    await expect(page.locator('#sf-details')).toHaveCount(0)
  })

  test('validates subscriber email before submitting', async ({ page }) => {
    await page.goto('/contact')

    // Attempt submission with blank email
    const submitBtn = page.locator('button[type="submit"]')
    await submitBtn.click()

    // HTML5 or JS validation prevents blank submission
    const alertOrInvalid = await page.evaluate(() => {
      const emailInput = document.querySelector('#sf-email')
      return emailInput && !emailInput.checkValidity()
    })
    expect(alertOrInvalid).toBe(true)
  })

  test('flags numeric input in email field with account/phone warning and prevents submission', async ({ page }) => {
    await page.goto('/contact')

    const emailInput = page.locator('#sf-email')
    // Type numbers (account number or phone number)
    await emailInput.fill('202311373')

    // Verify inline real-time error appears specifically explaining it looks like an account/phone number
    await expect(page.locator('text=This looks like an account or phone number')).toBeVisible()

    // Submit form
    await page.click('button[type="submit"]')

    // Confirm that the obsolete error message demanding Full Name or Account Number does NOT appear
    await expect(page.locator('text=Please provide your Full Name or Account Number')).toBeHidden()
    await expect(page.locator('text=Full name or Account Number is required')).toBeHidden()
  })

  test('displays exactly one unified error message when email is invalid and never duplicate messages', async ({ page }) => {
    await page.goto('/contact')

    const emailInput = page.locator('#sf-email')
    // Type email without @
    await emailInput.fill('subscribergmail.com')

    // Verify exactly ONE single error message appears
    const errorAlert = page.locator('text=Please enter a valid email address (e.g. subscriber@gmail.com).')
    await expect(errorAlert).toBeVisible()
    await expect(errorAlert).toHaveCount(1)

    // Verify obsolete fragmented '@' symbol error does not exist
    await expect(page.locator('text=Email address must include an \'@\' symbol')).toHaveCount(0)

    // Attempt submission
    await page.click('button[type="submit"]')

    // Confirm there is still only ONE error message displayed on screen
    await expect(errorAlert).toBeVisible()
    await expect(errorAlert).toHaveCount(1)
  })

  test('submits subscriber email ticket and displays In Progress receipt', async ({ page }) => {
    // Intercept backend /api/ServiceOrders to return mock ticket ID
    await page.route('**/api/ServiceOrders', async (route) => {
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON()
        expect(postData.supportStatus).toBe('In Progress')
        expect(postData.visitStatus).toBe('In Progress')
        expect(postData.emailAddress).toBe('mariaclara@example.com')
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 890, ok: true })
        })
      } else {
        await route.continue()
      }
    })

    await page.goto('/contact')

    // Fill only subscriber email
    await page.fill('#sf-email', 'mariaclara@example.com')

    // Submit form
    await page.click('button[type="submit"]')

    // Verify confirmation receipt card (email focused)
    await expect(page.locator('text=Sent Successfully!')).toBeVisible()
    await expect(page.getByText('mariaclara@example.com', { exact: true })).toBeVisible()
    await expect(page.locator('button:has-text("Submit Another Concern")')).toBeVisible()

    // Confirm that reference number and cluttered multi-field grid are NOT rendered
    await expect(page.locator('text=#SO-')).toBeHidden()
    await expect(page.locator('text=Reference No')).toBeHidden()
    await expect(page.locator('text=Subscriber Name:')).toBeHidden()
    await expect(page.locator('text=Service Address:')).toBeHidden()
  })

  test('displays public-friendly offline state when API is down and does not show success receipt', async ({ page }) => {
    // Intercept backend /api/ServiceOrders to simulate server down (502 Bad Gateway)
    await page.route('**/api/ServiceOrders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 502,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Bad Gateway', message: 'Backend service offline' })
        })
      } else {
        await route.continue()
      }
    })

    await page.goto('/contact')

    await page.fill('#sf-email', 'pedro.penduko@gmail.com')
    await page.click('button[type="submit"]')

    // Verify friendly offline banner is displayed
    await expect(page.locator('text=Support Desk Temporarily Offline')).toBeVisible()
    await expect(page.locator('text=Retry Submission')).toBeVisible()

    // Confirm success receipt is NEVER shown when API is down
    await expect(page.locator('text=Sent Successfully!')).toBeHidden()
  })
})
