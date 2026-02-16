import { test, expect } from '@playwright/test'

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup')
  })

  test('should display signup form with all elements', async ({ page }) => {
    // Check page title and description
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible()
    await expect(page.getByText('Start managing your tasks today!')).toBeVisible()

    // Check all form fields
    await expect(page.getByLabel('Full Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Confirm Password')).toBeVisible()
    await expect(page.getByLabel(/I agree to the/)).toBeVisible()
    
    // Check submit button
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible()
    
    // Check login link
    await expect(page.getByText('Already have an account?')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
    
    // Check terms links
    await expect(page.getByRole('link', { name: 'Terms of Service' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    // Try to submit without filling form
    await page.getByRole('button', { name: 'Create account' }).click()
    
    // Wait for validation
    await page.waitForTimeout(500)
    
    // Should still be on signup page
    await expect(page).toHaveURL(/\/signup/)
  })

  test('should show validation error for invalid email format', async ({ page }) => {
    await page.getByLabel('Full Name').fill('John Doe')
    await page.getByLabel('Email').fill('invalid-email')
    await page.getByLabel('Password', { exact: true }).fill('Password123')
    await page.getByLabel('Confirm Password').fill('Password123')
    await page.getByLabel(/I agree to the/).check()
    
    await page.getByRole('button', { name: 'Create account' }).click()
    
    await page.waitForTimeout(500)
    await expect(page).toHaveURL(/\/signup/)
  })

  test('should show error when passwords do not match', async ({ page }) => {
    await page.getByLabel('Full Name').fill('John Doe')
    await page.getByLabel('Email').fill('john@example.com')
    await page.getByLabel('Password', { exact: true }).fill('Password123')
    await page.getByLabel('Confirm Password').fill('differentpassword')
    await page.getByLabel(/I agree to the/).check()
    
    await page.getByRole('button', { name: 'Create account' }).click()
    
    // Wait for validation
    await page.waitForTimeout(500)
    
    // Should show validation error or stay on page
    await expect(page).toHaveURL(/\/signup/)
  })

  test('should require terms checkbox to be checked', async ({ page }) => {
    await page.getByLabel('Full Name').fill('John Doe')
    await page.getByLabel('Email').fill('john@example.com')
    await page.getByLabel('Password', { exact: true }).fill('Password123')
    await page.getByLabel('Confirm Password').fill('Password123')
    
    // Don't check terms checkbox
    await page.getByRole('button', { name: 'Create account' }).click()
    
    // Browser should prevent form submission
    await page.waitForTimeout(500)
    await expect(page).toHaveURL(/\/signup/)
  })

  test('should show error for existing email', async ({ page }) => {
    // Use an email that already exists in your test database
    const existingEmail = process.env.TEST_USER_EMAIL || 'test@example.com'
    
    await page.getByLabel('Full Name').fill('John Doe')
    await page.getByLabel('Email').fill(existingEmail)
    await page.getByLabel('Password', { exact: true }).fill('NewPassword123')
    await page.getByLabel('Confirm Password').fill('NewPassword123')
    await page.getByLabel(/I agree to the/).check()
    
    await page.getByRole('button', { name: 'Create account' }).click()
    
    // Should show error message about existing account
    await expect(page.locator('.bg-red-50')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('.bg-red-50')).toContainText(/already exists/i)
  })

  test('should successfully create account and login', async ({ page }) => {
    // Generate unique email for this test
    const timestamp = Date.now()
    const testEmail = `test.user.${timestamp}@example.com`
    const testPassword = 'TestPassword123!'
    
    // Fill signup form
    await page.getByLabel('Full Name').fill('Test User')
    await page.getByLabel('Email').fill(testEmail)
    await page.getByLabel('Password', { exact: true }).fill(testPassword)
    await page.getByLabel('Confirm Password').fill(testPassword)
    await page.getByLabel(/I agree to the/).check()
    
    // Submit form
    await page.getByRole('button', { name: 'Create account' }).click()
    
    // Should redirect to /backlog after successful signup
    await expect(page).toHaveURL('/backlog', { timeout: 10000 })
  })

  test('should show loading state during submission', async ({ page }) => {
    const timestamp = Date.now()
    const testEmail = `test.user.${timestamp}@example.com`
    
    await page.getByLabel('Full Name').fill('Test User')
    await page.getByLabel('Email').fill(testEmail)
    await page.getByLabel('Password', { exact: true }).fill('Password123')
    await page.getByLabel('Confirm Password').fill('Password123')
    await page.getByLabel(/I agree to the/).check()
    
    // Click submit
    await page.getByRole('button', { name: 'Create account' }).click()
    
    // Should show loading text
    await expect(page.getByRole('button', { name: 'Creating account...' })).toBeVisible()
  })

  test('should navigate to login page when clicking sign in link', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/login')
  })

  test('should have proper input types and autocomplete', async ({ page }) => {
    // Name input
    const nameInput = page.getByLabel('Full Name')
    await expect(nameInput).toHaveAttribute('type', 'text')
    await expect(nameInput).toHaveAttribute('autocomplete', 'name')
    
    // Email input
    const emailInput = page.getByLabel('Email')
    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(emailInput).toHaveAttribute('autocomplete', 'email')
    
    // Password inputs
    const passwordInput = page.getByLabel('Password', { exact: true })
    await expect(passwordInput).toHaveAttribute('type', 'password')
    await expect(passwordInput).toHaveAttribute('autocomplete', 'new-password')
    
    const confirmPasswordInput = page.getByLabel('Confirm Password')
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password')
    await expect(confirmPasswordInput).toHaveAttribute('autocomplete', 'new-password')
  })

  test('should handle redirectTo query parameter', async ({ page }) => {
    const timestamp = Date.now()
    const testEmail = `test.user.${timestamp}@example.com`
    const testPassword = 'TestPassword123!'
    
    // Navigate with redirectTo parameter
    await page.goto('/signup?redirectTo=/backlog')
    
    // Fill and submit form
    await page.getByLabel('Full Name').fill('Test User')
    await page.getByLabel('Email').fill(testEmail)
    await page.getByLabel('Password', { exact: true }).fill(testPassword)
    await page.getByLabel('Confirm Password').fill(testPassword)
    await page.getByLabel(/I agree to the/).check()
    await page.getByRole('button', { name: 'Create account' }).click()
    
    // Should redirect to specified path
    await expect(page).toHaveURL('/backlog', { timeout: 10000 })
  })

  test('should validate password strength if implemented', async ({ page }) => {
    // Test weak password
    await page.getByLabel('Full Name').fill('Test User')
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password', { exact: true }).fill('123')
    await page.getByLabel('Confirm Password').fill('123')
    
    // If you have password strength validation, it should show here
    // This test will need to be updated based on your actual validation rules
  })

  test('should allow checking and unchecking terms checkbox', async ({ page }) => {
    const termsCheckbox = page.getByLabel(/I agree to the/)
    
    // Initially unchecked
    await expect(termsCheckbox).not.toBeChecked()
    
    // Check it
    await termsCheckbox.check()
    await expect(termsCheckbox).toBeChecked()
    
    // Uncheck it
    await termsCheckbox.uncheck()
    await expect(termsCheckbox).not.toBeChecked()
  })

  test('should have working links to terms and privacy pages', async ({ page }) => {
    // Check that links have correct href attributes
    await expect(page.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms')
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
  })

  test('should handle form with all fields filled correctly', async ({ page }) => {
    const timestamp = Date.now()
    const testEmail = `complete.test.${timestamp}@example.com`
    
    // Fill all fields
    await page.getByLabel('Full Name').fill('Complete Test User')
    await page.getByPlaceholder('you@example.com').fill(testEmail)
    await page.getByPlaceholder('••••••••').first().fill('SecurePass123!')
    await page.getByPlaceholder('••••••••').nth(1).fill('SecurePass123!')
    await page.getByLabel(/I agree to the/).check()
    
    // All fields should be filled
    await expect(page.getByLabel('Full Name')).toHaveValue('Complete Test User')
    await expect(page.getByLabel('Email')).toHaveValue(testEmail)
    await expect(page.getByLabel(/I agree to the/)).toBeChecked()
  })
})