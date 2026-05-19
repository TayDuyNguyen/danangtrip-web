# UI Specification: Chọn lịch khởi hành (Tour Departure Select)

## 1. Design Token Alignment
- **Layout**: Grid 12 cột, full bleed composition với khoảng đệm `pt-28 md:pt-32` để không bị che bởi navbar.
- **Colors**: Nền dùng `bg-surface` (`#030303`), panel dùng `bg-surface-container-low` và `glass-surface`. Primary accent là `#8B6A55`. Text dùng `text-on-surface` (`#FFFFFF`) và `text-on-surface-subtle` (`#737373`).
- **Typography**: Header dạng `uppercase tracking-tight font-black`.
- **Motion**: `reveal-up` với staggered `animationDelay` (100ms, 200ms, 300ms) để các section tuần tự hiện ra.
- **Shapes**: Bo góc tròn `rounded-xl`, badge tròn `rounded-full` (như bộ đếm bước số 1, 2).

## 2. Reuse Matrix

| Component | Path | Status | Reason |
|---|---|---|---|
| `ScheduleCalendar` | `src/features/tour/components/ScheduleCalendar.tsx` | `[REUSE]` | Chứa nguyên logic hiển thị 30 ngày, báo "Còn X chỗ" và xử lý trạng thái hover. Vừa khớp hoàn toàn. |
| `QuantityCounter` | `src/features/tour/components/QuantityCounter.tsx` | `[REUSE]` | Xử lý tăng giảm số lượng (+/-) rất ổn định, UI khớp Dark Mode. |
| `OrderSummaryCard` | `src/features/tour/components/OrderSummaryCard.tsx` | `[REUSE]` | Hiển thị thumbnail tour, số lượng chọn, tổng tiền và rules hoàn chỉnh. |
| `DepartureSelectClient` | `src/features/tour/components/DepartureSelectClient.tsx` | `[NEW]` | Client component chứa State và render các component trên. Dành riêng cho route `/tours/[slug]/departures`. |

## 3. Component Decomposition
- **Page (Server)**: `/tours/[slug]/departures/page.tsx` fetch thông tin tour, setup `<title>`.
- **Organism (Client)**: `DepartureSelectClient` quản lý `selectedScheduleId`, `adults`, `childrenCount`, `infants`. Tính toán local `totalAmount`.
- **Molecules**: `ScheduleCalendar`, `OrderSummaryCard`.
- **Atoms**: `QuantityCounter`, `Button` (từ `src/components/ui/button.tsx`).

## 4. State Contract
- **Loading State**:
  - Khi đang tải `schedules` từ API: Hiển thị `<div className="h-[400px] w-full bg-surface-container-low animate-pulse rounded-xl" />` thay cho Calendar.
- **Empty State**:
  - Xử lý mượt bởi `ScheduleCalendar` (không có ngày nào active nếu array rỗng).
- **Error State**:
  - Server Component: `notFound()` nếu tour slug không tồn tại.
- **Disabled State**:
  - `Button` Tiếp tục bị khóa nếu `selectedScheduleId` chưa được chọn hoặc `adults < 1`.

## 5. Placement Strategy
- `DepartureSelectClient.tsx` nằm ở `src/features/tour/components/` vì nó chuyên biệt và kết hợp các UI nội bộ của tour.
- Server Route nằm ở `src/app/[locale]/(main)/(public)/tours/[slug]/departures/page.tsx`.

## 6. Files Changed
- `src/messages/vi/tour.json`
- `src/messages/en/tour.json`
- `src/app/[locale]/(main)/(public)/tours/[slug]/departures/page.tsx`
- `src/features/tour/components/DepartureSelectClient.tsx`
- `.agent/artifacts/ui-specs/2026-05-18__tour-departure-select__ui-spec.md`