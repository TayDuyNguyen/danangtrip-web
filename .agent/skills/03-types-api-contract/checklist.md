# Checklist: 03-types-api-contract

## Source Reconciliation
- [ ] Đã đối chiếu `api_list.md` với `src/config/api.ts` — không tự đặt endpoint
- [ ] Mọi endpoint trong contract có nguồn gốc từ `api_list.md` hoặc ghi rõ `[ASSUMPTION]`

## Type Design
- [ ] Entity types đặt đúng `src/types/` (shared) hoặc `src/features/<f>/types.ts` (local)
- [ ] Params types cho query string đã có
- [ ] Payload types cho request body đã có
- [ ] Không có `any` — dùng `unknown` + type guard nếu cần
- [ ] `import type` cho type-only imports

## Zod Schema
- [ ] Schema dùng Zod v4 syntax
- [ ] Type export qua `z.infer<typeof schema>` — không viết type riêng song song
- [ ] Validation messages i18n-ready (key hoặc ghi chú sẽ replace)
- [ ] Schema sync với TypeScript types

## Service
- [ ] Service dùng `axiosInstance` từ `src/lib/axios.ts` — không raw axios
- [ ] Service dùng endpoint constant từ `src/config/api.ts` — không hardcode path
- [ ] Service chỉ transport — không có business logic
- [ ] Service typed đầy đủ (input/output)

## Documentation
- [ ] Contract doc tạo đúng path: `.agent/artifacts/api-contracts/YYYY-MM-DD__<slug>__api-contract.md`
- [ ] Contract doc có source references (api_list.md section, config/api.ts entries)
- [ ] Contract doc có endpoint list với method/path/auth
- [ ] Contract doc có request/response notes
- [ ] Contract doc có files expected to change
- [ ] `npm run typecheck` pass
