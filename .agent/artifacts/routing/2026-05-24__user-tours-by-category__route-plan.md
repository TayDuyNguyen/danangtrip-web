# Routing & Internationalization Plan: Tour theo Danh mục (user-tours-by-category)

- **Date**: 2026-05-24
- **Active Feature**: `user-tours-by-category`

---

## 1. Route Layout Conventions
The target route is registered in the public App Router layout tree:
- **Root Locale Path**: `src/app/[locale]/(main)/(public)/tour-categories/[slug]/tours/page.tsx`
- **Link Builder helper** in `src/config/routes.ts`:
  ```typescript
  CATEGORY_TOURS: (slug: string) => `/tour-categories/${slug}/tours`,
  ```

---

## 2. Dynamic SEO Metadata Generation
To ensure high search engine authority, the server-rendered page fetches available categories on the boundary and resolves the active category name dynamically:
```typescript
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  let categoryName = resolvedParams.slug;
  try {
    const res = await tourService.getCategories();
    if (res.success && res.data) {
      const categoryList = extractItems<TourCategory>(res.data);
      const cat = categoryList.find(c => c.slug === resolvedParams.slug);
      if (cat) categoryName = cat.name;
    }
  } catch {
    categoryName = resolvedParams.slug.charAt(0).toUpperCase() + resolvedParams.slug.slice(1);
  }
  return {
    title: `${categoryName} | Đà Nẵng Trip`,
    description: t("subtitle"),
  };
}
```

---

## 3. Localization Scope Registry
Translations are fully synchronized between English and Vietnamese message dictionaries inside the `"tour.category"` namespace:

### Vietnamese (`src/messages/vi/tour.json`)
```json
"category": {
  "back_to_all": "← Tất cả Tour",
  "results_count": "Tìm thấy {count} tour trong danh mục {category}",
  "empty_title": "Chưa có tour nào trong danh mục này",
  "empty_desc": "Thử đặt lại các bộ lọc hoặc quay lại xem tất cả các tour khác."
}
```

### English (`src/messages/en/tour.json`)
```json
"category": {
  "back_to_all": "← All Tours",
  "results_count": "Found {count} tours in category {category}",
  "empty_title": "No tours found in this category",
  "empty_desc": "Try resetting the filters or go back to view all other tours."
}
```

All dynamic variables `{count}` and `{category}` are properly parameterized under the `useTranslations` context.
