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

const UNIT_MATCHING_EXCLUDED_TERMS = new Set([
  // Unit 1 Vague Terms
  "address",
  "age",
  "city",
  "country",
  "divorced",
  "job",
  "married",
  "name",
  "phone number",
  "single",
  "state",
  "street",
  "years old",
  "zip code",

  // Unit 2 Vague Terms (Months, Days, Relationships, Time, Habits)
  "appointment",
  "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december",
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
  "brother-in-law", "father-in-law", "mother-in-law", "sister-in-law", "parent", "relationship", "partner",
  "breakfast", "lunch", "dinner",
  "half", "hour", "minute", "month", "week", "yesterday", "tomorrow", "today",
  "next", "o'clock", "old", "young", "time", "schedule",
  "black", "blond", "brown", "gray", "red", "straight", "wavy", "curly", "hair", "eyes", "tall", "short", "thin", "heavy",

  // Unit 3 Vague Terms (Public offices represented by vague generic buildings, abstract history)
  "city hall", "clinic", "dentist's office", "doctor's office", "rmv", "station", "public transportation",
  "indigenous", "meal", "pilgrim", "thanks",

  // Unit 4 Vague Terms
  "christmas tree", "electronics", "gift", "lights", "ornaments", "santa",

  // Unit 5 Vague Terms (Housing parts, furniture with highly overlapping pictures)
  "armchair", "attic", "basement", "bedtable", "cabinet", "carpet", "chimney", "closet", "coffee table", "counter", "curtain", "deck", "driveway", "dryer", "end table", "fireplace", "floor", "hall", "light", "lock", "painting", "plant", "porch", "roof", "room", "rug", "sink", "washer", "yard",

  // Unit 6-7 Jobs
  "administrative assistant",
  "office assistant",
  "secretary",
  "receptionist",
  "manager",
  "business owner",
  "prep cook",
  "busser",
  "custodian",
  "principal",

  // Unit 8 Vague Terms (Medical abstract words)
  "chest", "elevators", "hospital", "lobby", "lozenges", "medical center", "pills", "prescription", "reliever", "syrup", "tablets", "throat", "vaccine",

  // Unit 9 Vague Terms (Food container overlaps and subtle differences)
  "almonds", "avocados", "bag", "blueberry", "bottled water", "box", "celery", "cereal", "crackers", "cucumber", "garlic", "jam", "jar", "jelly", "ketchup", "lettuce", "melon", "mustard", "nuts", "oil", "package", "pasta", "peanut butter", "peanuts", "pepper", "pork", "potato chips", "salad", "salt", "sandwich", "soda", "spinach", "strawberry", "toast", "tuna", "turkey", "walnuts"
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
    .filter((card) => 
      !UNIT_MATCHING_EXCLUDED_CATEGORIES.has(card.category) &&
      !UNIT_MATCHING_EXCLUDED_TERMS.has(card.term.trim().toLowerCase())
    );
}

export function getUnitMatchingAvailability(unit: PublicLevel1VocabularyUnit) {
  const imageBackedCards = getUnitImageBackedCards(unit);
  const eligibleCards = getUnitMatchingEligibleCards(unit);

  return {
    imageBackedCards,
    eligibleCards,
    hasEnoughImageBackedCards: imageBackedCards.length >= 2,
    hasPlayableUnitMatching: eligibleCards.length >= 2,
  };
}

