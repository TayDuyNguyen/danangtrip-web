# Test Cases: <Feature Name>

> Feature slug: `<feature-slug>`
> Date: YYYY-MM-DD
> SRS reference: `<path>`

---

## 1) Test Matrix

| AC | Test ID | Type | Priority | Status |
|----|---------|------|----------|--------|
| AC-01 | TC-01 | Unit | High | |
| AC-01 | TC-02 | E2E | High | |
| AC-02 | TC-03 | Unit | Medium | |

## 2) Unit Test Cases

### TC-01: <Component/Hook name> — <scenario>
- **Given**: <preconditions>
- **When**: <action>
- **Then**: <expected result>
- **Test file**: `src/features/<feature>/__tests__/<file>.test.tsx`

### TC-02: ...

## 3) E2E Test Cases

### TC-E01: <Flow name>
- **Preconditions**: User logged in as <role>
- **Steps**:
  1. Navigate to `/<route>`
  2. Click <element>
  3. Fill form: <fields>
  4. Submit
- **Expected**: <result>
- **Test file**: `e2e/<feature>.spec.ts`

## 4) Test Data Plan

| Data | Type | Values | Notes |
|------|------|--------|-------|
| | | | |

## 5) Regression Checklist

- [ ] Route navigation: `/<route>` loads correctly
- [ ] i18n: vi/en translations render
- [ ] Auth: unauthorized → redirect `/login`
- [ ] Data fetching: no duplicate requests
- [ ] UI states: loading → data → empty → error

## 6) Bug Report Template

### BUG-XX: <title>
- **Severity**: Critical / Major / Minor
- **Steps to reproduce**:
- **Expected**:
- **Actual**:
- **Environment**:
- **Screenshot/Video**:
