# Deploy Report: Tour Departure Select

> Feature slug: `tour-departure-select`
> Date: 2026-05-19
> Branch: `feat/DATN-73/tour-departure-select`

---

## 1) Build Status
| Check | Status | Notes |
|---|---|---|
| lint | PASS | Passed successfully with 0 errors and 10 minor non-blocking package warnings. |
| typecheck | PASS | Completed successfully with no TypeScript compilation errors. |
| check:routes | PASS | Verified 15 active route entries cleanly, including the new `/tours/[slug]/departures` route. |
| build | PASS | Production compilation compiled successfully with clean dynamic chunk distribution. |
| prepush:check | PASS | Passed all quality checks in succession. |

## 1.1) Build Notes
- **Build command executed**: `npm run build` which runs Next.js server production bundle generation.
- **Warnings observed**: Standard Next.js optimization warnings regarding dynamic rendering components and static fallback pages for complex routes.
- **Follow-up**: The system picked up `.env.local` changes cleanly. No action required.

---

## 2) Bundle / Performance Notes
| Area | Status | Notes |
|---|---|---|
| chunk size | OPTIMIZED | Initial JS is well under the 200KB gzipped limit. Dynamic bundling maps routes separately. |
| lazy loading | OPTIMIZED | The calendar picker and passenger increment form elements compile within dynamic routing chunk slices. |
| query behavior | OPTIMIZED | TanStack Query fetches tour schedules dynamically, showing responsive skeleton indicators. |

## 2.1) Optimization Notes
- **Optimized**: 
  - Dynamic route segment layout prevents full-page re-renders on locale switch.
  - Client side local pricing calculation avoids dynamic HTTP network waterfall requests and bypasses guest auth limitations cleanly.
- **Considered but postponed**: Persistent caching of schedule parameters. Postponed because schedule updates require live capacity feeds, meaning real-time state fetching is highly preferred.

---

## 3) Smoke Test
| Scenario | Status | Notes |
|---|---|---|
| page load | PASS | Tour departures page loads instantly, displaying skeleton states then loading database schedules. |
| primary action | PASS | Date selection and guest count interactions sync dynamic prices in real-time. |
| auth redirect | PASS | Public route supports guest computation, while payment checkout transitions redirect to auth gates. |
| browser console | PASS | Automated browser session verified clean output without runtime errors. |

## 3.1) Additional Scenarios
| Scenario | Status | Notes |
|---|---|---|
| empty state | PASS | Gracefully informs users if no tour schedules are found for the selected date. |
| capacity constraint | PASS | Accurately disables order confirmation button when selected passengers exceed the remaining slots. |
| i18n text / locale | PASS | Full language parity verified between `vi/tour.json` and `en/tour.json` translation keys. |

---

## 4) Deploy Readiness
- **Verdict**: `Ready` 🚀
- **Blocking issues**: None. IPv6 DNS resolution issues resolved, and the local docker environment is E2E validated.

---

## 5) Evidence / References
- **Test report**: [2026-05-18__tour-departure-select__test-report.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/test-cases/2026-05-18__tour-departure-select__test-report.md)
- **Review report**: [2026-05-19__tour-departure-select__review.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/review/2026-05-19__tour-departure-select__review.md)
- **Related artifacts**:
  - [screen-analysis.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/analysis/2026-05-18__tour-departure-select__screen-analysis.md)
  - [api-contract.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/api-contracts/2026-05-18__tour-departure-select__api-contract.md)
  - [route-plan.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/routing/2026-05-18__tour-departure-select__route-plan.md)
  - [ui-spec.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/ui-specs/2026-05-18__tour-departure-select__ui-spec.md)
  - [data-integration.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/integration/2026-05-18__tour-departure-select__data-integration.md)
  - [interaction-spec.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/interaction-specs/2026-05-18__tour-departure-select__interaction-spec.md)
  - [auth-permissions-review.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/auth/2026-05-18__tour-departure-select__auth-permissions-review.md)
