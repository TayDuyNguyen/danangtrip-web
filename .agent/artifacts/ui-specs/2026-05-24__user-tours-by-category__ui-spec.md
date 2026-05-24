# UI & Visual Components Specification: Tour theo Danh mục (user-tours-by-category)

- **Date**: 2026-05-24
- **Active Feature**: `user-tours-by-category`

---

## 1. Visual Token Alignment (Wow Factor)
The page implements robust, luxurious design conventions derived from `DESIGN.md` and standard system tokens:
- **Depth and Overlay**: Reuses the thin transparent border shell with glassy depth: `bg-surface-container border-border`.
- **Dynamic Category Emoji frame**: Employs a circular active element hosting category-specific emojis (☀️, 🌙, 🧗, 🌲, 👑, 🏖️, ✈️) acting as an immediate visual marker.
- **Accents**: Anchored around the `#8B6A55` warm copper color schema and dark `#080808` foundations.

---

## 2. Interactive Navigation Components

### Dynamic Hero Section
- **Location**: `CategoryToursClient.tsx`
- **Gradient Overlay**: Uses the custom tailwind gradient: `bg-gradient-to-tr from-primary/10 to-transparent`.
- **Title Block**: Bold typography (`font-black`) showing the category name and its specific sub-tagline descriptions dynamically resolved.
- **Path Breadcrumbs**: Upper structural trail `Home / Tours / CategoryName` facilitating intuitive navigation.

### Category Tabs Replacement
- Replaces the generic category filters block with a contextual sticky banner:
  - Back CTA Link: `"← Tất cả Tour"` pointing directly to `/tours` with dynamic translate-x transition on hover.
  - Active Category identifier tag.

---

## 3. Sidebar Filtering & Extension
Rather than introducing redundant components, we extended `FilterSidebar.tsx` cleanly using backwards-compatible interface patterns:
```typescript
interface FilterSidebarProps {
  categories: TourCategory[];
  filters: TourFilterParams;
  onFilterChange: (newFilters: Partial<TourFilterParams>) => void;
  onReset: () => void;
  showCategoryFilter?: boolean; // Default = true
}
```
Within the category listing page, `showCategoryFilter={false}` is injected to hide the category checkboxes section, leaving all other inputs (Price boundary sliders, Durations checkboxes, Departure date range calendar, Reset button) fully operational.

---

## 4. Motion & Rhythm Choreography
Uses staggered transition reveals to ensure visual fluidity during layout loading:
- **Hero & Breadcrumb**: `reveal-up` (0ms delay)
- **Top contextual back-navigation bar**: `reveal-up` with `style={{ animationDelay: "100ms" }}`
- **Toolbar & Sorting actions**: `reveal-up` with `style={{ animationDelay: "200ms" }}`
- **Tour Grid cards**: Renders staggered pulse state loading blocks before showing cards.
- **Pagination controls**: `reveal-up` with `style={{ animationDelay: "400ms" }}`
