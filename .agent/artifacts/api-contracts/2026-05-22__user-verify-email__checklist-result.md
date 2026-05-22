# Checklist Result: 03-types-api-contract (user-verify-email)

## Source Reconciliation
- [x] Đã đối chiếu `api_list.md` với `src/config/api.ts` — trùng khớp với `POST /auth/verify-email` (`API_ENDPOINTS.AUTH.VERIFY_EMAIL`) và `POST /auth/resend-verification` (`API_ENDPOINTS.AUTH.RESEND_VERIFICATION`).
- [x] Mọi endpoint trong contract có nguồn gốc từ `api_list.md`.

## Type Design
- [x] Entity/Input types đặt đúng `src/types/auth.types.ts` (`VerifyEmailRequest`).
- [x] Không có `any` — toàn bộ types được định nghĩa rõ ràng.
- [x] `import type` cho type-only imports được tuân thủ.

## Zod Schema
- [x] Schema dùng Zod v4 syntax tại `src/features/auth/validators/auth.schema.ts` (`verifyEmailSchema`).
- [x] Type export qua `z.infer<typeof verifyEmailSchema>` (`VerifyEmailSchema`).
- [x] Validation messages sử dụng key dịch sẵn hoặc hằng số lỗi chuẩn từ `src/utils/constants.ts`.
- [x] Schema sync với TypeScript types.

## Service
- [x] Service dùng `axiosInstance` từ `src/lib/axios.ts` thông qua `authService`.
- [x] Service dùng endpoint constant `API_ENDPOINTS.AUTH.VERIFY_EMAIL` và `API_ENDPOINTS.AUTH.RESEND_VERIFICATION` từ `src/config/api.ts`.
- [x] Service chỉ transport — không có business logic.
- [x] Service typed đầy đủ (input `VerifyEmailRequest`, output `Promise<ApiResponse<unknown>>`).

## Documentation
- [x] Contract doc tạo đúng path: `.agent/artifacts/api-contracts/2026-05-22__user-verify-email__api-contract.md`.
- [x] Contract doc có source references đầy đủ.
- [x] Contract doc có endpoint list với method/path/auth.
- [x] Contract doc có request/response notes.
- [x] Contract doc có files expected to change.
- [x] `npm run typecheck` pass.

**Kết quả: PASS**
