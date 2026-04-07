import { POINTS } from "./constants";

export type GameUi = "numbers" | "matching" | "fill-in-blank" | "flashcards" | "verb-forms" | "word-list" | "ed-pronunciation" | "minimal-pairs" | "pronunciation-listening" | "irregular-verbs" | "gerund-infinitive" | "timeline-tenses" | "unknown";

export interface ActivityMeta {
  id?: string;
  ui?: string | null;
  content?: string | null;
}

export function resolveActivityGameUi(activity?: ActivityMeta): GameUi {
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
  }

  const content = activity?.content;
  if (typeof content === "string") {
    const parsed = safeJsonParse(content);
    if (parsed && typeof parsed === "object" && "type" in parsed && (parsed as Record<string, unknown>).type === "numbers-game") {
      return "numbers";
    }
    if (content.includes("Q:") && content.includes("OPTIONS:")) {
      return "fill-in-blank";
    }
    if (content.includes("::")) {
      return "matching";
    }
    if (content.includes("Verb,V1,V1-3rd") || content.includes(".csv")) {
      return "verb-forms";
    }
    // Check for ed-pronunciation content type
    if (parsed && typeof parsed === "object" && "type" in parsed && (parsed as Record<string, unknown>).type === "ed-pronunciation") {
      return "ed-pronunciation";
    }
    // Check for minimal-pairs content type
    if (parsed && typeof parsed === "object" && "type" in parsed && (parsed as Record<string, unknown>).type === "minimal-pairs") {
      return "minimal-pairs";
    }
    // Check for pronunciation-listening content type
    if (parsed && typeof parsed === "object" && "type" in parsed && (parsed as Record<string, unknown>).type === "pronunciation-listening") {
      return "pronunciation-listening";
    }
    // Check for irregular-verbs content type
    if (parsed && typeof parsed === "object" && "type" in parsed && (parsed as Record<string, unknown>).type === "irregular-verbs") {
      return "irregular-verbs";
    }
    // Check for gerund-infinitive content type
    if (parsed && typeof parsed === "object" && "type" in parsed && (parsed as Record<string, unknown>).type === "gerund-infinitive") {
      return "gerund-infinitive";
    }
    // Check for timeline-tenses content type
    if (parsed && typeof parsed === "object" && "type" in parsed && (parsed as Record<string, unknown>).type === "timeline-tenses") {
      return "timeline-tenses";
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
