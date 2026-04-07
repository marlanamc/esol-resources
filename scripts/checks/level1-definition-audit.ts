import { LEVEL1_PUBLIC_VOCAB_UNITS } from "@/data/public-level1-vocab";

export type AuditCard = {
  unitSlug: string;
  unitTitle: string;
  theme: string;
  category: string;
  term: string;
  englishDefinition: string;
  spanishDefinition: string;
  example: string;
};

export type DefinitionIssueKind =
  | "placeholder_generic"
  | "too_abstract"
  | "too_dictionary_like"
  | "too_advanced"
  | "needs_human_review";

export type DefinitionIssueSeverity = "hard" | "review";

export type DefinitionAuditIssue = {
  severity: DefinitionIssueSeverity;
  kind: DefinitionIssueKind;
  card: AuditCard;
  detail: string;
};

type CategoryRule = {
  definitionHints?: RegExp[];
};

const CATEGORY_RULES: Array<{ match: RegExp; rule: CategoryRule }> = [
  {
    match: /classroom/i,
    rule: {
      definitionHints: [/class|school|write|read|study|teacher|student|desk|paper|book|board|chair|eraser|marker|pencil/i],
    },
  },
  {
    match: /family|personal information|people/i,
    rule: {
      definitionHints: [/family|name|address|phone|city|country|age|birthday|married|single|divorced|person|parent|child/i],
    },
  },
  {
    match: /community places|community services|housing & rental|parts of house|domestic things/i,
    rule: {
      definitionHints: [/place|building|house|home|apartment|rent|room|kitchen|bathroom|window|door|store|office|hospital|school|park|library|bank|laundry|water|electric|floor|roof|stairs/i],
    },
  },
  {
    match: /clothing|quantifiers/i,
    rule: {
      definitionHints: [/wear|clothing|shirt|pants|dress|head|feet|waist|shoe|coat|size|new|used|hat|jacket/i],
    },
  },
  {
    match: /products|shopping|finance/i,
    rule: {
      definitionHints: [/machine|electronic|phone|computer|car|money|bank|pay|cost|store|card|receipt|refund|signature|internet/i],
    },
  },
  {
    match: /occupations|workforce|strength/i,
    rule: {
      definitionHints: [/work|job|office|restaurant|school|hospital|company|customer|repair|build|pay|business|skill|strength|cook|clean|teach|care/i],
    },
  },
  {
    match: /body parts|symptoms|medicine|illness|medical|exercise/i,
    rule: {
      definitionHints: [/body|head|arm|leg|hand|foot|mouth|nose|ear|eye|pain|feel|sick|doctor|medicine|health|medical|hospital|exercise|skin|injury/i],
    },
  },
  {
    match: /food|grains|dairy|meats|staples|vegetables|fruits|prepared foods|sweets|drinks|containers|wellness/i,
    rule: {
      definitionHints: [/food|eat|drink|fruit|vegetable|milk|meat|grain|snack|bread|rice|beans|juice|bottle|can|jar|package|nutrition|sauce/i],
    },
  },
];

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

const STRICT_RELEVANCE_CATEGORIES = [
  /classroom/i,
  /community places/i,
  /housing/i,
  /parts of house/i,
  /domestic things/i,
  /clothing/i,
  /products/i,
  /shopping/i,
  /occupations/i,
  /workforce/i,
  /body parts/i,
  /symptoms/i,
  /medicine/i,
  /illness/i,
  /medical/i,
  /exercise/i,
  /food/i,
  /grains/i,
  /dairy/i,
  /meats/i,
  /staples/i,
  /vegetables/i,
  /fruits/i,
  /prepared foods/i,
  /sweets/i,
  /drinks/i,
  /containers/i,
];

const PLACEHOLDER_PATTERNS = [
  /^a vegetable$/i,
  /^a fruit$/i,
  /^a drink$/i,
  /^a prepared food$/i,
  /^a work word$/i,
  /^things people eat$/i,
  /^liked more than other things$/i,
  /^what we use to know$/i,
  /^food that helps build the body$/i,
];

const DICTIONARY_LIKE_PATTERNS = [
  /^a kind of\b/i,
  /^a piece of clothing\b/i,
  /^a part of a house\b/i,
  /^a sign that\b/i,
  /^something with\b/i,
  /^something you wear\b/i,
  /^a person who takes part\b/i,
  /\bconsisting of\b/i,
  /\bproduced in sheets\b/i,
  /\boccurring between\b/i,
];

const ADVANCED_WORD_PATTERNS = [
  /\bundertaking\b/i,
  /\btypically\b/i,
  /\bassociated with\b/i,
  /\bfederal\b/i,
  /\bincome taxes\b/i,
  /\bdevice\b/i,
  /\binstrument\b/i,
  /\bperiod of about\b/i,
];

const REVIEW_PHRASES = new Set([
  "not married",
  "inside",
  "beside",
  "not often",
  "every time",
  "truthful",
]);

function getCategoryRule(category: string): CategoryRule {
  for (const entry of CATEGORY_RULES) {
    if (entry.match.test(category)) return entry.rule;
  }
  return {};
}

function hasAnyHint(text: string, hints: RegExp[] | undefined): boolean {
  if (!hints || hints.length === 0) return true;
  return hints.some((hint) => hint.test(text));
}

function categoryMatches(category: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(category));
}

export function getLevel1DefinitionAuditCards(): AuditCard[] {
  return LEVEL1_PUBLIC_VOCAB_UNITS.flatMap((unit) =>
    unit.categories.flatMap((category) =>
      category.cards.map((card) => ({
        unitSlug: unit.slug,
        unitTitle: unit.title,
        theme: unit.theme,
        category: category.label,
        term: card.term,
        englishDefinition: card.englishDefinition,
        spanishDefinition: card.spanishDefinition,
        example: card.example,
      }))
    )
  );
}

export function auditDefinitionCard(card: AuditCard): DefinitionAuditIssue[] {
  const issues: DefinitionAuditIssue[] = [];
  const definition = card.englishDefinition.trim();
  const normalized = definition.toLowerCase();
  const lowContextCategory = categoryMatches(card.category, LOW_CONTEXT_CATEGORIES);
  const strictCategory = categoryMatches(card.category, STRICT_RELEVANCE_CATEGORIES);
  const rule = getCategoryRule(card.category);

  if (PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(definition))) {
    issues.push({
      severity: "hard",
      kind: "placeholder_generic",
      card,
      detail: `placeholder or overly generic definition: "${definition}"`,
    });
    return issues;
  }

  if (DICTIONARY_LIKE_PATTERNS.some((pattern) => pattern.test(definition))) {
    issues.push({
      severity: "hard",
      kind: "too_dictionary_like",
      card,
      detail: `dictionary-style wording is too indirect for Level 1: "${definition}"`,
    });
  }

  if (ADVANCED_WORD_PATTERNS.some((pattern) => pattern.test(definition))) {
    issues.push({
      severity: "hard",
      kind: "too_advanced",
      card,
      detail: `definition uses wording that is too advanced for adult Level 1: "${definition}"`,
    });
  }

  if (
    strictCategory &&
    !normalized.includes(card.term.toLowerCase()) &&
    !hasAnyHint(definition, rule.definitionHints)
  ) {
    issues.push({
      severity: "hard",
      kind: "too_abstract",
      card,
      detail: `definition does not give enough concrete category context: "${definition}"`,
    });
  }

  if (issues.length > 0) {
    return dedupeIssues(issues);
  }

  if (definition.length < 12) {
    const reviewOnly = lowContextCategory || REVIEW_PHRASES.has(normalized);
    issues.push({
      severity: reviewOnly ? "review" : "hard",
      kind: reviewOnly ? "needs_human_review" : "too_abstract",
      card,
      detail: reviewOnly
        ? `short beginner-safe definition should be reviewed by a human: "${definition}"`
        : `definition is too short to teach meaning clearly: "${definition}"`,
    });
  }

  return dedupeIssues(issues);
}

function dedupeIssues(issues: DefinitionAuditIssue[]): DefinitionAuditIssue[] {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const key = `${issue.severity}:${issue.kind}:${issue.card.unitSlug}:${issue.card.category}:${issue.card.term}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function auditLevel1Definitions() {
  const cards = getLevel1DefinitionAuditCards();
  const issues = cards.flatMap(auditDefinitionCard);
  const hardIssues = issues.filter((issue) => issue.severity === "hard");
  const reviewIssues = issues.filter((issue) => issue.severity === "review");

  return {
    cards,
    issues,
    hardIssues,
    reviewIssues,
  };
}

export function formatDefinitionIssue(issue: DefinitionAuditIssue): string {
  return `${issue.severity.toUpperCase()} [${issue.kind}] ${issue.card.unitTitle} -> ${issue.card.category} -> ${issue.card.term}: ${issue.detail}`;
}

export function buildDefinitionAuditSummary() {
  const audit = auditLevel1Definitions();
  const byUnit = new Map<
    string,
    {
      hard: number;
      review: number;
      kinds: Record<DefinitionIssueKind, number>;
    }
  >();

  for (const issue of audit.issues) {
    const current =
      byUnit.get(issue.card.unitSlug) ??
      {
        hard: 0,
        review: 0,
        kinds: {
          placeholder_generic: 0,
          too_abstract: 0,
          too_dictionary_like: 0,
          too_advanced: 0,
          needs_human_review: 0,
        },
      };

    current[issue.severity] += 1;
    current.kinds[issue.kind] += 1;
    byUnit.set(issue.card.unitSlug, current);
  }

  return {
    ...audit,
    byUnit,
  };
}

