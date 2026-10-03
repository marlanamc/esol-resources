import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

// Run the same read-only checks as the CLI/CI against real repository content.
// Separate cases show every failure instead of stopping at the first audit.
const checks = [
    {
        name: "generated gerund CSV matches its source",
        command: "npm run sync:gerund-csv:check",
        args: ["--import", "tsx", "scripts/sync-gerund-csv.ts", "--check"],
    },
    {
        name: "weekly vocabulary has no unacknowledged duplicates",
        command: "npm run check:vocab-duplicates",
        args: ["--import", "tsx", "scripts/vocab/check-vocab-duplicates.js"],
    },
    {
        name: "mini guides satisfy course-map and content requirements",
        command: "npm run audit:mini-guides",
        args: ["--import", "tsx", "scripts/checks/audit-mini-guides.ts"],
    },
    {
        name: "correct-answer positions stay within the audit limits",
        command: "npm run audit:answer-position",
        args: ["scripts/checks/audit-answer-position-bias.js"],
    },
];

describe("Repository content checks", () => {
    for (const check of checks) {
        it(check.name, () => {
            const result = spawnSync(process.execPath, check.args, {
                cwd: repoRoot,
                encoding: "utf8",
                timeout: 60_000,
                maxBuffer: 10 * 1024 * 1024,
            });
            const diagnostics = [
                `Reproduce with: ${check.command}`,
                result.error?.message,
                result.signal && `Terminated by ${result.signal}`,
                result.stdout,
                result.stderr,
            ].filter(Boolean).join("\n");

            expect(result.status, diagnostics).toBe(0);
        }, 65_000);
    }
});
