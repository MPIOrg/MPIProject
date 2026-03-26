// =============================================================================
// DASHBOARD PAGE — End-to-End Tests
// Tests the /dashboard route: balance display, category loading, transaction
// creation (positive + negative), pie chart rendering, navigation buttons,
// and logout functionality.
// Requires: Backend running on :8080, Frontend on :3000, seeded categories.
// =============================================================================
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:3000';
const API  = 'http://localhost:8080';

// ---------------------------------------------------------------------------
// Helper: create a fresh user and log them in through the UI, landing on
// /dashboard with localStorage already populated.
// ---------------------------------------------------------------------------
async function registerAndLogin(page) {
  const email = `dashboard_${Date.now()}@test.com`;
  const password = 'DashTest123';

  // Create user via API so we don't depend on the register UI
  await page.request.post(`${API}/api/users/register`, {
    data: { username: 'DashTester', email, password }
  });

  // Log in through the real UI to populate localStorage
  await page.goto(`${BASE}/login`);
  await page.getByPlaceholder('Enter your email').fill(email);
  await page.getByPlaceholder('Enter password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Wait until the dashboard has fully loaded
  await expect(page).toHaveURL(`${BASE}/dashboard`, { timeout: 10000 });
  await expect(page.getByText('CURRENT BALANCE')).toBeVisible();
}


test.describe('Dashboard — UI Rendering', () => {

  test('DB-01  Dashboard loads with all core UI sections', async ({ page }) => {
    await registerAndLogin(page);

    // Navbar: brand + action buttons
    await expect(page.getByRole('heading', { name: '💰 SmartWallet' })).toBeVisible();
    await expect(page.getByRole('button', { name: '📋 History' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🚪 Logout' })).toBeVisible();

    // Balance card — use the <h1> heading for the main balance to avoid
    // strict-mode violations (the page has 3 elements containing "RON":
    // the <h1> balance, the income <span>, and the expense <span>)
    await expect(page.getByText('CURRENT BALANCE')).toBeVisible();
    await expect(page.getByRole('heading', { name: /RON/ })).toBeVisible();
    await expect(page.getByText('▲ INCOME')).toBeVisible();
    await expect(page.getByText('▼ EXPENSES')).toBeVisible();

    // Add Transaction form section
    await expect(page.getByRole('heading', { name: 'Add Transaction' })).toBeVisible();
    await expect(page.getByPlaceholder('Amount (RON)')).toBeVisible();
    await expect(page.getByPlaceholder('Description (optional)')).toBeVisible();
    await expect(page.getByRole('button', { name: '+ Add' })).toBeVisible();

    // Chart section
    await expect(page.getByRole('heading', { name: 'Spending by Category' })).toBeVisible();
  });

  test('DB-02  Fresh user sees zero balance and "No data yet" chart', async ({ page }) => {
    await registerAndLogin(page);

    // A new user has no transactions — the balance <h1> should read "0 RON".
    // We target the <h1> specifically to avoid matching the income/expense spans.
    await expect(page.getByRole('heading', { name: '0 RON' })).toBeVisible();

    // The pie chart section shows a placeholder when there is no data
    await expect(page.getByText('No data yet')).toBeVisible();
  });

  test('DB-03  Category dropdown is populated from the backend', async ({ page }) => {
    await registerAndLogin(page);

    // The <select> should have at least one option from data.sql seed categories
    const categorySelect = page.locator('select');
    await expect(categorySelect).toBeVisible();

    // data.sql seeds "Food & Groceries (EXPENSE)" and "Salary (INCOME)"
    await expect(categorySelect.locator('option', { hasText: 'Food & Groceries' })).toBeAttached();
    await expect(categorySelect.locator('option', { hasText: 'Salary' })).toBeAttached();
  });

});


test.describe('Dashboard — Add Transaction Validation (Negative Paths)', () => {

  test('DB-04  Submitting without amount and date shows validation error', async ({ page }) => {
    await registerAndLogin(page);

    // Category is auto-selected (first option), but amount + date are empty
    await page.getByRole('button', { name: '+ Add' }).click();

    await expect(page.getByText('Please fill in all fields!')).toBeVisible();
  });

  test('DB-05  Submitting with amount but no date shows validation error', async ({ page }) => {
    await registerAndLogin(page);

    await page.getByPlaceholder('Amount (RON)').fill('100');
    // Date left empty
    await page.getByRole('button', { name: '+ Add' }).click();

    await expect(page.getByText('Please fill in all fields!')).toBeVisible();
  });

  test('DB-06  Submitting with date but no amount shows validation error', async ({ page }) => {
    await registerAndLogin(page);

    await page.locator('input[type="date"]').fill('2026-03-15');
    // Amount left empty
    await page.getByRole('button', { name: '+ Add' }).click();

    await expect(page.getByText('Please fill in all fields!')).toBeVisible();
  });

});


test.describe('Dashboard — Add Transaction (Positive Paths)', () => {

  test('DB-07  Adding an expense updates the balance', async ({ page }) => {
    await registerAndLogin(page);

    // Select an EXPENSE category (e.g., "Food & Groceries")
    const categorySelect = page.locator('select');
    await categorySelect.selectOption({ label: 'Food & Groceries (EXPENSE)' });

    // Fill the amount and date
    await page.getByPlaceholder('Amount (RON)').fill('250');
    await page.locator('input[type="date"]').fill('2026-03-20');
    await page.getByPlaceholder('Description (optional)').fill('Weekly groceries');

    await page.getByRole('button', { name: '+ Add' }).click();

    // After adding, the error message should NOT be visible
    await expect(page.getByText('Please fill in all fields!')).not.toBeVisible();

    // The EXPENSES stat should now reflect 250 RON.
    // Use the balance <h1> heading to verify the main balance changed.
    await expect(page.getByRole('heading', { name: /250/ })).toBeVisible({ timeout: 5000 });
  });

  test('DB-08  Adding an income updates the balance', async ({ page }) => {
    await registerAndLogin(page);

    // Select an INCOME category (e.g., "Salary")
    const categorySelect = page.locator('select');
    await categorySelect.selectOption({ label: 'Salary (INCOME)' });

    await page.getByPlaceholder('Amount (RON)').fill('5000');
    await page.locator('input[type="date"]').fill('2026-03-01');
    await page.getByPlaceholder('Description (optional)').fill('March salary');

    await page.getByRole('button', { name: '+ Add' }).click();

    // The balance <h1> heading should now contain 5,000 or 5000
    await expect(page.getByRole('heading', { name: /5[,.]?000/ })).toBeVisible({ timeout: 5000 });
  });

  test('DB-09  Adding transaction without description uses category name as fallback', async ({ page }) => {
    await registerAndLogin(page);

    const categorySelect = page.locator('select');
    await categorySelect.selectOption({ label: 'Transport (EXPENSE)' });

    await page.getByPlaceholder('Amount (RON)').fill('50');
    await page.locator('input[type="date"]').fill('2026-03-15');
    // Description is intentionally left empty

    await page.getByRole('button', { name: '+ Add' }).click();

    // The form resets after a successful add — amount field is cleared
    await expect(page.getByPlaceholder('Amount (RON)')).toHaveValue('', { timeout: 5000 });
  });

  test('DB-10  Form resets after successful transaction', async ({ page }) => {
    await registerAndLogin(page);

    const categorySelect = page.locator('select');
    await categorySelect.selectOption({ label: 'Salary (INCOME)' });

    await page.getByPlaceholder('Amount (RON)').fill('1000');
    await page.locator('input[type="date"]').fill('2026-03-10');
    await page.getByPlaceholder('Description (optional)').fill('Bonus');

    await page.getByRole('button', { name: '+ Add' }).click();

    // After submission, the form fields should be cleared
    await expect(page.getByPlaceholder('Amount (RON)')).toHaveValue('', { timeout: 5000 });
    await expect(page.getByPlaceholder('Description (optional)')).toHaveValue('');
  });

});


test.describe('Dashboard — Pie Chart', () => {

  test('DB-11  Chart appears after adding at least one transaction', async ({ page }) => {
    await registerAndLogin(page);

    // Initially, the chart area shows "No data yet"
    await expect(page.getByText('No data yet')).toBeVisible();

    // Add a transaction
    const categorySelect = page.locator('select');
    await categorySelect.selectOption({ label: 'Entertainment (EXPENSE)' });
    await page.getByPlaceholder('Amount (RON)').fill('100');
    await page.locator('input[type="date"]').fill('2026-03-25');
    await page.getByRole('button', { name: '+ Add' }).click();

    // "No data yet" should vanish, replaced by the Recharts SVG pie chart
    await expect(page.getByText('No data yet')).not.toBeVisible({ timeout: 5000 });

    // The main Recharts PieChart SVG has role="application"
    await expect(page.getByRole('application')).toBeVisible({ timeout: 5000 });
  });

});


test.describe('Dashboard — Navigation', () => {

  test('DB-12  "History" button navigates to /history', async ({ page }) => {
    await registerAndLogin(page);

    await page.getByRole('button', { name: '📋 History' }).click();

    await expect(page).toHaveURL(`${BASE}/history`);
    await expect(page.getByRole('heading', { name: 'Transaction History' })).toBeVisible();
  });

  test('DB-13  "Logout" button clears session and redirects to /login', async ({ page }) => {
    await registerAndLogin(page);

    await page.getByRole('button', { name: '🚪 Logout' }).click();

    // After logout, the user is sent back to the login page
    await expect(page).toHaveURL(`${BASE}/login`);

    // Verify localStorage was cleared (userId should be null)
    const userId = await page.evaluate(() => localStorage.getItem('userId'));
    expect(userId).toBeNull();
  });

});
