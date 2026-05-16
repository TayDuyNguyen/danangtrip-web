# DanangTrip Web Repo Facts

This file is the compact, high-priority facts sheet for AI and contributors.
Use it to avoid drifting from the real repository state.

Priority:
1. `PROJECT_RULES.md`
2. `REPO_FACTS.md`
3. Real repository files (`package.json`, `src/`, config files)
4. Skill docs under `.agent/skills/`

## Current Stack

| Area | Current reality |
| --- | --- |
| Framework | Next.js 16 App Router |
| React | 19.x |
| Styling | Tailwind CSS v4 |
| Server/client data | TanStack Query v5 |
| Client state | Zustand v5 |
| HTTP | Axios |
| i18n | next-intl v4 |
| Validation library | Zod v4 |
| Testing | Vitest |
| Deploy target | Cloudflare Workers via OpenNext |

## Repository Shape

- Route tree lives under `src/app/`.
- Shared UI lives under `src/components/`.
- Feature code lives under `src/features/`.
- Transport logic lives under `src/services/`.
- Shared query provider lives under `src/providers/providers.tsx`.
- Locale routing lives under `src/i18n/`.
- Middleware lives under `src/middleware.ts`.

## Form And Validation Reality

- Do not assume `react-hook-form` is the standard form layer in this repo today.
- The repo does use Zod validators, for example:
  - `src/features/auth/validators/auth.schema.ts`
  - `src/features/contact/validators/contact.validator.ts`
- Some current forms still use local state plus `schema.safeParse(...)`, for example:
  - `src/features/contact/components/ContactForm.tsx`
- Therefore:
  - follow the touched feature's existing pattern unless the task explicitly requests a form architecture migration
  - if proposing `react-hook-form`, treat it as a deliberate migration, not as the default current standard

## Data Fetching Reality

- Prefer TanStack Query for API-backed client data.
- Existing hooks already follow this in `src/hooks/` and `src/features/*/hooks/`.
- Avoid introducing `useEffect` fetching when a query hook is the natural fit.

## Auth Reality

- Auth state is managed with Zustand.
- Cookie access exists via `js-cookie`.
- Middleware behavior and client auth persistence must stay aligned.

## Testing Reality

- Native checks:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run check:routes`
  - `npm run build`
  - `npm run prepush:check`
- Optional test run:
  - `npx vitest run`
- Do not claim Playwright coverage unless the repo adds that setup.

## Agent Guardrails

- Do not upgrade the documented architecture just because a skill template shows a nicer pattern.
- Before generating artifacts or code, confirm commands, paths, and libraries exist in the repo.
- If a skill example conflicts with this file, update the artifact/code to match the repo and note the mismatch.
