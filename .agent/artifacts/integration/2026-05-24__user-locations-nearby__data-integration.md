# Data Integration Report: user-locations-nearby

> Feature slug: `user-locations-nearby`
> Date: 2026-05-24
> Scope: `Data Fetching, Geolocation Integration, & Coordinates Mapping`

---

## 1) Data Flow Architecture

The data integration for the GPS scanning screen flows seamlessly from browser APIs and backend services into state caches and view elements:

```text
Browser Geolocation API (Device lat/lng coordinates)
  │
  ├──► useNearbyLocations (Custom Query Hook)
  │      │
  │      ├──► React Query Cache (staleTime: 5 mins, QueryKey: ['locations', 'nearby', lat, lng, radius, sortBy])
  │      │      │
  │      │      └──► locationService.getNearby (Axios HTTP Client transport)
  │      │             │
  │      │             └──► GET /v1/locations/nearby (Backend Laravel DB subquery)
  │      │
  │      └─► Return Location[] (includes parsed `distance: number` & `category` details)
  │
  └──► NearbyClient
         ├──► Client-side locally filtered results by Selected Category Slug
         ├──► Render compact list items to Sidebar
         └──► Project geographic degree points onto percentage map grids
```

---

## 2) Key Integration Mechanics

### A) Geolocation Hook Binding (`useNearbyLocations.ts`)
- Leverages `navigator.geolocation.getCurrentPosition` with configuration settings:
  - `enableHighAccuracy: true` to guarantee premium GPS signals.
  - `timeout: 10000` (10 seconds) to prevent frozen browser loops.
  - `maximumAge: 60000` (60 seconds) to cache coordinates and limit battery drainage.
- Automatically handles fallback snap coordinates (`setManualCoordinates`) for manual district snaps.

### B) TanStack Query Integration
- Data loading is deferred (`enabled: !!coords`) until valid coordinates are resolved.
- Query keys are bound hierarchically to coordinates, selected search radius, and sorting criteria to automatically trigger refetching when controls change:
  `["locations", "nearby", coords.lat, coords.lng, radius, sortBy]`

### C) Safe Client-Side Category Filtration
- To prevent N+1 queries or break the locked API schema validator, category sorting is filtered dynamically on the client side:
  ```typescript
  const filteredLocations = useMemo(() => {
    if (selectedCategorySlug === "all") return locations;
    return locations.filter((loc) => {
      if (typeof loc.category === "object" && loc.category !== null) {
        return (loc.category as { slug: string }).slug === selectedCategorySlug;
      }
      return loc.category?.toLowerCase() === selectedCategorySlug.toLowerCase();
    });
  }, [locations, selectedCategorySlug]);
  ```
