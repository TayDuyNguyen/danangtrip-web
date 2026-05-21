# Route Plan: Chi tiết Đơn đặt theo Mã đơn (user-booking-by-code)

> Feature slug: `user-booking-by-code`
> Date: 2026-05-21
> Route scope: `/bookings/code/{booking_code}`

---

## 1) Summary
- Feature này thêm một tuyến đường động mới để tra cứu chi tiết đơn hàng dựa trên mã đơn hàng (`bookingCode` hay `booking_code`).
- Route này thuộc nhóm tuyến đường bảo vệ (🔐 protected group), tức là chỉ người dùng đã đăng nhập mới được phép truy cập. Hệ thống sẽ tự động chuyển hướng sang `/login` kèm callback nếu người dùng chưa đăng nhập.

## 1.1) Route Decision
- Route type: `new` (Tạo mới tệp trang cho dynamic route `/bookings/code/[bookingCode]`)
- Server-first or client-heavy: **Server-first shell + Client-heavy content**
- Why: 
  - Trang shell ở server sẽ đảm nhận vai trò phân tích `params` động từ URL (locale và bookingCode) và thiết lập môi trường locale qua `setRequestLocale(locale)`.
  - Content bên trong sẽ hiển thị thông qua `BookingDetailClient` (React Client Component) để xử lý các tương tác thời gian thực như fetch dữ liệu bằng TanStack Query, hủy đơn, tải/in hóa đơn JSON.

## 2) Route Files
| Route Path | File | Layout | Server / Client Notes | Metadata |
|---|---|---|---|---|
| `/bookings/code/{bookingCode}` | `src/app/[locale]/(main)/(protected)/bookings/code/[bookingCode]/page.tsx` | Kế thừa layout chung của group `(protected)` | Server component nhận dynamic params, thực hiện `setRequestLocale` và render `BookingDetailClient` | Dynamic metadata từ i18n key `tour.history.detail_title` + bookingCode |

## 3) Route Config Impact
Chúng ta sẽ bổ sung helper và định nghĩa hằng số cho tuyến đường này trong `src/config/routes.ts` để tránh việc hardcode URL trong mã nguồn.

| File | Change Needed | Notes |
|---|---|---|
| `src/config/routes.ts` | Thêm `BOOKING_BY_CODE` vào `PROTECTED_ROUTES`:<br>`BOOKING_BY_CODE: (bookingCode: string) => \`/bookings/code/\${bookingCode}\`` | Giúp tạo liên kết chuẩn locale-aware tới trang tra cứu mã đơn hàng. |

## 3.1) Server / Client Boundary Notes
| Area | Server or Client | Reason |
|---|---|---|
| Route Page Component | Server Component | Đọc các thuộc tính dynamic route `params` một cách an toàn và tối ưu SEO. |
| Detail Content Component | Client Component (`BookingDetailClient`) | Thực hiện data queries không đồng bộ (TanStack Query v5), quản lý các tương tác của dialog hủy đơn, tải file hóa đơn và hành vi in ấn. |

## 4) Locale / Navigation Impact
Qua rà soát thực tế mã nguồn, nhiều khóa dịch liên quan đến chi tiết đơn hàng đang bị thiếu hụt trong `tour.json` của cả Tiếng Việt và Tiếng Anh. Chúng ta cần cập nhật đồng bộ các khóa này.

| Item | Locale Keys | Notes |
|---|---|---|
| Breadcrumb / Title | `tour.history.detail_title` | Tiếng Việt: `"Chi tiết đơn hàng"`, Tiếng Anh: `"Booking Details"` |
| Invoice actions | `tour.history.button_print_invoice`<br>`tour.history.invoice_title` | Dịch nhãn cho in hóa đơn và tiêu đề in. |
| Cancel actions | `tour.history.button_cancel_booking`<br>`tour.history.cancellation_reason_label` | Đồng bộ các nhãn hủy và lý do hủy. |
| Navigation CTAs | `tour.history.back_to_list`<br>`tour.history.rebook_button` | Phục vụ quay lại danh sách và đặt lại tour. |

## 5) Files Expected To Change
- `src/config/routes.ts` (Thêm định nghĩa route động mới)
- `src/app/[locale]/(main)/(protected)/bookings/code/[bookingCode]/page.tsx` [NEW]
- `src/messages/vi/tour.json` (Bổ sung các khóa dịch còn thiếu dưới namespace `history`)
- `src/messages/en/tour.json` (Bổ sung đồng bộ các khóa dịch Tiếng Anh)

## 6) Risks / Open Questions
- **R-01: Route Param Case-Sensitivity**: Tên thư mục dynamic route sử dụng `[bookingCode]` (camelCase) trong khi tham số API sử dụng `booking_code` (snake_case). <br>*Giải pháp*: Lớp Server Page sẽ nhận param `bookingCode` từ App Router và gọi query hook, hook này sẽ tự động chuyển đổi hoặc dùng đúng giá trị đã được chuẩn hóa `trim()`.
- **Q-01: Giao diện In ấn**: Liệu giao diện in có cần hỗ trợ phong cách glassmorphism hay không? <br>*Giải pháp*: Không, khi in (`print:`) các thuộc tính nền tối và mờ của glassmorphism sẽ được ẩn đi để có giao diện in đen trắng rõ ràng, chuyên nghiệp.
