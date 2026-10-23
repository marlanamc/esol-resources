# Codebase tour

Class Companion combines a classroom web application with authored ESOL curriculum and printable teaching resources. This guide is a reading order for engineers new to the repository.

## Suggested reading order

| Start here | What to look for |
| --- | --- |
| [`../PRODUCT.md`](../PRODUCT.md) | Product context and learner needs |
| [`../prisma/schema.prisma`](../prisma/schema.prisma) | Users, classes, activities, submissions, progress, and rewards |
| [`../src/app/`](../src/app/) | Pages and HTTP entry points |
| [`../src/components/renderers/ActivityRenderer.tsx`](../src/components/renderers/ActivityRenderer.tsx) | Selection and loading of activity UIs |
| [`../src/lib/auth/`](../src/lib/auth/) | Session configuration, roles, and access policies |
| [`../src/lib/activity/progress/`](../src/lib/activity/progress/) | Progress reads, updates, completion, and point awards |
| [`../src/lib/gamification/`](../src/lib/gamification/) | Reward calculation, award orchestration, and leaderboard periods |
| [`../tests/`](../tests/) | Behavioral examples and regression coverage |

## Follow an activity through the system

The UI renders an activity using domain components. Progress and submission requests reach App Router handlers under `src/app/api/activity/`. The progress route delegates to modules in `src/lib/activity/progress/`; the submission route coordinates grading and submission awards. Both paths deserve attention when reviewing completion and reward behavior.

Shared database access lives in [`src/lib/database/`](../src/lib/database/). The submission path uses scope locks and award-claim helpers to address concurrent requests and retries. Review the matching activity and gamification tests alongside these paths rather than treating score calculation alone as the complete reward system.

For access boundaries, read [SECTIONS_AND_AUTH_GUARDRAILS.md](SECTIONS_AND_AUTH_GUARDRAILS.md). A valid login is only the first check: class membership, assignment scope, and learner visibility also matter.

## Content and classroom resources

Grammar guides are authored in `src/content/grammar/` and seeded into PostgreSQL. The existing [refactoring roadmap](planning/scalability-roadmap.md) identifies this dual representation as an area to simplify. Treat planning documents as proposals or dated review notes; verify current behavior in code and tests.

`FY26/` and `FY27/` contain classroom materials, while `docs/planning/` contains curriculum plans and research. These coexist with the app intentionally. See the [documentation index](README.md) for feature guides and the [scripts index](../scripts/README.md) for content tooling.

## Useful review questions

- Are authorization and class-scoping rules applied consistently across routes?
- Do completion and reward updates remain correct under retries and concurrent requests?
- Where would shared game or data-fetching primitives reduce repeated logic?
- How should authored content and database content stay synchronized?
- Which behaviors need stronger integration or browser coverage?

The project already has a [maintenance dashboard](MAINTENANCE_DASHBOARD.md) and [refactoring roadmap](planning/scalability-roadmap.md). Use these as context for prioritizing improvements, not as evidence that every proposed change has been implemented.

## Validation boundaries

Vitest and Node tests cover selected domain logic, route behavior, and content rules. Playwright provides browser smoke tests; this is not exhaustive end-to-end coverage. Coverage thresholds and exclusions are visible in [`vitest.config.ts`](../vitest.config.ts).

The build is operational: it runs migrations and seeds course-map data before compiling the app. Read the commands in [`package.json`](../package.json) before running maintenance or build scripts against any configured database. Local setup and isolated browser-test setup are documented in the [README](../README.md).
