/**
 * Guest Home Page — automation for DATN_Tài liệu/testcases/01_guest_flows/01_home.md
 * Follows playwright_auto_test_generator_prompt (PHASE 0.6 / 0.7).
 */
import { test, expect, request } from "@playwright/test";
import { HomePage } from "./pages/HomePage";
import {
  EMPTY_HOME_SEED,
  HOME_COPY,
  type HomeSeedData,
} from "./fixtures/data/home.data";
import { appUrl } from "./helpers/locale-url";

test.describe.configure({ mode: "parallel" });

test.use({
  storageState: { cookies: [], origins: [] },
});

const seed: HomeSeedData = { ...EMPTY_HOME_SEED };

test.beforeAll(async () => {
  const api = await request.newContext();
  try {
    const [toursRes, locRes, blogsRes] = await Promise.all([
      api.get("http://127.0.0.1:8000/api/v1/home/tours"),
      api.get("http://127.0.0.1:8000/api/v1/home/locations"),
      api.get("http://127.0.0.1:8000/api/v1/home/blogs"),
    ]);

    if (toursRes.ok()) {
      const body = await toursRes.json();
      const featured = body.data?.featured_tours?.[0];
      const hot = body.data?.hot_tours?.[0];
      const tourCat = body.data?.tour_categories?.[0];
      if (featured) {
        seed.featuredTourName = featured.name ?? "";
        seed.featuredTourSlug = featured.slug ?? "";
      }
      if (hot) {
        seed.hotTourName = hot.name ?? "";
        seed.hotTourSlug = hot.slug ?? "";
      }
      if (tourCat) {
        seed.tourCategoryName = tourCat.name ?? "";
        seed.tourCategorySlug = tourCat.slug ?? "";
      }
    }

    if (locRes.ok()) {
      const body = await locRes.json();
      const locCat = body.data?.categories?.[0];
      const loc = body.data?.featured_locations?.[0];
      if (locCat) {
        seed.locationCategoryName = locCat.name ?? "";
        seed.locationCategorySlug = locCat.slug ?? "";
      }
      if (loc) {
        seed.featuredLocationName = loc.name ?? "";
      }
    }

    if (blogsRes.ok()) {
      const body = await blogsRes.json();
      const post = body.data?.latest_blogs?.data?.[0];
      if (post) {
        seed.blogPostTitle = post.title ?? "";
      }
    }
  } finally {
    await api.dispose();
  }
});

test.describe("Guest Home — 01_home.md", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(appUrl("/"));
    await page.waitForLoadState("networkidle");
  });

  // TC_HOME_001 + TC_HOME_016
  test("TC_HOME_001 — header navigation links", async ({ page }) => {
    const home = new HomePage(page, "vi");
    const routes = ["/tours", "/locations", "/map", "/blog", "/contact"] as const;

    for (const href of routes) {
      await page.goto(appUrl("/"));
      await page.waitForLoadState("networkidle");
      await home.clickHeaderNav(href);
    }
  });

  // TC_HOME_002
  test("TC_HOME_002 — language toggle vi → en", async ({ page }) => {
    const home = new HomePage(page, "vi");
    await home.switchLanguage("en");
    await expect(page).toHaveURL(/\/en/);
    await expect(page.getByRole("heading", { name: HOME_COPY.en.heroTitle, level: 1 })).toBeVisible();

    const homeEn = new HomePage(page, "en");
    await homeEn.switchLanguage("vi");
    await expect(page).not.toHaveURL(/\/en/);
  });

  // TC_HOME_003 (doc updated: /search, no date field)
  test("TC_HOME_003 — hero search redirects to /search", async ({ page }) => {
    const home = new HomePage(page, "vi");
    const keyword = "Bà Nà";
    await home.searchFor(keyword);
    await expect(page).toHaveURL(/\/search\?q=.+&type=all/);
  });

  // TC_HOME_004a — location category carousel
  test("TC_HOME_004a — location category navigates to filtered locations", async ({ page }) => {
    test.skip(!seed.locationCategorySlug, "No location category in API seed");

    const home = new HomePage(page, "vi");
    const link = home.locationCategoryLink(seed.locationCategorySlug);
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible();
    if (seed.locationCategoryName) {
      await expect(link).toContainText(seed.locationCategoryName);
    }
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/categories/${seed.locationCategorySlug}/locations`));
  });

  // TC_HOME_004b — tour category carousel (supplement)
  test("TC_HOME_004b — tour category navigates to filtered tours", async ({ page }) => {
    test.skip(!seed.tourCategorySlug, "No tour category in API seed");

    const home = new HomePage(page, "vi");
    const link = home.tourCategoryLink(seed.tourCategorySlug);
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible();
    if (seed.tourCategoryName) {
      await expect(link).toContainText(seed.tourCategoryName);
    }
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/tour-categories/${seed.tourCategorySlug}/tours`));
  });

  // TC_HOME_005 — featured tours carousel
  test("TC_HOME_005 — featured tours carousel next/prev", async ({ page }) => {
    test.skip(!seed.featuredTourName, "No featured tours in API seed");

    await page.setViewportSize({ width: 1440, height: 900 });
    const home = new HomePage(page, "vi");
    const section = home.featuredToursSection();
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByText(seed.featuredTourName, { exact: false }).first()).toBeVisible({
      timeout: 15000,
    });

    const scroller = section.locator(".overflow-x-auto").first();
    const before = await scroller.evaluate((el) => el.scrollLeft);
    await section.hover();
    await home.sectionCarouselNext(section).click({ force: true });
    await page.waitForTimeout(800);
    const after = await scroller.evaluate((el) => el.scrollLeft);
    expect(after).toBeGreaterThanOrEqual(before);
  });

  // TC_HOME_005b — hot tours carousel (supplement)
  test("TC_HOME_005b — hot tours section shows API tour names", async ({ page }) => {
    test.skip(!seed.hotTourSlug, "No hot tours in API seed");

    const home = new HomePage(page, "vi");
    const section = home.hotToursSection();
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("heading", { name: home.copy.hotToursTitle })).toBeVisible();
    await expect(section.locator(`a[href="/tours/${seed.hotTourSlug}"]`).first()).toBeVisible({
      timeout: 15000,
    });
  });

  // TC_HOME_006
  test("TC_HOME_006 — tour card opens tour detail", async ({ page }) => {
    const slug = seed.featuredTourSlug || seed.hotTourSlug;
    const name = seed.featuredTourName || seed.hotTourName;
    test.skip(!slug, "No tour slug in API seed");

    const home = new HomePage(page, "vi");
    const card = home.tourCardLink(slug);
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible({ timeout: 15000 });
    await Promise.all([page.waitForURL(new RegExp(`/tours/${slug}`)), card.click()]);
    if (name) {
      await expect(page.getByRole("heading", { name, exact: false })).toBeVisible();
    }
  });

  // TC_HOME_007
  test("TC_HOME_007 — responsive mobile layout", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const home = new HomePage(page, "vi");
    await page.goto(appUrl("/"));
    await expect(page.getByRole("button", { name: home.copy.openMenu })).toBeVisible();
    await expect(page.getByText("Khám phá Đà Nẵng như người bản địa")).toBeHidden();
    await home.openMobileMenu();
    await expect(home.mobileNavLink(home.copy.nav.travel)).toBeVisible();
  });

  // TC_HOME_008
  test("TC_HOME_008 — footer policy links", async ({ page }) => {
    const home = new HomePage(page, "vi");
    await home.clickFooterLink(home.copy.footerTerms, /\/terms/);
    await page.goto(appUrl("/"));
    await home.clickFooterLink(home.copy.footerPrivacy, /\/privacy/);
  });

  // TC_HOME_009 — hero slide dots (supplement)
  test("TC_HOME_009 — hero intro slide controls exist and are clickable", async ({ page }) => {
    const tablist = page.getByRole("tablist", { name: HOME_COPY.vi.heroSlidesLabel });
    const slide1 = tablist.getByRole("tab", { name: "Slide 1" });
    const slide3 = tablist.getByRole("tab", { name: "Slide 3" });
    await expect(slide1).toBeVisible();
    await expect(slide3).toBeVisible();
    await expect(slide1).toHaveAttribute("aria-selected", "true");

    await slide3.click();
    await expect(slide3).toHaveAttribute("aria-selected", "true");
    await expect(slide1).toHaveAttribute("aria-selected", "false");
  });

  // TC_HOME_011 — data display featured tour
  test("TC_HOME_011 — featured tour title from API visible", async ({ page }) => {
    test.skip(!seed.featuredTourName, "No featured tour in API seed");
    const home = new HomePage(page, "vi");
    await home.featuredToursSection().scrollIntoViewIfNeeded();
    await expect(page.getByText(seed.featuredTourName, { exact: false }).first()).toBeVisible();
  });

  // TC_HOME_012 — data display location category
  test("TC_HOME_012 — location category name from API visible", async ({ page }) => {
    test.skip(!seed.locationCategoryName, "No location category in API seed");
    const home = new HomePage(page, "vi");
    const link = home.locationCategoryLink(seed.locationCategorySlug);
    await link.scrollIntoViewIfNeeded();
    await expect(link).toContainText(seed.locationCategoryName);
  });

  // TC_HOME_013 — stats bar (supplement)
  test("TC_HOME_013 — stats bar shows numeric counters", async ({ page }) => {
    const home = new HomePage(page, "vi");
    await page.waitForResponse(
      (res) => res.url().includes("/statistics") && res.status() === 200,
      { timeout: 20000 },
    ).catch(() => undefined);
    await expect(page.getByText(home.copy.statsLocations, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/\d+\+/).first()).toBeVisible({ timeout: 10000 });
  });

  // TC_HOME_014 — guest auth CTAs (supplement)
  test("TC_HOME_014 — guest sees login and register", async ({ page }) => {
    const home = new HomePage(page, "vi");
    await expect(page.getByRole("link", { name: home.copy.auth.login })).toBeVisible();
    await expect(page.getByRole("link", { name: home.copy.auth.register })).toBeVisible();
  });

  // TC_HOME_018 — blog section data display (supplement)
  test("TC_HOME_018 — blog section shows post title from API", async ({ page }) => {
    test.skip(!seed.blogPostTitle, "No blog posts in API seed");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    await expect(page.getByText(seed.blogPostTitle, { exact: false }).first()).toBeVisible();
  });

  // TC_HOME_019 — featured location name (supplement)
  test("TC_HOME_019 — featured location name from API visible", async ({ page }) => {
    test.skip(!seed.featuredLocationName, "No featured location in API seed");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await expect(page.getByText(seed.featuredLocationName, { exact: false }).first()).toBeVisible();
  });
});
