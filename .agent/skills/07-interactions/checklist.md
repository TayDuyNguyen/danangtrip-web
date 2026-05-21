# Checklist: 07-interactions

## Form Validation
- [ ] Form dùng `react-hook-form` + `zodResolver` — không validate thủ công bằng useState
- [ ] Zod schema export type qua `z.infer` — không viết type riêng song song
- [ ] Field-level errors hiển thị đúng chỗ (không chỉ toast)
- [ ] Submit button disabled + loading state khi mutation pending

## Mutations
- [ ] Mutation success → `invalidateQueries` đúng query key
- [ ] Mutation success → toast success (qua `next-intl`)
- [ ] Mutation error → toast error (normalized, không raw backend error)
- [ ] Form reset sau submit thành công

## Destructive Actions
- [ ] Delete/destructive action có confirm dialog (KHÔNG `window.confirm`)
- [ ] Confirm dialog có loading state khi đang xử lý
- [ ] Cancel button đóng dialog mà không thực hiện action

## Search / Filter / Pagination
- [ ] Search input debounce ≥ 400ms trước khi trigger query
- [ ] Search/filter state sync với URL query params
- [ ] Pagination sync với URL query params
- [ ] Reset filter/search → URL params được clear
- [ ] Page reset về 1 khi search/filter thay đổi

## i18n
- [ ] Mọi user-facing text dùng `useTranslations` (next-intl)
- [ ] vi/en message files đồng bộ — thêm cùng lúc
- [ ] Validation messages qua i18n (không hardcode)
- [ ] Toast messages qua i18n (không hardcode)

## Code Quality
- [ ] `npm run typecheck` pass
- [ ] `npm run lint` pass
- [ ] Không có `window.confirm` trong codebase mới

## Output
- [ ] Interaction spec tạo đúng path: `.agent/artifacts/interaction-specs/YYYY-MM-DD__<slug>__interaction-spec.md`
