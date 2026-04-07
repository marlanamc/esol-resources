"use client";

import Link from "next/link";
import { useVocabProgress } from "@/hooks/useVocabProgress";

interface Activity {
  mode: string;
  icon: string;
  title: string;
  description: string;
  minutes: number;
}

const BASE_ACTIVITIES: Activity[] = [
  {
    mode: "wordlist",
    icon: "📄",
    title: "Word List",
    description: "Review all vocabulary words with audio pronunciation.",
    minutes: 5,
  },
  {
    mode: "flashcards",
    icon: "🎴",
    title: "Flashcards",
    description: "Flip cards to practice words and their meanings.",
    minutes: 5,
  },
  {
    mode: "matching",
    icon: "🧩",
    title: "Matching",
    description: "Match pictures to the correct English words in short rounds.",
    minutes: 5,
  },
  {
    mode: "fillblank",
    icon: "✍️",
    title: "Fill in the Blank",
    description: "Complete sentences using the vocabulary words.",
    minutes: 5,
  },
];

// Map URL mode → progress key
const MODE_TO_PROGRESS_KEY: Record<string, "wordList" | "flashcards" | "matching" | "fillBlank"> = {
  wordlist: "wordList",
  flashcards: "flashcards",
  matching: "matching",
  fillblank: "fillBlank",
};

interface Props {
  unitSlug: string;
  themeId: string;
  themeTitle: string;
  themeIcon: string;
}

export function ActivityPickerClient({ unitSlug, themeId, themeTitle, themeIcon }: Props) {
  const { themeProgress, isLoading } = useVocabProgress(unitSlug, themeId);

  const activities = BASE_ACTIVITIES;

  const totalActivities = activities.length;
  const completedCount = activities.filter((a) => {
    const key = MODE_TO_PROGRESS_KEY[a.mode];
    return !!themeProgress?.[key]?.completed;
  }).length;

  return (
    <div className="pb-8">
      {/* Theme header */}
      <div className="mb-8 text-center">
        <div className="mb-3 text-5xl" aria-hidden>{themeIcon}</div>
        <h2 className="font-display text-2xl font-bold text-text sm:text-3xl">{themeTitle}</h2>
        <p className="mt-2 text-sm text-text-muted">
          Choose an activity to practice
        </p>
        {!isLoading && completedCount > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {completedCount} of {totalActivities} completed
          </div>
        )}
      </div>

      {/* Activity cards grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {activities.map((activity) => {
          const progressKey = MODE_TO_PROGRESS_KEY[activity.mode];
          const isCompleted = !isLoading && !!themeProgress?.[progressKey]?.completed;

          return (
            <Link
              key={activity.mode}
              href={`/vocab/level-1/${unitSlug}/${themeId}/${activity.mode}`}
              className={`group relative flex min-h-[120px] flex-col rounded-2xl border p-6 transition-all active:scale-[0.97] sm:min-h-[140px] ${
                isCompleted
                  ? "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm shadow-green-100 hover:-translate-y-0.5 hover:shadow-md hover:shadow-green-100"
                  : "border-[var(--tone-vocabulary-border)] bg-[var(--color-surface-contrast)] shadow-sm hover:-translate-y-0.5 hover:border-[var(--tone-vocabulary-accent)]/50 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Icon */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ring-1 ${
                  isCompleted
                    ? "bg-green-100 ring-green-200"
                    : "bg-gradient-to-br from-[var(--tone-vocabulary-accent)]/15 to-[var(--tone-vocabulary-accent)]/5 ring-[var(--tone-vocabulary-accent)]/20"
                }`}>
                  {isCompleted ? "✅" : activity.icon}
                </div>

                {/* Completion checkmark */}
                {isCompleted && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-sm">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="mt-3 flex-1">
                <h3 className={`font-display text-lg font-bold leading-tight transition-colors ${
                  isCompleted
                    ? "text-green-800"
                    : "text-text group-hover:text-[var(--tone-vocabulary-accent-strong)]"
                }`}>
                  {activity.title}
                </h3>
                <p className={`mt-1 text-sm leading-relaxed ${
                  isCompleted ? "text-green-700" : "text-text-muted"
                }`}>
                  {activity.description}
                </p>
              </div>

              {/* Footer Spacer */}
              <div className="mt-3 h-4" />
            </Link>
          );
        })}
      </div>

      {/* All done celebration */}
      {!isLoading && completedCount === totalActivities && totalActivities > 0 && (
        <div className="mt-8 rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center">
          <div className="text-4xl" aria-hidden>🎉</div>
          <p className="font-display mt-2 text-lg font-bold text-green-800">
            All activities complete!
          </p>
          <p className="mt-1 text-sm text-green-700">
            Great work practicing this theme.
          </p>
        </div>
      )}
    </div>
  );
}
