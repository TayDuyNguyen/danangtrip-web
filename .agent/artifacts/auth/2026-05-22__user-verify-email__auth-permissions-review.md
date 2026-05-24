# Auth Review: user-verify-email

Date: 2026-05-22
Route: `/verify-email`

## Route Behavior

The page can render in the auth route group so users can reach the OTP form. Rendering the page is not the same as authorizing the API action.

## API Authorization

| Action | Endpoint | Auth Required | Notes |
|---|---|---|---|
| Verify email | `POST /auth/verify-email` | Yes | Backend route is inside `jwt.auth` and uses `$request->user()`. |
| Resend verification | `POST /auth/resend-verification` | Yes | Backend route is inside `jwt.auth`. |

## Security Decision

- Verification is an authenticated OTP flow.
- Guest users may see the UI but should receive sign-in guidance if the backend returns 401.
- There is no backend-supported public token-link verification in the current route file.

## Risks

- Product copy/docs may imply public token-link verification. That is not supported by backend today.
- A successful live smoke test requires a logged-in user and a valid OTP in backend cache.

## Verdict

Ready with documented backend-auth requirement.
