# Maintenance Dashboard

Refresh this snapshot with:

```bash
npm run report:maintenance
```

## Current Baseline

Last updated: 2026-03-26

- Health gate status: green
- `typecheck`: passing
- `lint`: passing with `0` warnings
- `test:vitest`: passing with `86` passing tests and `0` failures
- `check:generated`: passing
- `build`: passing

## Current Drift Targets

- `@/lib/auth`: `111` imports still use the compatibility wrapper
- `@/lib/prisma`: `107` imports still use the compatibility wrapper
- `@/lib/gamification`: `13` imports still use the compatibility wrapper
- Next cleanup candidate: `@/lib/auth`

## Default Health Gate

Run these before any meaningful merge:

```bash
npm run typecheck
npm run lint
npm run test:vitest
npm run check:generated
npm run build
```

## Debt Buckets

Use these labels or categories when tracking work:

- `stability`
- `cleanup`
- `test-gap`
- `performance`
- `content-sync`

## Weekly Cadence

- Run `npm run health:weekly`
- Review failures first, then warning count and wrapper-import drift
- Spend 20-30 minutes on flakiness, warnings, and one small cleanup

## Monthly Cadence

- Run `npm run health:monthly`
- Use the top wrapper-import target as the default cleanup candidate
- Keep cleanup contained to one subsystem at a time

## Release Cadence

- Run `npm run health:release` before major releases
- Do not deploy around red CI
- If the release changes user-critical flows, include the smoke suite

## Backups

If production data matters, schedule and review:

```bash
npm run db:backup:safe
npm run db:backup:check
```

The repo includes backup scripts, but scheduling them still depends on where production credentials live.
