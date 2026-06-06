# Feature Review: Tour Booking Capacity Limits & Header Cursor Fixes

> Feature slug: `tour-booking-capacity-limits`
> Date: 2026-05-27
> Reviewer context: `pre-push / pre-handoff`

---

## 1) Objective
- **Goal**: Fix the tour booking passenger capacity limitations, disable the increment button when capacity limits are met on both the Cart and Booking pages, show warnings, display hand pointers (`cursor-pointer`) on Header items like the Cart icon and User Profile Avatar on hover, and fix the dropdown menu z-index layout overlap.
- **Audience**: Customers booking tours, preventing over-booking and improving interface clickability, visibility, and layout stacking order.

## 1.1) User-Facing Outcomes
- The `+` increment button on passenger quantity counters for adults and children dynamically disables as soon as the selected total guests reaches the remaining available seats of the selected departure.
- A warning message `"Vượt quá số chỗ trống!"` shows on the booking page if selected quantities exceed capacity.
- The payment submission button is locked when over capacity, and form submission is blocked with a warning toast.
- Checkout is blocked at the Giỏ Hàng page level if the selected tour is over capacity.
- A cursor hand pointer (`cursor-pointer`) displays correctly on hover for the Cart icon and User Avatar in the Header.
- Contact address automatically pre-fills with the user's city profile information on load and when clicking "Điền từ hồ sơ".
- The user profile dropdown menu displays on top of all page components and is no longer covered by sticky headers or Back buttons.

## 2) Scope Delivered
| Area | What changed | Files |
|---|---|---|
| **Analysis** | Documented capacity limits & design requirements. | [screen-analysis.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/analysis/2026-05-27__web_route_api_next_screen_review__screen-analysis.md) |
| **Types / Validators / Services** | Verified schema fields for address and guest numbers. | [booking.schema.ts](file:///d:/DATN/danangtrip-web/src/features/tour/validators/booking.schema.ts) |
| **Routing** | Checked checkout routes. | [routes.ts](file:///d:/DATN/danangtrip-web/src/config/routes.ts) |
| **UI Components** | Custom dynamic limits, high-contrast buttons, header z-index elevation, and cursor-pointers. | [Header.tsx](file:///d:/DATN/danangtrip-web/src/components/layout/Header.tsx), [CartIcon.tsx](file:///d:/DATN/danangtrip-web/src/features/cart/components/CartIcon.tsx), [QuantityCounter.tsx](file:///d:/DATN/danangtrip-web/src/features/tour/components/QuantityCounter.tsx) |
| **Data Integration** | Pre-fills contact address with user city. | [BookingForm.tsx](file:///d:/DATN/danangtrip-web/src/features/tour/components/BookingForm.tsx) |
| **Interactions** | Cart page quantity clamping, warning banner, and checkout block. | [CartItemRow.tsx](file:///d:/DATN/danangtrip-web/src/features/cart/components/CartItemRow.tsx), [CartSummary.tsx](file:///d:/DATN/danangtrip-web/src/features/cart/components/CartSummary.tsx), [BookingForm.tsx](file:///d:/DATN/danangtrip-web/src/features/tour/components/BookingForm.tsx) |
| **Auth / Permissions** | Integrated profile `city` retrieval. | [BookingForm.tsx](file:///d:/DATN/danangtrip-web/src/features/tour/components/BookingForm.tsx) |
| **Testing** | ESLint, Typecheck, and Route checks pass successfully. | [test-report.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/test-cases/2026-05-27__web_route_api_next_screen_review__test-report.md) |

## 3) Artifact Trace
| Step | Artifact Path | Status |
|---|---|---|
| 01 | [.agent/artifacts/analysis/2026-05-27__web_route_api_next_screen_review__screen-analysis.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/analysis/2026-05-27__web_route_api_next_screen_review__screen-analysis.md) | **COMPLETE** |
| 02 | [.agent/artifacts/setup/2026-05-27__web_route_api_next_screen_review__project-setup-report.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/setup/2026-05-27__web_route_api_next_screen_review__project-setup-report.md) | **COMPLETE** |
| 03 | [.agent/artifacts/api-contracts/2026-05-27__web_route_api_next_screen_review__api-contract.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/api-contracts/2026-05-27__web_route_api_next_screen_review__api-contract.md) | **COMPLETE** |
| 04 | [.agent/artifacts/routing/2026-05-27__web_route_api_next_screen_review__route-plan.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/routing/2026-05-27__web_route_api_next_screen_review__route-plan.md) | **COMPLETE** |
| 05 | [.agent/artifacts/ui-specs/2026-05-27__web_route_api_next_screen_review__ui-spec.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/ui-specs/2026-05-27__web_route_api_next_screen_review__ui-spec.md) | **COMPLETE** |
| 06 | [.agent/artifacts/integration/2026-05-27__web_route_api_next_screen_review__data-integration.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/integration/2026-05-27__web_route_api_next_screen_review__data-integration.md) | **COMPLETE** |
| 07 | [.agent/artifacts/interaction-specs/2026-05-27__web_route_api_next_screen_review__interaction-spec.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/interaction-specs/2026-05-27__web_route_api_next_screen_review__interaction-spec.md) | **COMPLETE** |
| 08 | [.agent/artifacts/auth/2026-05-27__web_route_api_next_screen_review__auth-permissions-review.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/auth/2026-05-27__web_route_api_next_screen_review__auth-permissions-review.md) | **COMPLETE** |
| 09 | [.agent/artifacts/test-cases/2026-05-27__web_route_api_next_screen_review__test-report.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/test-cases/2026-05-27__web_route_api_next_screen_review__test-report.md) | **COMPLETE** |
| 10 | [.agent/artifacts/deploy/2026-05-27__tour-booking-capacity-limits__deploy-report.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/deploy/2026-05-27__tour-booking-capacity-limits__deploy-report.md) | **COMPLETE** |

## 3.1) Missing / Skipped Steps
| Step | Why skipped | Impact |
|---|---|---|
| None | All steps are trace-complete. | None. |

## 4) Validation Summary
| Check | Status | Notes |
|---|---|---|
| lint | **PASS** | ESLint verified with 0 errors. |
| typecheck | **PASS** | TypeScript compiler compiled successfully. |
| check:routes | **PASS** | All routes are valid. |
| build | **PASS** | Production client/server bundles successfully generated. |
| smoke test | **PASS** | Verified local dev state on Booking, Cart, and Header components. |

## 4.1) Quality Assessment
- **Pros**: Double-sided dynamic capacity locks in both Cart and Booking flows. High contrast button design with accessible colors. Resolved mobile/desktop header dropdown menu overlapping bug by elevating z-index to `z-[100]`.
- **Areas to monitor**: None.

## 5) Risks / Follow-ups
- **R-01**: None.
- **F-01**: Clean up unused ESLint disabled flags in legacy components.

## 6) Approval Recommendation
- **Recommendation**: `Ready for push after approval`
- **Reason**: All tests, compilation, linting, routing, layout stacking order, and UI standards are completely satisfied.
