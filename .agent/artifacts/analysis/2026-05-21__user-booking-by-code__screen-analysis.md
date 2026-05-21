# Phân tích Giao diện: Chi tiết Đơn đặt theo Mã đơn (user-booking-by-code)

- **Feature Slug:** `user-booking-by-code`
- **Ngày thực hiện:** 2026-05-21
- **Nguồn tài liệu:**
  - [user_booking_by_code.md](file:///D:/DATN/DATN_Document/docs/page/user_booking_by_code.md) (Tài liệu gốc)
  - [user_booking_detail.md](file:///D:/DATN/DATN_Document/docs/page/user_booking_detail.md) (Tài liệu liên quan)
  - [api_list.md](file:///D:/DATN/DATN_Document/docs/api/api_list.md) (Định nghĩa API)
  - [booking.service.ts](file:///D:/DATN/danangtrip-web/src/services/booking.service.ts) (Lớp truyền tải dữ liệu frontend)

---

## 1) Summary
- **Mục đích:** Cho phép người dùng xem chi tiết đơn đặt tour trực tiếp bằng mã đơn hàng (ví dụ: `BK-1008`) thông qua đường dẫn động `/bookings/code/{booking_code}` thay vì sử dụng ID hệ thống. Use case chính là người dùng nhấn vào đường dẫn từ email xác nhận, tin nhắn thông báo hoặc tìm kiếm trực tiếp.
- **Actor chính:** Người dùng đã đăng nhập (🔐 Protected Route).
- **Feature/Module:** Đặt tour / Lịch sử đặt tour (`tour`).
- **Source inputs đã dùng:** `user_booking_by_code.md`, `user_booking_detail.md`, `booking.service.ts`, `DESIGN.md`, `PROJECT_RULES.md`, `REPO_FACTS.md`.

---

## 2) Design Token Audit
Bám sát quy chuẩn thẩm mỹ tại [DESIGN.md](file:///D:/DATN/danangtrip-web/DESIGN.md):
- **Màu sắc chính:**
  - Màu nền: `bg-surface` kết hợp hiệu ứng glassmorphism mờ nhẹ đặc trưng (`#080808` và `#030303`).
  - Màu chủ đạo (Primary): Azure blue `#0066CC` cho các liên kết hành động, tiêu đề phụ và trạng thái timeline.
  - Màu phụ/Nhấn (Secondary/Accent): `#FF6B35` cho hiển thị tổng cộng giá tiền và đặt lại tour.
  - Trạng thái phản hồi: Xanh lá `#10B981` (đã hoàn thành/hoàn tất), Đỏ `#EF4444` (đã hủy).
- **Hoạt ảnh (Animations):**
  - Hiệu ứng `reveal-up` và phân phối độ trễ `reveal-delay-X` (100ms, 200ms, 300ms) để các khối thông tin xuất hiện nhịp nhàng từ dưới lên.
  - Hover hiệu ứng mượt mà với `transition-all duration-300` và `active:scale-95` cho các nút bấm tương tác.
- **Kiểu chữ (Typography):**
  - Font chữ: Inter làm chủ đạo, font chữ monospace (`SFMono-Regular`) cho mã đơn hàng.
  - Tiêu đề chính sử dụng cỡ chữ `22px font-bold`, tiêu đề phụ `15px font-semibold`, nhãn nhỏ uppercase `11px` màu `#94A3B8`.
- **Corner Radii:** Hệ thống bo góc chuẩn `4px`, `7px`, `8px`, `12px`, `9999px`.

---

## 3) Component Breakdown

Chúng tôi sẽ tái sử dụng tối đa cấu trúc và thành phần giao diện đã hoàn thiện ở màn `user-booking-detail` để đảm bảo tính đồng bộ hoàn hảo về giao diện (UI) và trải nghiệm (UX).

### [REUSE] — Components đã có
| Component | Path | Cần chỉnh sửa? | Note |
|-----------|------|-----------------|------|
| `BookingStatusTimeline` | `src/features/tour/components/BookingStatusTimeline.tsx` | ✗ Không | Dùng hiển thị tiến trình của đơn dựa trên trạng thái đơn trả về từ API. |
| `BookingTourInfoCard` | `src/features/tour/components/BookingTourInfoCard.tsx` | ✗ Không | Dùng hiển thị thông tin chi tiết tour đặt. |
| `BookingCustomerInfoCard` | `src/features/tour/components/BookingCustomerInfoCard.tsx` | ✗ Không | Dùng hiển thị thông tin người đại diện đặt tour. |
| `BookingPriceSummaryCard` | `src/features/tour/components/BookingPriceSummaryCard.tsx` | ✗ Không | Dùng hiển thị tóm tắt thanh toán và tổng tiền. |
| `CancelBookingDialog` | `src/features/tour/components/CancelBookingDialog.tsx` | ✗ Không | Dialog xác nhận hủy tour khi người dùng bấm hủy. |

### [NEW] — Components cần tạo mới
| Component | Mô tả | Thuộc layer (Atom/Molecule/Organism) | Props interface |
|-----------|-------|--------------------------------------|-----------------|
| `BookingCodePage` | File trang App Router chính cho tuyến `/bookings/code/[bookingCode]`. | Page (App Router Shell) | `params: Promise<{ locale: string; bookingCode: string }>` |

### [MOD] — Components cần chỉnh sửa
| Component | Path | Thay đổi gì | Impact |
|-----------|------|-------------|--------|
| `BookingDetailClient` | `src/features/tour/components/BookingDetailClient.tsx` | - Cập nhật props interface để chấp nhận *hoặc* `id?: string` *hoặc* `bookingCode?: string`. <br>- Nếu có `bookingCode`, sử dụng hook truy vấn mới `useBookingDetailByCode(bookingCode)`. <br>- Thay thế tham số truyền vào các hàm hành động (`bookingService.invoice(booking.id)`, `CancelBookingDialog bookingId={booking.id}`) bằng `booking.id` thực tế từ dữ liệu trả về thay vì `id` prop thô. | Giúp tái sử dụng 100% giao diện hiển thị chi tiết đơn hàng mà không cần viết lại một component detail mới. |
| `useBookingQueries` | `src/features/tour/hooks/useBookingQueries.ts` | Bổ sung hook `useBookingDetailByCode(bookingCode: string)` sử dụng TanStack Query v5 để fetch dữ liệu từ `bookingService.detailByCode`. | Hỗ trợ tải dữ liệu theo mã đơn cho component `BookingDetailClient`. |

---

## 4) Responsive Behavior
| Breakpoint | Layout | Thay đổi so với desktop |
|------------|--------|------------------------|
| Desktop (≥1024px) | Grid 3 cột | Cột trái (2/3): Timeline + Thông tin tour + Thông tin khách hàng. <br>Cột phải (1/3): Tóm tắt thanh toán + Các cảnh báo/nút hành động. |
| Tablet (768-1023px) | Flex 1 cột | Chuyển layout sang 1 cột dọc, thứ tự hiển thị: Header → Timeline → Thông tin tour → Thông tin khách hàng → Tóm tắt thanh toán. |
| Mobile (<768px) | Flex 1 cột | Giống Tablet nhưng thu nhỏ padding (`p-4`), cỡ chữ, các nút hành động dàn hàng dọc đầy màn hình (`w-full`). |

---

## 5) UI States
| Component/Section | Loading | Empty | Error | Success | Disabled | Hover/Focus |
|-------------------|---------|-------|-------|---------|----------|-------------|
| `BookingDetailClient` | Hiển thị `BookingDetailSkeleton` giả lập cấu trúc | Hiển thị "Không tìm thấy đơn hàng" kèm nút CTA về `/bookings` (404) | Hiển thị thông báo lỗi load dữ liệu kèm nút "Thử lại" | Hiển thị chi tiết đơn hàng đầy đủ | Vô hiệu hóa nút trong lúc tải/gửi yêu cầu | N/A |
| Nút "Hủy đơn" | Trạng thái loading trên nút | N/A | Toast thông báo lỗi | Hủy thành công, refetch lại dữ liệu | Nút bị ẩn nếu status đơn hàng không thỏa mãn | Hiệu ứng hover đỏ nhạt, co giãn nhẹ |
| Nút "In hóa đơn" | Trạng thái loading trên nút | N/A | Toast lỗi | Tải file JSON hóa đơn thành công | Vô hiệu hóa khi đang tải | Hover viền sáng |

---

## 6) Data Fields
Dữ liệu nhận được từ endpoint `GET /user/bookings/code/{booking_code}` khớp hoàn toàn với cấu trúc kiểu dữ liệu `Booking` hiện tại trong `src/types/booking.types.ts`:
| Field | Type | Required | Validation | Example | Source API |
|-------|------|----------|------------|---------|------------|
| `id` | `number` | ✓ | Lớn hơn 0 | `12` | `GET /user/bookings/code/{booking_code}` |
| `booking_code` | `string` | ✓ | Bắt buộc, định dạng mã đơn | `"BK-1008"` | `GET /user/bookings/code/{booking_code}` |
| `booked_at` | `string` | ✓ | Định dạng ngày giờ | `"2026-05-21T13:30:00Z"` | `GET /user/bookings/code/{booking_code}` |
| `booking_status` | `string` | ✓ | Thuộc tập trạng thái | `"pending"`, `"confirmed"`, `"completed"`, `"cancelled"` | `GET /user/bookings/code/{booking_code}` |
| `payment_status` | `string` | ✓ | Thuộc tập trạng thái | `"unpaid"`, `"paid"`, `"partially_paid"`, `"refunded"` | `GET /user/bookings/code/{booking_code}` |
| `total_amount` | `number` | ✓ | Số dương | `2200000` | `GET /user/bookings/code/{booking_code}` |
| `payment_method` | `string` | ✓ | Tên phương thức | `"vnpay"`, `"cod"` | `GET /user/bookings/code/{booking_code}` |

---

## 7) API Endpoints
| Method | Path | Auth | Request | Response | Error codes |
|--------|------|------|---------|----------|-------------|
| GET | `/user/bookings/code/{booking_code}` | 🔐 Có | N/A | `ApiResponse<Booking>` | `404 Not Found` (không thấy đơn), `403 Forbidden` (không phải đơn của mình), `401 Unauthorized` |
| POST | `/user/bookings/{id}/cancel` | 🔐 Có | `{ cancellation_reason?: string }` | `ApiResponse<Booking>` | `400 Bad Request` (trạng thái đơn không được phép hủy) |
| GET | `/user/bookings/{id}/invoice` | 🔐 Có | N/A | `ApiResponse<any>` (dạng JSON hóa đơn) | `404 Not Found` |

---

## 8) Business Rules
- **BR-01 (Access Gating):** Chỉ những người dùng đã đăng nhập mới được truy cập tuyến đường `/bookings/code/*`. Nếu chưa đăng nhập, middleware sẽ chặn và điều hướng về `/login` kèm `callbackUrl`.
- **BR-02 (Owner Verification):** Người dùng chỉ được xem đơn hàng do chính mình đặt. Nếu truy cập đơn hàng của người dùng khác, API trả về `403 Forbidden` và giao diện phải hiển thị thông báo chặn truy cập.
- **BR-03 (Cancel Allowance):** Người dùng chỉ có quyền hủy đơn hàng khi trạng thái đơn hàng là `pending` hoặc `confirmed`, đồng thời ngày khởi hành phải lớn hơn thời gian hiện tại.
- **BR-04 (Invoice Generation):** Cho phép tải xuống hóa đơn JSON hoặc in giao diện trực tiếp thông qua `window.print()` khi đơn hàng đã tải thành công và có `id`.

---

## 9) Actors & Permissions
| Actor/Role | Can do | Cannot do | Notes |
|------------|--------|-----------|-------|
| Khách hàng đăng nhập (Owner) | - Xem chi tiết đơn hàng của mình bằng mã. <br>- Tải hóa đơn/in đơn hàng. <br>- Hủy đơn hàng (nếu hợp lệ). | Xem chi tiết đơn hàng của người dùng khác. | Là actor chính của luồng này. |
| Khách vãng lai | N/A | Xem bất kỳ thông tin nào của đơn hàng. | Bị middleware chặn ngay lập tức. |

---

## 10) Edge Cases
- **EC-01 (Mã đơn chứa ký tự đặc biệt / khoảng trắng):** Người dùng gõ hoặc click link có khoảng trắng ở đầu/cuối mã đơn (ví dụ: ` BK-1008 `). <br>*Giải pháp:* Thực hiện `trim()` sạch mã đơn trước khi gửi yêu cầu lên API.
- **EC-02 (API Hủy/Tải hóa đơn dựa trên Code):** endpoint gốc yêu cầu `id` số thay vi mã đơn chữ. <br>*Giải pháp:* Không dùng tham số `bookingCode` trên URL cho các hành động phụ; lấy trực tiếp `booking.id` từ kết quả API thành công để truyền cho `bookingService.cancel` và `bookingService.invoice`.
- **EC-03 (Đơn hàng bị hủy giữa chừng):** Người dùng đang mở trang và đơn hàng bị Admin hủy hoặc hệ thống tự động cập nhật trạng thái. <br>*Giải pháp:* Sử dụng query key hợp lý, hỗ trợ nút "Thử lại" hoặc tự động làm mới qua TanStack Query khi thực hiện hành động.

---

## 11) Assumptions & Open Questions
### Assumptions
- **[ASSUMPTION] A-01:** Phản hồi từ `GET /user/bookings/code/{booking_code}` trả về cấu trúc giống hệt `GET /user/bookings/{id}`. Điều này đã được xác nhận trong `booking.service.ts` khi cả hai đều trả về kiểu `Promise<ApiResponse<Booking>>`.
- **[ASSUMPTION] A-02:** Breadcrumb của trang sẽ sử dụng mã đơn hàng thật làm nút cuối cùng: `Trang chủ / Đơn đặt tour / BK-1008`.

### Open Questions
- *Không có câu hỏi mở quan trọng nào.* API backend đã sẵn sàng và hoạt động ổn định cho luồng này.

---

## 12) Implementation Checklist
- [x] Rà soát và cập nhật WORKING_STATE.md
- [ ] Bổ sung hook `useBookingDetailByCode` vào `src/features/tour/hooks/useBookingQueries.ts`
- [ ] Chỉnh sửa `BookingDetailClient` tại `src/features/tour/components/BookingDetailClient.tsx` để hỗ trợ hiển thị theo `bookingCode`
- [ ] Tạo file trang Route động mới tại `src/app/[locale]/(main)/(protected)/bookings/code/[bookingCode]/page.tsx`
- [ ] Chạy kiểm thử tĩnh (`prepush:check`) và kiểm tra runtime để xác nhận giao diện hoạt động hoàn hảo
- [ ] Sinh báo cáo review.md & deploy-report.md để hoàn thiện Step 10

---

## 13) Files / Areas Likely To Change
- `src/features/tour/hooks/useBookingQueries.ts`
- `src/features/tour/components/BookingDetailClient.tsx`
- `src/app/[locale]/(main)/(protected)/bookings/code/[bookingCode]/page.tsx`
