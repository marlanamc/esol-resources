import { POINTS } from "./constants";

export type GameUi = "numbers" | "matching" | "fill-in-blank" | "flashcards" | "verb-forms" | "word-list" | "ed-pronunciation" | "minimal-pairs" | "pronunciation-listening" | "irregular-verbs" | "gerund-infinitive" | "timeline-tenses" | "parts-of-speech" | "unknown";

export interface ActivityMeta {
  id?: string;
  ui?: string | null;
  content?: string | null;
}

function gameUiFromJsonType(parsed: unknown): GameUi | null {
  if (!parsed || typeof parsed !== "object" || !("type" in parsed)) return null;
  const t = (parsed as Record<string, unknown>).type;
  switch (t) {
    case "numbers-game":
      return "numbers";
    case "ed-pronunciation":
      return "ed-pronunciation";
    case "minimal-pairs":
      return "minimal-pairs";
    case "pronunciation-listening":
      return "pronunciation-listening";
    case "irregular-verbs":
      return "irregular-verbs";
    case "gerund-infinitive":
      return "gerund-infinitive";
    case "timeline-tenses":
      return "timeline-tenses";
    case "parts-of-speech":
      return "parts-of-speech";
    default:
      return null;
  }
}

export function resolveActivityGameUi(activity?: ActivityMeta): GameUi {
  const content = activity?.content;
  const parsed = typeof content === "string" ? safeJsonParse(content) : null;
  // Structured JSON payloads must win over `ui` (e.g. ui: "flashcards" + type: "parts-of-speech" misroutes to FlashcardRenderer and can SSR/hydration mismatch with ResourceRenderer fallbacks).
  const fromJson = gameUiFromJsonType(parsed);
  if (fromJson) return fromJson;

  const ui = activity?.ui?.trim().toLowerCase();
  if (ui) {
    if (ui === "matching") return "matching";
    if (ui === "word-list" || ui === "wordlist" || ui === "list") return "word-list";
    if (ui === "numbers" || ui === "numbers-game") return "numbers";
    if (ui === "fill-in-blank" || ui === "fillblank") return "fill-in-blank";
    if (ui === "flashcards" || ui === "flashcard") return "flashcards";
    if (ui === "verb-forms" || ui === "verbforms") return "verb-forms";
    if (ui === "ed-pronunciation" || ui === "ed-sounds" || ui === "pronunciation") return "ed-pronunciation";
    if (ui === "minimal-pairs" || ui === "minimalpairs" || ui === "minimal-pairs-listening") return "minimal-pairs";
    if (ui === "pronunciation-listening" || ui === "sentence-listening") return "pronunciation-listening";
    if (ui === "irregular-verbs") return "irregular-verbs";
    if (ui === "gerund-infinitive" || ui === "gerunds-infinitives" || ui === "gerund-infinitive-patterns") return "gerund-infinitive";
    if (ui === "timeline-tenses" || ui === "timeline" || ui === "tenses-timeline") return "timeline-tenses";
    if (ui === "parts-of-speech" || ui === "pos-game") return "parts-of-speech";
  }

  if (typeof content === "string") {
    if (content.includes("Q:") && content.includes("OPTIONS:")) {
      return "fill-in-blank";
    }
    if (content.includes("::")) {
      return "matching";
    }
    if (content.includes("Verb,V1,V1-3rd") || content.includes(".csv")) {
      return "verb-forms";
    }
  }

  return "flashcards";
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function getActivityPoints(activityType: string, activity?: ActivityMeta): number {
  const type = activityType.toLowerCase();

  if (type === "game") {
    const gameUi = resolveActivityGameUi(activity);

    switch (gameUi) {
      case "matching":
        return POINTS.MATCHING_GAME;
      case "fill-in-blank":
        return POINTS.FILL_IN_BLANK;
      case "flashcards":
        return POINTS.FLASHCARDS;
      case "numbers":
        return POINTS.NUMBERS_GAME_EASY;
      case "verb-forms":
        return POINTS.MATCHING_GAME; // Use matching game points for now as it's similar complexity
      case "ed-pronunciation":
        return POINTS.ED_PRONUNCIATION;
      case "minimal-pairs":
        return POINTS.MINIMAL_PAIRS;
      case "pronunciation-listening":
        return POINTS.MINIMAL_PAIRS;
      case "timeline-tenses":
        return POINTS.TIMELINE_TENSES;
      default:
        return POINTS.ACTIVITY_COMPLETION;
    }
  } else if (type === "writing") {
    return POINTS.TIMED_WRITING;
  } else if (type === "guide") {
    return POINTS.GRAMMAR_GUIDE;
  } else if (type === "speaking") {
    return POINTS.SPEAKING_ACTIVITY;
  } else if (type === "quiz") {
    return 0;
  } else if (type === "vocabulary") {
    // Vocabulary activities award points per type (handled per-type in progress API)
    // This is a fallback that shouldn't normally be used
    return POINTS.ACTIVITY_COMPLETION;
  }

  return POINTS.ACTIVITY_COMPLETION;
}

/**
 * Get points for a specific vocabulary type
 * Called when awarding points for individual vocab type completion
 */
export function getVocabularyTypePoints(vocabType: string): number {
  const vocabPoints: Record<string, number> = {
    'word-list': 5,
    'flashcards': 4,
    'matching': 7,
    'fill-blank': 5,
  };
  return vocabPoints[vocabType] || 5;
}
