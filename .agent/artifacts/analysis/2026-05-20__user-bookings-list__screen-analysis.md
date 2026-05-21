# Screen Analysis: Lịch sử đặt tour

> Feature slug: `user-bookings-list`  
> Date: 2026-05-20  
> Figma: N/A (Based on text specification in [user_bookings_list.md](file:///D:/DATN/DATN_Tài liệu/docs/page/user_bookings_list.md))

---

## 1) Summary
- **Purpose**: Allow logged-in users to view their complete tour booking history. Users can filter by booking status (All, Pending, Confirmed, Completed, Cancelled), search bookings, paginate, and request cancellation for eligible bookings (pending/confirmed).
- **Primary Actor**: Logged-in Customer.
- **Module**: Tour Booking Feature.
- **Source Inputs**:
  - UX spec: [user_bookings_list.md](file:///D:/DATN/DATN_Tài liệu/docs/page/user_bookings_list.md)
  - Design guidelines: [DESIGN.md](file:///D:/DATN/danangtrip-web/DESIGN.md)
  - Repository facts: [.agent/rules/REPO_FACTS.md](file:///D:/DATN/danangtrip-web/.agent/rules/REPO_FACTS.md) and [.agent/rules/PROJECT_RULES.md](file:///D:/DATN/danangtrip-web/.agent/rules/PROJECT_RULES.md)
  - Existing types: [booking.types.ts](file:///D:/DATN/danangtrip-web/src/types/booking.types.ts)
  - Existing service: [booking.service.ts](file:///D:/DATN/danangtrip-web/src/services/booking.service.ts)

---

## 2) Design Token Audit

The UX spec is in Light Mode, which directly conflicts with the project's actual **Premium Dark Theme**. We will adapt the components as follows:

| Token | Figma/UX Spec Value | DESIGN.md Value (Dark Theme) | Match? | Note |
|-------|-------------|-----------------|--------|------|
| **Background** | White (`#FFFFFF`) | `#080808` | ✗ (Adapt) | Use `#080808` base. |
| **Card Surface** | White (`bg white`) | `#030303` or `#171717` | ✗ (Adapt) | Use `#171717` container with `#262626` borders for cards. |
| **Primary Accent**| Blue (`#0066CC`) | `#8B6A55` | ✗ (Adapt) | Use `#8B6A55` (Azure/Bronze primary) for primary actions and active states. |
| **Secondary Accent**| Orange (`#FF6B35`) | `#5C3822` | ✗ (Adapt) | Map orange rebook button to secondary accent/primary highlight `#8B6A55` or muted secondary. |
| **Typography** | Inter | Inter | ✓ | Match Inter font stack. |
| **Borders** | `#E2E8F0` / `#F1F5F9` | `#262626` | ✗ (Adapt) | Use `#262626` dark border. |
| **Shadows/Blurs** | `shadow-card` | Glassmorphism & subtle blur | ✗ (Adapt) | Use border-contrast + transparent black backdrop blur instead of strong dropshadows. |

---

## 3) Component Breakdown

### [REUSE] — Components đã có

| Component | Path | Cần chỉnh sửa? | Note |
|-----------|------|-----------------|------|
| `StandardPagination` | [StandardPagination.tsx](file:///D:/DATN/danangtrip-web/src/components/ui/pagination/StandardPagination.tsx) | Không | Dùng để phân trang danh sách đơn hàng. |
| `Button` | [Button.tsx](file:///D:/DATN/danangtrip-web/src/components/ui/Button.tsx) | Không | Sử dụng cho các nút hành động (Xem chi tiết, Hủy đơn, Đặt lại). |
| `Loading` | [Loading.tsx](file:///D:/DATN/danangtrip-web/src/components/ui/Loading.tsx) | Không | Spinner hiển thị khi đang tải danh sách hoặc đang thực hiện hủy đơn. |

### [NEW] — Components cần tạo mới

| Component | Mô tả | Thuộc layer | Props interface |
|-----------|-------|--------------------------------------|-----------------|
| `BookingsHistoryClient` | Thành phần bọc toàn bộ logic Client: URL query params sync, tabs, danh sách đơn hàng, pagination, modal hủy đơn. | Organism / Section | `{ locale: string }` |
| `BookingHistoryCard` | Thẻ hiển thị thông tin tóm tắt của một đơn đặt tour: mã, ngày đặt, ảnh đại diện tour, tên tour, ngày khởi hành, số lượng hành khách, tổng tiền, trạng thái đơn & thanh toán, các nút hành động. | Molecule | `{ booking: Booking, onCancel: (booking: Booking) => void }` |
| `CancelBookingDialog` | Modal dialog hỏi lý do hủy đơn hàng và xác nhận hủy. | Molecule | `{ isOpen: boolean, onClose: () => void, onConfirm: (reason: string) => void, isPending: boolean, bookingCode: string }` |

### [MOD] — Components cần chỉnh sửa

| Component | Path | Thay đổi gì | Impact |
|-----------|------|-------------|--------|
| `Header` | [Header.tsx](file:///D:/DATN/danangtrip-web/src/components/layout/Header.tsx) | Thêm link `"Lịch sử đặt tour"` / `"Đơn đặt tour"` vào menu dropdown của avatar người dùng đã đăng nhập. | Thêm điểm truy cập thuận tiện cho người dùng. |

---

## 4) Responsive Behavior

| Breakpoint | Layout | Thay đổi so với desktop |
|------------|--------|------------------------|
| **Desktop (≥1024px)** | Grid / flex row | Baseline layout. Ảnh đại diện hiển thị dạng ngang (`80x80px` hoặc tương tự), thông tin chi tiết nằm ở giữa, các nút hành động nằm bên phải hoặc dàn ngang phía dưới. |
| **Tablet (768-1023px)**| Flex col | Thẻ đơn hàng thu nhỏ khoảng cách padding. Nút hành động dồn xuống dưới cùng của thẻ. |
| **Mobile (<768px)** | Stacked vertical | Ảnh đại diện tour thu về góc trái (`60x60px`) hoặc tràn chiều rộng, thông tin tour xếp theo chiều dọc. Nút hành động chiếm 100% chiều rộng xếp chồng lên nhau. |

---

## 5) UI States

| Component/Section | Loading | Empty | Error | Success | Disabled | Hover/Focus |
|-------------------|---------|-------|-------|---------|----------|-------------|
| **Danh sách đơn hàng** | Skeleton cards (3 thẻ xám nhạt hiệu ứng pulse) | Hiển thị vector trống kèm văn bản mô tả và nút CTA "Khám phá Tour" dẫn tới `/tours`. | Thông báo lỗi tải danh sách kèm nút "Thử lại". | N/A | N/A | N/A |
| **Nút bấm lọc Tab** | N/A | Vẫn hiển thị đầy đủ các Tab lọc. | N/A | N/A | N/A | Hover chuyển màu sáng hơn, active sáng hơn và có đường line dưới. |
| **Modal hủy đơn** | Hiển thị trạng thái spinner tại nút Xác nhận hủy. | N/A | Hiển thị thông báo lỗi API trả về phía trên các nút hành động. | Đóng modal và hiển thị Toast thông báo thành công. | Vô hiệu hóa Textarea & nút Đóng/Xác nhận trong lúc API đang chạy. | N/A |

---

## 6) Data Fields

Dưới đây là các trường dữ liệu lấy từ API trả về thông qua thực tế của `Booking` và `BookingItem` trong [booking.types.ts](file:///D:/DATN/danangtrip-web/src/types/booking.types.ts):

| Field | Type | Required | Validation | Example | Source API |
|-------|------|----------|------------|---------|------------|
| `booking.id` | `number` | ✓ | Không | `12` | `GET /api/user/bookings` |
| `booking.booking_code` | `string` | ✓ | Không | `"BK-1008"` | `GET /api/user/bookings` |
| `booking.booking_status` | `string` | ✓ | `'pending' \| 'confirmed' \| 'cancelled' \| 'completed'` | `"pending"` | `GET /api/user/bookings` |
| `booking.payment_status` | `string` | ✓ | `'pending' \| 'success' \| 'failed' \| 'refunded' \| 'unpaid' \| 'partially_paid'` | `"pending"` | `GET /api/user/bookings` |
| `booking.payment_method` | `string` | ✓ | Không | `"momo"` | `GET /api/user/bookings` |
| `booking.total_amount` | `number \| string` | ✓ | Không | `2200000` | `GET /api/user/bookings` |
| `booking.booked_at` | `string` | ✓ | Định dạng Date | `"2026-05-20T08:00:00Z"` | `GET /api/user/bookings` |
| `booking.booking_items` | `array` | ✗ | Trả về thông tin tour đi kèm | `[...]` | `GET /api/user/bookings` |
| `item.item_name` | `string` | ✓ | Tên của tour | `"Tour Bà Nà Hills"` | Trong `booking_items[0]` |
| `item.travel_date` | `string` | ✓ | Định dạng Date | `"2026-05-25"` | Trong `booking_items[0]` |
| `item.quantity_adult` | `number` | ✓ | `>= 1` | `2` | Trong `booking_items[0]` |
| `item.quantity_child` | `number` | ✗ | `>= 0` | `1` | Trong `booking_items[0]` |
| `item.quantity_infant` | `number` | ✗ | `>= 0` | `0` | Trong `booking_items[0]` |
| `item.tour.thumbnail` | `string` | ✗ | URL ảnh đại diện của tour | `"/images/bana.jpg"` | Trong `booking_items[0].tour` |

---

## 7) API Endpoints

Dựa theo [api.ts](file:///D:/DATN/danangtrip-web/src/config/api.ts) và [booking.service.ts](file:///D:/DATN/danangtrip-web/src/services/booking.service.ts):

| Method | Path | Auth | Request | Response | Error codes |
|--------|------|------|---------|----------|-------------|
| **GET** | `/api/user/bookings` | 🔐 Có (Bearer) | Query params: `booking_status?: string`, `page?: number`, `per_page?: number`, `search?: string` | `ApiResponse<BookingListResponse>` | `401 Unauthorized` |
| **POST** | `/api/user/bookings/{id}/cancel` | 🔐 Có (Bearer) | Route param: `id` (booking_id); Body: `{ cancellation_reason: string }` | `ApiResponse<Booking>` | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden` |

---

## 8) Business Rules
- **BR-01 (Cancel Eligibility)**: Người dùng chỉ được hủy đơn hàng khi trạng thái của đơn là `pending` (Chờ xác nhận) hoặc `confirmed` (Đã xác nhận).
- **BR-02 (Policy Warning)**: Hiển thị cảnh báo chính sách hủy trong hộp thoại hủy đơn: Miễn phí trước 24 giờ. Sau đó chịu 50% phí.
- **BR-03 (Actions by Status)**:
  - `pending` / `confirmed`: Hiện nút **Hủy đơn**.
  - `completed`: Hiện nút **Đánh giá** (nếu chưa đánh giá) và **Đặt lại** (dẫn link về `/tours/{slug}`).
  - `cancelled`: Hiện nút **Đặt lại** (dẫn link về `/tours/{slug}`).
- **BR-04 (Detail Handoff)**: Nút **Xem chi tiết** dẫn tới route `/bookings/{id}`. (Trang này thuộc pha phát triển tiếp theo).

---

## 9) Actors & Permissions

| Actor/Role | Can do | Cannot do | Notes |
|------------|--------|-----------|-------|
| **Đăng nhập (User)** | Xem lịch sử đơn hàng của mình, tìm kiếm, lọc, phân trang, gửi yêu cầu hủy đơn hợp lệ. | Xem đơn hàng của người dùng khác, thực hiện hủy các đơn hàng đã hoàn tất/hủy. | Quyền hạn tiêu chuẩn. |
| **Khách (Guest)** | Không có quyền. | Xem bất kỳ thông tin nào dưới route `/bookings`. | Sẽ bị Middleware điều hướng về trang `/login` cùng với query `callbackUrl=/bookings`. |

---

## 10) Edge Cases
- **EC-01 (Lỗi hủy đơn từ phía server)**: API trả về mã lỗi do đã quá hạn thời gian hủy miễn phí hoặc lý do khác. Hệ thống cần hiển thị thông báo lỗi chi tiết nhận từ API lên hộp thoại thay vì dùng thông báo lỗi chung chung.
- **EC-02 (Không có ảnh đại diện tour)**: Nếu `tour.thumbnail` bị rỗng, hiển thị một ảnh fallback nền tối mặc định của hệ thống để không làm vỡ giao diện.
- **EC-03 (Chuyển trang giữ bộ lọc)**: Khi người dùng đang ở trang 2 và thay đổi tab trạng thái hoặc ô tìm kiếm, hệ thống cần tự động reset số trang về `page=1` để tránh tình trạng hiển thị danh sách trống.

---

## 11) Assumptions & Open Questions

### Assumptions
- [ASSUMPTION] A-01: Đường dẫn detail của tour sẽ lấy từ `tour.slug` để trỏ về `/tours/{slug}` cho nút "Đặt lại".
- [ASSUMPTION] A-02: Nếu API trả về `items` thay vì `booking_items` trong đối tượng `Booking`, chúng ta sẽ xử lý phòng hờ bằng toán tử `booking.booking_items || booking.items || []`.

### Open Questions
- Q-01: API `/user/bookings/{id}/cancel` có thực sự kiểm tra thời gian khởi hành để chặn hủy đơn trên backend hay không?  
  *Trả lời*: Có, hệ thống API của DanangTrip đã xử lý chặn thời gian trên backend. Tuy nhiên UI vẫn nên hiển thị cảnh báo chính sách rõ ràng theo yêu cầu.

---

## 12) Implementation Checklist
- [x] Reread memory and constraints.
- [ ] Add `BOOKINGS: "/bookings"` to `PROTECTED_ROUTES` in `src/config/routes.ts`.
- [ ] Add new query and mutation hooks in `src/features/tour/hooks/useBookingQueries.ts`.
- [ ] Add translation strings in `vi/tour.json` and `en/tour.json`.
- [ ] Implement UI component `CancelBookingDialog.tsx`.
- [ ] Implement UI component `BookingHistoryCard.tsx`.
- [ ] Implement UI component `BookingsHistoryClient.tsx` with URL state management.
- [ ] Create route page entry point `src/app/[locale]/(main)/(protected)/bookings/page.tsx`.
- [ ] Update user profile dropdown in `src/components/layout/Header.tsx`.
- [ ] Run `npm run prepush:check` and report verification results.

---

## 13) Files / Areas Likely To Change
- `src/config/routes.ts` (Thêm route `/bookings`)
- `src/messages/vi/tour.json` & `src/messages/en/tour.json` (i18n)
- `src/features/tour/hooks/useBookingQueries.ts` (React Query)
- `src/components/layout/Header.tsx` (Menu dropdown)
- `src/features/tour/components/` (New UI components)
- `src/app/[locale]/(main)/(protected)/bookings/page.tsx` (New App Router page)
