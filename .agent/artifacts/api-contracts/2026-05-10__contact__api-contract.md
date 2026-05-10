# API Contract: Contact Form

> Feature slug: `contact`
> Date: 2026-05-10
> Version: 1.0

---

## 1) Base URL
- Dev: `${NEXT_PUBLIC_API_URL}`
- Auth: Public (No auth required)

## 2) Endpoints

### POST /contacts
- **Purpose**: Gửi thông tin liên hệ hoặc đăng ký newsletter.
- **Auth**: Public
- **Request Body** (validated by Zod):
  ```ts
  {
    name?: string;     // Tối đa 100 ký tự
    email: string;     // Phải là email hợp lệ
    phone?: string;    // Regex phone format
    subject: string;   // Không trống
    message: string;   // Tối thiểu 10 ký tự
  }
  ```
- **Response 200**:
  ```ts
  {
    success: true,
    data: unknown,
    message: "Success message"
  }
  ```
- **Error Codes**:
  | Code | HTTP | Description | i18n key |
  |------|------|-------------|----------|
  | 400 | Bad Request | Dữ liệu không hợp lệ | common.errors.bad_request |
  | 422 | Unprocessable Entity | Lỗi validation | common.errors.validation_error |
  | 500 | Internal Server Error | Lỗi hệ thống | common.errors.server_error |

## 3) Data Types
```ts
export interface ContactPayload {
  name?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
```

## 4) Error Model
```ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}
```

## 5) Auth Requirements
| Endpoint | Required Role | Notes |
|----------|--------------|-------|
| POST /contacts | Guest / User | Public access |
