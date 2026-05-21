# Auth & Permissions Review: Tour Departure Select

This document reviews the access control and authentication flow for the Tour Departure Selection feature.

## 1) Protected Route Review

| Route | Access | Auth Required | Redirect Behavior |
|---|---|---|---|
| `/tours/[slug]/departures` | Public | No | N/A |
| `/tours/[slug]/book` | Protected | Yes | Redirects to `/login?callbackUrl=...` if not authenticated. |

## 2) Guarded UI Actions

| Action | UI Element | Access | Logic |
|---|---|---|---|
| View schedules | `ScheduleCalendar` | Public | No gating required. |
| Calculate price | `OrderSummaryCard` | Public | Computed locally or via public API. |
| Proceed to booking | "Tiếp tục" Button | Public | Action itself is public, but the target route is protected. |

## 3) Middleware Behavior

The `src/middleware.ts` handles protection for the booking funnel:
- It explicitly regex-matches `/tours/[slug]/book`.
- It redirects to `/login` (localized) if the `token` cookie is missing.
- **Critical Note**: Current middleware uses `pathname` for `callbackUrl`. We should verify if it preserves query parameters (e.g., `?tour_schedule_id=...`), as these are vital for the booking handoff.

## 4) Redirect Flow

1. **Discovery**: User visits `/tours/halong-bay/departures` (Public).
2. **Selection**: User selects date and guest count.
3. **Handoff**: User clicks "Tiếp tục" -> Navigation to `/tours/halong-bay/book?tour_schedule_id=123&adult=2`.
4. **Interception**: Middleware detects protected route `/book` -> Checks for `token`.
5. **Authentication**: If no token, redirect to `/login?callbackUrl=/tours/halong-bay/book?tour_schedule_id=123...`.
6. **Completion**: After login, user is returned to the booking page with all selection state intact.

## 5) Risks and Assumptions

- **[RISK] Query Param Loss**: As noted in (3), if the middleware or login page doesn't explicitly preserve the search string, the user will arrive at an empty booking page after login. 
- **[ASSUMPTION]**: No "Member-only" tours are currently implemented. If they are, the departures page itself may need gating.
- **[ASSUMPTION]**: The `tour_schedule_id` is sufficient for the booking page to recover the selection state.
