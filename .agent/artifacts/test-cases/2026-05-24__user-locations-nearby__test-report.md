# Testing & Verification Report: user-locations-nearby

> Feature slug: `user-locations-nearby`
> Date: 2026-05-24
> Scope: `Unit, Integration, Visual & Production Build Quality Gates`

---

## 1) Static Code Quality Gates

We executed the repository's strict baseline validation script to guarantee zero regressions in the shared codebase structure:

```bash
npm run prepush:check
```

This runs the following validation gates sequentially:
1. **ESLint Linter (`eslint`)**: Validates syntax styling, unused variables, and imports formatting.
2. **TypeScript Compiler (`tsc --noEmit`)**: Validates type safety constraints, strict parameter bindings, and Next.js dynamic routing signatures.
3. **Route Integrity Analyzer (`node scripts/check-routes.mjs`)**: Verifies that all path definitions inside `src/config/routes.ts` have corresponding target page files in the `src/app` route tree.
4. **Next Production Bundle Compiler (`next build`)**: Verifies correct Server-Side Rendering (SSR) limits, edge compilation targets, and assets generation.

---

## 2) Feature Integration Test Cases

We designed and executed standard functional verification cases covering all potential client Geolocation permissions and coordinates flows:

### Test Case TC-01: GPS Permission Approved
- **Steps**:
  1. Open `/nearby` in browser.
  2. Approve Geolocation permission dialog.
- **Expected Results**:
  - GPS status pill shifts to `approved` (Green pulse glow).
  - TanStack Query is triggered using coordinates (e.g. `16.0611°N`, `108.2274°E`).
  - Proximity circles and locations cards display calculated distances correctly (e.g. `1.2 km` with NearMe icons).
  - Map simulator pins are plotted at correct projected coordinates.

### Test Case TC-02: GPS Permission Denied
- **Steps**:
  1. Open `/nearby` in browser.
  2. Deny Geolocation permission dialog.
- **Expected Results**:
  - GPS status pill shifts to `denied` (Red warning glow).
  - Scan RADAR animation hides.
  - District snap fallback card banner renders cleanly.
  - Clicking any district (e.g. `Sơn Trà`) overrides coordinates, fires a new API request, plots coordinates on the map grid, and makes pages fully functional.

### Test Case TC-03: Filter & Sort Adjustments
- **Steps**:
  1. Click `Bán kính` radius selectors (e.g. `1 km`, `10 km`).
  2. Select sort filters (e.g. `Đánh giá cao`).
  3. Click Category sliding pills (e.g. `Ẩm thực`).
- **Expected Results**:
  - Radius/Sorting changes instantly trigger react-query updates.
  - Categories pills filter locations locally on client to prevent contract validation issues.
  - Sidebar counts update dynamically (e.g. `"Tìm thấy 3 địa điểm"`).

### Test Case TC-04: Bidirectional Hover Links
- **Steps**:
  1. Hover on List item card.
  2. Move cursor to map pin marker.
- **Expected Results**:
  - Hovering card highlights corresponding map pin (pulses halo) and opens detail popup tooltips.
  - Hovering pin highlights sidebar card with `#8b6a55` active copper borders and background glows.
  - Clicking details link redirects to `/locations/[slug]` successfully.
