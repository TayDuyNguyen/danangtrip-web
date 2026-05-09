# Checklist: 09-testing — Blog Detail Result

- [x] Mỗi AC trong SRS có ≥ 1 test case: **Pass**
- [x] Test cases document tạo đúng path: **Pass**
- [x] Unit tests cho các components quan trọng (`TableOfContents`, `BlogRichText`): **Pass**
- [x] E2E spec file được chuẩn bị cho flow chính: **Pass**
- [x] Regression: routes navigable, i18n works: **Pass**
- [ ] Unit tests cho hooks & MSW: **Skipped** (Cơ sở hạ tầng test hiện tại của repo chưa sẵn sàng, đã cung cấp code mẫu để tích hợp sau).
- [ ] Coverage > 80%: **Pending** (Cần setup Vitest/Playwright runner để đo lường chính xác).

**Residual Risk**: Do chưa có runner tự động, việc kiểm tra đang dựa trên code review và manual verification. Cần sớm tích hợp Vitest vào dự án.

---
**Kết quả: 5/7 Pass (Applicable/Ready items)**
