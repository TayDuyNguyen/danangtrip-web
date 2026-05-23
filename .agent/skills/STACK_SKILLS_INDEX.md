# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Current selected web screen: `user-forgot-password`.

## Current Decision Snapshot

Date locked: `2026-05-23`

- Repo: `D:\DATN\danangtrip-web`
- Selected screen: `Quen mat khau`
- Feature slug: `user-forgot-password`
- Main route: `/forgot-password`
- Target page path: `src/app/[locale]/(auth)/forgot-password/page.tsx`
- Target component: `src/features/auth/components/forgot-password-form.tsx`
- Primary doc: `D:\DATN\DATN_Document\docs\page\user_forgot_password.md`
- API: `POST /auth/forgot-password`
- Status: selected next screen after re-checking that `/login` and `/register` already have route/form code; Step 01 is pending.
- Implementation reality: forgot-password endpoint/types/service exist, but no forgot-password route/page/component/i18n exists in the current web repo.
- Cross-project order: this web prompt is independent from admin; do not use admin progress to decide web steps.

## Why This Is Next

- Current selection rule: only choose screens that do not yet have route/page/component code in the web repo.
- `user-login` already has code at `src/app/[locale]/(auth)/login/page.tsx` and `src/features/auth/components/login-form.tsx`.
- `user-register` already has code at `src/app/[locale]/(auth)/register/page.tsx` and `src/features/auth/components/register-form.tsx`.
- `user-verify-email` completed Step 10.
- `/forgot-password` has a real backend API and service method but has no frontend route/page yet.
- The current login form still needs a correct forgot-password destination; this feature closes that broken navigation path.

## Codegraph Findings

Read `D:\DATN\danangtrip-web\.codegraph\codegraph.db` before changing this feature, but verify against repo reality.

- Codegraph/repo confirms login and register exist; do not rebuild them as the next screen.
- There is no route under `src/app/[locale]/(auth)/forgot-password`.
- There is no `forgot-password-form.tsx` under `src/features/auth/components`.
- There are no `forgot-password.json` message files under `src/messages/vi` or `src/messages/en`.
- `src/config/api.ts` already defines `API_ENDPOINTS.AUTH.FORGOT_PASSWORD` as `/auth/forgot-password`.
- `src/types/auth.types.ts` already defines `ForgotPasswordRequest`.
- `src/services/auth.service.ts` already exposes `forgotPassword(data)`.
- Known related fix: `login-form.tsx` currently points the forgot-password link to `ROUTES.CONTACT`; Step 04/07 must change it to `/forgot-password` or a route constant.

## Goals

- Deliver the missing `/forgot-password` public auth screen through the 10-step feature pipeline.
- Reuse existing auth-page visual language from login/register without duplicating their logic.
- Wire the real `POST /auth/forgot-password` service and handle success without leaking whether an email exists.
- Fix login-to-forgot-password navigation as part of the feature.
- Produce artifacts for every step and update memory after each step.
- Do not switch to login, register, reset-password, profile, or admin screens.
- Do not use legacy `DATN_T...` document paths; current docs root is `D:\DATN\DATN_Document`.

## Canonical Read Order

Before every skill step, read in this order:

1. `AGENTS.md`
2. `.agent/rules/PROJECT_RULES.md`
3. `.agent/rules/REPO_FACTS.md`
4. `.agent/memory/WORKING_STATE.md`
5. `.agent/memory/HANDOFF.md`
6. `.agent/memory/SESSION_LOG.md`
7. Latest relevant artifacts for `user-forgot-password` if any
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
| `03-types-api-contract` | Contract/code foundation | Verify/add forgot-password types, endpoint constants, service calls, schema, error mapping. |
| `04-layout-routing` | Routing/code scaffold | Add `/forgot-password` route, route constants if used, metadata, i18n registration, login link fix. |
| `05-ui-components` | Code-producing | Implement forgot-password form and success/error/loading states. |
| `06-data-integration` | Code-producing | Wire API submit, loading, success, validation, and API error states. |
| `07-interactions` | Code-producing | Implement submit behavior, back-to-login navigation, retry/resend semantics, focus, disabled states. |
| `08-auth-permissions` | Code-producing when guards are wrong | Verify page is public/auth route and does not require token. |
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
- Feature slug: `user-forgot-password`
- Screen name: `Quen mat khau`
- Main route: `/forgot-password`
- Target page path: `D:\DATN\danangtrip-web\src\app\[locale]\(auth)\forgot-password\page.tsx`
- Target component: `D:\DATN\danangtrip-web\src\features\auth\components\forgot-password-form.tsx`
- Feature type: public auth recovery screen for requesting a password reset email.
- Do not switch to login, register, reset-password, verify-email, profile, booking, or admin screens.

WHY THIS IS NEXT
- `/login` and `/register` already have route/form code.
- `/forgot-password` has no route/page/component yet.
- Backend/service support exists through `POST /auth/forgot-password`.
- The login form currently needs its forgot-password link corrected away from `ROUTES.CONTACT`.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\memory\SESSION_LOG.md`
7. Latest relevant `user-forgot-password` artifacts if any
8. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. Screen/API/repo references listed below

SCREEN AND API REFERENCES
- Progress report: `D:\DATN\DATN_Document\docs\project_delivery_progress_report.md`
- Primary screen doc: `D:\DATN\DATN_Document\docs\page\user_forgot_password.md`
- Related docs: `D:\DATN\DATN_Document\docs\page\user_login.md`; `D:\DATN\DATN_Document\docs\page\user_reset_password.md`; `D:\DATN\DATN_Document\docs\page\user_register.md`
- User page list: `D:\DATN\DATN_Document\docs\reference\list_page_user.md`
- API list: `D:\DATN\DATN_Document\docs\api\api_list.md`
- Backend routes: `D:\DATN\danangtrip-api\routes\api.php`

REPO CONTEXT TO READ
- `D:\DATN\danangtrip-web\DESIGN.md`
- `D:\DATN\danangtrip-web\package.json`
- `D:\DATN\danangtrip-web\src\config\api.ts`
- `D:\DATN\danangtrip-web\src\config\routes.ts`
- `D:\DATN\danangtrip-web\src\services\auth.service.ts`
- `D:\DATN\danangtrip-web\src\types\auth.types.ts`
- `D:\DATN\danangtrip-web\src\features\auth\hooks\use-auth.ts`
- `D:\DATN\danangtrip-web\src\features\auth\components\login-form.tsx`
- `D:\DATN\danangtrip-web\src\features\auth\components\register-form.tsx`
- `D:\DATN\danangtrip-web\src\app\[locale]\(auth)\login\page.tsx`
- `D:\DATN\danangtrip-web\src\app\[locale]\(auth)\register\page.tsx`
- `D:\DATN\danangtrip-web\src\messages\vi`
- `D:\DATN\danangtrip-web\src\messages\en`

REQUIRED API FLOW
- Submit email through `POST /auth/forgot-password`.
- Request body: `{ email: string }`.
- On success, show a neutral message such as "If this email exists, reset instructions have been sent."
- Do not reveal whether an email exists.
- Handle validation error, server/network error, loading, retry, and back-to-login states.
- Keep this page public; it must not require an access token.

EXPECTED UX
- Auth-page visual language consistent with existing login/register pages.
- Single email field with accessible validation.
- Primary action: send reset link.
- Secondary action: back to `/login`.
- Success state: confirmation card/message with option to resend or return to login.
- Vietnamese and English i18n must not expose raw keys.
- Mobile layout must remain usable.

PIPELINE ORDER
1. `01-screen-analysis`
2. `02-project-setup` if required by repo rules or stale audit
3. `03-types-api-contract`
4. `04-layout-routing`
5. `05-ui-components`
6. `06-data-integration`
7. `07-interactions`
8. `08-auth-permissions`
9. `09-testing`
10. `10-optimization-deploy`

ARTIFACT TARGETS
- Analysis: `.agent/artifacts/analysis/2026-05-23__user-forgot-password__screen-analysis.md`
- Project audit: `.agent/artifacts/setup/2026-05-23__user-forgot-password__project-setup-report.md`
- API contract: `.agent/artifacts/api-contracts/2026-05-23__user-forgot-password__api-contract.md`
- Routing: `.agent/artifacts/routing/2026-05-23__user-forgot-password__route-plan.md`
- UI spec: `.agent/artifacts/ui-specs/2026-05-23__user-forgot-password__ui-spec.md`
- Data integration: `.agent/artifacts/integration/2026-05-23__user-forgot-password__data-integration.md`
- Interaction spec: `.agent/artifacts/interaction-specs/2026-05-23__user-forgot-password__interaction-spec.md`
- Auth review: `.agent/artifacts/auth/2026-05-23__user-forgot-password__auth-permissions-review.md`
- Test report: `.agent/artifacts/test-cases/2026-05-23__user-forgot-password__test-report.md`
- Deploy report: `.agent/artifacts/deploy/2026-05-23__user-forgot-password__deploy-report.md`
- Final review: `.agent/artifacts/review/2026-05-23__user-forgot-password__review.md`

VALIDATION COMMANDS
- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run build`
- `npm.cmd run prepush:check` if available and feasible

BEGIN NOW
Start Step 01 for `user-forgot-password`. Treat `/login` and `/register` as existing reference screens, not as the selected feature.
```

## Step Prompts - user-forgot-password

### Step 01

```text
Activate `01-screen-analysis` for `user-forgot-password`.
Repo: `D:\DATN\danangtrip-web`
Read canonical order plus `.agent/skills/01-screen-analysis/SKILL.md`.
Inputs: progress report, `user_forgot_password.md`, login/reset/register docs, API list, backend routes, codegraph findings, current login/register page/form/service/types.
Work: analyze route gap, API contract, validation, neutral success copy, i18n needs, login link fix, public auth behavior. Do not edit product code.
Output: `.agent/artifacts/analysis/2026-05-23__user-forgot-password__screen-analysis.md`
```

### Step 02

```text
Activate `02-project-setup` for `user-forgot-password`.
Repo: `D:\DATN\danangtrip-web`
Inspect: `package.json`, Next config, auth layout, i18n setup, test/build scripts, login/register route patterns.
Work: audit runtime/setup readiness; fix only setup blockers.
Output: `.agent/artifacts/setup/2026-05-23__user-forgot-password__project-setup-report.md`
```

### Step 03

```text
Activate `03-types-api-contract` for `user-forgot-password`.
Inspect: `src/config/api.ts`, `src/services/auth.service.ts`, `src/types/auth.types.ts`, backend `routes/api.php`.
Work: verify `ForgotPasswordRequest`, `API_ENDPOINTS.AUTH.FORGOT_PASSWORD`, service method, response/error shape, and add schema/mapper only if missing.
Output: `.agent/artifacts/api-contracts/2026-05-23__user-forgot-password__api-contract.md`
```

### Step 04

```text
Activate `04-layout-routing` for `user-forgot-password`.
Target route: `/forgot-password`
Target page: `src/app/[locale]/(auth)/forgot-password/page.tsx`
Inspect: `src/config/routes.ts`, auth route pages/layouts, i18n registration, login form.
Work: add route/page shell, metadata, route constants if used, locale behavior, and fix login forgot-password link.
Output: `.agent/artifacts/routing/2026-05-23__user-forgot-password__route-plan.md`
```

### Step 05

```text
Activate `05-ui-components` for `user-forgot-password`.
Files: forgot-password page/form and related auth UI components.
References: `DESIGN.md`, `login-form.tsx`, `register-form.tsx`, `user_forgot_password.md`.
Work: implement form UI, success state, error state, loading state, back-to-login action, responsive layout, and i18n strings.
Output: `.agent/artifacts/ui-specs/2026-05-23__user-forgot-password__ui-spec.md`
```

### Step 06

```text
Activate `06-data-integration` for `user-forgot-password`.
Inspect: `auth.service.ts`, `auth.types.ts`, forgot-password form code.
Work: wire API submit with `{ email }`, validation, API error mapping, loading, neutral success state, and retry behavior.
Output: `.agent/artifacts/integration/2026-05-23__user-forgot-password__data-integration.md`
```

### Step 07

```text
Activate `07-interactions` for `user-forgot-password`.
Work: implement/fix submit flow, duplicate-submit prevention, Enter-key behavior, focus management, resend/retry semantics, back-to-login navigation, toasts/messages, and disabled states.
Output: `.agent/artifacts/interaction-specs/2026-05-23__user-forgot-password__interaction-spec.md`
```

### Step 08

```text
Activate `08-auth-permissions` for `user-forgot-password`.
Inspect: middleware, auth routes, public route behavior, login/register redirect behavior.
Work: verify forgot-password is public, authenticated users are handled according to repo auth-route policy, and API call does not require token. Fix only real auth/permission gaps.
Output: `.agent/artifacts/auth/2026-05-23__user-forgot-password__auth-permissions-review.md`
```

### Step 09

```text
Activate `09-testing` for `user-forgot-password`.
Run as feasible: `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run build`, focused tests if available, `npm.cmd run prepush:check`.
Work: fix feature-caused failures and document pass/fail/skipped commands with evidence.
Output: `.agent/artifacts/test-cases/2026-05-23__user-forgot-password__test-report.md`
```

### Step 10

```text
Activate `10-optimization-deploy` for `user-forgot-password`.
Inputs: artifacts 01-09, validation output, final git diff.
Work: final review for route/API/i18n/UI/interactions/auth/tests, run or cite final validation, create deploy report and final review, update `WORKING_STATE.md`, `SESSION_LOG.md`, and `HANDOFF.md`.
Completion rule: do not mark complete until deploy and review artifacts exist with validation evidence.
Outputs: `.agent/artifacts/deploy/2026-05-23__user-forgot-password__deploy-report.md`; `.agent/artifacts/review/2026-05-23__user-forgot-password__review.md`
```

## Files Commonly Read Before Most Tasks

- `.agent/rules/PROJECT_RULES.md`
- `.agent/rules/REPO_FACTS.md`
- `.agent/memory/WORKING_STATE.md`
- `.agent/memory/HANDOFF.md`
- `package.json`
- `src/config/api.ts`
- `src/config/routes.ts`
- `src/services/auth.service.ts`
- `src/types/auth.types.ts`
- `src/features/auth/hooks/use-auth.ts`
- `src/features/auth/components/login-form.tsx`
- `src/features/auth/components/register-form.tsx`
- `src/app/[locale]/(auth)/login/page.tsx`
- `src/app/[locale]/(auth)/register/page.tsx`
- `src/messages/vi`
- `src/messages/en`
