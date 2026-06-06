"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Activity,
    CheckCircle2,
    Clipboard,
    HeartPulse,
    Lightbulb,
    RotateCcw,
    Sparkles,
    Trophy,
} from "lucide-react";
import type {
    GrammarHospitalCase,
    GrammarHospitalContent,
    GrammarHospitalErrorTag,
    GrammarHospitalFocus,
    GrammarHospitalHelper,
    GrammarHospitalTier,
} from "@/types/activity";
import { fetchActivityProgress, saveActivityProgress } from "@/lib/activityProgress";
import { fetchGameSettings, saveGameSettings } from "@/lib/gameSettings";
import { CourseMapReturnButton } from "@/components/navigation/CourseMapReturnButton";
import { ContextualBackButton } from "@/components/navigation/ContextualBackButton";
import { PointsToast } from "@/components/ui/PointsToast";
import {
    DEFAULT_GH_SETTINGS,
    normalizeGHSettings,
    SettingsButton,
    SettingsForm,
    type GrammarHospitalSettings,
} from "@/components/games/grammar-hospital/SettingsPanel";
import {
    getCaseStepInfo,
    getDiagnoseConfig,
    getInitialCasePhase,
    sortCasesProgressively,
} from "@/lib/grammar-hospital/progression";
import {
    BEGINNER_HELPER_OPTIONS,
    formatHelperOptionLabel,
    helperAtSentenceStart,
    resolveCorrectHelper,
} from "@/lib/grammar-hospital/helpers";

const GAME_ID = "grammar-hospital";

/**
 * Grammar Hospital — diagnose / choose helper / repair drill.
 *
 * Adult ESOL learners default to BE as a universal helper under pressure
 * ("Are they work here?"). Each case walks them through three steps:
 *   1. Diagnose what's wrong (multi-select error tags)
 *   2. Choose the correct helper (do / does / be)
 *   3. Repair the sentence (type or tap-to-build)
 * Then a soft feedback step before moving to the next patient.
 *
 * Participation grant on full completion via saveActivityProgress(100, "completed");
 * idempotent server-side so refreshes do not double-award.
 */

interface Props {
    activityId: string;
    content: GrammarHospitalContent;
    assignmentId?: string | null;
}

type Phase = "intro" | "diagnose" | "helper" | "repair" | "feedback" | "review";

const ERROR_LABELS: Record<GrammarHospitalErrorTag, string> = {
    "wrong-helper": "Wrong helper",
    "verb-form": "Verb form problem",
    "extra-word": "Extra word",
    "missing-word": "Missing word",
    "word-order": "Word order problem",
};

function normalizeAnswer(s: string): string {
    return s
        .toLowerCase()
        .replace(/[.,!?;:"]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function answerMatches(input: string, healthy: string, acceptable?: string[]): boolean {
    const n = normalizeAnswer(input);
    if (!n) return false;
    if (n === normalizeAnswer(healthy)) return true;
    return (acceptable ?? []).some((a) => n === normalizeAnswer(a));
}

function shuffle<T>(arr: readonly T[]): T[] {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

function renderUnhealthy(c: GrammarHospitalCase): React.ReactNode {
    if (!c.highlightSpan) {
        return <span>{c.unhealthy}</span>;
    }
    const [start, end] = c.highlightSpan;
    const before = c.unhealthy.slice(0, start);
    const mid = c.unhealthy.slice(start, end);
    const after = c.unhealthy.slice(end);
    return (
        <>
            {before}
            <span className="relative inline-block">
                <span className="relative z-10 text-primary font-bold">{mid}</span>
                <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 bottom-0 h-[0.32em] bg-primary/15 rounded-sm -z-0"
                />
            </span>
            {after}
        </>
    );
}

export default function GrammarHospitalGame({ activityId, content }: Props) {
    const allCases = useMemo(() => content.cases ?? [], [content.cases]);
    const participationPoints = content.participationPoints ?? 5;
    const isCourseMapPreset = content.courseMapPreset === true;
    const presetSettings = useMemo(
        () => normalizeGHSettings(content.defaultSettings),
        [content.defaultSettings]
    );

    // Settings — defaults until preferences load. Filtering uses these.
    const [settings, setSettings] = useState<GrammarHospitalSettings>(DEFAULT_GH_SETTINGS);
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    // Counts across the full deck — used by the settings panel badges.
    const tierCounts = useMemo(() => {
        const acc: Record<GrammarHospitalTier, number> = { beginner: 0, intermediate: 0, advanced: 0 };
        for (const c of allCases) acc[c.tier ?? "beginner"] += 1;
        return acc;
    }, [allCases]);

    const focusCounts = useMemo(() => {
        const acc = {} as Record<GrammarHospitalFocus, number>;
        for (const c of allCases) {
            const f = c.grammarFocus ?? "do-does";
            acc[f] = (acc[f] ?? 0) + 1;
        }
        return acc;
    }, [allCases]);

    // Filtered deck — drives the actual queue the learner sees.
    // Empty-result fallback: if focus filter yields nothing, widen to all
    // focuses in tier; if that's still empty, widen to all cases.
    const cases = useMemo(() => {
        const inTier = allCases.filter((c) => (c.tier ?? "beginner") === settings.tier);
        const inComplexity = inTier.filter((c) => (c.complexity ?? 3) <= settings.complexity);
        const base = inComplexity.length > 0 ? inComplexity : inTier;
        let filtered = base;
        if (settings.focuses.length > 0) {
            const narrowed = base.filter((c) => settings.focuses.includes(c.grammarFocus ?? "do-does"));
            filtered = narrowed.length > 0 ? narrowed : base;
        }
        return sortCasesProgressively(filtered);
    }, [allCases, settings]);

    const totalCases = cases.length;

    const [caseIdx, setCaseIdx] = useState(0);
    const [phase, setPhase] = useState<Phase>("intro");
    const [diagnoseSel, setDiagnoseSel] = useState<Set<GrammarHospitalErrorTag>>(new Set());
    const [helperPick, setHelperPick] = useState<GrammarHospitalHelper | null>(null);
    const [repairInput, setRepairInput] = useState("");
    const [repairTiles, setRepairTiles] = useState<string[]>([]);
    const [bankTiles, setBankTiles] = useState<string[]>([]);
    const [hintOpen, setHintOpen] = useState(false);
    const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
    const [attempts, setAttempts] = useState(0);

    // Per-case scoring tally
    const [results, setResults] = useState<Array<{ id: string; correct: boolean; attempts: number }>>([]);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);

    // Completion / points
    const [isCompleted, setIsCompleted] = useState(false);
    const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
    const [showToast, setShowToast] = useState(false);
    const grantingRef = useRef(false);

    const current: GrammarHospitalCase | undefined = cases[caseIdx];
    const isBuildMode = !!current?.wordBank && current.wordBank.length > 0;
    const diagnoseConfig = useMemo(
        () => (current ? getDiagnoseConfig(current) : { tags: [] as GrammarHospitalErrorTag[], multiSelect: false }),
        [current]
    );

    // Load user settings on mount, mirror to server when changed.
    useEffect(() => {
        let cancelled = false;
        if (isCourseMapPreset) {
            setSettings(presetSettings);
            setSettingsLoaded(true);
            return;
        }
        void fetchGameSettings(GAME_ID).then((stored) => {
            if (cancelled) return;
            if (stored) setSettings(normalizeGHSettings(stored));
            setSettingsLoaded(true);
        });
        return () => {
            cancelled = true;
        };
    }, [isCourseMapPreset, presetSettings]);

    // Persist whenever settings change (after the initial load).
    useEffect(() => {
        if (!settingsLoaded || isCourseMapPreset) return;
        saveGameSettings(GAME_ID, settings as unknown as Record<string, unknown>);
    }, [settings, settingsLoaded, isCourseMapPreset]);

    // Reset to the first case in the filtered deck whenever the filter changes.
    // If the player was mid-case or on the review screen, bounce them into the
    // new deck. Intro stays intro so opening the panel before starting doesn't
    // skip the welcome.
    const settingsKey = `${settings.tier}|${settings.complexity}|${settings.focuses.join(",")}`;
    useEffect(() => {
        setCaseIdx(0);
        setResults([]);
        setStreak(0);
        setPhase((p) => {
            if (p === "intro") return p;
            return getInitialCasePhase(cases[0]);
        });
    }, [settingsKey, cases]);

    // Pre-existing completion → jump to review.
    useEffect(() => {
        let cancelled = false;
        void fetchActivityProgress(activityId).then((p) => {
            if (cancelled || !p) return;
            if (p.status === "completed" || p.status === "submitted" || p.progress >= 100) {
                setIsCompleted(true);
                setPhase("review");
            }
        });
        return () => {
            cancelled = true;
        };
    }, [activityId]);

    // Reset per-case state whenever we enter a new case.
    useEffect(() => {
        if (!current) return;
        setDiagnoseSel(new Set());
        setHelperPick(null);
        setRepairInput("");
        setHintOpen(false);
        setLastCorrect(null);
        setAttempts(0);
        if (current.wordBank && current.wordBank.length > 0) {
            setBankTiles(shuffle(current.wordBank));
            setRepairTiles([]);
        } else {
            setBankTiles([]);
            setRepairTiles([]);
        }
    }, [current]);

    const accuracy = useMemo(() => {
        if (results.length === 0) return 0;
        const correct = results.filter((r) => r.correct).length;
        return Math.round((correct / results.length) * 100);
    }, [results]);

    const grantCompletion = useCallback(async () => {
        if (grantingRef.current || isCompleted) return;
        grantingRef.current = true;
        try {
            const result = await saveActivityProgress(activityId, 100, "completed");
            if (!result?.ok) return;
            setIsCompleted(true);
            const awarded = result.pointsAwarded ?? participationPoints;
            setPointsAwarded(awarded);
            if (awarded > 0) setShowToast(true);
        } catch {
            // ignore — UI doesn't depend on the toast
        }
    }, [activityId, isCompleted, participationPoints]);

    const goNextCase = useCallback(() => {
        if (caseIdx + 1 >= totalCases) {
            setPhase("review");
            void grantCompletion();
        } else {
            const nextIdx = caseIdx + 1;
            setCaseIdx(nextIdx);
            setPhase(getInitialCasePhase(cases[nextIdx]));
        }
    }, [caseIdx, totalCases, grantCompletion, cases]);

    // ---- Step handlers ----
    const toggleErrorTag = (tag: GrammarHospitalErrorTag) => {
        setDiagnoseSel((prev) => {
            if (!diagnoseConfig.multiSelect) {
                return prev.has(tag) ? new Set() : new Set([tag]);
            }
            const next = new Set(prev);
            if (next.has(tag)) next.delete(tag);
            else next.add(tag);
            return next;
        });
    };

    const submitRepair = () => {
        if (!current) return;
        const value = isBuildMode ? repairTiles.join(" ") : repairInput;
        const ok = answerMatches(value, current.healthy, current.acceptable);
        setAttempts((a) => a + 1);
        setLastCorrect(ok);
        setPhase("feedback");
        if (ok) {
            setStreak((s) => {
                const next = s + 1;
                setBestStreak((b) => Math.max(b, next));
                return next;
            });
            setResults((prev) => [
                ...prev.filter((r) => r.id !== current.id),
                { id: current.id, correct: true, attempts: attempts + 1 },
            ]);
        } else {
            setStreak(0);
        }
    };

    const tryRepairAgain = () => {
        if (!current) return;
        if (isBuildMode && current.wordBank) {
            setBankTiles(shuffle(current.wordBank));
            setRepairTiles([]);
        } else {
            setRepairInput("");
        }
        setLastCorrect(null);
        setPhase("repair");
    };

    const acceptIncorrectAndMove = () => {
        if (!current) return;
        // Record as needs-more-care, then advance.
        setResults((prev) => [
            ...prev.filter((r) => r.id !== current.id),
            { id: current.id, correct: false, attempts },
        ]);
        goNextCase();
    };

    // Never nest setters here. Strict mode double-invokes updater functions,
    // so a `setBankTiles(...)` queued from inside `setRepairTiles((prev) => …)`
    // would fire twice and duplicate the tile. Pass the tile in as an arg.
    const moveTileToAnswer = (tile: string, fromBankIdx: number) => {
        setBankTiles((prev) => {
            // Guard against double-fire: only remove if the tile at fromBankIdx
            // actually matches what we picked. If it doesn't, the state has
            // already moved on (e.g. a previous render's tap re-fired).
            if (prev[fromBankIdx] !== tile) return prev;
            return prev.filter((_, i) => i !== fromBankIdx);
        });
        setRepairTiles((prev) => [...prev, tile]);
    };

    const moveTileToBank = (tile: string, fromRepairIdx: number) => {
        setRepairTiles((prev) => {
            if (prev[fromRepairIdx] !== tile) return prev;
            return prev.filter((_, i) => i !== fromRepairIdx);
        });
        setBankTiles((prev) => [...prev, tile]);
    };

    if (totalCases === 0) {
        return (
            <div className="p-6 text-gray-600 bg-amber-50 border border-amber-200 rounded-lg">
                No patients have been added to this Grammar Hospital yet.
            </div>
        );
    }

    // ============================================================
    // REVIEW SCREEN
    // ============================================================
    if (phase === "review") {
        const treated = results.length;
        const correct = results.filter((r) => r.correct).length;
        const needsCare = treated - correct;
        return (
            <div className="min-h-full bg-[#fdf9f0] dark:bg-[#1a1410]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/15 text-secondary-dark dark:bg-secondary/25 dark:text-secondary-light mb-3">
                            <HeartPulse size={26} />
                        </div>
                        <p className="text-[0.7rem] uppercase tracking-[0.18em] font-bold text-primary-dark dark:text-primary-light mb-1">
                            Today&apos;s Report
                        </p>
                        <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-50 leading-tight">
                            Great work, Doctor.
                        </h1>
                        {isCompleted && pointsAwarded !== null && pointsAwarded > 0 && (
                            <p className="mt-3 text-sm text-secondary-dark dark:text-secondary-light font-medium">
                                +{pointsAwarded} participation points logged.
                            </p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2a1f1a] shadow-[0_1px_2px_rgba(74,47,26,0.04),0_8px_24px_rgba(74,47,26,0.06)] p-6 sm:p-8">
                        <div className="flex items-center justify-center mb-6">
                            <AccuracyDial value={accuracy} />
                        </div>

                        <ul className="divide-y divide-gray-100 dark:divide-white/10">
                            <SummaryRow icon={<Clipboard size={16} />} label="Patients treated" value={String(treated)} />
                            <SummaryRow icon={<CheckCircle2 size={16} className="text-secondary-dark" />} label="Correct" value={String(correct)} />
                            <SummaryRow icon={<HeartPulse size={16} className="text-primary" />} label="Needs more care" value={String(needsCare)} />
                            <SummaryRow icon={<Trophy size={16} className="text-accent" />} label="Best streak" value={`${bestStreak} in a row`} />
                        </ul>

                        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center">
                            {isCourseMapPreset && (
                                <CourseMapReturnButton className="w-full sm:w-auto" />
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    setResults([]);
                                    setStreak(0);
                                    setBestStreak(0);
                                    setCaseIdx(0);
                                    setPhase(getInitialCasePhase(cases[0]));
                                }}
                                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-bold transition-all ${
                                    isCourseMapPreset
                                        ? "border border-gray-200 bg-white text-gray-800 hover:border-primary/40 dark:border-white/10 dark:bg-[#2a1f1a] dark:text-gray-100"
                                        : "bg-primary text-white shadow-[0_4px_14px_rgba(176,87,64,0.28)] hover:bg-[#984734]"
                                }`}
                            >
                                <RotateCcw size={16} /> Keep practicing
                            </button>
                        </div>
                    </div>
                </div>

                {showToast && pointsAwarded !== null && pointsAwarded > 0 && (
                    <PointsToast
                        points={pointsAwarded}
                        message="All patients seen"
                        onComplete={() => setShowToast(false)}
                    />
                )}
            </div>
        );
    }

    if (!current) return null;

    // ============================================================
    // INTRO SCREEN
    // ============================================================
    if (phase === "intro") {
        return (
            <div className="min-h-full bg-[#fdf9f0] dark:bg-[#1a1410]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                    <div className="mb-8">
                        <ContextualBackButton aria-label="Back to activities" />
                    </div>

                    {isCourseMapPreset ? (
                        <div className="max-w-md mx-auto text-center pt-4 sm:pt-16">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/12 text-primary mb-5">
                                <HeartPulse size={22} />
                            </div>
                            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-50 leading-tight tracking-[-0.02em]">
                                Fix the Sentence
                            </h1>
                            <button
                                type="button"
                                onClick={() => setPhase(getInitialCasePhase(cases[0]))}
                                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary hover:bg-[#984734] text-white font-bold px-8 py-3.5 text-base shadow-[0_4px_14px_rgba(176,87,64,0.28)] active:translate-y-px transition-all"
                            >
                                Start
                            </button>
                            <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">
                                {totalCases} {totalCases === 1 ? "sentence" : "sentences"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 items-start lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="max-w-md">
                                <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-primary/12 text-primary mb-4">
                                    <HeartPulse size={20} />
                                </div>
                                <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-50 leading-tight tracking-[-0.02em]">
                                    Grammar Hospital
                                </h1>
                                <button
                                    type="button"
                                    onClick={() => setPhase(getInitialCasePhase(cases[0]))}
                                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary hover:bg-[#984734] text-white font-bold px-7 py-3 text-base shadow-[0_4px_14px_rgba(176,87,64,0.28)] active:translate-y-px transition-all"
                                >
                                    Start
                                </button>
                                <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
                                    {totalCases} {totalCases === 1 ? "sentence" : "sentences"} at this level
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white dark:bg-[#2a1f1a] border border-gray-200 dark:border-white/10 shadow-[0_8px_30px_rgba(74,47,26,0.08)] p-6 sm:p-7">
                                <h2 className="font-display text-lg font-bold text-gray-900 dark:text-gray-50 mb-4">
                                    Level
                                </h2>
                                <SettingsForm
                                    value={settings}
                                    onChange={setSettings}
                                    tierCounts={tierCounts}
                                    focusCounts={focusCounts}
                                    tierTileSize="spacious"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ============================================================
    // CASE WORKING SCREENS (diagnose / helper / repair / feedback)
    // ============================================================
    const stepInfo = getCaseStepInfo(
        current,
        phase === "feedback" ? "repair" : phase
    );

    return (
        <div className="min-h-full bg-[#fdf9f0] dark:bg-[#1a1410]">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <ContextualBackButton aria-label="Back to activities" />
                        <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                            {caseIdx + 1} / {totalCases}
                        </span>
                    </div>
                    {streak >= 2 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/25 text-amber-900 dark:text-amber-100 text-xs font-semibold border border-accent/40">
                            <Sparkles size={11} /> {streak}
                        </span>
                    )}
                </div>

                <div className="h-1 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden mb-5">
                    <div
                        className="h-full bg-primary rounded-full transition-[width] duration-500"
                        style={{
                            width: `${((caseIdx + (stepInfo.stepNumber / stepInfo.totalSteps)) / totalCases) * 100}%`,
                        }}
                    />
                </div>

                <div
                    className={`rounded-2xl border bg-white dark:bg-[#2a1f1a] shadow-[0_1px_2px_rgba(74,47,26,0.04),0_8px_24px_rgba(74,47,26,0.06)] p-5 sm:p-7 transition-colors duration-500 ${
                        phase === "feedback" && lastCorrect
                            ? "border-secondary/40 bg-gradient-to-b from-secondary/8 to-white dark:from-secondary/10 dark:to-[#2a1f1a]"
                            : "border-gray-200 dark:border-white/10"
                    }`}
                >
                    <div
                        className={
                            phase === "feedback" && lastCorrect
                                ? "mb-6 text-center"
                                : "flex items-start justify-between gap-3 mb-6"
                        }
                    >
                        {phase === "feedback" && lastCorrect ? (
                            <>
                                <p className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-dark dark:text-secondary-light mb-2">
                                    <Sparkles size={13} /> Fixed
                                </p>
                                <p className="font-display font-bold text-secondary-dark dark:text-secondary-light tracking-[-0.02em] leading-[1.15] text-[1.75rem] sm:text-[2.25rem]">
                                    {current.healthy}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="font-display font-bold text-gray-900 dark:text-gray-50 tracking-[-0.02em] leading-[1.15] text-[1.75rem] sm:text-[2.25rem] flex-1 min-w-0">
                                    {renderUnhealthy(current)}
                                </p>
                                <div className="flex items-center gap-1.5 shrink-0 pt-1">
                                    {!isCourseMapPreset && (
                                        <SettingsButton
                                            value={settings}
                                            onChange={setSettings}
                                            tierCounts={tierCounts}
                                            focusCounts={focusCounts}
                                        />
                                    )}
                                    <ReminderInfo />
                                </div>
                            </>
                        )}
                    </div>

                    {phase === "diagnose" && (
                        <DiagnoseStep
                            options={diagnoseConfig.tags}
                            multiSelect={diagnoseConfig.multiSelect}
                            selected={diagnoseSel}
                            onToggle={toggleErrorTag}
                            onContinue={() => setPhase("helper")}
                        />
                    )}
                    {phase === "helper" && (
                        <HelperStep
                            pick={helperPick}
                            onPick={setHelperPick}
                            caseItem={current}
                            onContinue={() => setPhase("repair")}
                        />
                    )}
                    {phase === "repair" && (
                        <RepairStep
                            buildMode={isBuildMode}
                            input={repairInput}
                            onInput={setRepairInput}
                            bankTiles={bankTiles}
                            repairTiles={repairTiles}
                            onPickTile={moveTileToAnswer}
                            onUnpickTile={moveTileToBank}
                            hint={current.hint}
                            hintOpen={hintOpen}
                            onToggleHint={() => setHintOpen((h) => !h)}
                            onCheck={submitRepair}
                        />
                    )}
                    {phase === "feedback" && (
                        <FeedbackStep
                            correct={!!lastCorrect}
                            caseItem={current}
                            attempts={attempts}
                            onTryAgain={tryRepairAgain}
                            onAcceptAndMove={acceptIncorrectAndMove}
                            onNext={goNextCase}
                            isLast={caseIdx + 1 >= totalCases}
                        />
                    )}
                </div>
            </div>

            {showToast && pointsAwarded !== null && pointsAwarded > 0 && (
                <PointsToast
                    points={pointsAwarded}
                    message="All patients seen"
                    onComplete={() => setShowToast(false)}
                />
            )}
        </div>
    );
}

// ============================================================================
// Sub-components
// ============================================================================

function ReminderInfo() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-label="Helper verb reminder"
                title="Helper verb reminder"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/80 dark:bg-[#2a1f1a]/80 border border-gray-200 dark:border-white/15 text-gray-500 dark:text-gray-300 hover:text-primary hover:border-primary/50 backdrop-blur-sm shadow-sm transition-colors"
            >
                <Lightbulb size={15} />
            </button>
            {open && (
                <div
                    role="dialog"
                    aria-label="Helper verb reminder"
                    className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2a1f1a] shadow-lg p-3.5 z-20 text-sm text-gray-600 dark:text-gray-300"
                >
                    <p><span className="font-semibold text-gray-900 dark:text-gray-50">Actions</span> → do / does</p>
                    <p className="mt-1.5"><span className="font-semibold text-gray-900 dark:text-gray-50">States</span> → am / is / are</p>
                </div>
            )}
        </div>
    );
}

function DiagnoseStep({
    options,
    multiSelect,
    selected,
    onToggle,
    onContinue,
}: {
    options: GrammarHospitalErrorTag[];
    multiSelect: boolean;
    selected: Set<GrammarHospitalErrorTag>;
    onToggle: (tag: GrammarHospitalErrorTag) => void;
    onContinue: () => void;
}) {
    return (
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {multiSelect ? "What's wrong? Pick all that apply." : "What's wrong?"}
            </p>

            <ul className="space-y-2">
                {options.map((tag) => {
                    const active = selected.has(tag);
                    return (
                        <li key={tag}>
                            <button
                                type="button"
                                onClick={() => onToggle(tag)}
                                aria-pressed={active}
                                className={
                                    active
                                        ? "w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary bg-primary/8 text-gray-900 dark:text-gray-50 font-medium text-base transition-all"
                                        : "w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#332419] text-gray-800 dark:text-gray-100 font-medium text-base hover:border-primary/40 transition-all"
                                }
                            >
                                <span className="flex-1 text-left">{ERROR_LABELS[tag]}</span>
                                {active && (
                                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>

            <div className="mt-5 flex justify-end">
                <button
                    type="button"
                    onClick={onContinue}
                    disabled={selected.size === 0}
                    className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-[#984734] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 shadow-[0_4px_14px_rgba(176,87,64,0.28)] active:translate-y-px transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

function HelperStep({
    pick,
    onPick,
    caseItem,
    onContinue,
}: {
    pick: GrammarHospitalHelper | null;
    onPick: (h: GrammarHospitalHelper) => void;
    caseItem: GrammarHospitalCase;
    onContinue: () => void;
}) {
    const atSentenceStart = helperAtSentenceStart(caseItem);
    const correctHelper = resolveCorrectHelper(caseItem.correctHelper);

    const optionButtonClass = (state: "correct" | "wrong" | "active" | "default") => {
        const base =
            "w-full px-3 py-3.5 rounded-xl font-display text-xl sm:text-2xl font-bold tracking-tight transition-all flex items-center justify-center gap-2 min-h-[56px]";
        if (state === "correct") {
            return `${base} border-2 border-secondary bg-secondary/10 text-secondary-dark dark:text-secondary-light`;
        }
        if (state === "wrong") {
            return `${base} border-2 border-primary bg-primary/8 text-primary`;
        }
        if (state === "active") {
            return `${base} border-2 border-primary bg-primary/8 text-gray-900 dark:text-gray-50`;
        }
        return `${base} border border-gray-200 dark:border-white/10 bg-white dark:bg-[#332419] text-gray-900 dark:text-gray-50 hover:border-primary/40`;
    };

    return (
        <div>
            <div className="grid grid-cols-2 gap-2">
                {BEGINNER_HELPER_OPTIONS.map((opt) => {
                    const active = pick === opt;
                    const isWrongPick = pick && pick !== correctHelper && pick === opt;
                    const isCorrectPick = pick && active && pick === correctHelper;
                    const state = isCorrectPick
                        ? "correct"
                        : isWrongPick
                          ? "wrong"
                          : active
                            ? "active"
                            : "default";
                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => onPick(opt)}
                            aria-pressed={active}
                            className={optionButtonClass(state)}
                        >
                            <span>{formatHelperOptionLabel(opt, atSentenceStart)}</span>
                            {isCorrectPick && (
                                <CheckCircle2 size={16} className="text-secondary-dark dark:text-secondary-light shrink-0" />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="mt-5 flex justify-end">
                <button
                    type="button"
                    onClick={onContinue}
                    disabled={!pick}
                    className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-[#984734] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 shadow-[0_4px_14px_rgba(176,87,64,0.28)] active:translate-y-px transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

function RepairStep({
    buildMode,
    input,
    onInput,
    bankTiles,
    repairTiles,
    onPickTile,
    onUnpickTile,
    hint,
    hintOpen,
    onToggleHint,
    onCheck,
}: {
    buildMode: boolean;
    input: string;
    onInput: (v: string) => void;
    bankTiles: string[];
    repairTiles: string[];
    onPickTile: (tile: string, fromBankIdx: number) => void;
    onUnpickTile: (tile: string, fromRepairIdx: number) => void;
    hint?: string;
    hintOpen: boolean;
    onToggleHint: () => void;
    onCheck: () => void;
}) {
    const canCheck = buildMode ? repairTiles.length > 0 && bankTiles.length === 0 : input.trim().length > 0;
    return (
        <div>
            {buildMode ? (
                <div className="space-y-4">
                    <div className="min-h-[72px] rounded-xl border-2 border-dashed border-primary/40 bg-amber-50/40 dark:bg-[#3a2820]/40 p-3 flex flex-wrap gap-2 items-start">
                        {repairTiles.length === 0 ? (
                            <p className="text-sm text-gray-400 self-center mx-auto">Tap words below</p>
                        ) : (
                            repairTiles.map((t, i) => (
                                <button
                                    key={`${t}-${i}`}
                                    type="button"
                                    onClick={() => onUnpickTile(t, i)}
                                    className="inline-flex items-center rounded-lg border border-primary/40 bg-white dark:bg-[#2a1f1a] px-3 py-2 text-base font-semibold text-gray-900 dark:text-gray-50 shadow-sm hover:border-primary transition-all min-h-[44px]"
                                >
                                    {t}
                                </button>
                            ))
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {bankTiles.map((t, i) => (
                                <button
                                    key={`${t}-${i}`}
                                    type="button"
                                    onClick={() => onPickTile(t, i)}
                                    className="inline-flex items-center rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-[#332419] px-3 py-2 text-base font-semibold text-gray-800 dark:text-gray-100 hover:border-primary hover:bg-amber-50 dark:hover:bg-[#3a2820] transition-all min-h-[44px]"
                                >
                                    {t}
                                </button>
                            ))}
                        {bankTiles.length === 0 && (
                            <p className="text-xs text-gray-400">Tap a word above to change it.</p>
                        )}
                    </div>
                </div>
            ) : (
                <input
                    type="text"
                    value={input}
                    onChange={(e) => onInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && canCheck) onCheck();
                    }}
                    autoFocus
                    placeholder="Write the correct sentence"
                    className="w-full rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-[#332419] px-4 py-3.5 text-lg font-display text-gray-900 dark:text-gray-50 placeholder:text-gray-400 placeholder:font-body placeholder:text-base focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
            )}

            <div className="mt-4 flex items-center justify-between gap-3">
                {hint ? (
                    <button
                        type="button"
                        onClick={onToggleHint}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                    >
                        <Lightbulb size={14} />
                        Hint
                    </button>
                ) : (
                    <span />
                )}
                <button
                    type="button"
                    onClick={onCheck}
                    disabled={!canCheck}
                    className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-[#984734] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 shadow-[0_4px_14px_rgba(176,87,64,0.28)] active:translate-y-px transition-all"
                >
                    Check
                </button>
            </div>

            {hintOpen && hint && (
                <div className="mt-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#332419] px-4 py-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{hint}</p>
                </div>
            )}
        </div>
    );
}

function FeedbackStep({
    correct,
    caseItem,
    attempts,
    onTryAgain,
    onAcceptAndMove,
    onNext,
    isLast,
}: {
    correct: boolean;
    caseItem: GrammarHospitalCase;
    attempts: number;
    onTryAgain: () => void;
    onAcceptAndMove: () => void;
    onNext: () => void;
    isLast: boolean;
}) {
    if (correct) {
        return (
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/15 text-secondary-dark dark:bg-secondary/25 dark:text-secondary-light mb-4 motion-safe:animate-bounce">
                    <CheckCircle2 size={34} strokeWidth={2.5} />
                </div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">
                    Nice work!
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-7 max-w-sm mx-auto leading-relaxed">
                    {caseItem.explanation}
                </p>
                <button
                    type="button"
                    onClick={onNext}
                    className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-[#984734] text-white font-bold px-7 py-3 text-base shadow-[0_4px_14px_rgba(176,87,64,0.28)] active:translate-y-px transition-all"
                >
                    {isLast ? "See results" : "Next sentence"} <Activity size={16} />
                </button>
            </div>
        );
    }

    return (
        <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
                {caseItem.explanation}
            </p>

            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={onAcceptAndMove}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                    Skip
                </button>
                <button
                    type="button"
                    onClick={onTryAgain}
                    className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-[#984734] text-white font-bold px-6 py-2.5 transition-all"
                >
                    <RotateCcw size={15} /> Try again
                </button>
            </div>

            {attempts >= 2 && (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                    Answer: <span className="font-medium text-gray-700 dark:text-gray-200">{caseItem.healthy}</span>
                </p>
            )}
        </div>
    );
}

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <li className="flex items-center justify-between py-3">
            <span className="flex items-center gap-2.5 text-gray-700 dark:text-gray-200">
                <span className="text-gray-500 dark:text-gray-400">{icon}</span>
                {label}
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-50">{value}</span>
        </li>
    );
}

function AccuracyDial({ value }: { value: number }) {
    const radius = 44;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
    return (
        <div className="relative w-28 h-28">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(176,87,64,0.12)" strokeWidth="8" />
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#6a8d73"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-[stroke-dashoffset] duration-700"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-bold text-gray-900 dark:text-gray-50 leading-none">
                    {value}%
                </span>
                <span className="text-[0.6rem] uppercase tracking-wide font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                    Accuracy
                </span>
            </div>
        </div>
    );
}
