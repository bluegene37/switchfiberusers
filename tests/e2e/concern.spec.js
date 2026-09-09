import { test, expect } from '@playwright/test'

test.describe('Customer Concern & Complaint Submission Flow', () => {
  test('hides concern form by default on standard /contact route', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('#concern-form')).toBeHidden()
    await expect(page.locator('a[href="#concern-form"]')).toBeHidden()
  })

  test('displays concern form when enabled via ?serviceOrder=true', async ({ page }) => {
    await page.goto('/contact?serviceOrder=true')

    // Click hero shortcut
    const cta = page.locator('a[href="#concern-form"]').first()
    await expect(cta).toBeVisible()
    await cta.click()

    // Verify form container is present
    const formSection = page.locator('#concern-form')
    await expect(formSection).toBeVisible()

    // Verify inputs
    await expect(page.locator('#sf-account-lookup')).toBeVisible()
    await expect(page.locator('#sf-fullname')).toBeVisible()
    await expect(page.locator('#sf-contact')).toBeVisible()
    await expect(page.locator('#sf-address')).toBeVisible()
    await expect(page.locator('#sf-category')).toBeVisible()
    await expect(page.locator('#sf-details')).toBeVisible()
  })

  test('validates required fields before submitting', async ({ page }) => {
    await page.goto('/contact?serviceOrder=true')

    // Attempt submission with blank inputs
    const submitBtn = page.locator('button[type="submit"]')
    await submitBtn.click()

    // HTML5 or JS validation prevents blank submission
    const alertOrInvalid = await page.evaluate(() => {
      const nameInput = document.querySelector('#sf-fullname')
      return nameInput && !nameInput.checkValidity()
    })
    expect(alertOrInvalid).toBe(true)
  })

  test('submits a complete concern ticket and displays In Progress receipt', async ({ page }) => {
    // Intercept backend /api/ServiceOrders to return mock ticket ID
    await page.route('**/api/ServiceOrders', async (route) => {
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON()
        expect(postData.supportStatus).toBe('In Progress')
        expect(postData.visitStatus).toBe('In Progress')
        expect(postData.fullName).toBe('Maria Clara')
        expect(postData.contactNumber).toBe('09151234567')
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 890, ok: true })
        })
      } else {
        await route.continue()
      }
    })

    await page.goto('/contact?serviceOrder=true')

    // Fill form details
    await page.fill('#sf-account-lookup', '202399999')
    await page.fill('#sf-fullname', 'Maria Clara')
    await page.fill('#sf-contact', '09151234567')
    await page.fill('#sf-email', 'mariaclara@example.com')
    await page.fill('#sf-address', '123 Rizal St., Brgy. Batingan')
    await page.selectOption('#sf-category', 'No Internet / LOS (Red Light)')
    await page.fill('#sf-details', 'Modem is showing solid red LOS indicator since 3 PM today.')

    // Submit form
    await page.click('button[type="submit"]')

    // Verify confirmation receipt card
    await expect(page.locator('text=Concern Submitted Successfully!')).toBeVisible()
    await expect(page.locator('text=Ticket Status: In Progress')).toBeVisible()
    await expect(page.locator('text=#SO-890')).toBeVisible()
    await expect(page.locator('text=Maria Clara')).toBeVisible()
    await expect(page.locator('button:has-text("Submit Another Concern")')).toBeVisible()
  })
})
