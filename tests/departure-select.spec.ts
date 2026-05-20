import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Tour Departure Select Visual & Functional Verification', () => {
  test('Log in, verify departures page, and complete the booking redirect flow', async ({ page }) => {
    test.setTimeout(180000);
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(`[CONSOLE][${msg.type()}] ${msg.text()}`);
    });

    page.on('request', request => {
      console.log(`[HTTP REQ][${request.method()}] ${request.url()}`);
    });

    page.on('response', response => {
      console.log(`[HTTP RES][${response.status()}] ${response.url()}`);
    });

    const screenshotsDir = path.join('d:', 'DATN', 'danangtrip-web', 'test-results', 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    try {
      // 1. Perform Authentication (since book page is protected)
      console.log('Navigating to Login page...');
      await page.goto('http://localhost:3000/vi/login');
      await page.waitForTimeout(5000); // Allow login page form inputs to be ready

      console.log('Filling in credentials...');
      await page.locator('input[type="email"]').fill('qa-tester@example.com');
      await page.locator('input[type="password"]').fill('password123');

      // Screenshot login state
      await page.screenshot({ path: path.join(screenshotsDir, 'web_auth_login_filled.png') });

      console.log('Submitting login...');
      // Wait for the login response
      const loginResponsePromise = page.waitForResponse(
        response => response.url().includes('/auth/login') && response.status() === 200,
        { timeout: 15000 }
      );
      await page.locator('button[type="submit"]').click();
      await loginResponsePromise;
      console.log('Login API request completed successfully!');
      
      // Wait 2 seconds for cookies to settle
      await page.waitForTimeout(2000);
      
      // Capture post-login screenshot
      await page.screenshot({ path: path.join(screenshotsDir, 'web_auth_login_result.png') });

      // 2. Navigate to Vietnamese Departures Page
      console.log('Navigating to Tour Departures page in Vietnamese...');
      await page.goto('http://localhost:3000/vi/tours/tour-hoi-an-rung-dua/departures');

      // Verify title and page header (high timeout for next dev compilation)
      const headerVi = page.locator('h1');
      await expect(headerVi).toBeVisible({ timeout: 30000 });
      const headerViText = await headerVi.textContent();
      console.log(`Page Header (VI): ${headerViText}`);

      // Take screenshot of Vietnamese layout
      await page.screenshot({ path: path.join(screenshotsDir, 'web_departure_select_vi.png'), fullPage: true });

      // 3. Switch to English
      console.log('Switching to English locale...');
      await page.goto('http://localhost:3000/en/tours/tour-hoi-an-rung-dua/departures');

      const headerEn = page.locator('h1');
      await expect(headerEn).toBeVisible({ timeout: 30000 });
      const headerEnText = await headerEn.textContent();
      console.log(`Page Header (EN): ${headerEnText}`);

      // Take screenshot of English layout
      await page.screenshot({ path: path.join(screenshotsDir, 'web_departure_select_en.png'), fullPage: true });

      // 4. Test calendar interaction
      console.log('Testing schedule calendar selection...');
      const activeDateCell = page.locator('.grid-cols-7 div.cursor-pointer').first();
      await expect(activeDateCell).toBeVisible();
      
      // Click an active date
      await activeDateCell.click();
      console.log('Clicked on active calendar date!');
      await page.waitForTimeout(1000);

      // 5. Test counters interaction
      console.log('Testing passenger quantity counters...');
      const plusButtons = page.locator('button:has(svg.lucide-plus)');
      const adultIncreaseBtn = plusButtons.nth(0);
      const childIncreaseBtn = plusButtons.nth(1);

      await adultIncreaseBtn.click(); // Adult + 1 = 2
      console.log('Increased Adults quantity to 2');
      await childIncreaseBtn.click(); // Child + 1 = 1
      console.log('Increased Children quantity to 1');
      await page.waitForTimeout(1000);

      // Take screenshot with selected options
      await page.screenshot({ path: path.join(screenshotsDir, 'web_departure_select_selected.png'), fullPage: true });

      // 6. Test redirection to protected booking form
      const buttons = page.locator('button');
      const count = await buttons.count();
      console.log(`Total buttons found on page: ${count}`);
      for (let i = 0; i < count; i++) {
        const text = await buttons.nth(i).innerText();
        console.log(`Button #${i}: text="${text}"`);
      }

      const continueBtn = page.locator('button').filter({ hasText: /(Tiếp tục|Continue)/i }).first();
      await expect(continueBtn).toBeVisible({ timeout: 10000 });
      console.log('Scrolling continue button into view...');
      await continueBtn.scrollIntoViewIfNeeded();
      await expect(continueBtn).toBeEnabled();
      console.log('Continue button is enabled. Clicking to proceed to checkout via page.evaluate...');
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => /(Tiếp tục|Continue)/i.test(b.innerText || ''));
        if (btn) {
          console.log('[E2E-EVAL] Found button, triggering click event...');
          btn.click();
        } else {
          console.log('[E2E-EVAL] Button NOT found!');
        }
      });
      
      // Wait for a few seconds to let any client routing run
      await page.waitForTimeout(5000);
      
      // Log the URL and save screenshot after clicking continue
      console.log(`Current URL after continue click: ${page.url()}`);
      await page.screenshot({ path: path.join(screenshotsDir, 'web_departure_select_after_continue.png'), fullPage: true });

      // Wait for the booking form page navigation
      await page.waitForURL('**/book**', { timeout: 90000 });
      console.log(`Successfully redirected! Final URL: ${page.url()}`);
      expect(page.url()).toContain('/book');
      expect(page.url()).toContain('schedule_id=');

      // Take screenshot of the booking form
      await page.screenshot({ path: path.join(screenshotsDir, 'web_booking_form_redirected.png'), fullPage: true });
    } finally {
      console.log('\n--- Console Logs during test ---');
      consoleLogs.forEach(log => console.log(log));
      console.log('--- End of Console Logs ---\n');
    }
  });
});
