# Skill: 07-interactions (Chức năng tương tác)

## 0) Tuyên bố tự mô tả
Skill này chịu trách nhiệm implement toàn bộ user interactions: CRUD, form validation, filter/search/sort/pagination, confirm dialogs, toast feedback.

## 1) Goal
Làm cho người dùng **thao tác được đầy đủ** trên màn hình:
- **Form**: validation, submit, error messages
- **CRUD**: Create, Read, Update, Delete
- **Filter/Search/Sort/Pagination**: functional
- **Dialogs**: confirm delete, success/error toasts
- **Export/Import**: nếu có trong requirements

## 2) Persona (mandatory)
Đóng vai: **Senior Software Engineer (SSE)**. Đọc `persona.md` trước khi làm.

## 3) Input & Context (must read first)
- `persona.md`
- `.agent/rules/PROJECT_RULES.md` (Sections 7, 12, 13)
- SRS/analysis: acceptance criteria + business rules
- Zod validators: `src/features/<feature>/validators/`
- UI components + hooks đã build ở bước trước
- Existing interaction patterns: `src/hooks/useDebounce.ts`, etc.

## 4) Workflow

### 4.1 Form Handling
1. **Validation**: dùng Zod schemas đã tạo ở bước 03.
2. **Error display**: field-level errors + summary (nếu cần).
3. **Submit flow**:
   - Validate → show errors nếu invalid
   - Submit → loading state → success toast / error toast
   - Reset form sau success (nếu applicable)
4. **i18n**: mọi validation messages dùng translation keys.

### 4.2 CRUD Operations
5. **Create**: Modal/Form → `useMutation` → invalidate list queries → toast success.
6. **Read**: List (useQuery) → Click row → Detail view/page.
7. **Update**: Edit modal/form → `useMutation` → invalidate → toast.
8. **Delete**: Confirm dialog → `useMutation` → invalidate → toast.
9. **Bulk operations**: checkbox select → bulk delete/update (nếu có).

### 4.3 Filter/Search/Sort
10. **Search**: debounced input (dùng `useDebounce` hook hiện có).
11. **Filter**: select/dropdown → update query params → refetch.
12. **Sort**: click column header → toggle asc/desc → refetch.
13. **URL sync**: filter/search/sort state đồng bộ với URL query params.

### 4.4 Pagination
14. **Pattern**: query params `?page=1&limit=20`.
15. **UI**: pagination component với prev/next + page numbers.
16. **Scroll**: scroll to top khi chuyển page.
17. **Edge case**: xử lý khi page > total pages (redirect về page 1).

### 4.5 Dialogs & Feedback
18. **Confirm dialog**: trước delete/destructive actions.
19. **Toast success**: sau create/update/delete thành công.
20. **Toast error**: khi API fail, dùng normalized error message.
21. **Optimistic updates**: nếu applicable (UX tốt hơn).

### 4.6 Export/Import (nếu có)
22. **Export**: trigger download (CSV/Excel/PDF).
23. **Import**: file upload → validate → preview → confirm → process.

## 5) Strict Rules
- **Validate ở boundary**: validate user input trước khi gửi API.
- **Normalize errors**: KHÔNG hiện raw backend errors.
- **i18n bắt buộc**: mọi user-facing text (validation, toast, dialog) → translation keys.
- **No silent failures**: mọi error phải có feedback cho user.
- **Mutation → invalidate**: sau mutation luôn invalidate related queries.
- **Debounce search**: tối thiểu 300ms.
- **Confirm destructive actions**: delete/bulk delete phải có confirm dialog.

## 6) Output specification
Files tạo/sửa:
- `src/features/<feature>/components/` (interactive components)
- `src/features/<feature>/hooks/` (mutation hooks nếu chưa có)
- `src/messages/vi/<feature>.json` + `en` (validation messages, toast messages)

## 7) Control
Đối chiếu `checklist.md` và report Pass/Fail.
