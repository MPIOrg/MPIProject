// =============================================================================
// REGISTER PAGE — End-to-End Tests
// Tests the /register route: form rendering, client-side validation,
// successful account creation, server-side error handling (duplicate email,
// short password), and navigation links.
// =============================================================================
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:3000';

test.describe('Register Page — UI Rendering', () => {

  test('RG-01  Page loads with all expected elements', async ({ page }) => {
    await page.goto(`${BASE}/register`);

    // Brand heading
    await expect(page.getByRole('heading', { name: 'SmartWallet' })).toBeVisible();

    // Subtitle specific to the register page
    await expect(page.getByText('Create your account')).toBeVisible();

    // All three input fields identified by their exact placeholders
    await expect(page.getByPlaceholder('Choose a username')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Choose a password (min. 6 chars)')).toBeVisible();

    // Submit button
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();

    // Link back to login
    await expect(page.getByText('Already have an account?')).toBeVisible();
    await expect(page.getByText('Sign in')).toBeVisible();
  });

});


test.describe('Register Page — Client-Side Validation (Negative Paths)', () => {

  test('RG-02  Submitting with all fields empty shows validation error', async ({ page }) => {
    await page.goto(`${BASE}/register`);

    await page.getByRole('button', { name: 'Create Account' }).click();

    // Frontend validation fires before any API call
    await expect(page.getByText('Please fill in all fields!')).toBeVisible();
    await expect(page).toHaveURL(`${BASE}/register`);
  });

  test('RG-03  Submitting with only username filled shows validation error', async ({ page }) => {
    await page.goto(`${BASE}/register`);

    await page.getByPlaceholder('Choose a username').fill('TestUser');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Please fill in all fields!')).toBeVisible();
  });

  test('RG-04  Submitting without password shows validation error', async ({ page }) => {
    await page.goto(`${BASE}/register`);

    await page.getByPlaceholder('Choose a username').fill('TestUser');
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    // Password is left empty
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Please fill in all fields!')).toBeVisible();
  });

  test('RG-05  Submitting without email shows validation error', async ({ page }) => {
    await page.goto(`${BASE}/register`);

    await page.getByPlaceholder('Choose a username').fill('TestUser');
    await page.getByPlaceholder('Choose a password (min. 6 chars)').fill('Secret123');
    // Email is left empty
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Please fill in all fields!')).toBeVisible();
  });

});


test.describe('Register Page — Server-Side Validation (Negative Paths)', () => {

  test('RG-06  Password shorter than 6 characters triggers server error', async ({ page }) => {
    await page.goto(`${BASE}/register`);

    await page.getByPlaceholder('Choose a username').fill('ShortPwUser');
    await page.getByPlaceholder('Enter your email').fill(`shortpw_${Date.now()}@test.com`);
    // Backend validates: @Size(min = 6) on password
    await page.getByPlaceholder('Choose a password (min. 6 chars)').fill('Ab1');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // The server returns a validation message; if parsing fails, the fallback
    // text "Registration failed. Please check your data." is displayed
    const errorArea = page.locator('p').filter({ hasText: /(Registration failed|Parola trebuie)/ });
    await expect(errorArea).toBeVisible({ timeout: 5000 });

    // User stays on register page
    await expect(page).toHaveURL(`${BASE}/register`);
  });

  test('RG-07  Duplicate email triggers server error', async ({ page }) => {
    const duplicateEmail = `duplicate_${Date.now()}@test.com`;

    // First, register a user with this email via the API
    await page.request.post('http://localhost:8080/api/users/register', {
      data: { username: 'FirstUser', email: duplicateEmail, password: 'FirstPass123' }
    });

    // Now attempt to register the same email through the UI
    await page.goto(`${BASE}/register`);
    await page.getByPlaceholder('Choose a username').fill('SecondUser');
    await page.getByPlaceholder('Enter your email').fill(duplicateEmail);
    await page.getByPlaceholder('Choose a password (min. 6 chars)').fill('SecondPass123');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Server should reject the duplicate; the fallback error message appears
    const errorArea = page.locator('p').filter({ hasText: /(Registration failed|already|duplicate|existe)/i });
    await expect(errorArea).toBeVisible({ timeout: 5000 });

    await expect(page).toHaveURL(`${BASE}/register`);
  });

});


test.describe('Register Page — Successful Registration (Positive Path)', () => {

  test('RG-08  Valid registration redirects to /login', async ({ page }) => {
    const uniqueEmail = `newuser_${Date.now()}@test.com`;

    await page.goto(`${BASE}/register`);

    await page.getByPlaceholder('Choose a username').fill('QATester');
    await page.getByPlaceholder('Enter your email').fill(uniqueEmail);
    await page.getByPlaceholder('Choose a password (min. 6 chars)').fill('SecurePass123');

    await page.getByRole('button', { name: 'Create Account' }).click();

    // On success, Register.js calls navigate('/login')
    await expect(page).toHaveURL(`${BASE}/login`, { timeout: 10000 });

    // Verify the login page loaded correctly
    await expect(page.getByText('Your personal finance companion')).toBeVisible();
  });

  test('RG-09  Pressing Enter on the password field submits the form', async ({ page }) => {
    const uniqueEmail = `enterkey_${Date.now()}@test.com`;

    await page.goto(`${BASE}/register`);

    await page.getByPlaceholder('Choose a username').fill('EnterTester');
    await page.getByPlaceholder('Enter your email').fill(uniqueEmail);
    await page.getByPlaceholder('Choose a password (min. 6 chars)').fill('SecurePass123');

    // Use the keyboard Enter key (onKeyDown handler on password input)
    await page.getByPlaceholder('Choose a password (min. 6 chars)').press('Enter');

    await expect(page).toHaveURL(`${BASE}/login`, { timeout: 10000 });
  });

});


test.describe('Register Page — Navigation Links', () => {

  test('RG-10  Clicking "Sign in" navigates back to /login', async ({ page }) => {
    await page.goto(`${BASE}/register`);

    // "Sign in" is a <span> with an onClick, not an <a> tag
    await page.getByText('Sign in').click();

    await expect(page).toHaveURL(`${BASE}/login`);
    await expect(page.getByText('Your personal finance companion')).toBeVisible();
  });

});
