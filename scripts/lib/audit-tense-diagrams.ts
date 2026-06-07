import { globSync } from "glob";
import fs from "fs";
import path from "path";

export type DiagramElement = {
  id: string;
  type: string;
  zone: string;
  verbLabel: string | null;
};

export type TenseDiagram = {
  file: string;
  title: string | null;
  elements: DiagramElement[];
};

export type TenseDiagramFinding = {
  file: string;
  title: string | null;
  id: string;
  verbLabel: string | null;
  issues: string[];
};

export function extractTenseDiagrams(grammarDir = "src/content/grammar"): TenseDiagram[] {
  const files = globSync(`${grammarDir}/*.ts`);
  const diagrams: TenseDiagram[] = [];

  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    if (!src.includes("tenseDiagram")) continue;

    const re = /tenseDiagram:\s*\{[\s\S]*?elements:\s*\[([\s\S]*?)\]\s*,?\s*\}/g;
    let m;
    while ((m = re.exec(src)) !== null) {
      const block = m[0];
      const title = block.match(/title:\s*"([^"]+)"/)?.[1] ?? null;
      const elBlock = m[1];
      const elements: DiagramElement[] = [];
      const elRe =
        /\{\s*id:\s*"([^"]+)"[\s\S]*?type:\s*"([^"]+)"[\s\S]*?zone:\s*"([^"]+)"(?:[\s\S]*?verbLabel:\s*"([^"]+)")?/g;
      let em;
      while ((em = elRe.exec(elBlock)) !== null) {
        elements.push({
          id: em[1],
          type: em[2],
          zone: em[3],
          verbLabel: em[4] ?? null,
        });
      }
      diagrams.push({ file: path.basename(file), title, elements });
    }
  }

  return diagrams;
}

export function lintTenseDiagramElement(el: DiagramElement): string[] {
  const label = (el.verbLabel ?? "").toLowerCase();
  const issues: string[] = [];

  const isInterruptionDot =
    label.includes("interruption") ||
    label.includes("burst") ||
    label.includes("started to rain");

  const isUsedToPast =
    label.includes("used to + verb") ||
    label.includes("used to live") ||
    label.includes("old habit") ||
    label.includes("past habit");

  const isPastSimpleDot =
    (label.includes("past simple") ||
      (label.includes("finished") && !label.includes("already finished")) ||
      label.includes("specific time") ||
      label.includes("did you go") ||
      label.includes("(alone)")) &&
    !label.includes("still true");

  const expectsArc =
    (/past perfect(?! continuous)/.test(label) ||
      label.includes("if + had") ||
      label.includes("had + v3")) &&
    !label.includes("third: would");

  const expectsPresentPerfectArc =
    (/present perfect(?! continuous)/.test(label) ||
      label.includes("have you ever") ||
      label.includes("have you been") ||
      label.includes("done (before now)") ||
      label.includes("just happened") ||
      label.includes("already finished") ||
      label.includes("links to now") ||
      label.includes("still true") ||
      label.includes("have worked") ||
      label.includes("have lived") ||
      label.includes("how long have") ||
      label.includes("not done yet") ||
      label.includes("haven't ... yet") ||
      label.includes("expected, not done")) &&
    !label.includes("continuous");

  const expectsFuturePerfectArc =
    /future perfect(?! continuous)/.test(label) ||
    (label.includes("future perfect") && !label.includes("cont"));

  const expectsPpc =
    /present perfect continuous|pres\. perf\. cont|have been working|have been taking|→ now/.test(
      label
    );

  const expectsPastContinuous =
    /past continuous|past cont\.|was walking|was running|was mopping|was sleeping|was listening|in progress/.test(
      label
    ) && !label.includes("had been");

  const expectsPresentContinuous =
    /present continuous|pres\. cont\.|getting used to/.test(label) && !expectsPpc;

  if (expectsArc && el.type !== "arc") {
    issues.push(`expected type "arc" for Past Perfect / if+had, got "${el.type}"`);
  }
  if (expectsArc && el.zone !== "past-earlier") {
    issues.push(`expected zone "past-earlier" for Past Perfect if-clause, got "${el.zone}"`);
  }

  if (expectsPresentPerfectArc && el.type !== "arc") {
    issues.push(`expected type "arc" for Present Perfect, got "${el.type}"`);
  }
  if (expectsPresentPerfectArc && el.zone !== "past") {
    issues.push(`expected zone "past" for Present Perfect (links to NOW), got "${el.zone}"`);
  }

  if (expectsFuturePerfectArc && el.type !== "arc-dashed") {
    issues.push(`expected type "arc-dashed" for Future Perfect, got "${el.type}"`);
  }

  if (expectsPpc && el.type !== "solid-to-now") {
    issues.push(`expected solid-to-now for Present Perfect Continuous, got "${el.type}"`);
  }
  if (expectsPpc && el.zone !== "past") {
    issues.push(`expected zone "past" for Present Perfect Continuous, got "${el.zone}"`);
  }

  if (expectsPastContinuous && el.type !== "solid-line") {
    issues.push(`expected solid-line for Past Continuous, got "${el.type}"`);
  }

  if (expectsPresentContinuous && el.type !== "solid-line") {
    issues.push(`expected solid-line for Present Continuous, got "${el.type}"`);
  }

  if (isUsedToPast && el.type !== "multiple-dots") {
    issues.push(`expected multiple-dots for used-to past habit, got "${el.type}"`);
  }

  if (
    el.type === "single-dot" &&
    el.zone === "past-earlier" &&
    !label.includes("imaginary") &&
    !label.includes("second:")
  ) {
    issues.push("single-dot in past-earlier is wrong for tense stamps — use arc for had+V3");
  }

  if (label.includes("would have") && el.type !== "single-dot") {
    issues.push(`expected single-dot for would-have result, got "${el.type}"`);
  }

  if (
    label.includes("would have") &&
    el.zone !== "past-later" &&
    el.zone !== "past"
  ) {
    issues.push(`expected past-later for would-have result, got "${el.zone}"`);
  }

  if (isPastSimpleDot && !isInterruptionDot && el.type !== "single-dot") {
    issues.push(`expected single-dot for Past Simple label, got "${el.type}"`);
  }

  return issues;
}

export function auditTenseDiagrams(grammarDir = "src/content/grammar"): TenseDiagramFinding[] {
  const findings: TenseDiagramFinding[] = [];

  for (const diagram of extractTenseDiagrams(grammarDir)) {
    for (const el of diagram.elements) {
      const issues = lintTenseDiagramElement(el);
      if (issues.length) {
        findings.push({
          file: diagram.file,
          title: diagram.title,
          id: el.id,
          verbLabel: el.verbLabel,
          issues,
        });
      }
    }
  }

  return findings;
}
