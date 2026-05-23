# Interaction Specification Report - user-recommendations

- **Date:** 2026-05-23
- **Feature Slug:** `user-recommendations`
- **Focus Area:** Premium user micro-interactions, tab-routing state, dynamic buttons, and stagger timings.

---

## 1. Tab Switching Interactions

We implemented responsive client-side state filtering:

- **State Options:** `'all' | 'location' | 'tour'`
- **Micro-Animations:**
  - Active Tab text changes color to `#8B6A55` (`text-[#8b6a55]`).
  - Active Tab renders an absolute bottom sliding underline, animated into place using `animate-in fade-in zoom-in-95 duration-300`.
  - Inactive Tab text color dims to `text-on-surface-subtle` and transitions on hover with `hover:text-[#8b6a55]/80 transition-all duration-300`.

---

## 2. Card Interactions

Each grid item wraps pre-built standard interactive components:

- **Hover States:**
  - Main Card: Glass border scales dynamically and shadows expand smoothly (`hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-700`).
  - Image scaling: Inside the image aspect box, hover triggers scale transitions (`group-hover:scale-110 duration-1000`).
- **Click Path Actions:**
  - Card link triggers locale-aware routing using next-intl `Link`:
    - Locations: `/locations/{slug}`
    - Tours: `/tours/{slug}`

---

## 3. Empty & Error Triggers

- **Empty State Split CTAs:**
  - "Khám phá Địa điểm": redirects user to `/locations` (active route, PASS).
  - "Khám phá Tour": redirects user to `/tours` (active route, PASS).
  - Interactive scale compression on active press (`active:scale-95`).
- **Error State Retry:**
  - "Thử lại" button hooks directly into the TanStack Query `refetch()` handler.
  - Hover states animate the opacity highlight (`bg-[#8b6a55] hover:bg-[#a67c63] transition-all duration-300`).

---

## 4. Entrance Motion Rhythm

- **Timing Increment:** Timings stagger at exact `100ms` delay intervals (`Reveal delay`) based on item index.
- **Rhythm values:** `style={{ animationDelay: `${index * 100}ms` }}`.
- **Visual Entrance:** Upward translate motion (`reveal-up`) combined with soft opacity transition, ensuring zero CLS and premium first impressions.
