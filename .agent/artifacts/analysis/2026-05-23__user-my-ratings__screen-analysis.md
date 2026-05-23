# Screen Analysis - My Ratings Page (/profile/ratings)

- **Date of Analysis:** 2026-05-23
- **Feature Slug:** `user-my-ratings`
- **Route Lock:** `/profile/ratings`
- **Auth Guard:** 🔐 Authenticated-Only (`jwt.auth` / `protectedRoutes`)

---

## 1. Summary & Scope

- **Purpose:** Let users view all the reviews they have written for locations and tours, with capabilities to search, filter by type (location/tour) or status (approved/pending/rejected), edit scores and comments, and delete reviews.
- **Actor:** Logged-in customer.
- **Module/Feature:** `src/features/profile/ratings`
- **Screen Type:** Multi-grid view within a protected profile layout side-by-side with profile navigation sidebar.

---

## 2. Design & Token Audit (vs. DESIGN.md)

| Category | Token Required (DESIGN.md) | Proposed Screen Application | Alignment Notes |
|---|---|---|---|
| **Colors** | Background: `#080808`<br>Surface: `#030303`<br>Accent: `#8B6A55`<br>Border: `#262626`<br>Text Secondary: `#FFFFFF` | Background: `#080808`<br>Cards: Glass surface `bg-[#0a0a0a]/60 border-[#262626]` with accent hover<br>Tab Border: `#262626`<br>Tab Active: `#8B6A55` | The SRS recommendation of light surface blue `#0066CC` will be adapted to conform to the **premium dark brand identity** of DanangTrip. We will use `#8B6A55` as active highlight and copper accenting. |
| **Typography** | Display: `Inter` copy: `SFMono-Regular` for meta information | Title: `Inter 700` text-2xl font-bold tracking-tight | Aligned with system typography. |
| **Spacing** | Base Rhythm: `4px` / `8px` / `12px` / `16px` / `24px` | Section padding: `24px`, Card spacing: `16px` | Consistent with standard vertical rhythm. |
| **Radii** | corner-radii: 4px, 7px, 8px, 12px, 9999px | Cards & Modals: `12px` (rounded-xl)<br>Input/Buttons: `8px` (rounded-lg) | Complies with rounded standard DNA. |
| **Elevation** | Material: Glass<br>Border: 1px `#262626` | Control panels & grid panels: Glass cards with border hover animations. | Aligned with depth tokens. |
| **Motion** | timings: 150ms / 300ms / 700ms / 1000ms | Grid items: staggered entry reveals using standard `reveal-up` transition. | Staggered 100ms reveals. |

---

## 3. Component Breakdown

| Component | Type | Layer | Path | Reason |
|---|---|---|---|---|
| `ProfileLayoutWrapper` | `[REUSE]` | Organism | `src/features/profile/components/ProfileLayoutWrapper.tsx` | Standard parent container managing breadcrumbs, layout bounds, and profile sidebar. |
| `RatingCard` | `[NEW]` | Molecule | `src/features/profile/ratings/components/RatingCard.tsx` | Individual card representing a location/tour rating, containing score star bars, action buttons, status labels, and comment body. |
| `EditRatingModal` | `[NEW]` | Organism | `src/features/profile/ratings/components/EditRatingModal.tsx` | Dialog pop-up for editing a rating's star score and comment text, with live character counters. |
| `DeleteRatingDialog` | `[NEW]` | Molecule | `src/features/profile/ratings/components/DeleteRatingDialog.tsx` | Warning alert popup for rating deletion. |
| `MyRatingsClient` | `[NEW]` | Organism | `src/features/profile/ratings/components/MyRatingsClient.tsx` | Master client-side controller orchestrating list loading, tabs filter switching, pagination, and action modals. |

---

## 4. Responsive & UI States

| Section | Mobile (< 768px) | Tablet (768px - 1024px) | Desktop (>= 1024px) |
|---|---|---|---|
| **Ratings List** | Single column full width | Single column full width | Single column full width |
| **Tabs Navigation** | Scroll overflow flex-row | Left flex-row | Left flex-row |
| **Edit Modal** | Full screen overlay | Fixed 500px width dialog | Fixed 500px width dialog |

### State Table (Per Section)

| Section / Component | Loading State | Empty State | Error State |
|---|---|---|---|
| **Ratings List** | Displays 4 skeletal card pulses (`RatingCardSkeleton` with blinking lines) | Standard visual EmptyState with `rate_review` icon, details, and "Khám phá Tour" button routing to `/tours` | Inline caution banner with error description and a "Thử lại" retry button. |
| **Star Selector** | Disabled (opacity 50%) | N/A | Highlight fields in red |

---

## 5. Data & API Mapping

- **Primary Source Endpoint:** `GET /api/v1/user/ratings`
- **Filters Support:** `status` (`'pending' | 'approved' | 'rejected'`), `type` (`'location' | 'tour'`)
- **JSON Payload Format:**
  ```json
  {
    "success": true,
    "data": {
      "data": [
        {
          "id": 12,
          "score": 5,
          "comment": "Rất hài lòng!",
          "status": "approved",
          "rejected_reason": null,
          "helpful_count": 4,
          "created_at": "2026-05-23T10:00:00.000Z",
          "location": {
            "id": 1,
            "name": "Bán đảo Sơn Trà",
            "slug": "ban-dao-son-tra",
            "thumbnail": "locations/sontra.jpg"
          },
          "tour": null
        }
      ],
      "current_page": 1,
      "last_page": 3,
      "per_page": 10,
      "total": 28
    }
  }
  ```

---

## 6. Business, Auth & i18n Review

### Business Rules
1. **Access Guards:** Guests must be blocked by Edge middleware and redirected to login with correct return parameters.
2. **Tab Invalidation:** Click tabs triggers immediate cache fetch with parameters, resetting pagination to page 1.
3. **Card Links:** Clicking location names navigates to `/locations/[slug]`. Tour names navigate to `/tours/[slug]`.

### i18n Impact
- Requires namespace `ratings.json` matching `vi` and `en` exactly. Loaded statically.
