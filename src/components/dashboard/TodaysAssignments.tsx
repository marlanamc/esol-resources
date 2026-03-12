'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { stripVocabTypeSuffix, getVocabActivityType, VOCAB_CHIP_CONFIG } from '@/lib/vocab-display';
import { parseCategoryData } from '@/lib/categoryData';
import { getGameEmojiForActivity } from '@/lib/game-emoji';
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    ClipboardList,
    Gamepad2,
    PenLine,
    Sparkles,
    Volume2,
} from 'lucide-react';
import { ActivityLink } from '@/components/navigation/ActivityLink';
import { StudentQuickStats } from '@/components/dashboard/StudentQuickStats';
import type { DailyChecklistHabit } from '@/lib/daily-habits';
import { getLearnerCategoryTone } from '@/lib/learner-theme';

const FEATURED_NEW_BADGE_CLASS_NAME = 'inline-flex items-center gap-1 rounded-full border';
const TITLE_DATE_REGEX = /(\d{1,2})\/(\d{1,2})\/(\d{2})/;

type ChecklistGroupKey = 'grammar' | 'vocabulary' | 'quizzes' | 'activity';

interface VocabCategoryData {
    'word-list'?: { completed: boolean; progress: number; completedAt?: string };
    'flashcards'?: { completed: boolean; progress: number; completedAt?: string };
    'matching'?: { completed: boolean; progress: number; completedAt?: string };
    'fill-blank'?: { completed: boolean; progress: number; completedAt?: string };
}

interface FeaturedAssignment {
    id: string;
    title?: string | null;
    activityId: string;
    href?: string;
    sectionCount?: number;
    dueDate?: string | Date | null;
    featuredAt?: string | Date | null;
    updatedAt?: string | Date | null;
    createdAt?: string | Date | null;
    isNewRelease?: boolean;
    progress?: number;
    progressStatus?: string;
    categoryData?: VocabCategoryData | string | null;
    activity: {
        title: string;
        description: string | null;
        type?: string;
        category?: string | null;
    };
    submissions: Array<{
        id: string;
        status: string;
        completedAt: string | Date | null;
        score: number | null;
    }>;
}

interface Props {
    initialAssignments?: FeaturedAssignment[];
    pinnedHabit?: DailyChecklistHabit | null;
    title?: string;
    ctaLabel?: string;
    variant?: 'cards' | 'checklist';
    actions?: React.ReactNode;
    mobileTasksLinkHref?: string;
    mobileTasksLinkLabel?: string;
    refreshOnMount?: boolean;
    /** Show streak and points badges in checklist header (student dashboard) */
    showStudentStats?: boolean;
}

interface CategoryStyle {
    label: string;
    bg: string;
    pastelBg: string;
    text: string;
    accent: string;
    border: string;
}

interface VocabProgressInfo {
    completed: number;
    total: number;
    types: Array<keyof VocabCategoryData>;
    categoryData: VocabCategoryData;
}

interface DueMeta {
    label: string;
    tone: 'overdue' | 'today' | 'tomorrow' | 'upcoming';
}

interface NormalizedChecklistRow {
    assignment: FeaturedAssignment;
    submission: FeaturedAssignment['submissions'][number] | undefined;
    index: number;
    groupKey: ChecklistGroupKey;
    isCompleted: boolean;
    isNew: boolean;
    isGameRow: boolean;
    displayTitle: string;
    categoryStyle: CategoryStyle;
    dueMeta: DueMeta | null;
    progressValue: number;
    vocabProgress: VocabProgressInfo | null;
    actionLabel: 'Play' | 'Review' | 'Start';
    isResumable: boolean;
    isVocabPartial: boolean;
    progressSummary: string | null;
}

const CHECKLIST_GROUPS: Array<{
    key: ChecklistGroupKey;
    label: string;
    renderIcon: (className?: string) => React.ReactNode;
}> = [
    { key: 'grammar', label: 'Grammar', renderIcon: (className = 'w-5 h-5') => <PenLine className={className} /> },
    { key: 'vocabulary', label: 'Vocabulary', renderIcon: (className = 'w-5 h-5') => <BookOpen className={className} /> },
    { key: 'quizzes', label: 'Quizzes', renderIcon: (className = 'w-5 h-5') => <ClipboardList className={className} /> },
    { key: 'activity', label: 'Games', renderIcon: (className = 'w-5 h-5') => <Gamepad2 className={className} /> },
];

function formatWeekRangeLabel(referenceDate: Date): string {
    const weekStart = new Date(referenceDate);
    const day = weekStart.getDay();
    // Week runs Tuesday–Monday (not Monday–Sunday)
    const offsetToTuesday = day <= 1 ? -5 - day : 2 - day;
    weekStart.setDate(weekStart.getDate() + offsetToTuesday);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' });
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();

    if (weekStart.getFullYear() !== weekEnd.getFullYear()) {
        return `Week of ${startMonth} ${startDay}, ${weekStart.getFullYear()}-${endMonth} ${endDay}, ${weekEnd.getFullYear()}`;
    }

    if (startMonth === endMonth) {
        return `Week of ${startMonth} ${startDay}-${endDay}`;
    }

    return `Week of ${startMonth} ${startDay}-${endMonth} ${endDay}`;
}

function formatDueDate(dueDate?: string | Date | null) {
    if (!dueDate) return null;
    const date = dueDate instanceof Date ? dueDate : new Date(dueDate);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function getFriendlyDueMeta(dueDate?: string | Date | null): DueMeta | null {
    if (!dueDate) return null;

    const date = dueDate instanceof Date ? new Date(dueDate) : new Date(dueDate);
    if (Number.isNaN(date.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffDays = Math.round((date.getTime() - today.getTime()) / 86_400_000);
    const formatted = formatDueDate(date);
    if (!formatted) return null;

    if (diffDays < 0) return { label: formatted, tone: 'overdue' };
    if (diffDays === 0) return { label: 'Due today', tone: 'today' };
    if (diffDays === 1) return { label: 'Due tomorrow', tone: 'tomorrow' };

    return { label: formatted, tone: 'upcoming' };
}

function isNewlyFeatured(assignment: FeaturedAssignment) {
    return assignment.isNewRelease === true;
}

function getVocabProgress(assignment: FeaturedAssignment): VocabProgressInfo | null {
    const categoryKey = (assignment.activity.category || '').toLowerCase();
    const isVocabAssignment =
        assignment.activityId.startsWith('vocab-') || categoryKey === 'vocab' || categoryKey === 'vocabulary';

    if (!isVocabAssignment) {
        return null;
    }

    const parsedCategoryData = parseCategoryData<VocabCategoryData>(assignment.categoryData) ?? {};
    const types: Array<keyof VocabCategoryData> = ['word-list', 'flashcards', 'matching', 'fill-blank'];
    const completed = types.filter((type) => parsedCategoryData[type]?.completed).length;

    return {
        completed,
        total: types.length,
        types,
        categoryData: parsedCategoryData,
    };
}

function getCategoryStyle(category?: string | null): CategoryStyle {
    const tone = getLearnerCategoryTone(category);
    return {
        label: tone.label.toUpperCase(),
        bg: tone.chipBg,
        pastelBg: tone.surfaceMuted,
        text: tone.chipText,
        accent: tone.accent,
        border: tone.border,
    };
}

function isGameCategory(category?: string | null) {
    const key = (category || '').toLowerCase();
    return !['quiz', 'quizzes', 'grammar', 'vocab', 'vocabulary'].includes(key);
}

function resolveChecklistGroupKey(category?: string | null): ChecklistGroupKey {
    const key = (category || '').toLowerCase();
    if (key === 'grammar') return 'grammar';
    if (key === 'vocab' || key === 'vocabulary') return 'vocabulary';
    if (key === 'quiz' || key === 'quizzes') return 'quizzes';
    return 'activity';
}

function getCategoryPriority(groupKey: ChecklistGroupKey): number {
    if (groupKey === 'quizzes') return 0;
    if (groupKey === 'activity') return 1;
    if (groupKey === 'grammar') return 2;
    return 3;
}

function getDateFromTitle(title: string) {
    const match = title.match(TITLE_DATE_REGEX);
    if (!match) return null;

    const [, month, day, year] = match;
    const parsed = new Date(Number(`20${year}`), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
}

function getRowActionLabel(isGameRow: boolean, isCompleted: boolean): 'Play' | 'Review' | 'Start' {
    if (isGameRow) return 'Play';
    return isCompleted ? 'Review' : 'Start';
}

function getProgressSummary(vocabProgress: VocabProgressInfo | null, progressValue: number, isCompleted: boolean) {
    if (vocabProgress && vocabProgress.completed > 0 && vocabProgress.completed < vocabProgress.total) {
        return `${vocabProgress.completed}/${vocabProgress.total} complete`;
    }

    if (!isCompleted && progressValue > 0) {
        return `${Math.round(progressValue)}% complete`;
    }

    return null;
}

function getRowGlyph(row: NormalizedChecklistRow, className = 'w-5 h-5') {
    if (row.isCompleted) {
        return <CheckCircle2 className={className} />;
    }

    const categoryKey = (row.assignment.activity.category || '').toLowerCase();
    if (categoryKey === 'pronunciation') {
        return <Volume2 className={className} />;
    }
    if (row.groupKey === 'quizzes') {
        return <ClipboardList className={className} />;
    }
    if (row.groupKey === 'vocabulary' || row.groupKey === 'grammar') {
        return <BookOpen className={className} />;
    }
    return <Gamepad2 className={className} />;
}

function DueBadge({ dueMeta }: { dueMeta: DueMeta }) {
    let style: React.CSSProperties;

    if (dueMeta.tone === 'overdue') {
        style = {
            backgroundColor: 'rgba(240, 160, 128, 0.14)',
            borderColor: 'rgba(240, 160, 128, 0.28)',
            color: 'var(--tone-quizzes-chip-text)',
        };
    } else if (dueMeta.tone === 'upcoming') {
        style = {
            backgroundColor: 'rgba(127, 179, 213, 0.14)',
            borderColor: 'rgba(127, 179, 213, 0.24)',
            color: 'var(--tone-vocabulary-chip-text)',
        };
    } else {
        style = {
            backgroundColor: 'rgba(245, 217, 138, 0.14)',
            borderColor: 'rgba(245, 217, 138, 0.22)',
            color: 'var(--tone-speaking-chip-text)',
        };
    }

    return (
        <span
            className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap"
            style={style}
        >
            {dueMeta.label}
        </span>
    );
}

function CompactVocabTracker({ vocabProgress }: { vocabProgress: VocabProgressInfo }) {
    return (
        <div className="inline-flex items-center gap-1.5 rounded-[14px] border px-3 py-1 text-[11px] font-bold shadow-sm" style={{ backgroundColor: 'var(--tone-speaking-chip-bg)', color: 'var(--tone-speaking-chip-text)', borderColor: 'var(--tone-speaking-border)' }}>
            <span className="tracking-tight">{vocabProgress.completed} / {vocabProgress.total}</span>
            <div className="flex items-center gap-1">
                {vocabProgress.types.map((type) => {
                    const isComplete = vocabProgress.categoryData[type]?.completed;
                    return (
                        <div
                            key={type}
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: isComplete ? 'var(--tone-speaking-accent)' : 'var(--tone-speaking-border)' }}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function PinnedDailyHabitRow({
    habit,
    compact = false,
    embedded = false,
}: {
    habit: DailyChecklistHabit;
    compact?: boolean;
    embedded?: boolean;
}) {
    const tone = getLearnerCategoryTone("vocabulary");
    const isDoneToday = habit.status === "done-today";
    const hasActionableCards = habit.dueCount > 0 || habit.newCount > 0;
    const visibleNewCount = Math.min(habit.newCount, 6);
    const useCompactCompletedStyle = compact && isDoneToday && !embedded;
    const useCondensedDoneLayout = compact || isDoneToday;
    const ctaLabel = isDoneToday
        ? "Review"
        : !hasActionableCards
            ? "View review"
            : "Start";

    if (embedded) {
        return (
            <Link
                href={habit.href}
                className={`checklist-row-premium relative block border-b px-4 py-3 transition-colors hover:bg-black/[0.015] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset ${isDoneToday ? "opacity-80" : ""}`}
                style={{ borderColor: 'var(--dashboard-divider)' }}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 flex items-center justify-center w-5 h-5">
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isDoneToday
                                    ? 'bg-secondary/15 border-secondary/45 text-secondary'
                                    : 'text-transparent shadow-sm'
                            }`}
                            style={isDoneToday ? undefined : { backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-strong)' }}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                            Daily Habit
                        </div>
                        <div className="mt-1 text-[13px] sm:text-sm font-semibold leading-tight text-text">
                            {habit.title}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            {isDoneToday ? (
                                <span
                                    className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
                                    style={{ backgroundColor: tone.chipBg, color: tone.chipText }}
                                >
                                    Done today
                                </span>
                            ) : null}
                            {!isDoneToday && habit.newCount > 0 ? (
                                <span className="inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold" style={{ borderColor: tone.border, color: tone.chipText }}>
                                    {visibleNewCount} new
                                </span>
                            ) : null}
                            {!isDoneToday && habit.dueCount > 0 ? (
                                <span className="inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold" style={{ borderColor: tone.border, color: tone.chipText }}>
                                    {habit.dueCount} due
                                </span>
                            ) : null}
                        </div>
                    </div>

                    <div className="shrink-0 pl-1">
                        <span
                            className="dashboard-accent-button inline-flex items-center justify-center !min-h-0 min-w-[82px] h-9 rounded-full px-3 text-[13px] font-semibold tracking-tight whitespace-nowrap sm:min-w-[92px] sm:h-10 sm:px-4 sm:text-sm"
                            style={{
                                '--dashboard-button-accent': tone.accent,
                                '--dashboard-button-text': tone.chipText,
                            } as React.CSSProperties}
                        >
                            <span>{ctaLabel}</span>
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    if (useCompactCompletedStyle) {
        return (
            <Link
                href={habit.href}
                className="group block rounded-xl border px-3.5 py-2.5 opacity-75 transition-transform duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                style={{
                    borderColor: `color-mix(in srgb, ${tone.border} 38%, var(--border-subtle))`,
                    background: 'var(--surface-subtle)',
                    boxShadow: 'none',
                }}
            >
                <div className="relative flex items-center gap-2.5">
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{
                            backgroundColor: `color-mix(in srgb, ${tone.accent} 18%, transparent)`,
                            color: tone.accent,
                        }}
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="text-[14px] font-semibold leading-snug text-text">
                            {habit.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span
                                className="inline-flex rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                                style={{
                                    backgroundColor: tone.chipBg,
                                    color: tone.chipText,
                                }}
                            >
                                Vocabulary
                            </span>
                            <span className="text-[10px] font-medium text-text-muted">
                                Completed today
                            </span>
                        </div>
                    </div>

                    <span
                        className="dashboard-accent-button inline-flex min-h-[32px] shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1 text-[13px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{
                            '--dashboard-button-accent': tone.accent,
                            '--dashboard-button-text': tone.chipText,
                        } as React.CSSProperties}
                    >
                        <span>{ctaLabel}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={habit.href}
            className="group block rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(31,24,18,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            style={{
                borderColor: isDoneToday ? `color-mix(in srgb, ${tone.border} 72%, var(--border-subtle))` : tone.border,
                background: isDoneToday
                    ? `linear-gradient(135deg, color-mix(in srgb, ${tone.surface} 72%, var(--surface-elevated)) 0%, color-mix(in srgb, ${tone.surfaceMuted} 34%, var(--surface-subtle)) 100%)`
                    : `linear-gradient(135deg, color-mix(in srgb, ${tone.surfaceMuted} 74%, var(--surface-elevated)) 0%, color-mix(in srgb, ${tone.surface} 46%, var(--surface-overlay)) 100%)`,
                boxShadow: isDoneToday
                    ? `inset 0 1px 0 color-mix(in srgb, white 10%, transparent), 0 1px 2px color-mix(in srgb, ${tone.accent} 8%, transparent)`
                    : `inset 0 1px 0 color-mix(in srgb, white 14%, transparent), 0 1px 3px color-mix(in srgb, ${tone.accent} 10%, transparent)`,
            }}
        >
            <div className={`${useCondensedDoneLayout ? "px-3.5 py-3" : "px-4 py-4"}`}>
                <div className={`flex justify-between gap-3 ${useCondensedDoneLayout ? "items-center" : "items-start"}`}>
                    <div className={`flex min-w-0 gap-3 ${useCondensedDoneLayout ? "items-center" : "items-start"}`}>
                        <div
                            className={`flex shrink-0 items-center justify-center rounded-xl ${useCondensedDoneLayout ? "h-9 w-9" : "h-10 w-10"}`}
                            style={{
                                backgroundColor: `color-mix(in srgb, ${tone.accent} 16%, var(--surface-elevated))`,
                                color: tone.accent,
                            }}
                        >
                            {isDoneToday ? <CheckCircle2 className={`${useCondensedDoneLayout ? "h-4.5 w-4.5" : "h-5 w-5"}`} /> : <BookOpen className={`${useCondensedDoneLayout ? "h-4.5 w-4.5" : "h-5 w-5"}`} />}
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                {!useCondensedDoneLayout && isDoneToday ? (
                                    <span
                                        className="inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold"
                                        style={{
                                            backgroundColor: `color-mix(in srgb, ${tone.accent} 18%, var(--surface-elevated))`,
                                            borderColor: `color-mix(in srgb, ${tone.accent} 30%, var(--border-subtle))`,
                                            color: tone.accentStrong,
                                        }}
                                    >
                                        Done today
                                    </span>
                                ) : null}
                            </div>

                            <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                                Daily Habit
                            </div>
                            <h3 className={`${useCondensedDoneLayout ? "mt-1 text-[14px] sm:text-[15px]" : "mt-2 text-[15px] sm:text-base"} font-display font-bold leading-tight text-text`}>
                                {habit.title}
                            </h3>
                            {useCondensedDoneLayout && isDoneToday ? (
                                <div className="mt-1">
                                    <span
                                        className="inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold"
                                        style={{
                                            backgroundColor: `color-mix(in srgb, ${tone.accent} 18%, var(--surface-elevated))`,
                                            borderColor: `color-mix(in srgb, ${tone.accent} 30%, var(--border-subtle))`,
                                            color: tone.accentStrong,
                                        }}
                                    >
                                        Done today
                                    </span>
                                </div>
                            ) : null}
                            {!useCondensedDoneLayout ? (
                                <p className="mt-1 text-xs leading-relaxed text-text-muted sm:text-sm">
                                    {habit.description}
                                </p>
                            ) : null}

                            <div className={`${useCondensedDoneLayout ? "mt-1" : "mt-2"} flex flex-wrap items-center gap-2`}>
                                {!isDoneToday && habit.dueCount > 0 ? (
                                    <span className="inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold" style={{ borderColor: tone.border, color: tone.chipText }}>
                                        {habit.dueCount} due today
                                    </span>
                                ) : null}
                                {!isDoneToday && habit.newCount > 0 ? (
                                    <span className="inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold" style={{ borderColor: tone.border, color: tone.chipText }}>
                                        {visibleNewCount} new
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0">
                        <span
                            className={`dashboard-accent-button inline-flex items-center justify-center gap-1.5 !min-h-0 rounded-full font-semibold tracking-tight whitespace-nowrap transition-transform duration-200 group-hover:translate-x-0.5 ${
                                useCondensedDoneLayout
                                    ? "min-w-[82px] h-9 px-3 text-[13px] sm:min-w-[92px] sm:h-10 sm:px-4 sm:text-sm"
                                    : "min-w-[96px] h-10 px-4 text-sm"
                            }`}
                            style={{
                                '--dashboard-button-accent': tone.accent,
                                '--dashboard-button-text': tone.chipText,
                                borderColor: tone.border,
                            } as React.CSSProperties}
                        >
                            {ctaLabel}
                            <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function ChecklistAssignments({
    assignments,
    pinnedHabit,
    actions,
    mobileTasksLinkHref,
    mobileTasksLinkLabel,
    resolvedTitle,
    weeklyRangeLabel,
    showStudentStats = false,
}: {
    assignments: FeaturedAssignment[];
    pinnedHabit?: DailyChecklistHabit | null;
    actions?: React.ReactNode;
    mobileTasksLinkHref?: string;
    mobileTasksLinkLabel?: string;
    resolvedTitle: string | null;
    weeklyRangeLabel: string | null;
    showStudentStats?: boolean;
}) {
    const [activeFilter, setActiveFilter] = useState<string>('all');

    const rows = assignments.map<NormalizedChecklistRow>((assignment, index) => {
        const submission = assignment.submissions[0];
        const progressValue = typeof assignment.progress === 'number' ? assignment.progress : 0;
        const isNew = isNewlyFeatured(assignment);
        const isGameRow = isGameCategory(assignment.activity.category);
        const isGrammarGuide =
            (assignment.activity.type || '').toLowerCase() === 'guide' &&
            (assignment.activity.category || '').toLowerCase() === 'grammar';

        const vocabProgress = getVocabProgress(assignment);
        const isVocabPartial = Boolean(vocabProgress && vocabProgress.completed > 0 && vocabProgress.completed < vocabProgress.total);
        const isVocabComplete = Boolean(vocabProgress && vocabProgress.completed === vocabProgress.total);
        const grammarPassed = assignment.submissions.some(
            (item) => !!item.completedAt && typeof item.score === 'number' && item.score > 70
        );

        const isCompleted = isGameRow
            ? false
            : isGrammarGuide
                ? grammarPassed || assignment.progressStatus === 'completed'
                : vocabProgress
                    ? isVocabComplete
                    : progressValue >= 100 || assignment.progressStatus === 'completed' || !!submission?.completedAt;

        const rawTitle = assignment.title || assignment.activity.title;
        const displayTitle = stripVocabTypeSuffix(rawTitle.replace(/ - Complete Step-by-Step Guide$/i, ' Guide'));
        const categoryStyle = getCategoryStyle(assignment.activity.category);
        const groupKey = resolveChecklistGroupKey(assignment.activity.category);
        const dueMeta = getFriendlyDueMeta(assignment.dueDate);
        const progressSummary = getProgressSummary(vocabProgress, progressValue, isCompleted);
        const isResumable = !isCompleted && (isVocabPartial || progressValue > 0);

        return {
            assignment,
            submission,
            index,
            groupKey,
            isCompleted,
            isNew,
            isGameRow,
            displayTitle,
            categoryStyle,
            dueMeta,
            progressValue,
            vocabProgress,
            actionLabel: getRowActionLabel(isGameRow, isCompleted),
            isResumable,
            isVocabPartial,
            progressSummary,
        };
    });

    const sortedRows = [...rows].sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1;
        }

        if (!a.isCompleted) {
            const aPriority = getCategoryPriority(a.groupKey);
            const bPriority = getCategoryPriority(b.groupKey);
            if (aPriority !== bPriority) return aPriority - bPriority;

            const aTitle = a.assignment.title || a.assignment.activity.title || '';
            const bTitle = b.assignment.title || b.assignment.activity.title || '';
            const aDueFallback = getDateFromTitle(aTitle);
            const bDueFallback = getDateFromTitle(bTitle);
            const aDue = a.assignment.dueDate ? new Date(a.assignment.dueDate).getTime() : (aDueFallback ?? Number.POSITIVE_INFINITY);
            const bDue = b.assignment.dueDate ? new Date(b.assignment.dueDate).getTime() : (bDueFallback ?? Number.POSITIVE_INFINITY);

            if (!Number.isNaN(aDue) && !Number.isNaN(bDue) && aDue !== bDue) {
                return aDue - bDue;
            }
        }

        return a.index - b.index;
    });

    const checklistRows = rows.filter((row) => !row.isGameRow);
    const completedCount = checklistRows.filter((row) => row.isCompleted).length;
    const percent = checklistRows.length ? Math.round((completedCount / checklistRows.length) * 100) : 0;
    const isFullyComplete = percent === 100;

    const resumeRow =
        sortedRows.find((row) => row.isResumable && row.isVocabPartial) ??
        sortedRows.find((row) => row.isResumable) ??
        null;

    const showResumeCard = Boolean(resumeRow && !isFullyComplete);
    const taskRows = showResumeCard
        ? sortedRows.filter((row) => row.assignment.id !== resumeRow!.assignment.id)
        : sortedRows;

    const groups = CHECKLIST_GROUPS.map((group) => {
        const items = sortedRows.filter((row) => row.groupKey === group.key);
        const doneInGroup = items.filter((row) => row.isCompleted).length;
        return {
            ...group,
            items,
            doneInGroup,
            isGameGroup: group.key === 'activity',
        };
    }).filter((group) => group.items.length > 0);

    const taskGroups = CHECKLIST_GROUPS.map((group) => ({
        ...group,
        items: taskRows.filter((row) => row.groupKey === group.key),
    })).filter((group) => group.items.length > 0);

    useEffect(() => {
        if (activeFilter === 'all') return;
        if (taskGroups.some((group) => group.key === activeFilter)) return;
        setActiveFilter('all');
    }, [activeFilter, taskGroups]);

    const filteredTaskRows = taskRows.filter((row) => activeFilter === 'all' || row.groupKey === activeFilter);
    const pinnedHabitNeedsAttention = Boolean(pinnedHabit && pinnedHabit.status !== 'done-today');
    const pinnedHabitDoneToday = Boolean(pinnedHabit && pinnedHabit.status === 'done-today');
    const vocabularyGroupTemplate = CHECKLIST_GROUPS.find((group) => group.key === 'vocabulary');
    const desktopGroups = pinnedHabit && vocabularyGroupTemplate && !groups.some((group) => group.key === 'vocabulary')
        ? [
            ...groups,
            {
                ...vocabularyGroupTemplate,
                items: [],
                doneInGroup: 0,
                isGameGroup: false,
            },
        ].sort((left, right) => CHECKLIST_GROUPS.findIndex((group) => group.key === left.key) - CHECKLIST_GROUPS.findIndex((group) => group.key === right.key))
        : groups;

    const renderChecklistRow = (
        row: NormalizedChecklistRow,
        isGameGroup = false,
        categoryStyle: CategoryStyle,
        showCategoryChip?: CategoryStyle
    ) => (
        <div
            key={row.assignment.id}
            className={`checklist-row-premium relative group/row flex flex-col gap-2 border-b px-4 py-3 last:border-0 ${row.isCompleted ? 'opacity-70' : ''}`}
            style={{
                '--row-accent': categoryStyle.accent,
                borderColor: 'var(--dashboard-divider)',
            } as React.CSSProperties}
        >
            <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 flex items-center justify-center w-5 h-5">
                    {isGameGroup ? (
                        <div className="w-5 h-5 flex items-center justify-center text-[18px] leading-none">
                            {getGameEmojiForActivity({ activityId: row.assignment.activityId, title: row.assignment.title || row.assignment.activity.title })}
                        </div>
                    ) : (
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                row.isCompleted
                                    ? 'bg-secondary/15 border-secondary/45 text-secondary'
                                    : 'text-transparent shadow-sm'
                            }`}
                            style={row.isCompleted ? undefined : { backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-strong)' }}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </div>

                {row.isNew && (
                    <span className={`${FEATURED_NEW_BADGE_CLASS_NAME} shrink-0 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide`} style={{ backgroundColor: 'var(--tone-speaking-chip-bg)', borderColor: 'var(--tone-speaking-border)', color: 'var(--tone-speaking-chip-text)' }}>
                        <Sparkles className="h-2.5 w-2.5 text-amber-700" aria-hidden />
                        New
                    </span>
                )}

                {row.assignment.sectionCount && row.assignment.sectionCount > 1 && (
                    <span className="shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-semibold" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-color-muted)' }}>
                        {row.assignment.sectionCount} sections
                    </span>
                )}

                <div className="min-w-0 flex-1">
                    <div className={`text-[13px] sm:text-sm font-semibold leading-tight truncate transition-colors ${row.isCompleted ? 'text-text/85' : 'text-text'}`}>
                        {row.displayTitle}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        {showCategoryChip && (
                            <span
                                className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
                                style={{ backgroundColor: showCategoryChip.bg, color: showCategoryChip.text }}
                            >
                                {showCategoryChip.label}
                            </span>
                        )}
                        {(() => {
                            const vocabType = getVocabActivityType(row.assignment.activityId);
                            if (!vocabType) return null;
                            const chip = VOCAB_CHIP_CONFIG[vocabType];
                            return (
                                <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${chip.className.replace('text-[10px]', '')} opacity-90`}>
                                    {chip.label}
                                </span>
                            );
                        })()}

                        {!isGameGroup && row.dueMeta?.tone === 'overdue' && !row.isCompleted && (
                            <span className="text-[9px] font-semibold text-red-500">
                                {row.dueMeta.label}
                            </span>
                        )}
                    </div>

                    {isGameGroup ? null : row.vocabProgress && row.vocabProgress.completed < row.vocabProgress.total ? (
                        <div className="mt-2">
                            <CompactVocabTracker vocabProgress={row.vocabProgress} />
                        </div>
                    ) : !row.isCompleted && row.progressValue > 0 ? (
                        <div className="mt-2">
                            <div
                                className="dashboard-progress-track h-1.5 w-24 max-w-full"
                                style={{ '--dashboard-progress-accent': categoryStyle.accent } as React.CSSProperties}
                            >
                                <div
                                    className="dashboard-progress-fill progress-glow transition-[width] duration-300"
                                    style={{
                                        width: `${row.progressValue}%`,
                                        '--dashboard-progress-accent': categoryStyle.accent,
                                    } as React.CSSProperties}
                                />
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="shrink-0 pl-1">
                    <ActivityLink
                        activityId={row.assignment.activityId}
                        assignmentId={row.assignment.id}
                        href={row.assignment.href}
                        className="dashboard-accent-button inline-flex items-center justify-center !min-h-0 min-w-[82px] h-9 rounded-full px-3 text-[13px] font-semibold tracking-tight whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 sm:min-w-[92px] sm:h-10 sm:px-4 sm:text-sm"
                        style={{
                            '--dashboard-button-accent': categoryStyle.accent,
                            '--dashboard-button-text': isGameGroup || row.isCompleted ? categoryStyle.text : categoryStyle.accent,
                        } as React.CSSProperties}
                        aria-label={`${row.actionLabel} ${row.displayTitle}`}
                    >
                        <span>{row.actionLabel}</span>
                    </ActivityLink>
                </div>
            </div>
        </div>
    );

    const renderCondensedRow = (row: NormalizedChecklistRow) => {
        const rowIcon = getRowGlyph(row, 'w-4 h-4');
        const vocabType = getVocabActivityType(row.assignment.activityId);
        const vocabChip = vocabType ? VOCAB_CHIP_CONFIG[vocabType] : null;
        const showProgressSummary = !row.vocabProgress && !row.isCompleted && Boolean(row.progressSummary);

        return (
            <div
                key={row.assignment.id}
                className={`relative overflow-hidden rounded-xl border px-3.5 py-2.5 transition-transform duration-150 active:scale-[0.98] ${row.isCompleted ? 'opacity-70' : ''}`}
                style={{
                    borderColor: row.isCompleted
                        ? 'rgba(127, 179, 213, 0.12)'
                        : `color-mix(in srgb, ${row.categoryStyle.accent} 25%, var(--border-subtle))`,
                    background: row.isCompleted
                        ? 'var(--surface-subtle)'
                        : 'linear-gradient(135deg, var(--surface-elevated) 0%, var(--surface-overlay) 100%)',
                    boxShadow: row.isCompleted
                        ? 'none'
                        : '0 2px 6px rgba(4, 10, 18, 0.06), 0 1px 2px rgba(4, 10, 18, 0.04)',
                }}
            >
                <div className="pointer-events-none absolute inset-y-1 right-4 w-12 opacity-15 blur-2xl" style={{ background: row.categoryStyle.accent }} />
                <div className="relative flex items-center gap-2.5">
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={row.isCompleted ? {
                            backgroundColor: `color-mix(in srgb, ${row.categoryStyle.accent} 18%, transparent)`,
                            color: row.categoryStyle.accent,
                        } : {
                            backgroundColor: `color-mix(in srgb, ${row.categoryStyle.accent} 14%, transparent)`,
                            color: row.categoryStyle.accent,
                        }}
                    >
                        {row.isCompleted ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : rowIcon}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="text-[14px] leading-snug font-semibold text-text">
                            {row.displayTitle}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span
                                className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                                style={{
                                    backgroundColor: `color-mix(in srgb, ${row.categoryStyle.accent} 20%, transparent)`,
                                    color: row.categoryStyle.accent,
                                }}
                            >
                                {row.categoryStyle.label}
                            </span>
                            {vocabChip && (
                                <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${vocabChip.className.replace('rounded-md', 'rounded').replace('text-[10px]', 'text-[9px]')}`}>
                                    {vocabChip.label}
                                </span>
                            )}
                            {row.isNew && (
                                <span className={`${FEATURED_NEW_BADGE_CLASS_NAME} px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide`} style={{ backgroundColor: 'var(--tone-speaking-chip-bg)', borderColor: 'var(--tone-speaking-border)', color: 'var(--tone-speaking-chip-text)' }}>
                                    <Sparkles className="h-2 w-2 text-amber-700" aria-hidden />
                                    New
                                </span>
                            )}
                            {!row.isCompleted && row.dueMeta ? <DueBadge dueMeta={row.dueMeta} /> : null}
                            {showProgressSummary ? (
                                <span className="text-[10px] font-medium text-text-muted">{row.progressSummary}</span>
                            ) : null}
                        </div>

                        {row.vocabProgress && row.vocabProgress.completed < row.vocabProgress.total ? (
                            <div className="mt-1.5">
                                <CompactVocabTracker vocabProgress={row.vocabProgress} />
                            </div>
                        ) : null}
                    </div>

                    <ActivityLink
                        activityId={row.assignment.activityId}
                        assignmentId={row.assignment.id}
                        href={row.assignment.href}
                        className="dashboard-accent-button shrink-0 inline-flex min-h-[32px] items-center gap-1.5 rounded-full px-3.5 py-1 text-[13px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{
                            '--dashboard-button-accent': row.categoryStyle.accent,
                            '--dashboard-button-text': row.isCompleted || row.isGameRow ? row.categoryStyle.text : row.categoryStyle.accent,
                        } as React.CSSProperties}
                        aria-label={`${row.actionLabel} ${row.displayTitle}`}
                    >
                        <span>{row.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </ActivityLink>
                </div>
            </div>
        );
    };

    const renderResumeCard = (row: NormalizedChecklistRow) => (
        <div
            className="dashboard-panel relative overflow-hidden rounded-2xl px-4 py-3"
            style={{
                borderColor: `color-mix(in srgb, ${row.categoryStyle.accent} 24%, var(--dashboard-border))`,
                background: `linear-gradient(180deg, color-mix(in srgb, ${row.categoryStyle.accent} 6%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, ${row.categoryStyle.accent} 2%, var(--dashboard-surface-end)) 100%)`,
            }}
        >
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-full" style={{ background: row.categoryStyle.accent }} />
            <div className="pointer-events-none absolute -right-4 top-1 h-14 w-14 rounded-full opacity-30 blur-2xl" style={{ background: row.categoryStyle.accent }} />

            <div className="relative flex items-center gap-2.5">
                <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `color-mix(in srgb, ${row.categoryStyle.accent} 18%, transparent)`, color: row.categoryStyle.accent }}
                >
                    {getRowGlyph(row, 'w-4 h-4')}
                </div>

                <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-text-muted">Resume</span>

                    <h3 className="text-[14px] leading-snug font-display font-bold text-text">
                        {row.displayTitle}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span
                            className="inline-flex rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                            style={{ backgroundColor: `color-mix(in srgb, ${row.categoryStyle.accent} 20%, transparent)`, color: row.categoryStyle.accent }}
                        >
                            {row.categoryStyle.label}
                        </span>
                        {row.isNew && (
                            <span className={`${FEATURED_NEW_BADGE_CLASS_NAME} px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide`} style={{ backgroundColor: 'var(--tone-speaking-chip-bg)', borderColor: 'var(--tone-speaking-border)', color: 'var(--tone-speaking-chip-text)' }}>
                                <Sparkles className="h-2 w-2 text-amber-700" aria-hidden />
                                New
                            </span>
                        )}
                        {!row.isCompleted && row.dueMeta ? <DueBadge dueMeta={row.dueMeta} /> : null}
                    </div>

                    {row.vocabProgress && row.vocabProgress.completed < row.vocabProgress.total ? (
                        <div className="mt-1">
                            <CompactVocabTracker vocabProgress={row.vocabProgress} />
                        </div>
                    ) : !row.isCompleted && row.progressValue > 0 ? (
                        <div className="mt-1 flex items-center gap-1.5">
                            <div
                                className="dashboard-progress-track h-1 w-16"
                                style={{ '--dashboard-progress-accent': row.categoryStyle.accent } as React.CSSProperties}
                            >
                                <div
                                    className="dashboard-progress-fill progress-glow transition-[width] duration-300"
                                    style={{
                                        width: `${row.progressValue}%`,
                                        '--dashboard-progress-accent': row.categoryStyle.accent,
                                    } as React.CSSProperties}
                                />
                            </div>
                            <span className="text-[10px] font-medium text-text-muted whitespace-nowrap">{row.progressSummary}</span>
                        </div>
                    ) : null}
                </div>

                <ActivityLink
                    activityId={row.assignment.activityId}
                    assignmentId={row.assignment.id}
                    href={row.assignment.href}
                    className="dashboard-accent-button shrink-0 inline-flex min-h-[32px] items-center gap-1.5 rounded-full px-3.5 py-1 text-[13px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                        '--dashboard-button-accent': row.categoryStyle.accent,
                        '--dashboard-button-text': row.categoryStyle.accent,
                    } as React.CSSProperties}
                    aria-label={`Resume ${row.displayTitle}`}
                >
                    <span>Resume</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </ActivityLink>
            </div>
        </div>
    );

    return (
        <div className="mb-8">
            <div
                className={`overflow-hidden rounded-2xl border surface-card-shadow ${isFullyComplete ? 'ring-2 ring-[var(--tone-speaking-border)] celebrate-complete' : ''}`}
                style={{
                    borderColor: isFullyComplete ? 'var(--tone-speaking-border)' : 'var(--dashboard-border)',
                    background: 'linear-gradient(180deg, var(--dashboard-surface-start) 0%, var(--dashboard-surface-end) 100%)',
                }}
            >
                <div
                    className="relative z-10 border-b px-4 py-4 sm:px-6 sm:py-5"
                    style={{
                        borderColor: 'var(--dashboard-divider)',
                        background: 'linear-gradient(180deg, var(--dashboard-surface-start) 0%, color-mix(in srgb, var(--dashboard-surface-end) 92%, var(--dashboard-shell-bg)) 100%)',
                    }}
                >
                    <div className="mb-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-all duration-300 ${isFullyComplete ? 'border shadow-[0_2px_8px_rgba(181,110,26,0.15)]' : 'bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]'}`} style={isFullyComplete ? { backgroundColor: 'var(--tone-speaking-chip-bg)', borderColor: 'var(--tone-speaking-border)' } : undefined}>
                                {isFullyComplete ? '🏆' : '📋'}
                            </div>
                            {resolvedTitle ? (
                                <div className="min-w-0">
                                    <h2 className="text-base sm:text-lg font-display font-bold text-text leading-tight">
                                        {resolvedTitle}
                                    </h2>
                                    {weeklyRangeLabel ? (
                                        <p className="text-[11px] sm:text-xs font-medium text-text-muted">
                                            {weeklyRangeLabel}
                                        </p>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-text/70">
                            {actions && <div className="mr-2">{actions}</div>}
                            {showStudentStats && (
                                <div className="flex items-center gap-1">
                                    <StudentQuickStats mobile maxVisible={2} chipKeys={['streak', 'weekly']} compact tight />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="relative z-20 flex items-center gap-2.5">
                        <div className="min-w-0 flex-1">
                            <div className={`relative z-20 w-full overflow-hidden rounded-full border h-4 ${
                                isFullyComplete
                                    ? 'border-[#d7c09a]/50 shadow-[inset_0_1px_2px_rgba(138,91,61,0.06)] dark:border-[rgba(245,217,138,0.24)] dark:shadow-[inset_0_1px_2px_rgba(8,16,24,0.3)]'
                                    : 'border-[#e8e0d4]/50 shadow-[inset_0_1px_2px_rgba(78,57,39,0.04)] dark:border-[rgba(226,232,240,0.24)] dark:shadow-[inset_0_1px_2px_rgba(8,16,24,0.32)]'
                            }`}
                            style={{
                                background: isFullyComplete
                                    ? 'var(--checklist-track-bg-complete)'
                                    : 'var(--checklist-track-bg)',
                            }}>
                                <div
                                    className={`absolute inset-y-0 left-0 z-10 rounded-[999px] transition-[width] duration-700 ease-out ${percent >= 90 && !isFullyComplete ? 'progress-liquid' : ''}`}
                                    style={{
                                        width: `${percent}%`,
                                        background: isFullyComplete
                                            ? 'linear-gradient(90deg, #b8442a 0%, #d96838 35%, #e8933a 70%, #f5c842 100%)'
                                            : 'linear-gradient(90deg, #c8552e 0%, #dd6b36 40%, #e8882e 75%, #f0a832 100%)',
                                        boxShadow: isFullyComplete
                                            ? '0 0 12px rgba(217,119,87,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                                            : percent >= 90
                                                ? '0 0 10px rgba(217,119,87,0.35), inset 0 1px 0 rgba(255,255,255,0.25)'
                                                : '0 0 8px rgba(217,119,87,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                                    }}
                                />

                                {percent > 0 && (
                                    <div
                                        className={`absolute top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full border text-[12px] transition-all duration-300 ${
                                            isFullyComplete
                                                ? 'border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100 shadow-[0_0_16px_rgba(245,158,11,0.4),0_2px_6px_rgba(93,67,46,0.2)] animate-bounce-subtle'
                                                : 'border-white bg-gradient-to-b from-white to-gray-50 shadow-[0_2px_8px_rgba(93,67,46,0.18),inset_0_1px_0_rgba(255,255,255,1)]'
                                        }`}
                                        style={{ left: `clamp(14px, ${percent}%, calc(100% - 14px))` }}
                                    >
                                        {isFullyComplete ? '🏆' : percent >= 75 ? '🔥' : percent >= 40 ? '✨' : '🌱'}
                                    </div>
                                )}
                            </div>
                        </div>

                        <span
                            className={`shrink-0 px-2.5 py-1 rounded-full border text-[12px] font-bold leading-none tabular-nums transition-all duration-300 ${
                                isFullyComplete
                                    ? 'bg-gradient-to-b from-[#faf6f0] to-[#f4ebe0] border-[#d7c09a]/70 text-[#8a5b3d] shadow-[0_1px_2px_rgba(138,91,61,0.1),inset_0_1px_0_rgba(255,255,255,0.8)]'
                                    : 'bg-gradient-to-b from-[#fffdfa] to-[#f6efe6] border-[#dcccbc]/80 text-[#8f5d4e] shadow-[0_1px_2px_rgba(78,57,39,0.08),inset_0_1px_0_rgba(255,255,255,0.7)]'
                            }`}
                        >
                            {percent}%
                        </span>
                    </div>
                </div>

                <div className="lg:hidden border-b" style={{ backgroundColor: 'var(--surface-subtle)', borderColor: 'var(--dashboard-divider)' }}>
                    <div className="flex items-center gap-2 px-3 py-2.5 overflow-x-auto no-scrollbar mask-edges">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`shrink-0 !min-h-0 !min-w-0 px-3 py-1 rounded-full font-bold uppercase leading-none transition-all duration-200 flex items-center gap-1.5 ${activeFilter === 'all' ? 'shadow-sm' : 'text-text/70 hover:shadow-sm'}`}
                            style={{ fontSize: '11px', WebkitTextSizeAdjust: '100%', backgroundColor: activeFilter === 'all' ? 'var(--surface-base)' : 'var(--surface-overlay)', color: activeFilter === 'all' ? 'var(--text-color)' : undefined, borderColor: activeFilter === 'all' ? 'var(--color-primary)' : 'var(--border-subtle)' }}
                        >
                            ALL
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold leading-none ${activeFilter === 'all' ? 'bg-white/20' : 'bg-black/5'}`}>
                                {taskRows.length}
                            </span>
                        </button>

                        {taskGroups.map((group) => {
                            const groupStyle = getCategoryStyle(group.key);
                            const isActive = activeFilter === group.key;

                            return (
                                <button
                                    key={group.key}
                                    onClick={() => setActiveFilter(group.key)}
                                    className="shrink-0 !min-h-0 !min-w-0 px-3 py-1 rounded-full font-bold uppercase leading-none transition-all duration-200 border flex items-center gap-1.5"
                                    style={{
                                        fontSize: '11px',
                                        WebkitTextSizeAdjust: '100%',
                                        backgroundColor: isActive ? groupStyle.accent : 'var(--surface-overlay)',
                                        color: isActive ? 'var(--text-on-accent)' : groupStyle.text,
                                        borderColor: isActive ? groupStyle.accent : 'var(--border-subtle)',
                                    }}
                                >
                                    <span className={`[&>svg]:w-3.5 [&>svg]:h-3.5 [&>svg]:stroke-[2.5px] ${isActive ? 'text-white/90' : 'opacity-70'}`}>
                                        {group.renderIcon('w-3.5 h-3.5')}
                                    </span>
                                    {group.label}
                                    <span className={`ml-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold leading-none ${isActive ? 'bg-white/20' : 'bg-black/5'}`}>
                                        {group.items.length}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:hidden px-3 py-3 space-y-2.5" style={{ backgroundColor: 'var(--surface-subtle)' }}>
                        {pinnedHabitNeedsAttention && pinnedHabit ? (
                            <PinnedDailyHabitRow habit={pinnedHabit} compact />
                        ) : null}

                        {showResumeCard ? renderResumeCard(resumeRow!) : null}

                        <div className="flex items-center justify-between gap-3 px-0.5 pt-1">
                            <h3 className="text-[17px] font-bold text-text tracking-tight">Your tasks</h3>
                            {mobileTasksLinkHref ? (
                                <Link
                                    href={mobileTasksLinkHref}
                                    className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded"
                                >
                                    <span>{mobileTasksLinkLabel ?? 'All Activities'}</span>
                                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                                </Link>
                            ) : null}
                        </div>

                        {filteredTaskRows.length > 0 ? (
                            <div className="space-y-2">
                                {filteredTaskRows.map(renderCondensedRow)}
                            </div>
                        ) : (
                            <div className="rounded-xl border px-4 py-8 text-center" style={{ borderColor: 'var(--dashboard-divider)', backgroundColor: 'var(--dashboard-surface-start)' }}>
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-2xl">
                                    🔍
                                </div>
                                <p className="text-sm font-semibold text-text">No tasks in this filter</p>
                                <p className="mt-1 text-xs text-text-muted">Try a different filter or show all activities.</p>
                                <button
                                    onClick={() => setActiveFilter('all')}
                                    className="mt-3 text-xs font-bold uppercase tracking-wider text-[var(--tone-vocabulary-chip-text)] hover:underline"
                                >
                                    Show all
                                </button>
                            </div>
                        )}

                        {pinnedHabitDoneToday && pinnedHabit ? (
                            <PinnedDailyHabitRow habit={pinnedHabit} compact />
                        ) : null}
                    </div>

                <div
                    className="hidden lg:block px-6 pb-6 pt-7"
                    style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--dashboard-surface-start) 94%, var(--dashboard-shell-bg)) 0%, var(--dashboard-surface-end) 100%)' }}
                >
                    <div className="grid grid-cols-1 gap-x-7 gap-y-7 lg:auto-rows-fr lg:grid-cols-2">
                        {desktopGroups.map((group) => {
                            const groupStyle = getCategoryStyle(group.key);
                            const showPinnedHabitAtTop = group.key === 'vocabulary' && pinnedHabitNeedsAttention && pinnedHabit;
                            const showPinnedHabitAtBottom = group.key === 'vocabulary' && pinnedHabitDoneToday && pinnedHabit;
                            return (
                                <div
                                    key={group.key}
                                    className={`relative flex flex-col overflow-hidden rounded-2xl border surface-card-shadow category-card-polish paper-texture stagger-in group/card category-glow-${group.key}`}
                                    style={{
                                        background: `linear-gradient(to bottom, color-mix(in srgb, ${groupStyle.accent} 4%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, ${groupStyle.accent} 1.5%, var(--dashboard-surface-end)) 100%)`,
                                        borderColor: `color-mix(in srgb, ${groupStyle.accent} 14%, var(--dashboard-border))`,
                                        '--card-glow-color': `color-mix(in srgb, ${groupStyle.accent} 12%, transparent)`,
                                    } as React.CSSProperties}
                                >
                                    {/* Decorative accent blob */}
                                    <div
                                        className="pointer-events-none absolute -top-4 -right-4 w-24 h-24 opacity-[0.08] blur-2xl rounded-full"
                                        style={{ background: groupStyle.accent }}
                                    />
                                    <div
                                        className="relative w-full px-4 py-3 flex items-center justify-between"
                                        style={{
                                            borderLeft: `4px solid ${groupStyle.accent}`,
                                            background: `linear-gradient(90deg, color-mix(in srgb, ${groupStyle.accent} 9%, var(--dashboard-surface-start)) 0%, color-mix(in srgb, ${groupStyle.accent} 3%, var(--dashboard-surface-end)) 100%)`,
                                            boxShadow: 'inset 0 -1px 0 var(--dashboard-divider)',
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 group-hover/card:scale-110 group-hover/card:rotate-3"
                                                style={{
                                                    backgroundColor: `color-mix(in srgb, ${groupStyle.accent} 15%, var(--dashboard-surface-start))`,
                                                    color: groupStyle.accent,
                                                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 4px color-mix(in srgb, ${groupStyle.accent} 20%, transparent), 0 4px 8px color-mix(in srgb, ${groupStyle.accent} 10%, transparent)`,
                                                }}
                                            >
                                                    {group.renderIcon('w-4.5 h-4.5')}
                                            </span>
                                            <Link
                                                href={`/dashboard/activities?category=${group.key === 'activity' ? 'games' : group.key}`}
                                                className="font-bold text-[15px] tracking-tight hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 rounded"
                                                style={{ color: groupStyle.text }}
                                            >
                                                {group.label}
                                            </Link>
                                            <span
                                                className="text-[11px] font-bold px-2.5 py-1 rounded-lg tabular-nums"
                                                style={{
                                                    backgroundColor: `color-mix(in srgb, ${groupStyle.accent} 12%, var(--dashboard-surface-start))`,
                                                    color: groupStyle.text,
                                                    border: `1px solid color-mix(in srgb, ${groupStyle.accent} 25%, transparent)`,
                                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
                                                }}
                                            >
                                                {group.isGameGroup ? `${group.items.length}` : `${group.doneInGroup}/${group.items.length}`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative flex-1 divide-y" style={{ borderColor: 'var(--dashboard-divider)' }}>
                                        {showPinnedHabitAtTop ? (
                                            <PinnedDailyHabitRow habit={pinnedHabit} embedded />
                                        ) : null}
                                        {group.items.map((row) => renderChecklistRow(row, group.isGameGroup, groupStyle))}
                                        {showPinnedHabitAtBottom ? (
                                            <PinnedDailyHabitRow habit={pinnedHabit} embedded />
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export const TodaysAssignments: React.FC<Props> = ({
    initialAssignments,
    pinnedHabit = null,
    title,
    ctaLabel = 'Start Activity',
    variant = 'cards',
    actions,
    mobileTasksLinkHref,
    mobileTasksLinkLabel,
    refreshOnMount = false,
    showStudentStats = false,
}) => {
    const hasInitialAssignments = initialAssignments !== undefined;
    const [assignments, setAssignments] = useState<FeaturedAssignment[]>(initialAssignments || []);
    const [loading, setLoading] = useState(() => !hasInitialAssignments || refreshOnMount);

    const resolvedTitle = (() => {
        if (title === undefined) {
            return variant === 'checklist' ? 'Weekly Checklist' : "This Week's Activities";
        }
        if (title.trim() === '') return null;
        return title;
    })();

    const weeklyRangeLabel = variant === 'checklist'
        ? formatWeekRangeLabel(new Date())
        : null;

    useEffect(() => {
        if (refreshOnMount) {
            void fetchFeaturedAssignments();
            return;
        }

        if (hasInitialAssignments) {
            setLoading(false);
            return;
        }
        void fetchFeaturedAssignments();
    }, [hasInitialAssignments, refreshOnMount]);

    const fetchFeaturedAssignments = async () => {
        try {
            const response = await fetch('/api/assignments/featured');
            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
            }
        } catch (error) {
            console.error('Error fetching featured assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="mb-8">
                <div className="overflow-hidden rounded-2xl border surface-card-shadow" style={{ borderColor: 'var(--dashboard-border)', backgroundColor: 'var(--dashboard-surface-start)' }}>
                    <div className="border-b p-6" style={{ borderColor: 'var(--dashboard-border)', background: 'linear-gradient(135deg, var(--dashboard-surface-start) 0%, var(--dashboard-surface-end) 100%)' }}>
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl skeleton"></div>
                                <div className="h-6 w-32 skeleton rounded-lg"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-20 skeleton rounded-full"></div>
                                <div className="h-8 w-14 skeleton rounded-full"></div>
                            </div>
                        </div>
                        <div className="mt-4 h-2.5 skeleton rounded-full"></div>
                    </div>

                    <div className="divide-y" style={{ borderColor: 'var(--dashboard-divider)' }}>
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ borderLeft: '6px solid var(--color-border-subtle)' }}>
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="w-[22px] h-[22px] skeleton rounded-md mt-0.5"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-5 w-16 skeleton rounded-md"></div>
                                        </div>
                                        <div className="h-5 w-48 sm:w-64 skeleton rounded-lg"></div>
                                    </div>
                                </div>
                                <div className="h-10 w-24 skeleton rounded-xl sm:shrink-0"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (assignments.length === 0 && !pinnedHabit) {
        return (
            <div className="mb-8">
                <div className="overflow-hidden rounded-2xl border surface-card-shadow" style={{ borderColor: 'var(--dashboard-border)', backgroundColor: 'var(--dashboard-surface-start)' }}>
                    <div className="flex items-center gap-3 border-b px-6 py-6" style={{ borderColor: 'var(--dashboard-border)', backgroundColor: 'var(--dashboard-surface-start)' }}>
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg">
                            📋
                        </div>
                        {resolvedTitle ? (
                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-xl font-display font-bold text-text leading-tight">
                                    {resolvedTitle}
                                </h2>
                                {weeklyRangeLabel ? (
                                    <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-text-muted">
                                        {weeklyRangeLabel}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}
                    </div>

                    <div className="p-8 text-center relative overflow-hidden">
                        <div className="absolute top-4 left-8 w-16 h-16 bg-accent/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-4 right-8 w-20 h-20 bg-secondary/10 rounded-full blur-2xl"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                                <span className="text-3xl">🎯</span>
                            </div>
                            <p className="text-lg font-semibold text-text mb-1">All caught up!</p>
                            <p className="text-sm text-text-muted max-w-xs mx-auto">
                                No assignments this week. Explore activities below to keep building your skills.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'checklist') {
        return (
            <ChecklistAssignments
                assignments={assignments}
                pinnedHabit={pinnedHabit}
                actions={actions}
                mobileTasksLinkHref={mobileTasksLinkHref}
                mobileTasksLinkLabel={mobileTasksLinkLabel}
                resolvedTitle={resolvedTitle}
                weeklyRangeLabel={weeklyRangeLabel}
                showStudentStats={showStudentStats}
            />
        );
    }

    return (
        <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-text mb-4 flex items-center gap-3 leading-tight">
                <span className="w-1 h-6 rounded-full bg-primary"></span>
                {title}
            </h2>
            <div className="rounded-2xl border p-6 shadow-[inset_0_1px_0_var(--dashboard-inset-highlight),0_1px_0_rgba(0,0,0,0.05),0_12px_30px_rgba(0,0,0,0.06)]" style={{ background: 'linear-gradient(135deg, var(--dashboard-surface-start) 0%, var(--dashboard-surface-end) 100%)', borderColor: 'var(--dashboard-border)' }}>
                <div className="grid grid-cols-1 gap-x-7 gap-y-7 lg:grid-cols-2">
                    {assignments.map((assignment, index) => {
                        const submission = assignment.submissions[0];
                        const isCompleted = !!submission?.completedAt || assignment.progressStatus === 'completed';
                        const isNew = isNewlyFeatured(assignment);
                        const categoryStyle = getCategoryStyle(assignment.activity.category);
                        const rawTitle = assignment.title || assignment.activity.title;
                        const displayTitle = stripVocabTypeSuffix(rawTitle.replace(/ - Complete Step-by-Step Guide$/i, ' Guide'));

                        return (
                            <div
                                key={assignment.id}
                                className="dashboard-panel-hover relative overflow-hidden rounded-2xl border surface-card-shadow group"
                                style={{ animationDelay: `${index * 40}ms`, backgroundColor: 'var(--dashboard-surface-start)', borderColor: 'var(--dashboard-border)' }}
                            >
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-1 transition-[width] duration-200 group-hover:w-1.5"
                                    style={{ backgroundColor: categoryStyle.accent }}
                                />

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 pl-5">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                            <span
                                                className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
                                                style={{ backgroundColor: categoryStyle.bg, color: categoryStyle.text }}
                                            >
                                                {categoryStyle.label}
                                            </span>

                                            {isNew && (
                                                <span className={`${FEATURED_NEW_BADGE_CLASS_NAME} px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide`}>
                                                    <Sparkles className="h-2.5 w-2.5 text-amber-700" aria-hidden />
                                                    New
                                                </span>
                                            )}

                                            {(() => {
                                                const vocabType = getVocabActivityType(assignment.activityId);
                                                if (!vocabType) return null;
                                                const chip = VOCAB_CHIP_CONFIG[vocabType];
                                                return (
                                                    <ActivityLink
                                                        activityId={assignment.activityId}
                                                        assignmentId={assignment.id}
                                                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border transition-colors z-20 ${chip.className}`}
                                                        onClick={(event) => event.stopPropagation()}
                                                    >
                                                        {chip.icon} {chip.label}
                                                    </ActivityLink>
                                                );
                                            })()}

                                            {assignment.progress != null && assignment.progress > 0 && !isCompleted && (
                                                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    {Math.round(assignment.progress)}% done
                                                </span>
                                            )}

                                            {isCompleted && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-[#3d6b47] dark:text-secondary rounded text-[10px] font-bold uppercase tracking-wide">
                                                    <span className="text-xs">✓</span>
                                                    Done
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-base sm:text-lg font-semibold text-text group-hover:text-primary transition-colors leading-snug">
                                            {displayTitle}
                                        </h3>
                                    </div>

                                    <ActivityLink
                                        activityId={assignment.activityId}
                                        assignmentId={assignment.id}
                                        className="dashboard-accent-button inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold whitespace-nowrap active:scale-95 sm:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                                        aria-label={`${isCompleted ? 'Review' : ctaLabel} ${displayTitle}`}
                                        style={{
                                            '--dashboard-button-accent': categoryStyle.accent,
                                            '--dashboard-button-text': categoryStyle.text,
                                        } as React.CSSProperties}
                                    >
                                        {isCompleted ? 'Review' : ctaLabel}
                                    </ActivityLink>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
