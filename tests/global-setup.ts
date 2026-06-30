/**
 * global-setup.ts
 * Runs ONCE before all tests. Logs in via the real UI, waits for Zustand
 * to hydrate, then saves cookies + localStorage to auth-state.json.
 * Every subsequent test starts with a fully-authenticated browser context.
 */
import { chromium, request as playwrightRequest } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const API_BASE   = 'http://127.0.0.1:8000/api/v1';
const APP_BASE   = 'http://localhost:3000';
const STATE_PATH = 'test-results/auth-state.json';
const SCREENSHOTS = 'test-results/screenshots';

export default async function globalSetup() {
  // Ensure output dirs exist
  fs.mkdirSync(SCREENSHOTS, { recursive: true });
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });

  console.log('\n════════════════════════════════════════════');
  console.log('  GLOBAL SETUP: Login + Save Storage State');
  console.log('════════════════════════════════════════════');

  // ── 1. Create test booking via API ───────────────────────────────────────
  const apiCtx = await playwrightRequest.newContext();
  const loginRes = await apiCtx.post(`${API_BASE}/auth/login`, {
    data: { email: 'qa-tester@example.com', password: 'password123' }
  });

  let apiToken = '';
  if (loginRes.ok()) {
    const ld = await loginRes.json();
    apiToken = ld.data?.token || ld.token || ld.data?.access_token || '';
  }

  if (apiToken) {
    const bookRes = await apiCtx.post(`${API_BASE}/bookings`, {
      headers: { Authorization: `Bearer ${apiToken}`, Accept: 'application/json' },
      data: {
        tour_id: 1,
        tour_schedule_id: 200,
        quantity_adult: 2,
        quantity_child: 1,
        quantity_infant: 0,
        customer_name: 'QA Tester',
        customer_email: 'qa-tester@example.com',
        customer_phone: '0987654321',
        customer_address: '123 Test Street, Da Nang',
        customer_note: 'QA automated test booking.',
        payment_method: 'cash'
      }
    });
    if (bookRes.ok()) {
      const bd = await bookRes.json();
      console.log(`  ✓ API booking created: ID=${bd.data?.id} Code=${bd.data?.booking_code}`);
    } else {
      console.warn(`  ⚠ Booking create: ${bookRes.status()} — ${await bookRes.text()}`);
    }
  } else {
    console.warn('  ⚠ API login failed — no test booking created');
  }
  await apiCtx.dispose();

  // ── 2. Login via browser UI (captures real cookies + localStorage) ────────
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page    = await context.newPage();

  try {
    console.log('  Opening login page...');
    await page.goto(`${APP_BASE}/vi/login`);
    await page.waitForLoadState('networkidle');

    await page.fill('input[type="email"]',    'qa-tester@example.com');
    await page.fill('input[type="password"]', 'password123');

    const loginApiDone = page.waitForResponse(
      r => r.url().includes('/auth/login') && r.status() === 200,
      { timeout: 40000 }
    );
    await page.click('button[type="submit"]');
    await loginApiDone;

    await page.waitForTimeout(4000);
    console.log(`  After login URL: ${page.url()}`);

    await page.goto(`${APP_BASE}/vi`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const isAuthed = await page.evaluate(() => {
      try {
        const raw = localStorage.getItem('auth-storage');
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        return parsed?.state?.isAuthenticated === true;
      } catch { return false; }
    });
    console.log(`  Zustand isAuthenticated: ${isAuthed}`);
  } catch (error) {
    console.warn('  ⚠ Global setup login skipped — guest/unauthenticated tests can still run.');
    console.warn(`    Reason: ${error instanceof Error ? error.message : String(error)}`);
  }

  await context.storageState({ path: STATE_PATH });
  console.log(`  ✓ Auth state saved → ${STATE_PATH}`);

  await browser.close();
  console.log('════════════════════════════════════════════\n');
}
