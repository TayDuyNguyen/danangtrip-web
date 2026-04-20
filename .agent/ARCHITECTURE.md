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

### Application Architecture

| Skill | Purpose |
| --- | --- |
| `architecture` | System design patterns and trade-offs |
| `app-builder` | Application scaffolding and creation flows |
| `nextjs-project-rules` | Repository-specific Next.js operating rules |
| `nextjs-react-expert` | Next.js and React implementation guidance |

### Frontend and UX

| Skill | Purpose |
| --- | --- |
| `frontend-design` | UI and UX guidance |
| `tailwind-patterns` | Tailwind CSS patterns |
| `web-design-guidelines` | Web UI review heuristics |
| `i18n-localization` | Translation and locale consistency |

### Backend and Platform

| Skill | Purpose |
| --- | --- |
| `api-patterns` | API design and service patterns |
| `nodejs-best-practices` | Node.js implementation practices |
| `database-design` | Database and schema design |
| `server-management` | Server and environment management |
| `deployment-procedures` | Delivery and deployment practices |

### Quality and Validation

| Skill | Purpose |
| --- | --- |
| `clean-code` | Clean-code rules and editing discipline |
| `code-review-checklist` | Review heuristics |
| `lint-and-validate` | Validation helpers |
| `testing-patterns` | Automated testing patterns |
| `tdd-workflow` | Test-driven workflow guidance |
| `webapp-testing` | Browser and E2E testing |
| `systematic-debugging` | Structured debugging |
| `performance-profiling` | Performance analysis |
| `vulnerability-scanner` | Security scanning |
| `red-team-tactics` | Offensive-security mindset |
| `seo-fundamentals` | SEO checks |
| `geo-fundamentals` | GEO and AI-citation checks |

### Planning and Coordination

| Skill | Purpose |
| --- | --- |
| `brainstorming` | Discovery and questioning |
| `plan-writing` | Plans and task breakdowns |
| `parallel-agents` | Agent coordination patterns |
| `behavioral-modes` | Mode guidance |
| `intelligent-routing` | Routing requests to suitable expertise |
| `documentation-templates` | Documentation structure |
| `mcp-builder` | MCP-related guidance |

### Environment and Language Specific

| Skill | Purpose |
| --- | --- |
| `powershell-windows` | Windows shell guidance |
| `bash-linux` | Linux shell guidance |
| `python-patterns` | Python implementation practices |
| `rust-pro` | Rust guidance |
| `mobile-design` | Mobile UI and product guidance |
| `game-development` | Game development guidance |

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
