# Đặc tả Tương tác: Chi tiết Đơn đặt tour (user-booking-detail)

Tài liệu này đặc tả toàn bộ hành vi, phản hồi trạng thái và trải nghiệm người dùng (UX) đối với các tương tác tương hỗ trên màn hình chi tiết đơn đặt tour.

---

## 1. Quay lại Danh sách Đơn hàng (Navigation Back)

- **Trực quan:** Nút tròn chứa icon `ChevronLeft` nằm ở Header trang chi tiết.
- **Hành vi:**
  - Nhấp chuột (Click/Tap) vào nút sẽ kích hoạt hàm điều hướng `router.push("/bookings")`.
  - Hiệu ứng click: Nút thu nhỏ nhẹ (`active:scale-95`) và thay đổi độ mờ nền mượt mà (`transition-colors duration-300`).

---

## 2. Quy trình Hủy Đơn hàng (Cancel Booking Flow)

- **Điều kiện hiển thị:** Nút "Hủy đơn hàng" chỉ xuất hiện ở Header nếu trạng thái đơn đặt là `pending` hoặc `confirmed` và ngày đi ở tương lai.
- **Hành động Mở:** Click nút "Hủy đơn hàng" đổi trạng thái `isCancelOpen = true`, hiển thị Dialog hủy đơn kèm hiệu ứng làm mờ nền (`backdrop-blur-md`).
- **Xác thực dữ liệu đầu vào (Validation):**
  - Textarea lý do hủy được theo dõi trạng thái. Khi nhấn "Xác nhận hủy", dữ liệu sẽ chạy qua validator:
    - Nếu lý do dưới 10 ký tự, hiển thị thông báo lỗi inline màu đỏ ngay dưới textarea và đổi viền textarea sang màu đỏ.
    - Người dùng gõ thay đổi lý do sẽ tự động xóa thông báo lỗi cũ.
- **Trạng thái Gửi (Submitting State):**
  - Trong lúc gọi API hủy, nút "Xác nhận hủy" chuyển sang trạng thái disabled và hiển thị text *"Đang gửi yêu cầu..."* để tránh người dùng click đúp.
  - Sau khi thành công, dialog đóng lại, cache được làm mới, thông tin cập nhật ngay lập tức mà không cần F5 trang.

---

## 3. Tải và In Hóa đơn (Invoice & Print Action)

### 3.1 Tải Hóa đơn JSON
- **Trực quan:** Nút "In hóa đơn (JSON)".
- **Hành vi:**
  - Tải dữ liệu thô từ API hóa đơn.
  - Sinh đường dẫn dữ liệu mã hóa Base64 dạng JSON.
  - Tự động tạo thẻ anchor ẩn, giả lập click để tải xuống file `invoice-[booking_code].json` về máy tính người dùng.

### 3.2 In hóa đơn giao diện Web
- **Trực quan:** Nút "In hóa đơn" chuẩn.
- **Hành vi:**
  - Kích hoạt lệnh in hệ thống: `window.print()`.
  - **Tối ưu hóa Bố cục In (CSS Print Styles):**
    - Ẩn toàn bộ nút Quay lại, nút In, nút Hủy đơn trên Header.
    - Ẩn dialog nếu đang mở.
    - Hiển thị khối tiêu đề in riêng biệt (`hidden print:block`): **HÓA ĐƠN THANH TOÁN** kèm thông tin mã đơn và thời gian xuất.
    - Kéo rộng layout thành dạng 100% chiều rộng giấy, đảm bảo các bảng giá và thông tin căn lề hoàn hảo.
