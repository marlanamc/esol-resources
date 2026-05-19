"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VocabWordImage } from "@/components/public-vocab/VocabWordImage";
import { applyLevel1VocabPlaybackRate, playLevel1VocabAudio } from "@/lib/level1-vocab-audio";
import { useLevel1AudioSpeedOptional } from "@/components/public-vocab/level1-ui/Level1AudioSpeedContext";

const MATCHING_SOUND_STORAGE_KEY = "level1-vocab-matching-sound-enabled";
const MATCHING_AUDIO_MATCH_STORAGE_KEY = "level1-vocab-matching-audio-match";

export type ImageWordPair = {
  id: number;
  term: string;
  imageUrl: string;
};

type Props = {
  pairs: ImageWordPair[];
  onComplete?: () => void;
  pairSignature?: string;
  /**
   * When true, swap to "listen" mode: word text is hidden and learners
   * tap a sound chip first, then the matching picture. Controlled by
   * the parent surface so the chrome (instructions, toggles) stays in
   * sync with the game state. Defaults to false (picture-first).
   */
  audioMatchMode?: boolean;
};

const ROUND_SIZE = 4;

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Round-based picture-to-word matching game.
 * Shows ROUND_SIZE pairs at a time in a compact layout that fits mobile screens.
 */
export function ImageWordMatchingGame({
  pairs,
  onComplete,
  pairSignature,
  audioMatchMode = false,
}: Props) {
  const sig = pairSignature ?? pairs.map((p) => p.id).join(",");

  const [mounted, setMounted] = useState(false);
  const [rounds, setRounds] = useState<ImageWordPair[][]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalMatched, setTotalMatched] = useState(0);
  const [roundMatched, setRoundMatched] = useState<Set<number>>(new Set());
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);
  const [correctFlash, setCorrectFlash] = useState<number | null>(null);
  const [wrongImageFlash, setWrongImageFlash] = useState<number | null>(null);
  const [wrongWordFlash, setWrongWordFlash] = useState<number | null>(null);
  const [showRoundTransition, setShowRoundTransition] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [roundKey, setRoundKey] = useState(0);
  const completionFired = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const startTimeRef = useRef(Date.now());
  const wordAudioRef = useRef<HTMLAudioElement | null>(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const level1Audio = useLevel1AudioSpeedOptional();

  useEffect(() => {
    // Listen mode is no longer user-toggleable on the public surface.
    // Clear any stale flag from earlier visits so the game always starts
    // in picture-first mode for everyone.
    try {
      localStorage.removeItem(MATCHING_AUDIO_MATCH_STORAGE_KEY);
      const stored = localStorage.getItem(MATCHING_SOUND_STORAGE_KEY);
      if (stored === "0") setSoundEnabled(false);
    } catch {
      /* ignore */
    }
  }, []);

  const playWordAudio = useCallback(
    (term: string) => {
      if (!soundEnabled && !audioMatchMode) return;
      const prev = wordAudioRef.current;
      if (prev) {
        prev.pause();
        wordAudioRef.current = null;
      }
      const speed = level1Audio?.speed ?? "normal";
      const audio = playLevel1VocabAudio(term, speed);
      wordAudioRef.current = audio;
      const startPlayback = () => {
        applyLevel1VocabPlaybackRate(audio, speed);
        void audio.play().catch(() => {
          wordAudioRef.current = null;
        });
      };
      if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        startPlayback();
      } else {
        audio.addEventListener("loadedmetadata", startPlayback, { once: true });
        audio.load();
      }
      audio.addEventListener(
        "ended",
        () => {
          if (wordAudioRef.current === audio) wordAudioRef.current = null;
        },
        { once: true }
      );
    },
    [soundEnabled, audioMatchMode, level1Audio]
  );

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Build rounds client-side only to avoid hydration mismatch from Math.random
  useEffect(() => {
    const chunks: ImageWordPair[][] = [];
    const shuffled = shuffleArray(pairs);
    for (let i = 0; i < shuffled.length; i += ROUND_SIZE) {
      chunks.push(shuffled.slice(i, i + ROUND_SIZE));
    }
    setRounds(chunks);
    setMounted(true);
    completionFired.current = false;
    setCurrentRound(0);
    setTotalMatched(0);
    setRoundMatched(new Set());
    setSelectedImageId(null);
    setSelectedWordId(null);
    setCorrectFlash(null);
    setWrongImageFlash(null);
    setWrongWordFlash(null);
    setShowRoundTransition(false);
    setGameComplete(false);
    setRoundKey((k) => k + 1);
    startTimeRef.current = Date.now();
  }, [sig, pairs]);

  const roundPairs = rounds[currentRound] ?? [];

  const shuffledWords = useMemo(
    () => shuffleArray(roundPairs.map((p) => ({ id: p.id, term: p.term }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRound, roundKey, sig]
  );

  const advanceRound = useCallback(() => {
    if (currentRound + 1 < rounds.length) {
      setShowRoundTransition(true);
      setTimeout(() => {
        setCurrentRound((r) => r + 1);
        setRoundMatched(new Set());
        setSelectedImageId(null);
        setSelectedWordId(null);
        setShowRoundTransition(false);
        setRoundKey((k) => k + 1);
      }, 800);
    } else {
      setGameComplete(true);
      if (!completionFired.current) {
        completionFired.current = true;
        onCompleteRef.current?.();
      }
    }
  }, [currentRound, rounds.length]);

  const checkMatch = useCallback(
    (imageId: number | null, wordId: number | null) => {
      if (!imageId || !wordId) return;

      if (imageId === wordId) {
        setCorrectFlash(imageId);
        setSelectedImageId(null);
        setSelectedWordId(null);

        setTimeout(() => {
          setRoundMatched((prev) => {
            const next = new Set(prev);
            next.add(imageId);
            return next;
          });
          setTotalMatched((t) => t + 1);
          setCorrectFlash(null);
        }, 500);
      } else {
        setWrongImageFlash(imageId);
        setWrongWordFlash(wordId);
        setTimeout(() => {
          setWrongImageFlash(null);
          setWrongWordFlash(null);
          setSelectedImageId(null);
          setSelectedWordId(null);
        }, 600);
      }
    },
    []
  );

  useEffect(() => {
    if (roundPairs.length > 0 && roundMatched.size === roundPairs.length) {
      const timer = setTimeout(advanceRound, 600);
      return () => clearTimeout(timer);
    }
  }, [roundMatched.size, roundPairs.length, advanceRound]);

  const progressPercent = pairs.length > 0 ? (totalMatched / pairs.length) * 100 : 0;
  const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  if (pairs.length < 2) {
    return (
      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-contrast)] p-8 text-center shadow-[var(--shadow-md)]">
        <p className="text-lg font-semibold text-text">Not enough pictures for this topic yet</p>
        <p className="mt-2 text-sm text-text-muted">
          Picture matching needs at least two words with photos. Try flashcards or another activity, or pick a
          different topic.
        </p>
      </div>
    );
  }

  if (!mounted || rounds.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-contrast)] p-8 shadow-[var(--shadow-md)]">
        <div className="flex items-center justify-center gap-3 text-text-muted">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Shuffling cards&hellip;</span>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    return <CompletionScreen totalPairs={pairs.length} rounds={rounds.length} minutes={minutes} seconds={seconds} onPlayAgain={() => {
      const chunks: ImageWordPair[][] = [];
      const shuffled = shuffleArray(pairs);
      for (let i = 0; i < shuffled.length; i += ROUND_SIZE) {
        chunks.push(shuffled.slice(i, i + ROUND_SIZE));
      }
      setRounds(chunks);
      completionFired.current = false;
      setCurrentRound(0);
      setTotalMatched(0);
      setRoundMatched(new Set());
      setGameComplete(false);
      setRoundKey((k) => k + 1);
      startTimeRef.current = Date.now();
    }} />;
  }

  return (
    <div className="relative rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-contrast)] shadow-[var(--shadow-md)] overflow-hidden">
      {/* Progress Header */}
      <div className="px-4 pt-4 pb-3 sm:px-5">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Round {currentRound + 1} of {rounds.length}
          </span>
          <span className="text-xs font-bold tabular-nums text-text-muted">
            {totalMatched}/{pairs.length}
          </span>
        </div>
        <div className="relative h-2 rounded-full bg-[var(--color-border-subtle)]/40 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, var(--secondary-color) 0%, var(--secondary-color-light) 100%)`,
            }}
          />
        </div>
      </div>

      {/* Game Area */}
      <div className={`px-4 pb-5 sm:px-5 transition-opacity duration-300 ${showRoundTransition ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
        {/* Image Grid - 2x2 on mobile, side-by-side on desktop. Listen mode: sounds first (left / top), pictures second. */}
        <div
          className={
            audioMatchMode
              ? "flex flex-col-reverse gap-4 md:flex md:flex-row-reverse md:gap-6"
              : "md:flex md:gap-6"
          }
        >
          {/* Images */}
          <div className="md:flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted/70 mb-2">
              {audioMatchMode ? "Then tap the picture" : "Tap a picture"}
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {roundPairs.map((pair, idx) => {
                const isMatched = roundMatched.has(pair.id);
                const isSelected = selectedImageId === pair.id;
                const isCorrectFlashing = correctFlash === pair.id;
                const isWrongFlashing = wrongImageFlash === pair.id;

                return (
                  <button
                    key={`${roundKey}-img-${pair.id}`}
                    type="button"
                    disabled={isMatched}
                    aria-label={
                      audioMatchMode
                        ? `Picture ${idx + 1} — choose the sound that matches`
                        : `Picture ${idx + 1} — choose the word that matches`
                    }
                    onClick={() => {
                      if (isMatched || isCorrectFlashing || isWrongFlashing) return;
                      const nextValue = selectedImageId === pair.id ? null : pair.id;
                      setSelectedImageId(nextValue);
                      checkMatch(nextValue, selectedWordId);
                    }}
                    className={[
                      "vocab-match-image-btn relative rounded-2xl overflow-hidden transition-all duration-200 touch-manipulation",
                      "ring-2 ring-offset-2 ring-offset-[var(--color-surface-contrast)]",
                      "animate-match-card-enter",
                      isMatched
                        ? "ring-[var(--secondary-color)]/50 opacity-40 scale-[0.96] pointer-events-none"
                        : isCorrectFlashing
                          ? "ring-[var(--secondary-color)] animate-match-pop shadow-lg"
                          : isWrongFlashing
                            ? "ring-[var(--error-color)] animate-match-shake"
                            : isSelected
                              ? "!ring-[var(--primary-color)] !ring-offset-[3px] shadow-lg scale-[1.03] !bg-[color-mix(in_srgb,var(--primary-color)_18%,var(--color-surface-contrast))]"
                              : "ring-transparent hover:ring-[var(--primary-color-light)]/50 hover:shadow-md",
                    ].join(" ")}
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <VocabWordImage src={pair.imageUrl} alt="" variant="tile" />
                    {isMatched && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--secondary-color)]/20 backdrop-blur-[1px]">
                        <div className="w-10 h-10 rounded-full bg-[var(--secondary-color)] flex items-center justify-center shadow-md">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                    {isCorrectFlashing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--secondary-color)]/25 animate-match-pop">
                        <div className="w-12 h-12 rounded-full bg-[var(--secondary-color)] flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Word Chips */}
          <div
            className={
              audioMatchMode
                ? "md:flex-1 md:flex md:flex-col md:justify-center"
                : "mt-4 md:mt-0 md:flex-1 md:flex md:flex-col md:justify-center"
            }
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted/70 mb-2">
              {audioMatchMode ? "Tap a sound" : "Then tap the word"}
            </p>
            <div className="flex flex-col gap-2">
              {shuffledWords.map((entry, idx) => {
                const isMatched = roundMatched.has(entry.id);
                const isSelected = selectedWordId === entry.id;
                const isCorrectFlashing = correctFlash === entry.id;
                const isWrongFlashing = wrongWordFlash === entry.id;

                const listenLabel = `Listen ${idx + 1}`;
                const showHiddenWord = audioMatchMode && !isMatched;

                return (
                  <button
                    key={`${roundKey}-word-${entry.id}`}
                    type="button"
                    disabled={isMatched}
                    aria-label={
                      showHiddenWord
                        ? `${listenLabel}, hear: ${entry.term}`
                        : entry.term
                    }
                    onClick={() => {
                      if (isMatched || isCorrectFlashing || isWrongFlashing) return;
                      playWordAudio(entry.term);
                      const nextValue = selectedWordId === entry.id ? null : entry.id;
                      setSelectedWordId(nextValue);
                      checkMatch(selectedImageId, nextValue);
                    }}
                    className={[
                      "vocab-match-word-btn relative w-full rounded-xl border-2 border-solid px-4 py-3 text-left transition-all duration-200 touch-manipulation",
                      "animate-match-card-enter",
                      isMatched
                        ? "!border-[var(--secondary-color)] !bg-[color-mix(in_srgb,var(--secondary-color)_28%,var(--color-white))] dark:!bg-[color-mix(in_srgb,var(--secondary-color)_32%,var(--color-surface-contrast))] !text-[var(--secondary-color-dark)] dark:!text-secondary pointer-events-none shadow-inner"
                        : isCorrectFlashing
                          ? "!border-[var(--secondary-color)] !bg-[color-mix(in_srgb,var(--secondary-color)_32%,var(--color-white))] dark:!bg-[color-mix(in_srgb,var(--secondary-color)_36%,var(--color-surface-contrast))] !text-[var(--secondary-color-dark)] animate-match-pop"
                          : isWrongFlashing
                            ? "!border-[var(--error-color)] !bg-[color-mix(in_srgb,var(--error-color)_22%,var(--color-white))] dark:!bg-[color-mix(in_srgb,var(--error-color)_28%,var(--color-surface-contrast))] !text-[var(--error-color)] animate-match-shake"
                            : isSelected
                              ? "!border-[var(--primary-color)] !bg-[color-mix(in_srgb,var(--primary-color)_22%,var(--color-white))] dark:!bg-[color-mix(in_srgb,var(--primary-color)_30%,var(--color-surface-contrast))] !text-[var(--primary-color-dark)] shadow-md ring-2 ring-[var(--primary-color)]/25"
                              : "!border-[var(--color-border-subtle)] !bg-[var(--color-white)] dark:!bg-[var(--color-surface-base)] hover:!border-[var(--primary-color-light)] hover:!bg-[color-mix(in_srgb,var(--primary-color)_8%,var(--color-white))] dark:hover:!bg-[color-mix(in_srgb,var(--primary-color)_14%,var(--color-surface-contrast))] shadow-sm",
                    ].join(" ")}
                    style={{ animationDelay: `${(roundPairs.length + idx) * 60}ms` }}
                  >
                    {showHiddenWord ? (
                      <span className="flex items-center justify-center gap-2 w-full font-semibold text-[0.95rem] leading-tight">
                        <MatchingSpeakerIcon className="w-5 h-5 shrink-0 text-[var(--primary-color)]" />
                        <span>{listenLabel}</span>
                      </span>
                    ) : (
                      <span
                        className={`font-semibold text-[0.95rem] leading-tight ${isMatched ? "line-through decoration-2 decoration-[var(--secondary-color-dark)]/50" : ""}`}
                      >
                        {entry.term}
                      </span>
                    )}
                    {isMatched && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--secondary-color)]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Round transition overlay */}
      {showRoundTransition && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface-contrast)]/80 backdrop-blur-sm z-10">
          <div className="animate-match-round-burst text-center">
            <div className="text-3xl mb-1">
              {currentRound + 1 < rounds.length ? "🎯" : "🎉"}
            </div>
            <p className="font-bold text-lg text-text">
              {currentRound + 1 < rounds.length ? "Nice!" : "All done!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function MatchingSpeakerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M11 5L6 9H3v6h3l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 010 7.07" />
      <path d="M18.07 5.93a9 9 0 010 12.73" />
    </svg>
  );
}

function CompletionScreen({
  totalPairs,
  rounds,
  minutes,
  seconds,
  onPlayAgain,
}: {
  totalPairs: number;
  rounds: number;
  minutes: number;
  seconds: number;
  onPlayAgain: () => void;
}) {
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowStats(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-contrast)] shadow-[var(--shadow-lg)] overflow-hidden">
      <div className="relative px-6 py-10 text-center">
        {/* Decorative confetti dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-full animate-match-confetti"
              style={{
                left: `${10 + (i * 7) % 80}%`,
                top: `${15 + (i * 11) % 50}%`,
                backgroundColor: [
                  "var(--primary-color)",
                  "var(--secondary-color)",
                  "var(--accent-color)",
                  "var(--primary-color-light)",
                  "var(--secondary-color-light)",
                  "var(--accent-color-light)",
                ][i % 6],
                animationDelay: `${i * 100}ms`,
                animationDuration: `${800 + i * 60}ms`,
              }}
            />
          ))}
        </div>

        <div className="animate-match-round-burst mb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--secondary-color)] to-[var(--secondary-color-dark)] shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-text font-display mb-1">All Matched!</h2>
        <p className="text-sm text-text-muted mb-6">Great work on this set</p>

        {showStats && (
          <div className="grid grid-cols-3 gap-3 mb-8 max-w-xs mx-auto animate-match-card-enter">
            <div className="rounded-xl bg-[var(--color-surface-base)] p-3 border border-[var(--color-border-subtle)]">
              <p className="text-xl font-bold text-[var(--primary-color)] tabular-nums">{totalPairs}</p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-text-muted mt-0.5">Matches</p>
            </div>
            <div className="rounded-xl bg-[var(--color-surface-base)] p-3 border border-[var(--color-border-subtle)]">
              <p className="text-xl font-bold text-[var(--secondary-color)] tabular-nums">{rounds}</p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-text-muted mt-0.5">Rounds</p>
            </div>
            <div className="rounded-xl bg-[var(--color-surface-base)] p-3 border border-[var(--color-border-subtle)]">
              <p className="text-xl font-bold text-[var(--accent-color-dark)] tabular-nums">
                {minutes > 0 ? `${minutes}m` : ""}{seconds}s
              </p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-text-muted mt-0.5">Time</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onPlayAgain}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary-color)] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[var(--primary-color-dark)] hover:shadow-lg active:scale-[0.97] transition-all duration-200 touch-manipulation"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Play Again
        </button>
      </div>
    </div>
  );
}
