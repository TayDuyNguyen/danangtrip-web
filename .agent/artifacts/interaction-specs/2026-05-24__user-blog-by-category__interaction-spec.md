# Interaction Specification: Blog theo Danh mục (user-blog-by-category)

- **Date**: 2026-05-24
- **Feature Slug**: `user-blog-by-category`

---

## 1. User Actions Matrix

| Trigger | Component | Action | Validation / Params | Feedback |
|---|---|---|---|---|
| **Click Tab** | `BlogCategoryScrollRow` | Select a blog category. | Updates URL to `/blog?category_id={id}` (or deletes param for "All Posts"). Resets page. | active style change, grid refetches. |
| **Click Sidebar Item** | `BlogSidebar` | Select a blog category. | Updates URL to `/blog?category_id={id}` (or deletes param for "All Posts"). Resets page. | active style change, grid refetches. |
| **Search Input** | `BlogHero` | Filter blog list by title/excerpt. | Local filter of loaded posts (existing behavior). | results count updates. |
| **Click Pagination** | `StandardPagination` | Page navigation. | Updates URL parameter `page` (retains `category_id`). | scroll to grid top, queries refetches. |
| **Click Reset CTA** | `BlogContent` | Reset all filters. | Resets `category_id` and `page` parameters in URL. | Category resets to "All Posts". |

---

## 2. URL-Synced Query State

We will utilize `useSearchParams` and standard router navigation helpers to maintain synchronization between the UI and URL search parameters:

- **State mappings**:
  - `category_id` -> maps to `filters.category_id`
  - `page` -> maps to `filters.page`
- **Navigation flow**:
  - Clicks to select a category update the `category_id` in URL search parameters and reset the `page` query parameter (deleting the `page` parameter to default to page 1).
  - Standard pagination updates the `page` query parameter in URL, keeping `category_id` intact.
  - Reset action deletes all custom parameters, returning the route path to `/blog`.

---

## 3. i18n Impact & Messages Sync

We will ensure the following translation messages are defined in both `vi/blog.json` and `en/blog.json` namespace arrays:

### Vietnamese (`vi/blog.json`)
```json
{
  "empty_category_title": "Chưa có bài viết trong danh mục này",
  "empty_category_desc": "Hãy thử khám phá các danh mục hấp dẫn khác của chúng tôi.",
  "invalid_category_title": "Danh mục không tồn tại",
  "invalid_category_desc": "Danh mục bạn tìm kiếm không hợp lệ hoặc đã bị xóa."
}
```

### English (`en/blog.json`)
```json
{
  "empty_category_title": "No articles in this category yet",
  "empty_category_desc": "Please explore our other exciting categories.",
  "invalid_category_title": "Category not found",
  "invalid_category_desc": "The category you are looking for is invalid or has been deleted."
}
```

No raw hardcoded user-facing strings will be written in the code.
