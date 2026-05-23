# Route Plan - user-recommendations

- **Date:** 2026-05-23
- **Feature Slug:** `user-recommendations`
- **Target Route:** `/recommendations` (e.g. `/vi/recommendations` and `/en/recommendations`)
- **Route Group:** `(protected)` under `(main)` layout tree.

---

## 1. Directory Structure Mapping

We are adding the private App Router route structure under the locale dynamic segment:

```text
src/app/[locale]/
└── (main)/
    └── (protected)/
        └── recommendations/
            └── page.tsx        # Server component (registers metadata & sets locale)
```

And feature-specific UI modules are isolated under:

```text
src/features/recommendations/
├── components/
│   ├── ReasonTag.tsx           # Displays custom recommendation reasoning badge
│   └── RecommendationGrid.tsx  # Client component for tabs and list management
└── hooks/
    └── useRecommendationsQuery.ts
```

---

## 2. Server vs. Client Boundary Plan

- **`src/app/[locale]/(main)/(protected)/recommendations/page.tsx` (Server Component):**
  - Responsibilities: Set page locale via `setRequestLocale(locale)`.
  - Compile dynamic page metadata via `generateMetadata()` leveraging `getTranslations` on `recommendations` namespace.
  - Wrap breadcrumbs and visual layout (Breadcrumb, Hero).
  - Mount `<RecommendationGrid />`.
  - Keep boundary clean (no React state or effects at route level).

- **`src/features/recommendations/components/RecommendationGrid.tsx` (Client Component):**
  - Responsibilities: Maintain client state for active filter tab (`'all' | 'location' | 'tour'`).
  - Wire custom TanStack query hook `useRecommendationsQuery()`.
  - Handle responsive grid grid-cols breakpoints.
  - Implement entrance delayed reveal motion rules (`reveal-up`).

---

## 3. i18n Namespace Registrations

This feature utilizes three distinct translation dictionaries:

1. **`recommendations` (Newly created):** Translates Meta, Title, Subtitle, Breadcrumb, Tabs (All, Locations, Tours), Empty state alerts, and Error banners.
2. **`locations` (Existing):** Reused by `LocationCard` for district, price labels, and rating labels.
3. **`tour` (Existing):** Reused by `TourCard` for duration, participants, and starting price details.

---

## 4. Route Constants & Middleware Alignment

1. **`src/config/routes.ts`:**
   - Modified to append `RECOMMENDATIONS: "/recommendations"` in the `PROTECTED_ROUTES` map.
   - Automatically included in `ROUTES` barrel export.
2. **`src/middleware.ts`:**
   - Modified to append `"/recommendations"` to `protectedRoutes` array.
   - Triggers edge redirection logic for guest users, preserving query parameters and redirecting back on successful authentication.
