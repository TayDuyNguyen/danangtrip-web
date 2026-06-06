# Deploy Report: Tour Booking Capacity Limits & Cursor Pointer Fixes

> Feature slug: `tour-booking-capacity-limits`
> Date: 2026-05-27
> Environment: `dev`

---

## 1) Quality Gates
| Check | Status | Notes |
|---|---|---|
| lint | **PASS** | `npm run lint` passed with 0 errors, 15 warnings (non-blocking). |
| typecheck | **PASS** | `tsc --noEmit` passed with 0 errors. |
| check:routes | **PASS** | `check:routes` verified 29 active route entries. |
| build | **PASS** | Production build compiled successfully in 11.2s. |
| prepush:check | **PASS** | Quality gate command passed successfully. |

## 1.1) Build Notes
- **Build command**: `npm run prepush:check` (runs ESLint, Typecheck, Route check, and Next.js production build).
- **Warnings**: Standard Next.js experimental edge runtime warnings; ESLint warnings on unused variables and React dependency rules (non-blocking).
- **Follow-up**: Unused eslint-disable directives clean up in sibling features.

## 2) Cloudflare Build / Deploy Status
| Step | Status | Notes |
|---|---|---|
| build:cloudflare | **PASS** | Cloudflare Workers compilation compatible. |
| preview:cloudflare | **N/A** | Local development server verification only. |
| deploy:cloudflare | **N/A** | Handed over for user deployment. |

## 3) Smoke Test
| Scenario | Status | Notes |
|---|---|---|
| page load | **PASS** | `/tours/[slug]/book` and `/cart` load correctly. |
| critical flow | **PASS** | Passenger counter bounds dynamically clamp, locking increment button when capacity is reached. |
| locale switch | **PASS** | Translated texts under `/vi` and `/en` load properly. |
| auth redirect | **PASS** | Representative data automatically fills from user store; `user.city` correctly maps to `customer_address`. |
| browser console | **PASS** | Zero console/runtime errors in client bundle. |

## 3.1) Additional Scenarios
| Scenario | Status | Notes |
|---|---|---|
| empty state | **PASS** | Cart displays empty state correctly when items count is 0. |
| error state | **PASS** | Submit button is locked and checkout is blocked with warning toast when booking quantity exceeds capacity. |
| mobile responsive | **PASS** | Passenger counter input fields and buttons are perfectly responsive on mobile screens. |
| z-index layout | **PASS** | Elevated global header z-index to `z-[100]` and dropdown to `z-50` to resolve overlapping by page-level headers (e.g. minimal sticky header on booking page). |

## 4) Deploy Readiness
- **Ready / Not Ready**: **Ready**
- **Blocking issues**: None.

## 5) Evidence / References
- **Test report**: [2026-05-27__web_route_api_next_screen_review__test-report.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/test-cases/2026-05-27__web_route_api_next_screen_review__test-report.md)
- **Walkthrough**: [walkthrough.md](file:///C:/Users/TUF/.gemini/antigravity/brain/64241d1c-8777-4f44-917f-3ad098fb8fff/walkthrough.md) (Brain Walkthrough)
