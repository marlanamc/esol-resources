#!/usr/bin/env node
/**
 * Apply pending migrations and stop on failure.
 *
 * A failed migration (including P3009 or an "already exists" error) may have
 * applied only some statements. Never mark it applied from error text alone.
 * Repair and reconcile the schema explicitly before retrying the build.
 */
import { execFileSync } from "node:child_process";

try {
  const output = execFileSync("npx", ["prisma", "migrate", "deploy"], {
    stdio: "pipe",
    encoding: "utf8",
  });
  process.stdout.write(output);
} catch (error) {
  if (error.stdout) process.stdout.write(error.stdout);
  if (error.stderr) process.stderr.write(error.stderr);
  process.stderr.write(
    "\nMigration deployment failed. Inspect the database and migration history before retrying. " +
    "No migration was automatically marked as applied.\n"
  );
  process.exitCode = Number.isInteger(error.status) && error.status > 0 ? error.status : 1;
}
