# Feature Review: Tour Departure Select

> Feature slug: `tour-departure-select`
> Date: 2026-05-19
> Reviewer context: `pre-push / pre-handoff`

---

## 1) Objective
- **Problem solved**: Provides tourists a beautiful, seamless interface to view active departure schedules and select departure dates directly before booking their tours.
- **User base**: Public Tour Customers / Guests.
- **Business impact**: Correct departure validation prevents overbooking by matching live slot availability, enables transparent and responsive pricing structures, and ensures unauthenticated checkouts transition cleanly through security flows.

---

## 2) Scope Delivered
| Area | What changed | Files |
|---|---|---|
| Analysis | Drafted complete visual, technical, and data mapping specifications. | [screen-analysis.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/analysis/2026-05-18__tour-departure-select__screen-analysis.md) |
| API / Types | Aligned interface specs, defined strict validation schemas, and handled client-side calculation variables. | [api-contract.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/api-contracts/2026-05-18__tour-departure-select__api-contract.md), [departure-select.schema.ts](file:///d:/DATN/danangtrip-web/src/features/tour/validators/departure-select.schema.ts) |
| Routing | Registered departures route, mapping slug parameters into client-side components. | [route-plan.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/routing/2026-05-18__tour-departure-select__route-plan.md), [routes.ts](file:///d:/DATN/danangtrip-web/src/config/routes.ts), [page.tsx](file:///d:/DATN/danangtrip-web/src/app/[locale]/(main)/(public)/tours/[slug]/departures/page.tsx) |
| UI Components | Created high-fidelity calendars, dynamic lists, skeleton loading indicators, and passenger counter forms. | [ui-spec.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/ui-specs/2026-05-18__tour-departure-select__ui-spec.md), [DepartureSelectClient.tsx](file:///d:/DATN/danangtrip-web/src/features/tour/components/DepartureSelectClient.tsx) |
| Data Integration | Integrated database queries using TanStack Query, resolving guest calculations block. | [data-integration.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/integration/2026-05-18__tour-departure-select__data-integration.md) |
| Interactions | Wired responsive button active/disabled states, date selections, and total sum preview. | [interaction-spec.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/interaction-specs/2026-05-18__tour-departure-select__interaction-spec.md) |
| Auth / Permissions | Gated departure views publicly while retaining strict security redirects for checkout targets. | [auth-permissions-review.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/auth/2026-05-18__tour-departure-select__auth-permissions-review.md) |
| Testing | Compiled test evidence with successful E2E browser recording of capacity locking and booking handoffs. | [test-report.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/test-cases/2026-05-18__tour-departure-select__test-report.md) |

---

## 3) Artifact Trace
| Step | Artifact Path | Status |
|---|---|---|
| 01 | [analysis/2026-05-18__tour-departure-select__screen-analysis.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/analysis/2026-05-18__tour-departure-select__screen-analysis.md) | COMPLETE |
| 02 | [setup/2026-05-18__tour-departure-select__project-setup-report.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/setup/2026-05-18__tour-departure-select__project-setup-report.md) | COMPLETE |
| 03 | [api-contracts/2026-05-18__tour-departure-select__api-contract.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/api-contracts/2026-05-18__tour-departure-select__api-contract.md) | COMPLETE |
| 04 | [routing/2026-05-18__tour-departure-select__route-plan.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/routing/2026-05-18__tour-departure-select__route-plan.md) | COMPLETE |
| 05 | [ui-specs/2026-05-18__tour-departure-select__ui-spec.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/ui-specs/2026-05-18__tour-departure-select__ui-spec.md) | COMPLETE |
| 06 | [integration/2026-05-18__tour-departure-select__data-integration.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/integration/2026-05-18__tour-departure-select__data-integration.md) | COMPLETE |
| 07 | [interaction-specs/2026-05-18__tour-departure-select__interaction-spec.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/interaction-specs/2026-05-18__tour-departure-select__interaction-spec.md) | COMPLETE |
| 08 | [auth/2026-05-18__tour-departure-select__auth-permissions-review.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/auth/2026-05-18__tour-departure-select__auth-permissions-review.md) | COMPLETE |
| 09 | [test-cases/2026-05-18__tour-departure-select__test-report.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/test-cases/2026-05-18__tour-departure-select__test-report.md) | COMPLETE |
| 10 | [deploy/2026-05-19__tour-departure-select__deploy-report.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/deploy/2026-05-19__tour-departure-select__deploy-report.md) | COMPLETE |

---

## 4) Technical Decisions
- **TD-01: Client Pricing Calculations**: Configured pricing computations locally based on active base discount ratios, avoiding authorization-blocked dynamic server calculate endpoints.
- **TD-02: IPv4 Loopback Fallback**: Upgraded primary environment settings in `.env.local` to target `127.0.0.1` explicitly, successfully bypassing local IPv6 DNS blocking on Windows hosts.

---

## 5) Validation Summary
| Check | Status | Notes |
|---|---|---|
| lint | PASS | Zero errors or style deviations. |
| typecheck | PASS | Zero TypeScript compiler errors. |
| build | PASS | Production compilation builds successfully. |
| smoke test | PASS | Verified correct calendar selections, i18n text, and passenger bounds in browser. |

---

## 6) Risks / Follow-ups
- **R-01: API Synchronization**: Ensure that database queries and discount ratios applied on the frontend strictly mirror backend checkout policies to prevent price discrepancies at final payment steps.

---

## 7) Approval Recommendation
- **Recommendation**: `Ready for push after approval`
- **Reason**: The feature compiles cleanly with zero errors, successfully resolves E2E interactions in local runtimes, and matches visual design guidelines perfectly.
