---
name: 04-layout-routing
description: Plan routes, layouts, metadata, locale behavior, and server/client boundaries before implementation. Use when a feature adds or changes pages.
---

# Skill: 04-layout-routing

## Overview

Skill này lập **route plan** cho App Router: route path, metadata, layout, locale behavior, và server/client boundary.
Mục tiêu là để bước code không bị lệch giữa route thật, route config, locale files, và page structure.

## Required Input

- `persona.md`
- `.agent/rules/PROJECT_RULES.md`
- Analysis file từ `01-screen-analysis`
- `src/app/[locale]/`
- `src/config/routes.ts`
- `src/i18n/routing.ts`
- `src/i18n/navigation.ts`
- `src/messages/vi/`
- `src/messages/en/`

## Recommended Questions To Answer

1. Route này nằm ở group nào trong App Router?
2. Có cần page mới, layout mới, hay chỉ section mới?
3. Page nào server-first, page nào client-heavy?
4. Metadata/i18n/breadcrumb có thay đổi không?
5. Route này có protected không?

## Process

### 1) Route Scope Review

Xác định:

- route path
- route group
- active/planned status
- layout target

### 2) Page Structure Review

Phải mô tả:

- page files
- layout files
- dynamic route nếu có
- metadata placement

### 3) Server / Client Boundary Review

Nói rõ:

- section nào là server component
- section nào cần `"use client"`
- lý do cho từng quyết định

### 4) Locale / Navigation Review

Phải chỉ ra:

- locale keys cần thêm
- breadcrumb/menu impact
- route config impact

### 5) Handoff To Implementation

Route plan phải để bước code biết:

- file route nào sẽ có
- config nào sẽ sửa
- locale files nào sẽ touched

## Pattern Chuẩn Của Repo

### App Router file structure

```
src/app/[locale]/
├── (public)/                    # Route group — public pages
│   ├── tours/
│   │   ├── page.tsx             # Server Component — list page
│   │   ├── [slug]/
│   │   │   └── page.tsx         # Server Component — detail page
│   │   └── layout.tsx           # Layout nếu cần
│   └── contact/
│       └── page.tsx
├── (auth)/                      # Route group — auth pages
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
└── (protected)/                 # Route group — requires auth
    ├── profile/
    │   └── page.tsx
    └── bookings/
        └── page.tsx
```

### generateMetadata pattern

```tsx
// src/app/[locale]/tours/[slug]/page.tsx
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

interface Props {
  params: { locale: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'tour' });
  const tour = await tourService.getBySlug(params.slug);

  return {
    title: `${tour.name} | DanangTrip`,
    description: tour.description.slice(0, 160),
    openGraph: {
      title: tour.name,
      images: tour.imageUrl ? [tour.imageUrl] : [],
    },
  };
}
```

### Server vs Client boundary decision

```tsx
// src/app/[locale]/tours/page.tsx — Server Component
// Fetch data ở server, không cần "use client"
import { tourService } from '@/services/tour.service';
import { TourListClient } from '@/features/tours/components/TourListClient';

export default async function ToursPage({ searchParams }: Props) {
  // Server-side prefetch cho initial data
  const initialData = await tourService.getList({ page: 1 });

  return (
    <main>
      <h1>Tours</h1>
      {/* Client component nhận initial data */}
      <TourListClient initialData={initialData} />
    </main>
  );
}

// src/features/tours/components/TourListClient.tsx
'use client'; // Cần vì có filter/search interaction

import { useTourList } from '../hooks/useTourQueries';

export function TourListClient({ initialData }: Props) {
  const [params, setParams] = useState({ page: 1 });
  const { data } = useTourList(params, { initialData });
  // ...
}
```

### next-intl routing pattern

```ts
// src/i18n/routing.ts — bám config hiện tại
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
});
```

```tsx
// Dùng next-intl navigation — không dùng next/navigation trực tiếp
import { Link, useRouter, usePathname } from '@/i18n/navigation';

// Locale-aware link
<Link href="/tours">Tours</Link>
// → /vi/tours hoặc /en/tours tự động
```

### i18n namespace pattern

```json
// src/messages/vi/tour.json
{
  "pageTitle": "Khám phá Tour",
  "pageDesc": "Tìm kiếm tour du lịch phù hợp với bạn",
  "searchPlaceholder": "Tìm kiếm tour...",
  "noResults": "Không tìm thấy tour nào",
  "bookNow": "Đặt ngay",
  "detail": {
    "title": "Chi tiết tour",
    "price": "Giá từ",
    "duration": "Thời gian"
  }
}

// src/messages/en/tour.json — phải sync đồng thời
{
  "pageTitle": "Explore Tours",
  "pageDesc": "Find the perfect tour for you",
  "searchPlaceholder": "Search tours...",
  "noResults": "No tours found",
  "bookNow": "Book Now",
  "detail": {
    "title": "Tour Details",
    "price": "From",
    "duration": "Duration"
  }
}
```

### Route config pattern

```ts
// src/config/routes.ts — thêm route mới vào đây
export const ROUTES = {
  HOME: '/',
  TOURS: '/tours',
  TOUR_DETAIL: (slug: string) => `/tours/${slug}`,
  CONTACT: '/contact',
  LOGIN: '/login',
  PROFILE: '/profile',
  BOOKINGS: '/bookings',
} as const;
```

## Output Document

Tạo file:

- `.agent/artifacts/routing/YYYY-MM-DD__<feature-slug>__route-plan.md`

Template:

- `template_route_plan.md`

## Strict Rules

- Không dùng `"use client"` cho toàn route tree nếu không thật sự cần
- Không tạo visible route link khi page chưa tồn tại
- Metadata nên ở route level (`generateMetadata`)
- Locale files `vi/en` phải đồng bộ — thêm cùng lúc
- Dùng `next-intl` navigation (`Link`, `useRouter`) thay vì `next/navigation` trực tiếp
- Route path phải lowercase, kebab-case

## Red Flags

Nếu thấy những dấu hiệu sau, phải dừng và flag:

- Toàn bộ page đánh `"use client"` → mất server rendering benefits
- Metadata hardcode thay vì `generateMetadata` → không dynamic
- Dùng `next/link` thay vì `next-intl/link` → locale prefix bị mất
- i18n chỉ thêm vào `vi` mà quên `en` → broken UI khi switch language
- Route path không thêm vào `src/config/routes.ts` → hardcode string rải rác

## Common Rationalizations

| Lý do hay gặp | Thực tế |
|---|---|
| `"use client"` cho cả page cho tiện | Mất server rendering, SEO kém hơn, bundle lớn hơn |
| "Metadata tĩnh, hardcode cho nhanh" | Khi cần dynamic title/OG, phải refactor |
| "i18n thêm sau" | Khi thêm sau, dễ bỏ sót key — thêm ngay khi tạo route |
| "Dùng next/link cũng được" | Mất locale prefix tự động của next-intl |

## Documentation Expectations

Route plan tốt phải có:

- route files (path, group, layout)
- server/client boundary (per section)
- route config impact (`src/config/routes.ts`)
- locale/navigation impact (keys cần thêm)
- files expected to change

## Verification

- Đối chiếu `checklist.md`
- Route plan phải chỉ ra đủ file route, layout, route config, locale files liên quan
- `npm run check:routes` phải pass sau khi implement
