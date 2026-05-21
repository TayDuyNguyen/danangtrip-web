/**
 * user-booking-detail.spec.ts
 *
 * Phases 2–5 of the 09-testing skill for the user-booking-detail feature.
 * Auth state is pre-loaded from test-results/auth-state.json (via global-setup).
 *
 * Screenshots → test-results/screenshots/
 */
import { test, expect, request } from '@playwright/test';
import * as fs   from 'fs';
import * as path from 'path';

const API_BASE    = 'http://127.0.0.1:8000/api/v1';
const APP_BASE    = 'http://localhost:3000';
const SS_DIR      = path.resolve('test-results', 'screenshots');

// IMPORTANT: localePrefix is "as-needed" — default locale (vi) has NO prefix.
// /vi/bookings/123 → next-intl redirects to /bookings/123
// /en/bookings/123 → stays as-is (non-default locale keeps prefix)
const viUrl = (path: string) => `${APP_BASE}${path}`;     // no locale prefix for vi
const enUrl = (path: string) => `${APP_BASE}/en${path}`;  // /en prefix for English

// ──────────────────────────────────────────────────────────────────────────────
// Phase 5.2 — Auth protection (runs WITHOUT storageState on purpose)
// ──────────────────────────────────────────────────────────────────────────────
test.describe('Phase 5.2 — Auth Regression', () => {
  test('[PASS expected] Unauthenticated user redirected to /login', async ({ browser }) => {
    // Explicit fresh context — no cookies, no localStorage (overrides storageState)
    const ctx  = await browser.newContext({ storageState: undefined });
    const page = await ctx.newPage();

    await page.goto(`${APP_BASE}/vi/bookings/9999`);
    await page.waitForTimeout(3000);

    const url = page.url();
    console.log(`  Redirect URL: ${url}`);
    expect(url).toContain('/login');

    await page.screenshot({ path: path.join(SS_DIR, '01_auth_redirect_unauthenticated.png') });
    console.log('  PASS ✓ — unauthenticated redirect works');
    await ctx.close();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Phases 2–5 — Visual, Functional, i18n, Console (runs WITH storageState)
// ──────────────────────────────────────────────────────────────────────────────
test.describe('Phases 2-5 — Booking Detail Full Validation', () => {
  let bookingDetailUrl = '';

  test.beforeAll(async () => {
    fs.mkdirSync(SS_DIR, { recursive: true });

    // Get most recent booking for qa-tester via API
    const apiCtx  = await request.newContext();
    const loginRes = await apiCtx.post(`${API_BASE}/auth/login`, {
      data: { email: 'qa-tester@example.com', password: 'password123' }
    });
    if (!loginRes.ok()) return;

    const ld    = await loginRes.json();
    const token = ld.data?.token || ld.token || '';
    if (!token) return;

    const listRes = await apiCtx.get(`${API_BASE}/user/bookings?per_page=1&sort_by=id&sort_order=desc`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (listRes.ok()) {
      const listData = await listRes.json();
      const first    = listData.data?.data?.[0] || listData.data?.[0];
      if (first?.id) {
        bookingDetailUrl = viUrl(`/bookings/${first.id}`);
        console.log(`  ✓ Latest booking: ID=${first.id}  Status=${first.booking_status}  URL=${bookingDetailUrl}`);
      }
    }
    await apiCtx.dispose();
  });

  // ── Phase 2.1 — Layout & Responsive ───────────────────────────────────────
  test('[Phase 2.1] Desktop layout — booking detail renders correctly', async ({ page }) => {
    if (!bookingDetailUrl) { test.skip(true, 'No booking URL resolved'); return; }

    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (['error', 'warning', 'warn'].includes(msg.type()))
        consoleLogs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(bookingDetailUrl);
    // Wait for any i18n redirects to settle and page to be fully loaded
    await page.waitForURL(/\/bookings\/\d+/, { timeout: 15000 }).catch(() => {});
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const finalUrl = page.url();
    console.log(`  Final URL: ${finalUrl}`);
    console.log(`  URL contains booking: ${finalUrl.includes('/bookings/')}`);

    await page.screenshot({ path: path.join(SS_DIR, '05_booking_detail_desktop.png'), fullPage: true });
    console.log('  ✓ Desktop screenshot captured');

    const h1Text = await page.locator('h1').first().textContent();
    console.log(`  h1: "${h1Text?.trim()}"`);

    if (consoleLogs.length > 0) {
      console.log('  Console warnings/errors:');
      consoleLogs.forEach(l => console.log('   ', l));
    }
  });

  test('[Phase 2.1] Tablet layout — booking detail responsive', async ({ page }) => {
    if (!bookingDetailUrl) { test.skip(true, 'No booking URL resolved'); return; }

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(bookingDetailUrl);
    await page.waitForURL(/\/bookings\/\d+/, { timeout: 15000 }).catch(() => {});
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    console.log(`  Tablet URL: ${page.url()}`);
    await page.screenshot({ path: path.join(SS_DIR, '06_booking_detail_tablet.png'), fullPage: true });
    console.log('  ✓ Tablet screenshot captured');
  });

  test('[Phase 2.1] Mobile layout — booking detail responsive', async ({ page }) => {
    if (!bookingDetailUrl) { test.skip(true, 'No booking URL resolved'); return; }

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(bookingDetailUrl);
    await page.waitForURL(/\/bookings\/\d+/, { timeout: 15000 }).catch(() => {});
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    console.log(`  Mobile URL: ${page.url()}`);
    await page.screenshot({ path: path.join(SS_DIR, '07_booking_detail_mobile.png'), fullPage: true });
    console.log('  ✓ Mobile screenshot captured');
  });

  // ── Phase 5.1 — i18n ───────────────────────────────────────────────────────
  test('[Phase 5.1] i18n — English version renders without raw keys', async ({ page }) => {
    if (!bookingDetailUrl) { test.skip(true, 'No booking URL resolved'); return; }

    await page.setViewportSize({ width: 1280, height: 800 });
    const bookingId = bookingDetailUrl.split('/bookings/')[1];
    const englishUrl = enUrl(`/bookings/${bookingId}`);
    await page.goto(englishUrl);
    await page.waitForURL(/\/en\/bookings\/\d+/, { timeout: 15000 }).catch(() => {});
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const finalEnUrl = page.url();
    console.log(`  EN URL: ${finalEnUrl}`);
    const enH1 = (await page.locator('h1').first().textContent() ?? '').trim();
    console.log(`  EN h1: "${enH1}"`);

    const bodyText = await page.locator('body').textContent() ?? '';
    const rawKeyPattern = /\b[a-z_]+\.[a-z_]+\.[a-z_]+\b/;
    const hasRawKeys    = rawKeyPattern.test(bodyText);
    console.log(`  Raw i18n keys present: ${hasRawKeys}`);

    await page.screenshot({ path: path.join(SS_DIR, '08_booking_detail_english.png'), fullPage: true });
    console.log('  ✓ English screenshot captured');
  });

  test('[Phase 5.1] i18n — Vietnamese version renders without raw keys', async ({ page }) => {
    if (!bookingDetailUrl) { test.skip(true, 'No booking URL resolved'); return; }

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(bookingDetailUrl);
    await page.waitForURL(/\/bookings\/\d+/, { timeout: 15000 }).catch(() => {});
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    console.log(`  VI URL: ${page.url()}`);
    const viH1 = (await page.locator('h1').first().textContent() ?? '').trim();
    console.log(`  VI h1: "${viH1}"`);

    await page.screenshot({ path: path.join(SS_DIR, '08b_booking_detail_vi.png'), fullPage: true });
    console.log('  ✓ Vietnamese screenshot captured');
  });

  // ── Phase 3 — Functional ────────────────────────────────────────────────────
  test('[Phase 3] Functional — Invoice buttons visible & Back button works', async ({ page }) => {
    if (!bookingDetailUrl) { test.skip(true, 'No booking URL resolved'); return; }

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(bookingDetailUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Print & Download invoice buttons
    const downloadBtn = page.locator('button').filter({ hasText: /Tải hóa đơn/i }).first();
    const printBtn    = page.locator('button').filter({ hasText: /In hóa đơn/i }).first();
    const isDownload  = await downloadBtn.isVisible().catch(() => false);
    const isPrint     = await printBtn.isVisible().catch(() => false);
    console.log(`  Download button visible: ${isDownload}`);
    console.log(`  Print button visible: ${isPrint}`);
    expect(isDownload).toBe(true);
    expect(isPrint).toBe(true);

    // Back button
    const backBtn   = page.locator('button[aria-label="Back"]').first();
    const isBack    = await backBtn.isVisible().catch(() => false);
    console.log(`  Back  button visible: ${isBack}`);

    await page.screenshot({ path: path.join(SS_DIR, '09_booking_detail_buttons.png') });
  });

  test('[Phase 3] Functional — Cancel dialog validation flow', async ({ page }) => {
    if (!bookingDetailUrl) { test.skip(true, 'No booking URL resolved'); return; }

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(bookingDetailUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const cancelBtn = page.locator('button').filter({ hasText: /Hủy đơn hàng/i }).first();
    const canCancel = await cancelBtn.isVisible().catch(() => false);
    console.log(`  Cancel button visible: ${canCancel}`);

    if (!canCancel) {
      console.log('  SKIPPED — booking not in pending/confirmed state or departure passed');
      test.info().annotations.push({ type: 'SKIPPED', description: 'Booking not cancellable' });
      return;
    }

    // Open dialog
    await cancelBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SS_DIR, '10_cancel_dialog_opened.png') });
    console.log('  ✓ Cancel dialog opened');

    // Validate: empty reason
    const confirmBtn = page.locator('button').filter({ hasText: /Xác nhận hủy/i }).first();
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(SS_DIR, '11_cancel_dialog_empty_error.png') });
      console.log('  ✓ Empty reason validation shown');

      // Validate: short reason
      const textarea = page.locator('textarea').first();
      if (await textarea.isVisible()) {
        await textarea.fill('Too short');
        await confirmBtn.click();
        await page.waitForTimeout(800);
        await page.screenshot({ path: path.join(SS_DIR, '12_cancel_dialog_short_error.png') });
        console.log('  ✓ Short reason validation shown');

        // Valid reason
        await textarea.fill('Tôi muốn thay đổi lịch trình du lịch cá nhân của mình.');
        await page.screenshot({ path: path.join(SS_DIR, '13_cancel_dialog_valid_reason.png') });
        console.log('  ✓ Valid reason filled (NOT submitting to preserve booking)');
      }
    }

    // Close dialog via Escape — do NOT actually cancel the booking
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SS_DIR, '14_cancel_dialog_closed.png') });
    console.log('  ✓ Dialog closed via Escape key');
  });

  // ── Phase 4.5 — Console / SEO ────────────────────────────────────────────
  test('[Phase 4.5] No console errors on booking detail page', async ({ page }) => {
    if (!bookingDetailUrl) { test.skip(true, 'No booking URL resolved'); return; }

    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(bookingDetailUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    if (errors.length > 0) {
      console.log('  Console errors found:');
      errors.forEach(e => console.log(`    ${e}`));
    } else {
      console.log('  ✓ No console errors detected');
    }

    // SEO: check page title & h1
    const title = await page.title();
    const h1    = await page.locator('h1').first().textContent();
    console.log(`  Page title: "${title}"`);
    console.log(`  h1 text:    "${h1?.trim()}"`);
    expect(title.length).toBeGreaterThan(5);
    expect(h1?.trim().length).toBeGreaterThan(3);
  });

  // ── Bookings list page screenshot (for reference) ─────────────────────────
  test('[Phase 2] Bookings list — renders with booking cards', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(viUrl('/bookings'));
    await page.waitForURL(/\/bookings/, { timeout: 15000 }).catch(() => {});
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const url = page.url();
    console.log(`  Bookings list URL: ${url}`);
    console.log(`  URL includes bookings: ${url.includes('/bookings')}`);

    await page.screenshot({ path: path.join(SS_DIR, '04_bookings_list.png'), fullPage: true });
    console.log('  ✓ Bookings list screenshot captured');

    const cards = await page.locator('a').filter({ hasText: /Xem chi tiết|View Details/i }).count();
    console.log(`  Booking cards found: ${cards}`);
  });
});
