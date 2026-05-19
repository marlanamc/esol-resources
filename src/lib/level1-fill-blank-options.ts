export type FillBlankCard = {
  term: string;
  category: string;
};

/**
 * Categories where same-category words are often both grammatically valid
 * (e.g. morning vs afternoon in a vague frame). Prefer cross-category there.
 */
const CROSS_CATEGORY_PREFERRED = new Set(["Time of Day", "People"]);

function hashStringToSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleDeterministic<T>(arr: T[], seedStr: string): T[] {
  const rand = mulberry32(hashStringToSeed(seedStr));
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function sentenceWordSet(sentence: string): Set<string> {
  return new Set(
    sentence
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
  );
}

function sortByDistractorUse(
  pool: FillBlankCard[],
  seedKey: string,
  distractorUseCount: Map<string, number>
): FillBlankCard[] {
  return [...pool].sort((a, b) => {
    const usageA = distractorUseCount.get(a.term) ?? 0;
    const usageB = distractorUseCount.get(b.term) ?? 0;
    if (usageA !== usageB) return usageA - usageB;
    return hashStringToSeed(`${seedKey}:${a.term}`) - hashStringToSeed(`${seedKey}:${b.term}`);
  });
}

function pickTerms(
  pool: FillBlankCard[],
  count: number,
  seedKey: string,
  distractorUseCount: Map<string, number>,
  alreadyPicked: string[]
): string[] {
  if (count <= 0 || pool.length === 0) return [];

  const sorted = sortByDistractorUse(pool, seedKey, distractorUseCount);
  const rotated = shuffleDeterministic(sorted, `${seedKey}:rotate`);
  const picked: string[] = [];

  for (const card of rotated) {
    if (picked.length >= count) break;
    if (alreadyPicked.includes(card.term)) continue;
    picked.push(card.term);
  }

  return picked;
}

function recordDistractorUse(terms: string[], distractorUseCount: Map<string, number>): void {
  for (const term of terms) {
    distractorUseCount.set(term, (distractorUseCount.get(term) ?? 0) + 1);
  }
}

/**
 * Build 4 options: correct answer + 3 distractors.
 * Spreads distractors across the quiz and prefers related words (same category)
 * except for categories where that creates ambiguous blanks.
 */
export function generateLevel1FillBlankOptions(
  answer: FillBlankCard,
  allCards: FillBlankCard[],
  sentence: string,
  seedKey: string,
  distractorUseCount: Map<string, number>
): string[] {
  const sentenceWords = sentenceWordSet(sentence);

  const candidates = allCards.filter(
    (c) => c.term !== answer.term && !sentenceWords.has(c.term.toLowerCase())
  );

  const sameCategory = candidates.filter((c) => c.category === answer.category);
  const crossCategory = candidates.filter((c) => c.category !== answer.category);

  const preferCross = CROSS_CATEGORY_PREFERRED.has(answer.category);
  const primary = preferCross ? crossCategory : sameCategory;
  const secondary = preferCross ? sameCategory : crossCategory;

  const primaryCount = primary.length >= 3 ? 3 : primary.length;
  const needSecondary = 3 - primaryCount;

  const distractors = [
    ...pickTerms(primary, primaryCount, `${seedKey}:primary`, distractorUseCount, []),
    ...pickTerms(secondary, needSecondary, `${seedKey}:secondary`, distractorUseCount, []),
  ];

  if (distractors.length < 3) {
    const remaining = candidates.filter((c) => !distractors.includes(c.term));
    distractors.push(
      ...pickTerms(
        remaining,
        3 - distractors.length,
        `${seedKey}:fallback`,
        distractorUseCount,
        distractors
      )
    );
  }

  const finalDistractors = distractors.slice(0, 3);
  recordDistractorUse(finalDistractors, distractorUseCount);

  return shuffleDeterministic([answer.term, ...finalDistractors], `${seedKey}:options`);
}

export function buildLevel1FillBlankQuestionOptions<T extends FillBlankCard>(
  cards: T[],
  unitSlug: string,
  themeId: string,
  getSentence: (card: T) => string | undefined
): Array<{ term: string; sentence: string; options: string[] }> {
  const questionCards = cards.filter((card) => getSentence(card));
  const distractorUseCount = new Map<string, number>();

  return questionCards.map((card, index) => {
    const sentence = getSentence(card)!;
    const seedKey = `${unitSlug}:${themeId}:${index}:${card.term}`;
    return {
      term: card.term,
      sentence,
      options: generateLevel1FillBlankOptions(
        card,
        cards,
        sentence,
        seedKey,
        distractorUseCount
      ),
    };
  });
}
