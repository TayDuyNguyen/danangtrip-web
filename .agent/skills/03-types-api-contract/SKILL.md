# Skill: 03-types-api-contract (Định nghĩa Types & API Contract)

## 0) Tuyên bố tự mô tả
Skill này tự chứa toàn bộ quy tắc để định nghĩa TypeScript interfaces, Zod schemas, và API service functions từ SRS/analysis.

## 1) Goal
Chuyển SRS/analysis thành:
- **TypeScript interfaces/DTOs**
- **Zod validation schemas**
- **API service functions** (async, typed)
- **API contract document**

## 2) Persona (mandatory)
Đóng vai: **System Architect**. Đọc `persona.md` trước khi làm.

## 3) Input & Context (must read first)
- `persona.md`
- `.agent/rules/PROJECT_RULES.md`
- Screen analysis file: `.agent/artifacts/analysis/YYYY-MM-DD__<slug>__screen-analysis.md`
- Existing types: `src/types/` (kiểm tra reuse)
- Existing services: `src/services/` (kiểm tra patterns)
- API documentation backend (nếu có)

## 4) Workflow

### 4.1 Định nghĩa TypeScript Types
1. Đọc data fields từ analysis → tạo interfaces.
2. Placement:
   - **Shared types** (dùng bởi ≥ 2 features): `src/types/<entity>.types.ts`
   - **Feature-specific types**: `src/features/<feature>/types/index.ts`
3. Conventions:
   - Suffix `.types.ts` cho type files.
   - `import type` cho type-only imports.
   - Không dùng `any` — dùng `unknown` + type guard nếu cần.

### 4.2 Zod Validation Schemas
4. Tạo Zod schemas cho:
   - **Request bodies** (form submissions, search params)
   - **Response validation** (optional — dùng khi cần runtime validation)
5. Placement: `src/features/<feature>/validators/<entity>.validator.ts`
6. Export cả schema và inferred type: `type CreateOrderInput = z.infer<typeof createOrderSchema>`

### 4.3 API Service Functions
7. Tạo service functions:
   - File: `src/services/<feature>.service.ts`
   - Dùng axios instance từ `src/lib/` (KHÔNG dùng raw fetch/axios trong service)
   - Mỗi function là `async`, typed đầy đủ input/output
   - Error handling: throw typed errors
8. Patterns:
   ```ts
   export const featureService = {
     getList: async (params: ListParams): Promise<PaginatedResponse<Entity>> => { ... },
     getById: async (id: string): Promise<Entity> => { ... },
     create: async (data: CreateInput): Promise<Entity> => { ... },
     update: async (id: string, data: UpdateInput): Promise<Entity> => { ... },
     delete: async (id: string): Promise<void> => { ... },
   };
   ```

### 4.4 API Contract Document
9. Tạo API contract doc theo template.

## 5) Strict Rules
- Types phải match backend response — KHÔNG tự bịa fields.
- Service functions KHÔNG chứa business logic — chỉ transport.
- Zod schemas phải sync với TypeScript types.
- Không import chéo sibling features.

## 6) Output specification
Tạo files:
- TypeScript types: `src/types/` hoặc `src/features/<feature>/types/`
- Zod validators: `src/features/<feature>/validators/`
- API service: `src/services/<feature>.service.ts`
- Contract doc: `.agent/artifacts/api-contracts/YYYY-MM-DD__<feature-slug>__api-contract.md`

Template: `template_api_contract.md`

## 7) Control
Đối chiếu `checklist.md` và report Pass/Fail.
