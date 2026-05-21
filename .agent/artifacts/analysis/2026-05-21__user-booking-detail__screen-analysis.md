# Phân tích Giao diện: Chi tiết Đơn đặt tour (user-booking-detail)

- **Feature Slug:** `user-booking-detail`
- **Ngày thực hiện:** 2026-05-21
- **Nguồn tài liệu:** 
  - [user_booking_detail.md](file:///D:/DATN/DATN_Tài%20liệu/docs/page/user_booking_detail.md) (Tài liệu gốc)
  - [api.php (backend)](file:///D:/DATN/danangtrip-api/routes/api.php) (Thực tế định tuyến API)
  - [BookingController.php (backend)](file:///D:/DATN/danangtrip-api/app/Http/Controllers/Api/BookingController.php) (Thực tế xử lý dữ liệu)
  - [BookingService.php (backend)](file:///D:/DATN/danangtrip-api/app/Services/BookingService.php) (Nghiệp vụ backend)

---

## 1. Kiểm tra Thiết kế & Thiết kế Token (Design Token Audit)

Bám sát quy tắc thẩm mỹ tại [DESIGN.md](file:///D:/DATN/danangtrip-web/DESIGN.md) và các quy chuẩn dự án:
- **Màu sắc chính:** 
  - Màu chủ đạo (Primary): Azure blue `#0066CC` cho các trạng thái hoạt động, nút bấm chính.
  - Màu phụ (Secondary/Accent): Cam `#FF6B35` cho hiển thị tổng tiền và các nút liên quan đến đặt lại tour.
  - Màu nền: `bg-surface` kết hợp hiệu ứng glassmorphism mờ nhẹ đặc trưng của app.
  - Trạng thái phản hồi: Đỏ `#EF4444` (hủy đơn), Xanh lá `#10B981` (đã hoàn thành/thành công).
- **Hoạt ảnh (Animations):**
  - Sử dụng hiệu ứng `reveal-up` và phân phối độ trễ `reveal-delay-X` (100ms, 200ms, 300ms) để các khối thông tin xuất hiện nhịp nhàng từ dưới lên.
  - Các hiệu ứng hover mượt mà với `transition-all duration-300` và `active:scale-95` cho các nút tương tác.
- **Kiểu chữ (Typography):**
  - Font chữ: Inter làm chủ đạo.
  - Tiêu đề chính sử dụng cỡ chữ `22px font-bold`, các tiêu đề phụ `15px font-semibold`, nhãn dữ liệu nhỏ dạng uppercase `11px` màu `#94A3B8`.

---

## 2. Phân tích Thành phần Component (Component Breakdown)

Chúng tôi sẽ phân chia cấu trúc trang thành các thành phần để tối ưu việc tái sử dụng:

### [REUSE] Các component tái sử dụng từ dự án
- **CancelBookingDialog** ([CancelBookingDialog.tsx](file:///D:/DATN/danangtrip-web/src/features/tour/components/CancelBookingDialog.tsx)): Tái sử dụng hộp thoại xác nhận hủy đơn, truyền trực tiếp `bookingId` và callback làm mới dữ liệu.
- **Badge** ([Badge.tsx](file:///D:/DATN/danangtrip-web/src/components/ui/Badge.tsx) hoặc tương đương): Hiển thị trạng thái thanh toán và trạng thái đơn hàng.

### [NEW] Các component tạo mới cho màn chi tiết
- **BookingDetailClient** (`src/features/tour/components/BookingDetailClient.tsx`): Component client trung tâm điều phối trạng thái dữ liệu (Loading, Error, Empty) và lắp ghép các khối giao diện.
- **BookingStatusTimeline** (`src/features/tour/components/BookingStatusTimeline.tsx`): Trình bày biểu đồ tiến trình đơn hàng (Đặt tour → Xác nhận → Khởi hành → Hoàn tất).
- **BookingTourInfoCard** (`src/features/tour/components/BookingTourInfoCard.tsx`): Hiển thị thông tin tour, ngày/giờ đi, thời lượng, điểm tập trung.
- **BookingPriceSummaryCard** (`src/features/tour/components/BookingPriceSummaryCard.tsx`): Tóm tắt chi tiết các mức giá người lớn, trẻ em, em bé, mã giảm giá và tổng tiền.
- **BookingCustomerInfoCard** (`src/features/tour/components/BookingCustomerInfoCard.tsx`): Hiển thị thông tin khách hàng đại diện đặt tour (Họ tên, email, sđt, địa chỉ, ghi chú).

---

## 3. Thực tế API & Phương án Hạ cấp Giao diện (Safe Degradation)

Qua việc kiểm tra trực tiếp mã nguồn backend tại [api.php](file:///D:/DATN/danangtrip-api/routes/api.php) và các Models tại [danangtrip-api/app/Models](file:///D:/DATN/danangtrip-api/app/Models/), chúng tôi ghi nhận thực tế quan trọng sau:

1. **Không có Model và API hành khách (Passengers):**
   - Backend không định nghĩa Model `Passenger` và không có các tuyến đường `/user/bookings/{id}/passengers` hay cập nhật hành khách.
   - **[ASSUMPTION] Phương án hạ cấp:** Ẩn section chỉnh sửa thông tin hành khách riêng lẻ. Thay vào đó, tập trung hiển thị chính xác khối "Thông tin khách hàng đại diện" (chính là người đặt tour được lưu trực tiếp trên bảng `bookings`).
2. **Không có API dòng thời gian trạng thái (Timeline):**
   - Tuyến đường `/user/bookings/{id}/timeline` không tồn tại.
   - **[ASSUMPTION] Phương án hạ cấp:** Chúng tôi sẽ dựng dòng thời gian trạng thái tĩnh trên Client dựa vào các trường thời gian thực tế từ API `GET /user/bookings/{id}`:
     - **Bước 1 (Đặt tour):** Luôn hoàn tất (Done) với thời gian `booked_at`.
     - **Bước 2 (Xác nhận):** Đánh dấu hoàn tất dựa trên trường `confirmed_at`. Nếu trạng thái đơn là `cancelled`, bước này sẽ chuyển sang trạng thái "Đã hủy" màu đỏ.
     - **Bước 3 (Khởi hành) & Bước 4 (Hoàn tất):** Trạng thái được kiểm tra dựa trên ngày đi (`travel_date`) so với thời gian hiện tại và trường `completed_at`.
3. **API Hóa đơn (Invoice):**
   - API `/user/bookings/{id}/invoice` trả về dữ liệu booking JSON kèm lời nhắn: *"Invoice data retrieved. PDF generation is not yet available."*
   - **[ASSUMPTION] Phương án xử lý:** Nút "In hóa đơn" trên UI sẽ thực hiện tải file JSON thông tin hóa đơn hoặc in trực tiếp giao diện Web (`window.print()`) dưới dạng PDF để đảm bảo tính sẵn sàng cao về mặt trải nghiệm người dùng.

---

## 4. Phân tích Trạng thái UI (UI States)

- **Trạng thái tải dữ liệu (Loading/Skeleton):**
  - Hiển thị các khối Skeleton giả lập cấu trúc thật (Timeline skeleton, Tour Card skeleton, Customer Card skeleton) để giảm thiểu hiện tượng CLS (Cumulative Layout Shift).
- **Trạng thái lỗi (Error State):**
  - Hiển thị thông điệp lỗi trực quan kèm nút "Thử lại" kích hoạt truy vấn lại TanStack Query.
- **Trạng thái trống (Empty State):**
  - Trả về màn không tìm thấy đơn hàng kèm liên kết điều hướng về trang danh sách `/bookings`.
- **Trạng thái các nút hành động (Actions Control):**
  - Nút "Hủy đơn" chỉ hiển thị khi `booking_status === "pending"` hoặc `booking_status === "confirmed"`, đồng thời thời gian khởi hành phải ở tương lai.
  - Nút "Viết đánh giá" chỉ hiển thị khi đơn đã hoàn thành (`booking_status === "completed"`) và chưa có đánh giá nào cho tour đó.

---

## 5. Khai báo Biên Giới Server/Client (Server/Client Boundary)

- **Page Shell (`src/app/[locale]/(main)/(protected)/bookings/[id]/page.tsx`):**
  - Server Component đảm nhận thiết lập locale thông qua `setRequestLocale`, gọi `getTranslations` để sinh metadata động cho SEO (ví dụ: `Chi tiết đơn đặt tour #BK-1008 | DanangTrip`).
- **Client Container (`src/features/tour/components/BookingDetailClient.tsx`):**
  - Client Component sử dụng hook `useParams` để lấy `id` đơn hàng, thực hiện gọi API qua TanStack Query v5 và quản lý các trạng thái đóng/mở dialog hủy đơn.
