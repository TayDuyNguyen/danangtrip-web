---
name: nextjs-project-rules
description: Apply DanangTrip Web project operating rules for Next.js architecture, i18n consistency, auth/store integrity, and quality gates. Use when implementing, refactoring, or reviewing code in this repository.
---

# Next.js Project Rules

Use this skill to enforce repository-specific rules from `.agent/rules/PROJECT_RULES.md`.

## When to Use

- Any code implementation/refactor in this repository
- Auth, route, i18n, store, service, or layout changes
- Final review before claiming completion

## Mandatory Workflow

1. Read `.agent/rules/PROJECT_RULES.md` before editing.
2. Identify impacted layers (`app`, `features`, `services`, `store`, `i18n`, `messages`).
3. Choose one primary specialist skill for the task domain.
4. Implement with server/client boundary discipline (`"use client"` only when needed).
5. Keep locale keys synchronized for `vi` and `en`.
6. Run quality gates and report outcomes.

## Hard Constraints

- Do not introduce duplicated auth stores or split auth truth.
- Do not add nav links for pages that do not exist.
- Do not add new `any` in modified code unless justified at boundary.
- Do not hardcode reusable UI text; prefer translation keys.

## Suggested Skill Routing

- Next.js structure/performance: `nextjs-react-expert`
- API/auth/security: `api-patterns`, `vulnerability-scanner`
- UI/Tailwind/a11y: `frontend-design`, `tailwind-patterns`
- Locale consistency: `i18n-localization`
- Debugging: `systematic-debugging`
- Validation: `lint-and-validate`

## Completion Checklist

- [ ] Updated files follow project architecture layers
- [ ] i18n keys synced in `src/messages/vi` and `src/messages/en`
- [ ] Route constants match actual app pages
- [ ] `npm run lint` passed
- [ ] `npx tsc --noEmit` passed
- [ ] `npm run build` passed

