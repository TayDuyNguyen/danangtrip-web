# Báo cáo Kiểm thử: Hóa đơn PDF (user-booking-invoice)

Tài liệu này tổng hợp danh sách các kịch bản kiểm thử tĩnh và kiểm thử tương tác thực tế đối với tính năng tải hóa đơn PDF của đơn đặt tour.

---

## 1. Kiểm thử Tĩnh (Static Verification)

- **Lệnh thực thi:** `npm run prepush:check`
- **Mục tiêu:** Kiểm tra lỗi biên dịch TypeScript và lỗi Linting trong toàn bộ dự án để đảm bảo mã nguồn tuân thủ tiêu chuẩn chất lượng nghiêm ngặt của dự án.
- **Kết quả:** Thành công 100%, không phát hiện bất kỳ cảnh báo hoặc lỗi biên dịch nào liên quan tới file sửa đổi `src/lib/axios.ts` và `src/features/tour/components/BookingDetailClient.tsx`.

---

## 2. Kịch bản Kiểm thử Nghiệp vụ & Giao diện (Manual / Interactive Test Cases)

| Mã ca kiểm thử | Mô tả kịch bản | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- |
| **TC-01** | Bấm nút tải hóa đơn khi đơn hàng chưa thanh toán (`payment_status === "pending"`) | Hiển thị Toast cảnh báo màu vàng `#FEF3C7`, chữ `#F59E0B`, viền `#FCD34D` với thông điệp: "Hóa đơn chỉ có sau khi thanh toán thành công". Không gọi API. | Đạt |
| **TC-02** | Bấm nút tải hóa đơn khi đơn hàng đã thanh toán thành công (`payment_status === "success"`) | Nút chuyển sang nền `#3385D6`, hiển thị spinner `16px` xoay đều, đổi chữ thành "Đang tải hóa đơn...". Sau đó tải file `invoice-<Mã-booking>.pdf` thành công. Hiện toast xanh thông báo. | Đạt |
| **TC-03** | Mô phỏng API gặp lỗi hệ thống (Server 500) hoặc lỗi nghiệp vụ (Server 400 bọc trong Blob) | Hệ thống giải nén được Blob lỗi thành text JSON, trích xuất thông tin lỗi chính xác và hiển thị Toast màu đỏ `#FEE2E2`, chữ `#EF4444`, viền `#FCA5A5`. | Đạt |
| **TC-04** | Phiên đăng nhập hết hạn (Mô phỏng API trả về lỗi 401 Unauthorized) | Interceptor hoặc giao diện tự động dọn dẹp phiên hoạt động (xóa token) và điều hướng an toàn về trang `/login`. | Đạt |

---

## 3. Kết luận

Tính năng **Hóa đơn booking PDF** đã được cài đặt và tối ưu hóa hoàn chỉnh:
- **Tính thẩm mỹ (Aesthetics):** Các thông báo toast hiển thị đúng mã màu chuyên nghiệp, nút tải hóa đơn tích hợp spinner 16px và đổi màu sang màu xanh thương hiệu vô cùng cao cấp.
- **Tính an toàn (Safety):** Chặn các đơn đặt tour chưa thanh toán ngay từ frontend, phân giải an toàn lỗi Blob nhị phân để trích xuất thông báo lỗi chính xác, và bảo mật tuyến đường chặt chẽ qua cơ chế JWT.
