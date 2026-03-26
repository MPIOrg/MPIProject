// =============================================================================
// LOGIN PAGE — End-to-End Tests
// Tests the /login route: form rendering, client-side validation,
// successful authentication with redirect, and failed login error handling.
// =============================================================================
const { test, expect } = require('@playwright/test');

// Base URL for all navigation (React dev server)
const BASE = 'http://localhost:3000';

test.describe('Login Page — UI Rendering', () => {

  test('LP-01  Page loads with all expected elements', async ({ page }) => {
    // Navigate to the login page
    await page.goto(`${BASE}/login`);

    // The app brand name is rendered as an <h2> heading
    await expect(page.getByRole('heading', { name: 'SmartWallet' })).toBeVisible();

    // Subtitle text underneath the logo
    await expect(page.getByText('Your personal finance companion')).toBeVisible();

    // Email input field — identified by its exact placeholder text
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();

    // Password input field — identified by its exact placeholder text
    await expect(page.getByPlaceholder('Enter password')).toBeVisible();

    // Primary submit button with the text "Sign In"
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

    // Navigation prompt to the registration page
    await expect(page.getByText("Don't have an account?")).toBeVisible();
    await expect(page.getByText('Create one')).toBeVisible();
  });

});


test.describe('Login Page — Client-Side Validation (Negative Paths)', () => {

  test('LP-02  Submitting with both fields empty shows validation error', async ({ page }) => {
    await page.goto(`${BASE}/login`);

    // Click "Sign In" without entering any data
    await page.getByRole('button', { name: 'Sign In' }).click();

    // The component displays an inline error for empty fields
    await expect(page.getByText('Please fill in all fields!')).toBeVisible();

    // The URL must NOT change — user stays on login
    await expect(page).toHaveURL(`${BASE}/login`);
  });

  test('LP-03  Submitting with only email filled shows validation error', async ({ page }) => {
    await page.goto(`${BASE}/login`);

    // Fill only the email, leave password empty
    await page.getByPlaceholder('Enter your email').fill('user@example.com');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Please fill in all fields!')).toBeVisible();
    await expect(page).toHaveURL(`${BASE}/login`);
  });

  test('LP-04  Submitting with only password filled shows validation error', async ({ page }) => {
    await page.goto(`${BASE}/login`);

    // Fill only the password, leave email empty
    await page.getByPlaceholder('Enter password').fill('SomePassword123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Please fill in all fields!')).toBeVisible();
    await expect(page).toHaveURL(`${BASE}/login`);
  });

});


test.describe('Login Page — Server-Side Authentication (API Integration)', () => {

  test('LP-05  Invalid credentials show server error message', async ({ page }) => {
    await page.goto(`${BASE}/login`);

    // Enter credentials that do NOT exist in the database
    await page.getByPlaceholder('Enter your email').fill('nonexistent@fake.com');
    await page.getByPlaceholder('Enter password').fill('WrongPassword!');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // The catch block in Login.js sets "Invalid email or password!"
    await expect(page.getByText('Invalid email or password!')).toBeVisible();

    // User remains on the login page
    await expect(page).toHaveURL(`${BASE}/login`);
  });

  test('LP-06  Successful login redirects to /dashboard', async ({ page }) => {
    // PREREQUISITE: A user with these credentials must exist in the database.
    // Register one via API before testing login.
    const uniqueEmail = `testlogin_${Date.now()}@test.com`;
    const password = 'TestPass123';

    // Create the user directly via the backend API
    await page.request.post('http://localhost:8080/api/users/register', {
      data: { username: 'LoginTester', email: uniqueEmail, password }
    });

    await page.goto(`${BASE}/login`);

    // Fill valid credentials
    await page.getByPlaceholder('Enter your email').fill(uniqueEmail);
    await page.getByPlaceholder('Enter password').fill(password);

    // Submit the form
    await page.getByRole('button', { name: 'Sign In' }).click();

    // After successful login, React Router navigates to /dashboard
    await expect(page).toHaveURL(`${BASE}/dashboard`, { timeout: 10000 });

    // Dashboard should display the balance card heading
    await expect(page.getByText('CURRENT BALANCE')).toBeVisible();
  });

  test('LP-07  Pressing Enter on the password field submits the form', async ({ page }) => {
    const uniqueEmail = `testenter_${Date.now()}@test.com`;
    const password = 'TestPass123';

    await page.request.post('http://localhost:8080/api/users/register', {
      data: { username: 'EnterKeyUser', email: uniqueEmail, password }
    });

    await page.goto(`${BASE}/login`);

    await page.getByPlaceholder('Enter your email').fill(uniqueEmail);
    await page.getByPlaceholder('Enter password').fill(password);

    // Press Enter instead of clicking the button (onKeyDown handler)
    await page.getByPlaceholder('Enter password').press('Enter');

    await expect(page).toHaveURL(`${BASE}/dashboard`, { timeout: 10000 });
  });

});


test.describe('Login Page — Navigation Links', () => {

  test('LP-08  Clicking "Create one" navigates to /register', async ({ page }) => {
    await page.goto(`${BASE}/login`);

    // "Create one" is a <span> with an onClick handler, not a real <a> link
    await page.getByText('Create one').click();

    await expect(page).toHaveURL(`${BASE}/register`);

    // Verify the register page loaded by checking its subtitle
    await expect(page.getByText('Create your account')).toBeVisible();
  });

});
