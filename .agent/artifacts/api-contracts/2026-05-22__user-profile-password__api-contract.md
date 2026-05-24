# API Contract: Đổi mật khẩu (user-profile-password)

> Feature slug: `user-profile-password`
> Date: 2026-05-22
> Version: 1.0

---

## 1) Base URL
- Dev: `${NEXT_PUBLIC_API_URL}`
- Auth: Bearer token (Authorization header)

## 1.1) Source References
- `api_list.md` section: 12.3 PUT /user/password
- `src/config/api.ts` entries: `API_ENDPOINTS.USER.CHANGE_PASSWORD` = `"/user/password"`
- Analysis file: [.agent/artifacts/analysis/2026-05-22__user-profile-password__screen-analysis.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/analysis/2026-05-22__user-profile-password__screen-analysis.md)

---

## 2) Endpoints

### PUT /user/password
- **Purpose**: Đổi mật khẩu tài khoản của người dùng hiện tại
- **Auth**: Required (Bearer Token)
- **Request Body** (validated by Zod):
  ```ts
  {
    current_password: string;
    password: string;
    password_confirmation: string;
  }
  ```
- **Response 200**:
  ```ts
  {
    code: number;
    message: string;
    data: null;
  }
  ```
- **Validation Errors 422 / 400**:
  | Field | Rule | Message key | Description |
  |-------|------|-------------|-------------|
  | `current_password` | Required | `error.required` | Trường bắt buộc |
  | `password` | Min length 8 | `error.invalid_password` | Tối thiểu 8 ký tự |
  | `password` | Password Regex | `error.invalid_password` | Ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số, 1 ký tự đặc biệt |
  | `password_confirmation` | Required | `error.required` | Trường bắt buộc |
  | `password_confirmation` | Matching `password` | `error.password_mismatch` | Phải khớp với mật khẩu mới |

- **Error Codes**:
  | Code | HTTP | Description | i18n key |
  |------|------|-------------|----------|
  | `401` | Unauthorized | Phiên đăng nhập hết hạn | `api_errors.auth_session_expired` |
  | `422` | Unprocessable Entity | Sai mật khẩu hiện tại | `api_errors.validation_failed` (Hoặc thông báo cụ thể từ API) |

---

## 3) Data Types

### User Domain Types
```ts
// src/types/user.types.ts
export interface ChangePasswordInput {
  current_password: string;
  password: string;
  password_confirmation: string;
}
```

### Form & Validator Types
```ts
// src/features/profile/validators/profile.validator.ts
import { z } from "zod";
import { ERROR_MESSAGES, REGEX } from "@/utils/constants";

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, ERROR_MESSAGES.REQUIRED),
    password: z
      .string()
      .min(8, ERROR_MESSAGES.INVALID_PASSWORD)
      .regex(REGEX.PASSWORD, ERROR_MESSAGES.INVALID_PASSWORD),
    password_confirmation: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: ERROR_MESSAGES.PASSWORD_MISMATCH,
    path: ["password_confirmation"],
  });

export type ChangePasswordFormInput = z.infer<typeof changePasswordSchema>;
```

---

## 4) Error Model
```ts
interface ApiResponse<T = null> {
  code: number;
  message: string;
  data: T;
}
```

---

## 5) Auth Requirements
| Endpoint | Required Role | Notes |
|----------|--------------|-------|
| `PUT /user/password` | `user`, `tour_guide`, `manager`, `admin` | Mọi user đã đăng nhập đều có quyền đổi mật khẩu. |

---

## 6) Files Expected To Change
- `src/features/profile/validators/profile.validator.ts` [NEW]
- `src/features/profile/components/PasswordChangeForm.tsx` [NEW]
- `src/features/profile/hooks/useProfileMutations.ts` [NEW]
- `src/app/[locale]/(main)/(protected)/profile/password/page.tsx` [NEW]
- `src/messages/vi/settings.json` & `src/messages/en/settings.json` [MODIFY]
- `src/config/routes.ts` [MODIFY]
