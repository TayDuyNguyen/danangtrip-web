---
name: 05-ui-components
description: Turn analysis into a UI specification and component implementation plan aligned with DESIGN.md. Use when building or refactoring user-facing UI.
---

# Skill: 05-ui-components

## Overview

Skill này chuyển analysis thành **UI spec** rõ ràng: reuse matrix, component layers, states, responsive notes, và file plan.
Nó nên đủ chi tiết để dev hoặc reviewer nhìn vào hình dung được UI structure mà chưa cần mở toàn bộ code.

## Required Input

- `persona.md`
- `DESIGN.md`
- `.agent/rules/PROJECT_RULES.md`
- Analysis file từ `01-screen-analysis`
- `src/components/ui/`
- `src/components/layout/`
- `src/features/*/components/`

## Recommended Questions To Answer

1. Component nào đã có thể reuse?
2. Component nào cần tạo mới vì chưa có tương đương?
3. Component nào shared, component nào chỉ feature-local?
4. State nào phải đi qua props?
5. Token/motion/visual rule nào dễ bị lệch nhất?

## Process

### 1) Design Token Alignment

Đối chiếu UI cần build với `DESIGN.md`:

- colors
- spacing
- typography
- motion
- elevation

### 2) Reuse Audit

Phải liệt kê:

- component reuse được
- path
- lý do reuse
- chỗ nào chỉ cần mod nhẹ

### 3) Component Decomposition

Chia theo:

- atom
- molecule
- organism
- page section

### 4) State Contract

Phải chỉ ra:

- loading (skeleton hay spinner)
- empty
- error
- success
- disabled

### 5) Placement Strategy

Mô tả rõ file placement:

- shared UI: `src/components/ui/`
- common/shared: `src/components/`
- feature-local: `src/features/<feature>/components/`

## Pattern Chuẩn Của Repo

### Component placement decision

```
src/components/ui/          → Primitive atoms: Button, Input, Badge, Skeleton
                              Không có business logic, không fetch data
src/components/             → Shared molecules/organisms: Navbar, Footer, SearchBar
                              Dùng ở nhiều feature
src/features/<f>/components/ → Feature-local: TourCard, TourGrid, BookingForm
                              Chỉ dùng trong feature đó
```

### Loading state — skeleton, không spinner

```tsx
// GOOD: Skeleton giữ layout ổn định
function TourCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden" aria-busy="true">
      <div className="h-48 bg-muted animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
      </div>
    </div>
  );
}

// BAD: Spinner gây layout shift
if (isLoading) return <Spinner />;
```

### Empty state — có message và CTA

```tsx
// GOOD: Empty state có context và action
function TourEmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <div className="text-center py-16" role="status">
      <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">Không tìm thấy tour</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
      </p>
      {onReset && (
        <button className="mt-4" onClick={onReset}>
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
}
```

### Props typing — explicit, không dùng any

```tsx
// GOOD: Props typed rõ ràng
interface TourCardProps {
  tour: Tour;
  variant?: 'default' | 'compact' | 'featured';
  onBooking?: (tourId: string) => void;
  className?: string;
}

export function TourCard({ tour, variant = 'default', onBooking, className }: TourCardProps) {
  // ...
}

// BAD: Props không typed
function TourCard(props: any) { ... }
```

### i18n — mọi text user-facing qua next-intl

```tsx
// GOOD: Dùng useTranslations
'use client';
import { useTranslations } from 'next-intl';

function BookingButton({ tourId }: { tourId: string }) {
  const t = useTranslations('tour');
  return <button>{t('bookNow')}</button>;
}

// Server component
import { getTranslations } from 'next-intl/server';

async function TourTitle({ name }: { name: string }) {
  const t = await getTranslations('tour');
  return <h1>{t('detailTitle', { name })}</h1>;
}

// BAD: Hardcode text
<button>Đặt tour ngay</button>
```

### Design token — không dùng arbitrary values

```tsx
// GOOD: Dùng design tokens từ DESIGN.md
<div className="bg-primary text-primary-foreground rounded-lg p-4 shadow-sm">

// BAD: Arbitrary values
<div style={{ backgroundColor: '#1a73e8', borderRadius: '12px', padding: '13px' }}>
```

## Output Document

Tạo file:

- `.agent/artifacts/ui-specs/YYYY-MM-DD__<feature-slug>__ui-spec.md`

Template:

- `template_ui_spec.md`

## Strict Rules

- Reuse first, create later
- Không fetch data trong UI component — data phải đến từ props hoặc hook
- Chỉ dùng design tokens từ `DESIGN.md` — không arbitrary pixel values
- Text user-facing phải đi qua `next-intl`
- Loading phải dùng skeleton, không phải spinner cho content areas
- Không tạo shared component nếu mới chỉ có một nơi dùng mà chưa có lý do mạnh

## Red Flags

Nếu thấy những dấu hiệu sau, phải dừng và flag:

- Component fetch data trực tiếp trong body → vi phạm separation of concerns
- Hardcoded text tiếng Việt trong JSX → không i18n được
- Arbitrary CSS values (`p-[13px]`, `text-[#1a73e8]`) → lệch design system
- Spinner thay vì skeleton cho list/card loading → layout shift
- Props dùng `any` → mất type safety

## Common Rationalizations

| Lý do hay gặp | Thực tế |
|---|---|
| "Component nhỏ, fetch data trong đó cho tiện" | Khi cần test hoặc reuse, sẽ phải refactor |
| "Text tiếng Việt hardcode cho nhanh, i18n sau" | "Sau" thường không bao giờ đến — và khi đến thì tốn nhiều thời gian hơn |
| "Spinner đơn giản hơn skeleton" | Skeleton giữ layout ổn định, tránh CLS |
| "Tạo shared component luôn cho tái sử dụng" | Premature abstraction — chỉ tạo shared khi có ≥2 nơi dùng |

## Documentation Expectations

UI spec tốt phải có:

- reuse/new/mod matrix (bảng với path, layer, reason)
- states (loading/empty/error per component)
- responsive notes
- placement strategy (shared vs feature-local)
- files expected to change

## Verification

- Đối chiếu `checklist.md`
- UI spec phải nêu rõ `[REUSE]`, `[NEW]`, `[MOD]`, props chính, và UI states
- Mọi component mới phải có placement rõ ràng (shared hay feature-local)
