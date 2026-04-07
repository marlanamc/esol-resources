import {
  buildDefinitionAuditSummary,
  formatDefinitionIssue,
} from "./level1-definition-audit";

const audit = buildDefinitionAuditSummary();

console.log("Level 1 Definition Audit");
console.log("");
console.log(
  "Target: very simple adult ESOL Level 1 definitions. Simple English Wiktionary is a fallback reference only."
);
console.log("");
console.log(`Cards audited: ${audit.cards.length}`);
console.log(`Hard issues: ${audit.hardIssues.length}`);
console.log(`Review warnings: ${audit.reviewIssues.length}`);
console.log("");

console.log("Backlog by unit");
for (const [unitSlug, summary] of [...audit.byUnit.entries()].sort((a, b) => {
  const aTotal = a[1].hard + a[1].review;
  const bTotal = b[1].hard + b[1].review;
  return bTotal - aTotal;
})) {
  const total = summary.hard + summary.review;
  if (total === 0) continue;
  console.log(
    `- ${unitSlug}: ${summary.hard} hard, ${summary.review} review (${total} total)`
  );
}

console.log("");
console.log("Priority findings");
for (const issue of audit.hardIssues.slice(0, 40)) {
  console.log(`- ${formatDefinitionIssue(issue)}`);
}

if (audit.reviewIssues.length > 0) {
  console.log("");
  console.log("Review-only findings");
  for (const issue of audit.reviewIssues.slice(0, 20)) {
    console.log(`- ${formatDefinitionIssue(issue)}`);
  }
}
