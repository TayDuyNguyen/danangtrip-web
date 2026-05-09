# Checklist: 09-testing

- [ ] Mỗi AC trong SRS có ≥ 1 test case.
- [ ] Test cases document tạo đúng path.
- [ ] Unit tests: components render đúng với các states (loading, empty, error, success).
- [ ] Unit tests: hooks hoạt động đúng với mock service.
- [ ] Unit tests: Zod validators reject invalid input.
- [ ] MSW handlers setup cho success + error + empty + loading scenarios.
- [ ] E2E tests: flow chính (CRUD) pass.
- [ ] E2E tests: search/filter/pagination functional.
- [ ] Regression: routes navigable, no 404.
- [ ] Regression: i18n locale switch works.
- [ ] Regression: auth/protected routes redirect correctly.
- [ ] Coverage > 80%.
- [ ] Tất cả tests pass.
- [ ] Skipped tests có lý do ghi rõ.
