"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Sparkles, Trophy, X } from "lucide-react";
import { fetchActivityProgress, saveActivityProgress } from "@/lib/activityProgress";
import { gradeErrorRepair, gradeFillInBlank } from "@/lib/comparison-battle/grading";
import { CourseMapReturnButton } from "@/components/navigation/CourseMapReturnButton";
import { PointsToast } from "@/components/ui/PointsToast";
import { useMapReturnCountdown } from "@/hooks/useMapReturnCountdown";

const MAX_ATTEMPTS_BEFORE_REVEAL = 2;

const COLORS = {
    blue: "#1a6fcd",
    blueBg: "#deeeff",
    green: "#2e9e4f",
    greenBg: "#d8f5e3",
    red: "#d63030",
    redBg: "#fde8e8",
    yellow: "#c97b00",
    yellowBg: "#fff5cc",
};

const LESSON_STEPS = [
    {
        title: "Comparative",
        color: COLORS.blue,
        bg: COLORS.blueBg,
        icon: "🔵",
        visual: ["🐘", "🐕"],
        rule: "Comparative compares two things.",
        example: "The elephant is bigger than the dog.",
        remember: "Use -er than for short adjectives or more ... than for long adjectives.",
    },
    {
        title: "Superlative",
        color: COLORS.green,
        bg: COLORS.greenBg,
        icon: "🟢",
        visual: ["🐭", "🐕", "🐘"],
        rule: "Superlative compares one thing in a group.",
        example: "The elephant is the biggest.",
        remember: "Use the -est for short adjectives or the most for long adjectives.",
    },
];

const SHORT_ADJECTIVES = [
    { adj: "big", comp: "bigger than", sup: "the biggest", emojis: ["🟡", "🟠", "🔴"] },
    { adj: "small", comp: "smaller than", sup: "the smallest", emojis: ["🏘️", "🏠", "🧸"] },
    { adj: "fast", comp: "faster than", sup: "the fastest", emojis: ["🐢", "🐇", "🚀"] },
];

const LONG_ADJECTIVES = [
    { adj: "expensive", comp: "more expensive than", sup: "the most expensive", emojis: ["📱", "💻", "🏠"] },
    { adj: "difficult", comp: "more difficult than", sup: "the most difficult", emojis: ["📐", "📚", "🧮"] },
    { adj: "beautiful", comp: "more beautiful than", sup: "the most beautiful", emojis: ["🌸", "🌺", "🌹"] },
];

const IRREGULAR_ADJECTIVES = [
    { adj: "good", comp: "better", sup: "best", emojis: ["😐", "😊", "🤩"] },
    { adj: "bad", comp: "worse", sup: "worst", emojis: ["😐", "😟", "😭"] },
    { adj: "far", comp: "farther", sup: "farthest", emojis: ["📍", "📍", "📍"] },
];

const PRACTICE_QUESTIONS = [
    {
        title: "Round 1: Two Things",
        emojis: ["🐘", "🐕"],
        labels: ["elephant", "dog"],
        question: "Which sentence is correct?",
        options: ["The elephant is bigger than the dog.", "The elephant is the biggest."],
        correct: 0,
        why: "We compare two things, so use comparative: bigger than.",
    },
    {
        title: "Round 1: Two Things",
        emojis: ["🏎️", "🚲"],
        labels: ["car", "bike"],
        question: "Look at the car and bike. Which is correct?",
        options: ["The car is the fastest.", "The car is faster than the bike."],
        correct: 1,
        why: "We compare two things, so use comparative: faster than.",
    },
    {
        title: "Round 1: Two Things",
        emojis: ["📱", "💻"],
        labels: ["phone", "laptop"],
        question: "Phones cost $500. Laptops cost $1000. Which is correct?",
        options: ["The laptop is more expensive than the phone.", "The laptop is the most expensive."],
        correct: 0,
        why: "We compare two items. Long adjectives use more ... than.",
    },
    {
        title: "Round 2: Groups",
        emojis: ["🐭", "🐕", "🐘"],
        labels: ["mouse", "dog", "elephant"],
        question: "Look at all three animals. Which sentence is correct?",
        options: ["The elephant is bigger than the dog.", "The elephant is the biggest."],
        correct: 1,
        why: "We compare one animal with the whole group, so use superlative: the biggest.",
    },
    {
        title: "Round 2: Groups",
        emojis: ["🥉", "🥈", "🥇"],
        labels: ["third", "second", "first"],
        question: "Three runners finished a race. Which sentence is correct?",
        options: ["The gold runner is the fastest.", "The gold runner is faster than silver."],
        correct: 0,
        why: "We choose one runner from the whole group, so use the fastest.",
    },
    {
        title: "Round 2: Groups",
        emojis: ["🍕", "🍔", "🌮"],
        labels: ["pizza", "burger", "taco"],
        question: "Three foods. Which sentence is correct?",
        options: ["Pizza is deliciouser than the burger.", "Pizza is the most delicious."],
        correct: 1,
        why: "We compare one food with a group of three, so use the most delicious.",
    },
    {
        title: "Round 3: Tricky Forms",
        emojis: ["📚", "🎮"],
        labels: ["homework", "game"],
        question: "Homework feels difficult. The game feels easy. Which is correct?",
        options: ["Homework is difficulter than the game.", "Homework is more difficult than the game."],
        correct: 1,
        why: "Difficult is a long adjective, so use more difficult than.",
    },
    {
        title: "Round 3: Tricky Forms",
        emojis: ["😊", "🤩", "😐"],
        labels: ["good", "best", "okay"],
        question: "Which irregular sentence is correct?",
        options: ["This is the best answer.", "This is the most good answer."],
        correct: 0,
        why: "Good is irregular: good, better, best.",
    },
    {
        title: "Round 3: Tricky Forms",
        emojis: ["🏙️", "🌆", "🌃"],
        labels: ["city A", "city B", "city C"],
        question: "All three cities. Which sentence compares City A with the whole group?",
        options: ["City A is bigger than City B.", "City A is the biggest of the three cities."],
        correct: 1,
        why: "The question asks about all three cities, so use superlative: the biggest.",
    },
];

const ERROR_QUESTIONS = [
    {
        round: "Round 1: Short adjective repairs",
        emoji: "🐘🐕",
        wrong: "The elephant is more bigger than the dog.",
        error: "more bigger",
        answer: "bigger",
        correct: "The elephant is bigger than the dog.",
        rule: "Do not use more with a short adjective that already has -er.",
    },
    {
        round: "Round 1: Short adjective repairs",
        emoji: "🏔️",
        wrong: "Everest is the most tallest mountain in the world.",
        error: "most tallest",
        answer: "tallest",
        correct: "Everest is the tallest mountain in the world.",
        rule: "Do not use most with a short adjective that already has -est.",
    },
    {
        round: "Round 2: Long adjective repairs",
        emoji: "🌹",
        wrong: "This flower is beautifulest in the garden.",
        error: "beautifulest",
        answer: "the most beautiful",
        correct: "This flower is the most beautiful in the garden.",
        rule: "Long adjectives use the most, not -est.",
    },
    {
        round: "Round 2: Long adjective repairs",
        emoji: "📱💻",
        wrong: "The laptop is expensive than the phone.",
        error: "expensive than",
        answer: "more expensive than",
        correct: "The laptop is more expensive than the phone.",
        rule: "Long adjectives need more before them in comparisons.",
    },
    {
        round: "Round 3: Irregular repairs",
        emoji: "⚽",
        wrong: "Messi plays more better than the others.",
        error: "more better",
        answer: "better",
        correct: "Messi plays better than the others.",
        rule: "Better is already comparative. Do not add more.",
    },
    {
        round: "Round 3: Irregular repairs",
        emoji: "🧪",
        wrong: "This experiment is the baddest result today.",
        error: "baddest",
        answer: "worst",
        correct: "This experiment is the worst result today.",
        rule: "Bad is irregular: bad, worse, worst.",
    },
];

const SPEED_QUESTIONS = [
    {
        round: "Round 1",
        q: "The cheetah is ___ animal.",
        a: "the fastest",
        options: ["faster than", "the fastest", "more fast"],
        why: "We compare the cheetah with all animals.",
    },
    {
        round: "Round 1",
        q: "A car is ___ a bicycle.",
        a: "faster than",
        options: ["faster than", "the fastest", "most fast"],
        why: "We compare two things: car and bicycle.",
    },
    {
        round: "Round 2",
        q: "Gold is ___ silver.",
        a: "more expensive than",
        options: ["the most expensive", "more expensive than", "expensiver than"],
        why: "Expensive is a long adjective, so use more expensive than.",
    },
    {
        round: "Round 2",
        q: "That was ___ test in the class.",
        a: "the most difficult",
        options: ["more difficult than", "the most difficult", "difficulter"],
        why: "We compare one test with the whole class, so use the most difficult.",
    },
    {
        round: "Round 3",
        q: "This pizza is ___ in the city.",
        a: "the best",
        options: ["better than", "the best", "more good"],
        why: "Good is irregular: good, better, best.",
    },
    {
        round: "Round 3",
        q: "The bus stop is ___ the school than the train station.",
        a: "farther from",
        options: ["the farthest", "farther from", "more far from"],
        why: "We compare two distances, so use farther from.",
    },
];

const FILL_BLANK_PROMPTS = [
    {
        round: "Round 1",
        emoji: "👥",
        prompt: "Who is taller? Complete the sentence.",
        templateBefore: "Maria is ",
        templateAfter: " Carlos.",
        validAnswers: ["taller than"],
        type: "comparative" as const,
        example: "Maria is taller than Carlos.",
        rule: "Comparative uses -er than or more ... than.",
    },
    {
        round: "Round 1",
        emoji: "💪",
        prompt: "Compare two animals. Which one is stronger?",
        templateBefore: "A lion is ",
        templateAfter: " a cat.",
        validAnswers: ["stronger than"],
        type: "comparative" as const,
        example: "A lion is stronger than a cat.",
        rule: "Comparative uses -er than or more ... than.",
    },
    {
        round: "Round 2",
        emoji: "🏃",
        prompt: "Who is the fastest in your family or class?",
        templateBefore: "My brother is ",
        templateAfter: " in the family.",
        validAnswers: ["the fastest"],
        type: "superlative" as const,
        example: "My brother is the fastest in the family.",
        rule: "Superlative uses the -est or the most.",
    },
    {
        round: "Round 2",
        emoji: "🏫",
        prompt: "Which subject is the most difficult for you?",
        templateBefore: "Math is ",
        templateAfter: " subject for me.",
        validAnswers: ["the most difficult"],
        type: "superlative" as const,
        example: "Math is the most difficult subject for me.",
        rule: "Superlative uses the -est or the most.",
    },
    {
        round: "Round 3",
        emoji: "🌍",
        prompt: "Compare three cities. Which one is the biggest?",
        templateBefore: "São Paulo is ",
        templateAfter: " city in Brazil.",
        validAnswers: ["the biggest"],
        type: "superlative" as const,
        example: "São Paulo is the biggest city in Brazil.",
        rule: "Superlative uses the -est or the most.",
    },
];

type Screen = "welcome" | "lesson" | "short" | "long" | "irregular" | "gameStart" | "practice" | "errors" | "speed" | "writing" | "checkpoint" | "final";
type FillBlankResult = { correct: boolean; feedback: string; correction?: string; rule?: string };
type Checkpoint = {
    title: string;
    subtitle: string;
    nextScreen: Screen;
    total: number;
    emoji: string;
    startScore: number;
};

const SCORABLE_COUNT =
    PRACTICE_QUESTIONS.length + ERROR_QUESTIONS.length + SPEED_QUESTIONS.length + FILL_BLANK_PROMPTS.length;

const SCREEN_PROGRESS: Partial<Record<Screen, number>> = {
    lesson: 12,
    short: 25,
    long: 38,
    irregular: 50,
    practice: 62,
    errors: 75,
    speed: 88,
    writing: 95,
};

interface Props {
    activityId?: string;
    assignmentId?: string | null;
    variant?: "standalone" | "embedded";
}

function useGameSound() {
    const audioRef = useRef<AudioContext | null>(null);

    return useCallback((type: "correct" | "wrong" | "complete" | "tick") => {
        try {
            const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
            if (!audioRef.current) audioRef.current = new AudioContextCtor();
            const audio = audioRef.current;
            const notes =
                type === "correct" ? [523, 659, 784] : type === "complete" ? [523, 659, 784, 1047] : type === "tick" ? [880] : [300, 240];
            notes.forEach((frequency, index) => {
                const osc = audio.createOscillator();
                const gain = audio.createGain();
                osc.connect(gain);
                gain.connect(audio.destination);
                osc.frequency.value = frequency;
                const start = audio.currentTime + index * 0.12;
                gain.gain.setValueAtTime(type === "tick" ? 0.08 : 0.16, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);
                osc.start(start);
                osc.stop(start + 0.3);
            });
        } catch {
            // Sound is optional.
        }
    }, []);
}

function Card({
    children,
    color = "#ddd",
    bg = "#fff",
    className = "",
}: {
    children: React.ReactNode;
    color?: string;
    bg?: string;
    className?: string;
}) {
    return (
        <div className={`rounded-2xl border-2 p-4 shadow-sm ${className}`} style={{ borderColor: color, backgroundColor: bg }}>
            {children}
        </div>
    );
}

function PrimaryButton({
    children,
    onClick,
    color = COLORS.blue,
    disabled,
    className = "",
}: {
    children: React.ReactNode;
    onClick: () => void;
    color?: string;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base font-black shadow-[0_4px_0_rgba(0,0,0,0.25)] transition active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-55 ${className}`}
            style={{ backgroundColor: color, color: "#ffffff" }}
        >
            {children}
        </button>
    );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex justify-center gap-1.5" aria-label={`Step ${current} of ${total}`}>
            {Array.from({ length: total }, (_, i) => (
                <span
                    key={i}
                    className="h-2 w-8 rounded-full transition"
                    style={{ backgroundColor: i < current ? COLORS.blue : "#d7dee8" }}
                />
            ))}
        </div>
    );
}

function PhaseBadge({ children, color = COLORS.blue, bg = COLORS.blueBg }: { children: React.ReactNode; color?: string; bg?: string }) {
    return (
        <div className="inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest" style={{ backgroundColor: bg, color }}>
            {children}
        </div>
    );
}

function CheckpointScreen({
    checkpoint,
    score,
    onContinue,
}: {
    checkpoint: Checkpoint;
    score: number;
    onContinue: () => void;
}) {
    const roundScore = Math.max(0, score - checkpoint.startScore);
    const roundAccuracy = checkpoint.total > 0 ? Math.round((roundScore / checkpoint.total) * 100) : 0;

    return (
        <section className="space-y-5 py-3 text-center sm:py-6">
            <div className="text-6xl">{checkpoint.emoji}</div>
            <div>
                <h2 className="text-3xl font-black leading-tight text-slate-900">{checkpoint.title}</h2>
                <p className="mt-2 text-base font-bold text-slate-600">{checkpoint.subtitle}</p>
            </div>
            <Card color={COLORS.blue} bg={COLORS.blueBg}>
                <div className="text-sm font-black uppercase tracking-widest" style={{ color: COLORS.blue }}>
                    This Round
                </div>
                <div className="mt-2 text-5xl font-black" style={{ color: COLORS.blue }}>
                    {roundScore}/{checkpoint.total}
                </div>
                <p className="mt-1 font-bold text-slate-600">{roundAccuracy}% correct</p>
            </Card>
            <Card color={COLORS.yellow} bg={COLORS.yellowBg}>
                <div className="text-sm font-black uppercase tracking-widest" style={{ color: COLORS.yellow }}>
                    Total So Far
                </div>
                <div className="mt-1 text-3xl font-black" style={{ color: COLORS.yellow }}>
                    ⭐ {score}
                </div>
            </Card>
            <PrimaryButton onClick={onContinue} className="w-full">
                Continue <ArrowRight size={18} />
            </PrimaryButton>
        </section>
    );
}

function AdjectiveList({
    title,
    intro,
    step,
    totalSteps,
    words,
    onNext,
}: {
    title: string;
    intro: string;
    step: number;
    totalSteps: number;
    words: Array<{ adj: string; comp: string; sup: string; emojis: string[] }>;
    onNext: () => void;
}) {
    const [open, setOpen] = useState(0);
    return (
        <section className="space-y-4">
            <div className="text-center">
                <PhaseBadge>
                    Learning Intro {step}/{totalSteps}
                </PhaseBadge>
                <h2 className="text-2xl font-black text-slate-900">{title}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-600">{intro}</p>
            </div>
            {words.map((word, index) => (
                <button
                    key={word.adj}
                    type="button"
                    onClick={() => setOpen(open === index ? -1 : index)}
                    className="block w-full rounded-2xl border-2 bg-white p-4 text-left transition"
                    style={{ borderColor: open === index ? COLORS.blue : "#d7dee8", backgroundColor: open === index ? COLORS.blueBg : "#fff" }}
                >
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-xl font-black text-slate-900">{word.adj}</span>
                        <span className="text-sm font-bold text-slate-500">{open === index ? "close" : "open"}</span>
                    </div>
                    {open === index ? (
                        <div className="mt-4 space-y-3">
                            <div className="flex items-end justify-center gap-4">
                                {word.emojis.map((emoji, emojiIndex) => (
                                    <span key={`${word.adj}-${emoji}`} className="leading-none" style={{ fontSize: `${30 + emojiIndex * 10}px` }}>
                                        {emoji}
                                    </span>
                                ))}
                            </div>
                            <div className="grid gap-2 sm:grid-cols-3">
                                <div className="rounded-xl bg-white/80 p-3 text-center">
                                    <div className="text-xs font-bold uppercase text-slate-500">adjective</div>
                                    <div className="font-black text-slate-900">{word.adj}</div>
                                </div>
                                <div className="rounded-xl p-3 text-center" style={{ backgroundColor: COLORS.blueBg }}>
                                    <div className="text-xs font-bold uppercase" style={{ color: COLORS.blue }}>
                                        comparative
                                    </div>
                                    <div className="font-black" style={{ color: COLORS.blue }}>
                                        {word.comp}
                                    </div>
                                </div>
                                <div className="rounded-xl p-3 text-center" style={{ backgroundColor: COLORS.greenBg }}>
                                    <div className="text-xs font-bold uppercase" style={{ color: COLORS.green }}>
                                        superlative
                                    </div>
                                    <div className="font-black" style={{ color: COLORS.green }}>
                                        {word.sup}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </button>
            ))}
            <PrimaryButton onClick={onNext} className="w-full">
                Next <ArrowRight size={18} />
            </PrimaryButton>
        </section>
    );
}

export default function ComparisonBattleGame({ activityId = "comparison-battle", assignmentId }: Props) {
    const [screen, setScreen] = useState<Screen>("welcome");
    const [score, setScore] = useState(0);
    const [lessonStep, setLessonStep] = useState(0);
    const [practiceIndex, setPracticeIndex] = useState(0);
    const [practiceChoice, setPracticeChoice] = useState<number | null>(null);
    const [errorIndex, setErrorIndex] = useState(0);
    const [errorInput, setErrorInput] = useState("");
    const [errorSubmitted, setErrorSubmitted] = useState(false);
    const [speedIndex, setSpeedIndex] = useState(0);
    const [speedChoice, setSpeedChoice] = useState<string | null>(null);
    const [speedTime, setSpeedTime] = useState(12);
    const [speedDone, setSpeedDone] = useState(false);
    const [writingIndex, setWritingIndex] = useState(0);
    const [writingInput, setWritingInput] = useState("");
    const [writingResult, setWritingResult] = useState<FillBlankResult | null>(null);
    const [errorAttempts, setErrorAttempts] = useState(0);
    const [writingAttempts, setWritingAttempts] = useState(0);
    const [maxReachedScreenIndex, setMaxReachedScreenIndex] = useState(-1);
    const [roundStartScore, setRoundStartScore] = useState(0);
    const [checkpoint, setCheckpoint] = useState<Checkpoint | null>(null);
    const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
    const [showToast, setShowToast] = useState(false);
    const completedRef = useRef(false);
    const progressSaveRef = useRef<string | null>(null);
    const playSound = useGameSound();
    const mapReturn = useMapReturnCountdown({ active: screen === "final" });

    const screens: Screen[] = useMemo(() => ["lesson", "short", "long", "irregular", "practice", "errors", "speed", "writing"], []);
    const screenIndex = screens.indexOf(screen);
    const accuracy = SCORABLE_COUNT > 0 ? Math.round((score / SCORABLE_COUNT) * 100) : 0;
    const reachedCompletionPoint = screen === "final" || (screen === "checkpoint" && checkpoint?.nextScreen === "final");

    const awardPoint = useCallback(
        (correct: boolean) => {
            playSound(correct ? "correct" : "wrong");
            if (correct) setScore((value) => value + 1);
        },
        [playSound]
    );

    useEffect(() => {
        if (screen !== "speed" || speedChoice || speedDone) return;
        if (speedTime <= 0) {
            setSpeedChoice("__timeout__");
            playSound("wrong");
            return;
        }
        const timer = window.setTimeout(() => {
            setSpeedTime((value) => value - 1);
            if (speedTime <= 4) playSound("tick");
        }, 1000);
        return () => window.clearTimeout(timer);
    }, [screen, speedChoice, speedDone, speedTime, playSound]);

    useEffect(() => {
        if (screen === "welcome" || screen === "final") return;
        const progress = SCREEN_PROGRESS[screen];
        if (progress === undefined) return;

        const saveKey = `${screen}:${progress}`;
        if (progressSaveRef.current === saveKey) return;
        progressSaveRef.current = saveKey;

        void saveActivityProgress(activityId, progress, "in_progress", undefined, undefined, assignmentId);
    }, [activityId, assignmentId, screen]);

    useEffect(() => {
        if (!reachedCompletionPoint || completedRef.current) return;
        completedRef.current = true;
        playSound("complete");
        void (async () => {
            const existing = await fetchActivityProgress(activityId, assignmentId);
            if (existing && (existing.status === "completed" || existing.progress >= 100)) return;
            const result = await saveActivityProgress(
                activityId,
                100,
                "completed",
                accuracy,
                undefined,
                assignmentId
            );
            if (result?.ok) {
                const awarded = result.pointsAwarded ?? 0;
                if (awarded > 0) {
                    setPointsAwarded(awarded);
                    setShowToast(true);
                }
            }
        })();
    }, [accuracy, activityId, assignmentId, playSound, reachedCompletionPoint]);

    const goTo = (next: Screen) => {
        const nextIndex = screens.indexOf(next);
        if (nextIndex >= 0) {
            setMaxReachedScreenIndex((value) => Math.max(value, nextIndex));
        }
        setScreen(next);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const showCheckpoint = (nextCheckpoint: Omit<Checkpoint, "startScore">) => {
        setCheckpoint({ ...nextCheckpoint, startScore: roundStartScore });
        goTo("checkpoint");
    };

    const continueFromCheckpoint = () => {
        if (!checkpoint) return;
        const nextScreen = checkpoint.nextScreen;
        setCheckpoint(null);
        setRoundStartScore(score);
        goTo(nextScreen);
    };

    const restart = () => {
        mapReturn.cancel();
        completedRef.current = false;
        progressSaveRef.current = null;
        setScreen("welcome");
        setScore(0);
        setLessonStep(0);
        setPracticeIndex(0);
        setPracticeChoice(null);
        setErrorIndex(0);
        setErrorInput("");
        setErrorSubmitted(false);
        setSpeedIndex(0);
        setSpeedChoice(null);
        setSpeedTime(12);
        setSpeedDone(false);
        setWritingIndex(0);
        setWritingInput("");
        setWritingResult(null);
        setErrorAttempts(0);
        setWritingAttempts(0);
        setMaxReachedScreenIndex(-1);
        setRoundStartScore(0);
        setCheckpoint(null);
        setPointsAwarded(null);
        setShowToast(false);
    };

    return (
        <div className="game-light-mode min-h-full bg-[#f3f8ff]">
            <main className="mx-auto max-w-2xl px-4 py-4 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:px-5 sm:py-5 sm:pb-24">
                {screen === "welcome" ? (
                    <section className="flex flex-col items-center justify-center py-4 text-center sm:min-h-[calc(100svh-6rem)] sm:py-8">
                        <div className="text-6xl sm:text-7xl">⚔️</div>
                        <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl" style={{ color: COLORS.blue }}>
                            Comparison Battle
                        </h1>
                        <p className="mt-2 text-lg font-black sm:text-xl" style={{ color: COLORS.green }}>
                            Comparative vs. Superlative
                        </p>
                        <div className="mt-4 rounded-2xl border-2 border-yellow-300 bg-yellow-50 px-4 py-3 shadow-sm sm:mt-5 sm:px-6 sm:py-4">
                            <p className="text-xs font-black uppercase tracking-widest text-yellow-600">✨ Game Designers ✨</p>
                            <p className="mt-1 text-base font-black text-slate-800 sm:text-lg">
                                Edwar · Karina · Evelyn · Hazel · Susan
                            </p>
                        </div>
                        <div className="my-6 flex flex-wrap justify-center gap-3 sm:my-8 sm:gap-4">
                            {[
                                ["🐘", "bigger"],
                                ["🐕", "smaller"],
                                ["🐭", "smallest"],
                            ].map(([emoji, label]) => (
                                <div key={label} className="rounded-2xl border-2 bg-white px-4 py-3 shadow-sm sm:px-5 sm:py-4" style={{ borderColor: label === "smaller" ? "#94a3b8" : COLORS.blue }}>
                                    <div className="text-4xl sm:text-5xl">{emoji}</div>
                                    <div className="mt-1.5 text-sm font-black text-slate-600 sm:mt-2">{label}</div>
                                </div>
                            ))}
                        </div>
                        <PrimaryButton onClick={() => goTo("lesson")} className="w-full max-w-sm text-lg sm:text-xl">
                            <Sparkles size={20} /> Start Learning Intro
                        </PrimaryButton>
                    </section>
                ) : null}

                {screen === "lesson" ? (
                    <section className="space-y-4">
                        <div className="text-center">
                            <PhaseBadge>
                                Learning Intro {lessonStep + 1}/5
                            </PhaseBadge>
                            <h2 className="mt-2 text-2xl font-black">Let&apos;s Learn First</h2>
                            <p className="mt-1 text-sm font-semibold text-slate-600">No score yet. The game starts after the intro.</p>
                            <div className="mt-3">
                                <ProgressDots current={lessonStep + 1} total={LESSON_STEPS.length} />
                            </div>
                        </div>
                        {(() => {
                            const lesson = LESSON_STEPS[lessonStep];
                            return (
                                <Card color={lesson.color} bg={lesson.bg}>
                                    <div className="text-2xl font-black" style={{ color: lesson.color }}>
                                        {lesson.icon} {lesson.title}
                                    </div>
                                    <p className="mt-2 text-lg font-bold">{lesson.rule}</p>
                                    <div className="my-5 flex items-end justify-center gap-5">
                                        {lesson.visual.map((emoji, index) => (
                                            <span key={`${lesson.title}-${emoji}`} className="leading-none" style={{ fontSize: `${38 + index * 9}px` }}>
                                                {emoji}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="rounded-xl border-2 bg-white p-3 text-center text-lg font-black" style={{ borderColor: lesson.color }}>
                                        “{lesson.example}”
                                    </div>
                                    <p className="mt-3 rounded-xl p-3 text-sm font-bold" style={{ backgroundColor: COLORS.yellowBg, color: COLORS.yellow }}>
                                        {lesson.remember}
                                    </p>
                                </Card>
                            );
                        })()}
                        <PrimaryButton
                            onClick={() => {
                                if (lessonStep < LESSON_STEPS.length - 1) setLessonStep((value) => value + 1);
                                else {
                                    setRoundStartScore(score);
                                    goTo("short");
                                }
                            }}
                            color={lessonStep === 0 ? COLORS.blue : COLORS.green}
                            className="w-full"
                        >
                            {lessonStep === 0 ? "Next: Superlative" : "Got it"}
                            <ArrowRight size={18} />
                        </PrimaryButton>
                    </section>
                ) : null}

                {screen === "short" ? (
                    <AdjectiveList
                        title="Short Adjectives"
                        intro="Short adjectives get -er and -est."
                        step={3}
                        totalSteps={5}
                        words={SHORT_ADJECTIVES}
                        onNext={() => goTo("long")}
                    />
                ) : null}
                {screen === "long" ? (
                    <AdjectiveList
                        title="Long Adjectives"
                        intro="Long adjectives use more and most."
                        step={4}
                        totalSteps={5}
                        words={LONG_ADJECTIVES}
                        onNext={() => goTo("irregular")}
                    />
                ) : null}

                {screen === "irregular" ? (
                    <section className="space-y-4">
                        <div className="text-center">
                            <PhaseBadge>
                                Learning Intro 5/5
                            </PhaseBadge>
                            <h2 className="mt-2 text-2xl font-black">Irregular Adjectives</h2>
                            <p className="mt-1 text-sm font-semibold text-slate-600">These words are special. Learn them by heart.</p>
                        </div>
                        {IRREGULAR_ADJECTIVES.map((word) => (
                            <Card key={word.adj}>
                                <div className="mb-3 flex items-end justify-center gap-5">
                                    {word.emojis.map((emoji, index) => (
                                        <span key={`${word.adj}-${index}`} style={{ fontSize: `${30 + index * 8}px` }}>
                                            {emoji}
                                        </span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 gap-2 text-center min-[420px]:grid-cols-3">
                                    <div className="rounded-xl bg-slate-100 p-3">
                                        <div className="text-xs font-bold uppercase text-slate-500">adjective</div>
                                        <div className="font-black">{word.adj}</div>
                                    </div>
                                    <div className="rounded-xl p-3" style={{ backgroundColor: COLORS.blueBg, color: COLORS.blue }}>
                                        <div className="text-xs font-bold uppercase">comparative</div>
                                        <div className="font-black">{word.comp}</div>
                                    </div>
                                    <div className="rounded-xl p-3" style={{ backgroundColor: COLORS.greenBg, color: COLORS.green }}>
                                        <div className="text-xs font-bold uppercase">superlative</div>
                                        <div className="font-black">{word.sup}</div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        <PrimaryButton onClick={() => goTo("gameStart")} className="w-full">
                            Finish Intro <ArrowRight size={18} />
                        </PrimaryButton>
                    </section>
                ) : null}

                {screen === "gameStart" ? (
                    <section className="space-y-5 py-3 text-center sm:py-6">
                        <div className="text-7xl">🎯</div>
                        <div>
                            <PhaseBadge color={COLORS.green} bg={COLORS.greenBg}>
                                Intro Complete
                            </PhaseBadge>
                            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900">The Game Starts Now</h2>
                            <p className="mt-2 text-base font-bold text-slate-600">
                                From here, your answers count toward your score. You will stop after short rounds to see how you did.
                            </p>
                        </div>
                        <Card color={COLORS.yellow} bg={COLORS.yellowBg}>
                            <div className="text-sm font-black uppercase tracking-widest" style={{ color: COLORS.yellow }}>
                                First Scored Round
                            </div>
                            <p className="mt-2 text-lg font-black text-slate-800">3 choice questions, then a score stop.</p>
                        </Card>
                        <PrimaryButton
                            onClick={() => {
                                setRoundStartScore(score);
                                goTo("practice");
                            }}
                            color={COLORS.green}
                            className="w-full"
                        >
                            Start Round 1 <ArrowRight size={18} />
                        </PrimaryButton>
                    </section>
                ) : null}

                {screen === "practice" ? (
                    <QuestionScreen
                        question={PRACTICE_QUESTIONS[practiceIndex]}
                        index={practiceIndex}
                        total={PRACTICE_QUESTIONS.length}
                        choice={practiceChoice}
                        onChoose={(choice) => {
                            setPracticeChoice(choice);
                            awardPoint(choice === PRACTICE_QUESTIONS[practiceIndex].correct);
                        }}
                        onNext={() => {
                            if (practiceIndex < PRACTICE_QUESTIONS.length - 1) {
                                setPracticeIndex((value) => value + 1);
                                setPracticeChoice(null);
                                if ((practiceIndex + 1) % 3 === 0) {
                                    showCheckpoint({
                                        title: `Choice Round ${Math.floor(practiceIndex / 3) + 1} Complete`,
                                        subtitle: "Take a breath. Then keep going when you are ready.",
                                        nextScreen: "practice",
                                        total: 3,
                                        emoji: "🎯",
                                    });
                                }
                            } else {
                                showCheckpoint({
                                    title: "Choice Questions Complete",
                                    subtitle: "Next, you will fix comparison mistakes.",
                                    nextScreen: "errors",
                                    total: 3,
                                    emoji: "🎯",
                                });
                            }
                        }}
                    />
                ) : null}

                {screen === "errors" ? (
                    <ErrorFixScreen
                        item={ERROR_QUESTIONS[errorIndex]}
                        index={errorIndex}
                        total={ERROR_QUESTIONS.length}
                        input={errorInput}
                        submitted={errorSubmitted}
                        attempts={errorAttempts}
                        setInput={setErrorInput}
                        onSubmit={() => {
                            if (!errorInput.trim()) return;
                            const item = ERROR_QUESTIONS[errorIndex];
                            const isCorrect = gradeErrorRepair(errorInput, item);
                            const nextAttempts = errorAttempts + 1;
                            setErrorAttempts(nextAttempts);
                            setErrorSubmitted(true);
                            awardPoint(isCorrect);
                        }}
                        onRetry={() => {
                            setErrorInput("");
                            setErrorSubmitted(false);
                        }}
                        onNext={() => {
                            if (errorIndex < ERROR_QUESTIONS.length - 1) {
                                setErrorIndex((value) => value + 1);
                                setErrorInput("");
                                setErrorSubmitted(false);
                                setErrorAttempts(0);
                                if ((errorIndex + 1) % 2 === 0) {
                                    showCheckpoint({
                                        title: `Repair Round ${Math.floor(errorIndex / 2) + 1} Complete`,
                                        subtitle: "Short stop. Check your score, then continue.",
                                        nextScreen: "errors",
                                        total: 2,
                                        emoji: "🔧",
                                    });
                                }
                            } else {
                                showCheckpoint({
                                    title: "Repair Questions Complete",
                                    subtitle: "Next is a short speed round.",
                                    nextScreen: "speed",
                                    total: 2,
                                    emoji: "🔧",
                                });
                            }
                        }}
                    />
                ) : null}

                {screen === "speed" ? (
                    <SpeedScreen
                        question={SPEED_QUESTIONS[speedIndex]}
                        index={speedIndex}
                        total={SPEED_QUESTIONS.length}
                        choice={speedChoice}
                        time={speedTime}
                        done={speedDone}
                        score={SPEED_QUESTIONS.slice(0, speedIndex).filter(Boolean).length}
                        onChoose={(choice) => {
                            setSpeedChoice(choice);
                            awardPoint(choice === SPEED_QUESTIONS[speedIndex].a);
                        }}
                        onNext={() => {
                            if (speedIndex < SPEED_QUESTIONS.length - 1) {
                                setSpeedIndex((value) => value + 1);
                                setSpeedChoice(null);
                                setSpeedTime(12);
                                if ((speedIndex + 1) % 2 === 0) {
                                    showCheckpoint({
                                        title: `Speed Round ${Math.floor(speedIndex / 2) + 1} Complete`,
                                        subtitle: "Pause here before the timer starts again.",
                                        nextScreen: "speed",
                                        total: 2,
                                        emoji: "⚡",
                                    });
                                }
                            } else {
                                setSpeedDone(true);
                            }
                        }}
                        onContinue={() =>
                            showCheckpoint({
                                title: "Speed Questions Complete",
                                subtitle: "Next, complete comparison sentences.",
                                nextScreen: "writing",
                                total: 1,
                                emoji: "⚡",
                            })
                        }
                    />
                ) : null}

                {screen === "writing" ? (
                    <FillBlankScreen
                        prompt={FILL_BLANK_PROMPTS[writingIndex]}
                        index={writingIndex}
                        total={FILL_BLANK_PROMPTS.length}
                        value={writingInput}
                        result={writingResult}
                        attempts={writingAttempts}
                        setValue={setWritingInput}
                        onCheck={() => {
                            const prompt = FILL_BLANK_PROMPTS[writingIndex];
                            const isCorrect = gradeFillInBlank(writingInput, prompt.validAnswers);
                            const nextAttempts = writingAttempts + 1;
                            setWritingAttempts(nextAttempts);
                            setWritingResult({
                                correct: isCorrect,
                                feedback: isCorrect
                                    ? prompt.type === "comparative"
                                        ? "Good comparative phrase. You compared two things."
                                        : "Good superlative phrase. You chose one thing in a group."
                                    : "Check the comparison form for this sentence.",
                                correction: prompt.example,
                                rule: isCorrect ? undefined : prompt.rule,
                            });
                            awardPoint(isCorrect);
                        }}
                        onRetry={() => {
                            setWritingInput("");
                            setWritingResult(null);
                        }}
                        onNext={() => {
                            if (writingIndex < FILL_BLANK_PROMPTS.length - 1) {
                                setWritingIndex((value) => value + 1);
                                setWritingInput("");
                                setWritingResult(null);
                                setWritingAttempts(0);
                                if ((writingIndex + 1) % 2 === 0) {
                                    showCheckpoint({
                                        title: `Fill-in Round ${Math.floor(writingIndex / 2) + 1} Complete`,
                                        subtitle: "Review your round score before the next prompts.",
                                        nextScreen: "writing",
                                        total: 2,
                                        emoji: "✍️",
                                    });
                                }
                            } else {
                                showCheckpoint({
                                    title: "Fill-in Complete",
                                    subtitle: "You finished the last short round. See your final score next.",
                                    nextScreen: "final",
                                    total: 1,
                                    emoji: "✍️",
                                });
                            }
                        }}
                    />
                ) : null}

                {screen === "checkpoint" && checkpoint ? (
                    <CheckpointScreen checkpoint={checkpoint} score={score} onContinue={continueFromCheckpoint} />
                ) : null}

                {screen === "final" ? (
                    <section className="space-y-5 text-center">
                        <div className="text-7xl">🏆</div>
                        <h2 className="text-4xl font-black" style={{ color: COLORS.blue }}>
                            Amazing Job!
                        </h2>
                        <p className="text-lg font-black" style={{ color: COLORS.green }}>
                            You practiced comparatives and superlatives.
                        </p>
                        <Card>
                            <div className="text-5xl font-black" style={{ color: COLORS.blue }}>
                                {score}/{SCORABLE_COUNT}
                            </div>
                            <p className="font-bold text-slate-500">correct answers</p>
                            <p className="mt-2 text-sm font-black" style={{ color: accuracy >= 70 ? COLORS.green : COLORS.yellow }}>
                                {accuracy}% accuracy
                            </p>
                            {pointsAwarded && pointsAwarded > 0 ? (
                                <p className="mt-3 rounded-xl px-3 py-2 text-sm font-bold" style={{ backgroundColor: COLORS.yellowBg, color: COLORS.yellow }}>
                                    +{pointsAwarded} Class Companion points
                                </p>
                            ) : null}
                        </Card>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Card color={COLORS.blue} bg={COLORS.blueBg}>
                                <div className="text-3xl">🔵</div>
                                <div className="font-black" style={{ color: COLORS.blue }}>
                                    Comparative
                                </div>
                                <p className="text-sm font-semibold text-slate-700">two things: -er than, more ... than</p>
                            </Card>
                            <Card color={COLORS.green} bg={COLORS.greenBg}>
                                <div className="text-3xl">🟢</div>
                                <div className="font-black" style={{ color: COLORS.green }}>
                                    Superlative
                                </div>
                                <p className="text-sm font-semibold text-slate-700">a group: the -est, the most</p>
                            </Card>
                        </div>
                        {mapReturn.isActive ? (
                            <p className="text-sm font-semibold text-slate-600">
                                Continuing to {mapReturn.destinationLabel} in {mapReturn.secondsLeft}s…{" "}
                                <button type="button" onClick={mapReturn.goNow} className="font-black underline" style={{ color: COLORS.blue }}>
                                    Go now
                                </button>
                            </p>
                        ) : null}
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            {mapReturn.isActive ? <CourseMapReturnButton className="w-full sm:w-auto" /> : null}
                            <PrimaryButton onClick={restart} className="w-full sm:w-auto">
                                <RotateCcw size={18} /> Play Again
                            </PrimaryButton>
                        </div>
                    </section>
                ) : null}
            </main>

            {screenIndex >= 0 ? (
                <nav
                    className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-slate-200 bg-white px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:left-1/2 sm:max-w-2xl sm:-translate-x-1/2 sm:px-2"
                    aria-label="Game sections"
                >
                    <div className="mx-auto flex max-w-2xl items-center gap-1">
                        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] sm:justify-around sm:overflow-visible [&::-webkit-scrollbar]:hidden">
                            {screens.map((item, index) => {
                                const unlocked = index <= maxReachedScreenIndex;
                                return (
                                <button
                                    key={item}
                                    type="button"
                                    disabled={!unlocked}
                                    onClick={() => {
                                        if (unlocked) goTo(item);
                                    }}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-black transition sm:h-11 sm:min-w-10 sm:px-2 sm:text-lg disabled:cursor-not-allowed disabled:opacity-40"
                                    style={{ backgroundColor: item === screen ? COLORS.blueBg : "transparent", color: item === screen ? COLORS.blue : "#64748b" }}
                                    aria-label={`Go to step ${index + 1}`}
                                    aria-current={item === screen ? "step" : undefined}
                                >
                                    {["📚", "📖", "📖", "⚠️", "🎯", "🔧", "⚡", "🌍"][index]}
                                </button>
                                );
                            })}
                        </div>
                        {score > 0 ? (
                            <div
                                className="shrink-0 rounded-full px-2 py-1 text-[11px] font-black sm:px-2.5 sm:text-xs"
                                style={{ backgroundColor: COLORS.yellowBg, color: COLORS.yellow }}
                                aria-label={`${score} correct answers so far`}
                            >
                                ⭐ {score}
                            </div>
                        ) : null}
                    </div>
                </nav>
            ) : null}

            {showToast && pointsAwarded ? <PointsToast points={pointsAwarded} onComplete={() => setShowToast(false)} message="Comparison Battle complete" /> : null}
        </div>
    );
}

function QuestionScreen({
    question,
    index,
    total,
    choice,
    onChoose,
    onNext,
}: {
    question: (typeof PRACTICE_QUESTIONS)[number];
    index: number;
    total: number;
    choice: number | null;
    onChoose: (choice: number) => void;
    onNext: () => void;
}) {
    return (
        <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-black sm:text-xl">{question.title}</h2>
                <div className="self-start rounded-full px-3 py-1 text-sm font-black sm:self-auto" style={{ backgroundColor: COLORS.blueBg, color: COLORS.blue }}>
                    {index + 1}/{total}
                </div>
            </div>
            <ProgressDots current={index + 1} total={total} />
            <Card>
                <div className="mb-4 flex items-end justify-center gap-5">
                    {question.emojis.map((emoji, emojiIndex) => (
                        <div key={`${question.question}-${emoji}`} className="text-center">
                            <div className="leading-none" style={{ fontSize: `${42 + emojiIndex * 7}px` }}>
                                {emoji}
                            </div>
                            <div className="mt-1 text-xs font-bold text-slate-500">{question.labels[emojiIndex]}</div>
                        </div>
                    ))}
                </div>
                <p className="text-base font-black sm:text-lg">{question.question}</p>
            </Card>
            <div className="space-y-3">
                {question.options.map((option, optionIndex) => {
                    const selected = choice === optionIndex;
                    const correct = choice !== null && optionIndex === question.correct;
                    const wrong = choice !== null && selected && !correct;
                    return (
                        <button
                            key={option}
                            type="button"
                            disabled={choice !== null}
                            onClick={() => onChoose(optionIndex)}
                            className="flex w-full items-center justify-between gap-3 rounded-2xl border-2 bg-white p-3.5 text-left text-sm font-bold leading-snug transition sm:p-4 sm:text-base"
                            style={{
                                borderColor: correct ? COLORS.green : wrong ? COLORS.red : "#cbd5e1",
                                backgroundColor: correct ? COLORS.greenBg : wrong ? COLORS.redBg : "#fff",
                                color: correct ? COLORS.green : wrong ? COLORS.red : "#1e293b",
                            }}
                        >
                            <span>
                                <strong>{String.fromCharCode(65 + optionIndex)})</strong> {option}
                            </span>
                            {correct ? <Check size={20} /> : wrong ? <X size={20} /> : null}
                        </button>
                    );
                })}
            </div>
            {choice !== null ? (
                <>
                    <Card color={choice === question.correct ? COLORS.green : COLORS.red} bg={choice === question.correct ? COLORS.greenBg : COLORS.redBg}>
                        <div className="font-black" style={{ color: choice === question.correct ? COLORS.green : COLORS.red }}>
                            {choice === question.correct ? "Great job!" : "Not quite."}
                        </div>
                        <p className="mt-1 text-sm font-semibold text-slate-700">{question.why}</p>
                    </Card>
                    <PrimaryButton onClick={onNext} className="w-full">
                        {index < total - 1 ? "Next Question" : "Continue"} <ArrowRight size={18} />
                    </PrimaryButton>
                </>
            ) : null}
        </section>
    );
}

function ErrorFixScreen({
    item,
    index,
    total,
    input,
    submitted,
    attempts,
    setInput,
    onSubmit,
    onRetry,
    onNext,
}: {
    item: (typeof ERROR_QUESTIONS)[number];
    index: number;
    total: number;
    input: string;
    submitted: boolean;
    attempts: number;
    setInput: (value: string) => void;
    onSubmit: () => void;
    onRetry: () => void;
    onNext: () => void;
}) {
    const correct = submitted && gradeErrorRepair(input, item);
    const canAdvance = correct || attempts >= MAX_ATTEMPTS_BEFORE_REVEAL;
    const revealed = submitted && !correct && attempts >= MAX_ATTEMPTS_BEFORE_REVEAL;
    const parts = item.wrong.split(item.error);
    return (
        <section className="space-y-4">
            <div className="text-center">
                <h2 className="text-2xl font-black">Fix the Mistake</h2>
                <p className="text-sm font-black" style={{ color: COLORS.blue }}>
                    {item.round}
                </p>
                <p className="text-sm font-semibold text-slate-600">Type the correct word or words.</p>
            </div>
            <ProgressDots current={index + 1} total={total} />
            <div className="text-center text-5xl">{item.emoji}</div>
            <Card color={COLORS.red} bg={COLORS.redBg}>
                <p className="text-center text-lg font-black leading-relaxed">
                    {parts[0]}
                    <span className="rounded-md px-2 py-1 text-white" style={{ backgroundColor: COLORS.red }}>
                        {item.error}
                    </span>
                    {parts[1]}
                </p>
            </Card>
            <input
                value={input}
                disabled={submitted && canAdvance}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" && !(submitted && canAdvance)) onSubmit();
                }}
                className="min-h-12 w-full rounded-2xl border-2 bg-white px-4 py-3 text-lg font-bold outline-none"
                style={{ borderColor: submitted ? (correct ? COLORS.green : COLORS.red) : COLORS.blue }}
                placeholder={`Replace "${item.error}"`}
            />
            {!submitted ? (
                <PrimaryButton onClick={onSubmit} className="w-full" disabled={!input.trim()}>
                    <Check size={18} /> Check My Answer
                </PrimaryButton>
            ) : (
                <>
                    <Card color={correct ? COLORS.green : COLORS.red} bg={correct ? COLORS.greenBg : COLORS.redBg}>
                        <div className="font-black" style={{ color: correct ? COLORS.green : COLORS.red }}>
                            {correct ? "Perfect." : revealed ? "Here is the correct answer." : "Not quite."}
                        </div>
                        {!correct ? (
                            <p className="mt-1 font-bold">
                                Correct answer: <span style={{ color: COLORS.green }}>{item.answer}</span>
                            </p>
                        ) : null}
                        <p className="mt-2 rounded-xl bg-white p-3 font-bold" style={{ color: COLORS.green }}>
                            {item.correct}
                        </p>
                    </Card>
                    <Card color={COLORS.yellow} bg={COLORS.yellowBg}>
                        <p className="text-sm font-bold" style={{ color: COLORS.yellow }}>
                            {item.rule}
                        </p>
                    </Card>
                    <div className="flex gap-2">
                        {!correct && !revealed ? (
                            <PrimaryButton onClick={onRetry} color="#64748b" className="flex-1">
                                Try Again
                            </PrimaryButton>
                        ) : null}
                        {canAdvance ? (
                            <PrimaryButton onClick={onNext} className={correct || revealed ? "w-full" : "flex-[2]"}>
                                {index < total - 1 ? "Next Error" : "Continue"} <ArrowRight size={18} />
                            </PrimaryButton>
                        ) : null}
                    </div>
                </>
            )}
        </section>
    );
}

function SpeedScreen({
    question,
    index,
    total,
    choice,
    time,
    done,
    onChoose,
    onNext,
    onContinue,
}: {
    question: (typeof SPEED_QUESTIONS)[number];
    index: number;
    total: number;
    choice: string | null;
    time: number;
    done: boolean;
    score: number;
    onChoose: (choice: string) => void;
    onNext: () => void;
    onContinue: () => void;
}) {
    if (done) {
        return (
            <section className="space-y-5 text-center">
                <div className="text-7xl">⚡</div>
                <h2 className="text-3xl font-black" style={{ color: COLORS.blue }}>
                    Speed Round Complete
                </h2>
                <PrimaryButton onClick={onContinue} className="w-full">
                    Continue <ArrowRight size={18} />
                </PrimaryButton>
            </section>
        );
    }

    const answered = choice !== null;
    const timedOut = choice === "__timeout__";
    const barColor = time > 6 ? COLORS.green : time > 3 ? COLORS.yellow : COLORS.red;

    return (
        <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-black sm:text-xl">Speed Round</h2>
                    <p className="text-sm font-black sm:text-base" style={{ color: COLORS.blue }}>
                        {question.round}
                    </p>
                </div>
                <div className="self-start rounded-full px-3 py-1 text-sm font-black sm:self-auto" style={{ backgroundColor: COLORS.blueBg, color: COLORS.blue }}>
                    {index + 1}/{total}
                </div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full transition-all duration-1000" style={{ width: `${Math.max(0, (time / 12) * 100)}%`, backgroundColor: barColor }} />
            </div>
            <div className="text-center text-4xl font-black" style={{ color: barColor }}>
                {timedOut ? "Time!" : `${time}s`}
            </div>
            <Card>
                <p className="text-lg font-black leading-relaxed sm:text-xl">{question.q}</p>
            </Card>
            <div className="space-y-3">
                {question.options.map((option) => {
                    const correct = answered && option === question.a;
                    const wrong = answered && option === choice && option !== question.a;
                    return (
                        <button
                            key={option}
                            type="button"
                            disabled={answered}
                            onClick={() => onChoose(option)}
                            className="flex w-full items-center justify-between gap-3 rounded-2xl border-2 bg-white p-3.5 text-left text-sm font-bold leading-snug sm:p-4 sm:text-lg"
                            style={{
                                borderColor: correct ? COLORS.green : wrong ? COLORS.red : "#cbd5e1",
                                backgroundColor: correct ? COLORS.greenBg : wrong ? COLORS.redBg : "#fff",
                                color: correct ? COLORS.green : wrong ? COLORS.red : "#1e293b",
                            }}
                        >
                            {option}
                            {correct ? <Check size={20} /> : wrong ? <X size={20} /> : null}
                        </button>
                    );
                })}
            </div>
            {answered ? (
                <>
                    <Card color={choice === question.a ? COLORS.green : COLORS.red} bg={choice === question.a ? COLORS.greenBg : COLORS.redBg}>
                        <div className="font-black" style={{ color: choice === question.a ? COLORS.green : COLORS.red }}>
                            {choice === question.a ? "Correct!" : timedOut ? "Time is up." : "Not quite."}
                        </div>
                        <p className="mt-1 text-sm font-semibold text-slate-700">{question.why}</p>
                    </Card>
                    <PrimaryButton onClick={onNext} className="w-full">
                        {index < total - 1 ? "Next Question" : "See Results"} <ArrowRight size={18} />
                    </PrimaryButton>
                </>
            ) : null}
        </section>
    );
}

function FillBlankScreen({
    prompt,
    index,
    total,
    value,
    result,
    attempts,
    setValue,
    onCheck,
    onRetry,
    onNext,
}: {
    prompt: (typeof FILL_BLANK_PROMPTS)[number];
    index: number;
    total: number;
    value: string;
    result: FillBlankResult | null;
    attempts: number;
    setValue: (value: string) => void;
    onCheck: () => void;
    onRetry: () => void;
    onNext: () => void;
}) {
    const canAdvance = result?.correct || attempts >= MAX_ATTEMPTS_BEFORE_REVEAL;
    const revealed = result && !result.correct && attempts >= MAX_ATTEMPTS_BEFORE_REVEAL;

    return (
        <section className="space-y-4">
            <div className="text-center">
                <h2 className="text-2xl font-black">Complete the Sentence</h2>
                <p className="text-sm font-black" style={{ color: COLORS.blue }}>
                    {prompt.round}
                </p>
                <p className="text-sm font-semibold text-slate-600">Fill in the missing comparison phrase.</p>
            </div>
            <ProgressDots current={index + 1} total={total} />
            <Card color={COLORS.blue}>
                <div className="text-center text-5xl">{prompt.emoji}</div>
                <p className="mt-3 text-center text-lg font-black">{prompt.prompt}</p>
            </Card>
            <Card>
                <div className="flex flex-wrap items-center justify-center gap-1 text-lg font-black leading-relaxed text-slate-900 sm:text-xl">
                    <span>{prompt.templateBefore}</span>
                    <input
                        value={value}
                        disabled={!!result && canAdvance}
                        onChange={(event) => setValue(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && !result) onCheck();
                        }}
                        className="min-w-[8rem] flex-1 rounded-xl border-2 bg-white px-3 py-2 text-center text-lg font-black outline-none sm:min-w-[10rem] sm:text-xl"
                        style={{
                            borderColor: result ? (result.correct ? COLORS.green : COLORS.red) : COLORS.blue,
                            maxWidth: "14rem",
                        }}
                        placeholder="..."
                        aria-label="Missing comparison phrase"
                    />
                    <span>{prompt.templateAfter}</span>
                </div>
            </Card>
            {!result ? (
                <PrimaryButton onClick={onCheck} color={COLORS.green} disabled={!value.trim()} className="w-full">
                    <Check size={18} /> Check My Answer
                </PrimaryButton>
            ) : (
                <>
                    <Card color={result.correct ? COLORS.green : COLORS.red} bg={result.correct ? COLORS.greenBg : COLORS.redBg}>
                        <div className="font-black" style={{ color: result.correct ? COLORS.green : COLORS.red }}>
                            {result.correct ? "Correct!" : revealed ? "Here is the correct answer." : "Not quite."}
                        </div>
                        <p className="mt-1 font-semibold text-slate-700">{result.feedback}</p>
                        {result.correction ? <p className="mt-3 rounded-xl bg-white p-3 font-bold text-slate-800">{result.correction}</p> : null}
                    </Card>
                    {result.rule ? (
                        <Card color={COLORS.yellow} bg={COLORS.yellowBg}>
                            <p className="text-sm font-bold" style={{ color: COLORS.yellow }}>
                                {result.rule}
                            </p>
                        </Card>
                    ) : null}
                    <div className="flex gap-2">
                        {!result.correct && !revealed ? (
                            <PrimaryButton onClick={onRetry} color="#64748b" className="flex-1">
                                <ArrowLeft size={18} /> Retry
                            </PrimaryButton>
                        ) : null}
                        {canAdvance ? (
                            <PrimaryButton onClick={onNext} className={result.correct || revealed ? "w-full" : "flex-[2]"}>
                                {index < total - 1 ? "Next" : "Final Results"} <Trophy size={18} />
                            </PrimaryButton>
                        ) : null}
                    </div>
                </>
            )}
        </section>
    );
}

declare global {
    interface Window {
        webkitAudioContext?: typeof AudioContext;
    }
}
