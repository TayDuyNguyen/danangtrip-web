# Screen Analysis - Personalized Recommendations Page (/recommendations)

- **Date of Analysis:** 2026-05-23
- **Feature Slug:** `user-recommendations`
- **Route Lock:** `/recommendations`
- **Auth Guard:** 🔐 Authenticated-Only (`jwt.auth` / `protectedRoutes`)

---

## 1. Summary & Scope

- **Purpose:** Present personalized recommended locations and tours based on the authenticated user's history of view log entries, favorites, and completed/active bookings.
- **Actor:** Logged-in customer (guests are automatically redirected to the login flow with a return path).
- **Module/Feature:** `src/features/recommendations` (new isolated feature directory).
- **Screen Type:** Multi-grid view with tabs ("Tất cả", "Địa điểm", "Tour") and card actions.

---

## 2. Design & Token Audit (vs. DESIGN.md)

| Category | Token Required (DESIGN.md) | Proposed Screen Application | Alignment Notes |
|---|---|---|---|
| **Colors** | Background: `#080808`<br>Surface: `#030303`<br>Accent: `#8B6A55`<br>Border: `#262626`<br>Text Secondary: `#FFFFFF` | Background: `#080808`<br>Cards: `#080808` / `#030303` with gradient border<br>Tab Border: `#262626`<br>Tab Active: `#8B6A55` | The SRS recommendation of blue/indigo gradient `#0066CC` and light surfaces must be adapted to conform to the **premium dark brand identity** of DanangTrip. We will use `#8B6A55` as active highlight and glassy dark surfaces instead. |
| **Typography** | Display: `Inter`, heavy weights<br>Copy: `SFMono-Regular` for meta<br>Interface: `Inter` | Title: `Inter 700` text-5xl md:text-7xl<br>Reasons/Meta: `SFMono-Regular` or `Inter font-mono`<br>Body: `Inter 500/600` | Aligned with system typography. |
| **Spacing** | Base Rhythm: `4px` / `8px` / `12px` / `16px` / `24px` | Section Padding: `24px` / `96px` (vertical spacing)<br>Card gaps: `24px` (grid-cols gap) | Consistent with the 4px vertical rhythm token. |
| **Radii** | corner-radii: 4px, 7px, 8px, 12px, 9999px | Wrapper: `8px`<br>Cards: `7px`<br>Badges: `9999px` (pill badges) | Fits standard rounded DNA. |
| **Elevation** | Material: Glass<br>Border: 1px `#262626`<br>Blur: `12px` | Control bar & grid panels: Glass panels with border-accent hover styles. | Aligned with depth tokens. |
| **Motion** | timings: 150ms / 300ms / 700ms / 1000ms<br>easings: ease, cubic-bezier | Grid items: staggered entry reveals using `reveal-up` in 100ms intervals. | High-fidelity motion compliance. |

---

## 3. Component Breakdown

| Component | Type | Layer | Path | Reason |
|---|---|---|---|---|
| `LocationCard` | `[REUSE]` | Molecule | `src/features/locations/components/LocationCard.tsx` | Reuse the verified location card component. Requires wrapping with custom reason overlay if needed. |
| `TourCard` | `[REUSE]` | Molecule | `src/features/tour/components/TourCard.tsx` | Reuse the high-performance tour card with price and countdown details. |
| `ReasonTag` | `[NEW]` | Atom | `src/features/recommendations/components/ReasonTag.tsx` | Pill-shaped reason container showing "Bạn đã xem" or "Được đặt nhiều" depending on the response attribute. |
| `RecommendationGrid` | `[NEW]` | Organism | `src/features/recommendations/components/RecommendationGrid.tsx` | Main grid wrapper containing client tab state, grid layouts, skeletons, and empty state CTA actions. |
| `SearchInput` | `[REUSE]` | Molecule | `src/components/ui/SearchInput.tsx` | Used for UI search integration if requested; initially hidden in baseline dashboard setup. |

---

## 4. Responsive & UI States

| Section | Mobile (< 768px) | Tablet (768px - 1024px) | Desktop (>= 1024px) |
|---|---|---|---|
| **Result Grid** | `grid-cols-1 gap-4` | `grid-cols-2 gap-6` | `grid-cols-3 xl:grid-cols-4 gap-6` |
| **Page Header** | py-12, title size text-4xl | py-16, title size text-5xl | py-24, title size text-7xl |
| **Tabs** | Horizontal scroll overflow | Center/Left justified flex | Left-justified flex-row |

### State Table (Per Section)

| Section / Component | Loading State | Empty State | Error State |
|---|---|---|---|
| **Grid Display** | Displays 8 skeletal pulses (`w-full aspect-[4/5] bg-neutral-900 rounded-xl animate-pulse`) | Displays large volumetric `explore` icon, title, subtitle, and split CTAs pointing to `/locations` and `/tours` | Displays glassy card with red caution icon, error messaging, and a "Thử lại" (Retry) active button |
| **Reason Tag** | Skeleton placeholder (gray oval pulse) | Hidden | Hidden |
| **Active Tabs** | Disables tab clicks (opacity 50%) | Retained | Retained |

---

## 5. Data & API Mapping

- **Primary Source Endpoint:** `GET /api/v1/recommendations`
- **Request Parameters:**
  - `limit`: `number` (optional, default: 12)
- **Response Format (`ApiResponse<RecommendationResponse>`):**
  ```json
  {
    "success": true,
    "data": {
      "locations": [
        {
          "id": 15,
          "name": "Bà Nà Hills",
          "slug": "ba-na-hills",
          "thumbnail": "/images/banahills.jpg",
          "avg_rating": "4.8",
          "review_count": 128,
          "price_min": 850000,
          "recommendation_reason": "similar_favorite"
        }
      ],
      "tours": [
        {
          "id": 2,
          "name": "Tour Ngũ Hành Sơn - Hội An 1 Ngày",
          "slug": "tour-ngu-hanh-son-hoi-an-1-ngay",
          "thumbnail": "/images/hoian.jpg",
          "price_adult": "450000.00",
          "discount_percent": 10,
          "duration": "1 ngày",
          "max_people": 20,
          "avg_rating": "4.7",
          "review_count": 86,
          "recommendation_reason": "booked"
        }
      ]
    }
  }
  ```

### Field Properties & Attributes

| Field Name | Type | Required | Source | Note |
|---|---|---|---|---|
| `id` | `number` | Yes | Location/Tour | Unique identifier |
| `name` | `string` | Yes | Location/Tour | Title for UI display |
| `slug` | `string` | Yes | Location/Tour | Formats the link path |
| `thumbnail` | `string` | No | Location/Tour | Thumbnail image source |
| `avg_rating` | `string` | Yes | Location/Tour | Parsed to float |
| `review_count` | `number` | Yes | Location/Tour | Number of ratings |
| `price_min` | `number \| null` | No | Location | Minimum price of location (locations only) |
| `price_adult` | `string` | Yes | Tour | Base price per adult (tours only) |
| `recommendation_reason` | `string` | Yes | SearchService API | Dynamic value: `'viewed' \| 'similar_favorite' \| 'popular' \| 'booked'` |

---

## 6. Business, Auth & i18n Review

### Business Rules
1. **Empty Recommendation Fallback:** If the user has a fresh history (yielding 0 locations and 0 tours), display a premium Empty State encouraging discovery. In future versions, this could fallback to popular/hot items, but in the first delivery, a clean Empty state with quick access links is the required behavior.
2. **Access Control:** Guest users attempting to load `/recommendations` must be blocked by Edge middleware and routed to `/login?callbackUrl=/recommendations`.
3. **Card Links:** Location links map to `/locations/[slug]`. Tour links map to `/tours/[slug]`.

### i18n Impact
- Requires a dedicated namespace: `recommendations`.
- Vietnamese dictionary `vi/recommendations.json` and English dictionary `en/recommendations.json` must be synchronized in the same task.
- Import namespaces statically in `src/i18n/request.ts` to guarantee Vercel/Cloudflare Edge worker compatibility (no dynamic `import()` permitted on the Edge).

---

## 7. Assumptions & Open Questions

- **[ASSUMPTION] Client-side Filtering:** We assume client-side filtering across the three tabs ("Tất cả", "Địa điểm", "Tour") is the desired approach, since the backend returns a single unified JSON payload. This saves network bandwidth and provides a 0ms click response.
- **[ASSUMPTION] Reason Tag Icons:** We assume the icons for recommendation reason tags will map to standard Solar icons:
  - `viewed` ("Bạn đã xem") -> `visibility` (Solar eye/view equivalent)
  - `similar_favorite` ("Tương tự yêu thích") -> `favorite` (Solar heart icon)
  - `popular` ("Phổ biến gần bạn") -> `location_on` (Solar pin icon)
  - `booked` ("Được đặt nhiều") -> `trending_up` (Solar trending icon)
