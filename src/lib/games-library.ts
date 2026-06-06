export interface GamesLibraryActivityInput {
  id: string;
  title: string;
  type: string;
  category: string | null;
  ui: string | null;
  content?: string | null;
}

/** Timeline preset rows created for the course map (auto-start with tenseCategories / practiceMode). */
const TIMELINE_TENSES_PRESET_ID_PREFIX = "timeline-tenses-";

const GUIDED_WRAPPER_ID_SUFFIX = "-guided";

function parseGameContent(content?: string | null): Record<string, unknown> | null {
  if (!content) return null;

  try {
    const parsed = JSON.parse(content) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function isTimelineTensesPresetActivity(activity: Pick<GamesLibraryActivityInput, "id" | "content">): boolean {
  if (activity.id.startsWith(TIMELINE_TENSES_PRESET_ID_PREFIX)) return true;

  const content = parseGameContent(activity.content);
  if (!content || content.type !== "timeline-tenses") return false;

  return (
    Array.isArray(content.tenseCategories) ||
    typeof content.practiceMode === "string"
  );
}

export function isGuidedCourseMapWrapperActivity(
  activity: Pick<GamesLibraryActivityInput, "id" | "content">
): boolean {
  if (activity.id.endsWith(GUIDED_WRAPPER_ID_SUFFIX)) return true;

  const content = parseGameContent(activity.content);
  return content?.courseMapPreset === true;
}

/** Activities that belong on the course map, not the standalone Games library. */
export function isCourseMapOnlyGame(activity: GamesLibraryActivityInput): boolean {
  if (activity.type !== "game") return false;
  return isGuidedCourseMapWrapperActivity(activity) || isTimelineTensesPresetActivity(activity);
}

function isPronunciationGameActivity(activity: GamesLibraryActivityInput): boolean {
  const category = (activity.category || "").toLowerCase();
  return (
    category === "pronunciation" ||
    activity.ui === "ed-pronunciation" ||
    activity.ui === "minimal-pairs" ||
    activity.ui === "pronunciation-listening"
  );
}

/** Full standalone games shown under Dashboard → Activities → Games. */
export function isGamesLibraryActivity(activity: GamesLibraryActivityInput): boolean {
  if (activity.type !== "game") return false;
  if (activity.id.startsWith("vocab-")) return false;
  if (isCourseMapOnlyGame(activity)) return false;
  if (isPronunciationGameActivity(activity)) return false;
  return true;
}

export interface GameLibrarySection {
  name: string;
  activities: GamesLibraryActivityInput[];
}

type GameLibraryMatcher = (activity: GamesLibraryActivityInput, normalizedTitle: string) => boolean;

const GAME_LIBRARY_SECTION_DEFS: Array<{ name: string; match: GameLibraryMatcher }> = [
  {
    name: "Verb Tenses & Forms",
    match: (activity, title) =>
      activity.ui === "verb-forms" ||
      activity.ui === "verbforms" ||
      activity.ui === "timeline-tenses" ||
      activity.id.includes("irregular") ||
      title.includes("verb forms") ||
      title.includes("irregular") ||
      title.includes("time indicator") ||
      title.includes("sounds right") ||
      (title.includes("timeline") && !title.includes(":")),
  },
  {
    name: "Parts of Speech",
    match: (activity, title) =>
      activity.ui === "parts-of-speech" ||
      activity.id.includes("parts-of-speech") ||
      title.includes("parts of speech") ||
      title.includes("countable") ||
      title.includes("uncountable"),
  },
  {
    name: "Gerunds & Infinitives",
    match: (activity, title) =>
      activity.ui === "gerund-infinitive" ||
      title.includes("gerund") ||
      title.includes("infinitive"),
  },
  {
    name: "Grammar & Sentences",
    match: (activity) =>
      activity.ui === "grammar-hospital" || activity.ui === "comparison-battle",
  },
  {
    name: "Numbers",
    match: (activity, title) =>
      activity.id === "numbers-game" ||
      activity.ui === "numbers" ||
      title.includes("numbers"),
  },
  {
    name: "Conversation & Fun",
    match: (activity) =>
      activity.ui === "cafe-catch-up" ||
      activity.ui === "emotion-spin-wheel" ||
      activity.ui === "trivia-game",
  },
];

export function buildGameLibrarySections<T extends GamesLibraryActivityInput>(
  activities: T[],
  normalizeTitle: (title?: string | null) => string
): Array<{ name: string; activities: T[] }> {
  const libraryGames = activities.filter(isGamesLibraryActivity);
  const remaining = [...libraryGames];

  const take = (predicate: GameLibraryMatcher) => {
    const matched: T[] = [];
    for (let i = remaining.length - 1; i >= 0; i--) {
      const item = remaining[i];
      const normalizedTitle = normalizeTitle(item.title).toLowerCase();
      if (predicate(item, normalizedTitle)) {
        matched.push(item);
        remaining.splice(i, 1);
      }
    }
    return matched.reverse();
  };

  const sortAlpha = (list: T[]) =>
    [...list].sort((a, b) => normalizeTitle(a.title).localeCompare(normalizeTitle(b.title)));

  const sections = GAME_LIBRARY_SECTION_DEFS.map(({ name, match }) => ({
    name,
    activities: sortAlpha(take(match)),
  }));

  if (remaining.length > 0) {
    sections.push({
      name: "More Games",
      activities: sortAlpha(remaining),
    });
  }

  return sections.filter((section) => section.activities.length > 0);
}
