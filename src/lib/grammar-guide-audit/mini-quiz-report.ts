import type { AuditFinding, GuideReviewBundle } from "./types";

export interface MiniQuizAuditResult {
    generatedAt: string;
    scopeLabel: string;
    guides: GuideReviewBundle[];
    findings: AuditFinding[];
    questionCount: number;
    errorCount: number;
    warningCount: number;
}

function quizFindings(findings: AuditFinding[]): AuditFinding[] {
    return findings.filter((finding) => finding.path.startsWith("miniQuiz"));
}

export function formatMiniQuizAuditReport(result: MiniQuizAuditResult): string {
    const lines: string[] = [
        "# Mini quiz quality audit",
        "",
        `Generated: ${result.generatedAt}`,
        "",
        "## Summary",
        "",
        `- Scope: ${result.scopeLabel}`,
        `- Guides reviewed: ${result.guides.length}`,
        `- Quiz questions reviewed: ${result.questionCount}`,
        `- Formatting / correctness errors: ${result.errorCount}`,
        `- Clarity warnings: ${result.warningCount}`,
        "",
    ];

    const ruleCounts = new Map<string, number>();
    for (const finding of result.findings) {
        ruleCounts.set(finding.ruleId, (ruleCounts.get(finding.ruleId) ?? 0) + 1);
    }

    if (ruleCounts.size > 0) {
        lines.push("## Issue types");
        lines.push("");
        for (const [ruleId, count] of [...ruleCounts.entries()].sort((a, b) => b[1] - a[1])) {
            lines.push(`- \`${ruleId}\`: ${count}`);
        }
        lines.push("");
    }

    const guidesWithIssues = result.guides.filter((bundle) => quizFindings(bundle.findings).length > 0);
    const cleanGuides = result.guides.filter((bundle) => quizFindings(bundle.findings).length === 0);

    lines.push("## Guides with findings");
    lines.push("");

    for (const bundle of guidesWithIssues) {
        const quiz = bundle.guide.content.miniQuiz ?? [];
        const findings = quizFindings(bundle.findings);
        lines.push(
            `### W${bundle.guide.scope.weekNumber} ${bundle.guide.slug} (${quiz.length} questions)`,
        );
        lines.push("");

        for (const [index, question] of quiz.entries()) {
            const questionFindings = findings.filter((finding) =>
                finding.path.startsWith(`miniQuiz[${index}]`),
            );
            if (questionFindings.length === 0) continue;

            lines.push(`**Q${index + 1}.** ${question.question}`);
            lines.push("");
            for (const finding of questionFindings) {
                lines.push(
                    `- [${finding.severity.toUpperCase()}] \`${finding.ruleId}\` — ${finding.message}${
                        finding.snippet ? ` _(“${finding.snippet}”)_` : ""
                    }`,
                );
            }
            lines.push("");
        }
    }

    if (cleanGuides.length > 0) {
        lines.push("## Clean guides");
        lines.push("");
        for (const bundle of cleanGuides) {
            lines.push(`- W${bundle.guide.scope.weekNumber} ${bundle.guide.slug}`);
        }
        lines.push("");
    }

    return lines.join("\n");
}

export function formatMiniQuizConsoleSummary(result: MiniQuizAuditResult): string {
    const lines = [
        `Mini quiz audit: ${result.guides.length} guides, ${result.questionCount} questions, ${result.errorCount} errors, ${result.warningCount} warnings`,
        "",
    ];

    for (const bundle of result.guides) {
        const findings = quizFindings(bundle.findings);
        if (findings.length === 0) continue;
        const errors = findings.filter((finding) => finding.severity === "error").length;
        const warnings = findings.filter((finding) => finding.severity === "warning").length;
        lines.push(
            `  [${errors > 0 ? "FAIL" : "WARN"}] W${bundle.guide.scope.weekNumber} ${bundle.guide.slug} — ${errors} errors, ${warnings} warnings`,
        );
    }

    return lines.join("\n");
}
