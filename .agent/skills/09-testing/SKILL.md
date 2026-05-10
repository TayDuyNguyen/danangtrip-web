# Skill: 09-testing (Testing — Unit + E2E)

## 0) Tuyên bố tự mô tả
Skill này chịu trách nhiệm tạo test plan, viết unit tests + E2E tests, đảm bảo coverage cho 1 màn hình.

## 1) Goal
- **Test cases document** bám SRS/AC
- **Unit tests**: components, hooks, utils (Vitest)
- **Mock API**: MSW cho các scenarios
- **E2E tests**: Playwright cho flow chính
- **Coverage** target: > 80%

## 2) Persona (mandatory)
Đóng vai: **QA/QC Engineer**. Đọc `persona.md` trước khi làm.

## 3) Input & Context (must read first)
- `persona.md`
- `.agent/rules/PROJECT_RULES.md` (Section 14)
- SRS/analysis: acceptance criteria
- Implementation: code đã build ở bước 03-08
- Existing test setup (nếu có): `vitest.config.ts`, `playwright.config.ts`

## 4) Workflow

### 4.1 Test Plan
1. Đọc SRS → trích AC → map thành test cases.
2. Phân loại test:
   - **Unit**: isolated component/hook/util testing
   - **Integration**: hook + service interaction
   - **E2E**: full user flow in browser
3. Xác định test data cần chuẩn bị.
4. Output: test cases document.

### 4.2 Unit Tests (Vitest)
5. **Components**: render, props, states, user interactions.
   ```tsx
   // __tests__/FeatureList.test.tsx
   import { render, screen } from '@testing-library/react';
   import { FeatureList } from '../FeatureList';

   describe('FeatureList', () => {
     it('renders loading skeleton when isLoading', () => { ... });
     it('renders empty state when data is empty', () => { ... });
     it('renders list items when data is provided', () => { ... });
   });
   ```
6. **Hooks**: test với `renderHook` + mock service.
7. **Utils**: pure function → simple input/output tests.
8. **Validators**: test Zod schemas với valid/invalid inputs.

### 4.3 API Mocking (MSW)
9. Setup MSW handlers cho:
   - Success responses (happy path)
   - Error responses (400, 401, 403, 404, 500)
   - Loading state (delayed responses)
   - Empty responses
10. Placement: `__mocks__/handlers/<feature>.ts`

### 4.4 E2E Tests (Playwright & AI Browser Subagent)
11. Flow chính (Playwright):
    - Navigate → verify page loads
    - CRUD: create → verify → edit → verify → delete → verify
    - Search/filter → verify results
    - Pagination → verify navigation
12. Auth flow: login → protected page → verify access.
13. Error scenarios: API fail → verify error UI.
14. Placement: `e2e/<feature>.spec.ts`
15. **AI Browser UI Testing (Manual E2E)**:
    - AI PHẢI yêu cầu hoặc sử dụng URL được cấp (vd: `http://localhost:3000/route`) để trực tiếp mở trình duyệt (Browser Subagent) và test giao diện.
    - AI tự động tương tác với form, nút bấm, kiểm tra luồng (thành công/thất bại) và báo cáo lỗi nếu có.

### 4.5 Regression Checklist
15. Kiểm tra regression ở các vùng rủi ro:
    - **Routes**: navigate works, no 404.
    - **i18n**: switch locale → text changes correctly.
    - **Auth**: protected routes redirect unauthorized.
    - **Data fetching**: deduplication working, no duplicate requests.
    - **UI states**: loading/error/empty render correctly.

### 4.6 Coverage & Reporting
16. Run tests: `npm run test` (Vitest) + `npx playwright test` (E2E).
17. Coverage report: verify > 80%.
18. Report failures với root cause analysis.

## 5) Strict Rules
- **Map AC → test cases**: mỗi AC phải có ≥ 1 test case.
- **Test đủ states**: loading, empty, error, success cho mỗi component quan trọng.
- **Mock API đúng**: MSW, không hardcode responses trong tests.
- **i18n test**: verify translation keys resolve đúng.
- **Không skip**: nếu skip test, ghi lý do + residual risk.

## 6) Output specification
Files tạo:
- Doc: `.agent/artifacts/test-cases/YYYY-MM-DD__<feature-slug>__testcases.md`
- Unit tests: `src/features/<feature>/__tests__/` hoặc `*.test.tsx`
- E2E tests: `e2e/<feature>.spec.ts`
- Mocks: `__mocks__/handlers/<feature>.ts`

Template: `template_testcases.md`

## 7) Control
Đối chiếu `checklist.md` và report Pass/Fail.
