// =============================================================================
// ROUTING & NAVIGATION — End-to-End Tests
// Tests application-wide routing behaviour: the root redirect, full user
// journey (register → login → dashboard → history → logout), and direct URL
// access to protected pages without authentication context.
// =============================================================================
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:3000';
const API  = 'http://localhost:8080';


test.describe('Routing — Root Redirect', () => {

  test('NV-01  Visiting "/" redirects to /login', async ({ page }) => {
    // App.js: <Route path="/" element={<Navigate to="/login" />} />
    await page.goto(`${BASE}/`);

    await expect(page).toHaveURL(`${BASE}/login`);
    await expect(page.getByRole('heading', { name: 'SmartWallet' })).toBeVisible();
  });

});


test.describe('Routing — Direct Page Access Without Auth', () => {

  test('NV-02  Accessing /dashboard without login loads the page but API calls fail gracefully', async ({ page }) => {
    // Clear any lingering session data
    await page.goto(`${BASE}/login`);
    await page.evaluate(() => {
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
    });

    // Navigate directly to /dashboard (no route guard exists in the app)
    await page.goto(`${BASE}/dashboard`);

    // The page still renders because there is no auth guard.
    // The balance <h1> heading should show "0 RON".
    // We target the heading role to avoid strict-mode violations
    // (the page has 3 elements containing "0 RON": <h1>, income <span>, expense <span>).
    await expect(page.getByText('CURRENT BALANCE')).toBeVisible();
    await expect(page.getByRole('heading', { name: '0 RON' })).toBeVisible();
  });

  test('NV-03  Accessing /history without login loads the page with no data', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.evaluate(() => {
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
    });

    await page.goto(`${BASE}/history`);

    // The page renders; without a userId the API returns empty or errors
    await expect(page.getByRole('heading', { name: 'Transaction History' })).toBeVisible();
  });

});


test.describe('Full User Journey — End to End', () => {

  test('NV-04  Register → Login → Add Transaction → View History → Logout', async ({ page }) => {
    const email = `journey_${Date.now()}@test.com`;
    const password = 'Journey123';

    // --- STEP 1: Register a new account ---
    await page.goto(`${BASE}/register`);
    await page.getByPlaceholder('Choose a username').fill('JourneyUser');
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Choose a password (min. 6 chars)').fill(password);
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Should redirect to /login after successful registration
    await expect(page).toHaveURL(`${BASE}/login`, { timeout: 10000 });

    // --- STEP 2: Log in with the new account ---
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(`${BASE}/dashboard`, { timeout: 10000 });
    await expect(page.getByText('CURRENT BALANCE')).toBeVisible();

    // --- STEP 3: Add a transaction on the dashboard ---
    const categorySelect = page.locator('select');
    await categorySelect.selectOption({ label: 'Salary (INCOME)' });
    await page.getByPlaceholder('Amount (RON)').fill('3000');
    await page.locator('input[type="date"]').fill('2026-03-20');
    await page.getByPlaceholder('Description (optional)').fill('E2E test salary');
    await page.getByRole('button', { name: '+ Add' }).click();

    // Balance <h1> heading should update to reflect the new income (3,000 or 3000)
    await expect(page.getByRole('heading', { name: /3[,.]?000/ })).toBeVisible({ timeout: 5000 });

    // --- STEP 4: Navigate to History and verify the transaction ---
    await page.getByRole('button', { name: '📋 History' }).click();
    await expect(page).toHaveURL(`${BASE}/history`);
    await expect(page.getByText('E2E test salary')).toBeVisible();

    // --- STEP 5: Navigate back to Dashboard ---
    await page.getByRole('button', { name: '← Dashboard' }).click();
    await expect(page).toHaveURL(`${BASE}/dashboard`);

    // --- STEP 6: Logout ---
    await page.getByRole('button', { name: '🚪 Logout' }).click();
    await expect(page).toHaveURL(`${BASE}/login`);

    // Verify session was destroyed
    const userId = await page.evaluate(() => localStorage.getItem('userId'));
    expect(userId).toBeNull();
  });

});


test.describe('Cross-Page Navigation Consistency', () => {

  test('NV-05  SmartWallet heading is visible on every authenticated page', async ({ page }) => {
    const email = `navcheck_${Date.now()}@test.com`;
    const password = 'NavCheck123';

    await page.request.post(`${API}/api/users/register`, {
      data: { username: 'NavChecker', email, password }
    });

    // Login
    await page.goto(`${BASE}/login`);
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(`${BASE}/dashboard`, { timeout: 10000 });

    // Dashboard has the branded heading in the navbar
    await expect(page.getByRole('heading', { name: '💰 SmartWallet' })).toBeVisible();

    // Navigate to History
    await page.getByRole('button', { name: '📋 History' }).click();
    await expect(page).toHaveURL(`${BASE}/history`);

    // History also has the same branded heading
    await expect(page.getByRole('heading', { name: '💰 SmartWallet' })).toBeVisible();
  });

  test('NV-06  Login and Register pages both show the SmartWallet heading', async ({ page }) => {
    // Login page
    await page.goto(`${BASE}/login`);
    await expect(page.getByRole('heading', { name: 'SmartWallet' })).toBeVisible();

    // Register page
    await page.goto(`${BASE}/register`);
    await expect(page.getByRole('heading', { name: 'SmartWallet' })).toBeVisible();
  });

});
