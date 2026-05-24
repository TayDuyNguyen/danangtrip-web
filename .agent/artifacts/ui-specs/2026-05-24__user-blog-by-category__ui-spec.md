# UI Specification: Blog theo Danh mục (user-blog-by-category)

- **Date**: 2026-05-24
- **Feature Slug**: `user-blog-by-category`

---

## 1. Design Token Alignment

We will strictly follow the design guidelines in `DESIGN.md`:

- **Primary / Accent Color**: `#8B6A55` (Brown/Gold accent) used for active category highlights, borders, and hover states.
- **Background**: `#080808` (Dark Mode foundation)
- **Surfaces**: `#030303` (Glassmorphic cards & panels)
- **Inactive / Muted text**: `#a3a3a3` (Tailwind neutral-400)
- **Transitions**: Smooth animations with 300ms hover speeds and entry slide-up effects.

---

## 2. Component Breakdown

| Component | Type | Layer | Path | Reason |
|---|---|---|---|---|
| `BlogCategoryScrollRow` | [REUSE] | Molecule | `src/features/blog/components/BlogCategoryScrollRow.tsx` | Reuses the scroll arrows horizontal wrapper. |
| `BlogSidebar` | [MOD] | Organism | `src/features/blog/components/BlogSidebar.tsx` | Updates comparisons for active category highlighting to type-safe loose validation (`Number(selectedCategoryId) === cat.id`). |
| `BlogContent` | [MOD] | Organism | `src/features/blog/components/BlogContent.tsx` | Wire horizontal category tabs on top, refactor the page load skeleton to preserve layout shell structure, add empty and invalid category views. |
| `BlogSkeleton` | [MOD] | Molecule | `src/features/blog/components/BlogSkeleton.tsx` | Add and export `CategoryTabsSkeleton` component. |
| `PostCard` | [REUSE] | Molecule | `src/features/blog/components/PostCard.tsx` | Reuses without changes. |
| `FeaturedPost` | [REUSE] | Molecule | `src/features/blog/components/FeaturedPost.tsx` | Reuses without changes. |

---

## 3. UI States Matrix

### 3.1 Category Tabs Row
- **Loading**: `CategoryTabsSkeleton` renders 5 animated grey pills of varying widths.
- **Active State**: The active tab button (including "All Posts" or category) has a brown bottom border `border-b-2 border-[#8B6A55] text-white font-semibold`.
- **Inactive State**: `border-b-2 border-transparent text-[#a3a3a3] hover:text-white`.

### 3.2 Main Content Area
- **Loading**: Displays `FeaturedPostSkeleton` followed by a grid of 6 `PostCardSkeleton`s.
- **Empty Category State**: Renders an alert box with:
  - Title: `"Chưa có bài viết trong danh mục này"` (VI) / `"No articles in this category yet"` (EN)
  - Subtitle: `"Hãy thử khám phá các danh mục hấp dẫn khác của chúng tôi."` (VI) / `"Please explore our other exciting categories."` (EN)
  - CTA Button: "Xem tất cả" resetting the filters.
- **Invalid Category State**: Renders a 404-style warning:
  - Title: `"Danh mục không tồn tại"` (VI) / `"Category not found"` (EN)
  - Subtitle: `"Danh mục bạn tìm kiếm không hợp lệ hoặc đã bị xóa."` (VI) / `"The category you are looking for is invalid or has been deleted."` (EN)
  - CTA Button: "Quay lại Blog" resetting search parameters.

---

## 4. Responsive Layout & Grid

- **Layout Structure**: 12-column grid.
  - **Desktop (`lg` and above)**: Left column spans 8 cols (`lg:col-span-8`), right Sidebar spans 4 cols (`lg:col-span-4`).
  - **Tablet/Mobile (`md` and below)**: Sidebar collapses below the list, stacking vertically. Left column spans full width.
- **Category Tabs Row**: Full width (`w-full`), horizontal scrollable container using CSS `overflow-x-auto` to fit all viewports cleanly.
