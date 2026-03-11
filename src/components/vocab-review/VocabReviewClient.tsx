"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronDown, RotateCcw, Volume2, X } from "lucide-react";
import { ContextualBackButton } from "@/components/navigation/ContextualBackButton";
import type {
  VocabReviewCard,
  VocabReviewQueue,
  VocabReviewRating,
  VocabReviewSubmissionResult,
  VocabReviewSummary,
} from "@/types/vocab-review";
import { ALL_VOCAB_SOURCE_KEY } from "@/lib/vocab-review-sources";
import { getLearnerCategoryTone } from "@/lib/learner-theme";

type SessionCard = VocabReviewCard & {
  sessionKey: string;
};

const SESSION_LIMITS = [
  { value: 5, label: "Quick 5" },
  { value: 12, label: "Standard 12" },
  { value: 20, label: "Full 20" },
] as const;

const RATING_BUTTONS: Array<{
  rating: VocabReviewRating;
  label: string;
  colors: { bg: string; text: string; border: string };
}> = [
  {
    rating: "hard",
    label: "😓 Hard",
    colors: { bg: "#ffedd5", text: "#9a3412", border: "#fdba74" },
  },
  {
    rating: "good",
    label: "😊 Good",
    colors: { bg: "#dcfce7", text: "#166534", border: "#86efac" },
  },
  {
    rating: "easy",
    label: "🤩 Easy",
    colors: { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" },
  },
];

function makeSessionCards(cards: VocabReviewCard[]): SessionCard[] {
  return cards.map((card, index) => ({
    ...card,
    sessionKey: `${card.id}-${Date.now()}-${index}`,
  }));
}

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const data = (await response.json()) as T | { error?: string };
  if (!response.ok) {
    throw new Error(typeof data === "object" && data && "error" in data ? data.error || "Request failed" : "Request failed");
  }

  return data as T;
}

interface VocabReviewClientProps {
  initialSummary: VocabReviewSummary;
  initialQueue: VocabReviewQueue;
}

export function VocabReviewClient({ initialSummary, initialQueue }: VocabReviewClientProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [queue, setQueue] = useState(initialQueue);
  const [selectedSource, setSelectedSource] = useState(initialQueue.source);
  const [sessionCards, setSessionCards] = useState<SessionCard[]>(() => makeSessionCards(initialQueue.cards));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sessionLimit, setSessionLimit] = useState(initialQueue.limit);
  const [againCardIds, setAgainCardIds] = useState<Set<string>>(() => new Set());
  const [sessionCompleteResult, setSessionCompleteResult] = useState<{
    points: number;
    streakUpdated: boolean;
    newStreak: number;
  } | null>(null);
  const completedSessionRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const requestIdRef = useRef(0);

  const tone = getLearnerCategoryTone("vocabulary");
  const activeFilter = useMemo(
    () => summary.filters.find((filter) => filter.key === selectedSource) ?? summary.filters[0],
    [selectedSource, summary.filters]
  );
  const currentCard = sessionCards[currentIndex] ?? null;
  const reviewedCount = Math.min(currentIndex, sessionCards.length);
  const progressPercent = sessionCards.length > 0 ? Math.round((reviewedCount / sessionCards.length) * 100) : 0;
  const hasFinishedSession = sessionCards.length > 0 && currentIndex >= sessionCards.length;
  const isBusy = isLoading || isSubmitting || isPending;
  const againCount = againCardIds.size;

  // Call complete API when session finishes (once per session)
  useEffect(() => {
    if (!hasFinishedSession || completedSessionRef.current || sessionCards.length === 0) {
      return;
    }
    completedSessionRef.current = true;
    fetchJson<{ ok: boolean; points: number; streakUpdated: boolean; newStreak: number }>(
      "/api/vocab-review/complete",
      {
        method: "POST",
        body: JSON.stringify({ cardsReviewed: sessionCards.length }),
      }
    )
      .then((res) => setSessionCompleteResult({ points: res.points, streakUpdated: res.streakUpdated, newStreak: res.newStreak }))
      .catch(() => {
        completedSessionRef.current = false;
      });
  }, [hasFinishedSession, sessionCards.length]);

  const groupedFilters = useMemo(() => {
    const monthFilters = summary.filters.filter((filter) => filter.group === "month");
    const weekFilters = summary.filters.filter((filter) => filter.group === "week");
    return {
      all: summary.filters.filter((filter) => filter.group === "all"),
      months: monthFilters,
      weeks: weekFilters,
    };
  }, [summary.filters]);

  const handlePlayAudio = useCallback((term: string) => {
    const audio = new Audio(`/audio/vocab/${encodeURIComponent(term)}.mp3`);
    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Audio is optional (file may not exist)
    });
  }, []);

  // Auto-play pronunciation when card flips to show definition
  useEffect(() => {
    if (isFlipped && currentCard?.audioPath) {
      handlePlayAudio(currentCard.term);
    }
  }, [isFlipped, currentCard?.id, currentCard?.term, currentCard?.audioPath, handlePlayAudio]);

  const loadSession = useCallback(async (source: string, limit?: number) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);
    setError(null);

    const effectiveLimit = limit ?? sessionLimit;
    try {
      const query = new URLSearchParams({
        source,
        limit: String(effectiveLimit),
      });

      const [nextQueue, nextSummary] = await Promise.all([
        fetchJson<VocabReviewQueue>(`/api/vocab-review/queue?${query.toString()}`),
        fetchJson<VocabReviewSummary>("/api/vocab-review/summary"),
      ]);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setSelectedSource(source);
      setQueue(nextQueue);
      setSummary(nextSummary);
      setSessionCards(makeSessionCards(nextQueue.cards));
      setCurrentIndex(0);
      setIsFlipped(false);
      setAgainCardIds(new Set());
      setSessionCompleteResult(null);
      completedSessionRef.current = false;
      setSessionLimit(effectiveLimit);
      setIsFilterOpen(false);
    } catch (nextError) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      setError(nextError instanceof Error ? nextError.message : "Failed to load review session");
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [sessionLimit]);

  const handleSelectSource = useCallback((source: string) => {
    if (source === selectedSource) {
      setIsFilterOpen(false);
      return;
    }

    startTransition(() => {
      void loadSession(source);
    });
  }, [loadSession, selectedSource]);

  const handleRate = useCallback(async (rating: VocabReviewRating) => {
    if (!currentCard || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await fetchJson<VocabReviewSubmissionResult>("/api/vocab-review/review", {
        method: "POST",
        body: JSON.stringify({
          cardId: currentCard.id,
          rating,
          source: selectedSource,
        }),
      });

      if (rating === "again") {
        setAgainCardIds((prev) => new Set(prev).add(currentCard.id));
      }

      setSessionCards((previousCards) => {
        if (!result.shouldRepeatInSession) {
          return previousCards;
        }

        const repeatedCard: SessionCard = {
          ...currentCard,
          isNew: false,
          isDue: false,
          step: result.step,
          dueAt: result.dueAt,
          lastRating: rating,
          sessionKey: `${currentCard.id}-${Date.now()}-repeat`,
        };

        return [...previousCards, repeatedCard];
      });
      setCurrentIndex((previousIndex) => previousIndex + 1);
      setIsFlipped(false);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Failed to save review");
    } finally {
      setIsSubmitting(false);
    }
  }, [currentCard, isSubmitting, selectedSource]);

  const emptyStateTitle =
    selectedSource === ALL_VOCAB_SOURCE_KEY
      ? "You're caught up for now."
      : `No cards ready in ${activeFilter?.shortLabel ?? "this set"}.`;
  const emptyStateBody =
    selectedSource === ALL_VOCAB_SOURCE_KEY
      ? "Daily review only shows due and new cards. Pick a week or unit if you want extra practice right now."
      : "Try a different week or unit, or head back to the dashboard.";

  const handleToggleFlip = useCallback(() => {
    setIsFlipped((value) => !value);
  }, []);

  const handleFlipKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleToggleFlip();
  }, [handleToggleFlip]);

  return (
    <main id="main-content" className="fixed inset-0 z-[300] flex flex-col gap-4 overflow-y-auto bg-bg px-3 pb-24 pt-4 sm:relative sm:z-auto sm:mx-auto sm:min-h-[calc(100vh-6rem)] sm:w-full sm:max-w-2xl sm:overflow-visible sm:px-6">
      {/* ── Compact toolbar ── */}
      <nav
        className="flex items-center gap-3 rounded-2xl border px-3 py-2.5 sm:px-4"
        style={{
          borderColor: tone.border,
          background: `linear-gradient(160deg, ${tone.surface} 0%, var(--surface-elevated) 100%)`,
        }}
      >
        <ContextualBackButton fallbackHref="/dashboard" className="shrink-0" aria-label="Back to dashboard" />

        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, ${tone.accent} 0%, ${tone.accentStrong} 100%)`,
            }}
          />
        </div>

        <span className="shrink-0 text-sm font-bold tabular-nums text-text/65" style={{ fontVariantNumeric: "tabular-nums" }}>
          {reviewedCount}/{sessionCards.length}
        </span>

        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold text-text transition-[background-color,box-shadow] hover:bg-white/70 focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2 dark:hover:bg-white/5"
          style={{ borderColor: tone.border, background: "var(--surface-elevated)" }}
        >
          <span className="hidden sm:inline">Filters</span>
          <span className="sm:hidden">Set</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </nav>

      {/* ── Error banner ── */}
      {error ? (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      {/* ── Loading skeleton ── */}
      {isBusy && sessionCards.length === 0 ? (
        <section className="grid flex-1 place-items-center">
          <div className="w-full rounded-[32px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6 shadow-[0_16px_38px_rgba(20,20,20,0.08)]">
            <div className="h-5 w-32 animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
            <div className="mt-6 h-[320px] animate-pulse rounded-[28px] bg-black/5 dark:bg-white/10" />
          </div>
        </section>
      ) : null}

      {/* ── Active card ── */}
      {!isBusy && currentCard ? (
        <section className="flex flex-1 flex-col gap-4">
          <div
            role="button"
            tabIndex={0}
            onClick={handleToggleFlip}
            onKeyDown={handleFlipKeyDown}
            aria-label={isFlipped ? "Show vocab prompt" : "Show vocab answer"}
            className="relative flex min-h-[360px] flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[32px] border bg-[var(--surface-elevated)] p-6 text-center shadow-[0_18px_44px_rgba(29,53,56,0.08)] transition-[transform,box-shadow] focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2 active:scale-[0.995] sm:p-10"
            style={{ borderColor: tone.border }}
          >
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-3xl" style={{ background: tone.accent }} />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_70%)]" />

            {/* Audio button – top-right */}
            {currentCard.audioPath ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handlePlayAudio(currentCard.term);
                }}
                className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full border text-text transition-[background-color,transform] hover:bg-white/70 focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2 active:scale-95 dark:hover:bg-white/5"
                style={{ borderColor: tone.border, background: "var(--surface-overlay)" }}
                aria-label={`Play audio for ${currentCard.term}`}
              >
                <Volume2 className="h-5 w-5" />
              </button>
            ) : null}

            {/* Card content */}
            <div className="relative flex w-full max-w-lg flex-col items-center gap-5">
              {!isFlipped ? (
                  <h2 className="font-display text-4xl font-bold leading-tight text-text sm:text-5xl" style={{ textWrap: "balance" }}>
                    {currentCard.term}
                  </h2>
              ) : (
                <>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-text/45">Definition</p>
                  <h2 className="font-display text-3xl font-bold leading-tight text-text sm:text-4xl" style={{ textWrap: "balance" }}>
                    {currentCard.definition}
                  </h2>
                  {currentCard.example ? (
                    <div className="w-full rounded-2xl border-2 px-4 py-3.5" style={{ borderColor: tone.border, background: "color-mix(in srgb, var(--surface-overlay) 80%, white)" }}>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text/55">Example</p>
                      <p className="mt-1.5 text-base font-medium italic leading-relaxed text-text/90">
                        &ldquo;{currentCard.example}&rdquo;
                      </p>
                    </div>
                  ) : null}
                </>
              )}
            </div>




            {/* Flip hint – only when front is showing */}
            {!isFlipped ? (
              <p className="absolute bottom-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text/30">
                Tap to flip
              </p>
            ) : null}
          </div>

          {/* ── Rating buttons ── */}
          {isFlipped ? (
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {RATING_BUTTONS.map((button) => (
                <button
                  key={button.rating}
                  type="button"
                  onClick={() => void handleRate(button.rating)}
                  disabled={isBusy}
                  style={{ backgroundColor: button.colors.bg, color: button.colors.text, borderWidth: 2, borderStyle: "solid", borderColor: button.colors.border }}
                  className="rounded-2xl py-3.5 text-center text-[15px] font-bold transition-[transform,opacity] focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {button.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="py-3 text-center text-sm font-medium text-text/40">
              Flip the card, then rate how well you knew it
            </p>
          )}
        </section>
      ) : null}

      {/* ── Empty state ── */}
      {!isBusy && !currentCard && !hasFinishedSession ? (
        <section className="grid flex-1 place-items-center">
          <div className="w-full rounded-[32px] border bg-[var(--surface-elevated)] p-6 text-center shadow-[0_18px_40px_rgba(30,35,40,0.08)]" style={{ borderColor: tone.border }}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: tone.chipBg, color: tone.chipText }}>
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold text-text" style={{ textWrap: "balance" }}>{emptyStateTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text/72 sm:text-base">{emptyStateBody}</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold text-text transition-[background-color] hover:bg-white/70 focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2 dark:hover:bg-white/5"
                style={{ borderColor: tone.border }}
              >
                Pick a filter
                <ChevronDown className="h-4 w-4" />
              </button>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold text-text transition-[background-color] hover:bg-white/70 focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2 dark:hover:bg-white/5"
                style={{ borderColor: tone.border }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Session complete ── */}
      {!isBusy && hasFinishedSession ? (
        <section className="grid flex-1 place-items-center">
          <div className="w-full rounded-[32px] border bg-[var(--surface-elevated)] p-6 text-center shadow-[0_18px_40px_rgba(30,35,40,0.08)]" style={{ borderColor: tone.border }}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: tone.chipBg, color: tone.chipText }}>
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold text-text">Session complete</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text/72 sm:text-base">
              You reviewed {sessionCards.length} card{sessionCards.length === 1 ? "" : "s"} from {activeFilter?.shortLabel ?? queue.sourceLabel}.
              {againCount > 0 ? (
                <span className="mt-2 block font-medium text-text/90">
                  {againCount} need more practice—you&apos;ll see them again soon.
                </span>
              ) : null}
            </p>
            {sessionCompleteResult ? (
              <p className="mt-2 flex items-center justify-center gap-2 text-base font-bold" style={{ color: tone.accent }}>
                +{sessionCompleteResult.points} points
                {sessionCompleteResult.streakUpdated && sessionCompleteResult.newStreak > 0 ? (
                  <span className="rounded-full px-2.5 py-0.5 text-sm" style={{ background: tone.chipBg, color: tone.chipText }}>
                    🔥 {sessionCompleteResult.newStreak}-day streak
                  </span>
                ) : null}
              </p>
            ) : null}
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              {queue.hasMore ? (
                <button
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      void loadSession(selectedSource, sessionLimit);
                    });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold text-[color:var(--text-on-accent)] transition-[transform] focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2 active:scale-[0.98]"
                  style={{
                    borderColor: tone.accent,
                    background: `linear-gradient(135deg, ${tone.accent} 0%, ${tone.accentStrong} 100%)`,
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Review more
                </button>
              ) : null}
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold text-text transition-[background-color] hover:bg-white/70 focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2 dark:hover:bg-white/5"
                style={{ borderColor: tone.border }}
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Filter bottom sheet ── */}
      {isFilterOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[320] bg-black/45 backdrop-blur-[2px]"
            onClick={() => setIsFilterOpen(false)}
            aria-label="Close filter picker"
          />
          <div
            className="fixed inset-x-0 bottom-0 z-[330] mx-auto max-h-[82vh] max-w-lg overflow-y-auto rounded-t-[32px] border border-b-0 bg-[var(--surface-elevated)] px-4 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] pt-4 shadow-[0_-18px_42px_rgba(0,0,0,0.16)] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-[32px] sm:border-b sm:shadow-[0_24px_56px_rgba(0,0,0,0.2)]"
            style={{ overscrollBehavior: "contain" }}
          >
            <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-black/10 dark:bg-white/10" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-text/55">Study filters</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-text">Choose a vocab set</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2"
                style={{ borderColor: tone.border }}
                aria-label="Close filter picker"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-text/55">Session size</h3>
              <div className="mt-2 flex gap-2">
                {SESSION_LIMITS.map((opt) => {
                  const isActive = sessionLimit === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSessionLimit(opt.value);
                        startTransition(() => {
                          void loadSession(selectedSource, opt.value);
                        });
                      }}
                      className={`flex-1 rounded-2xl border-2 px-4 py-3 text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2 ${
                        isActive ? "shadow-md" : "hover:bg-white/50 dark:hover:bg-white/5"
                      }`}
                      style={{
                        borderColor: isActive ? tone.accent : tone.border,
                        background: isActive ? tone.surfaceMuted : "var(--surface-elevated)",
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {[
              { title: "All review", filters: groupedFilters.all },
              { title: "Monthly units", filters: groupedFilters.months },
              { title: "Weekly sets", filters: groupedFilters.weeks },
            ].map((section) =>
              section.filters.length > 0 ? (
                <div key={section.title} className="mt-6 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-text/55">{section.title}</h3>
                  <div className="space-y-2">
                    {section.filters.map((filter) => {
                      const isActive = filter.key === selectedSource;
                      return (
                        <button
                          key={filter.key}
                          type="button"
                          onClick={() => handleSelectSource(filter.key)}
                          className={`flex w-full items-center justify-between rounded-3xl border px-4 py-4 text-left transition-[background-color,border-color,box-shadow] focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2 ${
                            isActive ? "shadow-[0_10px_24px_rgba(34,65,58,0.08)]" : "hover:bg-white/70 dark:hover:bg-white/5"
                          }`}
                          style={{
                            borderColor: isActive ? tone.accent : tone.border,
                            background: isActive ? tone.surfaceMuted : "var(--surface-elevated)",
                          }}
                        >
                          <div>
                            <div className="text-sm font-bold text-text">{filter.label}</div>
                            <div className="mt-1 text-xs font-medium text-text/65">
                              {filter.dueCount} due · {filter.newCount} new · {filter.totalCount} total
                            </div>
                          </div>
                          {isActive ? (
                            <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]" style={{ background: tone.chipBg, color: tone.chipText }}>
                              Active
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </>
      ) : null}
    </main>
  );
}
