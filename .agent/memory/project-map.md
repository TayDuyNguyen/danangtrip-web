# Project map (DanangTrip Web)

## Source of truth
- Repo rules: `.agent/rules/PROJECT_RULES.md`
- Repo facts: `.agent/rules/REPO_FACTS.md`
- Agent playbook: `AGENTS.md`
- Current working state: `.agent/memory/WORKING_STATE.md`
- Handoff state: `.agent/memory/HANDOFF.md`
- Architecture: `.agent/ARCHITECTURE.md`
- Design tokens/UX: `DESIGN.md`, `src/app/[locale]/globals.css`

## High-level structure
```text
src/
|-- app/          # Next.js App Router routes (locale-aware)
|-- components/   # shared UI/layout primitives
|-- features/     # feature modules (components/hooks/types)
|-- services/     # API/service wrappers (transport-oriented)
|-- hooks/        # shared hooks
|-- messages/     # next-intl locale dictionaries (vi/en)
|-- lib/          # shared clients/integrations
|-- types/        # shared types
|-- utils/        # stable helpers
|-- providers/    # app-wide providers
|-- middleware.ts # i18n + auth boundary
```

## Conventions (short)
- No hardcoded user-facing text: use i18n keys (vi/en sync).
- Data flow: service -> hook (TanStack Query) -> UI.
- Feature isolation: no cross-import sibling features.

## Memory protocol
- Read `.agent/memory/README.md` before continuing unfinished non-trivial work.
- Update `WORKING_STATE.md` when the active task changes.
- Append to `SESSION_LOG.md` when ending a meaningful work session.
