"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ArrowLeft, CheckCircle2, ChevronDown, HelpCircle, RotateCcw, Volume2, X, Sparkles, BrainCircuit, CalendarSync } from "lucide-react";
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

type ReviewButtonRating = Exclude<VocabReviewRating, "again">;
const DEFAULT_SESSION_LIMIT = 6;

const RATING_BUTTONS: Array<{
  rating: ReviewButtonRating;
  label: string;
  shortcut: string;
}> = [
  {
    rating: "hard",
    label: "😓 Hard",
    shortcut: "1"
  },
  {
    rating: "good",
    label: "🤔 OK",
    shortcut: "2"
  },
  {
    rating: "easy",
    label: "😊 Easy",
    shortcut: "3"
  },
];

const RATING_STYLES: Record<
  ReviewButtonRating,
  {
    background: string;
    borderColor: string;
    color: string;
    boxShadow: string;
  }
> = {
  hard: {
    background: "color-mix(in srgb, #f87171 18%, var(--surface-elevated))",
    borderColor: "color-mix(in srgb, #dc2626 36%, var(--border-subtle))",
    color: "color-mix(in srgb, #7f1d1d 78%, var(--text))",
    boxShadow: "inset 0 1px 0 color-mix(in srgb, white 30%, transparent)",
  },
  good: {
    background: "color-mix(in srgb, #60a5fa 18%, var(--surface-elevated))",
    borderColor: "color-mix(in srgb, #2563eb 36%, var(--border-subtle))",
    color: "color-mix(in srgb, #1e3a8a 78%, var(--text))",
    boxShadow: "inset 0 1px 0 color-mix(in srgb, white 30%, transparent)",
  },
  easy: {
    background: "color-mix(in srgb, #34d399 20%, var(--surface-elevated))",
    borderColor: "color-mix(in srgb, #059669 38%, var(--border-subtle))",
    color: "color-mix(in srgb, #064e3b 78%, var(--text))",
    boxShadow: "inset 0 1px 0 color-mix(in srgb, white 30%, transparent)",
  },
};

function makeSessionCards(cards: VocabReviewCard[]): SessionCard[] {
  return cards.map((card, index) => ({
    ...card,
    sessionKey: `${card.id}-${Date.now()}-${index}`,
  }));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderExampleWithHighlightedTerm(example: string, term: string) {
  const trimmedTerm = term.trim();
  if (!trimmedTerm) {
    return example;
  }

  const pattern = new RegExp(`(${escapeRegExp(trimmedTerm)})`, "gi");
  const parts = example.split(pattern);
  if (parts.length === 1) {
    return example;
  }

  return parts.map((part, index) => (
    part.toLowerCase() === trimmedTerm.toLowerCase() ? (
      <strong key={`${part}-${index}`} className="font-extrabold not-italic text-text">
        {part}
      </strong>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  ));
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
  const [isHelpOpen, setIsHelpOpen] = useState(false);
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
  const remainingActionableCount = queue.dueCount + queue.newCount;
  const canStartAnotherSession = queue.cards.length > 0;

  const navigateToDashboard = useCallback(() => {
    window.location.assign("/dashboard");
  }, []);

  // Call complete API when session finishes (once per session)
  useEffect(() => {
    if (!hasFinishedSession || completedSessionRef.current || sessionCards.length === 0) {
      return;
    }
    completedSessionRef.current = true;
    Promise.all([
      fetchJson<{ ok: boolean; points: number; streakUpdated: boolean; newStreak: number }>(
        "/api/vocab-review/complete",
        {
          method: "POST",
          body: JSON.stringify({ cardsReviewed: sessionCards.length }),
        }
      ),
      fetchJson<VocabReviewSummary>("/api/vocab-review/summary"),
      fetchJson<VocabReviewQueue>(`/api/vocab-review/queue?${new URLSearchParams({
        source: selectedSource,
        limit: String(DEFAULT_SESSION_LIMIT),
      }).toString()}`),
    ])
      .then(([res, nextSummary, nextQueue]) => {
        setSessionCompleteResult({ points: res.points, streakUpdated: res.streakUpdated, newStreak: res.newStreak });
        setSummary(nextSummary);
        setQueue(nextQueue);
      })
      .catch(() => {
        completedSessionRef.current = false;
      });
  }, [hasFinishedSession, selectedSource, sessionCards.length]);

  const audioPlayedRef = useRef<string | null>(null);

  const groupedFilters = useMemo(() => {
    const monthFilters = summary.filters.filter((filter) => filter.group === "month");
    const weekFilters = summary.filters.filter((filter) => filter.group === "week");
    return {
      all: summary.filters.filter((filter) => filter.group === "all"),
      months: monthFilters,
      weeks: weekFilters,
    };
  }, [summary.filters]);

  const handlePlayAudio = useCallback((term: string, cardId: string) => {
    audioPlayedRef.current = cardId;
    const audio = new Audio(`/audio/vocab/${encodeURIComponent(term)}.mp3`);
    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Audio is optional (file may not exist)
    });
  }, []);

  const loadSession = useCallback(async (source: string) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        source,
        limit: String(DEFAULT_SESSION_LIMIT),
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
  }, []);

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

  // Keyboard shortcuts for ratings
  useEffect(() => {
    if (!isFlipped || isBusy) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      if (event.key === "1") {
        void handleRate("hard");
      } else if (event.key === "2") {
        void handleRate("good");
      } else if (event.key === "3") {
        void handleRate("easy");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, isBusy, handleRate]);

  return (
    <main id="main-content" className="fixed inset-0 z-[300] flex flex-col gap-4 overflow-y-auto bg-bg px-3 pb-24 pt-4 sm:relative sm:z-auto sm:mx-auto sm:min-h-[calc(100vh-6rem)] sm:w-full sm:max-w-2xl sm:overflow-visible sm:px-6">
      {/* ── Compact toolbar ── */}
      <nav
        className="flex items-center gap-3 rounded-2xl border px-3 py-2.5 shadow-sm backdrop-blur-md sm:px-4"
        style={{
          borderColor: tone.border,
          background: `linear-gradient(160deg, color-mix(in srgb, ${tone.surface} 80%, transparent) 0%, color-mix(in srgb, var(--surface-elevated) 80%, transparent) 100%)`,
        }}
      >
        <ContextualBackButton fallbackHref="/dashboard" onClick={navigateToDashboard} className="shrink-0" aria-label="Back to dashboard" />

        <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, ${tone.accent} 0%, ${tone.accentStrong} 100%)`,
              boxShadow: `0 0 12px ${tone.accent}40`,
            }}
          />
        </div>

        <span className="shrink-0 text-xs font-bold tabular-nums text-text/65 sm:text-sm">
          {reviewedCount} <span className="opacity-40">/</span> {sessionCards.length}
        </span>

        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold text-text transition-all hover:scale-105 active:scale-95 sm:px-4 sm:text-sm"
          style={{ 
            borderColor: tone.border, 
            background: "var(--surface-elevated)",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <span className="hidden sm:inline">Filters</span>
          <span className="sm:hidden">Set</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </button>

        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-text transition-all hover:scale-105 active:scale-95"
          style={{
            borderColor: tone.border,
            background: "var(--surface-elevated)",
            boxShadow: "var(--shadow-sm)",
          }}
          aria-label="How daily vocab review works"
        >
          <HelpCircle className="h-4.5 w-4.5 opacity-80" />
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
        <section className="flex flex-1 flex-col gap-5">
          <div
            role="button"
            tabIndex={0}
            onClick={handleToggleFlip}
            onKeyDown={handleFlipKeyDown}
            aria-label={isFlipped ? "Show vocab prompt" : "Show vocab answer"}
            className="group relative flex min-h-[380px] flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[32px] border bg-gradient-to-br from-[var(--surface-elevated)] to-[var(--surface-subtle)] p-6 text-center shadow-xl transition-all duration-500 hover:shadow-2xl active:scale-[0.99] sm:p-10"
            style={{ 
              borderColor: tone.border,
            }}
          >
            {/* Background flourish */}
            <div 
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-5 blur-3xl transition-opacity group-hover:opacity-10"
              style={{ background: tone.accent }}
            />
            {/* Top Bar (Chip + Audio) */}
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2 sm:left-8 sm:top-8">
              <span 
                className={`rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] shadow-sm transition-all duration-500 sm:text-xs ${
                  !isFlipped
                    ? "bg-primary text-white border-primary-dark"
                    : "bg-secondary text-white border-secondary-dark"
                }`}
              >
                {!isFlipped ? "Term" : "Definition"}
              </span>
            </div>

            {/* Audio button – top-right */}
            {currentCard.audioPath && !isFlipped ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handlePlayAudio(currentCard.term, currentCard.id);
                }}
                className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white/60 text-text shadow-sm backdrop-blur-sm transition-all hover:bg-white/90 active:scale-90 sm:right-8 sm:top-8 sm:h-14 sm:w-14"
                style={{ borderColor: tone.border }}
                aria-label={`Play audio for ${currentCard.term}`}
              >
                <Volume2 className="h-5 w-5 opacity-70 sm:h-6 sm:w-6" />
              </button>
            ) : null}

            {/* Card Content – with transition wrap */}
            <div className="relative flex w-full max-w-lg flex-col items-center gap-6 mt-4 transition-all duration-300">
              {!isFlipped ? (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <h2 className="font-display text-4xl font-extrabold leading-[1.1] text-text sm:text-6xl" style={{ textWrap: "balance" }}>
                    {currentCard.term}
                  </h2>
                  <div className="mx-auto mt-6 h-1 w-12 rounded-full opacity-20" style={{ background: tone.accent }} />
                </div>
              ) : (
                <div className="flex w-full flex-col gap-14 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-display text-2xl font-bold leading-tight text-text sm:text-4xl" style={{ textWrap: "balance" }}>
                    {currentCard.definition}
                  </h2>
                  
                  {currentCard.example ? (
                    <div 
                      className="group/example relative w-full overflow-hidden rounded-3xl border px-5 py-5 text-left transition-colors sm:px-8 sm:py-6" 
                      style={{ 
                        borderColor: tone.border, 
                        background: `color-mix(in srgb, var(--surface-overlay) 38%, var(--surface-elevated))` 
                      }}
                    >
                      <div className="absolute left-0 top-5 h-[calc(100%-2.5rem)] w-1" style={{ background: tone.accent }} />
                      <p className="pl-4 text-base font-medium leading-relaxed text-text/78 italic sm:text-[1.05rem]">
                        &ldquo;{renderExampleWithHighlightedTerm(currentCard.example, currentCard.term)}&rdquo;
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Flip hint */}
            <div className="absolute bottom-6 left-0 w-full animate-pulse transition-opacity duration-300">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text/25 sm:text-[11px]">
                {isFlipped ? "Tap to return" : "Tap to reveal"}
              </p>
            </div>
          </div>

          {/* ── Rating buttons ── */}
          {isFlipped ? (
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 px-1">
              {RATING_BUTTONS.map((button) => (
                <button
                  key={button.rating}
                  type="button"
                  onClick={() => void handleRate(button.rating)}
                  disabled={isBusy}
                  className="group/btn relative flex min-h-[76px] items-center justify-center overflow-hidden rounded-2xl border-2 px-3 py-3.5 transition-all duration-200 focus-visible:ring-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  style={RATING_STYLES[button.rating]}
                >
                  <span className="text-[13px] font-black uppercase tracking-wider sm:text-[14px]">{button.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex h-[72px] items-center justify-center">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-text/20 sm:text-[11px]">
                Reveal to rate
              </p>
            </div>
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
              <button
                type="button"
                onClick={navigateToDashboard}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold text-text transition-[background-color] hover:bg-white/70 focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2 dark:hover:bg-white/5"
                style={{ borderColor: tone.border }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </button>
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
              <span className="mt-2 block font-medium text-text/80">
                {remainingActionableCount > 0
                      ? `${remainingActionableCount} card${remainingActionableCount === 1 ? "" : "s"} are still ready in this set (${queue.dueCount} due, ${queue.newCount} new).`
                      : "No due or new cards are left in this set right now."}
              </span>
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
              {canStartAnotherSession ? (
                <button
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      void loadSession(selectedSource);
                    });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition-[transform] focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2 active:scale-[0.98]"
                  style={{
                    borderColor: tone.accent,
                    background: `linear-gradient(135deg, ${tone.accent} 0%, ${tone.accentStrong} 100%)`,
                    color: '#183247',
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Start next session
                </button>
              ) : null}
              <button
                type="button"
                onClick={navigateToDashboard}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold text-text transition-[background-color] hover:bg-white/70 focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2 dark:hover:bg-white/5"
                style={{ borderColor: tone.border }}
              >
                Back to dashboard
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Filter bottom sheet ── */}
      {isFilterOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[320] bg-black/45 backdrop-blur-md transition-all duration-500 animate-in fade-in"
            onClick={() => setIsFilterOpen(false)}
            aria-label="Close filter picker"
          />
          <div
            className="safe-area-bottom-padding-mobile-lg fixed inset-x-0 bottom-0 z-[330] mx-auto max-h-[85vh] max-w-lg overflow-y-auto rounded-t-[36px] border border-white/10 bg-[var(--surface-elevated)]/90 px-5 pt-5 shadow-[0_-24px_64px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-500 animate-in slide-in-from-bottom-8 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-[36px] sm:border sm:shadow-[0_32px_80px_rgba(0,0,0,0.25)]"
            style={{ 
              overscrollBehavior: "contain",
              background: `linear-gradient(180deg, color-mix(in srgb, var(--surface-elevated) 95%, transparent) 0%, color-mix(in srgb, var(--surface-subtle) 90%, transparent) 100%)`, 
            }}
          >
            {/* Background glowing orb */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: tone.accent }} />

            <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-black/10 dark:bg-white/10" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-text/50">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: tone.accent }} />
                  Study filters
                </p>
                <h2 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-text">Choose a vocab set</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white/5 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10 active:scale-95 focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2"
                style={{ borderColor: "color-mix(in srgb, var(--border-subtle) 50%, transparent)" }}
                aria-label="Close filter picker"
              >
                <X className="h-4.5 w-4.5 opacity-70 transition-opacity group-hover:opacity-100" />
              </button>
            </div>

            <div className="relative pb-8">
              {[
                { title: "All review", filters: groupedFilters.all },
                { title: "Monthly units", filters: groupedFilters.months },
                { title: "Weekly sets", filters: groupedFilters.weeks },
              ].map((section) =>
                section.filters.length > 0 ? (
                  <div key={section.title} className="mt-8 space-y-3">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-text/50">{section.title}</h3>
                    <div className="space-y-2">
                      {section.filters.map((filter) => {
                        const isActive = filter.key === selectedSource;
                        return (
                          <button
                            key={filter.key}
                            type="button"
                            onClick={() => handleSelectSource(filter.key)}
                            className={`group relative flex w-full items-center justify-between overflow-hidden rounded-[24px] border px-4 py-4 text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2 ${
                              isActive ? "scale-[1.02] shadow-[0_12px_32px_rgba(20,20,20,0.12)]" : "hover:scale-[1.01]"
                            }`}
                            style={{
                              borderColor: isActive ? `color-mix(in srgb, ${tone.accent} 40%, transparent)` : "color-mix(in srgb, var(--border-subtle) 50%, transparent)",
                              background: isActive ? `linear-gradient(135deg, color-mix(in srgb, ${tone.surfaceMuted} 80%, var(--surface-elevated)) 0%, color-mix(in srgb, ${tone.surface} 50%, var(--surface-subtle)) 100%)` : "color-mix(in srgb, var(--surface-elevated) 45%, transparent)",
                              boxShadow: isActive ? `inset 0 1px 0 color-mix(in srgb, white 20%, transparent), 0 8px 24px ${tone.accent}15` : undefined,
                            }}
                          >
                            {isActive && (
                              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-20 blur-2xl pointer-events-none" style={{ background: tone.accent }} />
                            )}
                            
                            <div className="relative z-10">
                              <div className="text-[15px] font-bold tracking-tight text-text">{filter.label}</div>
                              <div className="mt-1 flex items-center gap-1.5 text-[12px] font-medium text-text/60">
                                <span>{filter.dueCount} ready now</span>
                                <span className="opacity-40">•</span>
                                <span>{Math.max(filter.totalCount - filter.newCount, 0)} still learning</span>
                                <span className="opacity-40">•</span>
                                <span>{filter.totalCount} all words</span>
                              </div>
                            </div>
                            {isActive ? (
                              <span 
                                className="relative z-10 rounded-full px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.15em] shadow-sm transform transition-transform group-hover:scale-105" 
                                style={{ 
                                  background: tone.chipBg, 
                                  color: tone.chipText,
                                  border: `1px solid color-mix(in srgb, white 20%, transparent)`
                                }}
                              >
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
          </div>
        </>
      ) : null}

      {isHelpOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[320] bg-black/45 backdrop-blur-md transition-all duration-500 animate-in fade-in"
            onClick={() => setIsHelpOpen(false)}
            aria-label="Close review help"
          />
          <div
            className="safe-area-bottom-padding-mobile-lg fixed inset-x-0 bottom-0 z-[330] mx-auto max-h-[85vh] max-w-lg overflow-y-auto rounded-t-[36px] border border-white/10 bg-[var(--surface-elevated)]/90 px-5 pt-5 shadow-[0_-24px_64px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-500 animate-in slide-in-from-bottom-8 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-[36px] sm:border sm:shadow-[0_32px_80px_rgba(0,0,0,0.25)]"
            style={{ 
              overscrollBehavior: "contain",
              background: `linear-gradient(180deg, color-mix(in srgb, var(--surface-elevated) 95%, transparent) 0%, color-mix(in srgb, var(--surface-subtle) 90%, transparent) 100%)`, 
            }}
          >
            {/* Background glowing orb */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: tone.accent }} />

            <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-black/10 dark:bg-white/10" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-text/50">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: tone.accent }} />
                  Quick help
                </p>
                <h2 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-text">Daily Vocab Review</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsHelpOpen(false)}
                className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white/5 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10 active:scale-95 focus-visible:ring-2 focus-visible:ring-[color:var(--tone-vocabulary-accent)]/50 focus-visible:ring-offset-2"
                style={{ borderColor: "color-mix(in srgb, var(--border-subtle) 50%, transparent)" }}
                aria-label="Close review help"
              >
                <X className="h-4.5 w-4.5 opacity-70 transition-opacity group-hover:opacity-100" />
              </button>
            </div>

            <div className="relative mt-6 space-y-4 pb-8">
              {/* Session size + steps — glossy card */}
              <div
                className="group relative overflow-hidden rounded-[28px] border p-5 transition-all duration-500 hover:shadow-lg"
                style={{
                  borderColor: `color-mix(in srgb, ${tone.accent} 30%, var(--border-subtle))`,
                  background: `linear-gradient(135deg, color-mix(in srgb, ${tone.surfaceMuted} 85%, var(--surface-elevated)) 0%, color-mix(in srgb, ${tone.surface} 70%, var(--surface-subtle)) 100%)`,
                  boxShadow: `inset 0 1px 0 color-mix(in srgb, white 20%, transparent)`,
                }}
              >
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-25 blur-3xl transition-opacity group-hover:opacity-40" style={{ background: tone.accent }} />

                <div className="relative flex items-center gap-3">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-[15px] font-black shadow-sm ring-1 ring-inset"
                    style={{ background: tone.chipBg, color: tone.chipText, border: `1px solid color-mix(in srgb, white 20%, transparent)` }}
                  >
                    6
                  </span>
                  <p className="text-[15px] font-bold tracking-tight text-text">Study a few words each day.<br />
                    <span className="text-xs font-semibold text-text/60">A quick, focused session.</span>
                  </p>
                </div>

                <div className="relative mt-4 space-y-2">
                  {[
                    { n: "1", text: "Read the word", icon: <BrainCircuit className="h-3.5 w-3.5 opacity-60 ml-auto" /> },
                    { n: "2", text: "Listen to the word if needed", icon: <Volume2 className="h-3.5 w-3.5 opacity-60 ml-auto" /> },
                    { n: "3", text: "Tap to flip the card", icon: <RotateCcw className="h-3.5 w-3.5 opacity-60 ml-auto" /> },
                    { n: "4", text: "Choose how it felt", icon: <CheckCircle2 className="h-3.5 w-3.5 opacity-60 ml-auto" /> },
                  ].map(({ n, text, icon }) => (
                    <div 
                      key={n} 
                      className="flex items-center gap-3.5 rounded-2xl border px-3.5 py-3 transition-colors hover:bg-white/40 dark:hover:bg-black/10" 
                      style={{ 
                        background: "color-mix(in srgb, var(--surface-elevated) 45%, transparent)",
                        borderColor: "color-mix(in srgb, var(--border-subtle) 40%, transparent)",
                      }}
                    >
                      <span
                        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black shadow-sm"
                        style={{ background: tone.chipBg, color: tone.chipText, opacity: 0.9, border: `1px solid color-mix(in srgb, white 15%, transparent)` }}
                      >
                        {n}
                      </span>
                      <p className="text-[13px] font-bold text-text/90 tracking-tight">{text}</p>
                      {icon}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating buttons explanation */}
              <div 
                className="overflow-hidden rounded-[28px] border p-5" 
                style={{ 
                  borderColor: "color-mix(in srgb, var(--border-subtle) 80%, transparent)", 
                  background: "color-mix(in srgb, var(--surface-elevated) 80%, transparent)",
                  backdropFilter: "blur(12px)"
                }}
              >
                <div className="mb-3.5 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text/65">Rating the Words</h3>
                </div>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {[
                    { label: "😓 Hard", hint: "see again sooner", border: "color-mix(in srgb, #dc2626 36%, var(--border-subtle))", bg: "color-mix(in srgb, #f87171 18%, var(--surface-elevated))", textColor: "color-mix(in srgb, #7f1d1d 78%, var(--text))" },
                    { label: "🤔 OK",   hint: "see again later",  border: "color-mix(in srgb, #2563eb 36%, var(--border-subtle))", bg: "color-mix(in srgb, #60a5fa 18%, var(--surface-elevated))", textColor: "color-mix(in srgb, #1e3a8a 78%, var(--text))" },
                    { label: "😊 Easy", hint: "see much later",   border: "color-mix(in srgb, #059669 38%, var(--border-subtle))", bg: "color-mix(in srgb, #34d399 20%, var(--surface-elevated))", textColor: "color-mix(in srgb, #064e3b 78%, var(--text))" },
                  ].map(({ label, hint, border, bg, textColor }) => (
                    <div key={label} className="flex flex-col items-center gap-2.5">
                      <div 
                        className="group flex w-full cursor-default relative items-center justify-center overflow-hidden rounded-2xl border-2 px-1 py-3.5 transition-transform hover:scale-[1.02] min-h-[76px]" 
                        style={{ 
                          borderColor: border, 
                          background: bg,
                          boxShadow: `inset 0 1px 0 color-mix(in srgb, white 30%, transparent), 0 4px 12px ${border}20` 
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100" />
                        <span className="relative z-10 text-[13px] font-black uppercase tracking-wider sm:text-[14px]" style={{ color: textColor }}>{label}</span>
                      </div>
                      <span className="text-[11px] font-bold text-center leading-tight" style={{ color: textColor, opacity: 0.85 }}>{hint}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Due / New + filters tip — glossy duo */}
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className="group rounded-[28px] border px-4 py-4 transition-transform hover:scale-[1.02]" 
                  style={{ 
                    borderColor: tone.border, 
                    background: "color-mix(in srgb, var(--surface-subtle) 90%, var(--surface-elevated))",
                    boxShadow: "inset 0 1px 0 color-mix(in srgb, white 15%, transparent)"
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <CalendarSync className="h-4 w-4 opacity-50 text-text" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text/50">Due Words</p>
                  </div>
                  <p className="text-[15px] font-bold tracking-tight text-text">Ready now</p>
                  <p className="mt-1 text-[12px] font-medium leading-relaxed text-text/65">Words you studied before that need review.</p>
                </div>
                <div 
                  className="group rounded-[28px] border px-4 py-4 transition-transform hover:scale-[1.02]" 
                  style={{ 
                    borderColor: tone.border, 
                    background: "color-mix(in srgb, var(--surface-subtle) 90%, var(--surface-elevated))",
                    boxShadow: "inset 0 1px 0 color-mix(in srgb, white 15%, transparent)"
                  }}
                >
                   <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="h-4 w-4 opacity-50 text-[color:var(--tone-vocabulary-accentStrong)]" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text/50">New Words</p>
                  </div>
                  <p className="text-[15px] font-bold tracking-tight text-text">First time</p>
                  <p className="mt-1 text-[12px] font-medium leading-relaxed text-text/65">Fresh words you haven&apos;t seen yet.</p>
                </div>
              </div>

              {/* Filter tip */}
              {/* Filter tip */}
              <div className="mt-2 flex items-center justify-center gap-2 rounded-[20px] bg-black/5 px-4 py-3 dark:bg-white/5">
                <span className="text-[13px] font-semibold text-text/75">
                  Want to practice one unit? <span className="font-bold text-text">Tap Filters.</span>
                </span>
              </div>

              {/* Daily Habit tip */}
              <div className="flex items-center justify-center px-4 pt-2">
                <p className="text-center text-[12px] font-medium leading-relaxed text-text/60">
                  Make this a daily habit. <br className="sm:hidden" />
                  We&apos;ll choose the best words for you to review each day.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </main>
  );
}
