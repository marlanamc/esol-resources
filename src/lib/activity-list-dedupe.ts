const ED_PRONUNCIATION_UI = 'ed-pronunciation';
const MINIMAL_PAIRS_UI = 'minimal-pairs';
const SENTENCE_LISTENING_UI = 'pronunciation-listening';
const ED_PRONUNCIATION_CANONICAL_TITLE = '-ed Sounds Game';
const MINIMAL_PAIRS_CANONICAL_TITLE = 'Minimal Pairs Listening Lab';
const SENTENCE_LISTENING_CANONICAL_TITLE = 'Sentence Listening Lab';

interface ActivityWithUi {
  id: string;
  title: string;
  ui?: string | null;
}

export function collapseEdPronunciationActivities<T extends ActivityWithUi>(activities: T[]): T[] {
  const canonicalByUi = new Map<string, string>([
    [ED_PRONUNCIATION_UI, ED_PRONUNCIATION_CANONICAL_TITLE],
    [MINIMAL_PAIRS_UI, MINIMAL_PAIRS_CANONICAL_TITLE],
    [SENTENCE_LISTENING_UI, SENTENCE_LISTENING_CANONICAL_TITLE],
  ]);

  return activities.filter((activity) => {
    const ui = activity.ui ?? null;
    if (!ui || !canonicalByUi.has(ui)) return true;

    const related = activities.filter((candidate) => candidate.ui === ui);
    if (related.length <= 1) return true;

    const canonicalTitle = canonicalByUi.get(ui)!;
    const canonicalActivity = related.find((candidate) => candidate.title === canonicalTitle) ?? related[0];
    return activity.id === canonicalActivity.id;
  });
}
