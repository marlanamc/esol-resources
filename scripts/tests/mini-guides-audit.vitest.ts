import { describe, expect, it } from "vitest";
import { runMiniGuidesAudit } from "@/lib/grammar-guide-audit";

const STRICT = process.env.MINI_GUIDES_AUDIT_STRICT === "1";

describe("mini guides audit (weeks 1–18)", () => {
    it("runs without throwing and audits the expected guide count", async () => {
        const result = await runMiniGuidesAudit();
        expect(result.guides.length).toBe(19);
    });

    it("has no mechanical errors in required W1–W18 guides", async () => {
        const result = await runMiniGuidesAudit();
        const errors = result.findings.filter(
            (finding) =>
                finding.severity === "error" && finding.slug !== "_global",
        );

        if (errors.length > 0) {
            const preview = errors
                .slice(0, 20)
                .map((e) => `${e.slug} [${e.ruleId}]: ${e.message}`)
                .join("\n");
            expect.fail(
                `${errors.length} audit error(s). Run npm run audit:mini-guides -- --report for details.\n${preview}`,
            );
        }

        expect(errors).toHaveLength(0);
    });

    it("has no heuristic warnings in required W1–W18 guides", async () => {
        const result = await runMiniGuidesAudit();
        const warnings = result.findings.filter(
            (finding) => finding.severity === "warning",
        );

        if (warnings.length > 0) {
            const preview = warnings
                .slice(0, 20)
                .map((w) => `${w.slug} [${w.ruleId}]: ${w.message}`)
                .join("\n");
            expect.fail(
                `${warnings.length} audit warning(s). Run npm run audit:mini-guides -- --report for details.\n${preview}`,
            );
        }

        expect(warnings).toHaveLength(0);
    });

    it("respects strict warning mode when enabled", async () => {
        if (!STRICT) {
            return;
        }

        const result = await runMiniGuidesAudit();
        const warnings = result.findings.filter((finding) => finding.severity === "warning");
        expect(warnings).toHaveLength(0);
    });
});
