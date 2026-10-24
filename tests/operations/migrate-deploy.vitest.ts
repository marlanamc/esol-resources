import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const dirs: string[] = [];
afterEach(() => { for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true }); });
function runMigration(error: string | null) {
  const dir = mkdtempSync(join(tmpdir(), 'migration-audit-')); dirs.push(dir);
  const calls = join(dir, 'calls.jsonl');
  // Substitute only the executable. Exercise the actual build wrapper without a DB.
  writeFileSync(join(dir, 'npx'), `#!${process.execPath}\n` +
    `require('node:fs').appendFileSync(${JSON.stringify(calls)}, JSON.stringify(process.argv.slice(2))+'\\n');\n` +
    (error ? `process.stderr.write(${JSON.stringify(error)}); process.exit(17);` : `process.stdout.write('Migration applied\\n');`), { mode: 0o755 });
  const result = spawnSync(process.execPath, [resolve('scripts/migrate-deploy.mjs')], {
    env: { ...process.env, PATH: dir }, encoding: 'utf8',
  });
  return { ...result, calls: readFileSync(calls, 'utf8').trim().split('\n').map(line => JSON.parse(line)) };
}

describe('migration build gate', () => {
  it('runs one deployment and preserves success', () => {
    const result = runMigration(null);
    expect(result.status).toBe(0); expect(result.stdout).toContain('Migration applied');
    expect(result.calls).toEqual([['prisma', 'migrate', 'deploy']]);
  });
  it.each([
    'P3009 The `20261001_partial` migration started at yesterday and failed',
    'P3018 Migration name: 20261001_partial\nERROR 42P07 relation already exists',
    'P3018 Migration name: 20261001_partial\nERROR 42710 type already exists',
    'Database unreachable',
  ])('stops without resolving or hiding failed migration: %s', error => {
    const result = runMigration(error);
    expect(result.status).toBe(17); expect(result.stderr).toContain(error);
    expect(result.stderr).toContain('No migration was automatically marked as applied');
    expect(result.calls).toEqual([['prisma', 'migrate', 'deploy']]);
  });
});
