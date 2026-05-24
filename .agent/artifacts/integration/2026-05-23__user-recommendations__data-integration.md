# Data Integration Report - user-recommendations

- **Date:** 2026-05-23
- **Feature Slug:** `user-recommendations`
- **Data Transport Protocol:** Axios 1.15 Client (`axiosInstance`) -> TanStack Query v5 -> React 19 Client UI components.

---

## 1. Unified Query Strategy & Caching

As specified by the universal caching and data integrity rules in `PROJECT_RULES.md` (§21), we implemented a high-performance fetching system:

- **Deduplication Hook:** `<RecommendationGrid />` queries the backend using the isolated `useRecommendationsQuery` hook.
- **Cache Configuration (`staleTime`):** Configured to `5 * 60 * 1000` (5 minutes) to ensure that the recommendations list is cached and not repeatedly requested, significantly reducing database load on Laravel.
- **Query Key:** `["recommendations", undefined]`.
- **Axios Interceptor Integration:** The hook automatically inherits the authentication headers and language localization from the global `axiosInstance` configurations.

---

## 2. Server Response Structure Normalization

The endpoint `GET /api/v1/recommendations` returns a single, unified JSON payload wrapping both entity types:

```typescript
export interface RecommendationResponse {
  locations: Location[];
  tours: Tour[];
}
```

- **Location cards:** Iterates `locations` array, passes standard `Location` properties to `LocationCard`.
- **Tour cards:** Iterates `tours` array, calculates discount pricingAdult and passes properties to `TourCard`.
- **Reason Tags:** The backend attaches `recommendation_reason` directly to each object (`similar_favorite`, `viewed`, `booked`, `popular`).

---

## 3. UI State Lifecycle Integration

| State | Hook Trigger | Component Behavior |
|---|---|---|
| **Loading** | `isLoading === true` | Mounts `<TabSkeleton />` and 8 structured grid skeletons matching standard Card layout dimensions to prevent Cumulative Layout Shift (CLS). |
| **Error** | `isError === true` | Catch error responses, hide grids, and render a dedicated error panel with a retry action calling `refetch()`. |
| **Empty** | `hasData === false` (locations + tours empty) | Renders explorer CTA layout guiding fresh users to add data by exploring available content. |
| **Success** | `isSuccess === true` | Instantly maps locations and tours into responsive grid panels, rendering respective `ReasonTag` badges below the card container in a stack layout. |
