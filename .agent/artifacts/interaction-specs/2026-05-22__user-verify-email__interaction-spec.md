# Interaction Spec: user-verify-email

Date: 2026-05-22

## Primary Interactions

| Interaction | Trigger | Expected behavior |
|---|---|---|
| Auto-submit OTP | URL has `otp` or legacy `token` alias | Calls `verifyMutation.mutate({ otp })`. |
| Manual OTP submit | User enters 6 digits or submits form | Calls `verifyMutation.mutate({ otp: otpValue })`. |
| Paste OTP | User pastes text into OTP input | Non-digits are stripped and the first 6 digits are used. |
| Retry | User switches from failure to OTP mode | Clears query-driven OTP state and returns to manual OTP form. |
| Resend | User clicks resend | Calls protected resend endpoint and starts cooldown on success. |
| Back to login | User clicks login link | Navigates to `/login`. |

## Disabled And Error States

- OTP fields are disabled while verify mutation is pending.
- Submit button is disabled until OTP length is 6.
- Resend button is disabled while pending or during cooldown.
- API errors are surfaced through inline text and toast messages.

## Auth Caveat

Backend requires `jwt.auth` for both verify and resend. Guest API calls may return 401 and should guide the user to sign in.

## Verdict

Interactions are ready for review after OTP contract correction.
