# API Contract: Form liên hệ

> Feature slug: `contact`
> Date: 2026-05-10
> Version: 1.0

---

## 1) Base URL
- Dev: `${NEXT_PUBLIC_API_URL}`
- Auth: 🌐 Public (No token required for submission)

## 2) Endpoints

### POST /contacts
- **Purpose**: Gửi thông tin liên hệ từ người dùng.
- **Auth**: Public 🌐
- **Request Body** (validated by Zod):
  ```ts
  {
    name: string;      // Họ tên người gửi (2-100 ký tự)
    email: string;     // Email người gửi (định dạng email)
    phone?: string;    // Số điện thoại (optional, format VN)
    subject?: string;  // Tiêu đề (optional, max 200 ký tự)
    message: string;   // Nội dung tin nhắn (10-1000 ký tự)
  }
  ```
- **Response 200**:
  ```ts
  {
    success: true,
    data: {
      id: number,
      name: string,
      email: string,
      phone: string | null,
      subject: string | null,
      message: string,
      status: 'new',
      created_at: string
    },
    message: "Gửi liên hệ thành công"
  }
  ```
- **Validation Errors 422**:
  | Field | Rule | Message key |
  |-------|------|-------------|
  | email | email | `email_invalid` |
  | message | min:10 | `message_min_10` |
  | phone | regex | `phone_invalid` |

## 3) Data Types
```ts
/**
 * Contact entity
 */
export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'new' | 'read' | 'replied';
  reply: string | null;
  replied_by: number | null;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for contact submission request (Zod inferred)
 */
export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}
```

## 4) Error Model
```ts
interface ApiResponse<T = unknown> {
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
| POST /contacts | Public | Cho phép khách gửi liên hệ không cần đăng nhập. |
