# Data Integration: user-forgot-password

> Feature slug: `user-forgot-password`
> Date: 2026-05-23
> Source UI spec: [2026-05-23__user-forgot-password__ui-spec.md](file:///D:/DATN/danangtrip-web/.agent/artifacts/ui-specs/2026-05-23__user-forgot-password__ui-spec.md)

---

## 1) Summary
- **Mục tiêu tích hợp:** Kết nối giao diện người dùng `ForgotPasswordForm` với dịch vụ API thực tế `POST /auth/forgot-password` thông qua công cụ TanStack Query.
- **Dữ liệu truyền dẫn:** Gửi dữ liệu Email dạng JSON lên máy chủ, nhận phản hồi và chuyển trạng thái UI phù hợp.

## 2) Query / Mutation Plan

Chúng ta sử dụng `useMutation` từ `@tanstack/react-query` thay vì `useQuery` vì đây là hành động ghi dữ liệu (Write action/Mutation) được kích hoạt bởi sự kiện người dùng click gửi.

### Mutation: Request Password Reset
```typescript
const requestMutation = useMutation({
  mutationFn: (data: { email: string }) => authService.forgotPassword(data),
  onSuccess: (response) => {
    if (response.success) {
      setIsSuccess(true);
      setResendCooldown(60);
    } else {
      const errorMsg = getApiErrorMessage(response, t("failure.general_error"));
      toast.error(errorMsg);
    }
  },
  onError: (error) => {
    const errorMsg = getApiErrorMessage(error, t("failure.general_error"));
    toast.error(errorMsg);
  },
});
```

---

## 3) State Lifecycle Mapping

| API State | UI Representation | Component Behavior |
|---|---|---|
| **Idle (Chờ)** | Form nhập email mặc định. Nút Submit sẵn sàng kích hoạt khi nhập đúng. | State `isSuccess = false`, `emailError = null`. |
| **Pending (Đang gọi)** | Nút Submit hiển thị icon loading SVG xoay tròn và nhãn `Đang xử lý...`. | Nút submit bị `disabled`. Trường Input bị `disabled` để tránh thay đổi dữ liệu khi đang truyền dẫn. |
| **Success (Thành công)** | Ẩn form chính. Render màn hình chúc mừng Success màu đồng dịu nhẹ. Khởi động bộ cooldown gửi lại 60s. | State `isSuccess = true`, kích hoạt `setResendCooldown(60)`. |
| **Error (Lỗi)** | Hiển thị Toast thông báo lỗi trực quan màu đỏ ở góc trên bên phải (sử dụng thư viện `sonner`). | Nút submit và input quay trở lại trạng thái sẵn sàng nhập liệu để sửa đổi thông tin. |

---

## 4) Data Security & Enumeration Prevention (BR-01)
Để ngăn chặn nguy cơ tin tặc sử dụng tính năng này để dò quét email tồn tại trong hệ thống (User Enumeration):
- Phản hồi thành công từ API/UI luôn là **trung lập (Neutral)**: `Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến địa chỉ email này nếu nó tồn tại trong hệ thống.`
- Giao diện thành công của cả email thật và email giả/không có trong database là **hoàn toàn trùng khớp**.

---

## 5) Files Expected To Change
- `src/features/auth/components/forgot-password-form.tsx` (Đã hoàn thiện tích hợp)
- `src/app/[locale]/(auth)/forgot-password/page.tsx` (Đã hoàn thiện tích hợp)

---

## 6) Verification Checklist
- [x] Đã bọc TanStack Query `useMutation` thay cho Fetch thủ công.
- [x] Đã xử lý lỗi biên qua `getApiErrorMessage` và Toast.
- [x] Đã vô hiệu hóa nhập liệu khi đang gửi API.
- [x] Đã bảo vệ bảo mật thông tin tài khoản qua Success copy trung lập.
