import { test, expect } from '@playwright/test';
import * as path from 'path';

test('Visual Test: Change Password Feature', async ({ page }) => {
  const brainDir = 'C:\\Users\\TUF\\.gemini\\antigravity\\brain\\2662a242-c72a-459e-bc74-454898c72ea0';
  const screenshot1 = path.join(brainDir, 'change_password_1_initial.png');
  const screenshot2 = path.join(brainDir, 'change_password_2_filled_strong.png');
  const screenshot3 = path.join(brainDir, 'change_password_3_success_toast.png');

  console.log('1. Navigating to http://localhost:3000/vi/login');
  await page.goto('http://localhost:3000/vi/login');
  await page.waitForLoadState('networkidle');

  console.log('2. Entering email and password to log in...');
  await page.fill('input[type="email"]', 'hatran@gmail.com');
  await page.fill('input[type="password"]', 'password');
  
  const loginApiDone = page.waitForResponse(
    r => r.url().includes('/auth/login') && r.status() === 200,
    { timeout: 40000 }
  );
  await page.click('button[type="submit"]');
  await loginApiDone;
  await page.waitForTimeout(4000); // Wait for Next.js to fully redirect and update UI

  console.log('3. Navigating to http://localhost:3000/vi/profile/password');
  await page.goto('http://localhost:3000/vi/profile/password');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Ensure form is rendered

  console.log('4. Saving screenshot 1: Initial empty form...');
  await page.screenshot({ path: screenshot1, fullPage: true });

  console.log('5. Filling in Current Password...');
  await page.fill('#current-password', 'password');

  console.log('6. Filling in New Password and Confirm Password (Strong)...');
  await page.fill('#new-password', 'SecurePass123!');
  await page.fill('#confirm-password', 'SecurePass123!');
  await page.waitForTimeout(1000); // Allow UI to update strength meter

  console.log('7. Saving screenshot 2: Strong strength meter and checklist...');
  await page.screenshot({ path: screenshot2, fullPage: true });

  console.log('8. Clicking submit to change password...');
  const changePasswordApiDone = page.waitForResponse(
    r => r.url().includes('/user/password') && r.status() === 200,
    { timeout: 40000 }
  );
  await page.click('#password-change-submit');
  await changePasswordApiDone;

  console.log('9. Waiting for the success toast to appear...');
  const successToast = page.locator(':text("Đổi mật khẩu thành công!")');
  await expect(successToast).toBeVisible({ timeout: 15000 });

  console.log('10. Saving screenshot 3: Success toast and cleared form...');
  await page.screenshot({ path: screenshot3, fullPage: true });

  console.log('Visual Test Completed successfully.');
});
