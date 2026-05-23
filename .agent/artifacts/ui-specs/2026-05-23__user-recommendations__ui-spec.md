# UI Specification Report - user-recommendations

- **Date:** 2026-05-23
- **Feature Slug:** `user-recommendations`
- **Aesthetic DNA:** Dark theme, Volumetric Glass surfaces, soft accent highlights `#8B6A55`.

---

## 1. Grid & Layout Hierarchy

We applied the full bleed composition rules from `DESIGN.md`:

- **Container Bounds:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10`
- **Layout Rhythm:** Base rhythm of `4px` vertical sizing rules:
  - Space between breadcrumb & header: `12px` (space-y-12)
  - Space between header & content grid: `40px` (space-y-10)
  - Inner card gap: `24px` (gap-6)
- **Responsive Breakpoints:**
  - **Mobile (< 768px):** Single column `grid-cols-1 gap-4`.
  - **Tablet (768px - 1024px):** Two columns `grid-cols-2 gap-6`.
  - **Desktop (>= 1024px):** Three or four columns `grid-cols-3 xl:grid-cols-4 gap-6`.

---

## 2. Shapes & Rounding DNA

- **Cards:** Corresponds to `7px` rounded corners in `DESIGN.md` via pre-built `LocationCard` and `TourCard`.
- **Reason Tags:** Corresponds to `9999px` rounded pills:
  - CSS: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono`
- **CTAs / Button Actions:** Pill-shaped actions (`rounded-full`) matching primary visual accent triggers.

---

## 3. Elevation & Glass Treatments

We anchored the components to glassy translucent surfaces:
- **Tab Control Bar:** Translucent border `#262626` base with highlight `bg-[#8b6a55]` sliding underline.
- **Empty & Error Cards:** `bg-[#080808]/20 border border-[#262626] rounded-2xl backdrop-blur-md` creating depth and soft shadow moments on the dark matrix field.

---

## 4. timing & Motion Choreography

All entrance reveals adhere to the expressive motion level constraints:
- **Classes:** Custom `reveal-up` transition transitions combined with dynamic tailwind animate fades.
- **Rhythm:** Timings stagger at exact `100ms` intervals (`style={{ animationDelay: `${index * 100}ms` }}`) to maintain motion pace across locations and tours.

---

## 5. UI Component Specifications

### 5.1 ReasonTag
- **Props:** `reason: 'viewed' | 'similar_favorite' | 'popular' | 'booked'`
- **Visuals:** Custom status outline colors:
  - `viewed` -> Amber tag (`bg-amber-500/10 text-amber-400 border-amber-500/20`) with compass icon.
  - `similar_favorite` -> Red tag (`bg-red-500/10 text-red-400 border-red-500/20`) with heart icon.
  - `booked` -> Emerald tag (`bg-emerald-500/10 text-emerald-400 border-emerald-500/20`) with trending icon.
  - `popular` -> Blue tag (`bg-blue-500/10 text-blue-400 border-blue-500/20`) with map marker pin.

### 5.2 RecommendationGrid
- **Client State:** `activeTab: 'all' | 'location' | 'tour'`
- **Loaders:** Renders 8 structured skeletons (`h-[380px] bg-surface rounded-xl border border-border animate-pulse`) to prevent layout shifts.
- **Grid Layout:** Combines both locations and tours grids separated by clear linear divider headers.
