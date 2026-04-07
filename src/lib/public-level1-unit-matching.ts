import type {
  PublicLevel1VocabularyCard,
  PublicLevel1VocabularyUnit,
} from "@/data/public-level1-vocab";

const UNIT_MATCHING_EXCLUDED_CATEGORIES = new Set([
  "Pronouns",
  "Possessive Adjectives",
  "Contractions",
  "Prepositions (Location)",
  "Prepositions of Location",
  "Adverbs of Frequency",
  "Adverbs of Location",
  "Civic Vocabulary",
  "Community Services / Needs",
  "Messages",
  "Quantifiers",
  "Shopping & Finance",
  "Workforce Terminology",
  "Strengths",
  "Strength Adjectives",
  "Symptoms",
  "Illness",
  "Exercise",
  "Other Medical",
  "Food Groups",
  "Other Wellness",
  "Housing & Rental",
  "Other",
]);

function normalizeTerm(term: string): string {
  return term.trim().toLowerCase();
}

function compareMatchingCards(a: PublicLevel1VocabularyCard, b: PublicLevel1VocabularyCard): number {
  if (!!a.isConcrete !== !!b.isConcrete) {
    return a.isConcrete ? -1 : 1;
  }
  return a.term.localeCompare(b.term);
}

function getUnitThemeCards(unit: PublicLevel1VocabularyUnit): PublicLevel1VocabularyCard[] {
  const seen = new Set<string>();
  const deduped: PublicLevel1VocabularyCard[] = [];

  for (const theme of unit.themes ?? []) {
    for (const card of theme.cards) {
      const normalized = normalizeTerm(card.term);
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      deduped.push(card);
    }
  }

  return deduped;
}

export function getUnitImageBackedCards(unit: PublicLevel1VocabularyUnit): PublicLevel1VocabularyCard[] {
  return getUnitThemeCards(unit)
    .filter((card) => !!card.imageUrl)
    .sort(compareMatchingCards);
}

export function getUnitMatchingEligibleCards(unit: PublicLevel1VocabularyUnit): PublicLevel1VocabularyCard[] {
  return getUnitImageBackedCards(unit)
    .filter((card) => !UNIT_MATCHING_EXCLUDED_CATEGORIES.has(card.category));
}

export function getUnitMatchingAvailability(unit: PublicLevel1VocabularyUnit) {
  const imageBackedCards = getUnitImageBackedCards(unit);
  const eligibleCards = imageBackedCards.filter((card) => !UNIT_MATCHING_EXCLUDED_CATEGORIES.has(card.category));

  return {
    imageBackedCards,
    eligibleCards,
    hasEnoughImageBackedCards: imageBackedCards.length >= 2,
    hasPlayableUnitMatching: eligibleCards.length >= 2,
  };
}

