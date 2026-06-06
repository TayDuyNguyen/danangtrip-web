# API Contract & Target Screen Lock: user-profile

> Feature slug: `web_route_api_next_screen_review`
> Date: 2026-05-27
> Target screen: **user-profile** (Hồ sơ cá nhân - edit and upload avatar)

---

## 1) Locked Target Screen Selection

We officially select and lock **`user-profile`** (Hồ sơ cá nhân) for implementation in the current cycle.

- **Route:** `/profile`
- **Controller/Page file:** `src/app/[locale]/(main)/(protected)/profile/page.tsx`
- **Feature Directory:** `src/features/profile/`

---

## 2) API Route Contracts

### 2.1 Get Profile Information
- **Endpoint:** `GET /api/v1/user/profile`
- **Authentication:** JWT Token Required (`Authorization: Bearer <token>`)
- **Response Format (`ApiResponse<User>`):**
  ```json
  {
    "status": "success",
    "message": "Retrieve profile successfully",
    "data": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "User Name",
      "phone": "0905123456",
      "avatar": "https://storage.googleapis.com/.../avatar.jpg",
      "role": "user",
      "birthdate": "1995-10-15",
      "gender": "male",
      "city": "Đà Nẵng",
      "createdAt": "2026-05-10T12:00:00Z"
    }
  }
  ```

### 2.2 Update Profile Information
- **Endpoint:** `PUT /api/v1/user/profile`
- **Authentication:** JWT Token Required (`Authorization: Bearer <token>`)
- **Headers:** `Content-Type: application/json`
- **Request Payload (`UpdateProfileInput`):**
  ```json
  {
    "full_name": "Nguyễn Văn An",
    "phone": "0905123456",
    "birthdate": "1995-10-15",
    "gender": "male",
    "city": "Đà Nẵng"
  }
  ```
- **Response Format (`ApiResponse<User>`):**
  ```json
  {
    "status": "success",
    "message": "Profile updated successfully",
    "data": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "Nguyễn Văn An",
      "phone": "0905123456",
      "avatar": "https://storage.googleapis.com/.../avatar.jpg",
      "role": "user",
      "birthdate": "1995-10-15",
      "gender": "male",
      "city": "Đà Nẵng",
      "createdAt": "2026-05-10T12:00:00Z"
    }
  }
  ```

### 2.3 Upload Avatar
- **Endpoint:** `POST /api/v1/user/profile/avatar`
- **Authentication:** JWT Token Required (`Authorization: Bearer <token>`)
- **Headers:** `Content-Type: multipart/form-data`
- **Request Payload:**
  - File parameter: `avatar` (type: image file, max 2MB)
- **Response Format (`ApiResponse<User>`):**
  ```json
  {
    "status": "success",
    "message": "Avatar uploaded successfully",
    "data": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "Nguyễn Văn An",
      "phone": "0905123456",
      "avatar": "https://storage.googleapis.com/.../new-avatar.jpg",
      "role": "user",
      "birthdate": "1995-10-15",
      "gender": "male",
      "city": "Đà Nẵng",
      "createdAt": "2026-05-10T12:00:00Z"
    }
  }
  ```

---

## 3) Validation Schema Definition

We will add the following schema to `src/features/profile/validators/profile.validator.ts`:

```typescript
import { z } from "zod";
import { ERROR_MESSAGES, REGEX } from "@/utils/constants";

export const updateProfileSchema = z.object({
  full_name: z.string().min(1, { message: ERROR_MESSAGES.REQUIRED }),
  phone: z
    .string()
    .nullable()
    .optional()
    .refine((val) => !val || REGEX.PHONE.test(val), {
      message: ERROR_MESSAGES.INVALID_PHONE,
    }),
  birthdate: z.string().nullable().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say", ""]).nullable().optional(),
  city: z.string().nullable().optional(),
});

export type UpdateProfileFormInput = z.infer<typeof updateProfileSchema>;
```
