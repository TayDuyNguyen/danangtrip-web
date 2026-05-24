# Route Plan: Blog theo Danh mục (user-blog-by-category)

- **Date**: 2026-05-24
- **Feature Slug**: `user-blog-by-category`

---

## 1. Route Configuration & App Router Tree

The feature runs on the existing `/blog` route, which uses the query parameters state representation to capture category selections.

- **Route Path**: `/blog?category_id={id}`
- **Route Group**: `src/app/[locale]/(main)/(public)/blog/page.tsx`
- **Route Status**: **Active**
- **Auth Protected**: **No** (Public access)

No changes are required in `src/config/routes.ts` because the base route path `/blog` (`ROUTES.BLOG`) is already active.

---

## 2. Server vs Client Boundaries

Since query parameters (`category_id`, `page`) drive the dynamic posts list rendering, and the user interacts with the tabs and sidebar by clicking, we preserve the Client Component strategy for the page:

- **`src/app/[locale]/(main)/(public)/blog/page.tsx`**: Client Component (marked with `"use client"`). It uses local React states and registers `Suspense` wraps for child components.
- **`src/features/blog/components/BlogContent.tsx`**: Client Component (`"use client"`). Obtains `category_id` from URL search parameters, queries the backend using react-query, handles sorting and paginations.
- **`src/features/blog/components/BlogSidebar.tsx`**: Client Component. Renders interactive popular posts and tags.

---

## 3. i18n & Navigation Sync

- **next-intl Navigation**: Direct navigation to different categories will route via standard URL parameter patching (e.g. `router.push("/blog?category_id=X")`).
- **Translation Namespace**: The `blog` namespace is utilized for all headings, counts, page labels, and skeleton screen accessibility descriptions. The localized translation files (`vi/blog.json` and `en/blog.json`) will be updated with:
  - `empty_category_title` / `empty_category_desc`
  - `invalid_category_title` / `invalid_category_desc`

---

## 4. Expected File Modifications
1. `src/features/blog/components/BlogContent.tsx` - Layout and routing query changes.
2. `src/messages/vi/blog.json` / `src/messages/en/blog.json` - i18n message keys synchronization.
