# Database Backup and Recovery

This project now uses two backup layers:

1. Prisma-managed backups on the active Prisma Postgres database instance.
2. A daily GitHub Actions PostgreSQL dump uploaded to S3-compatible storage.

Prisma-managed backups remain the first recovery option for fast restores inside Prisma. The GitHub workflow is the independent off-platform copy.

## Active Database Resolution

The app intentionally prefers `DATABASE_URL` over `POSTGRES_URL`.

- `prisma.config.ts`
- `src/lib/prisma.ts`

That means:

- `DATABASE_URL` is the production override when Vercel/Prisma keeps `POSTGRES_URL` managed.
- `POSTGRES_URL` remains the fallback when `DATABASE_URL` is unset.

## Rotate to a Restored Prisma Database in Vercel

1. Restore or create the replacement Prisma Postgres database in the same Prisma project.
2. Copy the new direct PostgreSQL connection string.
3. In Vercel Project Settings, update `DATABASE_URL` to the restored database.
4. Redeploy the app so all runtimes pick up the new value.
5. Verify reads and writes against the new database.
6. In Prisma Console, open the new database instance and confirm the `Backups` tab is present and populating.

## GitHub Backup Workflow

The scheduled workflow lives at `.github/workflows/backup.yml`.

It does the following:

1. Installs PostgreSQL client tools.
2. Runs `pg_dump --format=custom --no-owner --no-privileges` against `BACKUP_DATABASE_URL`.
3. Packages the dump into an artifact, optionally encrypts it with AES-256-GCM, and writes a checksum plus JSON manifest.
4. Uploads the artifact set to the configured S3-compatible bucket.

### Required GitHub secrets

- `BACKUP_DATABASE_URL`
- `BACKUP_ENCRYPTION_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### Required GitHub variables

- `BACKUP_S3_BUCKET`
- `BACKUP_S3_REGION`
- `BACKUP_S3_ENDPOINT`
- `BACKUP_S3_PREFIX`

`BACKUP_DATABASE_URL` should be a direct PostgreSQL connection string for the production database, suitable for `pg_dump`.

## Run a Manual Backup

1. Open GitHub Actions.
2. Select the `Database Backup` workflow.
3. Use `Run workflow`.
4. Confirm the run uploads:
   - one `.dump` or `.dump.enc` file,
   - one `.sha256` file,
   - one `.manifest.json` file.

## Restore from the S3 Dump

1. Download the latest dump artifact set from S3-compatible storage.
2. If the dump is encrypted (`.enc`), decrypt it using `BACKUP_ENCRYPTION_KEY`.
3. Restore into a throwaway PostgreSQL database first:

```bash
pg_restore --clean --if-exists --no-owner --no-privileges --dbname "postgresql://USER:PASSWORD@HOST:5432/DBNAME" backup-YYYY-MM-DDTHH-MM-SSZ.dump
```

4. Validate schema, row counts, and a few representative user flows.
5. Only then restore into the target production replacement database if needed.

## Verify Prisma-Managed Backups

After any database replacement:

1. Open Prisma Console.
2. Select the new database instance.
3. Open `Backups`.
4. Confirm snapshots are appearing for the active instance.

Backups are tied to the active database instance, not inherited from the previous instance.

## Production Mutation Guard

Destructive maintenance scripts now refuse to run against production-like database hosts unless both of these are set:

- `ALLOW_PROD_DB_MUTATION=yes`
- `CONFIRM_DB_HOST=<exact database hostname>`

Example:

```bash
ALLOW_PROD_DB_MUTATION=yes CONFIRM_DB_HOST=db.example.com npx tsx prisma/seed-full-reset.ts
```

If either value is missing or incorrect, the script exits before touching data.
