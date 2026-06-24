import { describe, expect, it } from "vitest";
import { auditCourseMapOrder } from "../lib/audit-course-map-order";

describe("course map order audit", () => {
  it("keeps grammar second and verb quiz last on standard vocab weeks", () => {
    const findings = auditCourseMapOrder();
    expect(findings, formatFindings(findings)).toEqual([]);
  });
});

function formatFindings(findings: ReturnType<typeof auditCourseMapOrder>): string {
  if (findings.length === 0) return "";
  return findings
    .map(
      (finding) =>
        `W${finding.weekNumber} ${finding.weekTitle}:\n${finding.issues.map((issue) => `  - ${issue}`).join("\n")}`,
    )
    .join("\n\n");
}
