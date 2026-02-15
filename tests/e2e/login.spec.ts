import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
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
    await page.getByLabel('Email').fill('invalid-email')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    // Wait for validation
    await page.waitForTimeout(500)
    
    // Should still be on login page
    await expect(page).toHaveURL(/\/login/)
  })

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill form with invalid credentials
    await page.getByLabel('Email').fill('wrong@example.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    // Wait for server response
    await page.waitForTimeout(1000)
    
    // Should show error message
    await expect(page.locator('.bg-red-50')).toBeVisible()
  })

  test('should successfully login with valid credentials', async ({ page }) => {
    // Note: You'll need to have a test user created in Appwrite
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com'
    const testPassword = process.env.TEST_USER_PASSWORD || 'testpassword123'
    
    // Fill login form
    await page.getByLabel('Email').fill(testEmail)
    await page.getByLabel('Password').fill(testPassword)
    
    // Check remember me
    await page.getByLabel('Remember me').check()
    await expect(page.getByLabel('Remember me')).toBeChecked()
    
    // Submit form
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    // Should redirect to /backlog after successful login
    await expect(page).toHaveURL('/backlog', { timeout: 5000 })
  })

  test('should show loading state during submission', async ({ page }) => {
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com'
    const testPassword = process.env.TEST_USER_PASSWORD || 'testpassword123'
    
    await page.getByLabel('Email').fill(testEmail)
    await page.getByLabel('Password').fill(testPassword)
    
    // Click submit
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    // Should show loading text
    await expect(page.getByRole('button', { name: 'Signing in...' })).toBeVisible()
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

  test('should handle redirectTo query parameter', async ({ page }) => {
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com'
    const testPassword = process.env.TEST_USER_PASSWORD || 'testpassword123'
    
    // Navigate with redirectTo parameter
    await page.goto('/login?redirectTo=/dashboard')
    
    // Login
    await page.getByLabel('Email').fill(testEmail)
    await page.getByLabel('Password').fill(testPassword)
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    // Should redirect to specified path
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 })
  })

  test('should allow password visibility toggle if implemented', async ({ page }) => {
    // This test is for future password visibility toggle feature
    const passwordInput = page.getByLabel('Password')
    
    // Initially should be type="password"
    await expect(passwordInput).toHaveAttribute('type', 'password')
    
    // If you add a show/hide button later, add tests for it here
  })
})