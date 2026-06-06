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

async function main() {
    const args = new Set(process.argv.slice(2));
    const writeReport = args.has("--report");
    const strict = args.has("--strict");

    const result = await runMiniGuidesAudit();
    console.log(formatConsoleSummary(result));

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
        const markdown = formatAuditReport(result);
        await mkdir(path.dirname(DEFAULT_REPORT_PATH), { recursive: true });
        await writeFile(DEFAULT_REPORT_PATH, markdown, "utf8");
        console.log(`Review report: ${DEFAULT_REPORT_PATH}`);
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
