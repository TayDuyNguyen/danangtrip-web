# UI Spec: Tour Booking

> Feature slug: `tour-booking`
> Date: 2026-05-16
> Source analysis: `.agent/artifacts/analysis/2026-05-16__tour-booking__screen-analysis.md`

---

## 1) Summary
- **Mục tiêu:** Xây dựng giao diện đặt tour chuyên nghiệp, tin cậy, bám sát hệ thống Dark Mode/Bronze của dự án. Giao diện tập trung vào việc hướng dẫn user hoàn tất thông tin đặt chỗ một cách mượt mà nhất.
- **Bề mặt chính:** Form đặt tour 2 cột (Desktop) bao gồm các section chọn lịch, số lượng khách, thông tin cá nhân và Order Summary sticky.

## 1.1) UI Delivery Goal
- **Above-the-fold:** Logo minimal header, Progress Steps, và Section "Chọn ngày khởi hành".
- **Supporting UI:** Order Summary (Sticky sidebar), Chính sách hủy tour, và Chân trang minimal.

## 2) Component Matrix

### [REUSE]
| Component | Path | Why reuse | Notes |
|---|---|---|---|
| `Button` | `src/components/ui/Button.tsx` | Atom cơ bản cho Submit/Back | Sử dụng variant `primary` |
| `Input` | `src/components/ui/Input.tsx` | Atom cho Name/Email/Phone | Đã có hiệu ứng label float & border-b |
| `Textarea` | `src/components/ui/Textarea.tsx` | Atom cho Ghi chú | Bám sát styling của Input |
| `Badge` | `src/components/ui/Badge.tsx` | Hiển thị trạng thái/category | |

### [NEW]
| Component | Layer | Purpose | Expected Props |
|---|---|---|---|
| `BookingProgressSteps` | Molecule | Hiển thị 3 bước tiến trình | `currentStep: number` |
| `ScheduleCalendar` | Organism | Lưới chọn ngày khởi hành | `tourId: number`, `selectedId?: number`, `onSelect: (id: number) => void` |
| `QuantityCounter` | Molecule | Bộ tăng/giảm số lượng | `label: string`, `subLabel: string`, `value: number`, `onChange: (val: number) => void`, `min?: number`, `max?: number` |
| `PaymentMethodSelector` | Molecule | Danh sách chọn phương thức thanh toán | `value: string`, `onChange: (val: string) => void` |
| `OrderSummaryCard` | Organism | Sidebar hiển thị thông tin & tổng tiền | `tour: Tour`, `bookingData: Partial<BookingFormValues>`, `priceData?: BookingCalculation` |

### [MOD]
| Component | Path | Required change | Impact |
|---|---|---|---|
| `BookingSidebar` | `src/features/tour/components/BookingSidebar.tsx` | Refactor để tách phần Summary thành `OrderSummaryCard` dùng chung | Tránh duplicate logic tính giá giữa trang Detail và trang Book |

## 3) UI States
| Component | Loading | Empty | Error | Success | Disabled |
|---|---|---|---|---|---|
| `ScheduleCalendar` | Skeleton Grid (7 cột) | "Không có lịch trống" | Inline message + Retry | Border highlight ngày chọn | Ngày quá khứ/Full (opacity 40) |
| `PriceDisplay` | Skeleton Pulse | 0đ | "Lỗi tính giá" | Text highlight (Bronze) | N/A |
| `BookingForm` | N/A | N/A | Toast error từ API | Redirect sang Payment | Submit button disabled |

## 3.1) Motion / Interaction Notes
| Component | Hover / Focus | Reveal / Motion | Notes |
|---|---|---|---|
| Calendar Date | Scale 1.05 + Azure border | `reveal-up` | |
| Payment Card | Glass border strong | `reveal-up` | Cảm giác premium depth |
| Total Price | N/A | Count-up animation (nếu có thể) | Tăng tính sinh động khi thay đổi số lượng |
| Sections | N/A | Staggered `reveal-delay` | Theo chuẩn project (100ms, 200ms...) |

## 4) Responsive Notes
| Breakpoint | Behavior | Notes |
|---|---|---|
| Mobile | 1 cột, Sidebar Order Summary nằm dưới Form hoặc Floating bottom bar | Ưu tiên đẩy Summary xuống dưới để tập trung vào input |
| Tablet | Tương tự mobile hoặc 2 cột thu nhỏ | |
| Desktop | 2 cột (Form 65%, Sidebar 35%) | Sidebar sử dụng `sticky top-28` |

## 5) Files Expected To Change
- `src/features/tour/components/BookingForm.tsx` (New)
- `src/features/tour/components/ScheduleCalendar.tsx` (New)
- `src/features/tour/components/QuantityCounter.tsx` (New)
- `src/features/tour/components/OrderSummaryCard.tsx` (New - from MOD BookingSidebar)
- `src/features/tour/components/BookingProgressSteps.tsx` (New)
- `src/app/[locale]/(main)/(protected)/tours/[slug]/book/page.tsx` (Assembly)

## 6) Build Order
1. **Atoms/Molecules:** `BookingProgressSteps`, `QuantityCounter`, `PaymentMethodSelector`.
2. **Organisms:** `ScheduleCalendar`, `OrderSummaryCard`.
3. **Feature Component:** `BookingForm` (Assembly of molecules/organisms).
4. **Page assembly:** `page.tsx` (Page shell, fetch tour, render BookingForm).
