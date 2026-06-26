#!/usr/bin/env node
import { auditTenseDiagrams, extractTenseDiagrams } from "../lib/audit-tense-diagrams";

const diagrams = extractTenseDiagrams();
const findings = auditTenseDiagrams();

if (findings.length === 0) {
  console.log(`OK: ${diagrams.length} tenseDiagram blocks, no stamp issues found.`);
  process.exit(0);
}

console.log(`Found ${findings.length} issue(s) in ${diagrams.length} tenseDiagram blocks:\n`);
for (const f of findings) {
  console.log(`${f.file} — "${f.title}" — ${f.id} (${f.verbLabel ?? "no label"})`);
  for (const issue of f.issues) console.log(`  - ${issue}`);
  console.log();
}
process.exit(1);
