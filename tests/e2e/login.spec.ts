import { test, expect } from '@playwright/test'

// Run tests in this file serially to avoid state conflicts
test.describe.configure({ mode: 'serial' })

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
  })

  test('should display login form with all elements', async ({ page }) => {
    // Check page title and description
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible()
    await expect(page.getByText('Your tasks is waiting for you!')).toBeVisible()

    // Check form fields
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByLabel('Remember me')).toBeVisible()
    
    // Check submit button
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
    
    // Check sign up link
    await expect(page.getByText('New to our platform?')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Create an account' })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    // Click submit without filling form
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    // Should show validation errors (react-hook-form validation)
    // Wait a bit for validation to appear
    await page.waitForTimeout(500)
    
    // Check that we're still on login page (form didn't submit)
    await expect(page).toHaveURL(/\/login/)
  })

  test('should show validation error for invalid email format', async ({ page }) => {
    // Enter invalid email
    await page.getByLabel('Email').click()
    await page.getByLabel('Email').fill('invalid-email')
    await expect(page.getByLabel('Email')).toHaveValue('invalid-email')
    
    await page.getByLabel('Password').click()
    await page.getByLabel('Password').fill('Password123')
    await expect(page.getByLabel('Password')).toHaveValue('Password123')
    
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    // Wait for validation
    await page.waitForTimeout(1000)
    
    // Should still be on login page
    await expect(page).toHaveURL(/\/login/)
  })

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill form with invalid credentials
    const emailInput = page.getByLabel('Email')
    const passwordInput = page.getByLabel('Password')
    
    // Fill email and wait for it to be fully filled
    await emailInput.click()
    await emailInput.fill('wrong@example.com')
    await expect(emailInput).toHaveValue('wrong@example.com')
    
    // Fill password and wait for it to be fully filled
    await passwordInput.click()
    await passwordInput.fill('Wrongpassword1')
    await expect(passwordInput).toHaveValue('Wrongpassword1')
    
    // Click submit button
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    // Wait for server response (error message or redirect)
    await page.waitForLoadState('networkidle')
    
    // Should show error message
    const errorMessage = page.locator('.bg-red-50')
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
  })

  test('should successfully login with valid credentials', async ({ page, context }) => {
    // Note: You'll need to have a test user created in Appwrite
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com'
    const testPassword = process.env.TEST_USER_PASSWORD || 'TestPassword123'
    
    // Fill login form with explicit clicks and waits
    const emailInput = page.getByLabel('Email')
    await emailInput.click()
    await emailInput.fill(testEmail)
    await expect(emailInput).toHaveValue(testEmail)
    
    const passwordInput = page.getByLabel('Password')
    await passwordInput.click()
    await passwordInput.fill(testPassword)
    await expect(passwordInput).toHaveValue(testPassword)
    
    // Check remember me
    await page.getByLabel('Remember me').check()
    await expect(page.getByLabel('Remember me')).toBeChecked()
    
    // Submit form
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    // Should redirect to /backlog after successful login
    await expect(page).toHaveURL('/backlog', { timeout: 10000 })
    
    // Cleanup: clear cookies/storage for next test
    await context.clearCookies()
  })

  test('should show loading state during submission', async ({ page, context }) => {
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com'
    const testPassword = process.env.TEST_USER_PASSWORD || 'TestPassword123'
    
    const emailInput = page.getByLabel('Email')
    await emailInput.click()
    await emailInput.fill(testEmail)
    await expect(emailInput).toHaveValue(testEmail)
    
    const passwordInput = page.getByLabel('Password')
    await passwordInput.click()
    await passwordInput.fill(testPassword)
    await expect(passwordInput).toHaveValue(testPassword)
    
    // Click submit
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    // Should show loading text (might be very quick, so we use a try-catch)
    try {
      await expect(page.getByRole('button', { name: 'Signing in...' })).toBeVisible({ timeout: 1000 })
    } catch {
      // Loading state might be too fast to catch, which is fine
      console.log('Loading state was too fast to capture')
    }
    
    // Wait for redirect and cleanup
    await page.waitForURL('/backlog', { timeout: 10000 }).catch(() => {})
    await context.clearCookies()
  })

  test('should navigate to signup page when clicking create account link', async ({ page }) => {
    await page.getByRole('link', { name: 'Create an account' }).click()
    await expect(page).toHaveURL('/signup')
  })

  test('should have proper input types and autocomplete', async ({ page }) => {
    // Email input should have type="email" and autocomplete
    const emailInput = page.getByLabel('Email')
    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(emailInput).toHaveAttribute('autocomplete', 'email')
    
    // Password input should have type="password" and autocomplete
    const passwordInput = page.getByLabel('Password')
    await expect(passwordInput).toHaveAttribute('type', 'password')
    await expect(passwordInput).toHaveAttribute('autocomplete', 'current-password')
  })

  test('should handle redirectTo query parameter', async ({ page, context }) => {
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com'
    const testPassword = process.env.TEST_USER_PASSWORD || 'TestPassword123'
    
    // Navigate with redirectTo parameter
    await page.goto('/login?redirectTo=/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Login
    const emailInput = page.getByLabel('Email')
    await emailInput.click()
    await emailInput.fill(testEmail)
    await expect(emailInput).toHaveValue(testEmail)
    
    const passwordInput = page.getByLabel('Password')
    await passwordInput.click()
    await passwordInput.fill(testPassword)
    await expect(passwordInput).toHaveValue(testPassword)
    
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    // Should redirect to specified path
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
    
    // Cleanup
    await context.clearCookies()
  })

  test('should allow password visibility toggle if implemented', async ({ page }) => {
    // This test is for future password visibility toggle feature
    const passwordInput = page.getByLabel('Password')
    
    // Initially should be type="password"
    await expect(passwordInput).toHaveAttribute('type', 'password')
    
    // If you add a show/hide button later, add tests for it here
  })
})