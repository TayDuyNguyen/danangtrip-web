# API Contract: <Feature Name>

> Feature slug: `<feature-slug>`
> Date: YYYY-MM-DD
> Version: 1.0

---

## 1) Base URL
- Dev: `${NEXT_PUBLIC_API_URL}`
- Auth: Bearer token (Authorization header)

## 2) Endpoints

### GET /api/<resource>
- **Purpose**: Lấy danh sách
- **Auth**: Required / Public
- **Query Params**:
  | Param | Type | Required | Default | Description |
  |-------|------|----------|---------|-------------|
  | | | | | |
- **Response 200**:
  ```ts
  {
    data: Entity[];
    pagination: { page: number; limit: number; total: number; };
  }
  ```
- **Error Codes**:
  | Code | HTTP | Description | i18n key |
  |------|------|-------------|----------|
  | | | | |

### GET /api/<resource>/:id
- **Purpose**: Lấy chi tiết
- **Response 200**: `Entity`
- **Error 404**: Resource not found

### POST /api/<resource>
- **Purpose**: Tạo mới
- **Request Body** (validated by Zod):
  ```ts
  {
    // fields
  }
  ```
- **Response 201**: `Entity`
- **Validation Errors 400**:
  | Field | Rule | Message key |
  |-------|------|-------------|
  | | | |

### PUT /api/<resource>/:id
- **Purpose**: Cập nhật
- **Request Body**: Same as POST (partial)
- **Response 200**: `Entity`

### DELETE /api/<resource>/:id
- **Purpose**: Xóa
- **Response 204**: No content
- **Error 403**: Không có quyền

## 3) Data Types
```ts
// Paste TypeScript interfaces here
```

## 4) Error Model
```ts
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}
```

## 5) Auth Requirements
| Endpoint | Required Role | Notes |
|----------|--------------|-------|
| | | |
