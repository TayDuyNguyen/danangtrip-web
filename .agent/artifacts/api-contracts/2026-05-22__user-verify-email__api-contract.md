# API Contract: user-verify-email

Date: 2026-05-22
Repository: `D:\DATN\danangtrip-web`
Feature slug: `user-verify-email`

## Backend Source Of Truth

- Backend routes: `D:\DATN\danangtrip-api\routes\api.php`
- Controller: `App\Http\Controllers\Api\AuthController::verifyEmail`
- Request class: `App\Http\Requests\Auth\VerifyEmailRequest`
- Service: `App\Services\AuthService::verifyEmail`

## Endpoints

| Endpoint | Method | Auth | Request | Purpose |
|---|---|---|---|---|
| `/auth/verify-email` | POST | Required JWT/session | `{ otp: string }` | Verify the authenticated user's email using a cached OTP. |
| `/auth/resend-verification` | POST | Required JWT/session | none | Resend the authenticated user's verification email/OTP. |

## Frontend Contract

```ts
export interface VerifyEmailRequest {
  otp: string;
}
```

The frontend must call:

```ts
authService.verifyEmail({ otp });
```

Do not send `{ code }` or `{ token }` to the backend. `token` may only be accepted as a page-level compatibility alias and then forwarded as `otp`.

## Error Expectations

- `400`: invalid or expired OTP.
- `401`: unauthenticated user; expected when opening the page without a valid session.
- `429`: resend throttling.
- `500`: backend failure.

## Files Aligned

- `src/types/auth.types.ts`
- `src/services/auth.service.ts`
- `src/features/auth/validators/auth.schema.ts`
- `src/features/auth/components/verify-email-form.tsx`
- `src/app/[locale]/(auth)/verify-email/page.tsx`

## Verdict

Contract is aligned with backend after the 2026-05-22 correction.
