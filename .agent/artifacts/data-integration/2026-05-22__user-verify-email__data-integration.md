# Data Integration Report: Xác thực Email (Email Verification)

## 1. Summary
- **Mục tiêu:** Tích hợp API xác thực email (`verifyEmail`) hỗ trợ tự động xác thực qua token link và nhập mã OTP thủ công, kết hợp API gửi lại email xác thực (`resendVerification`).
- **Trạng thái (Verdict):** **READY**

## 2. API Hooks & Mutations Đã Tích Hợp
Các API được tích hợp thông qua React Query mutations trong `VerifyEmailForm`:

1. **`verifyMutation` (`authService.verifyEmail`)**:
   - Nhận payload `{ token, code }`.
   - Thành công: Cập nhật trạng thái hiển thị thành `success` và kích hoạt tự động chuyển hướng sau 3 giây.
   - Thất bại: Gọi `handleVerificationError` để hiển thị lỗi chi tiết lên giao diện tùy vào phương thức xác thực (Auto-token hiển thị card lỗi; OTP thủ công giữ nguyên form và báo lỗi inline + Toast).
2. **`resendMutation` (`authService.resendVerification`)**:
   - Gọi API gửi lại email cho phiên làm việc hiện tại.
   - Thành công: Hiển thị Toast thông báo thành công và bắt đầu bộ đếm ngược 60 giây để khóa nút.
   - Thất bại: Hiển thị Toast thông báo lỗi từ server.

## 3. UI/State Binding
- **`VerifyEmailForm`** liên kết hoàn hảo với trạng thái mutations:
   - Trạng thái `isPending` của `verifyMutation` điều khiển disable toàn bộ các ô nhập OTP và nút xác thực, đồng thời hiển thị spinner trạng thái xử lý.
   - Trạng thái `isPending` của `resendMutation` điều khiển vô hiệu hóa nút gửi lại để tránh spam request.
   - Tích hợp `getApiErrorMessage(error)` xử lý chuẩn hóa và dịch tự động các lỗi phản hồi từ API (ví dụ: liên quan đến token hết hạn hoặc OTP sai) trước khi hiển thị cho người dùng.

## 4. Rủi ro & Nhận xét
- Flow hoạt động độc lập và không phụ thuộc vào `useQuery` cache do tính chất một chiều của hành động xác thực (write-only / transactional action).
- Lỗi bảo mật được kiểm soát tốt thông qua token và hạn chế spam bằng bộ đếm ngược cooldown 60 giây.
- Chuyển sang bước tiếp theo: **07. Interactions**.
