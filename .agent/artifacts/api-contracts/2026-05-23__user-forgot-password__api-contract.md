# API Contract: user-forgot-password

> Feature slug: `user-forgot-password`
> Date: 2026-05-23
> Version: 1.0

---

## 1) Base URL
- Dev: `${NEXT_PUBLIC_API_URL}`
- Auth: N/A (Trang công khai không yêu cầu token)

## 1.1) Source References
- `api_list.md` section: Màn hình User - Quên mật khẩu
- `src/config/api.ts` entries: `API_ENDPOINTS.AUTH.FORGOT_PASSWORD = "/auth/forgot-password"`
- Analysis file: `.agent/artifacts/analysis/2026-05-23__user-forgot-password__screen-analysis.md`

---

## 2) Endpoints

### POST /auth/forgot-password
- **Purpose**: Gửi email chứa link đặt lại mật khẩu cho người dùng.
- **Auth**: Public (Không cần token)
- **Request Body** (được validate bởi `forgotPasswordSchema` của Zod):
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response 200 (Thành công)**:
  ```json
  {
    "success": true,
    "message": "Reset link sent successfully."
  }
  ```
  *(Lưu ý: API luôn phản hồi thành công hoặc mã 200 trung lập theo BR-01).*
- **Error Codes**:
  | Code | HTTP | Description | i18n key |
  |------|------|-------------|----------|
  | 422 | Unprocessable Entity | Email trống hoặc sai định dạng. | `validation.email_required` hoặc `validation.email_invalid` |
  | 429 | Too Many Requests | Spam gửi yêu cầu quá nhiều lần. | `failure.general_error` (hoặc thông báo giới hạn yêu cầu) |
  | 500 | Internal Server Error | Lỗi hệ thống máy chủ thư/hệ quản trị cơ sở dữ liệu. | `failure.general_error` |

---

## 3) Data Types

Các kiểu dữ liệu TypeScript và Schema kiểm soát dữ liệu đầu vào đã có sẵn trong codebase:

### Request interface (`src/types/auth.types.ts`)
```typescript
export interface ForgotPasswordRequest {
  email: string;
}
```

### Zod Validation Schema (`src/features/auth/validators/auth.schema.ts`)
```typescript
import { z } from "zod";
import { ERROR_MESSAGES } from "@/utils/constants";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .regex(EMAIL_REGEX, ERROR_MESSAGES.INVALID_EMAIL),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
```

---

## 4) Error Model

Hệ thống sử dụng mô hình axios wrapper để chuẩn hóa lỗi trả về dạng:
```typescript
interface ApiResponse<T = unknown> {
  success: boolean;
  code?: number;
  error_key?: string;
  user_message?: string;
  errors?: Record<string, string[] | string | undefined>;
  error?: string;
  message?: string;
  status?: number;
  data?: T;
}
```

---

## 5) Auth Requirements
| Endpoint | Required Role | Notes |
|----------|--------------|-------|
| `POST /auth/forgot-password` | Khách truy cập (Public) | Không đính kèm access token trong header. Được bỏ qua xử lý tự động refresh token trong `src/lib/axios.ts`. |

---

## 6) Files Expected To Change

Nhờ việc chuẩn bị trước cực tốt, các tệp kiểu dữ liệu và dịch vụ đã hoàn chỉnh 100%:
- `src/types/auth.types.ts` (Đã đầy đủ - Không cần sửa đổi)
- `src/features/auth/validators/auth.schema.ts` (Đã đầy đủ - Không cần sửa đổi)
- `src/services/auth.service.ts` (Đã đầy đủ - Không cần sửa đổi)
- `src/lib/axios.ts` (Đã cấu hình bypass auth cho `/auth/forgot-password` - Không cần sửa đổi)
