# .agent setup for danangtrip-web

This folder is the operational workspace for AI agents in this project.

## Required structure

```text
.agent/
|-- config/
|   |-- settings.json
|   `-- tools.yaml
|-- personas/
|   |-- business-analyst.md
|   |-- system-architect.md
|   |-- senior-software-engineer.md
|   |-- qa-qc-engineer.md
|   |-- project-manager.md
|   |-- ui-ux-designer.md
|   `-- security-expert.md
|-- skills/
|   |-- sdlc-architecture/
|   |-- sdlc-implementation/
|   `-- sdlc-qa-testcases/
|   |-- sdlc-security-audit/
|   `-- sdlc-srs/
|   |-- stack-analyze/
|   |-- stack-design/
|-- memory/
|   |-- project-map.md
|   |-- decisions/
|   `-- knowledge/
`-- runtime/
    |-- sessions/
    `-- traces/
```

## Notes

- `personas/` is a lightweight routing layer for SDLC roles (each persona has one primary responsibility).
- `memory/decisions/` stores architectural decisions in ADR-like files.
- `runtime/` is ephemeral state and should not keep sensitive data.
- Existing folders like `agents/`, `rules/`, `workflows/`, and `scripts/` remain valid.
