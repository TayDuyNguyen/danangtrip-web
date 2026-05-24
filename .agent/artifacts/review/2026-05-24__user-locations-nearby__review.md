# Code Review Report: user-locations-nearby

> Feature slug: `user-locations-nearby`
> Date: 2026-05-24
> Scope: `Codebase Integrity, Design Systems Compliance, & Technical Audits`

---

## 1) Architectural Compliance Checklist

We conducted a complete codebase review of the implemented files for the public GPS locations scanner screen, verifying alignment against the repository operating rules in `.agent/rules/PROJECT_RULES.md`:

| Operating Rule | Checked Files | Evaluation Status | Review Findings & Observations |
|---|---|---|---|
| **Feature Isolation** | `src/features/locations/nearby` | **PASS** | Nearby features reside strictly inside their designated feature path. Does not import sibling feature components. |
| **Data Fetching Boundaries** | `useNearbyLocations.ts` & `location.service.ts` | **PASS** | Transport concerns reside in `locationService`. Components do not issue direct Axios fetches. Caches query values safely. |
| **TypeScript Strictness** | All added TSX/TS files | **PASS** | Strictly typed properties interfaces. Verified linter cleanliness with zero instances of raw typescript compiler errors. |
| **i18n & Localizations** | `locations.json` (vi & en) | **PASS** | Zero hardcoded user-facing strings in reusable presentation code. Fully localized keys aligned across both dictionaries. |
| **Aesthetic Design Tokens** | All layout files | **PASS** | Seamless integration with `#080808` dark backgrounds, `#8b6a55` copper buttons, and a clean, light Google-themed interactive map with bright OpenStreetMap tile layers. |
| **UI scrollbar Polish** | `globals.css` | **PASS** | Hand-crafted `.custom-scrollbar` utility providing a subtle, thin (`6px`) white/gray scrollbar, replacing browser-default ugly white scrollbars. |

---

## 2) Code Walkthrough & Auditing Details

### A) Target Server Routing (`page.tsx`)
- **Review**: Implements asynchronous parameter parsing (`params: Promise<{ locale: string }>`) and translations loading matching Next.js 16 and React 19 standards, avoiding dynamic lookup runtime regressions.

### B) Sidebar Proximity Item (`LocationCardCompact.tsx`)
- **Review**: Horizontal compact list layout matching split screens. Replaced the outer `Link` tag with a clickable `div` that triggers coordinate pinning on click. Individually wrapped only the thumbnail image and title text in `Link` wrappers to support direct detail click-through navigation, preventing map refetch collisions. Styled selected cards with a solid copper border.

### C) Interactive Map Simulator (`NearbyMapSimulator.tsx`)
- **Review**: Header bar retains status, GPS coords, and zoom controls. The floating preview details card has been completely removed to leave the map view unobstructed. Replaced the active Google Maps `iframe` with a dynamic `LeafletNearbyMap` loaded with SSR disabled. Added custom header navigation controls linked to Leaflet's zoom setters.

### D) Interactive Leaflet Map Component (`LeafletNearbyMap.tsx`) (NEW)
- **Review**: Integrates Leaflet and Leaflet Routing Machine.
- **Custom Markers**:
  - **User Marker**: Styled as a bright blue Google Maps pulsing dot (`bg-[#1a73e8]` with white border).
  - **Destination Marker**: Styled as a bright red Google Maps pin (`#ea4335` SVG).
- **Custom Routing Line**: Configured to draw a white background route line (`weight: 6`) overlayed with a blue Google Maps routing line (`#1a73e8`, `weight: 4`).
- **SSR Safety**: Wrapped conditional script binding within `typeof window !== "undefined"` checks and added ESLint rule overrides for dynamic import require statements.
