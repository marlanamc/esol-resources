import { POINTS } from "./constants";

export type GameUi = "numbers" | "matching" | "fill-in-blank" | "flashcards" | "verb-forms" | "word-list" | "unknown";

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
      default:
        return POINTS.ACTIVITY_COMPLETION;
    }
  } else if (type === "guide") {
    return POINTS.GRAMMAR_GUIDE;
  } else if (type === "speaking") {
    return POINTS.SPEAKING_ACTIVITY;
  } else if (type === "quiz") {
    return 0;
  }

  return POINTS.ACTIVITY_COMPLETION;
}
