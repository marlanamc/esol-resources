#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { loadGuide } from "@/lib/grammar-guide-audit/load-guide";
import { runHolidayReferenceRules } from "@/lib/grammar-guide-audit/rules-holiday-references";
import { resolveWeek1to18Guides } from "@/lib/grammar-guide-audit/scope";

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, "docs/audits/holiday-reference-audit.md");
const FINDINGS_PATH = path.join(ROOT, "tmp/mini-guides-audit/holiday-reference-findings.json");

function parseWeekFlag(argv: string[], flag: string, fallback: number): number {
    const index = argv.indexOf(flag);
    if (index === -1 || index + 1 >= argv.length) return fallback;
    const value = Number.parseInt(argv[index + 1]!, 10);
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

async function main() {
    const argv = process.argv.slice(2);
    const minWeek = parseWeekFlag(argv, "--min-week", 1);
    const maxWeek = parseWeekFlag(argv, "--max-week", 40);
    const scope = resolveWeek1to18Guides(minWeek, maxWeek);

    const rows: Array<{
        slug: string;
        weekNumber: number;
        findings: ReturnType<typeof runHolidayReferenceRules>;
    }> = [];

    for (const entry of scope) {
        const loaded = await loadGuide(entry);
        const findings = runHolidayReferenceRules(loaded);
        if (findings.length > 0) {
            rows.push({ slug: entry.slug, weekNumber: entry.weekNumber, findings });
        }
    }

    const allFindings = rows.flatMap((row) => row.findings);
    const lines = [
        "# Holiday and cultural reference audit",
        "",
        `Scope: weeks ${minWeek}–${maxWeek} grammar guides`,
        "",
        `Guides with findings: ${rows.length}`,
        `Total warnings: ${allFindings.length}`,
        "",
        "Named holidays should appear only when they change the scenario (day off, work schedule, religious practice, deadline). Otherwise use plain time, place, or generic wording like \"a holiday\" or \"the holiday schedule\".",
        "",
    ];

    for (const row of rows) {
        lines.push(`## W${row.weekNumber} ${row.slug}`);
        lines.push("");
        for (const finding of row.findings) {
            lines.push(
                `- \`${finding.ruleId}\` (${finding.path}): ${finding.message}${finding.snippet ? ` — “${finding.snippet}”` : ""}`,
            );
        }
        lines.push("");
    }

    if (rows.length === 0) {
        lines.push("_No named holiday references flagged outside holiday-themed sections._");
        lines.push("");
    }

    await mkdir(path.dirname(FINDINGS_PATH), { recursive: true });
    await writeFile(FINDINGS_PATH, JSON.stringify({ rows, generatedAt: new Date().toISOString() }, null, 2));
    await mkdir(path.dirname(REPORT_PATH), { recursive: true });
    await writeFile(REPORT_PATH, lines.join("\n"), "utf8");

    console.log(`Holiday reference audit: ${scope.length} guides, ${allFindings.length} warnings`);
    for (const row of rows) {
        console.log(`  [WARN] W${row.weekNumber} ${row.slug} — ${row.findings.length} references`);
    }
    console.log(`Report: ${REPORT_PATH}`);

    if (allFindings.length > 0 && argv.includes("--strict")) {
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
