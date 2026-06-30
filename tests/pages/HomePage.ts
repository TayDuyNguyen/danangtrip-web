import { expect, type Locator, type Page } from "@playwright/test";
import { HOME_COPY } from "../fixtures/data/home.data";
import { appUrl } from "../helpers/locale-url";

type Locale = "vi" | "en";

export class HomePage {
  readonly page: Page;
  readonly locale: Locale;

  constructor(page: Page, locale: Locale = "vi") {
    this.page = page;
    this.locale = locale;
  }

  get copy() {
    return HOME_COPY[this.locale];
  }

  async goto() {
    await this.page.goto(appUrl("/", this.locale));
    await this.page.waitForLoadState("domcontentloaded");
  }

  headerNavByHref(href: string): Locator {
    return this.page.locator(`header nav a[href="${href}"]`).first();
  }

  async clickHeaderNav(href: string) {
    const link = this.headerNavByHref(href);
    await link.scrollIntoViewIfNeeded();
    await Promise.all([
      this.page.waitForURL(new RegExp(`${href.replace(/\//g, "\\/")}`), { timeout: 20000 }),
      link.click(),
    ]);
  }

  async openMobileMenu() {
    await this.page.getByRole("button", { name: this.copy.openMenu }).click();
  }

  mobileNavLink(label: string): Locator {
    return this.page
      .locator('div[class*="top-24"] nav')
      .getByRole("link", { name: label, exact: true });
  }

  async clickFooterLink(name: string | RegExp, urlPattern: RegExp) {
    const link = this.footerLink(name);
    await link.scrollIntoViewIfNeeded();
    await Promise.all([this.page.waitForURL(urlPattern, { timeout: 15000 }), link.click()]);
  }

  languageSwitcherButton(): Locator {
    return this.page.locator('header button:has(img[src*="/images/lang/"])').first();
  }

  async switchLanguage(target: "vi" | "en") {
    const label = target === "en" ? this.copy.languageEn : this.copy.languageVi;
    await this.languageSwitcherButton().click();
    const option = this.page.locator(".absolute.right-0").getByRole("button", { name: label });
    await option.waitFor({ state: "visible", timeout: 8000 });
    await Promise.all([
      target === "en"
        ? this.page.waitForURL(/\/en/)
        : this.page.waitForURL((url) => !url.pathname.includes("/en")),
      option.click(),
    ]);
  }

  searchInput(): Locator {
    return this.page.getByPlaceholder(this.copy.searchPlaceholder);
  }

  searchSubmitButton(): Locator {
    return this.page.getByRole("button", { name: this.copy.searchButton });
  }

  async searchFor(keyword: string) {
    await this.searchInput().fill(keyword);
    await Promise.all([
      this.page.waitForURL(/\/search\?q=.+&type=/),
      this.searchSubmitButton().click(),
    ]);
  }

  sectionHeading(name: string | RegExp): Locator {
    return this.page.getByRole("heading", { name, level: 2 });
  }

  featuredToursSection(): Locator {
    return this.page.locator("section").filter({
      has: this.page.getByRole("heading", { name: this.copy.featuredToursTitle, level: 2 }),
    });
  }

  hotToursSection(): Locator {
    return this.page.locator("section").filter({
      has: this.page.getByRole("heading", { name: this.copy.hotToursTitle, level: 2 }),
    });
  }

  sectionCarouselNext(section: Locator): Locator {
    return section.getByRole("button", { name: this.copy.next });
  }

  sectionCarouselPrev(section: Locator): Locator {
    return section.getByRole("button", { name: this.copy.prev });
  }

  locationCategoriesSection(): Locator {
    return this.page.locator("section").filter({
      hasText: /Danh mục địa điểm|Location categories/i,
    });
  }

  tourCategoriesSection(): Locator {
    return this.page.locator("section").filter({
      hasText: /Danh mục tour|Tour categories/i,
    });
  }

  footerLink(name: string | RegExp): Locator {
    return this.page.getByRole("contentinfo").getByRole("link", { name });
  }

  footerExternalSocial(): Locator {
    return this.page.getByRole("contentinfo").locator('a[target="_blank"]');
  }

  async expectOnHome() {
    await expect(this.page).toHaveURL(new RegExp(`${this.locale === "en" ? "/en/?$" : "/?$"}`));
    await expect(this.page.getByRole("heading", { name: this.copy.heroTitle, level: 1 })).toBeVisible();
  }

  tourCardLink(slug: string): Locator {
    return this.page.locator(`a[href="/tours/${slug}"], a[href="/en/tours/${slug}"]`).first();
  }

  locationCategoryLink(slug: string): Locator {
    return this.page.locator(`a[href="/categories/${slug}/locations"], a[href="/en/categories/${slug}/locations"]`).first();
  }

  tourCategoryLink(slug: string): Locator {
    return this.page.locator(`a[href="/tour-categories/${slug}/tours"], a[href="/en/tour-categories/${slug}/tours"]`).first();
  }
}
