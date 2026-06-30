/**
 * Guest Search Page — automation for DATN_Tài liệu/testcases/01_guest_flows/12_search.md
 */
import { test, expect, request } from "@playwright/test";
import { SearchPage } from "./pages/SearchPage";
import {
  EMPTY_SEARCH_SEED,
  SEARCH_COPY,
  SEARCH_QUERIES,
  type SearchSeedData,
} from "./fixtures/data/search.data";
import { API_BASE } from "./helpers/locale-url";

test.describe.configure({ mode: "parallel" });

test.use({
  storageState: { cookies: [], origins: [] },
});

const seed: SearchSeedData = { ...EMPTY_SEARCH_SEED };

test.beforeAll(async () => {
  const api = await request.newContext();
  try {
    const [tourRes, locRes, suggestRes] = await Promise.all([
      api.get(`${API_BASE}/search?q=${encodeURIComponent(SEARCH_QUERIES.keyword)}&type=tour&per_page=1`),
      api.get(`${API_BASE}/search?q=${encodeURIComponent(SEARCH_QUERIES.broad)}&type=location&per_page=1`),
      api.get(`${API_BASE}/search/suggestions?q=${SEARCH_QUERIES.suggestPrefix}&limit=5`),
    ]);

    if (tourRes.ok()) {
      const body = await tourRes.json();
      const tour = body.data?.results?.data?.[0];
      if (tour) {
        seed.tourName = tour.name ?? "";
        seed.tourSlug = tour.slug ?? "";
      }
      seed.tourTotal = Number(body.data?.results?.total ?? 0);
    }

    if (locRes.ok()) {
      const body = await locRes.json();
      const loc = body.data?.results?.data?.[0];
      if (loc) {
        seed.locationName = loc.name ?? "";
        seed.locationSlug = loc.slug ?? "";
      }
    }

    if (suggestRes.ok()) {
      const body = await suggestRes.json();
      const items = body.data?.suggestions ?? [];
      const first = items.find((i: { name?: string }) => i?.name);
      if (first?.name) seed.suggestionTitle = first.name;
    }
  } finally {
    await api.dispose();
  }
});

test.describe("Guest Search — 12_search.md", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  // TC_SEARCH_001
  test("TC_SEARCH_001 — URL q prefills input and shows found_results", async ({ page }) => {
    const search = new SearchPage(page, "vi");
    await search.goto(SEARCH_QUERIES.keyword);
    await page.waitForLoadState("networkidle");

    await expect(search.searchInput()).toHaveValue(SEARCH_QUERIES.keyword);
    await search.expectFoundResultsFor(SEARCH_QUERIES.keyword);
  });

  // TC_SEARCH_002 (doc corrected: 3 tabs, no Blog)
  test("TC_SEARCH_002 — tabs All / Tour / Location filter results", async ({ page }) => {
    const search = new SearchPage(page, "vi");
    await search.goto(SEARCH_QUERIES.broad, { type: "all" });
    await page.waitForLoadState("networkidle");

    await expect(search.tab(search.copy.tabs.all)).toBeVisible();
    await expect(search.tab(search.copy.tabs.tour)).toBeVisible();
    await expect(search.tab(search.copy.tabs.location)).toBeVisible();
    await expect(page.getByRole("button", { name: /Bài viết|Blog/i })).toHaveCount(0);

    await search.clickTab(search.copy.tabs.tour, "tour");
    await expect(page).toHaveURL(/type=tour/);
    await expect(page.getByText(search.copy.badges.tour).first()).toBeVisible({ timeout: 15000 });

    await search.clickTab(search.copy.tabs.location, "location");
    await expect(page).toHaveURL(/type=location/);
    await expect(page.getByText(search.copy.badges.location).first()).toBeVisible({ timeout: 15000 });

    await search.clickTab(search.copy.tabs.all, "all");
    await expect(page).toHaveURL(/type=all/);
  });

  // TC_SEARCH_003
  test("TC_SEARCH_003 — empty state with trending chips", async ({ page }) => {
    const search = new SearchPage(page, "vi");
    await search.goto(SEARCH_QUERIES.empty, { type: "all" });
    await page.waitForResponse(
      (res) => res.url().includes("/search") && res.status() === 200,
      { timeout: 20000 },
    ).catch(() => undefined);

    await expect(search.emptyStateTitle()).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(search.copy.empty.subtitle)).toBeVisible();
    const chips = page.locator("button.rounded-full").filter({ hasText: /.+/ });
    await expect(chips.first()).toBeVisible({ timeout: 15000 });
  });

  // TC_SEARCH_004
  test("TC_SEARCH_004 — autosuggestion after 2 characters", async ({ page }) => {
    const search = new SearchPage(page, "vi");
    await search.goto();
    await search.typeForSuggestions(SEARCH_QUERIES.suggestPrefix);

    await expect(page.getByRole("heading", { name: search.copy.suggestions.locationsTitle })).toBeVisible({
      timeout: 20000,
    });

    const suggestion = page
      .locator('[class*="top-[calc(100%+14px)]"]')
      .locator("h4")
      .first();
    await expect(suggestion).toBeVisible({ timeout: 10000 });
    await suggestion.click();
    await expect(page).toHaveURL(/[?&]q=/, { timeout: 15000 });
  });

  // TC_SEARCH_005
  test("TC_SEARCH_005 — discovery mode without query", async ({ page }) => {
    const search = new SearchPage(page, "vi");
    await search.goto();
    await page.waitForLoadState("networkidle");

    await expect(search.discoveryTitle()).toBeVisible();
    await expect(page.getByText(search.copy.discovery.subtitle).first()).toBeVisible();
    await expect(search.resultCardLinks().first()).toBeVisible({ timeout: 20000 });
  });

  // TC_SEARCH_006
  test("TC_SEARCH_006 — tab switch updates URL type param", async ({ page }) => {
    const search = new SearchPage(page, "vi");
    await search.goto(SEARCH_QUERIES.keyword, { type: "all" });
    await page.waitForLoadState("networkidle");

    await search.clickTab(search.copy.tabs.tour, "tour");
    await expect(page).toHaveURL(/type=tour/);
    await search.clickTab(search.copy.tabs.location, "location");
    await expect(page).toHaveURL(/type=location/);
  });

  // TC_SEARCH_007
  test("TC_SEARCH_007 — sort dropdown changes URL sort param", async ({ page }) => {
    const search = new SearchPage(page, "vi");
    await search.goto(SEARCH_QUERIES.keyword, { type: "tour" });
    await page.waitForLoadState("networkidle");

    await expect(search.sortControl()).toBeVisible({ timeout: 15000 });
    await search.changeSort(search.copy.sort.newest);
    await expect(page).toHaveURL(/sort=newest/);
  });

  // TC_SEARCH_008
  test("TC_SEARCH_008 — open advanced filters sheet", async ({ page }) => {
    const search = new SearchPage(page, "vi");
    await search.goto(SEARCH_QUERIES.keyword, { type: "all" });
    await search.openFilters();
    await expect(page.getByRole("button", { name: search.copy.filters.apply })).toBeVisible();
    await page.getByRole("button", { name: search.copy.filters.close }).click();
    await expect(page.getByRole("heading", { name: search.copy.filters.title, level: 2 })).toBeHidden();
  });

  // TC_SEARCH_009 — Enter submits (button covered via onSubmit fix IMP_SEARCH_004)
  test("TC_SEARCH_009 — submit search from input updates URL", async ({ page }) => {
    const search = new SearchPage(page, "vi");
    await search.goto();
    await search.submitSearch(SEARCH_QUERIES.keyword);
    await search.expectFoundResultsFor(SEARCH_QUERIES.keyword);
  });

  // TC_SEARCH_009b — search action button (supplement)
  test("TC_SEARCH_009b — search action button submits query", async ({ page }) => {
    const search = new SearchPage(page, "vi");
    await search.goto();
    await search.submitSearchViaButton(SEARCH_QUERIES.keyword);
    await search.expectFoundResultsFor(SEARCH_QUERIES.keyword);
  });

  // TC_SEARCH_010
  test("TC_SEARCH_010 — result card navigates to tour detail", async ({ page }) => {
    test.skip(!seed.tourSlug, "No tour in search API seed");

    const search = new SearchPage(page, "vi");
    await search.goto(SEARCH_QUERIES.keyword, { type: "tour" });
    await page.waitForLoadState("networkidle");

    const link = search.tourDetailLink(seed.tourSlug);
    await expect(link).toBeVisible({ timeout: 20000 });
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/tours/${seed.tourSlug}`), { timeout: 20000 });
    if (seed.tourName) {
      await expect(page.getByRole("heading", { name: seed.tourName, exact: false })).toBeVisible();
    }
  });

  // TC_SEARCH_011
  test("TC_SEARCH_011 — grid shows tour name from API", async ({ page }) => {
    test.skip(!seed.tourName, "No tour name in API seed");

    const search = new SearchPage(page, "vi");
    await search.goto(SEARCH_QUERIES.keyword, { type: "tour" });
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { level: 3, name: seed.tourName, exact: false }).first()).toBeVisible({
      timeout: 20000,
    });
  });

  // TC_SEARCH_012
  test("TC_SEARCH_012 — pagination navigates to page 2", async ({ page }) => {
    test.skip(seed.tourTotal < 11, "Not enough tour results for pagination");

    const search = new SearchPage(page, "vi");
    await search.goto(SEARCH_QUERIES.keyword, { type: "tour" });
    await page.waitForLoadState("networkidle");

    const page2 = search.paginationButton(2);
    await expect(page2).toBeVisible({ timeout: 20000 });
    await Promise.all([page.waitForURL(/page=2/, { waitUntil: "commit" }), page2.click()]);
  });

  // TC_SEARCH_013
  test("TC_SEARCH_013 — discovery panel shows trending on focus", async ({ page }) => {
    const search = new SearchPage(page, "vi");
    await search.goto();
    await page
      .waitForResponse(
        (res) =>
          (res.url().includes("trending") || res.url().includes("popular")) && res.status() === 200,
        { timeout: 20000 },
      )
      .catch(() => undefined);
    await search.focusSearchInput();
    await expect(search.discoveryPanel().getByText(search.copy.trending.title, { exact: true })).toBeVisible({
      timeout: 15000,
    });
  });

  // TC_SEARCH_014
  test("TC_SEARCH_014 — type=tour URL shows tour results", async ({ page }) => {
    test.skip(!seed.tourSlug, "No tour in API seed");

    const search = new SearchPage(page, "vi");
    await search.goto(SEARCH_QUERIES.keyword, { type: "tour" });
    await page.waitForLoadState("networkidle");

    await expect(search.tourDetailLink(seed.tourSlug)).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(search.copy.badges.tour).first()).toBeVisible();
  });

  // TC_SEARCH_015
  test("TC_SEARCH_015 — English locale search page", async ({ page }) => {
    const search = new SearchPage(page, "en");
    await search.goto(SEARCH_QUERIES.keyword, { type: "all" });
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/en\/search/);
    await expect(search.searchInput()).toHaveValue(SEARCH_QUERIES.keyword);
    await expect(page.getByText(SEARCH_COPY.en.foundResultsPrefix, { exact: false })).toBeVisible();
  });

  // TC_SEARCH_016
  test("TC_SEARCH_016 — location result navigates to location detail", async ({ page }) => {
    test.skip(!seed.locationSlug, "No location in API seed");

    const search = new SearchPage(page, "vi");
    await search.goto(SEARCH_QUERIES.broad, { type: "location" });
    await page.waitForLoadState("networkidle");

    const link = search.locationDetailLink(seed.locationSlug);
    await expect(link).toBeVisible({ timeout: 20000 });
    await Promise.all([page.waitForURL(new RegExp(`/locations/${seed.locationSlug}`)), link.click()]);
  });

  // TC_SEARCH_017
  test("TC_SEARCH_017 — recent search saved after submit", async ({ page }) => {
    const unique = `QA-${Date.now()}`;
    const search = new SearchPage(page, "vi");
    await search.goto();
    await search.submitSearch(unique);
    await search.goto();
    await search.focusSearchInput();
    await expect(page.getByRole("button", { name: unique })).toBeVisible({ timeout: 10000 });
  });
});
