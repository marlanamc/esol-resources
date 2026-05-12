"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Coffee, Maximize2, Minimize2, Shuffle, Sparkles, Trophy } from "lucide-react";
import type {
    CafeCatchUpContent,
    CafeCatchUpDeck,
    CafeCatchUpPrompt,
} from "@/types/activity";
import { fetchActivityProgress, saveActivityProgress } from "@/lib/activityProgress";
import { PointsToast } from "@/components/ui/PointsToast";

/**
 * Café Catch-Up: a reusable speaking-discussion card-deck game.
 *
 * The deck content (prompts, decks, starters, listener phrases) is supplied
 * entirely via the parsed `CafeCatchUpContent` so the same renderer powers
 * every themed deck (Boston Healthcare, Work Life, Family, etc.).
 *
 * Progress / points: the dedicated "Last sip — wrap up" button calls
 * `saveActivityProgress(activityId, 100, "completed")`, which the existing
 * `/api/activity/progress` route turns into a participation-points award.
 * Server-side idempotency prevents double-awarding on revisits.
 */

interface Props {
    activityId: string;
    content: CafeCatchUpContent;
    assignmentId?: string | null;
}

type FilterKey = "mix" | string;

const SIP_DECK_ID = "sip";

function shuffleArray<T>(arr: readonly T[]): T[] {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

function decksWithoutSip(decks: readonly CafeCatchUpDeck[]): CafeCatchUpDeck[] {
    return decks.filter((d) => d.id !== SIP_DECK_ID);
}

function promptsForFilter(
    prompts: readonly CafeCatchUpPrompt[],
    filter: FilterKey
): CafeCatchUpPrompt[] {
    if (filter === "mix") return prompts.filter((p) => p.deck !== SIP_DECK_ID);
    return prompts.filter((p) => p.deck === filter);
}

function labelForDeck(
    decks: readonly CafeCatchUpDeck[],
    deckId: string
): string {
    const match = decks.find((d) => d.id === deckId);
    if (match) return match.label;
    if (deckId === SIP_DECK_ID) return "Last sip";
    return deckId;
}

export default function CafeCatchUpGame({ activityId, content }: Props) {
    const visibleDecks = useMemo(() => decksWithoutSip(content.decks), [content.decks]);
    const starters = useMemo(() => content.starters ?? [], [content.starters]);
    const participationPoints = content.participationPoints ?? 5;

    const sipPrompt = useMemo(
        () => content.prompts.find((p) => p.deck === SIP_DECK_ID) ?? null,
        [content.prompts]
    );

    const [deckFilter, setDeckFilter] = useState<FilterKey>("mix");
    const [pile, setPile] = useState<CafeCatchUpPrompt[]>(() =>
        shuffleArray(promptsForFilter(content.prompts, "mix"))
    );
    const [pileIndex, setPileIndex] = useState(0);
    const [drawRound, setDrawRound] = useState(0);

    type Phase = "ready" | "card" | "sip" | "exhausted";
    const [phase, setPhase] = useState<Phase>("ready");
    const [currentPrompt, setCurrentPrompt] = useState<CafeCatchUpPrompt | null>(null);
    const [currentStarter, setCurrentStarter] = useState<string | null>(null);

    const [reducedMotion, setReducedMotion] = useState(false);
    const [popKey, setPopKey] = useState(0); // forces re-mount for animation
    const [shakeKey, setShakeKey] = useState(0);

    const [isCompleted, setIsCompleted] = useState(false);
    const [completingState, setCompletingState] = useState<"idle" | "saving" | "saved">("idle");
    const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const lastStarterIndexRef = useRef(-1);

    // Reduced motion
    useEffect(() => {
        const mo = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => setReducedMotion(mo.matches);
        sync();
        mo.addEventListener("change", sync);
        return () => mo.removeEventListener("change", sync);
    }, []);

    // Track fullscreen state (handles ESC + browser-driven exits)
    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    const toggleFullscreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                await containerRef.current?.requestFullscreen?.();
            } else {
                await document.exitFullscreen?.();
            }
        } catch {
            // ignore — browser may block (e.g. iframe without permission)
        }
    }, []);

    // Initial completion state
    useEffect(() => {
        let cancelled = false;
        void fetchActivityProgress(activityId).then((p) => {
            if (cancelled || !p) return;
            if (p.status === "completed" || p.status === "submitted" || p.progress >= 100) {
                setIsCompleted(true);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [activityId]);

    const pickStarter = useCallback((): string | null => {
        if (!starters.length) return null;
        if (starters.length === 1) return starters[0];
        let i: number;
        do {
            i = Math.floor(Math.random() * starters.length);
        } while (i === lastStarterIndexRef.current);
        lastStarterIndexRef.current = i;
        return starters[i];
    }, [starters]);

    const triggerPop = useCallback(() => {
        if (reducedMotion) return;
        setPopKey((n) => n + 1);
    }, [reducedMotion]);

    const triggerShake = useCallback(() => {
        if (reducedMotion) return;
        setShakeKey((n) => n + 1);
    }, [reducedMotion]);

    const reshuffleForFilter = useCallback(
        (filter: FilterKey) => {
            const newPile = shuffleArray(promptsForFilter(content.prompts, filter));
            setPile(newPile);
            setPileIndex(0);
            setDrawRound(0);
            setCurrentPrompt(null);
            setCurrentStarter(null);
            setPhase("ready");
        },
        [content.prompts]
    );

    const handleSelectFilter = useCallback(
        (filter: FilterKey) => {
            if (filter === deckFilter) return;
            setDeckFilter(filter);
            reshuffleForFilter(filter);
        },
        [deckFilter, reshuffleForFilter]
    );

    const handlePour = useCallback(() => {
        if (pileIndex >= pile.length) {
            // Deck exhausted
            setCurrentPrompt(null);
            setCurrentStarter(null);
            setPhase("exhausted");
            triggerShake();
            return;
        }
        const next = pile[pileIndex];
        setPileIndex((i) => i + 1);
        setDrawRound((r) => r + 1);
        setCurrentPrompt(next);
        setCurrentStarter(pickStarter());
        setPhase("card");
        triggerPop();
    }, [pile, pileIndex, pickStarter, triggerPop, triggerShake]);

    const handleShuffle = useCallback(() => {
        reshuffleForFilter(deckFilter);
    }, [deckFilter, reshuffleForFilter]);

    const handleLastSip = useCallback(async () => {
        if (!sipPrompt) return;
        setCurrentPrompt(sipPrompt);
        setCurrentStarter(null);
        setPhase("sip");
        triggerPop();

        if (isCompleted || completingState !== "idle") return;
        setCompletingState("saving");
        try {
            const result = await saveActivityProgress(activityId, 100, "completed");
            const awarded = result?.pointsAwarded ?? participationPoints;
            if (result?.ok) {
                setIsCompleted(true);
                setPointsAwarded(awarded);
                if (awarded > 0) setShowToast(true);
            }
        } catch {
            // ignore — UI will simply not show a toast
        } finally {
            setCompletingState("saved");
        }
    }, [
        sipPrompt,
        isCompleted,
        completingState,
        activityId,
        participationPoints,
        triggerPop,
    ]);

    // Keyboard shortcuts
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const tgt = e.target as HTMLElement | null;
            if (tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA")) return;
            if (e.code === "Space") {
                e.preventDefault();
                handlePour();
            } else if (e.key === "l" || e.key === "L") {
                e.preventDefault();
                void handleLastSip();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [handlePour, handleLastSip]);

    const cardsLeft = Math.max(0, pile.length - pileIndex);
    const deckEmpty = pile.length === 0;

    const activeDeckLabel = useMemo(() => {
        if (deckFilter === "mix") return "All topics";
        return labelForDeck(visibleDecks, deckFilter);
    }, [deckFilter, visibleDecks]);

    const currentDeckLabel = useMemo(() => {
        if (phase === "sip") return "Last sip";
        if (currentPrompt) return labelForDeck(visibleDecks, currentPrompt.deck);
        return activeDeckLabel;
    }, [phase, currentPrompt, visibleDecks, activeDeckLabel]);

    return (
        <div ref={containerRef} className="min-h-full bg-[#fbf5ec] dark:bg-[#1a1410] flex flex-col">
            {/* Theme banner */}
            <div className="px-4 sm:px-6 lg:px-8 pt-5 pb-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5 min-w-0">
                    <span
                        aria-hidden="true"
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/12 dark:bg-primary/25 text-primary"
                    >
                        <Coffee size={18} />
                    </span>
                    <div className="min-w-0">
                        {content.theme && (
                            <p className="text-[0.65rem] uppercase tracking-[0.14em] font-bold text-primary-dark dark:text-primary-light">
                                {content.theme}
                            </p>
                        )}
                        <p className="text-sm text-muted-foreground/90 dark:text-gray-400 font-medium line-clamp-1">
                            Pour a question, share what you think, end with a Last Sip.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {isCompleted && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold tracking-wide uppercase bg-secondary/15 text-secondary-dark dark:bg-secondary/25 dark:text-secondary-light border border-secondary/30">
                            <Trophy size={12} /> Completed
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        aria-pressed={isFullscreen}
                        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a1f1a] text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-[#3a2820] hover:border-accent hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                </div>
            </div>

            {/* Deck filter chips */}
            <div className="px-4 sm:px-6 lg:px-8 pb-3">
                <div role="toolbar" aria-label="Topic filter" className="flex flex-wrap gap-2 items-center">
                    <span className="text-[0.65rem] uppercase tracking-[0.1em] font-bold text-gray-500 dark:text-gray-400 mr-1">
                        Pick your topic
                    </span>
                    <FilterChip
                        label="Mix it up"
                        active={deckFilter === "mix"}
                        onClick={() => handleSelectFilter("mix")}
                    />
                    {visibleDecks.map((deck) => (
                        <FilterChip
                            key={deck.id}
                            label={deck.label}
                            active={deckFilter === deck.id}
                            onClick={() => handleSelectFilter(deck.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Main grid */}
            <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(240px,300px)] gap-5 lg:gap-7 items-start">
                {/* Card-stack column */}
                <div className="relative">
                    {/* Stacked card shadow layers */}
                    {!deckEmpty && phase !== "sip" && (
                        <>
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 rounded-2xl bg-white dark:bg-[#2a1f1a] border border-gray-200 dark:border-white/10 opacity-50 translate-x-[6px] translate-y-[8px] rotate-[0.8deg]"
                            />
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 rounded-2xl bg-white dark:bg-[#2a1f1a] border border-gray-200 dark:border-white/10 opacity-75 translate-x-[3px] translate-y-[4px] -rotate-[0.4deg]"
                            />
                        </>
                    )}

                    {/* Main prompt card */}
                    <div
                        key={`shake-${shakeKey}`}
                        className={`relative z-[1] rounded-2xl bg-white dark:bg-[#2a1f1a] border border-gray-200 dark:border-white/10 shadow-[0_1px_2px_rgba(74,47,26,0.04),0_8px_24px_rgba(74,47,26,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] p-5 sm:p-7 lg:p-8 ${
                            shakeKey > 0 && !reducedMotion ? "animate-[cc-shake_0.3s_ease]" : ""
                        }`}
                    >
                        {/* Meta pills */}
                        <div className="flex flex-wrap gap-2 items-center mb-4">
                            <Pill tone="round">
                                {phase === "sip"
                                    ? "Wrap up"
                                    : phase === "ready"
                                      ? "Ready"
                                      : `Round ${drawRound}`}
                            </Pill>
                            <Pill tone="deck">{currentDeckLabel}</Pill>
                            <Pill tone="muted">
                                {phase === "sip"
                                    ? "Closing card"
                                    : phase === "exhausted"
                                      ? "0 left"
                                      : currentPrompt
                                        ? `${cardsLeft} left`
                                        : pile.length
                                          ? `${pile.length} in deck`
                                          : "No cards"}
                            </Pill>
                        </div>

                        {/* Focus area with terracotta accent rail */}
                        <div
                            key={`pop-${popKey}`}
                            className={`relative rounded-xl border border-amber-100/70 dark:border-amber-900/40 bg-gradient-to-b from-[#fffdf7] to-[#fffaf0] dark:from-[#3a2820] dark:to-[#352017] px-5 sm:px-7 py-5 sm:py-7 overflow-hidden ${
                                popKey > 0 && !reducedMotion ? "animate-[cc-pop_0.32s_cubic-bezier(0.2,0.7,0.2,1)]" : ""
                            }`}
                        >
                            <span
                                aria-hidden="true"
                                className="absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-b from-primary to-accent rounded-r-md"
                            />
                            {/* Kicker */}
                            {(phase === "card" || phase === "sip") && currentPrompt && (
                                <p className="flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-primary-dark dark:text-primary-light mb-3">
                                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    {phase === "sip" ? "Closing question" : "Discussion question"}
                                </p>
                            )}

                            {/* Stem / empty hint */}
                            {currentPrompt ? (
                                <p className="font-display text-2xl sm:text-3xl lg:text-[2.25rem] font-bold leading-[1.32] tracking-[-0.015em] text-gray-900 dark:text-gray-50 max-w-[56ch]">
                                    {currentPrompt.stem}
                                </p>
                            ) : phase === "exhausted" ? (
                                <p className="text-lg sm:text-xl font-medium text-gray-600 dark:text-gray-300 leading-relaxed max-w-[52ch]">
                                    <strong className="text-gray-900 dark:text-gray-100 font-bold">
                                        That was every card in this set.
                                    </strong>{" "}
                                    Tap <strong className="text-gray-900 dark:text-gray-100">Shuffle deck</strong> to
                                    play again, or end with <strong className="text-gray-900 dark:text-gray-100">Last sip</strong>.
                                </p>
                            ) : (
                                <p className="text-lg sm:text-xl font-medium text-gray-600 dark:text-gray-300 leading-relaxed max-w-[52ch]">
                                    Tap <strong className="text-gray-900 dark:text-gray-100">Pour a question</strong> to
                                    start the conversation.
                                </p>
                            )}

                            {/* Starter cue */}
                            {phase === "card" && currentStarter && (
                                <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3.5 rounded-xl border border-dashed border-secondary/60 bg-secondary/10 dark:bg-secondary/15 px-4 py-3 max-w-[56ch]">
                                    <span className="inline-flex shrink-0 items-center text-[0.68rem] leading-none uppercase tracking-[0.1em] font-bold text-secondary-dark dark:text-secondary-light">
                                        Who goes first?
                                    </span>
                                    <span className="text-[0.95rem] sm:text-base leading-snug font-medium text-[#3f5946] dark:text-secondary-light">
                                        {currentStarter}
                                    </span>
                                </div>
                            )}

                            {/* Follow-up */}
                            {(phase === "card" || phase === "sip") && currentPrompt?.followUp && (
                                <div className="mt-5 pt-4 border-t border-dashed border-gray-200 dark:border-white/10 max-w-[56ch]">
                                    <p className="text-[0.7rem] uppercase tracking-[0.1em] font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                                        If the conversation wants more
                                    </p>
                                    <p className="font-display text-lg sm:text-xl leading-snug text-gray-700 dark:text-gray-200 font-medium">
                                        {currentPrompt.followUp}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="flex flex-wrap gap-2.5 mt-5 items-center">
                            <button
                                type="button"
                                onClick={handlePour}
                                className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2.5 text-sm sm:text-base shadow-[0_4px_14px_rgba(176,87,64,0.28)] hover:shadow-[0_6px_18px_rgba(176,87,64,0.34)] active:translate-y-px transition-all"
                            >
                                <Sparkles size={16} aria-hidden="true" />
                                Pour a question
                            </button>
                            <button
                                type="button"
                                onClick={handleShuffle}
                                className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a1f1a] hover:bg-amber-50 dark:hover:bg-[#3a2820] hover:border-accent text-gray-800 dark:text-gray-100 font-semibold px-4 py-2.5 text-sm transition-all"
                            >
                                <Shuffle size={15} aria-hidden="true" />
                                Shuffle deck
                            </button>
                            {sipPrompt && (
                                <button
                                    type="button"
                                    onClick={handleLastSip}
                                    title="End the conversation with one closing share"
                                    className="inline-flex items-center gap-2 rounded-full bg-secondary hover:bg-secondary-dark text-white font-semibold px-4 py-2.5 text-sm shadow-sm active:translate-y-px transition-all"
                                >
                                    <Coffee size={15} aria-hidden="true" />
                                    Last sip
                                    <span className="hidden sm:inline opacity-90">• wrap up</span>
                                </button>
                            )}
                            <span className="ml-auto hidden md:inline text-[0.72rem] text-gray-500 dark:text-gray-400 font-medium">
                                <Kbd>Space</Kbd> next · <Kbd>L</Kbd> last sip
                            </span>
                        </div>

                        {/* Saved state line */}
                        {completingState === "saved" && pointsAwarded !== null && (
                            <p className="mt-3 text-sm text-secondary-dark dark:text-secondary-light font-medium">
                                {pointsAwarded > 0
                                    ? `Nice work — your participation has been saved (+${pointsAwarded} points).`
                                    : "Your participation has been saved."}
                            </p>
                        )}
                    </div>
                </div>

                {/* Side rail */}
                <aside className="space-y-3">
                    {content.listenerPhrases && (
                        <RailCard title="Listener phrases">
                            <p className="text-[0.78rem] text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                                If you're listening, try using one of these so your partner knows you're with them.
                            </p>
                            <PhraseList phrases={content.listenerPhrases.primary} />
                            {content.listenerPhrases.more && content.listenerPhrases.more.length > 0 && (
                                <details className="mt-2.5 group">
                                    <summary className="cursor-pointer text-[0.78rem] font-semibold text-primary-dark dark:text-primary-light py-1 hover:underline">
                                        More phrases
                                    </summary>
                                    <div className="mt-2">
                                        <PhraseList phrases={content.listenerPhrases.more} />
                                    </div>
                                </details>
                            )}
                        </RailCard>
                    )}

                    <RailCard title="Ways to participate">
                        <div className="flex flex-wrap gap-1.5">
                            {["Tell a story", "React", "Ask more", "Give advice", "Share an opinion"].map((c) => (
                                <span
                                    key={c}
                                    className="text-[0.76rem] font-medium px-2.5 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-[#fbf5ec] dark:bg-[#2a1f1a] text-gray-700 dark:text-gray-200"
                                >
                                    {c}
                                </span>
                            ))}
                        </div>
                    </RailCard>
                </aside>
            </div>

            {/* Toast */}
            {showToast && pointsAwarded !== null && pointsAwarded > 0 && (
                <PointsToast
                    points={pointsAwarded}
                    message="Thanks for joining the conversation"
                    onComplete={() => setShowToast(false)}
                />
            )}

            {/* Animation keyframes */}
            <style jsx>{`
                @keyframes cc-pop {
                    from {
                        opacity: 0;
                        transform: translateY(8px) rotate(-0.4deg);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) rotate(0);
                    }
                }
                @keyframes cc-shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-3px) rotate(-0.3deg); }
                    75% { transform: translateX(3px) rotate(0.3deg); }
                }
            `}</style>
        </div>
    );
}

// ============================================================================
// Small presentational helpers
// ============================================================================

function FilterChip({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={
                active
                    ? "px-3 py-1.5 text-[0.78rem] font-semibold rounded-full bg-primary text-white border border-primary shadow-[0_2px_8px_rgba(176,87,64,0.22)] transition-all"
                    : "px-3 py-1.5 text-[0.78rem] font-semibold rounded-full bg-white dark:bg-[#2a1f1a] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/15 hover:bg-amber-50 dark:hover:bg-[#3a2820] hover:border-accent transition-all"
            }
        >
            {label}
        </button>
    );
}

function Pill({
    tone,
    children,
}: {
    tone: "round" | "deck" | "muted";
    children: React.ReactNode;
}) {
    const styles =
        tone === "deck"
            ? "bg-primary/12 text-primary-dark border-primary/25 dark:bg-primary/25 dark:text-primary-light dark:border-primary/40"
            : tone === "round"
              ? "bg-accent/25 text-gray-700 border-accent/40 dark:bg-accent/30 dark:text-amber-100 dark:border-accent/50"
              : "bg-[#fbf5ec] text-gray-600 border-gray-200 dark:bg-[#2a1f1a] dark:text-gray-300 dark:border-white/10";
    return (
        <span
            className={`inline-flex items-center text-[0.7rem] font-bold uppercase tracking-[0.04em] px-2.5 py-1 rounded-full border ${styles}`}
        >
            {children}
        </span>
    );
}

function RailCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2a1f1a] shadow-sm p-4">
            <h2 className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.1em] font-extrabold text-primary-dark dark:text-primary-light mb-2.5">
                <span aria-hidden="true" className="block w-3.5 h-0.5 rounded bg-primary" />
                {title}
            </h2>
            {children}
        </div>
    );
}

function PhraseList({ phrases }: { phrases: readonly string[] }) {
    return (
        <ul className="space-y-1.5">
            {phrases.map((p) => (
                <li
                    key={p}
                    className="text-[0.88rem] italic text-gray-700 dark:text-gray-200 px-2.5 py-1.5 rounded-md bg-[#fbf5ec] dark:bg-[#2a1f1a]/60 border-l-[3px] border-accent"
                >
                    {p}
                </li>
            ))}
        </ul>
    );
}

function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="inline-block bg-[#f6ecd9] dark:bg-[#3a2820] border border-gray-200 dark:border-white/15 border-b-2 rounded px-1.5 py-px text-[0.72rem] font-medium text-gray-700 dark:text-gray-200">
            {children}
        </kbd>
    );
}
