import { LEVEL1_PUBLIC_VOCAB_UNITS } from "@/data/public-level1-vocab";

export type SpanishAuditCard = {
  unitTitle: string;
  category: string;
  term: string;
  englishDefinition: string;
  spanishDefinition: string;
};

export type SpanishTranslationIssue = {
  card: SpanishAuditCard;
  detail: string;
};

type CompoundRule = {
  term: string;
  invalidSpanish: RegExp;
  detail: string;
};

/**
 * Terms where a short Spanish gloss drops an essential English modifier
 * (e.g. "Hard-Working" -> "trabajador/a" reads as "worker", not "hard-working").
 */
const COMPOUND_SPANISH_RULES: CompoundRule[] = [
  {
    term: "Hard-Working",
    invalidSpanish: /^(el\/la\s+)?trabajador\/?a?$/i,
    detail:
      'Spanish gloss must convey diligence, not just "worker" (use esforzado/a or que trabaja mucho)',
  },
];

const STRENGTH_ADJECTIVE_TERMS = new Set([
  "Creative",
  "Flexible",
  "Organized",
  "Dependable",
  "Honest",
  "Hard-Working",
  "Respectful",
]);

function normalizeSpanishGloss(spanish: string): string {
  return spanish.split(/[;,]/)[0]?.trim() ?? spanish.trim();
}

export function getLevel1SpanishAuditCards(): SpanishAuditCard[] {
  return LEVEL1_PUBLIC_VOCAB_UNITS.flatMap((unit) =>
    unit.categories.flatMap((category) =>
      category.cards.map((card) => ({
        unitTitle: unit.title,
        category: category.label,
        term: card.term,
        englishDefinition: card.englishDefinition,
        spanishDefinition: card.spanishDefinition,
      }))
    )
  );
}

export function auditSpanishTranslationCard(card: SpanishAuditCard): SpanishTranslationIssue[] {
  const issues: SpanishTranslationIssue[] = [];
  const gloss = normalizeSpanishGloss(card.spanishDefinition);

  for (const rule of COMPOUND_SPANISH_RULES) {
    if (card.term !== rule.term) continue;
    if (rule.invalidSpanish.test(gloss)) {
      issues.push({ card, detail: rule.detail });
    }
  }

  if (card.category === "Strength Adjectives" && STRENGTH_ADJECTIVE_TERMS.has(card.term)) {
    if (/^trabajador\/?a?$/i.test(gloss)) {
      issues.push({
        card,
        detail:
          'Strength adjective gloss reads like the noun "worker"; use a clear adjective such as esforzado/a',
      });
    }
  }

  return issues;
}

export function auditLevel1SpanishTranslations() {
  const cards = getLevel1SpanishAuditCards();
  const issues = cards.flatMap(auditSpanishTranslationCard);

  return { cards, issues };
}

export function formatSpanishTranslationIssue(issue: SpanishTranslationIssue): string {
  return `${issue.card.unitTitle} -> ${issue.card.category} -> ${issue.card.term}: ${issue.detail} (ES: "${issue.card.spanishDefinition}")`;
}
