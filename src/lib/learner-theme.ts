type LearnerToneKey =
  | "grammar"
  | "vocabulary"
  | "quizzes"
  | "games"
  | "pronunciation"
  | "reading"
  | "writing"
  | "speaking"
  | "default";

export type LearnerTone = {
  key: LearnerToneKey;
  label: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  accent: string;
  accentStrong: string;
  chipBg: string;
  chipText: string;
};

const TONES: Record<LearnerToneKey, LearnerTone> = {
  grammar: {
    key: "grammar",
    label: "Grammar",
    surface: "var(--tone-grammar-surface)",
    surfaceMuted: "var(--tone-grammar-surface-muted)",
    border: "var(--tone-grammar-border)",
    accent: "var(--tone-grammar-accent)",
    accentStrong: "var(--tone-grammar-accent-strong)",
    chipBg: "var(--tone-grammar-chip-bg)",
    chipText: "var(--tone-grammar-chip-text)",
  },
  vocabulary: {
    key: "vocabulary",
    label: "Vocabulary",
    surface: "var(--tone-vocabulary-surface)",
    surfaceMuted: "var(--tone-vocabulary-surface-muted)",
    border: "var(--tone-vocabulary-border)",
    accent: "var(--tone-vocabulary-accent)",
    accentStrong: "var(--tone-vocabulary-accent-strong)",
    chipBg: "var(--tone-vocabulary-chip-bg)",
    chipText: "var(--tone-vocabulary-chip-text)",
  },
  quizzes: {
    key: "quizzes",
    label: "Quiz",
    surface: "var(--tone-quizzes-surface)",
    surfaceMuted: "var(--tone-quizzes-surface-muted)",
    border: "var(--tone-quizzes-border)",
    accent: "var(--tone-quizzes-accent)",
    accentStrong: "var(--tone-quizzes-accent-strong)",
    chipBg: "var(--tone-quizzes-chip-bg)",
    chipText: "var(--tone-quizzes-chip-text)",
  },
  games: {
    key: "games",
    label: "Games",
    surface: "var(--tone-games-surface)",
    surfaceMuted: "var(--tone-games-surface-muted)",
    border: "var(--tone-games-border)",
    accent: "var(--tone-games-accent)",
    accentStrong: "var(--tone-games-accent-strong)",
    chipBg: "var(--tone-games-chip-bg)",
    chipText: "var(--tone-games-chip-text)",
  },
  pronunciation: {
    key: "pronunciation",
    label: "Pronunciation",
    surface: "var(--tone-pronunciation-surface)",
    surfaceMuted: "var(--tone-pronunciation-surface-muted)",
    border: "var(--tone-pronunciation-border)",
    accent: "var(--tone-pronunciation-accent)",
    accentStrong: "var(--tone-pronunciation-accent-strong)",
    chipBg: "var(--tone-pronunciation-chip-bg)",
    chipText: "var(--tone-pronunciation-chip-text)",
  },
  reading: {
    key: "reading",
    label: "Reading",
    surface: "var(--tone-reading-surface)",
    surfaceMuted: "var(--tone-reading-surface-muted)",
    border: "var(--tone-reading-border)",
    accent: "var(--tone-reading-accent)",
    accentStrong: "var(--tone-reading-accent-strong)",
    chipBg: "var(--tone-reading-chip-bg)",
    chipText: "var(--tone-reading-chip-text)",
  },
  writing: {
    key: "writing",
    label: "Writing",
    surface: "var(--tone-writing-surface)",
    surfaceMuted: "var(--tone-writing-surface-muted)",
    border: "var(--tone-writing-border)",
    accent: "var(--tone-writing-accent)",
    accentStrong: "var(--tone-writing-accent-strong)",
    chipBg: "var(--tone-writing-chip-bg)",
    chipText: "var(--tone-writing-chip-text)",
  },
  speaking: {
    key: "speaking",
    label: "Speaking",
    surface: "var(--tone-speaking-surface)",
    surfaceMuted: "var(--tone-speaking-surface-muted)",
    border: "var(--tone-speaking-border)",
    accent: "var(--tone-speaking-accent)",
    accentStrong: "var(--tone-speaking-accent-strong)",
    chipBg: "var(--tone-speaking-chip-bg)",
    chipText: "var(--tone-speaking-chip-text)",
  },
  default: {
    key: "default",
    label: "Activity",
    surface: "var(--tone-default-surface)",
    surfaceMuted: "var(--tone-default-surface-muted)",
    border: "var(--tone-default-border)",
    accent: "var(--tone-default-accent)",
    accentStrong: "var(--tone-default-accent-strong)",
    chipBg: "var(--tone-default-chip-bg)",
    chipText: "var(--tone-default-chip-text)",
  },
};

export function getLearnerCategoryTone(category?: string | null): LearnerTone {
  const key = (category || "").toLowerCase();
  if (key === "grammar") return TONES.grammar;
  if (key === "vocab" || key === "vocabulary" || key === "numbers" || key === "number") {
    return TONES.vocabulary;
  }
  if (key === "quiz" || key === "quizzes") return TONES.quizzes;
  if (key === "reading" || key === "listening") return TONES.reading;
  if (key === "writing") return TONES.writing;
  if (key === "speaking") return TONES.speaking;
  if (key === "pronunciation") return TONES.pronunciation;
  if (key === "games" || key === "activity") return TONES.games;
  return TONES.default;
}

type EventToneKey = "quiz" | "holiday" | "due" | "other";

export type EventTone = {
  accent: string;
  bg: string;
  border: string;
  text: string;
};

const EVENT_TONES: Record<EventToneKey, EventTone> = {
  quiz: {
    accent: "var(--tone-event-quiz-accent)",
    bg: "var(--tone-event-quiz-bg)",
    border: "var(--tone-event-quiz-border)",
    text: "var(--tone-event-quiz-text)",
  },
  holiday: {
    accent: "var(--tone-event-holiday-accent)",
    bg: "var(--tone-event-holiday-bg)",
    border: "var(--tone-event-holiday-border)",
    text: "var(--tone-event-holiday-text)",
  },
  due: {
    accent: "var(--tone-event-due-accent)",
    bg: "var(--tone-event-due-bg)",
    border: "var(--tone-event-due-border)",
    text: "var(--tone-event-due-text)",
  },
  other: {
    accent: "var(--tone-event-other-accent)",
    bg: "var(--tone-event-other-bg)",
    border: "var(--tone-event-other-border)",
    text: "var(--tone-event-other-text)",
  },
};

export function getLearnerEventTone(type?: string | null): EventTone {
  if (type === "quiz") return EVENT_TONES.quiz;
  if (type === "holiday") return EVENT_TONES.holiday;
  if (type === "due" || type === "reminder") return EVENT_TONES.due;
  return EVENT_TONES.other;
}
