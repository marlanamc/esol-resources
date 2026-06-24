import { describe, expect, it } from "vitest";
import { runGrammarHeuristics } from "@/lib/grammar-guide-audit/heuristics-grammar";
import { loadGuide } from "@/lib/grammar-guide-audit/load-guide";
import { resolveWeek1to18Guides } from "@/lib/grammar-guide-audit/scope";

const GRAMMAR_RULE_IDS = new Set([
  "bare-bedroom-noun",
  "example-row-fragment",
  "subject-me-and",
  "unnatural-duration-question",
]);

describe("grammar example heuristics (course map mini guides)", () => {
  it("has no flagged grammar issues in model sentences (weeks 1–36)", async () => {
    const scope = resolveWeek1to18Guides(1, 36);
    const findings = [];

    for (const entry of scope) {
      const loaded = await loadGuide(entry);
      findings.push(
        ...runGrammarHeuristics(loaded).filter((finding) =>
          GRAMMAR_RULE_IDS.has(finding.ruleId),
        ),
      );
    }

    if (findings.length > 0) {
      const preview = findings
        .slice(0, 20)
        .map((f) => `${f.slug} [${f.ruleId}]: ${f.message}`)
        .join("\n");
      expect.fail(`${findings.length} grammar issue(s):\n${preview}`);
    }

    expect(findings).toHaveLength(0);
  });
});
