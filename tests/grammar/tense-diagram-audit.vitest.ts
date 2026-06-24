import { describe, expect, it } from "vitest";
import { auditTenseDiagrams, extractTenseDiagrams } from "../lib/audit-tense-diagrams";

describe("grammar guide tenseDiagram stamps", () => {
  it("finds tenseDiagram blocks in mini guides", () => {
    const diagrams = extractTenseDiagrams();
    expect(diagrams.length).toBeGreaterThanOrEqual(40);
  });

  it("uses correct timeline stamp types for labeled perfect/continuous elements", () => {
    const findings = auditTenseDiagrams();
    if (findings.length > 0) {
      const report = findings
        .map(
          (f) =>
            `${f.file} — "${f.title}" — ${f.id} (${f.verbLabel ?? "no label"})\n${f.issues
              .map((issue) => `  - ${issue}`)
              .join("\n")}`
        )
        .join("\n\n");
      expect.fail(`${findings.length} tenseDiagram stamp issue(s):\n\n${report}`);
    }
  });
});
