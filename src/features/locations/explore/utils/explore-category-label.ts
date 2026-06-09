const TRANSLATED_CATEGORY_SLUGS = [
  "khach-san-homestay",
  "tham-quan",
  "diem-tham-quan",
  "am-thuc",
  "ca-phe-tra-sua",
  "giai-tri",
  "mua-sam",
  "van-hoa",
  "nha-hang",
  "bar-pub",
  "spa-massage",
  "the-thao",
  "giao-duc",
  "y-te",
  "mua-sam-thoi-trang",
] as const;

type TranslatedCategorySlug = (typeof TRANSLATED_CATEGORY_SLUGS)[number];

export function resolveExploreCategoryLabel(
  slug: string,
  fallbackName: string,
  translateCategory: (key: TranslatedCategorySlug) => string
) {
  if ((TRANSLATED_CATEGORY_SLUGS as readonly string[]).includes(slug)) {
    return translateCategory(slug as TranslatedCategorySlug);
  }

  return fallbackName;
}
