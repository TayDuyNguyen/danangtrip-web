# Checklist Result: 03-types-api-contract (user-profile-password)

## Source Reconciliation
- [x] Đã đối chiếu `api_list.md` với `src/config/api.ts` — trùng khớp với `PUT /user/password` (API_ENDPOINTS.USER.CHANGE_PASSWORD).
- [x] Mọi endpoint trong contract có nguồn gốc từ `api_list.md`.

## Type Design
- [x] Entity/Input types đặt đúng `src/types/user.types.ts` (`ChangePasswordInput`).
- [x] Không có `any` — toàn bộ types được định nghĩa rõ ràng.
- [x] `import type` cho type-only imports được tuân thủ.

## Zod Schema
- [x] Schema dùng Zod v4 syntax tại `src/features/profile/validators/profile.validator.ts`.
- [x] Type export qua `z.infer<typeof changePasswordSchema>` (`ChangePasswordFormInput`).
- [x] Validation messages sử dụng hằng số `ERROR_MESSAGES` từ `src/utils/constants.ts` (sẽ được tích hợp với i18n trong phần hiển thị).
- [x] Schema sync với TypeScript types.

## Service
- [x] Service dùng `axiosInstance` từ `src/lib/axios.ts` thông qua `profileService`.
- [x] Service dùng endpoint constant `API_ENDPOINTS.USER.CHANGE_PASSWORD` từ `src/config/api.ts`.
- [x] Service chỉ transport — không có business logic.
- [x] Service typed đầy đủ (input `ChangePasswordInput`, output `Promise<ApiResponse<unknown>>`).

## Documentation
- [x] Contract doc tạo đúng path: `.agent/artifacts/api-contracts/2026-05-22__user-profile-password__api-contract.md`.
- [x] Contract doc có source references đầy đủ.
- [x] Contract doc có endpoint list với method/path/auth.
- [x] Contract doc có request/response notes.
- [x] Contract doc có files expected to change.
- [x] `npm run typecheck` pass.

**Kết quả: PASS**
