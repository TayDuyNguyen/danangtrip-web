# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Current selected web screen: `user-reset-password`.

## Current Decision Snapshot

Date locked: `2026-05-23`

- Repo: `D:\DATN\danangtrip-web`
- Selected screen: `Dat lai mat khau`
- Feature slug: `user-reset-password`
- Main route: `/reset-password`
- Target page path: `src/app/[locale]/(auth)/reset-password/page.tsx`
- Target component: `src/features/auth/components/reset-password-form.tsx`
- Primary doc: `D:\DATN\DATN_Document\docs\page\user_reset_password.md`
- API: `POST /auth/reset-password`
- Status: selected next screen after `user-forgot-password` Step 10 completion.
- Implementation reality: reset-password endpoint, type, service, schema, and backend route exist; no `/reset-password` route/page/component/i18n exists in the current web repo.
- Cross-project order: this web prompt is independent from admin; do not use admin progress to decide web steps.

## Why This Is Next

- Current selection rule: only choose screens that do not yet have route/page/component code in the web repo.
- `user-forgot-password` is completed and validated.
- `src/config/api.ts` already defines `API_ENDPOINTS.AUTH.RESET_PASSWORD` as `/auth/reset-password`.
- `src/types/auth.types.ts` already defines `ResetPasswordRequest`.
- `src/services/auth.service.ts` already exposes `resetPassword(data)`.
- `src/features/auth/validators/auth.schema.ts` already defines `resetPasswordSchema`, but it currently lacks `email` even though backend requires `email`, `token`, `password`, and `password_confirmation`.
- Codegraph/repo search confirms there is no `src/app/[locale]/(auth)/reset-password/page.tsx`.
- Codegraph/repo search confirms there is no `src/features/auth/components/reset-password-form.tsx`.

## Codegraph Findings

Read `D:\DATN\danangtrip-web\.codegraph\codegraph.db` before changing this feature, but verify against repo reality.

- Codegraph contains no file path matching `reset-password`.
- Codegraph contains `ResetPasswordRequest`, `ResetPasswordData`, `resetPasswordSchema`, and `ResetPasswordSchema`.
- Codegraph contains completed `forgot-password` route and form, so do not rebuild forgot-password.
- Existing auth visual patterns to reuse: `login-form.tsx`, `register-form.tsx`, `forgot-password-form.tsx`, `verify-email-form.tsx`.
- Middleware currently lists auth routes as `["/login", "/register", "/forgot-password"]`; Step 08 must verify whether `/reset-password` should be added as an auth/public recovery route.
- Auth route constants currently include login/register/verify-email/forgot-password; Step 04 should add `RESET_PASSWORD`.

## Goals

- Deliver the missing `/reset-password` public auth screen through the 10-step feature pipeline.
- Read `token` and `email` from URL query when provided; allow email entry when missing.
- Submit the backend-compatible payload: `email`, `token`, `password`, `password_confirmation`.
- Handle invalid/missing/expired token states with a link back to `/forgot-password`.
- On success, show confirmation and provide navigation to `/login`; redirect only if this matches current auth UX.
- Reuse current auth page visual language and i18n approach.
- Produce artifacts for every step and update memory after each step.
- Do not switch to forgot-password, login, register, verify-email, profile, booking, admin, or dashboard screens.
- Do not use legacy `DATN_T...` document paths; current docs root is `D:\DATN\DATN_Document`.

## Canonical Read Order

Before every skill step, read in this order:

1. `AGENTS.md`
2. `.agent/rules/PROJECT_RULES.md`
3. `.agent/rules/REPO_FACTS.md`
4. `.agent/memory/WORKING_STATE.md`
5. `.agent/memory/HANDOFF.md`
6. `.agent/memory/SESSION_LOG.md`
7. Latest relevant `user-reset-password` artifacts if any
8. `.agent/skills/STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. Real repo sources and docs listed in this prompt

If these sources conflict, follow the earlier item unless repo reality proves it stale. Record stale facts in the artifact.

## Memory Continuity Rules

- At the start of each step, update `.agent/memory/WORKING_STATE.md`.
- After each completed step, update `.agent/memory/WORKING_STATE.md` and append `.agent/memory/SESSION_LOG.md`.
- Update `.agent/memory/HANDOFF.md` if paused, blocked, waiting for approval, or incomplete.
- Do not claim a step is complete until the artifact and memory updates are complete.

## Coding Responsibility By Skill

| Skill | Execution mode | Code expectation |
| --- | --- | --- |
| `01-screen-analysis` | Analysis only | Do not edit product code; create/update analysis artifact and memory. |
| `02-project-setup` | Audit/setup | Usually no feature code; config/script fixes only if required. |
| `03-types-api-contract` | Contract/code foundation | Align reset-password types/schema with backend payload, verify endpoint constants, service call, error mapping, and response shape. |
| `04-layout-routing` | Routing/code scaffold | Add `/reset-password` route, route constant, metadata, i18n registration, and route-level query handling. |
| `05-ui-components` | Code-producing | Implement reset-password form, password fields, token/email handling UI, success/error/loading states, and recovery navigation. |
| `06-data-integration` | Code-producing | Wire API submit, backend-compatible payload mapping, validation, API error mapping, loading, success, and retry behavior. |
| `07-interactions` | Code-producing | Implement submit behavior, duplicate-submit prevention, password visibility toggles if pattern exists, back-to-login, request-new-link, focus, disabled states. |
| `08-auth-permissions` | Code-producing when guards are wrong | Verify page is public/auth route, no token auth required, and authenticated-user redirect policy does not block reset links. |
| `09-testing` | Validation/fix loop | Run checks/tests and fix feature-caused failures. |
| `10-optimization-deploy` | Finalization/fix loop | Final review, deploy readiness artifacts, memory handoff. |

## Repository Reality

| Area | Reality |
| --- | --- |
| Framework | Next.js App Router |
| React | 19.x |
| Styling | Tailwind CSS v4 |
| Data fetching | TanStack Query v5 where used |
| State | Zustand v5 |
| Validation | Zod v4 |
| HTTP | Axios v1 |
| i18n | next-intl v4 |
| Testing | Vitest v4 |
| Deploy | Cloudflare Workers via OpenNext |

## Pipeline Map

| # | Skill | Primary artifact |
| --- | --- | --- |
| 01 | `01-screen-analysis` | `analysis/...__screen-analysis.md` |
| 02 | `02-project-setup` | `setup/...__project-setup-report.md` |
| 03 | `03-types-api-contract` | `api-contracts/...__api-contract.md` |
| 04 | `04-layout-routing` | `routing/...__route-plan.md` |
| 05 | `05-ui-components` | `ui-specs/...__ui-spec.md` |
| 06 | `06-data-integration` | `integration/...__data-integration.md` |
| 07 | `07-interactions` | `interaction-specs/...__interaction-spec.md` |
| 08 | `08-auth-permissions` | `auth/...__auth-permissions-review.md` |
| 09 | `09-testing` | `test-cases/...__test-report.md` |
| 10 | `10-optimization-deploy` | `deploy/...__deploy-report.md`, `review/...__review.md` |

## Recommended Current Screen Prompt

```text
SYSTEM EXECUTION CONTRACT

Act as the execution agent for repository: `D:\DATN\danangtrip-web`

CURRENT SCREEN LOCK
- Feature slug: `user-reset-password`
- Screen name: `Dat lai mat khau`
- Main route: `/reset-password`
- Target page path: `D:\DATN\danangtrip-web\src\app\[locale]\(auth)\reset-password\page.tsx`
- Target component: `D:\DATN\danangtrip-web\src\features\auth\components\reset-password-form.tsx`
- Feature type: public auth recovery screen for setting a new password from a reset email link.
- Do not switch to forgot-password, login, register, verify-email, profile, booking, admin, or dashboard screens.

WHY THIS IS NEXT
- `user-forgot-password` completed Step 10 and now provides the request-reset entry point.
- `/reset-password` has no route/page/component/i18n in the web repo.
- Backend route exists: `POST /auth/reset-password`.
- Existing frontend API/service/schema support exists but needs contract alignment with backend because backend requires `email`, `token`, `password`, and confirmed password.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\memory\SESSION_LOG.md`
7. Latest relevant `user-reset-password` artifacts if any
8. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. Screen/API/repo references listed below

SCREEN AND API REFERENCES
- Progress report: `D:\DATN\DATN_Document\docs\project_delivery_progress_report.md`
- Primary screen doc: `D:\DATN\DATN_Document\docs\page\user_reset_password.md`
- Related docs: `D:\DATN\DATN_Document\docs\page\user_forgot_password.md`; `D:\DATN\DATN_Document\docs\page\user_login.md`; `D:\DATN\DATN_Document\docs\page\user_register.md`
- User page list: `D:\DATN\DATN_Document\docs\reference\list_page_user.md`
- API list: `D:\DATN\DATN_Document\docs\api\api_list.md`
- Backend routes: `D:\DATN\danangtrip-api\routes\api.php`
- Backend reset request: `D:\DATN\danangtrip-api\app\Http\Requests\Auth\ResetPasswordRequest.php`
- Backend controller: `D:\DATN\danangtrip-api\app\Http\Controllers\Api\AuthController.php`

REPO CONTEXT TO READ
- `D:\DATN\danangtrip-web\DESIGN.md`
- `D:\DATN\danangtrip-web\package.json`
- `D:\DATN\danangtrip-web\src\config\api.ts`
- `D:\DATN\danangtrip-web\src\config\routes.ts`
- `D:\DATN\danangtrip-web\src\middleware.ts`
- `D:\DATN\danangtrip-web\src\i18n\request.ts`
- `D:\DATN\danangtrip-web\src\services\auth.service.ts`
- `D:\DATN\danangtrip-web\src\types\auth.types.ts`
- `D:\DATN\danangtrip-web\src\features\auth\validators\auth.schema.ts`
- `D:\DATN\danangtrip-web\src\features\auth\index.ts`
- `D:\DATN\danangtrip-web\src\features\auth\components\login-form.tsx`
- `D:\DATN\danangtrip-web\src\features\auth\components\forgot-password-form.tsx`
- `D:\DATN\danangtrip-web\src\app\[locale]\(auth)\forgot-password\page.tsx`
- `D:\DATN\danangtrip-web\src\messages\vi`
- `D:\DATN\danangtrip-web\src\messages\en`

CONTRACT DETAILS
- Backend validation requires `email`, `token`, `password`, and Laravel confirmation field for `password`.
- Frontend schema currently has `token`, `password`, `confirmPassword`; Step 03 must add/validate email and map `confirmPassword` to `password_confirmation` if the API type uses backend field names.
- The screen should gracefully handle missing `token` or `email` query values.
- Invalid/expired token states must offer a link to `/forgot-password`.
- Success state should lead to `/login`.

EXECUTION RULES
- Follow the 10-step pipeline strictly.
- Do not mark a step complete without artifact and memory updates.
- Keep all edits scoped to `user-reset-password`.
- Prefer existing auth UI primitives and patterns over creating a parallel design system.
- Run validation in Step 09 and Step 10 as allowed by the environment.
```

## Step-by-step Prompts

### Step 01

```text
Activate `01-screen-analysis` for `user-reset-password`.
Read the mandatory context, codegraph findings, `user_reset_password.md`, backend `ResetPasswordRequest`, and current auth files.
Work: document screen purpose, route, payload, query params, missing code, existing reusable patterns, backend/frontend contract gaps, risk list, and implementation plan.
Output: `.agent/artifacts/analysis/2026-05-23__user-reset-password__screen-analysis.md`
```

### Step 02

```text
Activate `02-project-setup` for `user-reset-password`.
Inspect package scripts, existing auth folder conventions, i18n registration, route structure, test/build gates, and artifact/memory paths.
Work: verify setup readiness and note required config or script changes only if blocking.
Output: `.agent/artifacts/setup/2026-05-23__user-reset-password__project-setup-report.md`
```

### Step 03

```text
Activate `03-types-api-contract` for `user-reset-password`.
Inspect: `src/config/api.ts`, `src/types/auth.types.ts`, `src/services/auth.service.ts`, `src/features/auth/validators/auth.schema.ts`, backend `ResetPasswordRequest.php`.
Work: align frontend request type/schema/service payload with backend `email`, `token`, `password`, `password_confirmation`; preserve existing conventions; document response and errors.
Output: `.agent/artifacts/api-contracts/2026-05-23__user-reset-password__api-contract.md`
```

### Step 04

```text
Activate `04-layout-routing` for `user-reset-password`.
Target route: `/reset-password`
Target page: `src/app/[locale]/(auth)/reset-password/page.tsx`
Inspect: `src/config/routes.ts`, auth route pages/layouts, `src/i18n/request.ts`, middleware.
Work: add route/page shell, metadata, route constant, locale behavior, query param handoff, and i18n namespace registration.
Output: `.agent/artifacts/routing/2026-05-23__user-reset-password__route-plan.md`
```

### Step 05

```text
Activate `05-ui-components` for `user-reset-password`.
Files: reset-password page/form and related auth UI components.
References: `DESIGN.md`, `login-form.tsx`, `forgot-password-form.tsx`, `user_reset_password.md`.
Work: implement form UI, token/email state, password and confirmation fields, missing-token state, success state, error state, loading state, back-to-login action, request-new-link action, responsive layout, and i18n strings.
Output: `.agent/artifacts/ui-specs/2026-05-23__user-reset-password__ui-spec.md`
```

### Step 06

```text
Activate `06-data-integration` for `user-reset-password`.
Inspect: `auth.service.ts`, auth types/schema, reset-password form code, API error utility.
Work: wire API submit with backend-compatible payload, validation, API error mapping, loading, success, retry, and disabled states.
Output: `.agent/artifacts/integration/2026-05-23__user-reset-password__data-integration.md`
```

### Step 07

```text
Activate `07-interactions` for `user-reset-password`.
Work: implement/fix submit flow, duplicate-submit prevention, Enter-key behavior, password visibility if existing pattern supports it, focus management, back-to-login navigation, request-new-link navigation, toasts/messages, and disabled states.
Output: `.agent/artifacts/interaction-specs/2026-05-23__user-reset-password__interaction-spec.md`
```

### Step 08

```text
Activate `08-auth-permissions` for `user-reset-password`.
Inspect: middleware, auth routes, public route behavior, authenticated-user redirect behavior.
Work: verify reset-password is reachable without auth, API call does not require token, authenticated users are handled according to repo auth-route policy, and token query links are not blocked. Fix only real auth/permission gaps.
Output: `.agent/artifacts/auth/2026-05-23__user-reset-password__auth-permissions-review.md`
```

### Step 09

```text
Activate `09-testing` for `user-reset-password`.
Run as feasible: `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run build`, focused tests if available, `npm.cmd run prepush:check`.
Work: fix feature-caused failures and document pass/fail/skipped commands with evidence.
Output: `.agent/artifacts/test-cases/2026-05-23__user-reset-password__test-report.md`
```

### Step 10

```text
Activate `10-optimization-deploy` for `user-reset-password`.
Inputs: artifacts 01-09, validation output, final git diff.
Work: final review for route/API/i18n/UI/interactions/auth/tests, run or cite final validation, create deploy report and final review, update `WORKING_STATE.md`, `SESSION_LOG.md`, and `HANDOFF.md`.
Completion rule: do not mark complete until deploy and review artifacts exist with validation evidence.
Outputs: `.agent/artifacts/deploy/2026-05-23__user-reset-password__deploy-report.md`; `.agent/artifacts/review/2026-05-23__user-reset-password__review.md`
```

## Files Commonly Read Before Most Tasks

- `.agent/rules/PROJECT_RULES.md`
- `.agent/rules/REPO_FACTS.md`
- `.agent/memory/WORKING_STATE.md`
- `.agent/memory/HANDOFF.md`
- `package.json`
- `src/config/api.ts`
- `src/config/routes.ts`
- `src/middleware.ts`
- `src/i18n/request.ts`
- `src/services/auth.service.ts`
- `src/types/auth.types.ts`
- `src/features/auth/validators/auth.schema.ts`
- `src/features/auth/index.ts`
- `src/features/auth/components/login-form.tsx`
- `src/features/auth/components/forgot-password-form.tsx`
- `src/app/[locale]/(auth)/forgot-password/page.tsx`
- `src/messages/vi`
- `src/messages/en`
