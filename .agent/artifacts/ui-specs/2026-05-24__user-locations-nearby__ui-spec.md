# UI Specification Report: user-locations-nearby

> Feature slug: `user-locations-nearby`
> Date: 2026-05-24
> Scope: `User Interface Components Architecture & Specifications`

---

## 1) Component Hierarchy & Layout Tree

The `/nearby` screen leverages a split map/list layout structure inside the main public page flow:

```text
PageShell (Header & Footer)
  └── NearbyPage (Server Route wrapper)
        └── NearbyClient (State & Coordinates Controller)
              ├── Page Hero (GPS Status & Radius Controls)
              ├── District Fallback Banner (GPS Blocked overrides)
              └── Main Split Panel Grid (12-cols)
                    ├── Sidebar list (5-cols: Category filters & compact list cards)
                    │     └── LocationCardCompact (Proximity & rating indicators)
                    └── NearbyMapSimulator (7-cols: Schematic visual radar map)
```

---

## 2) Components Specification

### A) `LocationCardCompact.tsx`
- **Purpose**: A compact horizontal item designed to slide on map sidebar lists cleanly.
- **Props**:
  ```typescript
  interface LocationCardCompactProps {
    location: Location & { distance?: number };
    isHighlighted?: boolean;
    onHover?: (hovered: boolean) => void;
  }
  ```
- **Styling Specs**:
  - Outline: `flex gap-4 p-3 bg-[#0a0a0a] border border-[#262626] rounded-xl transition-all duration-300`
  - Active hover: `border-[#8b6a55] bg-[#141210] shadow-[0_0_20px_rgba(139,106,85,0.2)]`
  - Elements: Left Thumbnail image `72px`, Center titles and proximity indicators in `font-mono`, Right animated absolute favorite bookmark button.

### B) `NearbyMapSimulator.tsx`
- **Purpose**: A gorgeous high-fidelity visual simulator that plots absolute geographic points dynamically relative to current device zoom scale and boundaries.
- **Props**:
  ```typescript
  interface NearbyMapSimulatorProps {
    locations: (Location & { distance?: number })[];
    userCoords: { lat: number; lng: number } | null;
    radius: number;
    hoveredLocationId: number | null;
    onMarkerClick: (slug: string) => void;
    onMarkerHover: (id: number | null) => void;
  }
  ```
- **Styling Specs**:
  - Frame: `relative w-full h-full min-h-[400px] bg-[#050505] overflow-hidden border border-[#262626] rounded-2xl`
  - Aesthetic Additions:
    - Dot matrix radial grid overlays representing slow-breathing technical pulses.
    - Schematic coastline SVGs representing Da Nang bay mapping.
    - Current device position markers in breathing Cyan glows.
    - Dynamic location coordinate nodes featuring hover tooltip overlays.

---

## 3) Responsive Layout Rules

| Screen Breakpoint | Grid Column Layout | Map / List Adaptations |
|-------------------|-------------------|------------------------|
| **Desktop (≥1024px)** | `grid-cols-12` | Split flow: Sidebar occupies `col-span-5`, Map occupies `col-span-7`. |
| **Tablet (768-1023px)** | Stacked vertical | Sidebar list occupies top slot, map simulator sits below at fixed height `350px`. |
| **Mobile (<768px)** | Tab Toggle control | Renders dynamic HUD selector: "Xem bản đồ" / "Xem danh sách" toggles, saving precious device estate. |

---

## 4) Interactive UI States Blueprint

- **Loading state**: Renders a pulsing radar scanning wave overlays along with 4 horizontal skeleton cards containing gradient animations.
- **Empty state**: Displays a clean `"No locations found"` card containing quick-select radius increments (5km, 10km, 20km).
- **Error state**: Gracefully intercepts denied Geolocation privileges, displaying the custom district snap panel which enables map functionality immediately.
