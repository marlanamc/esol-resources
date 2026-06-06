#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
    formatAuditReport,
    formatConsoleSummary,
    runMiniGuidesAudit,
} from "@/lib/grammar-guide-audit";

const ROOT = process.cwd();
const DEFAULT_REPORT_PATH = path.join(
    ROOT,
    "docs/audits/mini-guides-w1-w18-review.md",
);
const DEFAULT_FINDINGS_DIR = path.join(ROOT, "tmp/mini-guides-audit");
const DEFAULT_FINDINGS_PATH = path.join(DEFAULT_FINDINGS_DIR, "findings.json");

function parseWeekFlag(argv: string[], flag: string, fallback: number): number {
    const index = argv.indexOf(flag);
    if (index === -1 || index + 1 >= argv.length) {
        return fallback;
    }
    const value = Number.parseInt(argv[index + 1]!, 10);
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

async function main() {
    const argv = process.argv.slice(2);
    const args = new Set(argv.filter((arg) => arg.startsWith("--")));
    const writeReport = args.has("--report");
    const strict = args.has("--strict");

    const minWeek = parseWeekFlag(argv, "--min-week", 1);
    const maxWeek = parseWeekFlag(argv, "--max-week", 18);

    const result = await runMiniGuidesAudit({ minWeek, maxWeek });
    const weekLabel =
        minWeek === 1 && maxWeek === 18
            ? "Weeks 1–18"
            : `Weeks ${minWeek}–${maxWeek}`;

    console.log(formatConsoleSummary(result, weekLabel));

    if (result.errorCount > 0 || result.warningCount > 0) {
        console.log("");
        for (const finding of result.findings.slice(0, 40)) {
            console.log(
                `[${finding.severity.toUpperCase()}] ${finding.slug} :: ${finding.ruleId} — ${finding.message}`,
            );
        }
        if (result.findings.length > 40) {
            console.log(`... and ${result.findings.length - 40} more (use --report for full list)`);
        }
    }

    await mkdir(DEFAULT_FINDINGS_DIR, { recursive: true });
    await writeFile(DEFAULT_FINDINGS_PATH, JSON.stringify(result, null, 2), "utf8");
    console.log(`\nFindings JSON: ${DEFAULT_FINDINGS_PATH}`);

    if (writeReport) {
        const reportPath =
            minWeek === 1 && maxWeek === 18
                ? DEFAULT_REPORT_PATH
                : path.join(
                      ROOT,
                      `docs/audits/mini-guides-w${minWeek}-w${maxWeek}-review.md`,
                  );
        const markdown = formatAuditReport(result);
        await mkdir(path.dirname(reportPath), { recursive: true });
        await writeFile(reportPath, markdown, "utf8");
        console.log(`Review report: ${reportPath}`);
    }

    const shouldFail =
        result.errorCount > 0 || (strict && result.warningCount > 0);

    if (shouldFail) {
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
