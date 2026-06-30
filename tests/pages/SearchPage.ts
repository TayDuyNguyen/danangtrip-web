import { expect, type Locator, type Page } from "@playwright/test";
import { SEARCH_COPY } from "../fixtures/data/search.data";
import { appUrl } from "../helpers/locale-url";

type Locale = "vi" | "en";

export class SearchPage {
  readonly page: Page;
  readonly locale: Locale;

  constructor(page: Page, locale: Locale = "vi") {
    this.page = page;
    this.locale = locale;
  }

  get copy() {
    return SEARCH_COPY[this.locale];
  }

  async goto(query?: string, params?: Record<string, string>) {
    const search = new URLSearchParams(params);
    if (query) search.set("q", query);
    const qs = search.toString();
    const path = qs ? `/search?${qs}` : "/search";
    await this.page.goto(appUrl(path, this.locale), { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("domcontentloaded");
    await this.searchInput().waitFor({ state: "visible", timeout: 20000 });
  }

  searchInput(): Locator {
    return this.page.getByRole("searchbox", { name: this.copy.inputPlaceholder });
  }

  searchSubmitButton(): Locator {
    return this.page.getByRole("button", { name: this.copy.inputAction });
  }

  async submitSearch(keyword: string) {
    await this.searchInput().click();
    await this.searchInput().pressSequentially(keyword, { delay: 80 });
    await expect(this.searchInput()).toHaveValue(keyword);
    await this.searchInput().press("Enter");
    await expect(this.page).toHaveURL(/[?&]q=/, { timeout: 20000 });
  }

  async submitSearchViaButton(keyword: string) {
    await this.searchInput().click();
    await this.searchInput().pressSequentially(keyword, { delay: 80 });
    await expect(this.searchInput()).toHaveValue(keyword);
    await this.searchSubmitButton().click();
    await expect(this.page).toHaveURL(/[?&]q=/, { timeout: 20000 });
  }

  async submitSearchWithEnter(keyword: string) {
    await this.searchInput().fill(keyword);
    await Promise.all([this.page.waitForURL(/[?&]q=/), this.searchInput().press("Enter")]);
  }

  tab(name: string): Locator {
    return this.page.getByRole("button", { name, exact: true });
  }

  async clickTab(name: string, typeParam: "all" | "tour" | "location") {
    await Promise.all([
      this.page.waitForURL(new RegExp(`type=${typeParam}`)),
      this.tab(name).click(),
    ]);
  }

  filtersButton(): Locator {
    return this.page.getByRole("button", { name: new RegExp(this.copy.filters.title, "i") });
  }

  async openFilters() {
    await this.filtersButton().scrollIntoViewIfNeeded();
    await this.filtersButton().click();
    await expect(this.page.getByRole("button", { name: this.copy.filters.apply })).toBeVisible({
      timeout: 15000,
    });
  }

  sortControl(): Locator {
    return this.page.locator(".dt-select__control").last();
  }

  async changeSort(optionLabel: string) {
    await this.sortControl().click();
    await this.page.locator(".dt-select__option").filter({ hasText: optionLabel }).click();
  }

  resultGrid(): Locator {
    return this.page.locator(".grid.grid-cols-1");
  }

  resultCardLinks(): Locator {
    return this.page.locator('a[href*="/tours/"], a[href*="/locations/"]');
  }

  tourDetailLink(slug: string): Locator {
    const prefix = this.locale === "en" ? "/en/tours/" : "/tours/";
    return this.page.locator(`a[href="${prefix}${slug}"]`).first();
  }

  locationDetailLink(slug: string): Locator {
    const prefix = this.locale === "en" ? "/en/locations/" : "/locations/";
    return this.page.locator(`a[href="${prefix}${slug}"]`).first();
  }

  emptyStateTitle(): Locator {
    return this.page.getByRole("heading", { name: this.copy.empty.title, level: 2 });
  }

  discoveryTitle(): Locator {
    return this.page.getByRole("heading", { name: this.copy.discovery.title, level: 1 });
  }

  suggestionsPanel(): Locator {
    return this.page.locator(".custom-scrollbar").last();
  }

  async focusSearchInput() {
    await this.searchInput().click();
  }

  async typeForSuggestions(prefix: string) {
    await this.focusSearchInput();
    await this.searchInput().pressSequentially(prefix, { delay: 120 });
    await this.page
      .waitForResponse((res) => res.url().includes("suggestions") && res.status() === 200, { timeout: 20000 })
      .catch(() => undefined);
    await this.page.waitForTimeout(600);
  }

  discoveryPanel(): Locator {
    return this.page.locator('[class*="top-[calc(100%+14px)]"]');
  }

  paginationButton(pageNum: number): Locator {
    return this.page.locator(".flex.items-center.gap-2").getByRole("button", { name: String(pageNum), exact: true });
  }

  async expectFoundResultsFor(query: string) {
    await expect(this.page.getByText(this.copy.foundResultsPrefix, { exact: false })).toBeVisible();
    await expect(this.page.locator("strong", { hasText: query })).toBeVisible();
  }
}
