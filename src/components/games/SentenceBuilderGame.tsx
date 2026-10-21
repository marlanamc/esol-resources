"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Lightbulb, MessageCircle, RotateCcw, Sparkles } from "lucide-react";
import type {
    SentenceBuilderContent,
    SentenceBuilderPickRound,
    SentenceBuilderPlaceRound,
    SentenceBuilderRound,
    SentenceBuilderRule,
    SentenceBuilderTrueRound,
} from "@/types/activity";
import { fetchActivityProgress, saveActivityProgress } from "@/lib/activityProgress";
import {
    checkPick,
    checkPlace,
    dealRounds,
    DEFAULT_SENTENCE_BUILDER_ROUND_SIZE,
    fillTemplate,
    isBlank,
    placeWord,
} from "@/lib/sentence-builder/rounds";
import { CourseMapReturnButton } from "@/components/navigation/CourseMapReturnButton";
import { ContextualBackButton } from "@/components/navigation/ContextualBackButton";
import { PointsToast } from "@/components/ui/PointsToast";
import { GameLiveRegion } from "@/components/games/shared/GameLiveRegion";

/**
 * Sentence Builder: rounds written from each phrase bank worksheet. A wrong
 * answer shows the worksheet's rule card and the learner tries again; any
 * correct answer counts, including the less common ones a round lists.
 */

interface Props {
    activityId: string;
    content: SentenceBuilderContent;
    assignmentId?: string | null;
}

type Phase = "intro" | "play" | "done";

/** What happened in one round: solved on the first try, or after a rule card. */
interface RoundResult {
    id: string;
    firstTry: boolean;
}

const PRIMARY_BUTTON =
    "inline-flex items-center justify-center gap-2 rounded-full bg-primary! hover:bg-[#984734]! text-white! font-bold px-7 py-3 text-base shadow-[0_4px_14px_rgba(176,87,64,0.28)] active:translate-y-px transition-all disabled:opacity-50";
const WORD_TILE =
    "inline-flex items-center rounded-lg border border-gray-200 dark:border-white/10 bg-[#fdf9f0] dark:bg-[#1a1410] px-3 py-2 text-gray-900 dark:text-gray-50";
const TARGET_TILE =
    "inline-flex items-center rounded-lg bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900 px-3 py-2 font-bold";

export default function SentenceBuilderGame({ activityId, content, assignmentId }: Props) {
    const roundSize = content.roundSize ?? DEFAULT_SENTENCE_BUILDER_ROUND_SIZE;
    const [dealKey, setDealKey] = useState(0);
    const rounds = useMemo(
        () => dealRounds(content.rounds, roundSize),
        // dealKey is a cache-buster: bumping it on replay deals a fresh game.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [content.rounds, roundSize, dealKey]
    );

    const [phase, setPhase] = useState<Phase>("intro");
    const [roundIdx, setRoundIdx] = useState(0);
    const [results, setResults] = useState<RoundResult[]>([]);
    const [announcement, setAnnouncement] = useState<string | null>(null);

    const [isCompleted, setIsCompleted] = useState(false);
    const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
    const [showToast, setShowToast] = useState(false);
    const grantingRef = useRef(false);

    useEffect(() => {
        let cancelled = false;
        void fetchActivityProgress(activityId, assignmentId).then((p) => {
            if (cancelled || !p) return;
            if (p.status === "completed" || p.status === "submitted" || p.progress >= 100) setIsCompleted(true);
        });
        return () => {
            cancelled = true;
        };
    }, [activityId, assignmentId]);

    const firstTryCount = results.filter((r) => r.firstTry).length;

    // Points come from the progress API, which awards once per activity.
    const grantCompletion = useCallback(
        async (accuracy: number) => {
            if (grantingRef.current || isCompleted) return;
            grantingRef.current = true;
            try {
                const result = await saveActivityProgress(activityId, 100, "completed", accuracy, undefined, assignmentId);
                if (!result?.ok) return;
                setIsCompleted(true);
                const awarded = result.pointsAwarded ?? 0;
                setPointsAwarded(awarded);
                if (awarded > 0) setShowToast(true);
            } catch {
                // ignore — the game does not depend on the toast
            } finally {
                grantingRef.current = false;
            }
        },
        [activityId, assignmentId, isCompleted]
    );

    const finishRound = (firstTry: boolean) => {
        const round = rounds[roundIdx];
        const next = [...results, { id: round.id, firstTry }];
        setResults(next);
        if (roundIdx + 1 >= rounds.length) {
            setPhase("done");
            const accuracy = Math.round((next.filter((r) => r.firstTry).length / next.length) * 100);
            void grantCompletion(accuracy);
        } else {
            setRoundIdx(roundIdx + 1);
        }
    };

    const playAgain = () => {
        setResults([]);
        setRoundIdx(0);
        setDealKey((k) => k + 1);
        setPhase("play");
    };

    if (rounds.length === 0) {
        return <div className="p-4 text-red-500 bg-red-50 rounded-lg">This Sentence Builder has no rounds yet.</div>;
    }

    if (phase === "intro") {
        return (
            <Shell>
                <div className="max-w-md mx-auto text-center pt-4 sm:pt-16">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/12 text-primary mb-5">
                        <Sparkles size={22} />
                    </div>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-50 leading-tight tracking-[-0.02em]">
                        {content.title}
                    </h1>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                        Build sentences, one word at a time. If you make a mistake, you will see the rule and try again.
                    </p>
                    <button type="button" onClick={() => setPhase("play")} className={`mt-8 ${PRIMARY_BUTTON}`}>
                        Start
                    </button>
                    <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">{rounds.length} sentences · about 3 minutes</p>
                </div>
            </Shell>
        );
    }

    if (phase === "done") {
        return (
            <Shell>
                <div className="max-w-md mx-auto text-center pt-4 sm:pt-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/15 text-secondary-dark mb-5">
                        <CheckCircle2 size={22} />
                    </div>
                    <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-gray-50 leading-tight tracking-[-0.02em]">
                        You built {results.length} sentences!
                    </h1>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                        {firstTryCount} right on the first try. Every mistake you fixed is practice too.
                    </p>
                    <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                        {content.courseMapPreset && <CourseMapReturnButton className="w-full sm:w-auto" />}
                        <button
                            type="button"
                            onClick={playAgain}
                            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-bold border border-gray-200 bg-white text-gray-800 hover:border-primary/40 dark:border-white/10 dark:bg-[#2a1f1a] dark:text-gray-100 transition-all"
                        >
                            <RotateCcw size={16} /> Play again
                        </button>
                    </div>
                </div>
                {showToast && pointsAwarded !== null && pointsAwarded > 0 && (
                    <PointsToast points={pointsAwarded} message="Sentences built" onComplete={() => setShowToast(false)} />
                )}
            </Shell>
        );
    }

    const round = rounds[roundIdx];
    return (
        <Shell>
            <div className="max-w-2xl mx-auto">
                <ProgressDots total={rounds.length} current={roundIdx} />
                <div className="mt-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2a1f1a] shadow-[0_1px_2px_rgba(74,47,26,0.04),0_8px_24px_rgba(74,47,26,0.06)] p-5 sm:p-7">
                    {round.kind === "place" && (
                        <PlaceRound key={round.id} round={round} rule={content.rules[round.rule]} onDone={finishRound} announce={setAnnouncement} />
                    )}
                    {round.kind === "pick" && (
                        <PickRound key={round.id} round={round} rule={content.rules[round.rule]} onDone={finishRound} announce={setAnnouncement} />
                    )}
                    {round.kind === "true" && <TrueRound key={round.id} round={round} onDone={finishRound} announce={setAnnouncement} />}
                </div>
            </div>
            <GameLiveRegion message={announcement} />
        </Shell>
    );
}

// ============================================================================
// Rounds
// ============================================================================

interface RoundProps<R extends SentenceBuilderRound> {
    round: R;
    onDone: (firstTry: boolean) => void;
    announce: (message: string) => void;
}

function PlaceRound({ round, rule, onDone, announce }: RoundProps<SentenceBuilderPlaceRound> & { rule?: SentenceBuilderRule }) {
    const [tries, setTries] = useState(0);
    const [wrongSlot, setWrongSlot] = useState<number | null>(null);
    const [solved, setSolved] = useState<{ slot: number; note?: string } | null>(null);

    const tap = (slot: number) => {
        const result = checkPlace(round, slot);
        if (result.correct) {
            setSolved({ slot, note: result.note });
            announce(`Correct. ${placeWord(round, slot).join(" ")}`);
        } else {
            setTries((t) => t + 1);
            setWrongSlot(slot);
            announce(`Not there. ${rule?.title ?? "Try again."}`);
        }
    };

    if (solved) {
        return (
            <>
                <Prompt>
                    Where does <b>{round.word}</b> go?
                </Prompt>
                <Sentence>
                    {placeWord(round, solved.slot).map((w, i) =>
                        i === solved.slot ? (
                            <span key={i} className={TARGET_TILE}>{w}</span>
                        ) : (
                            <span key={i} className={WORD_TILE}>{w}</span>
                        )
                    )}
                </Sentence>
                <Success message={solved.note ?? rule?.title} onNext={() => onDone(tries === 0)} />
            </>
        );
    }

    const slotLabel = (slot: number) =>
        slot === 0
            ? `Put ${round.word} at the start`
            : slot === round.words.length
              ? `Put ${round.word} at the end`
              : `Put ${round.word} after ${round.words[slot - 1]}`;

    return (
        <>
            <Prompt>
                Tap where <b>{round.word}</b> goes.
            </Prompt>
            <div className="mb-4 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                Your word: <span className={`${TARGET_TILE} text-lg`}>{round.word}</span>
            </div>
            <Sentence>
                {round.words.map((w, i) => (
                    <span key={i} className="contents">
                        <Slot label={slotLabel(i)} wrong={wrongSlot === i} onTap={() => tap(i)} />
                        <span className={WORD_TILE}>{w}</span>
                    </span>
                ))}
                <Slot label={slotLabel(round.words.length)} wrong={wrongSlot === round.words.length} onTap={() => tap(round.words.length)} />
            </Sentence>
            {tries > 0 && <RuleCard rule={rule} />}
        </>
    );
}

function PickRound({ round, rule, onDone, announce }: RoundProps<SentenceBuilderPickRound> & { rule?: SentenceBuilderRule }) {
    const blankCount = round.parts.filter(isBlank).length;
    const [selections, setSelections] = useState<(number | undefined)[]>(() => Array(blankCount).fill(undefined));
    const [tries, setTries] = useState(0);
    const [wrong, setWrong] = useState<number[]>([]);
    const [solved, setSolved] = useState(false);

    const choose = (blank: number, option: number) => {
        setSelections((s) => s.map((v, i) => (i === blank ? option : v)));
        setWrong((w) => w.filter((b) => b !== blank));
    };

    const check = () => {
        const result = checkPick(round, selections);
        if (result.correct) {
            setSolved(true);
            announce("Correct.");
        } else {
            setTries((t) => t + 1);
            setWrong(result.wrong);
            announce(`Not quite. ${rule?.title ?? "Try again."}`);
        }
    };

    // Gap number for each part (-1 for fixed text), so selections line up with checkPick.
    const gapNumbers = useMemo(() => {
        let n = -1;
        return round.parts.map((part) => (isBlank(part) ? ++n : -1));
    }, [round.parts]);

    return (
        <>
            <Prompt>{blankCount > 1 ? "Pick the right words for each gap." : "Pick the right words."}</Prompt>
            <Sentence>
                {round.parts.map((part, i) => {
                    if (!isBlank(part)) return <span key={i} className="py-2">{part}</span>;
                    const b = gapNumbers[i];
                    return (
                        <span key={i} className="inline-flex flex-wrap gap-1.5 rounded-xl border-2 border-dashed border-accent p-1" role="group" aria-label={`Gap ${b + 1}`}>
                            {part.options.map((option, j) => {
                                const picked = selections[b] === j;
                                const isWrong = picked && wrong.includes(b);
                                return (
                                    <button
                                        key={j}
                                        type="button"
                                        disabled={solved}
                                        aria-pressed={picked}
                                        onClick={() => choose(b, j)}
                                        className={`rounded-lg border px-3 py-1.5 text-lg transition-colors ${
                                            isWrong
                                                ? "border-red-400 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100"
                                                : picked
                                                  ? "border-gray-900 bg-gray-900 text-white dark:border-gray-50 dark:bg-gray-50 dark:text-gray-900"
                                                  : "border-gray-200 bg-[#fdf9f0] text-gray-900 hover:border-primary/40 dark:border-white/10 dark:bg-[#1a1410] dark:text-gray-50"
                                        }`}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </span>
                    );
                })}
            </Sentence>
            {solved ? (
                <Success message={rule?.title} onNext={() => onDone(tries === 0)} />
            ) : (
                <>
                    {tries > 0 && wrong.length > 0 && <RuleCard rule={rule} />}
                    <button type="button" onClick={check} disabled={selections.some((s) => s === undefined)} className={`mt-5 ${PRIMARY_BUTTON}`}>
                        Check
                    </button>
                </>
            )}
        </>
    );
}

function TrueRound({ round, onDone, announce }: RoundProps<SentenceBuilderTrueRound>) {
    const [choice, setChoice] = useState<string | null>(null);
    const [said, setSaid] = useState(false);

    return (
        <>
            <Prompt>
                {round.question} <span className="text-gray-500 dark:text-gray-400">No wrong answers.</span>
            </Prompt>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Your answer">
                {round.choices.map((c) => (
                    <button
                        key={c}
                        type="button"
                        disabled={said}
                        aria-pressed={choice === c}
                        onClick={() => {
                            setChoice(c);
                            announce(fillTemplate(round, c));
                        }}
                        className={`rounded-lg border px-3 py-1.5 text-lg transition-colors ${
                            choice === c
                                ? "border-gray-900 bg-gray-900 text-white dark:border-gray-50 dark:bg-gray-50 dark:text-gray-900"
                                : "border-gray-200 bg-[#fdf9f0] text-gray-900 hover:border-primary/40 dark:border-white/10 dark:bg-[#1a1410] dark:text-gray-50"
                        }`}
                    >
                        {c}
                    </button>
                ))}
            </div>
            {choice && (
                <>
                    <p className="mt-6 font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-[-0.01em]">
                        {fillTemplate(round, choice)}
                    </p>
                    {said ? (
                        <Success message="That's a true sentence about you." onNext={() => onDone(true)} />
                    ) : (
                        <>
                            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Say your sentence out loud, to a partner or quietly to yourself.</p>
                            <button type="button" onClick={() => setSaid(true)} className={`mt-4 ${PRIMARY_BUTTON}`}>
                                <MessageCircle size={18} /> I said it out loud
                            </button>
                        </>
                    )}
                </>
            )}
        </>
    );
}

// ============================================================================
// Pieces
// ============================================================================

function Shell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-full bg-[#fdf9f0] dark:bg-[#1a1410]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
                <div className="mb-4">
                    <ContextualBackButton aria-label="Back to activities" />
                </div>
                {children}
            </div>
        </div>
    );
}

function ProgressDots({ total, current }: { total: number; current: number }) {
    return (
        <div className="flex gap-1.5" aria-label={`Sentence ${current + 1} of ${total}`}>
            {Array.from({ length: total }, (_, i) => (
                <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${i < current ? "bg-secondary" : i === current ? "bg-accent" : "bg-gray-200 dark:bg-white/10"}`}
                />
            ))}
        </div>
    );
}

function Prompt({ children }: { children: React.ReactNode }) {
    return <p className="mb-4 text-gray-600 dark:text-gray-300">{children}</p>;
}

function Sentence({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-wrap items-center gap-1.5 text-xl sm:text-2xl text-gray-900 dark:text-gray-50">{children}</div>;
}

function Slot({ label, wrong, onTap }: { label: string; wrong: boolean; onTap: () => void }) {
    return (
        <button
            type="button"
            aria-label={label}
            onClick={onTap}
            className={`h-11 w-8 rounded-md border-2 border-dashed transition-colors ${
                wrong ? "border-red-400 bg-red-50 dark:bg-red-950/40" : "border-accent hover:bg-accent/20 focus-visible:bg-accent/20"
            }`}
        />
    );
}

function RuleCard({ rule }: { rule?: SentenceBuilderRule }) {
    if (!rule) return <p className="mt-5 text-sm text-gray-600 dark:text-gray-300">Not quite. Try again.</p>;
    return (
        <div className="mt-5 rounded-xl border-2 border-primary/60 bg-[#fdf9f0] dark:bg-[#1a1410] p-4">
            <p className="flex items-center gap-1.5 font-bold text-primary">
                <Lightbulb size={16} /> {rule.title}
            </p>
            <p className="mt-1 text-gray-700 dark:text-gray-200">Example: {rule.example}</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Try again.</p>
        </div>
    );
}

function Success({ message, onNext }: { message?: string; onNext: () => void }) {
    return (
        <div className="mt-5 rounded-xl border border-secondary/40 bg-secondary/10 p-4">
            <p className="flex items-center gap-1.5 font-bold text-secondary-dark dark:text-secondary-light">
                <CheckCircle2 size={16} /> Yes!
            </p>
            {message && <p className="mt-1 text-gray-700 dark:text-gray-200">{message}</p>}
            <button type="button" onClick={onNext} className={`mt-4 ${PRIMARY_BUTTON}`}>
                Next
            </button>
        </div>
    );
}
