# Contributing

Start with the [README](README.md) for local setup and the [codebase tour](docs/CODEBASE_TOUR.md) for navigation. [AGENTS.md](AGENTS.md) records the project's standing requirements.

## Making a change

1. Use a focused branch and keep unrelated classroom materials or local work out of the diff.
2. Follow the surrounding code's conventions. Keep business logic in the relevant `src/lib/` domain and UI in `src/components/` or the route that owns it.
3. Add regression coverage when changing behavior, especially authentication, class access, grading, completion, and points. Documentation-only edits need link and accuracy checks rather than new application tests.
4. Run the relevant checks and describe what changed, why, and how it was verified in the pull request.

Use npm and retain the lockfile. Do not mix a broad formatting pass with a behavior change. Generated content should be updated through its documented script; see [scripts/README.md](scripts/README.md).

## Student credit is part of correctness

For activity changes, verify that meaningful effort earns points, the award is persisted to the student's balance and ledger, and the student sees confirmation. Accuracy bonuses may supplement effort credit. Technical retries must not award twice, while genuine new practice should follow the activity's repeat-practice rules.

Missing credit for confirmed completed work is a bug. Preserve completion evidence and reconcile awards without duplicating credit already received.

## Validation

```bash
npm run check:push
npm run check:repo-hygiene
```

The pre-push gate includes type checking, lint, Vitest coverage, and Node tests. Use `npm run test:critical` for a focused iteration on auth, classes, activities, and rewards; it does not replace the full gate.

For UI or integration changes, also run the appropriate browser tests against an isolated test database. Setup instructions are in the [README](README.md). Report checks that were skipped and why.

`npm run build` runs migrations and seeds course-map data. `health:gate`, `health:weekly`, and `health:release` also invoke a build. Check the database target before using them. Database reset, recovery, and import scripts are operational tools, not routine test commands.

## Repository hygiene

Keep secrets, database snapshots, student exports, generated test reports, and local editor backups out of commits. Use `.env.example` to document configuration without real credentials. Preserve authored teaching resources; use the documented output locations for generated artifacts.

Avoid moving files solely for appearance when imports, scripts, or teaching links depend on their paths. Update references whenever a move is necessary.

## Release discipline

Batch small changes for review. A push to the production branch may trigger a deployment. Follow the fresh-fetch, source verification, and live-domain verification requirements in [AGENTS.md](AGENTS.md) before releasing.
