/**
 * visual-test.ts
 * Mở browser, chụp ảnh màn hình thực tế của toàn bộ luồng:
 *  1. Trang chủ
 *  2. Redirect auth (chưa đăng nhập → /login)
 *  3. Trang login
 *  4. Trang đặt tour theo mã (sau khi inject cookie thủ công)
 *  5. Responsive breakpoints
 */
import { chromium, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE   = 'http://localhost:3000';
const SS_DIR = path.resolve('test-results', 'visual-test');

fs.mkdirSync(SS_DIR, { recursive: true });

const capture = async (page: Page, name: string, fullPage = true) => {
  const filePath = path.join(SS_DIR, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage });
  console.log(`  📸 Chụp: ${name}.png`);
  return filePath;
};

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ──────────────────────────────────────────────────────────
  // 1. Trang chủ — Desktop
  // ──────────────────────────────────────────────────────────
  console.log('\n[1] Trang chủ Desktop...');
  const ctx1 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pg1  = await ctx1.newPage();
  await pg1.goto(BASE);
  await pg1.waitForLoadState('domcontentloaded');
  await pg1.waitForTimeout(2000);
  await capture(pg1, '01_home_desktop');
  await ctx1.close();

  // ──────────────────────────────────────────────────────────
  // 2. Trang chủ — Mobile
  // ──────────────────────────────────────────────────────────
  console.log('[2] Trang chủ Mobile...');
  const ctx2 = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  const pg2 = await ctx2.newPage();
  await pg2.goto(BASE);
  await pg2.waitForLoadState('domcontentloaded');
  await pg2.waitForTimeout(2000);
  await capture(pg2, '02_home_mobile');
  await ctx2.close();

  // ──────────────────────────────────────────────────────────
  // 3. Auth redirect — /bookings/code/BK-1008 → /login
  // ──────────────────────────────────────────────────────────
  console.log('[3] Auth redirect test...');
  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const pg3  = await ctx3.newPage();
  await pg3.goto(`${BASE}/bookings/code/BK-1008`);
  await pg3.waitForTimeout(2000);
  console.log(`    Redirected to: ${pg3.url()}`);
  await capture(pg3, '03_auth_redirect_to_login');
  await ctx3.close();

  // ──────────────────────────────────────────────────────────
  // 4. Trang Login
  // ──────────────────────────────────────────────────────────
  console.log('[4] Trang login...');
  const ctx4 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const pg4  = await ctx4.newPage();
  await pg4.goto(`${BASE}/login`);
  await pg4.waitForLoadState('domcontentloaded');
  await pg4.waitForTimeout(1500);
  await capture(pg4, '04_login_page');

  // Điền form login
  await pg4.fill('input[type="email"]', 'test@example.com');
  await pg4.fill('input[type="password"]', 'password123');
  await capture(pg4, '05_login_form_filled', false);
  await ctx4.close();

  // ──────────────────────────────────────────────────────────
  // 5. Booking detail page với mock API route
  // ──────────────────────────────────────────────────────────
  console.log('[5] Booking by code page (mock API)...');
  const ctx5 = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    // Inject token cookie để bypass middleware
    storageState: {
      cookies: [{
        name: 'token',
        value: 'mock-token-qa-123',
        domain: 'localhost',
        path: '/',
        expires: 1800000000,
        httpOnly: false,
        secure: false,
        sameSite: 'Lax'
      }],
      origins: [{
        origin: 'http://localhost:3000',
        localStorage: [
          {
            name: 'auth-storage',
            value: JSON.stringify({
              state: {
                isAuthenticated: true,
                user: { id: 2, name: 'QA Tester', email: 'qa-tester@example.com' },
                token: 'mock-token-qa-123'
              },
              version: 0
            })
          },
          {
            name: 'token',
            value: 'mock-token-qa-123'
          }
        ]
      }]
    }
  });
  const pg5 = await ctx5.newPage();

  pg5.on('console', msg => console.log(`    🖥️ [CONSOLE ${msg.type()}] ${msg.text()}`));
  pg5.on('pageerror', err => console.log(`    🛑 [PAGE ERROR] ${err.stack || err.message}`));
  pg5.on('request', req => {
    const url = req.url();
    if (url.includes('/api/') || url.includes('/auth/')) {
      console.log(`    ➡️ [REQ] ${req.method()} ${url}`);
    }
  });
  pg5.on('response', res => {
    const url = res.url();
    if (url.includes('/api/') || url.includes('/auth/')) {
      console.log(`    ⬅️ [RES] ${res.status()} ${url}`);
    }
  });

  // Mock tất cả API calls
  await pg5.route('**/auth/me', r => r.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ code: 200, data: { id: 2, name: 'QA Tester', email: 'qa-tester@example.com' } })
  }));
  await pg5.route('**/api/v1/auth/me', r => r.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ code: 200, data: { id: 2, name: 'QA Tester', email: 'qa-tester@example.com' } })
  }));
  await pg5.route('**/api/v1/user/bookings/code/**', r => r.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({
      code: 200, message: 'Success',
      data: {
        id: 12, booking_code: 'BK-1008', user_id: 2,
        customer_name: 'Nguyễn Văn An', customer_email: 'nguyenvanan@gmail.com',
        customer_phone: '0905123456', customer_address: 'Đà Nẵng',
        customer_note: 'Có trẻ em nhỏ đi kèm',
        total_amount: 2200000, discount_amount: 0, final_amount: 2200000,
        deposit_amount: 0, payment_method: 'vnpay', payment_status: 'paid',
        booking_status: 'confirmed', cancellation_reason: null,
        booked_at: '2026-05-21T13:30:00Z', confirmed_at: '2026-05-21T13:35:00Z',
        cancelled_at: null, completed_at: null,
        booking_items: [{
          id: 15, booking_id: 12, tour_id: 5, tour_schedule_id: 8,
          item_type: 'tour', item_name: 'Tour Bà Nà Hills 1 Ngày',
          travel_date: '2026-05-25', quantity_adult: 2, quantity_child: 1,
          quantity_infant: 0, unit_price_adult: 850000, unit_price_child: 500000,
          unit_price_infant: 0, subtotal: 2200000, status: 'active',
          tour: { id: 5, name: 'Tour Bà Nà Hills 1 Ngày', slug: 'tour-ba-na-hills-1-ngay', thumbnail: '/images/tours/banahills.jpg' }
        }]
      }
    })
  }));
  await pg5.route('**/api/v1/user/bookings/*/cancel', r => r.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ code: 200, message: 'Success', data: {} })
  }));

  await pg5.goto(`${BASE}/bookings/code/BK-1008`);
  await pg5.waitForLoadState('domcontentloaded');
  await pg5.waitForTimeout(3000);
  console.log(`    Current URL: ${pg5.url()}`);
  await capture(pg5, '06_booking_by_code_desktop');

  // Tablet
  await pg5.setViewportSize({ width: 768, height: 1024 });
  await pg5.waitForTimeout(500);
  await capture(pg5, '07_booking_by_code_tablet');

  // Mobile
  await pg5.setViewportSize({ width: 390, height: 844 });
  await pg5.waitForTimeout(500);
  await capture(pg5, '08_booking_by_code_mobile');

  // English locale
  await pg5.setViewportSize({ width: 1280, height: 900 });
  await pg5.goto(`${BASE}/en/bookings/code/BK-1008`);
  await pg5.waitForLoadState('domcontentloaded');
  await pg5.waitForTimeout(2000);
  await capture(pg5, '09_booking_by_code_en');

  // Check cancel button
  await pg5.goto(`${BASE}/bookings/code/BK-1008`);
  await pg5.waitForLoadState('domcontentloaded');
  await pg5.waitForTimeout(2500);
  const cancelBtn = pg5.locator('button').filter({ hasText: /Hủy đơn hàng/i }).first();
  const cancelVisible = await cancelBtn.isVisible().catch(() => false);
  console.log(`    Cancel button visible: ${cancelVisible}`);
  if (cancelVisible) {
    await cancelBtn.click();
    await pg5.waitForTimeout(1000);
    await capture(pg5, '10_cancel_dialog', false);
    const textarea = pg5.locator('textarea').first();
    if (await textarea.isVisible().catch(() => false)) {
      await textarea.fill('Lý do hủy đơn hàng chi tiết hơn 10 ký tự');
      await capture(pg5, '11_cancel_with_reason', false);
    }
  } else {
    await capture(pg5, '10_page_final_state');
  }

  await ctx5.close();

  // ──────────────────────────────────────────────────────────
  // 6. English home page
  // ──────────────────────────────────────────────────────────
  console.log('[6] English Home...');
  const ctx6 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pg6  = await ctx6.newPage();
  await pg6.goto(`${BASE}/en`);
  await pg6.waitForLoadState('domcontentloaded');
  await pg6.waitForTimeout(2000);
  await capture(pg6, '12_home_english');
  await ctx6.close();

  await browser.close();

  console.log('\n══════════════════════════════════════════');
  console.log('  Visual test hoàn tất!');
  console.log(`  Screenshots lưu tại: ${SS_DIR}`);
  console.log('══════════════════════════════════════════\n');
})().catch(e => { console.error(e); process.exit(1); });
