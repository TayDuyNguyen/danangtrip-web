# Phân tích Giao diện & Luồng xử lý: Hóa đơn PDF (user-booking-invoice)

- **Feature Slug:** `user-booking-invoice`
- **Ngày thực hiện:** 2026-05-22
- **Nguồn tài liệu:**
  - [user_booking_invoice.md](file:///D:/DATN/DATN_Document/docs/page/user_booking_invoice.md) (Tài liệu gốc về Hóa đơn)
  - [api_list.md](file:///D:/DATN/DATN_Document/docs/api/api_list.md) (Danh sách API của hệ thống)
  - [BookingDetailClient.tsx](file:///D:/DATN/danangtrip-web/src/features/tour/components/BookingDetailClient.tsx) (Giao diện chi tiết đặt tour hiện tại)
  - [booking.service.ts](file:///D:/DATN/danangtrip-web/src/services/booking.service.ts) (Service đặt tour hiện tại)

---

## 1. Mục tiêu và Phạm vi (Summary & Scope)
- **Mục tiêu:** Tải hoặc xem trước hóa đơn thanh toán dạng PDF trực tiếp từ API backend `GET /user/bookings/{id}/invoice`. Hóa đơn này là tệp tin nhị phân (`application/pdf`), không phải JSON thông thường.
- **Đối tượng sử dụng (Actor):** Khách hàng đã đăng nhập hệ thống và sở hữu đơn đặt tour tương ứng.
- **Đặc trưng luồng:** Không có giao diện trang riêng độc lập. Hành động tải hóa đơn được trigger dưới dạng button hành động tích hợp trực tiếp trên trang chi tiết đơn hàng:
  - Xem chi tiết bằng ID (`/bookings/{id}`)
  - Xem chi tiết bằng mã đơn đặt (`/bookings/code/{bookingCode}`)

---

## 2. Kiểm tra Thiết kế & Thiết kế Token (Design Token Audit)
Tuân thủ nghiêm ngặt các quy định trong [DESIGN.md](file:///D:/DATN/danangtrip-web/DESIGN.md):
- **Trạng thái Loading (Đang tải):**
  - Khi đang gửi yêu cầu và nhận luồng nhị phân (Blob), button "In hóa đơn" chuyển sang trạng thái disabled để tránh click trùng lặp (double-submit).
  - Màu nền của button ở trạng thái loading chuyển thành xanh dương đậm `#3385D6` kèm icon spinner xoay kích thước `16px`.
  - Nhãn hiển thị: `"Đang tải hóa đơn..."` (Tiếng Việt) hoặc `"Downloading invoice..."` (Tiếng Anh).
- **Phản hồi Trạng thái Toasts (Feedback States):**
  - **Đơn chưa thanh toán (Unpaid):** Toast hiển thị cảnh báo với nền vàng nhạt `bg-[#FEF3C7]` và chữ cam đậm `text-[#F59E0B]` (hoặc Tailwind classes tương đương `bg-amber-100 text-amber-700`).
  - **Lỗi tải tệp (Server Error/Network Failure):** Toast hiển thị lỗi với nền đỏ nhạt `bg-[#FEE2E2]` và chữ đỏ đậm `text-[#EF4444]` (hoặc Tailwind classes tương đương `bg-red-100 text-red-700`).

---

## 3. Phân tích Thành phần Component (Component Breakdown)

Chúng tôi tích hợp trực tiếp vào cấu trúc hiện tại của dự án để đảm bảo tính đồng bộ cao nhất:

### [REUSE] Các thành phần tái sử dụng
- **BookingDetailClient** (`src/features/tour/components/BookingDetailClient.tsx`): Chứa nút hành động tải hóa đơn và xử lý trạng thái click.
- **Button** (`src/components/ui/Button.tsx`): Sử dụng cho nút bấm in hóa đơn với variant `"secondary"` hiện tại, bổ sung trạng thái disabled và loading spinner.

---

## 4. Phân tích Trạng thái UI (UI States)

| Khối giao diện | Đang tải (Loading) | Chưa thanh toán (Unpaid) | Lỗi tải (Error) | Thành công (Success) |
|---|---|---|---|---|
| **Button In hóa đơn** | Vô hiệu hóa (disabled), hiển thị Spinner `16px` cùng nhãn `Đang tải hóa đơn...`. Màu nền `bg-[#3385D6]`. | Hoạt động bình thường. Khi click sẽ ngắt tiến trình và hiển thị Toast cảnh báo. | Khôi phục trạng thái ban đầu của button để cho phép thử lại. | Khôi phục trạng thái ban đầu sau khi kích hoạt trình tải xuống tệp của trình duyệt. |
| **Phản hồi Hệ thống** | Không có (hiển thị trạng thái tại nút). | Hiển thị Toast cảnh báo màu vàng: `"Hóa đơn chỉ có sau khi thanh toán thành công"`. | Hiển thị Toast lỗi màu đỏ: `"Không thể tải hóa đơn. Vui lòng thử lại."`. | Trình duyệt kích hoạt tải xuống tệp tin `invoice-{bookingCode}.pdf`. |

---

## 5. Thực tế API & Bản đồ Dữ liệu (API Contract Mapping)

### Yêu cầu chuyển đổi phương thức vận chuyển:
Hiện tại `bookingService.invoice` đang định nghĩa trả về `ApiResponse<Booking>` (JSON). Chúng ta cần cấu hình bổ sung tham số `responseType: "blob"` trong Axios để nhận dữ liệu PDF nhị phân.

### Xử lý Lỗi Nhị phân (Binary Error Fallback):
Khi API backend trả về lỗi dưới dạng JSON (ví dụ: `{"message": "Đơn chưa thanh toán"}` hoặc tương tự) với status code `>= 400`, Axios sẽ nhận được Blob chứa chuỗi JSON đó.
- **Giải pháp xử lý:** Chúng ta sẽ kiểm tra xem `error.response.data` có phải là `Blob` và có kiểu nội dung là `application/json` hay không. Nếu đúng, sử dụng `FileReader` hoặc `Blob.text()` để phân giải thông báo lỗi thực tế từ backend trước khi hiển thị cho người dùng.

### API Mapping

| Hành động | Method | Endpoint thực tế | Headers | Request Body | Kiểu phản hồi |
|---|---|---|---|---|---|
| Tải hóa đơn | GET | `/user/bookings/{id}/invoice` | `Authorization: Bearer <token>` | Không có | `application/pdf` (Binary Blob) |

---

## 6. Nghiệp vụ & Quyền hạn (Business Rules & Permissions)

- **BR-01 (Giới hạn thanh toán):** Chỉ những đơn đặt tour có trạng thái thanh toán là Đã thanh toán (`payment_status === "paid"`) mới có thể tải hóa đơn PDF. Nếu trạng thái chưa thanh toán, chặn tải ngay tại frontend bằng thông báo toast màu vàng.
- **BR-02 (Xác thực người dùng):** Người dùng phải được xác thực (đã đăng nhập). Nếu mã trạng thái trả về là `401 Unauthorized`, hệ thống sẽ tự động điều hướng người dùng về trang đăng nhập `/login`.
- **BR-03 (Đặt tên tệp nhất quán):** Tệp PDF tải xuống phải có tên định dạng trực quan: `invoice-{booking_code}.pdf` (ví dụ: `invoice-BK-1008.pdf`).

---

## 7. Các trường hợp biên (Edge Cases)

- **EC-01 (Lỗi JSON bọc trong Blob):** Backend trả về lỗi 403 hoặc 500 kèm nội dung JSON thay vì PDF. Nếu không phân giải Blob thành Text JSON, người dùng sẽ thấy thông báo lỗi chung chung, hoặc trình duyệt cố gắng tải xuống file PDF bị hỏng chứa chuỗi JSON lỗi.
- **EC-02 (Tải từ màn hình Booking bằng mã đơn):** Khi xem chi tiết đơn qua mã đơn đặt (`/bookings/code/{bookingCode}`), API hóa đơn vẫn sử dụng ID nội bộ của đơn hàng (`booking.id`). Cần đảm bảo ID này luôn có sẵn trước khi hiển thị button hành động hoặc gọi API.

---

## 8. Kế hoạch triển khai (Implementation Checklist)

- [ ] **03-types-api-contract:**
  - Cập nhật định nghĩa dịch vụ `bookingService.invoice` trong `src/services/booking.service.ts` để nhận tệp Blob nhị phân (`responseType: "blob"`).
  - Tạo tài liệu API Contract phản ánh sự thay đổi này.
- [ ] **04-layout-routing:**
  - Giữ nguyên cấu trúc định tuyến chi tiết, đảm bảo button in hóa đơn hoạt động chính xác cho cả trang theo ID và trang theo mã đơn đặt.
- [ ] **05-ui-components & i18n:**
  - Đồng bộ hóa các khóa ngôn ngữ trong `src/messages/vi/tour.json` và `src/messages/en/tour.json` cho các trạng thái của hóa đơn (tải xuống, chưa thanh toán, lỗi hệ thống).
  - Nâng cấp button hành động trong `BookingDetailClient.tsx` với spinner xoay `16px`, disabled state, màu nền `#3385D6` khi tải.
- [ ] **06-data-integration & 07-interactions:**
  - Thực hiện kiểm tra nghiệp vụ `payment_status === "paid"` trước khi thực hiện gọi API.
  - Xây dựng logic phân giải Blob JSON lỗi để trích xuất thông tin lỗi thực tế.
  - Kích hoạt tiến trình tải xuống tệp PDF chuẩn hóa tên tệp nhị phân trên Client.
- [ ] **08-auth-permissions:**
  - Bảo vệ luồng tải bằng cơ chế Auth Header đã được cấu hình trong `axiosInstance`.
- [ ] **09-testing:**
  - Chạy các lệnh kiểm tra tĩnh và đảm bảo dự án chạy ổn định thông qua `npm run prepush:check`.
