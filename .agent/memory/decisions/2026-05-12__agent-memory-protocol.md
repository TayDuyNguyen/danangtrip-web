# Decision: Introduce Persistent Agent Memory Protocol

## Date
2026-05-12

## Context
The local `.agent` kit had useful rules and skills, but it did not strongly preserve "what was being worked on", "what changed recently", and "what the next AI session must read first". This made context loss likely across separate sessions.

## Options
1. Keep only skills and artifacts.
2. Add one short working-state file only.
3. Add a small memory protocol with current state, session log, handoff, and decision records.

## Chosen
Option 3.

## Why
- One file alone is too fragile.
- A small set of focused files is still lightweight but covers active state, history, handoff, and durable decisions.
- This fits the repo better than a heavier custom database or external memory mechanism.

## Consequences
- Future sessions should read memory files before starting non-trivial work.
- The memory system stays useful only if sessions keep it updated.
- Repository-specific decisions can now be traced more easily over time.
