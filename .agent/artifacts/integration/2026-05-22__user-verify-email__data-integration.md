# Data Integration: user-verify-email

Date: 2026-05-22

## Integration Boundary

- Service boundary: `src/services/auth.service.ts`
- Request type: `src/types/auth.types.ts`
- UI controller: `src/features/auth/components/verify-email-form.tsx`
- Page wrapper: `src/app/[locale]/(auth)/verify-email/page.tsx`

## Data Flow

1. Page reads `otp`, `token`, and `email` from search params.
2. Page passes `otp={otp ?? token}` to `VerifyEmailForm`.
3. `VerifyEmailForm` auto-submits if an OTP-compatible query value exists.
4. Manual OTP entry submits when the 6-digit value is complete or when the form is submitted.
5. Mutation calls `authService.verifyEmail({ otp })`.
6. Success shows the success state and redirect countdown.
7. Errors show inline/toast feedback; 401 is expected for unauthenticated sessions.

## Resend Flow

- `authService.resendVerification()` posts to `/auth/resend-verification`.
- Success starts a 60-second cooldown.
- Failure shows a localized toast.

## Validation Evidence

- `npm.cmd run typecheck`: PASS
- `npm.cmd run lint`: PASS
- `npm.cmd run build`: PASS
- `npm.cmd run prepush:check`: PASS

## Verdict

Integrated and aligned to backend OTP contract.
