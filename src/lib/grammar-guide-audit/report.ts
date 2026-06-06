import type { AuditResult } from "./types";

function formatFindingList(findings: AuditResult["findings"]): string {
    if (findings.length === 0) return "_None._\n";

    return findings
        .map((finding) => {
            const badge = finding.severity === "error" ? "ERROR" : "WARN";
            const snippet = finding.snippet ? `\n  > ${finding.snippet}` : "";
            return `- **[${badge}]** \`${finding.ruleId}\` (${finding.path}): ${finding.message}${snippet}`;
        })
        .join("\n");
}

export function formatAuditReport(result: AuditResult): string {
    const lines: string[] = [
        "# Mini Guides Audit — Weeks 1–18",
        "",
        `Generated: ${result.generatedAt}`,
        "",
        "## Summary",
        "",
        `- Guides audited: **${result.guides.length}**`,
        `- Errors: **${result.errorCount}**`,
        `- Warnings: **${result.warningCount}**`,
        "",
    ];

    for (const bundle of result.guides) {
        const { guide, findings, dialogues, scenarioParagraphs, imageEntries } = bundle;
        const errors = findings.filter((f) => f.severity === "error").length;
        const warnings = findings.filter((f) => f.severity === "warning").length;

        lines.push(`---`, "");
        lines.push(
            `## W${guide.scope.weekNumber}: ${guide.scope.title}`,
        );
        lines.push("");
        lines.push(`- **Slug:** \`${guide.slug}\``);
        lines.push(`- **Errors / warnings:** ${errors} / ${warnings}`);
        lines.push("");

        lines.push("### Scenarios");
        lines.push("");
        if (scenarioParagraphs.length === 0) {
            lines.push("_No opening scenario paragraphs found._");
        } else {
            for (const scenario of scenarioParagraphs) {
                lines.push(`**${scenario.sectionTitle}** — ${scenario.text}`);
                lines.push("");
            }
        }

        lines.push("### Dialogue transcript");
        lines.push("");
        if (dialogues.length === 0) {
            lines.push("_No dialogue turns extracted._");
        } else {
            for (const turn of dialogues) {
                const section = turn.sectionTitle ? ` (${turn.sectionTitle})` : "";
                lines.push(`- **${turn.speaker}**${section}: ${turn.text}`);
            }
            lines.push("");
        }

        lines.push("### Images");
        lines.push("");
        if (imageEntries.length === 0) {
            lines.push("_No scene images._");
        } else {
            for (const image of imageEntries) {
                lines.push(
                    `- \`${image.sceneId}\`: ${image.alt} _(unsplash: ${image.unsplashId})_`,
                );
            }
            lines.push("");
        }

        lines.push("### Mini quiz");
        lines.push("");
        const miniQuiz = bundle.guide.content.miniQuiz ?? [];
        if (miniQuiz.length === 0) {
            lines.push("_No mini quiz._");
        } else {
            miniQuiz.forEach((question, index) => {
                lines.push(`${index + 1}. ${question.question}`);
            });
            lines.push("");
        }

        lines.push("### Flags");
        lines.push("");
        lines.push(formatFindingList(findings));
        lines.push("");
    }

    return lines.join("\n");
}

export function formatConsoleSummary(result: AuditResult, scopeLabel = "Mini guides"): string {
    const lines = [
        `${scopeLabel} audit: ${result.guides.length} guides, ${result.errorCount} errors, ${result.warningCount} warnings`,
        "",
    ];

    for (const bundle of result.guides) {
        const errors = bundle.findings.filter((f) => f.severity === "error").length;
        const warnings = bundle.findings.filter((f) => f.severity === "warning").length;
        const status = errors > 0 ? "FAIL" : warnings > 0 ? "WARN" : "OK";
        lines.push(
            `  [${status}] W${bundle.guide.scope.weekNumber} ${bundle.guide.slug} — ${errors} errors, ${warnings} warnings`,
        );
    }

    return lines.join("\n");
}
