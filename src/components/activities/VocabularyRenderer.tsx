"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { VocabularyContent, isVocabularyContent } from "@/types/activity";
import FlashcardCarousel from "@/components/ui/FlashcardCarousel";
import MatchingGame from "@/components/ui/MatchingGame";
import FillInBlankGame from "@/components/ui/FillInBlankGame";
import { parseFlashcards, parsePlainVocabulary } from "@/lib/vocab-parser";

interface VocabularyRendererProps {
    content: VocabularyContent;
    activityId: string;
    title?: string;
    assignmentId?: string | null;
}

type VocabType = "word-list" | "flashcards" | "matching" | "fill-blank";

const VOCAB_CONFIG = {
    "word-list": {
        icon: "📄",
        name: "Word List",
        description: "Review all vocabulary words",
        gradient: "from-amber-50 to-orange-50",
        accentColor: "bg-amber-500",
        iconBg: "bg-amber-100",
        borderHover: "hover:border-amber-300",
        ringColor: "focus-visible:ring-amber-400",
    },
    flashcards: {
        icon: "🎴",
        name: "Flash Cards",
        description: "Practice with flashcards",
        gradient: "from-rose-50 to-pink-50",
        accentColor: "bg-rose-500",
        iconBg: "bg-rose-100",
        borderHover: "hover:border-rose-300",
        ringColor: "focus-visible:ring-rose-400",
    },
    matching: {
        icon: "🧩",
        name: "Matching",
        description: "Match words to definitions",
        gradient: "from-emerald-50 to-teal-50",
        accentColor: "bg-emerald-500",
        iconBg: "bg-emerald-100",
        borderHover: "hover:border-emerald-300",
        ringColor: "focus-visible:ring-emerald-400",
    },
    "fill-blank": {
        icon: "✍️",
        name: "Fill in the Blank",
        description: "Complete sentences",
        gradient: "from-violet-50 to-purple-50",
        accentColor: "bg-violet-500",
        iconBg: "bg-violet-100",
        borderHover: "hover:border-violet-300",
        ringColor: "focus-visible:ring-violet-400",
    },
};

export default function VocabularyRenderer({
    content,
    activityId,
    assignmentId,
}: VocabularyRendererProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentUi = searchParams.get("ui") as VocabType | null;

    if (!isVocabularyContent(content)) {
        return <div className="p-4 text-red-500">Invalid vocabulary content</div>;
    }

    // In Activity Mode - show full-screen activity
    if (currentUi) {
        return (
            <ActivityMode
                content={content}
                activityId={activityId}
                vocabType={currentUi}
                assignmentId={assignmentId}
                onBack={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete("ui");
                    router.push(`?${params.toString()}`);
                }}
            />
        );
    }

    // In Selection Mode - show 4 cards
    return (
        <SelectionMode
            activityId={activityId}
            onSelectType={(vocabType) => {
                const params = new URLSearchParams(searchParams);
                params.set("ui", vocabType);
                router.push(`?${params.toString()}`);
            }}
        />
    );
}

interface SelectionModeProps {
    activityId: string;
    onSelectType: (type: VocabType) => void;
}

function SelectionMode({ activityId, onSelectType }: SelectionModeProps) {
    // Get progress data from localStorage (will be populated by API)
    const progressData = useMemo(() => {
        if (typeof window === "undefined") return null;
        const stored = localStorage.getItem(`vocab-progress-${activityId}`);
        return stored ? JSON.parse(stored) : null;
    }, [activityId]);

    const getTypeProgress = (type: VocabType): number => {
        if (!progressData?.categoryData) return 0;
        return progressData.categoryData[type]?.progress ?? 0;
    };

    const isTypeCompleted = (type: VocabType): boolean => {
        if (!progressData?.categoryData) return false;
        return progressData.categoryData[type]?.completed ?? false;
    };

    const types: VocabType[] = ["word-list", "flashcards", "matching", "fill-blank"];
    const completedCount = types.filter(t => isTypeCompleted(t)).length;
    const overallProgress = Math.round((completedCount / types.length) * 100);

    return (
        <div className="w-full max-w-3xl mx-auto px-3 pt-1 pb-4 md:px-8 md:pt-4 md:pb-10">
            {/* Header Section - minimal on mobile */}
            <div className="text-center mb-3 md:mb-8">
                <div className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Vocabulary Practice</span>
                </div>
                <h2 className="font-display text-lg md:text-3xl font-bold text-text tracking-tight">
                    Choose Your Activity
                </h2>
            </div>

            {/* Activity Cards Grid - 2x2 on mobile */}
            <div className="grid grid-cols-2 gap-2.5 md:gap-5">
                {types.map((type, index) => {
                    const config = VOCAB_CONFIG[type];
                    const progress = getTypeProgress(type);
                    const isCompleted = isTypeCompleted(type);

                    return (
                        <button
                            key={type}
                            onClick={() => onSelectType(type)}
                            className={`
                                vocab-activity-card
                                group relative overflow-hidden rounded-xl md:rounded-2xl
                                bg-gradient-to-br ${config.gradient}
                                border border-border/60
                                p-3 md:p-6 text-left
                                transition-all duration-300 ease-out
                                hover:shadow-xl hover:shadow-black/5
                                ${config.borderHover}
                                md:hover:-translate-y-1
                                active:scale-[0.98]
                                focus-visible:outline-none focus-visible:ring-2 ${config.ringColor} focus-visible:ring-offset-2
                            `}
                            style={{
                                animationDelay: `${index * 80}ms`,
                            }}
                        >
                            {/* Decorative corner accent */}
                            <div className={`absolute -top-6 -right-6 md:-top-8 md:-right-8 w-16 md:w-24 h-16 md:h-24 rounded-full ${config.accentColor} opacity-[0.08] transition-transform duration-500 group-hover:scale-150`} />

                            {/* Completion checkmark badge */}
                            {isCompleted && (
                                <div className="absolute top-2 right-2 md:top-4 md:right-4">
                                    <div className="flex items-center justify-center w-5 h-5 md:w-7 md:h-7 rounded-full bg-secondary text-white shadow-md">
                                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl ${config.iconBg} mb-2 md:mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                    <span className="text-xl md:text-3xl">{config.icon}</span>
                                </div>

                                {/* Title & Description */}
                                <h3 className="font-display text-sm md:text-xl font-bold text-text mb-0.5 md:mb-1.5 tracking-tight leading-tight">
                                    {config.name}
                                </h3>
                                <p className="text-xs md:text-sm text-text-muted mb-2 md:mb-5 leading-snug line-clamp-2">
                                    {config.description}
                                </p>

                                {/* Progress Section - simplified on mobile */}
                                <div className="space-y-1 md:space-y-2">
                                    <div className="flex items-center justify-between text-[10px] md:text-xs">
                                        <span className={`font-medium ${isCompleted ? 'text-secondary' : 'text-text-muted'}`}>
                                            {isCompleted ? 'Done' : `${Math.round(progress)}%`}
                                        </span>
                                    </div>
                                    <div className="relative w-full h-1.5 md:h-2 bg-white/60 rounded-full overflow-hidden">
                                        <div
                                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${
                                                isCompleted
                                                    ? "bg-gradient-to-r from-secondary to-secondary-light"
                                                    : `${config.accentColor}`
                                            }`}
                                            style={{ width: `${Math.max(progress, 2)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Start/Continue indicator - desktop only */}
                                <div className="hidden md:flex mt-4 items-center gap-1.5 text-xs font-medium text-text-muted opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                    <span>{isCompleted ? 'Review again' : progress > 0 ? 'Continue' : 'Start'}</span>
                                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Tip Section - compact on mobile */}
            <div className="mt-3 md:mt-10">
                <div className="relative overflow-hidden rounded-lg md:rounded-xl bg-gradient-to-r from-accent-light/30 to-accent/20 border border-accent/30 px-3 py-2 md:p-5">
                    <div className="absolute -bottom-4 -right-4 w-16 md:w-20 h-16 md:h-20 rounded-full bg-accent/20 blur-xl" />
                    <div className="relative flex items-center gap-2 md:gap-3">
                        <div className="hidden md:flex flex-shrink-0 w-8 h-8 rounded-lg bg-accent/30 items-center justify-center">
                            <svg className="w-4 h-4 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0 flex items-center gap-2 md:block">
                            <p className="text-xs md:text-sm text-text font-medium whitespace-nowrap">
                                <span className="text-amber-700 font-semibold">Complete all 4</span>
                                <span className="hidden md:inline"> activities to finish this vocabulary unit.</span>
                            </p>
                            <div className="flex-1 md:mt-2 flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-white/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                                        style={{ width: `${overallProgress}%` }}
                                    />
                                </div>
                                <span className="text-xs font-semibold text-amber-700 tabular-nums">
                                    {completedCount}/4
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ActivityModeProps {
    content: VocabularyContent;
    activityId: string;
    vocabType: VocabType;
    assignmentId?: string | null;
    onBack: () => void;
}

function ActivityMode({
    content,
    activityId,
    vocabType,
    assignmentId,
    onBack,
}: ActivityModeProps) {
    const config = VOCAB_CONFIG[vocabType];

    return (
        <div className="w-full">
            {/* Minimal back bar */}
            <div className="px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 border-b border-border/50">
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Back to activities</span>
                </button>
                <span className="text-border">|</span>
                <span className="text-sm font-medium text-text">{config.icon} {config.name}</span>
            </div>

            {/* Activity content */}
            <RenderActivityContent
                vocabType={vocabType}
                content={content}
                activityId={activityId}
                assignmentId={assignmentId}
            />
        </div>
    );
}

interface RenderActivityContentProps {
    vocabType: VocabType;
    content: VocabularyContent;
    activityId: string;
    assignmentId?: string | null;
}

function RenderActivityContent({
    vocabType,
    content,
    activityId,
    assignmentId,
}: RenderActivityContentProps) {
    switch (vocabType) {
        case "word-list":
            return (
                <WordListRenderer
                    content={content.wordList}
                    activityId={activityId}
                />
            );
        case "flashcards":
            return (
                <FlashcardsRenderer
                    content={content.flashcards}
                    activityId={activityId}
                />
            );
        case "matching": {
            // Extract matching content and stringify it
            const matchingContent = content.matching;
            const matchingStr = typeof matchingContent === 'object' && 'raw' in matchingContent
                ? (matchingContent as any).raw
                : JSON.stringify(matchingContent || {});
            return (
                <MatchingGame
                    contentStr={matchingStr}
                    activityId={activityId}
                    assignmentId={assignmentId ?? null}
                />
            );
        }
        case "fill-blank": {
            // Extract fill-in-blank content and stringify it
            const fillBlankContent = content.fillInBlank;
            const fillBlankStr = typeof fillBlankContent === 'object' && 'raw' in fillBlankContent
                ? (fillBlankContent as any).raw
                : JSON.stringify(fillBlankContent || {});
            return (
                <FillInBlankGame
                    contentStr={fillBlankStr}
                    activityId={activityId}
                />
            );
        }
        default:
            return <div className="p-4 text-red-500">Unknown activity type</div>;
    }
}

interface WordListRendererProps {
    content?: Record<string, unknown>;
    activityId: string;
}

function WordListRenderer({ content, activityId }: WordListRendererProps) {
    // Parse the word list content - it has a 'raw' property with plain text
    const contentStr = typeof content === 'object' && 'raw' in content
        ? (content as any).raw
        : JSON.stringify(content || {});

    const entries = parsePlainVocabulary(contentStr);

    if (!entries || entries.length === 0) {
        return (
            <div className="p-6 text-center text-slate-500">
                No vocabulary words available
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 p-3 md:p-6">
            {entries.map((entry, idx) => (
                <div
                    key={`${entry.term}-${idx}`}
                    className="group relative overflow-hidden rounded-lg md:rounded-xl bg-white border border-border p-3 md:p-6 shadow-sm transition-[box-shadow,border-color,transform] duration-300 hover:shadow-xl hover:border-border-dark md:hover:-translate-y-1"
                >
                    {/* Decorative Background Elements - hidden on mobile */}
                    <div className="hidden md:block absolute -top-12 -right-12 h-32 w-32 rounded-full bg-blue-100/20 transition-transform duration-500 group-hover:scale-150" />
                    <div className="hidden md:flex absolute top-0 right-0 p-6 justify-end">
                        <span className="text-5xl font-black text-gray-100 transition-colors group-hover:text-blue-100 select-none">
                            {String(idx + 1).padStart(2, '0')}
                        </span>
                    </div>

                    <div className="relative z-10">
                        {/* Term & POS */}
                        <div className="flex items-baseline gap-2 md:gap-3 mb-1 md:mb-2 flex-wrap">
                            <h3 className="text-lg md:text-2xl font-bold text-text tracking-tight">
                                {entry.term}
                            </h3>
                            {entry.pos && (
                                <span className="px-2 py-0.5 rounded-full bg-bg-light text-text-muted text-[10px] md:text-xs font-semibold italic border border-border">
                                    {entry.pos}
                                </span>
                            )}
                        </div>

                        {/* Definition */}
                        <div className="mb-2 md:mb-6">
                            <p className="text-sm md:text-base text-text-muted leading-snug md:leading-relaxed">
                                {entry.definition}
                            </p>
                        </div>

                        {/* Example Box - compact on mobile */}
                        {entry.example && (
                            <div className="rounded-md md:rounded-lg bg-accent-light/30 border border-accent/20 p-2 md:p-4">
                                <p className="text-xs md:text-sm text-text-muted italic">
                                    <span className="not-italic font-semibold text-amber-700 mr-1">Ex:</span>
                                    "{entry.example}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

interface FlashcardsRendererProps {
    content?: Record<string, unknown>;
    activityId: string;
}

function FlashcardsRenderer({ content, activityId }: FlashcardsRendererProps) {
    // Parse the flashcards content - it has a 'raw' property with plain text
    const contentStr = typeof content === 'object' && 'raw' in content
        ? (content as any).raw
        : JSON.stringify(content || {});

    const cards = parseFlashcards(contentStr);

    if (!cards || cards.length === 0) {
        return (
            <div className="p-6 text-center text-slate-500">
                No flashcards available
            </div>
        );
    }

    return (
        <FlashcardCarousel
            cards={cards}
            activityId={activityId}
        />
    );
}
