// =============================================================================
// HISTORY PAGE — End-to-End Tests
// Tests the /history route: transaction listing, month filter, inline edit
// (amount update), delete, empty state, and navigation back to dashboard.
// Requires: Backend running on :8080, Frontend on :3000, seeded categories.
// =============================================================================
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:3000';
const API  = 'http://localhost:8080';

// ---------------------------------------------------------------------------
// Helper: create a fresh user via API, log in through the UI, then add a
// couple of transactions via API so the History page has data to display.
// Returns { page, userId } for further API calls if needed.
// ---------------------------------------------------------------------------
async function setupUserWithTransactions(page) {
  const email = `history_${Date.now()}@test.com`;
  const password = 'HistTest123';

  // Register user
  const regRes = await page.request.post(`${API}/api/users/register`, {
    data: { username: 'HistoryTester', email, password }
  });

  // Log in to get the userId from localStorage
  await page.goto(`${BASE}/login`);
  await page.getByPlaceholder('Enter your email').fill(email);
  await page.getByPlaceholder('Enter password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(`${BASE}/dashboard`, { timeout: 10000 });

  const userId = await page.evaluate(() => localStorage.getItem('userId'));

  // Add an EXPENSE transaction (categoryId 1 = "Food & Groceries")
  await page.request.post(`${API}/api/transactions`, {
    data: {
      amount: 150.00,
      description: 'Supermarket shopping',
      transactionDate: '2026-03-15',
      userId: parseInt(userId),
      categoryId: 1
    }
  });

  // Add an INCOME transaction (categoryId 9 = "Salary")
  await page.request.post(`${API}/api/transactions`, {
    data: {
      amount: 4500.00,
      description: 'March salary',
      transactionDate: '2026-03-01',
      userId: parseInt(userId),
      categoryId: 9
    }
  });

  return { userId: parseInt(userId) };
}


test.describe('History Page — UI Rendering', () => {

  test('HT-01  History page loads with all core elements', async ({ page }) => {
    await setupUserWithTransactions(page);

    // Navigate to history
    await page.goto(`${BASE}/history`);

    // Navbar
    await expect(page.getByRole('heading', { name: '💰 SmartWallet' })).toBeVisible();
    await expect(page.getByRole('button', { name: '← Dashboard' })).toBeVisible();

    // Page heading
    await expect(page.getByRole('heading', { name: 'Transaction History' })).toBeVisible();

    // Filter section
    await expect(page.getByText('FILTER BY MONTH')).toBeVisible();
    await expect(page.locator('input[type="month"]')).toBeVisible();
  });

  test('HT-02  Transactions are displayed with correct formatting', async ({ page }) => {
    await setupUserWithTransactions(page);
    await page.goto(`${BASE}/history`);

    // The expense transaction should show with a minus sign and "RON"
    await expect(page.getByText('-150 RON').or(page.getByText('150 RON'))).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Supermarket shopping')).toBeVisible();

    // The income transaction should show with a plus sign
    await expect(page.getByText('+4,500 RON').or(page.getByText('+4500 RON').or(page.getByText('4500 RON').or(page.getByText('4,500 RON'))))).toBeVisible();
    await expect(page.getByText('March salary')).toBeVisible();

    // Each row has edit and delete action buttons
    const editButtons = page.getByRole('button', { name: '✏️' });
    await expect(editButtons.first()).toBeVisible();

    const deleteButtons = page.getByRole('button', { name: '🗑️' });
    await expect(deleteButtons.first()).toBeVisible();
  });

});


test.describe('History Page — Empty State', () => {

  test('HT-03  Fresh user with no transactions sees empty message', async ({ page }) => {
    const email = `emptyhistory_${Date.now()}@test.com`;
    const password = 'EmptyHist123';

    await page.request.post(`${API}/api/users/register`, {
      data: { username: 'EmptyUser', email, password }
    });

    await page.goto(`${BASE}/login`);
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(`${BASE}/dashboard`, { timeout: 10000 });

    await page.goto(`${BASE}/history`);

    // With no transactions, the list shows the empty-state message
    await expect(page.getByText('No transactions found.')).toBeVisible();
  });

});


test.describe('History Page — Month Filter', () => {

  test('HT-04  Filtering by month shows only matching transactions', async ({ page }) => {
    await setupUserWithTransactions(page);
    await page.goto(`${BASE}/history`);

    // Both transactions are from 2026-03; filter to that month
    await page.locator('input[type="month"]').fill('2026-03');

    // Both transactions should still be visible
    await expect(page.getByText('Supermarket shopping')).toBeVisible();
    await expect(page.getByText('March salary')).toBeVisible();
  });

  test('HT-05  Filtering by a month with no data shows empty message', async ({ page }) => {
    await setupUserWithTransactions(page);
    await page.goto(`${BASE}/history`);

    // Filter to a month that has no transactions
    await page.locator('input[type="month"]').fill('2025-01');

    await expect(page.getByText('No transactions found.')).toBeVisible();
  });

  test('HT-06  Clear button removes the filter and shows all transactions', async ({ page }) => {
    await setupUserWithTransactions(page);
    await page.goto(`${BASE}/history`);

    // Apply a filter first
    await page.locator('input[type="month"]').fill('2025-01');
    await expect(page.getByText('No transactions found.')).toBeVisible();

    // The "Clear" button appears only when a filter is active
    await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible();
    await page.getByRole('button', { name: 'Clear' }).click();

    // All transactions should be visible again
    await expect(page.getByText('Supermarket shopping')).toBeVisible();
    await expect(page.getByText('March salary')).toBeVisible();
  });

  test('HT-07  Clear button is not visible when no filter is applied', async ({ page }) => {
    await setupUserWithTransactions(page);
    await page.goto(`${BASE}/history`);

    // Without a filter, the Clear button should not exist in the DOM
    await expect(page.getByRole('button', { name: 'Clear' })).not.toBeVisible();
  });

});


test.describe('History Page — Inline Edit', () => {

  test('HT-08  Clicking edit button reveals an input field and Save button', async ({ page }) => {
    await setupUserWithTransactions(page);
    await page.goto(`${BASE}/history`);

    // Click the edit button on the first transaction row
    await page.getByRole('button', { name: '✏️' }).first().click();

    // An inline input for editing the amount appears
    const editInput = page.locator('input[type="number"]');
    await expect(editInput).toBeVisible();

    // The "Save" button appears next to the input
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
  });

  test('HT-09  Saving an edited amount updates the displayed value', async ({ page }) => {
    await setupUserWithTransactions(page);
    await page.goto(`${BASE}/history`);

    // Click edit on the expense row (first edit button)
    await page.getByRole('button', { name: '✏️' }).first().click();

    // Clear the existing value and type a new amount
    const editInput = page.locator('input[type="number"]');
    await editInput.clear();
    await editInput.fill('999');

    // Save the updated amount
    await page.getByRole('button', { name: 'Save' }).click();

    // The updated amount should now appear in the row
    await expect(page.getByText('999 RON')).toBeVisible({ timeout: 5000 });

    // The edit input should no longer be visible (exit edit mode)
    await expect(page.getByRole('button', { name: 'Save' })).not.toBeVisible();
  });

});


test.describe('History Page — Delete Transaction', () => {

  test('HT-10  Deleting a transaction removes it from the list', async ({ page }) => {
    await setupUserWithTransactions(page);
    await page.goto(`${BASE}/history`);

    // Confirm both transactions are present before deleting
    await expect(page.getByText('Supermarket shopping')).toBeVisible();

    // Count transaction rows before deletion
    const rowCountBefore = await page.getByRole('button', { name: '🗑️' }).count();

    // Delete the first transaction
    await page.getByRole('button', { name: '🗑️' }).first().click();

    // There should now be one fewer delete button
    await expect(page.getByRole('button', { name: '🗑️' })).toHaveCount(rowCountBefore - 1, { timeout: 5000 });
  });

});


test.describe('History Page — Navigation', () => {

  test('HT-11  "← Dashboard" button navigates back to /dashboard', async ({ page }) => {
    await setupUserWithTransactions(page);
    await page.goto(`${BASE}/history`);

    await page.getByRole('button', { name: '← Dashboard' }).click();

    await expect(page).toHaveURL(`${BASE}/dashboard`);
    await expect(page.getByText('CURRENT BALANCE')).toBeVisible();
  });

});
