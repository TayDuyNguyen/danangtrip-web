# DanangTrip Web - Agent Prompt Playbook (Figma -> UI)

This document is a standard prompt framework for Codex/AI when implementing UI from Figma in the `danangtrip-web` repository.

Goals:
- Follow real project conventions, not generic templates.
- Ship quickly while preserving architecture, i18n, and design tokens.
- Reduce regressions.

---

## 0) Required bootstrap (run once per session)

Use this prompt:

> Act as a Senior Frontend Engineer for repo `d:/DATN/danangtrip-web`.
>
> Before writing code, you must read:
> 1. `.agent/rules/PROJECT_RULES.md`
> 2. `DESIGN.md`
> 3. `src/app/[locale]/globals.css`
> 4. related route/page files in `src/app/[locale]/...`
>
> Rules:
> - Follow App Router + next-intl.
> - Do not hardcode user-facing text; use i18n keys.
> - Prioritize reuse from `src/components/ui` and `src/components/layout`.
> - Icon set: Solar (`@/components/icons/solar`).
> - Client data flow: service -> hook (TanStack Query) -> UI.
> - End each step with: `DONE | DOING | NEXT`.

---

## 1) Figma analysis (no code yet)

Use this prompt:

> Analyze Figma: `[FIGMA_LINK]` for screen `[SCREEN_NAME]`.
>
> Return 5 sections:
> 1. Required design tokens (color, spacing, radius, typography, shadow, blur).
> 2. Component breakdown (what can be reused from `src/components/ui`, what must be created).
> 3. Responsive behavior (mobile/tablet/desktop).
> 4. Required UI states (loading, empty, error, success, disabled, hover/focus).
> 5. Data fields to display (field name, type, required/optional).
>
> Do not create files and do not write code yet.

---

## 2) Map to current codebase (no code yet)

Use this prompt:

> Compare Figma with the current codebase.
>
> Required:
> - Find reusable components in `src/components/ui`, `src/components/layout`, `src/features/*/components`.
> - Identify the route/page path under App Router (`src/app/[locale]/...`).
> - Identify i18n namespaces to update (`src/messages/vi/*.json`, `src/messages/en/*.json`).
> - Identify existing hooks/services that can be reused.
>
> Return:
> - List `[REUSE]`, `[NEW]`, `[MOD]` + reason.
> - Risk/gap if Figma conflicts with `DESIGN.md` or `PROJECT_RULES.md`.
> - Ask for confirmation before scaffold.

---

## 3) Scaffold plan (no code yet)

Use this prompt:

> Create a file plan for screen `[SCREEN_NAME]`.
>
> Requirements:
> - List each file as: `[NEW|MOD] path - one-line purpose`.
> - Keep implementation order: types -> service -> hook -> ui -> page -> i18n.
> - If shared components are touched, state impact clearly.
>
> Do not code yet; wait for confirmation.

---

## 4) Implement code (after confirmation)

Use this prompt:

> Implement based on the approved scaffold.
>
> Required order:
> 1. Types: place in correct location (shared in `src/types`, feature-specific in `src/features/<feature>/types`).
> 2. Service: place in `src/services`, do not put HTTP calls in components.
> 3. Hook: place in `src/features/<feature>/hooks` (or `src/hooks` if shared), prefer TanStack Query.
> 4. UI components: reuse first, create new only when needed.
> 5. Wire page in `src/app/[locale]/...`.
> 6. i18n: update both `vi` and `en`.
>
> Quality rules:
> - Do not introduce `any` unless necessary.
> - Do not cross-import sibling features.
> - Do not break design tokens in `globals.css`.
> - If icons are needed, use only `@/components/icons/solar`.

---

## 5) Quality review and close

Use this prompt:

> Review the implemented screen with this checklist:
> - Route + locale follow App Router conventions.
> - No hardcoded user-facing text.
> - i18n vi/en are in sync.
> - Loading/empty/error states are complete.
> - Component reuse is reasonable, no unnecessary duplicates.
> - TypeScript has no unnecessary `any`.
> - No violations of [PROJECT_RULES.md].
>
> Then run:
> - `npm run typecheck`
> - `npm run lint`
>
> Report:
> - Files created/modified
> - Check results
> - Residual risks (if any)

---

## Quick prompt (single full-flow run)

> Implement screen from Figma `[FIGMA_LINK]` for repo `d:/DATN/danangtrip-web`.
>
> Follow this sequence:
> 1) Read `.agent/rules/PROJECT_RULES.md`, `DESIGN.md`, `src/app/[locale]/globals.css`.
> 2) Analyze Figma + map to existing components/hooks/services.
> 3) Propose scaffold `[NEW|MOD]` and wait for confirmation.
> 4) Implement after confirmation.
> 5) Run `npm run typecheck` + `npm run lint`.
> 6) Summarize with `DONE | DOING | NEXT`.

## Review code
Review screen `[SCREEN_NAME]` in repo `d:/DATN/danangtrip-web` (no Figma tasks).

Context:
- Route/file: `[PATH_TO_PAGE_OR_COMPONENT]`
- Scope: only review and fix this screen + directly related files.

Do this sequence:
1) Read `.agent/rules/PROJECT_RULES.md`, `DESIGN.md`, `src/app/[locale]/globals.css`.
2) Audit this screen by checklist:
   - Validate App Router + locale conventions.
   - i18n: no hardcoded user-facing text; keep vi/en keys synchronized.
   - Complete UI states: loading / empty / error / success.
   - Reuse components appropriately (`src/components/ui`, `src/components/layout`).
   - Type safety: avoid unnecessary `any`.
   - Correct data flow: service -> hook (TanStack Query) -> UI.
   - Basic accessibility: semantic HTML, focus states, aria, keyboard support.
   - Design consistency with current tokens/rules.
3) List findings by severity: Critical / Major / Minor, with file path + line.
4) Fix all issues within scope.
5) Run `npm run typecheck` and `npm run lint`; fix until both pass.
6) Final report:
   - Files changed
   - What was fixed
   - Command results
   - Residual risks (if any)

Output format: `DONE | DOING | NEXT`.
