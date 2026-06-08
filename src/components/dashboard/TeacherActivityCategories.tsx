'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getVocabActivityType, VOCAB_CHIP_CONFIG } from '@/lib/vocab-display';
import { logger } from '@/lib/logger';
import { parseActivityContent } from '@/types/activity';
import { buildGameLibrarySections, isCourseMapOnlyGame, isGamesLibraryActivity } from '@/lib/games-library';
import { displayTitle, vocabUnits } from '@/components/dashboard/activity-categories-vocab-utils';

interface Activity {
    id: string;
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    level: string | null;
    ui: string | null;
    content?: string;
    isReleased?: boolean;
}

interface SubSubCategory {
    name: string;
    activities: Activity[];
}

interface SubCategory {
    name: string;
    activities: Activity[];
    subCategories?: SubSubCategory[];
}

interface Category {
    name: string;
    color: string;
    subCategories?: SubCategory[];
    activities: Activity[];
}

interface TeacherActivityCategoriesProps {
    activities: Activity[];
    featuredActivityIds?: Set<string>;
    defaultClassId: string | null;
    activityAssignmentMap?: Record<string, string>;
}

interface ActivityCardProps {
    activity: Activity;
    isFeatured: boolean;
    isReleased: boolean;
    isQuiz: boolean;
    isSpeaking: boolean;
    isGrammarGuide: boolean;
    onRelease: (id: string, isReleased: boolean, isSpeaking: boolean, isGrammarGuide: boolean) => Promise<void>;
    onAssign: (activity: Activity) => Promise<void>;
    onUnassign: (id: string) => Promise<void>;
    assigningId: string | null;
    assignError: string | null;
    defaultClassId: string | null;
}

const parseTitleDateMs = (title?: string | null) => {
    if (!title) return null;
    const match = title.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})\s*:/);
    if (!match) return null;
    const month = Number(match[1]);
    const day = Number(match[2]);
    const year = 2000 + Number(match[3]);
    const dt = new Date(year, month - 1, day);
    if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) return null;
    return dt.getTime();
};

const compareByTitleDateAsc = (a: Activity, b: Activity) => {
    const aDate = parseTitleDateMs(a.title);
    const bDate = parseTitleDateMs(b.title);
    if (aDate !== null && bDate !== null) return aDate - bDate;
    if (aDate !== null) return -1;
    if (bDate !== null) return 1;
    return (a.title || '').localeCompare(b.title || '');
};

const parseVerbQuizNum = (activity: Activity): number | null => {
    const title = activity.title || '';
    const match = title.match(/verb\s*quiz\s*(\d+)/i);
    if (match) return Number(match[1]);

    const content = parseActivityContent(activity.content || '{}');
    if (!content || typeof content !== 'object' || Array.isArray(content)) return null;

    const metadata = content as Record<string, unknown>;
    const contentType = typeof metadata.type === 'string' ? metadata.type : null;
    const weekValue = typeof metadata.week === 'string' ? metadata.week : null;

    if (contentType === 'verb-quiz' && weekValue) {
        const weekMatch = weekValue.match(/week\s*(\d+)/i);
        if (weekMatch) return Number(weekMatch[1]);
    }

    return null;
};

const parseWeekNumFromTitle = (title?: string | null): number | null => {
    if (!title) return null;
    const match = title.match(/Week\s*(\d+)/i);
    return match ? Number(match[1]) : null;
};

const ActivityCard = React.memo(function ActivityCard({
    activity,
    isFeatured,
    isReleased,
    isQuiz,
    isSpeaking,
    isGrammarGuide,
    onRelease,
    onAssign,
    onUnassign,
    assigningId,
    assignError,
    defaultClassId,
}: ActivityCardProps) {
    const [isReleasing, setIsReleasing] = React.useState(false);
    const vocabType = getVocabActivityType(activity.id);

    const handleRelease = async () => {
        setIsReleasing(true);
        try {
            await onRelease(activity.id, isReleased, isSpeaking, isGrammarGuide);
        } finally {
            setIsReleasing(false);
        }
    };

    return (
        <div
            className={`block bg-white rounded-lg p-4 hover:shadow-md transition-[box-shadow] duration-200 border group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${isFeatured ? 'border-accent/60 bg-accent/5' : 'border-border/40'
                }`}
        >
            {isFeatured && (
                <div className="absolute top-2 right-2">
                    <div className="px-2 py-1 rounded-full bg-accent text-text text-xs font-bold flex items-center gap-1">
                        <span>⭐</span>
                        <span>Featured</span>
                    </div>
                </div>
            )}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold group-hover:text-primary transition-colors truncate ${isFeatured ? 'text-accent' : 'text-text'
                        }`}>
                        {displayTitle(activity.title)}
                    </h4>
                    <p className="text-sm text-text-muted line-clamp-2 mt-1 mb-3">
                        {activity.description}
                    </p>
                    {vocabType ? (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            <Link
                                href={`/activity/${activity.id}`}
                                className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border transition-colors ${VOCAB_CHIP_CONFIG[vocabType].className}`}
                            >
                                {VOCAB_CHIP_CONFIG[vocabType].icon} {VOCAB_CHIP_CONFIG[vocabType].label}
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-secondary/10 text-[#3d6b47] dark:text-secondary text-xs font-bold rounded-full uppercase">
                                {activity.type}
                            </span>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Link
                            href={`/activity/${activity.id}`}
                            className="px-4 py-2 text-sm font-semibold transition-[transform,box-shadow] rounded-full border border-border/50 text-text bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                        >
                            Open
                        </Link>
                        {isFeatured ? (
                            <button
                                type="button"
                                onClick={() => onUnassign(activity.id)}
                                disabled={!defaultClassId || assigningId === activity.id}
                                className={`px-4 py-2 text-white text-sm font-semibold transition-[filter,transform,box-shadow] rounded-full shadow-sm inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${!defaultClassId
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-secondary hover:brightness-110 hover:shadow-md hover:-translate-y-0.5'
                                    } ${assigningId === activity.id ? 'opacity-70' : ''}`}
                            >
                                {assigningId === activity.id ? 'Unassigning...' : 'Unassign'}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onAssign(activity)}
                                disabled={!defaultClassId || assigningId === activity.id}
                                className={`px-4 py-2 text-white text-sm font-semibold transition-[filter,transform,box-shadow] rounded-full shadow-sm inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${!defaultClassId
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-primary hover:brightness-110 hover:shadow-md hover:-translate-y-0.5'
                                    } ${assigningId === activity.id ? 'opacity-70' : ''}`}
                            >
                                {assigningId === activity.id ? 'Assigning...' : 'Assign'}
                            </button>
                        )}
                        {(isQuiz || isSpeaking || isGrammarGuide) && (
                            <button
                                type="button"
                                onClick={handleRelease}
                                disabled={isReleasing}
                                className={`px-4 py-2 text-white text-sm font-semibold transition-[filter,transform,box-shadow] rounded-full shadow-sm inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${isReleased
                                        ? 'bg-gray-500 hover:bg-gray-600'
                                        : 'bg-terracotta hover:brightness-110'
                                    } hover:shadow-md hover:-translate-y-0.5 ${isReleasing ? 'opacity-70' : ''}`}
                                style={{
                                    backgroundColor: isReleased
                                        ? undefined
                                        : (isSpeaking ? '#e09f3e' : isGrammarGuide ? '#7ba884' : '#c86b51')
                                }}
                            >
                                {isReleasing
                                    ? 'Updating…'
                                    : isReleased
                                        ? (isSpeaking ? 'Hide' : isGrammarGuide ? 'Hide Guide' : 'Hide Quiz')
                                        : (isSpeaking ? 'Release' : isGrammarGuide ? 'Release Guide' : 'Release Quiz')
                                }
                            </button>
                        )}
                        {activity.type === 'writing' && (
                            <Link
                                href={`/dashboard/activities/${activity.id}/submissions`}
                                className="px-4 py-2 text-sm font-semibold transition-[transform,box-shadow] rounded-full border border-border/50 text-text bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                            >
                                View Submissions
                            </Link>
                        )}
                    </div>
                    {assignError && (
                        <p className="text-[11px] text-red-600 mt-2">{assignError}</p>
                    )}
                </div>
            </div>
        </div>
    );
});

export const TeacherActivityCategories = React.memo(function TeacherActivityCategories({
    activities,
    featuredActivityIds = new Set(),
    defaultClassId,
    activityAssignmentMap = {}
}: TeacherActivityCategoriesProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());
    const [featuredIds, setFeaturedIds] = useState<Set<string>>(new Set(featuredActivityIds));
    const [assignmentMap, setAssignmentMap] = useState<Record<string, string>>(activityAssignmentMap);
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [assignError, setAssignError] = useState<string | null>(null);
    const [grammarReleases, setGrammarReleases] = useState<Record<string, boolean>>({});
    const [visibleActivityCounts, setVisibleActivityCounts] = useState<Record<string, number>>({});
    const defaultVisibleCount = 24;

    // Stabilize handlers with useCallback
    const toggleCategory = useCallback((categoryName: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(categoryName)) next.delete(categoryName);
            else next.add(categoryName);
            return next;
        });
    }, []);

    const toggleSubCategory = useCallback((subCategoryKey: string) => {
        setExpandedSubCategories(prev => {
            const next = new Set(prev);
            if (next.has(subCategoryKey)) next.delete(subCategoryKey);
            else next.add(subCategoryKey);
            return next;
        });
    }, []);

    const getSubCategoryCount = useCallback((subCategory: SubCategory) => {
        const directCount = subCategory.activities?.length || 0;
        const nestedCount = subCategory.subCategories
            ? subCategory.subCategories.reduce((sum, sub) => sum + (sub.activities?.length || 0), 0)
            : 0;
        return directCount + nestedCount;
    }, []);

    const getCategoryCount = useCallback((category: Category) => {
        const directCount = category.activities?.length || 0;
        const nestedCount = category.subCategories
            ? category.subCategories.reduce((sum, sub) => sum + getSubCategoryCount(sub), 0)
            : 0;
        return directCount + nestedCount;
    }, [getSubCategoryCount]);

    const handleReleaseLocal = useCallback(async (activityId: string, isCurrentlyReleased: boolean, isSpeaking: boolean, isGrammarGuide: boolean) => {
        try {
            let apiEndpoint = '/api/quiz/release';
            if (isSpeaking) apiEndpoint = '/api/speaking/release';
            if (isGrammarGuide) apiEndpoint = '/api/grammar/release';

            const res = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    activityId,
                    released: !isCurrentlyReleased
                })
            });

            if (!res.ok) {
                throw new Error('Failed to update release status');
            }

            // Update local state for grammar guides
            if (isGrammarGuide) {
                setGrammarReleases(prev => ({
                    ...prev,
                    [activityId]: !isCurrentlyReleased
                }));
            } else {
                // Refresh the page for quiz/speaking
                window.location.reload();
            }
        } catch (error) {
            logger.error('Failed to update release status', error);
            const activityType = isSpeaking ? 'speaking activity' : isGrammarGuide ? 'grammar guide' : 'quiz';
            alert(`Failed to update ${activityType} release status`);
        }
    }, []);

    const handleAssignLocal = useCallback(async (activity: Activity) => {
        if (!defaultClassId || assigningId) return;
        setAssignError(null);
        setAssigningId(activity.id);
        try {
            const res = await fetch('/api/assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    classId: defaultClassId,
                    activityId: activity.id,
                    title: activity.title,
                    syncToSectionGroup: true,
                })
            });

            if (!res.ok) {
                const data = await res.json().catch((err) => {
                    logger.warn('Failed to parse API error response', { err });
                    return {};
                });
                throw new Error(data.error || 'Failed to assign activity');
            }

            const created = await res.json();

            // Mark as featured locally so the badge updates without a full refresh
            setFeaturedIds(prev => {
                const next = new Set(prev);
                next.add(activity.id);
                return next;
            });
            setAssignmentMap(prev => ({ ...prev, [activity.id]: created.id }));
        } catch (error: unknown) {
            setAssignError(error instanceof Error ? error.message : 'Failed to assign activity');
        } finally {
            setAssigningId(null);
        }
    }, [defaultClassId, assigningId]);

    const handleUnassignLocal = useCallback(async (activityId: string) => {
        const assignmentId = assignmentMap[activityId];
        if (!defaultClassId || !assignmentId || assigningId) return;
        setAssignError(null);
        setAssigningId(activityId);
        try {
            const res = await fetch('/api/assignments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignmentId,
                    isFeatured: false,
                    syncToSectionGroup: true,
                })
            });

            if (!res.ok) {
                const data = await res.json().catch((err) => {
                    logger.warn('Failed to parse API error response', { err });
                    return {};
                });
                throw new Error(data.error || 'Failed to unassign activity');
            }

            setFeaturedIds(prev => {
                const next = new Set(prev);
                next.delete(activityId);
                return next;
            });
        } catch (error: unknown) {
            setAssignError(error instanceof Error ? error.message : 'Failed to unassign activity');
        } finally {
            setAssigningId(null);
        }
    }, [defaultClassId, assignmentMap, assigningId]);


    const buildGrammarSubCategories = useCallback((): SubCategory[] => {
        const grammarActivities = activities.filter((a: Activity) => a.category === 'grammar');

        const normalizeTitle = (title?: string | null) => displayTitle(title || '').toLowerCase();

        const sortAlpha = (list: Activity[]) =>
            list.sort((a, b) => displayTitle(a.title || '').localeCompare(displayTitle(b.title || '')));

        const sortByTenseOrder = (list: Activity[]) => {
            const order = ['present', 'past', 'future', 'review'];
            const getOrder = (t: string) => {
                for (let i = 0; i < order.length; i++) {
                    if (t.includes(order[i])) return i;
                }
                return order.length;
            };

            return list.sort((a, b) => {
                const aNorm = normalizeTitle(a.title);
                const bNorm = normalizeTitle(b.title);
                const aIdx = getOrder(aNorm);
                const bIdx = getOrder(bNorm);
                if (aIdx !== bIdx) return aIdx - bIdx;
                return displayTitle(a.title || '').localeCompare(displayTitle(b.title || ''));
            });
        };

        const sortByKeywordOrder = (list: Activity[], keywordsInOrder: string[]) => {
            const getKeywordIndex = (t: string) => {
                for (let i = 0; i < keywordsInOrder.length; i++) {
                    if (t.includes(keywordsInOrder[i])) return i;
                }
                return keywordsInOrder.length;
            };

            return list.sort((a, b) => {
                const aNorm = normalizeTitle(a.title);
                const bNorm = normalizeTitle(b.title);
                const aIdx = getKeywordIndex(aNorm);
                const bIdx = getKeywordIndex(bNorm);
                if (aIdx !== bIdx) return aIdx - bIdx;
                return displayTitle(a.title || '').localeCompare(displayTitle(b.title || ''));
            });
        };

        const remaining = [...grammarActivities];
        const take = (predicate: (a: Activity) => boolean) => {
            const matched: Activity[] = [];
            for (let i = remaining.length - 1; i >= 0; i--) {
                const item = remaining[i];
                if (predicate(item)) {
                    matched.push(item);
                    remaining.splice(i, 1);
                }
            }
            return matched.reverse();
        };

        const simple = sortByTenseOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('simple') && !t.includes('vs');
            })
        );

        const perfectContinuous = sortByTenseOrder(take((a: Activity) => normalizeTitle(a.title).includes('perfect continuous')));

        const continuous = sortByTenseOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('continuous') && !t.includes('perfect continuous') && !t.includes('vs');
            })
        );

        const perfect = sortByTenseOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('perfect') && !t.includes('continuous') && !t.includes('vs');
            })
        );

        const mixedAllTenses = sortAlpha(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('tenses') || t.includes('review') || t.includes(' vs ');
            })
        );

        const tenseSubCategories: SubSubCategory[] = [
            { name: 'Simple', activities: simple },
            { name: 'Continuous', activities: continuous },
            { name: 'Perfect', activities: perfect },
            { name: 'Perfect Continuous', activities: perfectContinuous },
            { name: 'Reviews & Mixed', activities: mixedAllTenses },
        ];

        const questionsAndCommands = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('question') || t.includes('imperative') || t.includes('declarative');
            }),
            ['information questions', 'imperatives', 'declaratives']
        );

        const conditionals = sortAlpha(take((a: Activity) => normalizeTitle(a.title).includes('conditional')));
        const modals = sortAlpha(take((a: Activity) => normalizeTitle(a.title).includes('modal')));
        const habitsAndPreferences = sortAlpha(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('used to') || t.includes('would rather');
            })
        );

        const voiceAndReporting = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('passive') || t.includes('reported');
            }),
            ['passive', 'reported']
        );

        const gerundsAndInfinitives = sortByKeywordOrder(
            take((a: Activity) => {
                // Games appear in Games category only - exclude all game types
                if (a.type === 'game' || a.ui === 'gerund-infinitive') return false;
                const t = normalizeTitle(a.title);
                return t.includes('gerund') || t.includes('infinitive');
            }),
            ['infinitives vs gerunds', 'verbs + gerunds', 'gerunds after prepositions']
        );

        const phrasalVerbs = sortAlpha(take((a: Activity) => normalizeTitle(a.title).includes('phrasal')));

        const wordsAndQuantity = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('parts of speech') || t.includes('superlative') || t.includes('quantifier');
            }),
            ['parts of speech', 'superlatives', 'quantifiers']
        );

        const writingMechanics = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('punctuation') || t.includes('capitalization') || t.includes('paragraph');
            }),
            ['punctuation', 'capitalization', 'paragraph']
        );

        const otherGrammar = sortAlpha(remaining);

        return [
            {
                name: 'Tenses',
                activities: [],
                subCategories: tenseSubCategories
            },
            {
                name: 'Questions, Modals & Communication',
                activities: [
                    ...questionsAndCommands,
                    ...modals,
                    ...voiceAndReporting
                ].sort((a: Activity, b: Activity) => displayTitle(a.title || '').localeCompare(displayTitle(b.title || '')))
            },
            {
                name: 'Gerunds & Infinitives',
                activities: gerundsAndInfinitives
            },
            {
                name: 'Verbs & Patterns',
                activities: [
                    ...phrasalVerbs,
                    ...habitsAndPreferences
                ].sort((a: Activity, b: Activity) => displayTitle(a.title || '').localeCompare(displayTitle(b.title || '')))
            },
            {
                name: 'Conditionals',
                activities: sortByKeywordOrder(conditionals, ['zero', 'first', 'second', 'third'])
            },
            {
                name: 'Describing & Comparing',
                activities: wordsAndQuantity.sort((a: Activity, b: Activity) => displayTitle(a.title || '').localeCompare(displayTitle(b.title || '')))
            },
            {
                name: 'Writing Basics',
                activities: [
                    ...writingMechanics,
                    ...otherGrammar
                ].sort((a: Activity, b: Activity) => displayTitle(a.title || '').localeCompare(displayTitle(b.title || '')))
            },
        ];
    }, [activities]);

    const activityIndex = useMemo(() => {
        const vocabById = new Map<string, Activity>();
        const games: Activity[] = [];
        const courseMapGames: Activity[] = [];
        const reading: Activity[] = [];
        const writing: Activity[] = [];
        const pronunciation: Activity[] = [];
        const speaking: Activity[] = [];
        const quizzes: Activity[] = [];

        for (const activity of activities) {
            const category = (activity.category || '').toLowerCase();

            if (activity.id.startsWith('vocab-')) {
                vocabById.set(activity.id, activity);
            }

            if (isCourseMapOnlyGame(activity)) {
                courseMapGames.push(activity);
            } else if (isGamesLibraryActivity(activity)) {
                games.push(activity);
            }

            if (category === 'reading' || category === 'writing-reading') {
                reading.push(activity);
            }

            if (category === 'writing' || category === 'writing-reading') {
                writing.push(activity);
            }

            if (
                category === 'pronunciation' ||
                activity.ui === 'ed-pronunciation' ||
                activity.ui === 'minimal-pairs' ||
                activity.ui === 'pronunciation-listening'
            ) {
                pronunciation.push(activity);
            }

            if (category === 'speaking') {
                speaking.push(activity);
            }

            if (category === 'quizzes') {
                quizzes.push(activity);
            }
        }

        return {
            vocabById,
            games,
            courseMapGames,
            reading,
            writing,
            pronunciation,
            speaking: [...speaking].sort(compareByTitleDateAsc),
            quizzes: [...quizzes].sort((a, b) => {
                const aVerb = parseVerbQuizNum(a);
                const bVerb = parseVerbQuizNum(b);
                if (aVerb !== null && bVerb !== null) return aVerb - bVerb;
                if (aVerb !== null) return -1;
                if (bVerb !== null) return 1;

                const aWeek = parseWeekNumFromTitle(a.title) ?? 999;
                const bWeek = parseWeekNumFromTitle(b.title) ?? 999;
                if (aWeek !== bWeek) return aWeek - bWeek;
                return (a.title || '').localeCompare(b.title || '');
            }),
        };
    }, [activities]);

    const buildGameSubCategories = useCallback((): SubCategory[] => {
        const sections = buildGameLibrarySections(activityIndex.games, (title) => displayTitle(title || ''));
        if (activityIndex.courseMapGames.length > 0) {
            sections.push({
                name: 'Course Map',
                activities: [...activityIndex.courseMapGames].sort((a, b) =>
                    displayTitle(a.title || '').localeCompare(displayTitle(b.title || ''))
                ),
            });
        }
        return sections;
    }, [activityIndex.courseMapGames, activityIndex.games]);

    const collectCategoryActivityIds = useCallback((categoryList: Category[]) => {
        const ids = new Set<string>();

        const collectActivities = (list: Activity[]) => {
            for (const activity of list) {
                ids.add(activity.id);
            }
        };

        for (const category of categoryList) {
            collectActivities(category.activities);
            for (const subCategory of category.subCategories ?? []) {
                collectActivities(subCategory.activities);
                for (const subSubCategory of subCategory.subCategories ?? []) {
                    collectActivities(subSubCategory.activities);
                }
            }
        }

        return ids;
    }, []);

    // Organize activities by top-level categories with subcategories
    const categories = useMemo((): Category[] => {
        const baseCategories: Category[] = [
            {
                name: 'Vocabulary',
                color: '#f4a261', // warm orange
                subCategories: [
                    {
                        name: 'Daily Review',
                        activities: [activityIndex.vocabById.get('vocab-daily-review')].filter(
                            (activity): activity is Activity => Boolean(activity)
                        ),
                    },
                    ...vocabUnits.map((unit) => ({
                        name: unit.label,
                        activities: [],
                        subCategories: unit.weeks.map((week) => ({
                            name: week.label,
                            activities: [activityIndex.vocabById.get(`vocab-${week.id}`)].filter(
                                (activity): activity is Activity => Boolean(activity)
                            ),
                        })),
                    })),
                ],
                activities: [],
            },
            {
                name: 'Grammar',
                color: '#e76f51', // coral/terracotta
                subCategories: buildGrammarSubCategories(),
                activities: [],
            },
            {
                name: 'Games',
                color: '#f97316', // orange
                subCategories: buildGameSubCategories(),
                activities: [],
            },
            {
                name: 'Reading',
                color: '#2a9d8f', // teal
                activities: activityIndex.reading,
            },
            {
                name: 'Writing',
                color: '#7ba884', // sage green
                activities: activityIndex.writing,
            },
            {
                name: 'Pronunciation',
                color: '#6a4c93', // purple
                activities: activityIndex.pronunciation,
            },
            {
                name: 'Speaking',
                color: '#e09f3e', // gold/amber
                activities: activityIndex.speaking,
            },
            {
                name: 'Quizzes',
                color: '#c86b51', // terracotta
                activities: activityIndex.quizzes,
            },
        ];

        const placedIds = collectCategoryActivityIds(baseCategories);
        const uncategorized = activities
            .filter((activity) => !placedIds.has(activity.id))
            .sort((a, b) => displayTitle(a.title || '').localeCompare(displayTitle(b.title || '')));

        if (uncategorized.length > 0) {
            baseCategories.push({
                name: 'Other',
                color: '#64748b',
                activities: uncategorized,
            });
        }

        return baseCategories;
    }, [activities, activityIndex, buildGrammarSubCategories, buildGameSubCategories, collectCategoryActivityIds]);

    const renderActivityCard = useCallback((activity: Activity) => {
        const isGrammarGuide = activity.type === 'guide' && activity.category === 'grammar';
        const isSpeaking = activity.type === 'speaking';
        const isQuiz = !isGrammarGuide && !isSpeaking && (activity.type === 'quiz' || (activity.category ?? '').toLowerCase() === 'quizzes');
        const isReleased = isGrammarGuide
            ? (grammarReleases[activity.id] ?? activity.isReleased ?? false)
            : (activity.isReleased ?? false);

        return (
            <ActivityCard
                key={activity.id}
                activity={activity}
                isFeatured={featuredIds.has(activity.id)}
                isReleased={isReleased}
                isQuiz={isQuiz}
                isSpeaking={isSpeaking}
                isGrammarGuide={isGrammarGuide}
                onRelease={handleReleaseLocal}
                onAssign={handleAssignLocal}
                onUnassign={handleUnassignLocal}
                assigningId={assigningId}
                assignError={assignError}
                defaultClassId={defaultClassId}
            />
        );
    }, [
        grammarReleases,
        featuredIds,
        handleReleaseLocal,
        handleAssignLocal,
        handleUnassignLocal,
        assigningId,
        assignError,
        defaultClassId,
    ]);

    const renderChunkedActivities = useCallback(
        (listKey: string, activitiesList: Activity[], className: string) => {
            const visibleCount = visibleActivityCounts[listKey] ?? defaultVisibleCount;
            const visibleItems = activitiesList.slice(0, visibleCount);
            const hasMore = activitiesList.length > visibleCount;

            return (
                <div className={className}>
                    {visibleItems.map(renderActivityCard)}
                    {hasMore && (
                        <button
                            type="button"
                            onClick={() =>
                                setVisibleActivityCounts((prev) => ({
                                    ...prev,
                                    [listKey]: (prev[listKey] ?? defaultVisibleCount) + defaultVisibleCount,
                                }))
                            }
                            className="mt-2 px-4 py-2 text-sm font-semibold rounded-lg border border-border/50 bg-white hover:bg-bg-light transition-colors self-start"
                        >
                            Show more ({activitiesList.length - visibleCount} remaining)
                        </button>
                    )}
                </div>
            );
        },
        [renderActivityCard, visibleActivityCounts]
    );

    return (
        <div className="space-y-4">
            {categories.map((category, idx) => {
                const isExpanded = expandedCategories.has(category.name);
                const totalActivities = getCategoryCount(category);

                return (
                    <div
                        key={category.name}
                        className="bg-white rounded-xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-[box-shadow] duration-300"
                        style={{
                            borderColor: `${category.color}40`,
                            animationDelay: `${idx * 25}ms`
                        }}
                    >
                        <button
                            onClick={() => toggleCategory(category.name)}
                            className="w-full flex items-center justify-between p-5 hover:bg-bg-light/30 transition-colors group cursor-pointer touch-manipulation"
                            style={{
                                borderLeft: `4px solid ${category.color}`,
                                touchAction: 'manipulation'
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl font-bold font-display text-text group-hover:text-primary transition-colors pointer-events-none">
                                    {category.name}
                                </h3>
                                <span className="text-sm text-text-muted font-medium bg-bg-light px-3 py-1 rounded-full pointer-events-none">
                                    {totalActivities} {totalActivities === 1 ? 'activity' : 'activities'}
                                </span>
                            </div>
                            <svg
                                className={`w-6 h-6 text-text-muted transition-transform duration-300 pointer-events-none ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isExpanded && (
                            <div className="border-t border-border/30 bg-bg-light/20">
                                {category.subCategories ? (
                                    <div className="divide-y divide-border/20">
                                        {category.subCategories.map((subCategory) => {
                                            const subKey = `${category.name}-${subCategory.name}`;
                                            const isSubExpanded = expandedSubCategories.has(subKey);

                                            return (
                                                <div key={subKey}>
                                                    <button
                                                        onClick={() => toggleSubCategory(subKey)}
                                                        className="w-full flex items-center justify-between p-4 pl-8 hover:bg-white/50 transition-colors group cursor-pointer touch-manipulation"
                                                        style={{
                                                            touchAction: 'manipulation'
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-base font-semibold text-text group-hover:text-primary transition-colors pointer-events-none">
                                                                {subCategory.name}
                                                            </span>
                                                            <span className="text-xs text-text-muted font-medium bg-white px-2 py-1 rounded-full pointer-events-none">
                                                                {getSubCategoryCount(subCategory)}
                                                            </span>
                                                        </div>
                                                        <svg
                                                            className={`w-5 h-5 text-text-muted transition-transform duration-300 pointer-events-none ${isSubExpanded ? 'rotate-180' : ''}`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>

                                                    {isSubExpanded && (
                                                        subCategory.subCategories ? (
                                                            // Has sub-subcategories
                                                            <div className="divide-y divide-border/10">
                                                                {subCategory.subCategories.map((subSubCategory) => {
                                                                    const subSubKey = `${subKey}-${subSubCategory.name}`;
                                                                    const isSubSubExpanded = expandedSubCategories.has(subSubKey);

                                                                    return (
                                                                        <div key={subSubKey}>
                                                                            <button
                                                                                onClick={() => toggleSubCategory(subSubKey)}
                                                                                className="w-full flex items-center justify-between p-3 pl-16 hover:bg-white/30 transition-colors group cursor-pointer touch-manipulation"
                                                                                style={{
                                                                                    touchAction: 'manipulation'
                                                                                }}
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-sm font-medium text-text group-hover:text-primary transition-colors pointer-events-none">
                                                                                        {subSubCategory.name}
                                                                                    </span>
                                                                                    <span className="text-xs text-text-muted font-medium bg-white px-2 py-0.5 rounded-full pointer-events-none">
                                                                                        {subSubCategory.activities.length}
                                                                                    </span>
                                                                                </div>
                                                                                <svg
                                                                                    className={`w-4 h-4 text-text-muted transition-transform duration-300 pointer-events-none ${isSubSubExpanded ? 'rotate-180' : ''}`}
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    viewBox="0 0 24 24"
                                                                                >
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                                </svg>
                                                                            </button>

                                                                            {isSubSubExpanded && subSubCategory.activities.length > 0 && (
                                                                                renderChunkedActivities(
                                                                                    subSubKey,
                                                                                    subSubCategory.activities,
                                                                                    "pl-20 pr-4 pb-3 space-y-2"
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : subCategory.activities.length > 0 && (
                                                            // No sub-subcategories - show activities directly
                                                            renderChunkedActivities(
                                                                subKey,
                                                                subCategory.activities,
                                                                "pl-12 pr-4 pb-4 space-y-2"
                                                            )
                                                        )
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-4 space-y-2">
                                        {category.activities.length > 0 ? (
                                            renderChunkedActivities(
                                                `category-${category.name}`,
                                                category.activities,
                                                "space-y-2"
                                            )
                                        ) : (
                                            <p className="text-text-muted text-center py-4 text-sm">No activities yet</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
});
