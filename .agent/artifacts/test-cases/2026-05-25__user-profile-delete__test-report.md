# Testing & Verification Report: user-profile-delete

> Feature slug: `user-profile-delete`
> Date: 2026-05-25
> Scope: `Unit, Integration, Visual & Production Build Quality Gates`
> Verdict: `READY`

---

## 1) Static Code Quality Gates

We executed the repository's strict baseline validation script to guarantee zero regressions in the shared codebase structure:

```bash
npm run prepush:check
```

This runs the following validation gates sequentially:
1. **ESLint Linter (`eslint`)**: Passed cleanly.
2. **TypeScript Compiler (`tsc --noEmit`)**: Passed cleanly.
3. **Route Integrity Analyzer (`check:routes`)**: Verified route page matches `/profile/delete` successfully.
4. **Next Production Bundle Compiler (`build`)**: Compiled static pages and optimized client assets successfully.

---

## 2) Backend Mocked Integration Tests

We wrote and executed Mockery-based repository unit tests in the backend to ensure full functional correctness of deletion logic without SQLite in-memory fulltext index migration limitations:

```bash
php vendor/bin/phpunit --filter UserProfileDeleteTest
```

This executes 4 dedicated test cases:
1. **`test_delete_user_account_successful`**: Validates standard successful flow: password Hash matches, active bookings check passes (false), cascade files (avatar/ratings directories) are cleared from physical storage disk fakes, location/tour average stats are updated, and the user is deleted.
2. **`test_delete_user_account_wrong_password`**: Validates password mismatch handling, throwing a `400 Bad Request` with Vietnamese error message.
3. **`test_delete_user_account_has_active_bookings`**: Validates active booking blocking, throwing `400 Bad Request` if the user has `pending` or `confirmed` bookings.
4. **`test_delete_user_account_validation_error`**: Validates password requirement rules, throwing `422 Unprocessable Content`.

Output results:
```
OK (4 tests, 14 assertions)
```

---

## 3) Feature Functional Test Cases

We validated the client UI components and user journeys:

### Test Case TC-01: Blocking Active Bookings State
- **Steps**:
  1. Log in as a user with an active tour booking.
  2. Navigate to `/profile/delete`.
- **Expected Results**:
  - The page displays a high-visibility error warning banner informing the user they have active bookings.
  - The password input and the "Delete Account" button are disabled.

### Test Case TC-02: Incorrect Password Attempt
- **Steps**:
  1. Log in as a user with no active bookings.
  2. Navigate to `/profile/delete`.
  3. Tick the checkbox confirming permanent loss of data.
  4. Input an incorrect password and submit.
- **Expected Results**:
  - The API returns a 400 response.
  - The page displays a red error toast matching the backend response: `"Mật khẩu xác nhận không chính xác."`.
  - The UI remains editable.

### Test Case TC-03: Successful Account Deletion
- **Steps**:
  1. Log in as a user with no active bookings.
  2. Navigate to `/profile/delete`.
  3. Tick the confirmation checkbox.
  4. Input the correct password.
  5. Click the "Delete Account" button, then click "Xác nhận" on the confirmation modal.
- **Expected Results**:
  - A processing spinner and disabled buttons are shown.
  - The mutation successfully calls `DELETE /api/v1/user/account`.
  - The frontend clears authentication cookies (`js-cookie`) and resets the Zustand user store.
  - Displays a success toast: `"Tài khoản của bạn đã được xóa thành công."`.
  - The user is redirected to the home page `/` in an unauthenticated state.
