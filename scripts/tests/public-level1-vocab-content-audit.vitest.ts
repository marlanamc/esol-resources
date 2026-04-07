import { describe, expect, it } from "vitest";
import { LEVEL1_PUBLIC_VOCAB_UNITS } from "@/data/public-level1-vocab";
import { vocabImages } from "@/data/vocab-images";
import {
  auditLevel1Definitions,
  formatDefinitionIssue,
} from "../checks/level1-definition-audit";

type AuditCard = {
  unit: string;
  theme: string;
  category: string;
  term: string;
  englishDefinition: string;
  spanishDefinition: string;
  example: string;
  imageUrl?: string;
};

type CategoryRule = {
  definitionHints?: RegExp[];
  exampleHints?: RegExp[];
  imageRequired?: boolean;
};

const CATEGORY_RULES: Array<{ match: RegExp; rule: CategoryRule }> = [
  {
    match: /classroom/i,
    rule: {
      definitionHints: [/class|school|write|read|study|teacher|student|desk|paper|book|board|chair/i],
      exampleHints: [/class|teacher|student|desk|book|paper|board|school|partner|group/i],
      imageRequired: true,
    },
  },
  {
    match: /family|personal information|people/i,
    rule: {
      definitionHints: [/family|name|address|phone|city|country|age|birthday|married|single|person|parent|child/i],
      exampleHints: [/my|his|her|family|name|address|phone|city|country|birthday|married|children|neighbor|teacher/i],
    },
  },
  {
    match: /community places|community services|housing & rental|parts of house|domestic things/i,
    rule: {
      definitionHints: [/place|building|house|home|apartment|rent|room|kitchen|bathroom|window|door|store|office|hospital|school|park|library|bank|laundry|water|electric/i],
      exampleHints: [/home|house|apartment|rent|room|kitchen|bathroom|store|office|hospital|school|park|library|bank|laundry|window|door|table|sofa/i],
      imageRequired: true,
    },
  },
  {
    match: /clothing|quantifiers/i,
    rule: {
      definitionHints: [/wear|clothing|shirt|pants|dress|head|feet|waist|shoe|coat|size|new|used/i],
      exampleHints: [/wear|shirt|pants|dress|shoes|coat|hat|size|buy|store/i],
      imageRequired: true,
    },
  },
  {
    match: /products|shopping|finance/i,
    rule: {
      definitionHints: [/machine|electronic|phone|computer|car|money|bank|pay|cost|store|card|receipt|refund/i],
      exampleHints: [/buy|pay|money|bank|store|online|receipt|card|cash|price/i],
      imageRequired: true,
    },
  },
  {
    match: /occupations|workforce|strength/i,
    rule: {
      definitionHints: [/work|job|office|restaurant|school|hospital|company|customer|repair|build|pay|business|skill|strength/i],
      exampleHints: [/work|job|office|restaurant|school|hospital|company|pay|boss|interview|resume|team|skill/i],
    },
  },
  {
    match: /body parts|symptoms|medicine|illness|medical|exercise/i,
    rule: {
      definitionHints: [/body|head|arm|leg|hand|foot|mouth|nose|ear|eye|pain|feel|sick|doctor|medicine|health|medical|hospital|exercise/i],
      exampleHints: [/doctor|hospital|body|pain|feel|sick|medicine|health|exercise|appointment|checkup/i],
      imageRequired: true,
    },
  },
  {
    match: /food|grains|dairy|meats|staples|vegetables|fruits|prepared foods|sweets|drinks|containers|wellness/i,
    rule: {
      definitionHints: [/food|eat|drink|fruit|vegetable|milk|meat|grain|snack|bread|rice|beans|juice|bottle|can|jar|package|nutrition/i],
      exampleHints: [/eat|drink|cook|breakfast|lunch|dinner|restaurant|store|food|milk|bread|rice|juice|water/i],
      imageRequired: true,
    },
  },
];

const EXAMPLE_DISALLOWED = [
  /^we practice the word/i,
  /^this is (a|an)\b/i,
  /^it is (a|an)\b/i,
];

const IMAGE_REQUIRED_CATEGORY_EXCEPTIONS = new Set([
  "Rent",
  "Lease",
  "Fee",
  "Security deposit",
  "Utilities",
  "Medical Care",
  "Education",
  "Shopping",
  "Housing",
  "Pay",
  "Salary",
  "Benefits",
  "Experience",
  "Break",
  "Hired",
  "Fired",
  "Laid off",
  "Interview",
  "Insurance",
  "Raise",
  "Strength",
  "Teamwork",
  "Problem-Solving",
  "Communication",
  "Leadership",
  "Pain",
  "Stress",
  "Nutrition",
  "Sugar",
  "Fat",
  "Carbohydrates",
  "Calories",
  "Habits",
]);

const LOW_CONTEXT_CATEGORIES = [
  /pronouns/i,
  /possessive/i,
  /contractions/i,
  /numbers/i,
  /days and months/i,
  /time of day/i,
  /adverbs of location/i,
  /prepositions/i,
  /adverbs of frequency/i,
];

function getCategoryRule(category: string): CategoryRule {
  for (const entry of CATEGORY_RULES) {
    if (entry.match.test(category)) return entry.rule;
  }

  return {};
}

function getAuditCards(): AuditCard[] {
  return LEVEL1_PUBLIC_VOCAB_UNITS.flatMap((unit) =>
    unit.categories.flatMap((category) =>
      category.cards.map((card) => ({
        unit: unit.title,
        theme: unit.theme,
        category: category.label,
        term: card.term,
        englishDefinition: card.englishDefinition,
        spanishDefinition: card.spanishDefinition,
        example: card.example,
        imageUrl: vocabImages[card.term],
      })),
    ),
  );
}

function formatIssue(prefix: string, card: AuditCard, detail: string): string {
  return `${prefix}: ${card.unit} -> ${card.category} -> ${card.term}: ${detail}`;
}

function categoryMatches(category: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(category));
}

describe("public level 1 vocabulary content audit", () => {
  it("classifies current definition backlog into hard failures and review warnings", () => {
    const audit = auditLevel1Definitions();
    const hardIssueLines = audit.hardIssues.map(formatDefinitionIssue);
    const reviewIssueLines = audit.reviewIssues.map(formatDefinitionIssue);

    expect(
      hardIssueLines.some((line) =>
        line.includes("Unit 1: Getting to Know You -> Classroom -> Book")
      )
    ).toBe(false);
    expect(
      hardIssueLines.some((line) =>
        line.includes("Unit 1: Getting to Know You -> Other -> Food")
      )
    ).toBe(false);
    expect(
      hardIssueLines.some((line) =>
        line.includes("Units 6 & 7: Workforce Preparation and Career Awareness -> Workforce Terminology -> Job")
      )
    ).toBe(false);
    expect(
      hardIssueLines.some((line) =>
        line.includes("Unit 9: Holistic Wellness -> Fruits -> Apples")
      )
    ).toBe(false);
    expect(
      hardIssueLines.some((line) =>
        line.includes("Unit 9: Holistic Wellness -> Drinks -> Juice")
      )
    ).toBe(false);

    expect(hardIssueLines, hardIssueLines.join("\n")).toEqual([]);

    expect(reviewIssueLines, reviewIssueLines.join("\n")).toEqual([]);
  });

  it("flags likely weak or low-value examples", () => {
    const issues: string[] = [];

    for (const card of getAuditCards()) {
      const example = card.example.trim();
      const termTokens = card.term
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length > 2);
      const mentionsTerm = termTokens.length === 0 || termTokens.some((token) => example.toLowerCase().includes(token));

      const lowContextCategory = categoryMatches(card.category, LOW_CONTEXT_CATEGORIES);
      const shortButAcceptableExample = /^(he|she) is [a-z-]+\.$/i.test(example);

      if (!lowContextCategory && !shortButAcceptableExample && example.length < 16) {
        issues.push(formatIssue("Example", card, `too short: "${example}"`));
      }

      if (!/[.!?"]$/.test(example)) {
        issues.push(formatIssue("Example", card, `should end like a real sentence: "${example}"`));
      }

      if (EXAMPLE_DISALLOWED.some((pattern) => pattern.test(example))) {
        issues.push(formatIssue("Example", card, `looks like a placeholder example: "${example}"`));
      }

      if (!mentionsTerm) {
        issues.push(formatIssue("Example", card, `does not appear to use the term naturally: "${example}"`));
      }
    }

    expect(issues, issues.slice(0, 80).join("\n")).toEqual([]);
  });

  it("flags missing or suspicious images for concrete vocabulary", () => {
    const issues: string[] = [];

    for (const card of getAuditCards()) {
      const rule = getCategoryRule(card.category);
      if (!rule.imageRequired) continue;
      if (IMAGE_REQUIRED_CATEGORY_EXCEPTIONS.has(card.term)) continue;

      if (!card.imageUrl) {
        issues.push(formatIssue("Image", card, "missing image for concrete vocabulary"));
        continue;
      }

      if (!/^https?:\/\//i.test(card.imageUrl)) {
        issues.push(formatIssue("Image", card, `image URL does not look valid: "${card.imageUrl}"`));
      }

      if (/placeholder|example\.com|default|fallback/i.test(card.imageUrl)) {
        issues.push(formatIssue("Image", card, `image URL looks like a placeholder: "${card.imageUrl}"`));
      }
    }

    expect(
      issues,
      [
        "This image audit only checks coverage and obviously suspicious URLs.",
        "Human review is still needed to confirm the photo clearly matches the term.",
        "",
        ...issues.slice(0, 80),
      ].join("\n"),
    ).toEqual([]);
  });
});
