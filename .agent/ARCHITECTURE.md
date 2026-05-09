# Antigravity Kit Architecture

> Local agent, skill, workflow, and validation inventory for this repository.

---

## Overview

The `.agent` directory is a local assistance layer for this repository. It provides:
- Specialist agent profiles in `.agent/agents`
- Reusable skills in `.agent/skills`
- Reusable workflows in `.agent/workflows`
- Repository rules in `.agent/rules`
- Validation scripts in `.agent/scripts` and skill `scripts/` folders

This file must describe what actually exists in the repository, not a generic template.

---

## Directory Structure

```text
.agent/
|-- ARCHITECTURE.md
|-- agents/
|-- skills/
|-- workflows/
|-- rules/
|-- scripts/
`-- .shared/
```

---

## Agents

Current agent files under `.agent/agents`:

| Agent | Focus |
| --- | --- |
| `backend-specialist` | API and business logic work |
| `code-archaeologist` | Legacy understanding and refactor review |
| `database-architect` | Schema and persistence design |
| `debugger` | Root-cause analysis |
| `devops-engineer` | Delivery and infrastructure guidance |
| `documentation-writer` | Docs and written guidance |
| `explorer-agent` | Codebase exploration |
| `frontend-specialist` | UI and frontend implementation |
| `game-developer` | Game-specific work |
| `mobile-developer` | Mobile-specific work |
| `orchestrator` | Coordination and routing |
| `penetration-tester` | Offensive security perspective |
| `performance-optimizer` | Performance and profiling |
| `product-manager` | Requirement shaping |
| `product-owner` | Product scope and prioritization |
| `project-planner` | Planning and task structuring |
| `qa-automation-engineer` | QA automation |
| `security-auditor` | Security review |
| `seo-specialist` | SEO and discoverability |
| `test-engineer` | Testing strategy and validation |

---

## Skills

Only reference skills that exist under `.agent/skills`.

### Screen Development Pipeline (A→Z)

These 10 skills form a complete pipeline for developing any screen from analysis to deployment.
Run in order. See `skills/STACK_SKILLS_INDEX.md` for activation prompts.

| # | Skill | Persona | Purpose |
|---|-------|---------|---------|
| 01 | `01-screen-analysis` | Business Analyst | Analyze screen from PRD/Figma → output checklist |
| 02 | `02-project-setup` | DevOps Engineer | Setup/audit project base (run once) |
| 03 | `03-types-api-contract` | System Architect | Define TS interfaces, Zod schemas, API services |
| 04 | `04-layout-routing` | SSE | Create routes, layouts, Server/Client boundaries |
| 05 | `05-ui-components` | UI/UX + SSE | Build UI components (Atomic Design from Figma) |
| 06 | `06-data-integration` | SSE | Wire API to UI, handle loading/error/empty states |
| 07 | `07-interactions` | SSE | CRUD, forms, filter/search/sort/pagination |
| 08 | `08-auth-permissions` | Security Expert | Auth middleware, role-based UI, token management |
| 09 | `09-testing` | QA/QC Engineer | Unit tests + E2E tests, coverage > 80% |
| 10 | `10-optimization-deploy` | Perf + DevOps | Optimize, build, deploy, smoke test |

### Legacy SDLC Skills

| Skill | Purpose |
| --- | --- |
| `stack-analyze` | Business analysis → SRS |
| `stack-design` | Technical design docs |
| `sdlc-srs` | SRS (repo-aligned) |
| `sdlc-architecture` | Architecture + API contract |
| `sdlc-implementation` | Feature implementation |
| `sdlc-qa-testcases` | Test plan + test cases |
| `sdlc-security-audit` | Threat model + security review |

---

## Workflows

Current workflow files under `.agent/workflows`:

| Workflow | Purpose |
| --- | --- |
| `brainstorm.md` | Discovery flow |
| `create.md` | Creation flow |
| `debug.md` | Debug flow |
| `deploy.md` | Deployment flow |
| `enhance.md` | Improvement flow |
| `orchestrate.md` | Coordination flow |
| `plan.md` | Planning flow |
| `preview.md` | Preview flow |
| `status.md` | Status flow |
| `test.md` | Testing flow |
| `ui-ux-pro-max.md` | UI/UX-heavy workflow |

---

## Validation Scripts

### Repository-Level Scripts

| Script | Purpose |
| --- | --- |
| `.agent/scripts/checklist.py` | Priority-based validation orchestration |
| `.agent/scripts/verify_all.py` | Broader validation suite |

### Common Skill-Level Scripts Used in This Repo

| Script | Purpose |
| --- | --- |
| `.agent/skills/i18n-localization/scripts/i18n_checker.py` | Locale consistency and hardcoded-string audit |
| `.agent/skills/frontend-design/scripts/ux_audit.py` | UX-focused audit |
| `.agent/skills/frontend-design/scripts/accessibility_checker.py` | Accessibility audit |
| `.agent/skills/lint-and-validate/scripts/lint_runner.py` | Lint runner |
| `.agent/skills/lint-and-validate/scripts/type_coverage.py` | Type coverage helper |
| `.agent/skills/testing-patterns/scripts/test_runner.py` | Test runner helper |
| `.agent/skills/webapp-testing/scripts/playwright_runner.py` | Playwright-based web checks |
| `.agent/skills/vulnerability-scanner/scripts/security_scan.py` | Security scan |
| `.agent/skills/database-design/scripts/schema_validator.py` | Schema validation |
| `.agent/skills/performance-profiling/scripts/lighthouse_audit.py` | Lighthouse audit |

Important:
- Some orchestration docs historically referenced scripts that do not exist.
- When documenting validation, only cite scripts present in the repository.

---

## Operating Rules

When using `.agent` assets:
- Read the specific `SKILL.md` before substantial implementation.
- Prefer repository-specific rules over generic templates.
- Do not cite missing skills, scripts, or workflows.
- Keep documentation synchronized when skills or scripts are added or removed.

---

## Maintenance Contract

Update this file whenever any of the following changes:
- a skill is added, removed, or renamed
- an agent is added, removed, or renamed
- a workflow is added, removed, or renamed
- a validation script is added, removed, or renamed
- repository guidance changes enough to invalidate descriptions here

If this file drifts from the actual `.agent` contents, fix the file first.
