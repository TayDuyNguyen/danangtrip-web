---
name: 03-types-api-contract
description: Convert analysis into concrete types, validators, services, and an API contract document. Use when a feature introduces or changes data contracts.
---

# Skill: 03-types-api-contract

## Overview

Skill này chuyển screen analysis thành:

- shared hoặc feature-local TypeScript types
- Zod v4 validators
- service contract plan
- API contract document

Đây là bước **chốt ngôn ngữ dữ liệu** giữa UI, service, validation, và backend expectation.
Không có bước này, các bước sau sẽ tự suy diễn type và dẫn đến drift giữa form, service, và API response.

## Required Input

- `persona.md`
- `.agent/rules/PROJECT_RULES.md`
- Analysis file từ `01-screen-analysis`
- `/DATN/DATN_Tài liệu/docs/api/api_list.md`
- `src/config/api.ts`
- `src/types/`
- `src/services/`
- `src/lib/axios.ts`

## Recommended Questions To Answer

1. Type này là shared hay chỉ feature-local?
2. Có raw shape nào không đáng tin cậy cần normalize không?
3. Zod schema nào cần có ở boundary?
4. Service method nào thật sự cần cho feature?
5. Có assumption nào về auth, params, hoặc response envelope không?

## Process

### 1) Source Reconciliation

Đối chiếu:

- analysis file
- `api_list.md`
- `src/config/api.ts`

Nếu ba nguồn không khớp, phải flag rõ.

### 2) Type Design

Phải chỉ ra:

- entity types (shared nếu dùng nhiều nơi, feature-local nếu chỉ dùng 1 feature)
- params types cho query string
- payload types cho request body
- form input/output types nếu cần tách khỏi API type

### 3) Validation Design

Ghi rõ:

- schema nào cần có
- input nào validate ở form level
- chỗ nào cần `z.infer` để export type từ schema
- message nào cần i18n

### 4) Service Contract Design

Phải mô tả:

- methods cần có
- path/method/auth
- input/output
- error notes

### 5) Handoff To Implementation

Tài liệu cuối phải để người code biết:

- file nào cần tạo
- file nào cần sửa
- contract nào đã chắc
- contract nào còn assumption

## Pattern Chuẩn Của Repo

### Response envelope — bám `src/lib/axios.ts`

```ts
// Mọi API response đều wrap trong envelope này
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
```

### Entity type — feature-local vs shared

```ts
// src/types/tour.ts (shared — dùng nhiều feature)
export interface Tour {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string | null;
  category: TourCategory;
  isActive: boolean;
  createdAt: string;
}

// src/features/tour-booking/types.ts (feature-local — chỉ dùng trong booking)
export interface BookingFormValues {
  tourId: string;
  date: string;
  adults: number;
  children: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}
```

### Zod schema pattern — bám Zod v4

```ts
// src/features/contact/schemas/contact.schema.ts
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự').max(100),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ').optional(),
  message: z.string().min(10, 'Nội dung tối thiểu 10 ký tự').max(2000),
});

// Luôn export type từ schema — không tự viết type riêng
export type ContactFormValues = z.infer<typeof contactFormSchema>;
```

### Service pattern — bám `src/lib/axios.ts`

```ts
// src/services/contact.service.ts
import { axiosInstance } from '@/lib/axios';
import { API } from '@/config/api';
import type { ApiResponse } from '@/types/api';
import type { ContactFormValues } from '../schemas/contact.schema';

export const contactService = {
  // Service chỉ transport — không có business logic
  submit: (data: ContactFormValues) =>
    axiosInstance.post<ApiResponse<void>>(API.CONTACT.SUBMIT, data),

  getList: (params: { page?: number; limit?: number }) =>
    axiosInstance.get<ApiResponse<PaginatedData<ContactMessage>>>(
      API.CONTACT.LIST,
      { params }
    ),
};
```

### Query params type

```ts
// Params type cho list endpoint
export interface TourListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sortBy?: 'price' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}
```

## Output Document

Tạo file:

- `.agent/artifacts/api-contracts/YYYY-MM-DD__<feature-slug>__api-contract.md`

Template:

- `template_api_contract.md`

## Strict Rules

- Không tự suy diễn path, method, hoặc field names — phải đối chiếu `api_list.md` và `src/config/api.ts`
- Không dùng `any`
- Service layer chỉ transport — không nhét business logic, không transform data
- Zod schema phải dùng `z.infer` để export type — không viết type riêng song song
- Message validation nên i18n-ready (dùng key hoặc ghi rõ sẽ replace sau)
- Không được nhảy thẳng sang code mà bỏ qua contract doc

## Red Flags

Nếu thấy những dấu hiệu sau, phải dừng và flag:

- Service gọi `axios` trực tiếp thay vì `axiosInstance` từ `src/lib/axios.ts` → bỏ qua interceptor auth
- Type dùng `any` cho API response → mất type safety toàn bộ downstream
- Schema và type được viết riêng biệt không sync → drift giữa form và API
- Endpoint path hardcode trong service thay vì dùng `API` constant từ `src/config/api.ts`
- Form type khác với schema inferred type → validation không cover đúng fields
- Không handle response envelope `{ code, message, data }` → component đọc sai field

## Common Rationalizations

| Lý do hay gặp | Thực tế |
|---|---|
| "Type đơn giản, viết inline trong component cho nhanh" | Khi cần reuse hoặc test, sẽ phải extract lại — tốn thêm thời gian |
| "Schema nhỏ, không cần `z.infer`" | Khi schema thay đổi, type riêng sẽ không tự update → silent bug |
| "Chưa có API docs, tự đoán field trước" | Phải ghi `[ASSUMPTION]` và flag — không được code trên assumption im lặng |
| "Service chỉ 1 dòng, không cần file riêng" | Khi cần mock trong test hoặc thêm retry logic, sẽ phải refactor toàn bộ |

## Documentation Expectations

Contract doc tốt phải có:

- source references (api_list.md section, config/api.ts entries)
- endpoint list với method/path/auth
- request/response notes đầy đủ
- types (entity, params, payload, form values)
- validators (schema name, key rules)
- service files expected to change

## Verification

- Đối chiếu `checklist.md`
- Contract doc phải chỉ ra endpoint, request/response, types, validators, service files dự kiến thay đổi
- Mọi type trong contract phải có nguồn gốc từ API docs hoặc ghi rõ `[ASSUMPTION]`
- Không có field nào trong form type mà không có trong schema
