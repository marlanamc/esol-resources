# Class Companion

A classroom companion for adult ESOL (English for Speakers of Other Languages) learners and their teachers. The app brings grammar guides, vocabulary practice, classroom games, assignments, and progress tracking into one mobile-friendly learning space.

Meaningful effort earns recognition: students receive points for practice and participation, with additional rewards for achievement. Reliable credit, clear feedback, and access to learning on a phone are core product requirements.

## For reviewers

Start with the [codebase tour](docs/CODEBASE_TOUR.md), then see [contributing](CONTRIBUTING.md) for checks and change conventions. The [documentation index](docs/README.md) separates implementation notes, classroom resources, audits, and planning.

This repository contains both the application and the teaching materials it supports. Curriculum files and printable handouts are intentional parts of the project.

## What the app does

- **Learners:** complete grammar, vocabulary, speaking, and writing activities; play practice games; follow assignments and course-map work; view feedback and progress.
- **Teachers:** manage classes and enrollment, assign activities, and review student work.
- **Practice rewards:** points, streaks, achievements, and class leaderboards, with safeguards against duplicate awards from retries.
- **Mobile access:** responsive layouts and an installable progressive web app. Offline submission queueing is controlled by a feature flag.

## Stack

Next.js 16 App Router · React · TypeScript · PostgreSQL · Prisma 6 · NextAuth · Tailwind CSS 4. Tests use Vitest, Node's test runner, and Playwright; GitHub Actions runs the CI checks. Exact dependency versions are recorded in [package-lock.json](package-lock.json).

## Local setup

Use Node.js 20.9 or newer (CI currently uses Node 20), npm, and a separate PostgreSQL development database. CI uses PostgreSQL 16. Use the committed npm lockfile for reproducible installs.

From a cloned checkout:

```bash
cp .env.example .env
```

Edit `.env` before proceeding:

| Variable | Local value |
| --- | --- |
| `DATABASE_URL` | Connection string for your development PostgreSQL database |
| `NEXTAUTH_URL` | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `DEV_SEED_ACCOUNT_PASSWORD` | A unique password for local seeded accounts |
| `TEST_STUDENT_DEFAULT_PASSWORD` | A unique password for system-created test accounts |

Additional integrations and feature flags are described in [.env.example](.env.example). Keep local credentials out of Git. An existing `.env.local` can override app settings from `.env`; ensure both point to the intended development services.

Install dependencies, apply committed migrations, and seed the development database:

```bash
npm ci
npm run ci:db:prepare
npm run db:seed
npm run db:seed:achievements
npm run db:seed:course-map
npm run dev
```

Open [localhost:3000](http://localhost:3000). The base seed creates the administrator account `marlie` and student accounts such as `ricardo`, using `DEV_SEED_ACCOUNT_PASSWORD` for newly created accounts. A password change is required at first login. Re-running the base seed preserves existing passwords.

These commands populate a development database; they are not a complete copy of the live classroom. Additional activity seeds are listed in [package.json](package.json) and the [scripts index](scripts/README.md).

## Quality checks

The standard pre-push check runs types, lint, Vitest coverage, and Node tests without migrating or seeding a database:

```bash
npm run check:push
npm run check:repo-hygiene
```

For individual checks:

```bash
npm run typecheck
npm run lint
npm test
```

Install the optional tracked pre-push hook with `npm run hooks:install`. Content audits are included in the test suite; `npm run test:content` runs just those checks.

**Builds write to the configured database.** `npm run build` generates Prisma, runs the migration wrapper, seeds course-map data, and builds Next.js. Use an isolated development/test database. The `health:*` gates that invoke a build also have these side effects.

Playwright expects a production build and seeded E2E accounts. On an isolated test database:

```bash
npm run test:e2e:install
npm run ci:e2e:setup
npm run build
npm run test:e2e:smoke
```

See [.github/workflows/ci.yml](.github/workflows/ci.yml) for the automated environment and [CONTRIBUTING.md](CONTRIBUTING.md) for review expectations.

## Repository map

| Path | Contents |
| --- | --- |
| [`src/app/`](src/app/) | App Router pages, layouts, and API handlers |
| [`src/components/`](src/components/) | Activity renderers, games, dashboards, and shared UI |
| [`src/lib/`](src/lib/) | Authentication, database access, progress, rewards, and domain logic |
| [`src/content/`](src/content/) | Authored learning content, including grammar guides |
| [`src/types/`](src/types/) | Shared TypeScript domain types |
| [`prisma/`](prisma/) | Database schema, migrations, and seeds |
| [`tests/`](tests/) | Unit, route, content, and browser tests |
| [`scripts/`](scripts/) | Content generation, audits, imports, and operational tools |
| [`public/`](public/) | Static assets and service worker |
| [`FY26/`](FY26/), [`FY27/`](FY27/) | Teaching resources organized by school year |
| [`docs/`](docs/) | Technical guides, curriculum planning, and review notes |

## Product and engineering references

- [Product context](PRODUCT.md) and [design system](DESIGN.md)
- [Authorization and class-scoping guardrails](docs/SECTIONS_AND_AUTH_GUARDRAILS.md)
- [Maintenance dashboard](docs/MAINTENANCE_DASHBOARD.md) and [refactoring roadmap](docs/planning/scalability-roadmap.md)
- [Student setup guide](docs/student/STUDENT_SETUP_AND_APP_GUIDE.md) and [Spanish version](docs/student/GUIA_ESTUDIANTE_CONFIGURACION_Y_APP.md)
- [Project working agreements](AGENTS.md) and [agent development reference](CLAUDE.md)

## Releases

Small changes are batched locally before release. Before a production deployment or promotion, fetch GitHub and verify the exact source includes the latest `origin/main`; then verify the live domain and record the deployed source commit. See [AGENTS.md](AGENTS.md) for the full release requirements and [deployment notes](docs/setup/DEPLOYMENT.md) for operational context.

## Usage

Free for educational use. Created by teachers, for teachers.
