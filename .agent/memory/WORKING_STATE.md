# Working State

## Current Status
- Date: 2026-05-17
- Active feature/task: tour-booking
- Status: Completed (Ready for user review and push)
- Current step: 10-optimization-deploy (Deploy and review reports finalized)
- Owner: AI collaborator

## Current Objective
- Implement the 'Đặt tour' screen at `/tours/{slug}/book`.
- Follow the 10-step pipeline from STACK_SKILLS_INDEX.md.
- Ensure authentication, price calculation, and booking creation flows are correct.

## Files Recently Updated
- `src/app/[locale]/(main)/(protected)/tours/[slug]/book/page.tsx` (New - Implementation)
- `src/features/tour/components/BookingForm.tsx` (New - Implementation)
- `src/features/tour/components/ScheduleCalendar.tsx` (New - Implementation)
- `src/features/tour/components/OrderSummaryCard.tsx` (New - Implementation)
- `src/features/tour/components/BookingProgressSteps.tsx` (New - Implementation)
- `src/features/tour/components/QuantityCounter.tsx` (New - Implementation)
- `src/features/tour/components/PaymentMethodSelector.tsx` (New - Implementation)
- `src/features/tour/hooks/useBookingQueries.ts` (New - Implementation)
- `src/features/tour/validators/booking.schema.ts` (New - Implementation)
- `src/messages/vi/tour.json` (Update - i18n)
- `src/messages/en/tour.json` (Update - i18n)
- `.agent/artifacts/test-cases/2026-05-17__tour-booking__test-report.md` (New - Test Report)

## Current Decisions In Force
- `REPO_FACTS.md` is the compact repo reality anchor.
- Drift checks must run before native validation checks.
- For forms in this repo, do not assume one global form library; follow the touched feature's current pattern unless the task is an explicit migration.
- **Design Policy:** Strict adherence to Dark Mode/Bronze tokens even if prototypes are light-themed.
- **Data Policy:** Prefer Server Prefetch for static details, Client Query for interactive state.
- **Interaction Policy:** Use `react-hook-form` + `zod` for complex forms like tour-booking.
- **Memory Policy:** Every skill step must reread `WORKING_STATE.md`, `HANDOFF.md`, `SESSION_LOG.md`, latest relevant artifacts, and the active `SKILL.md`.
- **Step Completion Policy:** Every completed skill step must update `WORKING_STATE.md`, append `SESSION_LOG.md`, and update `HANDOFF.md` when paused, blocked, waiting for approval, or incomplete.
- **Code Policy:** Code starts no later than `05-ui-components`; `03-types-api-contract` and `04-layout-routing` also edit code when missing contracts/routes block the feature.

## Known Open Items
- Implementation of components and page shell is complete.
- Static quality gates passed.
- UI and Localization verification passed.
- **Blocker**: Backend API returns 401 on login and 500 on registration, preventing functional testing of the booking flow.

## Immediate Next Steps
1. Stop for approval.
2. The user must resolve the backend authentication blocker (500 Error on Register / DB Seed).
3. Wait for instructions on whether to re-run functional tests for `tour-booking` or move to `10-optimization-deploy`.
