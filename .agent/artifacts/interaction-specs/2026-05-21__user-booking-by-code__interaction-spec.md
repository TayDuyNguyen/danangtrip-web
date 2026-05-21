# Interaction Specification: Chi tiết Đơn đặt theo Mã đơn (user-booking-by-code)

- **Feature slug:** `user-booking-by-code`
- **Ngày thực hiện:** 2026-05-21
- **Trạng thái:** Đặc tả các tương tác người dùng hoàn thành và đồng bộ.

---

## 1) Navigation Interactions
- **Nút "Quay lại" (Chevron Left Header):**
  - Vị trí: Góc trên bên trái, bên cạnh tiêu đề "Chi tiết đơn hàng".
  - Hành động: Khi nhấn vào, thực hiện điều hướng an toàn về `/bookings` (Trang lịch sử đơn đặt tour của tôi) qua router của `next-intl`.
  - Hiệu ứng: Hover làm viền sáng nhẹ, khi bấm (`active:scale-95`) co giãn nhẹ tạo độ nhạy phản hồi (tactile feedback).

---

## 2) Print and Export Interactions
- **Nút "Tải hóa đơn (JSON)":**
  - Tải trạng thái: Trong lúc chờ gọi API từ `bookingService.invoice(booking.id)`, nút chuyển sang trạng thái disabled hiển thị biểu tượng tải xoay kèm văn bản "Đang tải...".
  - Hành vi xuất file: Khi tải về thành công, dữ liệu được chuyển đổi sang định dạng `data:text/json;charset=utf-8` và nhúng vào thẻ anchor ảo để tự động click tải về máy người dùng dưới tên tệp `invoice-{bookingCode}.json`. Hiển thị Toast thành công màu xanh lá ở góc màn hình.
- **Nút "In hóa đơn":**
  - Hành động: Gọi phương thức `window.print()` của trình duyệt.
  - Tối ưu hóa in: Toàn bộ Header chứa nút bấm điều hướng, menu chân trang và các cảnh báo hành động được ẩn đi nhờ lớp `@media print` CSS tùy biến (`print:hidden`), chỉ giữ lại các bảng chi tiết thanh toán và thông tin khách hàng trên nền trắng sạch để máy in xuất ra rõ nét.

---

## 3) Cancellation Flow Interactions
- **Nút "Hủy đơn" (Chỉ xuất hiện khi đơn ở trạng thái `pending` hoặc `confirmed` và chưa đến ngày đi):**
  - Hành động: Mở Dialog xác nhận hủy tour (`CancelBookingDialog`).
- **Trong Dialog Hủy:**
  - **Lý do hủy đơn:** Trường nhập dữ liệu văn bản đa dòng (textarea). 
  - **Kiểm thử Validation:** Phải nhập lý do hủy tối thiểu 10 ký tự. Nếu không đủ 10 ký tự, nút xác nhận hủy sẽ bị vô hiệu hóa (`disabled`) để ngăn chặn việc gửi dữ liệu trống hoặc không rõ lý do.
  - **Hành vi Submit:** Gọi mutation `useCancelBooking` để gửi `cancellation_reason` lên server. Nút bấm xác nhận hiển thị trạng thái xoay loading. Khi thành công, đóng dialog, làm mới truy vấn detail để cập nhật Timeline và hiển thị lý do hủy vừa nhập lên góc phải màn hình, đồng thời đẩy toast thông báo thành công.
