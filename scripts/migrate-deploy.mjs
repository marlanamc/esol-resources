#!/usr/bin/env node
/**
 * Resilient wrapper around `prisma migrate deploy` that auto-resolves
 * migrations whose DDL was already applied to the database (e.g. via
 * `prisma db push`) but not tracked in _prisma_migrations.
 *
 * Handles two Prisma error codes:
 *  - P3018: migration failed to apply (objects already exist in DB)
 *  - P3009: previously failed migration blocking new migrations
 *
 * Used in the Vercel build step so a single out-of-sync migration
 * doesn't block every subsequent deploy.
 */

import { execSync } from "node:child_process";

const MAX_RETRIES = 8;

function run(cmd) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf-8" });
}

function extractMigrationName(output) {
  // "Migration name: 20260402000000_add_writing_session"
  const nameMatch = output.match(/Migration name:\s*(\S+)/);
  if (nameMatch) return nameMatch[1];

  // "The `20260402000000_add_writing_session` migration started at ..."
  const backtickMatch = output.match(/The `(\S+?)` migration/);
  if (backtickMatch) return backtickMatch[1];

  return null;
}

function migrateDeployOrResolve() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const output = run("npx prisma migrate deploy");
      process.stdout.write(output);
      return;
    } catch (err) {
      const stderr = err.stderr || "";
      const stdout = err.stdout || "";
      const combined = stderr + stdout;
      const migrationName = extractMigrationName(combined);

      // P3009: a previously failed migration is blocking new migrations
      const isFailedMigrationBlocking =
        combined.includes("P3009") ||
        combined.includes("failed migrations in the target database");

      // P3018: migration DDL failed because objects already exist
      const isAlreadyExists =
        combined.includes("already exists") ||
        combined.includes("42P07") ||
        combined.includes("42710");

      if (migrationName && isFailedMigrationBlocking && attempt < MAX_RETRIES) {
        console.log(
          `\n⚠️  Migration "${migrationName}" is in failed state (P3009).`
        );
        console.log(
          `   Rolling back record and marking as applied (attempt ${attempt}/${MAX_RETRIES})...\n`
        );
        try {
          run(`npx prisma migrate resolve --rolled-back ${migrationName}`);
          run(`npx prisma migrate resolve --applied ${migrationName}`);
        } catch (resolveErr) {
          console.error(
            "Failed to resolve migration:",
            resolveErr.stderr || resolveErr.message
          );
          process.exit(1);
        }
        continue;
      }

      if (migrationName && isAlreadyExists && attempt < MAX_RETRIES) {
        console.log(
          `\n⚠️  Migration "${migrationName}" failed because objects already exist (P3018).`
        );
        console.log(
          `   Marking as applied and retrying (attempt ${attempt}/${MAX_RETRIES})...\n`
        );
        try {
          run(`npx prisma migrate resolve --applied ${migrationName}`);
        } catch (resolveErr) {
          console.error(
            "Failed to resolve migration:",
            resolveErr.stderr || resolveErr.message
          );
          process.exit(1);
        }
        continue;
      }

      // Unrecoverable error — print output and fail
      process.stderr.write(combined);
      process.exit(1);
    }
  }

  console.error("Exhausted retry attempts for prisma migrate deploy");
  process.exit(1);
}

migrateDeployOrResolve();
