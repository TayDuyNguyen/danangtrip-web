# Route Plan Report: user-locations-nearby

> Feature slug: `user-locations-nearby`
> Date: 2026-05-24
> Scope: `Route, Layout, Metadata, & i18n Configurations`

---

## 1) Target Route Structure

We are implementing the `/nearby` public screen. Next.js App Router route structure will be created under:

```text
src/app/[locale]/(main)/(public)/
└── nearby/
    └── page.tsx      # Target page router
```

This ensures it runs inside the public layout (with the standard Header & Footer app shells) and inherits the dynamic locale context (`[locale]`) cleanly.

---

## 2) Config Route Addition

### `src/config/routes.ts`
Added `NEARBY: "/nearby"` to the `PUBLIC_ROUTES` constant to ensure routing helpers (`isPublicRoute`) and UI link elements recognize the new page seamlessly.

---

## 3) Multi-Language i18n Keys Alignment

We synchronized localized translation keys in the `"nearby"` namespace for both Vietnamese and English locales.

### touched files:
1. `src/messages/vi/locations.json`
2. `src/messages/en/locations.json`

### Added keys cover:
- Page headings & descriptions.
- GPS states (Pinpointing, Denied, Active update times).
- Radius selection units and sliders.
- Result counts & sorting options (Proximity, Star rating, Popularity).
- Dynamic custom map simulator markers and popups.
- Fallback instructions for manual district navigation in Da Nang.

---

## 4) SEO & Metadata Blueprint

Inside the dynamic App Router page (`page.tsx`), we will configure standard Next.js page metadata:

```typescript
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const isEn = params.locale === "en";
  return {
    title: isEn ? "Discover Da Nang Tourist Places Near You | DanangTrip" : "Tìm Địa điểm du lịch gần bạn ở Đà Nẵng | DanangTrip",
    description: isEn 
      ? "Scan your GPS location to easily discover nearby tourist spots, restaurants, cafes, and entertainment in Da Nang, complete with interactive map routing." 
      : "Quét vị trí GPS hiện tại của bạn để tìm nhanh các điểm tham quan, ẩm thực, khu vui chơi gần đây ở Đà Nẵng với chỉ dẫn khoảng cách và bản đồ mượt mà.",
    openGraph: {
      title: isEn ? "Da Nang Nearby Locations Scanner" : "Tìm địa điểm gần đây tại Đà Nẵng",
      type: "website",
    }
  };
}
```

---

## 5) Navigation Links Policy

To respect project rules regarding planned routes:
- The route `/nearby` is now a verified active route.
- A "Dia diem lan can" (Nearby Places) discovery button or action will be dynamically rendered on the main `/locations` page, encouraging visitors to activate GPS scanner mode easily without cluttering the global top header navigation unnecessarily.
