# Checklist: 07-interactions

- [ ] Form validation dùng Zod schemas — field-level errors hiển thị.
- [ ] Form submit: loading state → success/error toast.
- [ ] CRUD: Create, Read, Update, Delete functional.
- [ ] Mutation → invalidateQueries sau mỗi mutation.
- [ ] Confirm dialog trước delete/destructive actions.
- [ ] Search: debounced (≥300ms), dùng `useDebounce`.
- [ ] Filter/Sort: functional, sync với URL query params.
- [ ] Pagination: prev/next + page numbers, scroll to top.
- [ ] Edge case: page > total → redirect page 1.
- [ ] Toast success/error cho mọi user actions.
- [ ] Error messages normalized — không raw backend errors.
- [ ] Mọi user-facing text dùng i18n keys.
- [ ] i18n vi/en đồng bộ cho validation + toast messages.
- [ ] `npm run typecheck` pass.
- [ ] `npm run lint` pass.
