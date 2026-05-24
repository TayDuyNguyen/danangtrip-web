# Interactions & Responsive Specifications: Tour theo Danh mục (user-tours-by-category)

- **Date**: 2026-05-24
- **Active Feature**: `user-tours-by-category`

---

## 1. Interaction Maps

### Sorting Dropdown
- Trigger: Selecting an option in the minimalist Select element.
- Action:
  1. Splices selection string `[sortBy]-[sortOrder]` (e.g., `price_adult-asc`).
  2. Updates URL parameters using Next.js router.
  3. React-Query reactive hook detects parameter shift and dispatches queries.

### Sidebar Reset
- Trigger: Button click on `Xóa tất cả`.
- Action: Dispatches `clearFilters` resetting parameters to base category URL (i.e. `/tour-categories/{slug}/tours`).

### Dynamic Navigation Link
- Trigger: Link click on `← Tất cả Tour`.
- Action: Performs next-intl localized transitions routing back to the general `/tours` search grid.

---

## 2. Responsive Breakpoint Layouts
- **Desktop (>= 1024px)**:
  - Flex layout with two columns: Sidebar (`w-72` shrink-0, sticky) + Results Content (`flex-1`).
- **Tablet / Mobile (< 1024px)**:
  - Single column with full results grid.
  - Sidebar hidden by default.
  - A prominent "Bộ lọc" active button triggers toggling `showMobileFilters` rendering state, displaying the filter drawer beautifully.

---

## 3. Empty & Error CTA Flows
- If database results are empty:
  - Employs non-intrusive `📭` inbox frame.
  - Renders primary CTA "Khám phá Tour ngay" sending users back to search other listings.
  - Renders secondary CTA "Xóa tất cả" resetting filters.
- If network connection fails:
  - Renders dynamic "Vui lòng thử lại" action block with solid action triggers calling `refetch()` directly.
