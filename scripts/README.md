# Scripts index

Operational scripts for seeding, imports, audits, and content generation. Invoked via `npm run …` in [`package.json`](../package.json) — prefer those aliases over calling files directly.

## Layout

| Folder | Purpose |
|--------|---------|
| [`checks/`](checks/) | CI audits, hygiene, maintenance reports, answer-position bias |
| [`import/`](import/) | Game/quiz import & sync (`import:*`, `delete:verb-quizzes`) |
| [`content/`](content/) | Audio/image generation, vocab curation (`audio:*`, `vocab:images`, `content:*`) |
| [`vocab/`](vocab/) | Weekly vocab seed, review sync, duplicate checks |
| [`db/`](db/) | Safe backup/export/package |
| [`grammar/`](grammar/) | One-off grammar guide maintenance (release flags, dedupe) |
| [`quizzes/`](quizzes/) | Quiz backfills, class-objectives sync |
| [`activities/`](activities/) | Speaking activity backfills, UI metadata |
| [`maintenance/`](maintenance/) | Password resets, course-map export, style migrations |
| [`migrations/`](migrations/) | Legacy data migration helpers |
| [`audio/`](audio/) | Upload `public/audio` to Vercel Blob |
| [`diagnostics/`](diagnostics/) | Ad-hoc diagnostic scripts |
| [`planning/`](planning/) | Summer wiki build |
| [`lib/`](lib/) | Shared helpers for scripts |
| [`data/`](data/) | Static data inputs for scripts |

## Root-level scripts

| File | npm alias |
|------|-----------|
| `check-env.mjs` | (prebuild) |
| `check-repo-hygiene.mjs` | `check:repo-hygiene` |
| `migrate-deploy.mjs` | (build / `db:migrate`) |
| `sync-gerund-csv.ts` | `sync:gerund-csv`, `sync:gerund-csv:check` |
| `sync-pos-frequency-corpus.ts` | `sync:pos-frequency-corpus` |
| `sync-course-map-order.ts` | `db:sync:course-map-order` |
| `e2e-seed.ts` | `ci:e2e:setup` |

## Database seeds (`prisma/`)

Most `db:seed:*` commands run `npx tsx prisma/seed-*.ts` — see `package.json` and [`../CLAUDE.md`](../CLAUDE.md).

## Conventions

- TypeScript scripts: run with `npx tsx` or `node --import tsx`
- Generated outputs → `tmp/` or `docs/audits/` (see [`../docs/audits/README.md`](../docs/audits/README.md))
- Do not commit `__pycache__/`, local DB files, or audit report outputs
