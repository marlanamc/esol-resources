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
    LayoutGrid,
    PenLine,
    Rows3,
    Sparkles,
    Volume2,
} from 'lucide-react';
import { ActivityLink } from '@/components/navigation/ActivityLink';
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
    title?: string;
    ctaLabel?: string;
    variant?: 'cards' | 'checklist';
    actions?: React.ReactNode;
    refreshOnMount?: boolean;
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
    const offsetToMonday = day === 0 ? -6 : 1 - day;
    weekStart.setDate(weekStart.getDate() + offsetToMonday);
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

function ChecklistAssignments({
    assignments,
    actions,
    resolvedTitle,
    weeklyRangeLabel,
}: {
    assignments: FeaturedAssignment[];
    actions?: React.ReactNode;
    resolvedTitle: string | null;
    weeklyRangeLabel: string | null;
}) {
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [mobileViewMode, setMobileViewMode] = useState<'grouped' | 'condensed'>('grouped');

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

    const taskRows = resumeRow
        ? sortedRows.filter((row) => row.assignment.id !== resumeRow.assignment.id)
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

    const renderChecklistRow = (
        row: NormalizedChecklistRow,
        isGameGroup = false,
        categoryStyle: CategoryStyle,
        showCategoryChip?: CategoryStyle
    ) => (
        <div
            key={row.assignment.id}
            className={`relative group/row pl-3 pr-2 py-2.5 sm:px-4 flex flex-col gap-1 sm:gap-0 transition-colors duration-200 border-b border-border/10 last:border-0 ${row.isCompleted ? 'opacity-75' : ''}`}
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
                    {showCategoryChip && (
                        <div className="mt-1">
                            <span
                                className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
                                style={{ backgroundColor: showCategoryChip.bg, color: showCategoryChip.text }}
                            >
                                {showCategoryChip.label}
                            </span>
                        </div>
                    )}
                </div>

                <div className="shrink-0 pl-1">
                    <ActivityLink
                        activityId={row.assignment.activityId}
                        assignmentId={row.assignment.id}
                        href={row.assignment.href}
                        className="inline-flex items-center justify-center !min-h-0 min-w-[82px] sm:min-w-[92px] h-9 sm:h-10 px-3 sm:px-4 text-[13px] sm:text-sm font-semibold tracking-tight transition-[color,background-color,border-color,transform,box-shadow] duration-200 rounded-full whitespace-nowrap active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                        style={isGameGroup ? {
                            color: categoryStyle.text,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderColor: categoryStyle.accent,
                            backgroundColor: categoryStyle.bg,
                        } : row.isCompleted ? {
                            color: categoryStyle.text,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderColor: categoryStyle.accent,
                            backgroundColor: categoryStyle.bg,
                        } : {
                            color: 'var(--text-on-accent)',
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderColor: categoryStyle.accent,
                            backgroundColor: categoryStyle.accent,
                            boxShadow: '0 1px 3px rgba(13, 22, 32, 0.18)',
                        }}
                        aria-label={`${row.actionLabel} ${row.displayTitle}`}
                    >
                        <span>{row.actionLabel}</span>
                    </ActivityLink>
                </div>
            </div>

            <div className="min-w-0 flex flex-col gap-0.5 pl-8">
                <div className="flex flex-wrap items-center gap-2">
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
                    <div className="mt-1.5">
                        <CompactVocabTracker vocabProgress={row.vocabProgress} />
                    </div>
                ) : !row.isCompleted && row.progressValue > 0 ? (
                    <div className="mt-1.5">
                        <div className="h-1.5 w-24 max-w-full rounded-full overflow-hidden border" style={{ backgroundColor: 'var(--surface-subtle)', borderColor: 'var(--border-subtle)' }}>
                            <div
                                className="h-full rounded-full transition-[width] duration-300"
                                style={{ width: `${row.progressValue}%`, backgroundColor: categoryStyle.accent }}
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );

    const renderCondensedRow = (row: NormalizedChecklistRow) => {
        const rowIcon = getRowGlyph(row, 'w-5 h-5');
        const vocabType = getVocabActivityType(row.assignment.activityId);
        const vocabChip = vocabType ? VOCAB_CHIP_CONFIG[vocabType] : null;
        const showProgressSummary = !row.vocabProgress && !row.isCompleted && Boolean(row.progressSummary);

        return (
            <div
                key={row.assignment.id}
                className={`relative overflow-hidden rounded-[26px] border px-4 py-[11px] ${row.isCompleted ? 'opacity-75' : ''}`}
                style={{
                    borderColor: row.isCompleted
                        ? 'rgba(127, 179, 213, 0.08)'
                        : 'color-mix(in srgb, var(--border-subtle) 72%, transparent)',
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--surface-elevated) 94%, transparent) 0%, color-mix(in srgb, var(--surface-overlay) 92%, transparent) 100%)',
                    boxShadow: row.isCompleted
                        ? '0 8px 18px rgba(4, 10, 18, 0.11)'
                        : '0 10px 22px rgba(4, 10, 18, 0.14)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                }}
            >
                <div className="pointer-events-none absolute inset-y-2 right-6 w-16 opacity-18 blur-3xl" style={{ background: row.categoryStyle.accent }} />
                <div className="relative flex items-center gap-3">
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
                        style={row.isCompleted ? {
                            backgroundColor: 'color-mix(in srgb, var(--tone-grammar-chip-bg) 55%, transparent)',
                            borderColor: 'color-mix(in srgb, var(--tone-grammar-border) 60%, transparent)',
                            color: 'var(--tone-grammar-accent)',
                        } : {
                            backgroundColor: 'color-mix(in srgb, var(--surface-overlay) 72%, transparent)',
                            borderColor: 'color-mix(in srgb, var(--border-subtle) 60%, transparent)',
                            color: row.categoryStyle.accent,
                        }}
                    >
                        {rowIcon}
                    </div>

                    <div className="min-w-0 flex-1 py-1">
                        <h3 className="truncate text-[15px] leading-snug font-semibold text-text">
                            {row.displayTitle}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span
                                className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide"
                                style={{
                                    backgroundColor: 'color-mix(in srgb, var(--surface-base) 88%, transparent)',
                                    color: row.categoryStyle.text,
                                }}
                            >
                                {row.categoryStyle.label}
                            </span>
                            {vocabChip && (
                                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${vocabChip.className.replace('rounded-md', 'rounded-full').replace('px-2', 'px-2').replace('py-0.5', 'py-0.5')}`}>
                                    {vocabChip.label}
                                </span>
                            )}
                            {row.isNew && (
                                <span className={`${FEATURED_NEW_BADGE_CLASS_NAME} px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide opacity-80`} style={{ backgroundColor: 'var(--tone-speaking-chip-bg)', borderColor: 'var(--tone-speaking-border)', color: 'var(--tone-speaking-chip-text)' }}>
                                    <Sparkles className="h-2.5 w-2.5 text-amber-700" aria-hidden />
                                    New
                                </span>
                            )}
                        </div>

                        {row.vocabProgress && row.vocabProgress.completed < row.vocabProgress.total ? (
                            <div className="mt-2.5">
                                <CompactVocabTracker vocabProgress={row.vocabProgress} />
                            </div>
                        ) : (
                            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-text-muted/85">
                                {!row.isCompleted && row.dueMeta ? <DueBadge dueMeta={row.dueMeta} /> : null}
                                {showProgressSummary ? (
                                    <span className="font-medium text-text-muted">{row.progressSummary}</span>
                                ) : null}
                                {row.isCompleted ? (
                                    <span className="font-medium text-text-muted">Completed</span>
                                ) : null}
                            </div>
                        )}
                    </div>

                    <ActivityLink
                        activityId={row.assignment.activityId}
                        assignmentId={row.assignment.id}
                        href={row.assignment.href}
                        className="shrink-0 inline-flex min-h-[38px] items-center gap-2 rounded-full border px-5 py-1.5 text-[15px] font-semibold transition-[transform,background-color,border-color,color,box-shadow] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={row.isCompleted || row.isGameRow ? {
                            backgroundColor: 'color-mix(in srgb, var(--surface-base) 42%, transparent)',
                            borderColor: 'color-mix(in srgb, var(--border-subtle) 48%, transparent)',
                            color: row.categoryStyle.text,
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 10px rgba(4, 10, 18, 0.06)',
                        } : {
                            backgroundColor: 'color-mix(in srgb, var(--surface-base) 32%, transparent)',
                            borderColor: 'color-mix(in srgb, var(--border-subtle) 34%, transparent)',
                            color: row.categoryStyle.accent,
                            boxShadow: `inset 0 1px 0 color-mix(in srgb, ${row.categoryStyle.accent} 18%, white), 0 6px 14px rgba(4, 10, 18, 0.08)`,
                        }}
                        aria-label={`${row.actionLabel} ${row.displayTitle}`}
                    >
                        <span>{row.actionLabel}</span>
                        <ArrowRight className="w-4 h-4" />
                    </ActivityLink>
                </div>
            </div>
        );
    };

    const renderResumeCard = (row: NormalizedChecklistRow) => (
        <div
            className="relative overflow-hidden rounded-[30px] border px-4 py-4"
            style={{
                borderColor: row.categoryStyle.border,
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--surface-elevated) 96%, transparent) 0%, color-mix(in srgb, var(--surface-overlay) 94%, transparent) 100%)',
                boxShadow: '0 14px 28px rgba(4, 10, 18, 0.22)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
            }}
        >
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 rounded-full" style={{ background: `linear-gradient(180deg, ${row.categoryStyle.accent} 0%, rgba(255,255,255,0.28) 100%)` }} />
            <div className="pointer-events-none absolute -right-6 top-3 h-20 w-20 rounded-full opacity-45 blur-3xl" style={{ background: row.categoryStyle.accent }} />

            <div className="relative flex items-center gap-3">
                <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
                    style={{ backgroundColor: row.categoryStyle.bg, borderColor: row.categoryStyle.border, color: row.categoryStyle.accent }}
                >
                    {getRowGlyph(row, 'w-5 h-5')}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">Resume</span>
                        {row.isNew && (
                            <span className={`${FEATURED_NEW_BADGE_CLASS_NAME} px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide`} style={{ backgroundColor: 'var(--tone-speaking-chip-bg)', borderColor: 'var(--tone-speaking-border)', color: 'var(--tone-speaking-chip-text)' }}>
                                <Sparkles className="h-2.5 w-2.5 text-amber-700" aria-hidden />
                                New
                            </span>
                        )}
                    </div>

                    <h3 className="mt-1 text-[15px] leading-snug font-display font-bold text-text">
                        {row.displayTitle}
                    </h3>

                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] text-text-muted">
                        <span
                            className="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                            style={{ backgroundColor: 'color-mix(in srgb, var(--surface-base) 88%, transparent)', color: row.categoryStyle.text }}
                        >
                            {row.categoryStyle.label}
                        </span>
                        {!row.vocabProgress && row.progressSummary ? <span>{row.progressSummary}</span> : null}
                        {!row.isCompleted && row.dueMeta ? <DueBadge dueMeta={row.dueMeta} /> : null}
                    </div>

                    {row.vocabProgress && row.vocabProgress.completed < row.vocabProgress.total ? (
                        <div className="mt-2">
                            <CompactVocabTracker vocabProgress={row.vocabProgress} />
                        </div>
                    ) : !row.isCompleted && row.progressValue > 0 ? (
                        <div className="mt-2 flex items-center gap-2">
                            <div className="h-1.5 w-28 max-w-full overflow-hidden rounded-full border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', borderColor: 'var(--border-subtle)' }}>
                                <div
                                    className="h-full rounded-full transition-[width] duration-300"
                                    style={{ width: `${row.progressValue}%`, backgroundColor: row.categoryStyle.accent }}
                                />
                            </div>
                            <span className="text-[12px] font-medium text-text-muted">{row.progressSummary}</span>
                        </div>
                    ) : null}
                </div>

                <ActivityLink
                    activityId={row.assignment.activityId}
                    assignmentId={row.assignment.id}
                    href={row.assignment.href}
                    className="shrink-0 inline-flex min-h-[38px] items-center gap-2 rounded-full border px-5 py-1.5 text-[15px] font-semibold transition-[transform,background-color,border-color,color,box-shadow] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                        backgroundColor: 'color-mix(in srgb, var(--surface-base) 30%, transparent)',
                        borderColor: 'color-mix(in srgb, var(--border-subtle) 34%, transparent)',
                        color: row.categoryStyle.accent,
                        boxShadow: `inset 0 1px 0 color-mix(in srgb, ${row.categoryStyle.accent} 18%, white), 0 6px 14px rgba(4, 10, 18, 0.08)`,
                    }}
                    aria-label={`Resume ${row.displayTitle}`}
                >
                    <span>Resume</span>
                    <ArrowRight className="w-4 h-4" />
                </ActivityLink>
            </div>
        </div>
    );

    return (
        <div className="mb-8">
            <div className={`rounded-3xl overflow-hidden border surface-elevated surface-card-shadow ${isFullyComplete ? 'ring-2 ring-[var(--tone-speaking-border)]' : ''}`} style={{ borderColor: isFullyComplete ? 'var(--tone-speaking-border)' : 'var(--border-subtle)' }}>
                <div className="px-4 py-3 border-b border-border/15 surface-elevated">
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${isFullyComplete ? 'border shadow-sm' : 'bg-primary/10 text-primary'}`} style={isFullyComplete ? { backgroundColor: 'var(--tone-speaking-chip-bg)', borderColor: 'var(--tone-speaking-border)' } : undefined}>
                                {isFullyComplete ? '🏆' : '📋'}
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
                        <div className="flex items-center gap-2 text-xs font-bold text-text/70">
                            {actions && <div className="mr-2">{actions}</div>}
                            <span className="hidden sm:inline-block px-2 py-1 rounded-md border tabular-nums" style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}>{completedCount}/{checklistRows.length} done</span>
                            <div className="lg:hidden inline-flex items-center rounded-full border p-0.5" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-subtle)' }}>
                                <button
                                    onClick={() => setMobileViewMode('grouped')}
                                    className={`!min-h-0 !min-w-0 px-2.5 py-1 rounded-full text-[11px] font-semibold leading-none transition-colors touch-manipulation ${
                                        mobileViewMode === 'grouped'
                                            ? 'bg-[var(--surface-base)] text-text shadow-sm border border-border/25'
                                            : 'text-text/65'
                                    }`}
                                    aria-label="Grouped view"
                                    title="Grouped view"
                                >
                                    <LayoutGrid className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setMobileViewMode('condensed')}
                                    className={`!min-h-0 !min-w-0 px-2.5 py-1 rounded-full text-[11px] font-semibold leading-none transition-colors touch-manipulation ${
                                        mobileViewMode === 'condensed'
                                            ? 'bg-[var(--surface-base)] text-text shadow-sm border border-border/25'
                                            : 'text-text/65'
                                    }`}
                                    aria-label="Condensed view"
                                    title="Condensed view"
                                >
                                    <Rows3 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <div className="mb-1.5 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase text-text/55">
                                <span>Week Progress</span>
                                <span>{completedCount} of {checklistRows.length} finished</span>
                            </div>

                            <div className={`relative overflow-hidden rounded-full border h-5 ${
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
                                    className="absolute inset-y-0 left-0 rounded-[999px] transition-[width] duration-700 ease-out"
                                    style={{
                                        width: `${percent}%`,
                                        background: isFullyComplete
                                            ? 'linear-gradient(90deg, #b86a56 0%, #d49a7e 45%, #f0c987 100%)'
                                            : 'linear-gradient(90deg, #b86a56 0%, #d0877a 45%, #e3b45f 100%)',
                                        boxShadow: isFullyComplete
                                            ? '0 0 18px rgba(184,106,86,0.34), inset 0 1px 1px rgba(255,255,255,0.32)'
                                            : '0 0 12px rgba(208,135,122,0.2), inset 0 1px 1px rgba(255,255,255,0.24)',
                                    }}
                                />

                                <div
                                    className="absolute inset-y-[2px] left-2 rounded-full opacity-50"
                                    style={{
                                        width: `max(12%, min(${percent}%, calc(100% - 16px)))`,
                                        background: 'linear-gradient(90deg, rgba(255,255,255,0.45), rgba(255,255,255,0.06))',
                                    }}
                                />

                                <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                                    {[25, 50, 75].map((marker) => (
                                        <div
                                            key={marker}
                                            className="h-2.5 w-px rounded-full bg-white/70 shadow-[0_0_0_1px_rgba(138,91,61,0.08)]"
                                        />
                                    ))}
                                </div>

                                {percent > 0 && (
                                    <div
                                        className="absolute top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full border border-white/80 bg-white/95 text-[13px] shadow-[0_6px_14px_rgba(93,67,46,0.16)]"
                                        style={{ left: `clamp(14px, ${percent}%, calc(100% - 14px))` }}
                                    >
                                        {isFullyComplete ? '🏆' : percent >= 75 ? '🔥' : percent >= 40 ? '✨' : '🌱'}
                                    </div>
                                )}
                            </div>

                            <div className="mt-1.5 flex items-center justify-between text-[10px] sm:text-[11px] font-medium text-text-muted">
                                <span>Start</span>
                                <span>Momentum</span>
                                <span>Finish line</span>
                            </div>
                        </div>

                        <span
                            className={`shrink-0 px-3 py-1.5 rounded-full border text-[13px] font-bold leading-none tabular-nums shadow-sm ${
                                isFullyComplete
                                    ? 'bg-[#f8f3ec] border-[#d7c09a]/60 text-[#8a5b3d]'
                                    : 'bg-[linear-gradient(180deg,#fffdfa_0%,#f6efe6_100%)] border-[#dcccbc] text-[#8f5d4e]'
                            }`}
                        >
                            {percent}%
                        </span>
                    </div>
                </div>

                {mobileViewMode === 'condensed' && (
                    <div className="lg:hidden border-b border-border/5" style={{ backgroundColor: 'var(--surface-subtle)' }}>
                        <div className="flex items-center gap-2 px-3 py-2.5 overflow-x-auto no-scrollbar mask-edges">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`shrink-0 !min-h-0 !min-w-0 px-2.5 py-0.5 rounded-full text-[7.5px] font-bold uppercase leading-none transition-all duration-200 flex items-center gap-1 ${activeFilter === 'all' ? 'shadow-sm' : 'text-text/70 hover:shadow-sm'}`}
                                style={{ fontSize: '10px', WebkitTextSizeAdjust: '100%', backgroundColor: activeFilter === 'all' ? 'var(--surface-base)' : 'var(--surface-overlay)', color: activeFilter === 'all' ? 'var(--text-color)' : undefined, borderColor: activeFilter === 'all' ? 'var(--color-primary)' : 'var(--border-subtle)' }}
                            >
                                ALL
                                <span className={`px-1 py-0.5 rounded text-[7.5px] font-bold leading-none ${activeFilter === 'all' ? 'bg-white/20' : 'bg-black/5'}`}>
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
                                        className="shrink-0 !min-h-0 !min-w-0 px-2.5 py-0.5 rounded-full text-[7.5px] font-bold uppercase leading-none transition-all duration-200 border flex items-center gap-1.5"
                                        style={{
                                            fontSize: '10px',
                                            WebkitTextSizeAdjust: '100%',
                                            backgroundColor: isActive ? groupStyle.accent : 'var(--surface-overlay)',
                                            color: isActive ? 'var(--text-on-accent)' : groupStyle.text,
                                            borderColor: isActive ? groupStyle.accent : 'var(--border-subtle)',
                                        }}
                                    >
                                        <span className={`[&>svg]:w-3 [&>svg]:h-3 [&>svg]:stroke-[2.5px] ${isActive ? 'text-white/90' : 'opacity-70'}`}>
                                            {group.renderIcon('w-3 h-3')}
                                        </span>
                                        {group.label}
                                        <span className={`ml-0.5 px-1 py-0.5 rounded text-[7.5px] font-bold leading-none ${isActive ? 'bg-white/20' : 'bg-black/5'}`}>
                                            {group.items.length}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {mobileViewMode === 'condensed' && (
                    <div className="lg:hidden px-3 py-3 space-y-3" style={{ backgroundColor: 'var(--surface-subtle)' }}>
                        {resumeRow ? renderResumeCard(resumeRow) : null}

                <section className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <div>
                                    <h3 className="text-[15px] font-semibold text-text">Your tasks</h3>
                                </div>
                                <Link
                                    href="/dashboard/activities"
                                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--tone-vocabulary-chip-text)]"
                                >
                                    <span>See all ({taskRows.length})</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            {filteredTaskRows.length > 0 ? (
                                <div className="space-y-3">
                                    {filteredTaskRows.map(renderCondensedRow)}
                                </div>
                            ) : (
                                <div className="rounded-[28px] border px-4 py-8 text-center" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'rgba(10, 20, 30, 0.88)' }}>
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-2xl">
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
                        </section>
                    </div>
                )}

                <div className={`${mobileViewMode === 'grouped' ? 'block' : 'hidden'} lg:block p-2.5 sm:p-4`} style={{ backgroundColor: 'var(--surface-base)' }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:auto-rows-fr">
                        {groups.map((group) => {
                            const groupStyle = getCategoryStyle(group.key);
                            return (
                                <div
                                    key={group.key}
                                    className="rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col group/card surface-card-shadow"
                                    style={{ backgroundColor: groupStyle.pastelBg || 'rgba(255,255,255,0.95)', borderColor: groupStyle.accent }}
                                >
                                    <div
                                        className="w-full px-3.5 py-2.5 flex items-center justify-between"
                                        style={{
                                            borderLeft: `5px solid ${groupStyle.accent}`,
                                            backgroundColor: groupStyle.bg,
                                        }}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span className="opacity-80" style={{ color: groupStyle.accent }}>{group.renderIcon('w-5 h-5')}</span>
                                            <Link
                                                href={`/dashboard/activities?category=${group.key === 'activity' ? 'games' : group.key}`}
                                                className="font-bold text-[15px] tracking-tight hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 rounded"
                                                style={{ color: groupStyle.text }}
                                            >
                                                {group.label}
                                            </Link>
                                            <span
                                                className="text-[11px] font-bold px-2 py-0.5 rounded-md tabular-nums"
                                                style={{ backgroundColor: `${groupStyle.accent}20`, color: groupStyle.text, border: `1px solid ${groupStyle.accent}30` }}
                                            >
                                                {group.isGameGroup ? `${group.items.length}` : `${group.doneInGroup}/${group.items.length}`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-border/10 flex-1">
                                        {group.items.map((row) => renderChecklistRow(row, group.isGameGroup, groupStyle))}
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
    title,
    ctaLabel = 'Start Activity',
    variant = 'cards',
    actions,
    refreshOnMount = false,
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
                <div className="surface-elevated rounded-3xl border surface-card-shadow overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="p-4 border-b border-border/30" style={{ background: 'linear-gradient(135deg, var(--surface-elevated) 0%, var(--surface-subtle) 100%)' }}>
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

                    <div className="divide-y divide-border/20">
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

    if (assignments.length === 0) {
        return (
            <div className="mb-8">
                <div className="surface-elevated rounded-3xl border surface-card-shadow overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="px-4 py-3 border-b border-border/10 surface-elevated flex items-center gap-3">
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
                actions={actions}
                resolvedTitle={resolvedTitle}
                weeklyRangeLabel={weeklyRangeLabel}
            />
        );
    }

    return (
        <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-text mb-4 flex items-center gap-3 leading-tight">
                <span className="w-1 h-6 rounded-full bg-primary"></span>
                {title}
            </h2>
            <div className="bg-gradient-to-br from-orange-50/40 via-amber-50/30 to-yellow-50/20 rounded-2xl p-4 sm:p-5 border border-orange-100/50 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
                                className="relative bg-white rounded-xl border border-border/20 hover:border-border/40 shadow-sm hover:shadow-md transition-[border-color,box-shadow] duration-200 overflow-hidden group"
                                style={{ animationDelay: `${index * 40}ms` }}
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
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-secondary rounded text-[10px] font-bold uppercase tracking-wide">
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
                                        className="inline-flex items-center justify-center px-4 py-2 min-h-11 text-sm font-semibold rounded-2xl border transition-[color,background-color,border-color,transform] duration-200 active:scale-95 whitespace-nowrap sm:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                                        aria-label={`${isCompleted ? 'Review' : ctaLabel} ${displayTitle}`}
                                        style={{
                                            color: categoryStyle.text,
                                            borderColor: `${categoryStyle.accent}90`,
                                            backgroundColor: `${categoryStyle.accent}08`,
                                        }}
                                        onMouseEnter={(event) => {
                                            event.currentTarget.style.borderColor = categoryStyle.accent;
                                            event.currentTarget.style.backgroundColor = `${categoryStyle.accent}15`;
                                        }}
                                        onMouseLeave={(event) => {
                                            event.currentTarget.style.borderColor = `${categoryStyle.accent}90`;
                                            event.currentTarget.style.backgroundColor = `${categoryStyle.accent}08`;
                                        }}
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
