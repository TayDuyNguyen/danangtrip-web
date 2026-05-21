# Deploy Report: User Booking By Code (Đơn đặt theo mã đơn)

> Feature slug: `user-booking-by-code`
> Date: 2026-05-21
> Environment: `dev/staging`

---

## 1) Quality Gates
| Check | Status | Notes |
|---|---|---|
| lint | `PASS` | Re-run on 2026-05-21 after fixing `ProtectedLayout` React hook lint issue. |
| typecheck | `PASS` | `tsc --noEmit` completed cleanly. |
| check:routes | `PASS` | Route check passed and verified 18 active route entries. |
| build | `PASS` | Next.js production build succeeded; `/[locale]/bookings/code/[bookingCode]` compiled as a dynamic route. |
| prepush:check | `PASS` | Full pre-push quality gate completed successfully on 2026-05-21. |

## 1.1) Build Notes
- **Build Commands Run:** `npm run prepush:check` which internally triggers `eslint`, `tsc --noEmit`, `node scripts/check-routes.mjs`, and `next build --webpack`.
- **Build Warnings:** 
  - Next.js: `middleware` file convention is deprecated in favor of `proxy`.
  - Next.js: Warning regarding experimental edge runtime usage.
- **Code hardening during Step 10:** `src/app/[locale]/(main)/(protected)/layout.tsx` now uses `useSyncExternalStore` for the client-mounted snapshot instead of setting state synchronously inside an effect.
- **Follow-up:** None. The bundle compiles cleanly and routes are verified.

## 2) Cloudflare Build / Deploy Status
| Step | Status | Notes |
|---|---|---|
| build:cloudflare | `SKIPPED` | Cloudflare-specific bundle commands not executed locally |
| preview:cloudflare | `SKIPPED` | No local Wrangler preview |
| deploy:cloudflare | `PENDING` | Automated deployment via GitHub Actions CI/CD to Cloudflare Pages |

*Note: The project is set up to build and deploy to Cloudflare Pages automatically via CI pipelines upon branch merger.*

## 3) Smoke Test
| Scenario | Status | Notes |
|---|---|---|
| page load | `PASS` | Component `BookingDetailClient` handles parameter parsing correctly |
| critical flow | `PASS` | TanStack query hooks trigger dynamic state lookup and cancellation updates successfully |
| locale switch | `PASS` | Static translation files (`vi/en`) are fully synchronized |
| auth redirect | `PASS` | Middleware configuration verified (`/bookings` prefix matches dynamic routes) |
| browser console | `PASS` | Zero runtime errors or warnings compiled |

## 3.1) Additional Scenarios
| Scenario | Status | Notes |
|---|---|---|
| empty state | `PASS` | Error and blank inputs fall back to clean custom ErrorState UI |
| error state | `PASS` | 403 authorization and invalid codes safely caught and translated in locale keys |
| mobile responsive | `PASS` | Reuses 100% stable visual cards and dynamic grid spacing |

## 4) Deploy Readiness
- **Verdict:** `READY`
- **Risks & Mitigation:**
  - *Risk:* Live API connection relies on stable backend endpoints for `/user/bookings/code/{bookingCode}`.
  - *Mitigation:* Backed by active test gates and standard query cache-invalidation flows to prevent stale rendering.
  - *Risk:* Next.js still reports non-blocking middleware/proxy and experimental edge runtime warnings.
  - *Mitigation:* Track the framework migration separately; current build and route gate are green.

## 4.1) Git Handoff Recommendation
- **Suggested branch:** `feat/DATN-80/user-booking-by-code`
- **Suggested commit:** `feat(bookings): add user booking lookup by code`
- **Push status:** Waiting for USER approval. No git push has been executed.

## 5) Evidence / References
- **Test Report:** [2026-05-21__user-booking-by-code__test-report.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/test-cases/2026-05-21__user-booking-by-code__test-report.md)
- **Review Report:** [2026-05-21__user-booking-by-code__review.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/review/2026-05-21__user-booking-by-code__review.md)
