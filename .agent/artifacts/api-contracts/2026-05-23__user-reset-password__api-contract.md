# API Contract: Đặt lại mật khẩu (user-reset-password)

- **Feature Slug**: `user-reset-password`
- **Mã Endpoint**: `POST /auth/reset-password`
- **Phương thức HTTP**: `POST`
- **Địa chỉ API thực tế**: `${NEXT_PUBLIC_API_URL}/auth/reset-password` (Qua `API_ENDPOINTS.AUTH.RESET_PASSWORD` trong `src/config/api.ts`)

---

## 1. Request Data Contract (Đặc tả dữ liệu gửi đi)

Dữ liệu gửi từ Client lên Server phải tuân thủ nghiêm ngặt định dạng JSON sau:

### Kiểu dữ liệu TypeScript (`ResetPasswordRequest`)
Được định nghĩa tại `src/types/auth.types.ts`:
```typescript
export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}
```

### Đặc tả Chi tiết các trường (Fields Specification)

| Tên trường (Payload) | Kiểu dữ liệu | Kiểm duyệt Client (Zod) | Mô tả / Ràng buộc Backend |
|---|---|---|---|
| `token` | `string` | Bắt buộc (`min(1)`) | Mã token xác thực khôi phục mật khẩu nhận được từ liên kết email. |
| `email` | `string` | Bắt buộc, định dạng Email hợp lệ | Địa chỉ Email của tài khoản cần đổi mật khẩu. |
| `password` | `string` | Bắt buộc, tối thiểu 8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt | Mật khẩu mới mong muốn. |
| `password_confirmation` | `string` | Trùng khớp 100% với trường `password` | Chuỗi xác nhận lại mật khẩu mới. |

---

## 2. Response Data Contract (Đặc tả dữ liệu phản hồi)

### Phản hồi thành công (HTTP Status 200 OK)
```json
{
  "success": true,
  "message": "Đặt lại mật khẩu thành công.",
  "data": null
}
```

### Phản hồi thất bại do lỗi dữ liệu đầu vào (HTTP Status 422 Unprocessable Entity)
```json
{
  "success": false,
  "message": "Dữ liệu đầu vào không hợp lệ.",
  "errors": {
    "email": [
      "Email không tồn tại trong hệ thống."
    ],
    "token": [
      "Mã xác thực không hợp lệ hoặc đã hết hạn."
    ],
    "password": [
      "Mật khẩu phải chứa ít nhất một chữ hoa."
    ]
  }
}
```

### Phản hồi lỗi hệ thống chung (HTTP Status 500 Internal Server Error)
```json
{
  "success": false,
  "message": "Có lỗi hệ thống xảy ra. Vui lòng thử lại sau.",
  "data": null
}
```

---

## 3. Client Mapping & Transformation Flow

1. **Validation**: Biểu mẫu biểu diễn dữ liệu bằng interface `ResetPasswordData` (chứa `confirmPassword`).
2. **Transformation**: Trước khi gọi API qua `authService.resetPassword`, cấu trúc dữ liệu được map từ `ResetPasswordData` sang `ResetPasswordRequest`:
   - Trường `confirmPassword` của Client được ánh xạ sang trường `password_confirmation` phù hợp với cấu trúc máy chủ Laravel.
3. **API call execution**:
   ```typescript
   // Chuyển đổi dữ liệu trong Form submit handler
   const payload: ResetPasswordRequest = {
     token: formData.token,
     email: formData.email,
     password: formData.password,
     password_confirmation: formData.confirmPassword
   };
   
   // Gọi service
   const response = await authService.resetPassword(payload);
   ```
4. **Error handling**: Bất kỳ lỗi validation (422) hay lỗi hệ thống nào đều được đón và format qua `getApiErrorMessage(response)` để hiển thị toast trực quan cho người dùng.
