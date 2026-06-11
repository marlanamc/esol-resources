#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { loadGuide } from "@/lib/grammar-guide-audit/load-guide";
import { runAnswerIntegrityRules } from "@/lib/grammar-guide-audit/rules-answer-integrity";
import { resolveAnswerIntegrityScope } from "@/lib/grammar-guide-audit/scope";
import type { AuditFinding, LoadedGuide } from "@/lib/grammar-guide-audit/types";

const ROOT = process.cwd();
const DEFAULT_REPORT_PATH = path.join(ROOT, "docs/audits/answer-integrity-audit.md");
const DEFAULT_FINDINGS_PATH = path.join(
    ROOT,
    "tmp/mini-guides-audit/answer-integrity-findings.json",
);

interface GuideResult {
    guide: LoadedGuide;
    findings: AuditFinding[];
}

function parseWeekFlag(argv: string[], flag: string, fallback: number): number {
    const index = argv.indexOf(flag);
    if (index === -1 || index + 1 >= argv.length) return fallback;
    const value = Number.parseInt(argv[index + 1]!, 10);
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

function formatReport(results: GuideResult[], generatedAt: string): string {
    const flagged = results.filter((result) => result.findings.length > 0);
    const clean = results.filter((result) => result.findings.length === 0);
    const errorCount = results
        .flatMap((result) => result.findings)
        .filter((finding) => finding.severity === "error").length;
    const warningCount = results
        .flatMap((result) => result.findings)
        .filter((finding) => finding.severity === "warning").length;

    const lines: string[] = [
        "# Answer integrity audit",
        "",
        `Generated: ${generatedAt}`,
        "",
        "Rules:",
        "",
        "- `answer-leaked-in-question-stem` (error): the full answer sentence appears in the question stem.",
        "- `answer-recycled-from-explanation-text` (warning): the answer sentence appears verbatim in the guide's teaching text, so the item tests copying rather than production.",
        "",
        "## Summary",
        "",
        `- Guides reviewed: ${results.length}`,
        `- Guides with findings: ${flagged.length}`,
        `- Errors: ${errorCount}`,
        `- Warnings: ${warningCount}`,
        "",
        "## Guides with findings (worst first)",
        "",
    ];

    for (const result of flagged) {
        lines.push(
            `### W${result.guide.scope.weekNumber} ${result.guide.slug} (${result.findings.length} findings)`,
        );
        lines.push("");
        for (const finding of result.findings) {
            lines.push(
                `- [${finding.severity.toUpperCase()}] \`${finding.ruleId}\` at \`${finding.path}\` — ${finding.message}${finding.snippet ? ` _("${finding.snippet}")_` : ""}`,
            );
        }
        lines.push("");
    }

    if (clean.length > 0) {
        lines.push("## Clean guides");
        lines.push("");
        for (const result of clean) {
            lines.push(`- W${result.guide.scope.weekNumber} ${result.guide.slug}`);
        }
        lines.push("");
    }

    return lines.join("\n");
}

async function main() {
    const argv = process.argv.slice(2);
    const args = new Set(argv.filter((arg) => arg.startsWith("--")));
    const writeReport = args.has("--report") || !args.has("--no-report");
    const strict = args.has("--strict");

    const minWeek = parseWeekFlag(argv, "--min-week", 1);
    const maxWeek = parseWeekFlag(argv, "--max-week", 40);
    const scope = resolveAnswerIntegrityScope(minWeek, maxWeek);

    const results: GuideResult[] = [];
    for (const entry of scope) {
        const loaded = await loadGuide(entry);
        results.push({ guide: loaded, findings: runAnswerIntegrityRules(loaded) });
    }
    results.sort((a, b) => b.findings.length - a.findings.length);

    const allFindings = results.flatMap((result) => result.findings);
    const errorCount = allFindings.filter((finding) => finding.severity === "error").length;
    const warningCount = allFindings.filter((finding) => finding.severity === "warning").length;
    const generatedAt = new Date().toISOString();

    console.log(
        `Answer integrity audit: ${results.length} guides, ${errorCount} errors, ${warningCount} warnings`,
    );
    for (const result of results) {
        if (result.findings.length === 0) continue;
        const errors = result.findings.filter((finding) => finding.severity === "error").length;
        console.log(
            `  [${errors > 0 ? "FAIL" : "WARN"}] ${result.guide.slug} — ${errors} errors, ${result.findings.length - errors} warnings`,
        );
    }

    await mkdir(path.dirname(DEFAULT_FINDINGS_PATH), { recursive: true });
    await writeFile(
        DEFAULT_FINDINGS_PATH,
        JSON.stringify({ generatedAt, findings: allFindings }, null, 2),
        "utf8",
    );
    console.log(`\nFindings JSON: ${DEFAULT_FINDINGS_PATH}`);

    if (writeReport) {
        await mkdir(path.dirname(DEFAULT_REPORT_PATH), { recursive: true });
        await writeFile(DEFAULT_REPORT_PATH, formatReport(results, generatedAt), "utf8");
        console.log(`Review report: ${DEFAULT_REPORT_PATH}`);
    }

    if (errorCount > 0 || (strict && warningCount > 0)) {
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
