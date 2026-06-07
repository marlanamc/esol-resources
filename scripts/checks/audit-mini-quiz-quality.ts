#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { loadGuide } from "@/lib/grammar-guide-audit/load-guide";
import {
    formatMiniQuizAuditReport,
    formatMiniQuizConsoleSummary,
    type MiniQuizAuditResult,
} from "@/lib/grammar-guide-audit/mini-quiz-report";
import { runMiniQuizQualityRules } from "@/lib/grammar-guide-audit/rules-mini-quiz-quality";
import { resolveWeek1to18Guides } from "@/lib/grammar-guide-audit/scope";
import type { GuideReviewBundle } from "@/lib/grammar-guide-audit/types";

const ROOT = process.cwd();
const DEFAULT_REPORT_PATH = path.join(ROOT, "docs/audits/mini-quiz-quality-audit.md");
const DEFAULT_FINDINGS_PATH = path.join(ROOT, "tmp/mini-guides-audit/mini-quiz-findings.json");

function parseWeekFlag(argv: string[], flag: string, fallback: number): number {
    const index = argv.indexOf(flag);
    if (index === -1 || index + 1 >= argv.length) return fallback;
    const value = Number.parseInt(argv[index + 1]!, 10);
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

async function main() {
    const argv = process.argv.slice(2);
    const args = new Set(argv.filter((arg) => arg.startsWith("--")));
    const writeReport = args.has("--report") || !args.has("--no-report");
    const strict = args.has("--strict");

    const minWeek = parseWeekFlag(argv, "--min-week", 1);
    const maxWeek = parseWeekFlag(argv, "--max-week", 40);
    const scope = resolveWeek1to18Guides(minWeek, maxWeek);
    const weekLabel =
        minWeek === 1 && maxWeek === 40
            ? "Weeks 1–40 mini grammar guides"
            : `Weeks ${minWeek}–${maxWeek} mini grammar guides`;

    const guides: GuideReviewBundle[] = [];
    const allFindings = [];
    let questionCount = 0;

    for (const entry of scope) {
        const loaded = await loadGuide(entry);
        const findings = runMiniQuizQualityRules(loaded);
        questionCount += loaded.content.miniQuiz?.length ?? 0;
        guides.push({
            guide: loaded,
            findings,
            dialogues: [],
            scenarioParagraphs: [],
            imageEntries: [],
        });
        allFindings.push(...findings);
    }

    const result: MiniQuizAuditResult = {
        generatedAt: new Date().toISOString(),
        scopeLabel: weekLabel,
        guides,
        findings: allFindings,
        questionCount,
        errorCount: allFindings.filter((finding) => finding.severity === "error").length,
        warningCount: allFindings.filter((finding) => finding.severity === "warning").length,
    };

    console.log(formatMiniQuizConsoleSummary(result));

    if (allFindings.length > 0) {
        console.log("");
        for (const finding of allFindings.slice(0, 50)) {
            console.log(
                `[${finding.severity.toUpperCase()}] ${finding.slug} :: ${finding.ruleId} — ${finding.message}`,
            );
        }
        if (allFindings.length > 50) {
            console.log(`... and ${allFindings.length - 50} more (use --report for full list)`);
        }
    }

    await mkdir(path.dirname(DEFAULT_FINDINGS_PATH), { recursive: true });
    await writeFile(DEFAULT_FINDINGS_PATH, JSON.stringify(result, null, 2), "utf8");
    console.log(`\nFindings JSON: ${DEFAULT_FINDINGS_PATH}`);

    if (writeReport) {
        const reportPath =
            minWeek === 1 && maxWeek === 40
                ? DEFAULT_REPORT_PATH
                : path.join(
                      ROOT,
                      `docs/audits/mini-quiz-quality-w${minWeek}-w${maxWeek}.md`,
                  );
        await mkdir(path.dirname(reportPath), { recursive: true });
        await writeFile(reportPath, formatMiniQuizAuditReport(result), "utf8");
        console.log(`Review report: ${reportPath}`);
    }

    if (result.errorCount > 0 || (strict && result.warningCount > 0)) {
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
