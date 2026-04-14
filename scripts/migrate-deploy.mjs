#!/usr/bin/env node
/**
 * Resilient wrapper around `prisma migrate deploy` that auto-resolves
 * migrations whose DDL was already applied to the database (e.g. via
 * `prisma db push`) but not tracked in _prisma_migrations.
 *
 * Used in the Vercel build step so a single out-of-sync migration
 * doesn't block every subsequent deploy.
 */

import { execSync } from "node:child_process";

const MAX_RETRIES = 5;

function run(cmd) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf-8" });
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

      // Match: "Migration name: 20260402000000_add_writing_session"
      const nameMatch = combined.match(/Migration name:\s*(\S+)/);
      // Match: "already exists" type errors (42P07 = duplicate_table, 42710 = duplicate_object)
      const isAlreadyExists =
        combined.includes("already exists") ||
        combined.includes("42P07") ||
        combined.includes("42710");

      if (nameMatch && isAlreadyExists && attempt < MAX_RETRIES) {
        const migrationName = nameMatch[1];
        console.log(
          `\n⚠️  Migration "${migrationName}" failed because objects already exist.`
        );
        console.log(`   Marking as applied and retrying (attempt ${attempt}/${MAX_RETRIES})...\n`);
        try {
          run(
            `npx prisma migrate resolve --applied ${migrationName}`
          );
        } catch (resolveErr) {
          console.error(
            "Failed to resolve migration:",
            resolveErr.stderr || resolveErr.message
          );
          process.exit(1);
        }
        continue;
      }

      // Unrecoverable error
      process.stderr.write(combined);
      process.exit(1);
    }
  }

  console.error("Exhausted retry attempts for prisma migrate deploy");
  process.exit(1);
}

migrateDeployOrResolve();
