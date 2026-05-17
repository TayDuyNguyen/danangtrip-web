# Screen Analysis: Đặt Tour

> Feature slug: `tour-booking`
> Date: 2026-05-16
> Target Route: `/tours/{slug}/book`
> Auth: 🔐 Required (User)
> Prototype Image: `D:\DATN\DATN_Document\screen\2_User_Flows\05.1-Dat_Tour.png`
> Prototype HTML: `D:\DATN\DATN_Document\screen\2_User_Flows\05.1-Dat_Tour.html`
> Primary Doc: `D:\DATN\DATN_Document\docs\page\user_tour_booking.md`

---

## 1) Summary
- **Mục tiêu:** Màn hình này là form đặt tour chính thức cho người dùng đã đăng nhập. Nó cho phép chọn lịch khởi hành, số lượng hành khách, điền thông tin liên hệ và chọn phương thức thanh toán trước khi tiến hành thanh toán thực tế.
- **User chính:** Người dùng đã đăng nhập (User role).
- **Module:** `tour` / `booking`.
- **Source inputs:** 
    - Prototype HTML/PNG (Layout & Interaction reference)
    - `user_tour_booking.md` (Requirement reference)
    - `DESIGN.md` & `globals.css` (Visual source of truth)
    - `api_list.md` & `booking.service.ts` (API reference)

## 2) Design Token Audit
| Token | Prototype Value | DESIGN.md / globals.css Value | Match? | Note |
|-------|-------------|-----------------|--------|------|
| Background | `#F8FAFC` (Light) | `#080808` (Dark) | ❌ | **Sử dụng Dark Mode** |
| Primary color | `#0066CC` (Azure) | `#8B6A55` (Bronze) | ❌ | **Sử dụng Bronze** |
| Surface | `White` | `#111111` (Surface Base) | ❌ | Sử dụng Glassmorphism & Surface Base |
| Typography | `Lato` | `Inter` (Display/Label), `SFMono` (Body) | ❌ | Sử dụng Inter/SFMono |
| Border radius | `16px` | `8px` (xl), `7px` (lg), `4px` (md) | ❌ | Theo sát `globals.css` |
| Shadow/Blur | Soft Shadow | `12px` Glass Blur | ❌ | Sử dụng Glassmorphism shell |

> **FLAG:** Prototype là bản Light Theme/Azure. Khi triển khai **PHẢI** chuyển đổi sang Dark Theme/Bronze theo đúng `DESIGN.md` và `globals.css`.

## 3) Component Breakdown
### [REUSE] — Components đã có
| Component | Path | Cần chỉnh sửa? | Note |
|-----------|------|-----------------|------|
| `Button` | `src/components/ui/Button.tsx` | Không | Sử dụng primary variant |
| `Input` | `src/components/ui/Input.tsx` | Không | Cho thông tin khách hàng |
| `Textarea` | `src/components/ui/Textarea.tsx` | Không | Cho phần ghi chú |
| `Badge` | `src/components/ui/Badge.tsx` | Không | Cho category/status |
| `BookingSidebar` | `src/features/tour/components/BookingSidebar.tsx` | **MOD** | Cần tách logic sidebar để dùng chung hoặc refactor thành `OrderSummary` |

### [NEW] — Components cần tạo mới
| Component | Mô tả | Thuộc layer | Props interface |
|-----------|-------|--------------------------------------|-----------------|
| `BookingProgressSteps` | Thanh tiến trình 3 bước | Molecule | `currentStep: number` |
| `ScheduleSelector` | Bộ chọn lịch (Calendar view) | Organism | `tourId: number`, `onSelect: (id: number) => void` |
| `QuantityCounter` | Bộ tăng giảm số lượng (Adult/Child/Infant) | Molecule | `label: string`, `price: number`, `value: number`, `onChange: (val: number) => void` |
| `PaymentMethodCard` | Card chọn phương thức thanh toán | Molecule | `method: string`, `selected: boolean`, `onSelect: () => void` |

### [MOD] — Components cần chỉnh sửa
| Component | Path | Thay đổi gì | Impact |
|-----------|------|-------------|--------|
| `BookingSidebar` | `src/features/tour/components/BookingSidebar.tsx` | Chuyển từ link `/contact` sang logic summary hiển thị trong trang đặt tour | Chỉ hiển thị summary, không chứa CTA nếu đã ở trang booking |

## 4) Responsive Behavior
| Breakpoint | Layout | Thay đổi so với desktop |
|------------|--------|------------------------|
| Desktop (≥1024px) | 2 cột (Form + Sidebar Sticky) | Baseline |
| Tablet (768-1023px) | 1 cột, Sidebar đẩy xuống dưới hoặc Floating CTA | Chuyển sang 1 cột full width |
| Mobile (<768px) | 1 cột, padding thu nhỏ | Padding 16px thay vì 24px |

## 5) UI States
| Component/Section | Loading | Empty | Error | Success | Disabled | Hover/Focus |
|-------------------|---------|-------|-------|---------|----------|-------------|
| Calendar | Skeleton Grid | "Không có lịch" | "Lỗi tải lịch" | Hiển thị ngày | Ngày quá khứ/Full | Highlight xanh/bronze |
| Quantity Row | N/A | N/A | N/A | N/A | Khi đạt Max/Min | Highlight button |
| Price Summary | Skeleton Pulse | 0đ | "Lỗi tính giá" | Hiển thị giá mới | N/A | N/A |
| Submit Button | Spinner | N/A | N/A | Redirect | Khi form invalid | Scale effect |

## 6) Data Fields
| Field | Type | Required | Validation | Example | Source API |
|-------|------|----------|------------|---------|------------|
| `tour_schedule_id` | `number` | ✅ | `min(1)` | `123` | `GET /tours/{id}/schedules` |
| `quantity_adult` | `number` | ✅ | `min(1), max(max_people)` | `2` | User Input |
| `customer_name` | `string` | ✅ | `min(2)` | `Nguyen Van A` | User Input / Profile |
| `customer_email` | `string` | ✅ | `email()` | `a@example.com` | User Input / Profile |
| `customer_phone` | `string` | ✅ | `regex(phone)` | `0901234567` | User Input / Profile |
| `payment_method` | `string` | ✅ | `enum(momo,vnpay,...)` | `momo` | User Input |

## 7) API Endpoints
| Method | Path | Auth | Request | Response | Error codes |
|--------|----------|------|---------|----------|-------------|
| GET | `/tours/{slug}` | 🌐 | `path: slug` | Tour Detail | 404 |
| GET | `/tours/{id}/schedules` | 🌐 | `path: id` | List Schedules | 404 |
| POST | `/bookings/calculate` | 🔐 | `tour_id`, `quantities` | `total_amount`, `final_amount` | 422 |
| POST | `/bookings` | 🔐 | `CreateBookingPayload` | `Booking` object | 422, 401, 400 |

## 8) Business Rules
- **BR-01:** Phải chọn lịch khởi hành trước khi tính giá hoặc đặt.
- **BR-02:** Số lượng Người lớn tối thiểu là 1.
- **BR-03:** Phải đồng ý điều khoản mới được nhấn "Tiếp tục thanh toán".
- **BR-04:** Nếu chưa đăng nhập, Middleware sẽ redirect về `/login?callbackUrl=...`.
- **BR-05:** Giá phải được re-calculate mỗi khi thay đổi số lượng khách hoặc lịch.

## 9) Actors & Permissions
| Actor/Role | Can do | Cannot do | Notes |
|------------|--------|-----------|-------|
| Guest | Xem tour | Truy cập trang `/book` | Bị redirect bởi middleware |
| User | Đặt tour cho mình | Đặt tour cho user khác (không cần thiết) | |
| Admin | Có thể truy cập | N/A | |

## 10) Edge Cases
- **EC-01:** Tour hết chỗ ngay khi user đang điền form (API `POST /bookings` sẽ trả về lỗi 400).
- **EC-02:** Lịch khởi hành bị hủy đột ngột.
- **EC-03:** User thay đổi Slug tour trên URL sang tour không tồn tại.

## 11) Assumptions & Open Questions
### Assumptions
- [ASSUMPTION] A-01: Hệ thống thanh toán sẽ được xử lý ở bước tiếp theo sau khi `POST /bookings` thành công (redirect sang `/payment/{booking_code}`).
- [ASSUMPTION] A-02: Thông tin profile user có thể lấy từ `authStore` để pre-fill.

### Open Questions
- Q-01: Có cần hỗ trợ nhập mã giảm giá (Promotion code) ở màn này không? (Hiện API list có đề cập nhưng prompt không yêu cầu).
- Q-02: Phí trẻ em và em bé tính theo % hay giá cố định? (API list cho thấy có field `price_child`, `price_infant` riêng).

## 12) Implementation Checklist
- [ ] Types & API contract (`booking.types.ts`, `booking.service.ts` update)
- [ ] Route & layout (`src/app/[locale]/(main)/(protected)/tours/[slug]/book/page.tsx`)
- [ ] UI components (`ScheduleSelector`, `QuantitySelector`, `BookingProgress`)
- [ ] Data integration (`useTourDetail`, `useBookingCalculate`, `useCreateBooking`)
- [ ] Interactions (Form handling, realtime calculation, validation)
- [ ] Auth/permissions (Middleware check)
- [ ] Testing (Vitest + interaction test)
- [ ] Optimization (Reveal-up animations, Glassmorphism)

## 13) Files / Areas Likely To Change
- `src/app/[locale]/(main)/(protected)/tours/[slug]/book/page.tsx`
- `src/features/tour/components/` (New components)
- `src/services/booking.service.ts`
- `src/types/booking.types.ts`
- `src/messages/vi/tour.json` & `src/messages/en/tour.json`
