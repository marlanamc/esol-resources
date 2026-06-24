import { describe, expect, it } from "vitest";
import { runMiniGuidesAudit } from "@/lib/grammar-guide-audit";
import type { AuditFinding } from "@/lib/grammar-guide-audit/types";

const STRICT = process.env.MINI_GUIDES_AUDIT_STRICT === "1";

/**
 * This test gates only on OBJECTIVE audit findings — things that are
 * unambiguously wrong and worth failing a build over (em dashes in student
 * text, wrong quiz-question count, a section with no typed exercise, missing
 * quiz metadata, malformed exercises, etc.).
 *
 * The rules below are intentionally NOT gated. They are opinion- or
 * judgement-based, so they live in the audit REPORT as authoring guidance
 * rather than as build blockers:
 *   - mini-quiz-error-detection : "every quiz should have a spot-the-mistake
 *     question" is a nice-to-have, not a requirement.
 *   - textbook-phrase           : a fuzzy style nudge, prone to false positives.
 *   - image-scene-mismatch      : a keyword guess about photo/caption fit; needs
 *     a human's eyes.
 *   - duplicate-unsplash-id     : fixing it means choosing a new photo, which is
 *     an editorial/image decision, not a code fix.
 *
 * See everything (including the report-only rules) with:
 *   npm run audit:mini-guides -- --report
 *   MINI_GUIDES_AUDIT_STRICT=1 npm run test:vitest
 */
const REPORT_ONLY_RULES = new Set<string>([
    "mini-quiz-error-detection",
    "textbook-phrase",
    "image-scene-mismatch",
    "duplicate-unsplash-id",
]);

function gated(findings: AuditFinding[], severity: AuditFinding["severity"]): AuditFinding[] {
    return findings.filter((finding) => {
        if (finding.severity !== severity) return false;
        // _global findings are environmental cross-guide checks, not per-guide errors.
        if (finding.slug === "_global") return false;
        if (STRICT) return true;
        return !REPORT_ONLY_RULES.has(finding.ruleId);
    });
}

function preview(findings: AuditFinding[]): string {
    return findings
        .slice(0, 20)
        .map((f) => `${f.slug} [${f.ruleId}]: ${f.message}`)
        .join("\n");
}

describe("mini guides audit (weeks 1–18)", () => {
    it("runs without throwing and audits the expected guide count", async () => {
        const result = await runMiniGuidesAudit();
        expect(result.guides.length).toBe(19);
    });

    it("has no objective errors in required W1–W18 guides", async () => {
        const result = await runMiniGuidesAudit();
        const errors = gated(result.findings, "error");
        if (errors.length > 0) {
            expect.fail(
                `${errors.length} objective audit error(s).\n` +
                    `Run npm run audit:mini-guides -- --report for details.\n${preview(errors)}`,
            );
        }
        expect(errors).toHaveLength(0);
    });

    it("has no objective warnings in required W1–W18 guides", async () => {
        const result = await runMiniGuidesAudit();
        const warnings = gated(result.findings, "warning");
        if (warnings.length > 0) {
            expect.fail(
                `${warnings.length} objective audit warning(s).\n` +
                    `Run npm run audit:mini-guides -- --report for details.\n${preview(warnings)}`,
            );
        }
        expect(warnings).toHaveLength(0);
    });
});

describe("mini guides audit (weeks 19–29)", () => {
    it("runs without throwing and audits the expected guide count", async () => {
        const result = await runMiniGuidesAudit({ minWeek: 19, maxWeek: 29 });
        expect(result.guides.length).toBe(11);
    });

    it("has no objective errors in required W19–W29 guides", async () => {
        const result = await runMiniGuidesAudit({ minWeek: 19, maxWeek: 29 });
        const errors = gated(result.findings, "error");
        if (errors.length > 0) {
            expect.fail(
                `${errors.length} objective audit error(s).\n` +
                    `Run npm run audit:mini-guides -- --min-week 19 --max-week 29 for details.\n${preview(errors)}`,
            );
        }
        expect(errors).toHaveLength(0);
    });

    it("has no objective warnings in required W19–W29 guides", async () => {
        const result = await runMiniGuidesAudit({ minWeek: 19, maxWeek: 29 });
        const warnings = gated(result.findings, "warning");
        if (warnings.length > 0) {
            expect.fail(
                `${warnings.length} objective audit warning(s).\n` +
                    `Run npm run audit:mini-guides -- --min-week 19 --max-week 29 for details.\n${preview(warnings)}`,
            );
        }
        expect(warnings).toHaveLength(0);
    });
});
