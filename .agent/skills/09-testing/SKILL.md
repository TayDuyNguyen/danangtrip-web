---
name: 09-testing
description: Execute structured testing phases like a professional QA tester, from static gates to UI visual review, copy review, functional flows, edge cases, and regression. Use before handoff.
---

# Skill: 09-testing

## Overview

This skill runs a structured QA pass for the current web feature and produces a defensible release verdict.
It must catch both runtime failures and user-facing defects such as broken copy, visual drift, state issues, and browser warnings.

## When to Use

- When a feature is approaching handoff, review, push, or deploy.
- When testing must produce a structured verdict with evidence instead of ad hoc notes.
- When multiple validation phases need clear stop conditions.

## Process

1. Run static gates first and stop immediately on blocking failures.
2. If a working dev URL exists, execute UI visual review, copy review, functional flow testing, edge-case testing, and regression testing in order.
3. Review every major page section, not only the primary happy path.
4. Record passes, fails, skipped checks, and concrete evidence.
5. Produce a verdict that matches the actual gate outcomes.

## Required Input

- `.agent/rules/PROJECT_RULES.md`
- `.agent/rules/REPO_FACTS.md`
- `.agent/memory/WORKING_STATE.md`
- `.agent/memory/HANDOFF.md`
- the relevant analysis artifact from `01-screen-analysis`
- the interaction spec from `07-interactions`
- the auth review from `08-auth-permissions` when relevant
- `package.json`
- a working browser URL for runtime phases

## Dev Server Requirement

Provide URLs when activating this skill:

```text
Login URL:   http://localhost:3000/login
Feature URL: http://localhost:3000/tours
```

If no browser URL is available, browser-based phases must be reported as `NOT RUN` with a specific reason.

## Gate Logic

```text
Phase 1 must pass before Phase 2 starts.
Phase 2 must not have crash, blank-screen, or unusable-layout failures before Phase 3 starts.
Phase 3 happy path must pass before Phase 4 and Phase 5 start.
Phase 4 and Phase 5 contribute to the final verdict and residual risk summary.
```

Phase map:

- Phase 1: Static Gates
- Phase 2: UI Visual + Copy + Polish Review
- Phase 3: Functional Flows
- Phase 4: Edge Cases
- Phase 5: Regression

## Phase 1 - Static Gates [Blocking]

Run in order:

```bash
npm run lint
npm run typecheck
npm run check:routes
npm run build
npm run prepush:check
```

Required evidence format:

```text
PASS - lint: 0 errors, 0 warnings
PASS - typecheck: no errors
PASS - check:routes: all routes valid
PASS - build: completed successfully
PASS - prepush:check: all gates passed
```

If any command fails:

- stop immediately
- report the failing command
- report the relevant file and error summary
- mark the verdict as `NOT READY`

## Phase 2 - UI Visual, Copy, and Polish Review [Blocking for severe issues]

This phase must inspect the real page in the browser, not just source code.

### 2.1 Layout and Responsive Review

Check on at least:

- desktop
- tablet
- mobile

Validate:

- layout does not break
- text does not overflow or collapse incorrectly
- key controls remain visible and usable
- cards, drawers, filters, and sticky regions behave correctly
- spacing remains coherent across breakpoints

### 2.2 Loading, Empty, Error, and Disabled States

Check each visible section for:

- loading state
- empty state
- error state
- disabled state

Validate:

- skeletons preserve layout
- empty states are informative
- error states are actionable
- disabled controls look disabled and are actually non-interactive

### 2.3 UI Copy Review [Required]

Review every user-facing string on the page:

- page titles
- section headers
- CTA labels
- filter labels
- form labels
- helper text
- validation messages
- empty-state text
- error messages
- modal, dialog, or drawer copy
- pagination and sort labels

Catch:

- spelling mistakes
- grammar mistakes
- mojibake or broken encoding
- mixed-language copy
- placeholder text left in production UI
- missing translation keys rendered as raw paths
- inconsistent capitalization or terminology

### 2.4 Visual Polish Review [Required]

Inspect section by section for small but real UI defects:

- misalignment
- inconsistent spacing
- icon size mismatch
- incorrect badge or button height
- broken hover, focus, active, or disabled styles
- image stretching or clipping
- border, shadow, or radius drift from `DESIGN.md`
- weak contrast
- layering issues in modal, dropdown, drawer, or popover

Do not treat "no crash" as sufficient quality.

### 2.5 Section-by-Section Checklist

For each major section on the page, explicitly review:

- section header
- content block layout
- primary action area
- secondary action area
- loading state
- empty state
- error state
- responsive behavior

If the page has tabs, cards, dialogs, filters, carousels, or drawers, each of them must be checked separately.

### Phase 2 Severity Rules

Blocking Phase 2 issues:

- crash
- blank screen
- unusable layout
- hidden or inaccessible primary CTA
- severe overflow that breaks core usage
- missing translation keys in critical UI

Non-blocking but mandatory findings:

- minor spacing drift
- capitalization inconsistency
- icon or badge polish issues
- non-critical copy issues

## Phase 3 - Functional Flow Testing [Blocking]

The happy path for core actions must pass before moving on.

### 3.1 Search, Filter, Pagination, and Sort

Validate:

- search updates the data correctly
- filters apply correctly
- reset works correctly
- pagination updates the expected data
- sort order reflects the selected control
- URL state stays correct when the page uses URL-driven state

### 3.2 Forms and Primary Mutations

Where applicable, test:

- submit
- update
- delete
- retry flow
- toggle or preference changes

Validate:

- controls open the correct UI
- pending state appears immediately
- success feedback appears correctly
- persisted state is reflected correctly after mutation

### 3.3 Navigation and Links

Validate:

- visible links go to real routes
- locale-aware navigation stays correct
- back and forward behavior stays coherent
- route state remains consistent after refresh when expected

### 3.4 Micro-Interaction Review

Validate:

- button pending states
- confirmation flows
- retry actions
- focus return after modal close
- keyboard accessibility for key controls when applicable
- URL-synced controls stay visually in sync with actual URL state

If any core happy path fails, stop and mark the verdict as `NOT READY`.

## Phase 4 - Edge Case Testing

### 4.1 Boundary Values

Validate representative bounds:

- too short
- exact minimum
- exact maximum
- above maximum
- zero
- negative numbers where invalid
- empty optional values

### 4.2 Network and Error Simulation

Use DevTools or equivalent controls to simulate:

- timeout
- offline
- 4xx
- 5xx

Validate:

- UI exits loading state
- error presentation is understandable
- retry actions behave correctly
- raw backend internals are not exposed to users

### 4.3 Concurrent Actions

Validate:

- double-click does not submit twice
- rapid filter/search changes do not leave stale results on screen
- repeated user actions do not corrupt local state

### 4.4 SEO and Metadata Review

Where relevant, validate:

- page title
- meta description
- OG tags
- no duplicate core headings caused by implementation drift

### 4.5 Console and Warning Review

Check DevTools for:

- `console.error`
- repeated `console.warn`
- React key warnings
- hydration warnings
- runtime promise rejections
- resource-loading failures

Warnings that do not crash the app are still valid findings and must be recorded.

## Phase 5 - Regression Testing

### 5.1 i18n Regression

Validate:

- both `vi` and `en` render without raw key paths
- meaning stays consistent across locales
- destructive messages remain complete
- validation messages remain complete
- date, number, and currency labels stay aligned with the current locale

### 5.2 Auth Regression

Validate where relevant:

- protected routes redirect correctly
- login redirect flow remains correct
- session loss or token removal is handled correctly

### 5.3 Existing Page Regression

Validate nearby or related pages:

- related list/detail flows still work
- navigation still works
- no new console errors appear in adjacent pages

### 5.4 Translation Integrity Regression

Confirm:

- the same page remains semantically equivalent in both locales
- no locale renders incomplete warning, validation, or empty-state copy

## Output Document

Create:

- `.agent/artifacts/test-cases/YYYY-MM-DD__<feature-slug>__test-report.md`

The report must include:

1. Summary and verdict
2. Phase 1 findings
3. Phase 2 findings
4. Phase 3 findings
5. Phase 4 findings
6. Phase 5 findings
7. Copy and visual findings
8. Console and warning findings
9. Residual risks

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "Lint passed, so the page is fine." | Lint does not validate runtime UX, copy quality, or user flows. |
| "The happy path worked once, so the page is ready." | A ready page also needs edge-case handling, polish review, and regression coverage. |
| "Minor copy or alignment issues can wait." | User-facing polish defects are still quality defects and must be documented before handoff. |

## Red Flags

- Phase 2 is skipped entirely
- copy review is missing
- visual polish review is missing
- no console review is performed
- only static gates are reported
- verdict says `READY` while a core functional flow failed

## Verification

- Cross-check with `checklist.md`
- Confirm that all five phases are covered
- Confirm that copy findings and visual findings are explicitly present
- Confirm that early-stop conditions are respected when blocking failures occur
