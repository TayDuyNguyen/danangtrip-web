# Interaction Specification Report: user-locations-nearby

> Feature slug: `user-locations-nearby`
> Date: 2026-05-24
> Scope: `User Interaction design, Animations, & Edge State Fallbacks`

---

## 1) Core Interaction Loops

We mapped rich visual and behavioral interactions throughout the split screen layout to create a premium, alive product experience:

### A) Bidirectional Hover Highlights (Map ◄═► Sidebar)
- **Hover on List Card**: Triggers `onHover` callback inside `LocationCardCompact` setting the `hoveredLocationId` active state. In the `NearbyMapSimulator` map container, the corresponding coordinate node pulses with an extra scaling ring, and its dynamic detail popup overlay slides open.
- **Hover on Map Pin Marker**: Triggers hover states on the map button, updating the list card with `#8b6a55` active copper borders and background glows, providing instant visual feedback.

### B) Map Controls
- **Zoom In / Zoom Out HUD**: Dynamic buttons at the top right of the map adjusts the zoom scale factor (from `10` to `16`), which immediately recalculates degree grid coordinate percentages, scaling markers, user nodes, and scan radial borders smoothly.
- **Dynamic Popup Tooltip**: Clicking any marker opens a descriptive details card featuring a thumbnail image, review stars, distance readout, and a `"Xem chi tiết →"` redirect link.

### C) Safe District Coordinates Snap Fallback
- If the browser Geolocation API is denied or fails, a custom banner prompts visitors to click pre-calculated Da Nang central district nodes (Hải Châu, Sơn Trà, Ngũ Hành Sơn, Thanh Khê, Liên Chiểu, Cẩm Lệ, Hòa Vang). Clicking a district snaps the map coordinates, recalculates distances, and updates locations instantly.

---

## 2) Micro-Animations Specs

- **Radar scanning circle**: Animated with `animate-[spin_100s_linear_infinite]` and a breathing `animate-pulse` opacity glow.
- **User Pin**: Breathing outer ring using `animate-pulse` combined with an active inner echo ring running `animate-ping`.
- **Card entrances**: Staggered fades matching the product's premium visual standard checklist.
- **Hover transitions**: Fast `duration-300` ease transitions for borders and backgrounds.
