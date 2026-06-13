# class-companion-guardrails

A repo-local Claude Code plugin for **Class Companion**, built with the `plugin-dev` toolkit.

## What it does

Ships one deterministic, **non-blocking** `PostToolUse` hook (`Edit|Write`) that guards the
project's #1 gamification rule from CLAUDE.md:

> Always award through `PointsLedger` + `awardPoints()`; prevent duplicate grants.

After you edit a points-critical file, the hook warns (it never blocks) when it detects:

1. **Bypass** — a direct `points` / `weeklyPoints` / `currentStreak` / `longestStreak`
   write *outside* `src/lib/gamification/`. These skip `awardPoints()`, so the points
   never reach `PointsLedger`.
2. **Unguarded ledger insert** — a `pointsLedger.create` with no visible dedupe guard
   (`findFirst` / `findUnique` / `existing`), which risks double-awards.

"Points-critical" = anything under `src/lib/gamification/`, or an
`src/app/api/**/route.ts` that references the points machinery. All other edits are
ignored, so clean work has zero friction. The hook is a plain bash + `jq` script —
**no LLM call, $0 runtime cost**.

## Enable

Primary (as a real plugin):

```bash
claude plugin marketplace add ./tools/claude-plugins
claude plugin install class-companion-guardrails@class-companion-local
```

Fallback (no marketplace) — point `.claude/settings.json` `hooks.PostToolUse` at
`tools/claude-plugins/class-companion-guardrails/hooks/guard-gamification.sh`.

## Test

Validated with `plugin-dev`'s own utilities (`validate-hook-schema.sh`,
`hook-linter.sh`, `test-hook.sh`). See `fixtures/` for sample hook inputs.
