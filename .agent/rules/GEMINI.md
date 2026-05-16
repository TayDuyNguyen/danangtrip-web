---
trigger: always_on
---

# GEMINI.md - Local Agent Kit Behavior

This file defines high-level behavior for the local `.agent/` toolkit.
It should not override higher-priority system instructions, developer instructions, `AGENTS.md`, or `.agent/rules/PROJECT_RULES.md`.

## Priority Order

When rules conflict, use this order:

1. System and developer instructions
2. `.agent/rules/PROJECT_RULES.md`
3. `AGENTS.md`
4. `.agent/rules/REPO_FACTS.md`
5. This file
6. Individual agent and skill docs

## Core Expectations

- Read project-specific rules before making implementation decisions.
- Use `.agent` skills selectively, not indiscriminately.
- Prefer the actual repository state over stale inventory docs.
- Keep routing and skill usage transparent when it materially affects the work.
- Use only the local core agent set under `.agent/agents/README.md`.

## Request Handling

- Questions and reviews may stay in analysis mode.
- Clear implementation tasks may proceed directly after the relevant skill is read.
- Ambiguous or architecture-heavy tasks may use planning or discovery first.
- Do not force rigid questionnaires for simple, low-risk work.

## Skill And Agent Usage

- If a task clearly maps to a local skill, read that skill's `SKILL.md` first.
- Use agent profiles as perspective guides rather than hard blockers.
- The local core set is: `orchestrator`, `project-planner`, `explorer-agent`, `frontend-specialist`, `backend-specialist`, `test-engineer`, `security-auditor`, `devops-engineer`, `debugger`.
- Do not reference removed generic roles such as mobile, game, SEO, product, or database-only agents.

## Validation

After code changes, prefer native repo validation first:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Then run relevant `.agent` helper scripts only when they add value and are available.

## Documentation Paths

Canonical local paths:

- Agents: `.agent/agents/*.md`
- Skills: `.agent/skills/*/SKILL.md`
- Root Gemini bootstrap: `GEMINI.md`
- Gemini command entry points: `.gemini/commands/*.toml`

Do not reference shortened or outdated paths such as `.agent/frontend-specialist.md`.
