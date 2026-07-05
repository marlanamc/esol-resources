'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  vocabUnits,
  displayTitle,
  getVocabUnitNumberFromActivity,
  getVocabLevelBadgeLabel,
  getVocabThemeChip,
} from './activity-categories-vocab-utils';
import { getVocabActivityType } from '@/lib/vocab/display';
import { resolveActivityGameUi, getActivityPoints } from '@/lib/gamification/activity-points';
import { getGameEmojiForActivity } from '@/lib/game-emoji';
import { ActivityLink } from '@/components/navigation/ActivityLink';
import { GrammarGuideVisual, hasGrammarGuideVisual } from './GrammarGuideVisual';
import { VocabActivityVisual } from './VocabActivityVisual';
import { GameActivityVisual, getGameCardCopy } from './GameActivityVisual';
import { PronunciationActivityVisual, getPronunciationCardCopy } from './PronunciationActivityVisual';
import { comparePronunciationActivities } from '@/lib/pronunciation-activity';
import { getSubcategorySubtitle } from '@/lib/subcategory-labels';
import { buildGameLibrarySections, isGamesLibraryActivity } from '@/lib/games-library';
import type {
  Activity,
  ActivityCardMeta,
  ActivityCategoriesProps,
  Category,
  SubCategory,
} from './activity-categories-types';
import {
  capitalizeFirstLetter,
  compareByTitleDateDesc,
  getActivityCardTitle,
  getCategoryCount,
  getDisplayProgress,
  getGrammarChipCopy,
  getGrammarChipCopyForActivity,
  getSubCategoryCount,
  getVerbQuizWordsChip,
  getVocabWordsChip,
  isActivityCompleted,
} from './activity-categories-helpers';
import {
  getActivityTexture,
  getActivityTextureForCard,
  getSectionTexture,
} from './activity-categories-textures';
import { ActivityCard, DesktopCarousel, getCategoryProgressText } from './ActivityCategoriesCard';

export const ActivityCategories = React.memo(function ActivityCategories({
    activities,
    completedActivityIds = new Set(),
    completedActivityTitles = new Set(),
    progressMap,
    showEmpty = false,
    filterCategory
}: ActivityCategoriesProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());
    const [showDetailChips, setShowDetailChips] = useState(false);

    useEffect(() => {
        let cancelled = false;
        let idleId: number | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            idleId = window.requestIdleCallback(() => {
                if (!cancelled) setShowDetailChips(true);
            }, { timeout: 300 });
        } else {
            timeoutId = setTimeout(() => {
                if (!cancelled) setShowDetailChips(true);
            }, 120);
        }

        return () => {
            cancelled = true;
            if (typeof window !== 'undefined' && 'cancelIdleCallback' in window && idleId !== undefined) {
                window.cancelIdleCallback(idleId);
            }
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

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

    const buildGrammarSubCategories = useCallback((): SubCategory[] => {
        const grammarActivities = activities.filter((a: Activity) => a.category === "grammar");

        const normalizeTitle = (title?: string | null) => displayTitle(title || "").toLowerCase();

        const sortAlpha = (list: Activity[]) =>
            list.sort((a, b) => displayTitle(a.title || "").localeCompare(displayTitle(b.title || "")));

        const sortByTenseOrder = (list: Activity[]) => {
            const order = ["present", "past", "future", "review"];
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
                return displayTitle(a.title || "").localeCompare(displayTitle(b.title || ""));
            });
        };

        const sortByKeywordOrder = (list: Activity[], keywordsInOrder: string[]) => {
            const getKeywordIndex = (t: string) => {
                for (let i = 0; i < keywordsInOrder.length; i++) {
                    if (t.includes(keywordsInOrder[i])) return i;
                }
                return keywordsInOrder.length;
            };

            return list.sort((a: Activity, b: Activity) => {
                const aNorm = normalizeTitle(a.title);
                const bNorm = normalizeTitle(b.title);
                const aIdx = getKeywordIndex(aNorm);
                const bIdx = getKeywordIndex(bNorm);
                if (aIdx !== bIdx) return aIdx - bIdx;
                return displayTitle(a.title || "").localeCompare(displayTitle(b.title || ""));
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
                return t.includes("simple") && !t.includes("vs");
            })
        );

        const perfectContinuous = sortByTenseOrder(take((a: Activity) => normalizeTitle(a.title).includes("perfect continuous")));

        const continuous = sortByTenseOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("continuous") && !t.includes("perfect continuous") && !t.includes("vs");
            })
        );

        const perfect = sortByTenseOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("perfect") && !t.includes("continuous") && !t.includes("vs");
            })
        );

        const mixedAllTenses = sortAlpha(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                // Exclude gerund/infinitive activities from tenses
                if (t.includes("gerund") || t.includes("infinitive")) return false;
                return t.includes("tenses") || t.includes("review") || t.includes(" vs ");
            })
        );

        const questionsAndCommands = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("question") || t.includes("imperative") || t.includes("declarative");
            }),
            ["information questions", "imperatives", "declaratives"]
        );

        const conditionals = sortByKeywordOrder(
            take((a: Activity) => normalizeTitle(a.title).includes("conditional")),
            ["zero", "first", "second", "third"]
        );
        const modals = sortAlpha(take((a: Activity) => normalizeTitle(a.title).includes("modal")));
        const habitsAndPreferences = sortAlpha(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("used to") || t.includes("would rather");
            })
        );

        const voiceAndReporting = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("passive") || t.includes("reported");
            }),
            ["passive", "reported"]
        );

        const gerundsAndInfinitives = sortByKeywordOrder(
            take((a: Activity) => {
                if (a.type === "game") return false; // games appear in Games category only
                const t = normalizeTitle(a.title);
                return t.includes("gerund") || t.includes("infinitive");
            }),
            ["infinitives vs gerunds", "verbs + gerunds", "gerunds after prepositions"]
        );

        const phrasalVerbs = sortAlpha(take((a: Activity) => normalizeTitle(a.title).includes("phrasal")));

        const wordsAndQuantity = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("parts of speech") || t.includes("superlative") || t.includes("quantifier");
            }),
            ["parts of speech", "superlatives", "quantifiers"]
        );

        const writingMechanics = sortByKeywordOrder(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes("punctuation") || t.includes("capitalization") || t.includes("paragraph");
            }),
            ["punctuation", "capitalization", "paragraph"]
        );

        const otherGrammar = sortAlpha(remaining);

        return [
            {
                name: "Tenses",
                activities: [],
                subCategories: [
                    { name: "Simple", activities: simple },
                    { name: "Continuous", activities: continuous },
                    { name: "Perfect", activities: perfect },
                    { name: "Perfect Continuous", activities: perfectContinuous },
                    { name: "Reviews & Mixed", activities: mixedAllTenses },
                ]
            },
            {
                name: "Questions, Modals & Communication",
                activities: [
                    ...questionsAndCommands,
                    ...modals,
                    ...voiceAndReporting
                ].sort((a: Activity, b: Activity) => displayTitle(a.title || "").localeCompare(displayTitle(b.title || "")))
            },
            {
                name: "Gerunds & Infinitives",
                activities: gerundsAndInfinitives
            },
            {
                name: "Verbs & Patterns",
                activities: [
                    ...phrasalVerbs,
                    ...habitsAndPreferences
                ].sort((a: Activity, b: Activity) => displayTitle(a.title || "").localeCompare(displayTitle(b.title || "")))
            },
            {
                name: "Conditionals",
                activities: conditionals
            },
            {
                name: "Describing & Comparing",
                activities: wordsAndQuantity.sort((a: Activity, b: Activity) => displayTitle(a.title || "").localeCompare(displayTitle(b.title || "")))
            },
            {
                name: "Writing Basics",
                activities: [
                    ...writingMechanics,
                    ...otherGrammar
                ].sort((a: Activity, b: Activity) => displayTitle(a.title || "").localeCompare(displayTitle(b.title || "")))
            },
        ];
    }, [activities]);

    const activityIndex = useMemo(() => {
        const vocabById = new Map<string, Activity>();
        const games: Activity[] = [];
        const reading: Activity[] = [];
        const writing: Activity[] = [];
        const pronunciation: Activity[] = [];
        const speaking: Activity[] = [];
        const quizzes: Activity[] = [];

        for (const activity of activities) {
            const category = (activity.category || '').toLowerCase();
            const isVocab = activity.id?.startsWith('vocab-');

            if (isVocab) {
                vocabById.set(activity.id, activity);
            }

            if (isGamesLibraryActivity(activity)) {
                games.push(activity);
            }

            if (category === 'reading' || category === 'writing-reading') {
                reading.push(activity);
            }

            if (category === 'writing' || category === 'writing-reading') {
                writing.push(activity);
            }

            if (category === 'pronunciation' || activity.ui === 'ed-pronunciation' || activity.ui === 'minimal-pairs' || activity.ui === 'pronunciation-listening') {
                pronunciation.push(activity);
            }

            if (category === 'speaking' && activity.isReleased !== false) {
                speaking.push(activity);
            }

            if (category === 'quizzes' && activity.isReleased !== false) {
                quizzes.push(activity);
            }
        }

        const sortedGames = [...games].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        const sortedSpeaking = [...speaking].sort(compareByTitleDateDesc);
        const sortedQuizzes = [...quizzes].sort((a, b) => {
            const getWeekNum = (title: string) => {
                const match = title.match(/Week (\d+)/);
                return match ? parseInt(match[1]) : 999;
            };
            return getWeekNum(a.title || '') - getWeekNum(b.title || '');
        });

        const sortedPronunciation = [...pronunciation].sort(comparePronunciationActivities);

        return {
            vocabById,
            games: sortedGames,
            reading,
            writing,
            pronunciation: sortedPronunciation,
            speaking: sortedSpeaking,
            quizzes: sortedQuizzes,
        };
    }, [activities]);

    const buildGameSubCategories = useCallback((): SubCategory[] => {
        return buildGameLibrarySections(activityIndex.games, (title) => displayTitle(title || ""));
    }, [activityIndex.games]);

    const categories = useMemo<Category[]>(() => [
            {
                name: 'Vocabulary',
                color: '#f4a261', // warm orange
                subCategories: [
                    {
                        name: 'Daily Review',
                        activities: [activityIndex.vocabById.get('vocab-daily-review')].filter((a): a is Activity => Boolean(a))
                    },
                    ...vocabUnits.map(unit => {
                        // Create a sub-category for each unit (1-10) with all week activities flattened.
                        // Units render empty until their underlying weekly activities are released.
                        const allUnitActivities = unit.weeks
                            .map((week) => activityIndex.vocabById.get(`vocab-${week.id}`))
                            .filter((activity): activity is Activity => Boolean(activity));
                        return {
                            name: unit.label,
                            activities: allUnitActivities
                        };
                    })
                ],
                activities: []
            },
            {
                name: 'Grammar',
                color: '#e76f51', // coral/terracotta
                subCategories: buildGrammarSubCategories(),
                activities: []
            },
            {
                name: 'Games',
                color: '#f97316', // orange
                subCategories: buildGameSubCategories(),
                activities: []
            },
            {
                name: 'Reading',
                color: '#2a9d8f', // teal
                activities: activityIndex.reading
            },
            {
                name: 'Writing',
                color: '#7ba884', // sage green
                activities: activityIndex.writing
            },
            {
                name: 'Pronunciation',
                color: '#ec4899', // pink
                activities: activityIndex.pronunciation
            },
            {
                name: 'Speaking',
                color: '#e09f3e', // gold/amber
                activities: activityIndex.speaking
            },
            {
                name: 'Quizzes',
                color: '#c86b51', // terracotta
                activities: activityIndex.quizzes
            }
        ], [activityIndex, buildGrammarSubCategories, buildGameSubCategories]);

    const filteredCategories = useMemo(() => {
        let result = categories;

        // When filtering to a single category, find it by name (case-insensitive)
        if (filterCategory) {
            result = result.filter(cat => cat.name.toLowerCase() === filterCategory.toLowerCase());
        }

        if (!showEmpty) {
            result = result
                .map(category => {
                    const filteredSubCategories = category.subCategories
                        ? category.subCategories
                            .map(sub => ({
                                ...sub,
                                subCategories: sub.subCategories
                                    ? sub.subCategories.filter(subSub => (subSub.activities?.length || 0) > 0)
                                    : undefined
                            }))
                            .filter(sub => getSubCategoryCount(sub) > 0)
                        : undefined;

                    return {
                        ...category,
                        subCategories: filteredSubCategories
                    };
                })
                .filter(cat => getCategoryCount(cat) > 0);
        }

        return result;
    }, [categories, showEmpty, filterCategory]);

    const activityCardMetaById = useMemo(() => {
        const metaById = new Map<string, ActivityCardMeta>();

        for (const activity of activities) {
            const progressValue = getDisplayProgress(activity, progressMap, completedActivityIds, completedActivityTitles);
            const isCompleted = !!isActivityCompleted(activity, completedActivityIds, progressMap, completedActivityTitles);
            const progressText = getCategoryProgressText(activity.id, progressMap);
            const vocabType = getVocabActivityType(activity.id);
            const vocabUnitNumber = activity.id.startsWith('vocab-') || activity.category?.toLowerCase() === 'vocabulary'
                ? getVocabUnitNumberFromActivity(activity)
                : null;
            const activityCardTitle = getActivityCardTitle(activity);
            const grammarChipCopy = activity.category === 'grammar'
                ? getGrammarChipCopy(activity.title)
                : null;
            const gameUi = activity.type === 'game' ? resolveActivityGameUi(activity) : undefined;
            const points = activity.type === 'game' ? getActivityPoints(activity.type, activity) : undefined;
            const gameCardCopy = activity.type === 'game' ? getGameCardCopy(activity.id, activity.title) : null;

            metaById.set(activity.id, {
                isCompleted,
                progressValue,
                progressText,
                vocabType,
                vocabUnitNumber,
                vocabThemeChip: showDetailChips ? getVocabThemeChip(activity) : null,
                vocabWordsChip: showDetailChips ? getVocabWordsChip(activity) : null,
                verbQuizWordsChip: showDetailChips ? getVerbQuizWordsChip(activity) : null,
                activityCardTitle,
                grammarChipCopy,
                gameCardCopy,
                points,
                gameEmoji: gameUi
                    ? getGameEmojiForActivity({ activityId: activity.id, title: activity.title, gameUi })
                    : null,
            });
        }

        return metaById;
    }, [activities, progressMap, completedActivityIds, completedActivityTitles, showDetailChips]);

    const isCompletedForActivity = useCallback((activity: Activity) => {
        return activityCardMetaById.get(activity.id)?.isCompleted ?? false;
    }, [activityCardMetaById]);

    const renderActivityCard = useCallback((activity: Activity, accentColor?: string, hideTypeChip?: boolean, sectionLabel?: string) => {
        const cardMeta = activityCardMetaById.get(activity.id);
        if (!cardMeta) return null;

        // Get texture for any activity type using the universal texture system
        const texture = getActivityTexture(activity, sectionLabel);

        return (
            <ActivityCard
                key={activity.id}
                activity={activity}
                isCompleted={cardMeta.isCompleted}
                progressValue={cardMeta.progressValue}
                progressText={cardMeta.progressText}
                accentColor={accentColor}
                hideTypeChip={hideTypeChip}
                points={cardMeta.points}
                tenseTexture={texture}
                vocabType={cardMeta.vocabType}
                vocabUnitNumber={cardMeta.vocabUnitNumber}
                vocabThemeChip={cardMeta.vocabThemeChip}
                vocabWordsChip={cardMeta.vocabWordsChip}
                verbQuizWordsChip={cardMeta.verbQuizWordsChip}
                activityCardTitle={cardMeta.activityCardTitle}
                grammarChipCopy={cardMeta.grammarChipCopy}
                gameEmoji={cardMeta.gameEmoji}
                showDecorativeTexture={showDetailChips}
            />
        );
    }, [activityCardMetaById, showDetailChips]);

    // Soft palette for section accents
    const SECTION_COLORS = ['#A3D9A5', '#A5C9E1', '#C5B3E6', '#F4B0B7', '#89CFF0', '#F0E68C'];

    // When filtering to a single category, render ALL activities in a flat list (no accordions)
    if (filterCategory && filteredCategories.length > 0) {
        const category = filteredCategories[0];

        // Collect all activities from every level into a flat list with optional group labels
        const sections: { label?: string; rawLabel?: string; activities: Activity[] }[] = [];

        if (category.subCategories) {
            for (const sub of category.subCategories) {
                if (sub.subCategories) {
                    // E.g. Grammar → Tenses → Simple/Continuous/Perfect
                    for (const subSub of sub.subCategories) {
                        if (subSub.activities.length > 0) {
                            sections.push({
                                label: subSub.name,
                                rawLabel: `${sub.name} — ${subSub.name}`,
                                activities: subSub.activities,
                            });
                        }
                    }
                }
                if (sub.activities.length > 0) {
                    sections.push({
                        label: sub.name,
                        activities: sub.activities,
                    });
                }
            }
        }

        if (category.activities.length > 0) {
            sections.push({ activities: category.activities });
        }

        if (sections.length === 0) {
            return (
                <p className="text-text-muted text-center py-8 text-sm">No activities yet</p>
            );
        }

        // Calculate total stats
        const allActivities = sections.flatMap(s => s.activities);
        const totalCount = allActivities.length;
        const completedCount = allActivities.filter(a =>
            isCompletedForActivity(a)
        ).length;

        return (
            <div>
                {/* Visual grouping header summary - hidden for games and pronunciation (counted as play, not complete) */}
                {filterCategory !== 'games' && filterCategory !== 'pronunciation' && (
                    <div className="mb-6 pb-2 border-b border-border/20 flex items-center justify-between">
                        <p className="text-xs font-bold text-text-muted/80 uppercase tracking-widest">
                            {totalCount} activities
                        </p>
                        <div className="flex items-center gap-3">
                            <p className="text-xs font-bold text-secondary">
                                {completedCount} / {totalCount} done
                            </p>
                            <div className="w-24 h-1.5 bg-border/20 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-secondary transition-all duration-500"
                                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-8">
                    {sections.map((section, sIdx) => {
                        // Get section texture for any category type
                        const sectionTexture = section.label
                            ? getSectionTexture(section.label, filterCategory)
                            : null;
                        const accentColor = sectionTexture?.color || SECTION_COLORS[sIdx % SECTION_COLORS.length];

                        // Keep vocabulary units in their authored time order.
                        // Other sections can still bubble incomplete items first.
                        const sortedActivities = filterCategory === 'vocabulary'
                            ? [...section.activities]
                            : [...section.activities].sort((a, b) => {
                                const aDone = isCompletedForActivity(a);
                                const bDone = isCompletedForActivity(b);
                                if (aDone && !bDone) return 1;
                                if (!aDone && bDone) return -1;
                                return 0;
                            });

                        // Count completed in this section
                        const sectionCompleted = sortedActivities.filter(a =>
                            isCompletedForActivity(a)
                        ).length;
                        const sectionTotal = sortedActivities.length;

                        return (
                            <div key={section.rawLabel || section.label || sIdx} className="space-y-3">
                                {section.label && (
                                    <div className="flex items-center gap-3">
                                        {/* Category icon indicator */}
                                        {sectionTexture ? (
                                            <span
                                                className="text-base font-medium select-none"
                                                style={{ color: sectionTexture.color }}
                                                title={sectionTexture.id}
                                            >
                                                {sectionTexture.icon}
                                            </span>
                                        ) : (
                                            <div
                                                className="w-1 h-5 rounded-full"
                                                style={{ backgroundColor: accentColor }}
                                            />
                                        )}
                                        <p
                                            className="text-xs font-bold uppercase tracking-widest"
                                            style={{ color: sectionTexture ? sectionTexture.color : 'rgba(43, 58, 74, 0.7)' }}
                                        >
                                            {section.label}
                                        </p>
                                        {filterCategory !== 'games' && filterCategory !== 'pronunciation' && (
                                            <span
                                                className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                                                style={{
                                                    backgroundColor: sectionTexture ? `${sectionTexture.color}08` : 'white',
                                                    borderColor: sectionTexture ? `${sectionTexture.color}20` : 'rgba(243, 244, 246, 1)',
                                                    color: sectionTexture ? sectionTexture.color : 'var(--text-muted)'
                                                }}
                                            >
                                                {sectionCompleted}/{sectionTotal}
                                            </span>
                                        )}
                                    </div>
                                )}
                                {/* Card carousel layout for featured learning categories */}
                                {(filterCategory === 'grammar' || filterCategory === 'vocabulary' || filterCategory === 'games' || filterCategory === 'pronunciation') ? (
                                    <DesktopCarousel ariaLabel={section.label || `${filterCategory || 'activities'} cards`}>
                                        {sortedActivities.map((activity) => {
                                            const isCompleted = isCompletedForActivity(activity);
                                            const progress = progressMap?.[activity.id]?.progress ?? 0;
                                            const hasProgress = progress > 0 && progress < 100;
                                            const isGameCard = filterCategory === 'games';
                                            const showCompletedState = isCompleted && !isGameCard;
                                            const showProgressState = hasProgress && !isGameCard;
                                            const texture = getActivityTextureForCard(activity, section.label || '');
                                            const cardTitle = displayTitle(activity.title);
                                            const vocabUnitBadge = filterCategory === 'vocabulary' ? getVocabLevelBadgeLabel(activity) : null;
                                            const grammarCopy = getGrammarChipCopyForActivity(activity);
                                            const hasGrammarVisual = hasGrammarGuideVisual(activity.title);
                                            const cardMeta = activityCardMetaById.get(activity.id);
                                            const points = getActivityPoints(activity.type, { id: activity.id, ui: activity.ui ?? undefined, content: activity.content ?? undefined });
                                            const vocabTheme = cardMeta?.vocabThemeChip ? capitalizeFirstLetter(cardMeta.vocabThemeChip) : 'Build topic vocabulary';
                                            const vocabSupport = cardMeta?.vocabWordsChip || activity.description || 'Study and use key words in context.';
                                            const gameCopy = cardMeta?.gameCardCopy;
                                            const pronunciationCopy = getPronunciationCardCopy(activity.id, activity.title, activity.content, activity.ui);

                                            return (
                                                <ActivityLink
                                                    key={activity.id}
                                                    activityId={activity.id}
                                                    className="activity-carousel-card block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-2xl"
                                                >
                                                        <div
                                                            className={`relative rounded-2xl border bg-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] h-full
                                                            ${showProgressState
                                                                ? 'border-primary/30'
                                                                : 'border-border-subtle hover:border-primary/40'
                                                            }`}
                                                        style={{
                                                            borderTopWidth: '3px',
                                                            borderTopColor: texture?.color ?? 'var(--primary-color)',
                                                        }}
                                                    >
                                                        {/* Texture gradient background - always show */}
                                                        {texture && (
                                                            <div
                                                                className="absolute inset-0 pointer-events-none"
                                                                style={{
                                                                    background: texture.gradient,
                                                                    opacity: 0.8
                                                                }}
                                                            />
                                                        )}

                                                        {/* SVG Pattern overlays */}
                                                        {texture?.pattern === 'wave' && (
                                                            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.10]" preserveAspectRatio="none">
                                                                <defs>
                                                                    <pattern id={`carousel-wave-${activity.id}`} x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
                                                                        <path d="M0 10 Q10 0, 20 10 T40 10" fill="none" stroke={texture.color} strokeWidth="2" />
                                                                    </pattern>
                                                                </defs>
                                                                <rect width="100%" height="100%" fill={`url(#carousel-wave-${activity.id})`} />
                                                            </svg>
                                                        )}
                                                        {texture?.pattern === 'dots' && (
                                                            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.15]" preserveAspectRatio="none">
                                                                <defs>
                                                                    <pattern id={`carousel-dots-${activity.id}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                                                                        <circle cx="8" cy="8" r="1.5" fill={texture.color} />
                                                                    </pattern>
                                                                </defs>
                                                                <rect width="100%" height="100%" fill={`url(#carousel-dots-${activity.id})`} />
                                                            </svg>
                                                        )}
                                                        {texture?.pattern === 'diagonal' && (
                                                            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]" preserveAspectRatio="none">
                                                                <defs>
                                                                    <pattern id={`carousel-diagonal-${activity.id}`} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                                                                        <path d="M0 12 L12 0" stroke={texture.color} strokeWidth="1" />
                                                                    </pattern>
                                                                </defs>
                                                                <rect width="100%" height="100%" fill={`url(#carousel-diagonal-${activity.id})`} />
                                                            </svg>
                                                        )}
                                                        {texture?.pattern === 'mixed' && (
                                                            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.10]" preserveAspectRatio="none">
                                                                <defs>
                                                                    <pattern id={`carousel-mixed-${activity.id}`} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                                                                        <circle cx="6" cy="6" r="1" fill={texture.color} />
                                                                        <circle cx="18" cy="18" r="1" fill={texture.color} />
                                                                        <path d="M12 0 L12 24" stroke={texture.color} strokeWidth="0.5" strokeDasharray="2,4" />
                                                                    </pattern>
                                                                </defs>
                                                                <rect width="100%" height="100%" fill={`url(#carousel-mixed-${activity.id})`} />
                                                            </svg>
                                                        )}
                                                        {texture?.pattern === 'solid' && (
                                                            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]" preserveAspectRatio="none">
                                                                <defs>
                                                                    <pattern id={`carousel-solid-${activity.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                                                        <circle cx="10" cy="10" r="1" fill={texture.color} />
                                                                    </pattern>
                                                                </defs>
                                                                <rect width="100%" height="100%" fill={`url(#carousel-solid-${activity.id})`} />
                                                            </svg>
                                                        )}

                                                        {/* Card Content - tighter padding */}
                                                        <div className="relative z-10 p-3 flex flex-col h-full min-h-[156px]">
                                                            {/* Top row: Tense badge + completion check */}
                                                            <div className="flex items-start justify-between mb-1">
                                                                <span
                                                                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                                                                    style={{
                                                                        backgroundColor: `${texture?.color ?? '#d97757'}14`,
                                                                        color: texture?.color ?? '#d97757',
                                                                    }}
                                                                >
                                                                    {filterCategory === 'pronunciation' && pronunciationCopy.pathChip
                                                                        ? pronunciationCopy.pathChip
                                                                        : vocabUnitBadge
                                                                        ? vocabUnitBadge
                                                                        : (() => {
                                                                            const shortened = cardTitle.replace(/ Guide$/i, '').replace(/ Review$/i, '');
                                                                            return shortened === 'Cycle 1' ? 'Cycle 1 Review' : shortened;
                                                                        })()}
                                                                </span>

                                                                {isCompleted && (
                                                                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shadow-sm flex-shrink-0">
                                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Grammar / vocabulary visual */}
                                                            {filterCategory === 'grammar' && hasGrammarVisual && (
                                                                <div className="mb-1 -mx-1">
                                                                    <GrammarGuideVisual title={activity.title} isCompleted={isCompleted} />
                                                                </div>
                                                            )}
                                                            {filterCategory === 'vocabulary' && (
                                                                <div className="mb-1 -mx-1">
                                                                    <VocabActivityVisual
                                                                        activityId={activity.id}
                                                                        title={activity.title}
                                                                        unitNumber={cardMeta?.vocabUnitNumber}
                                                                    />
                                                                </div>
                                                            )}
                                                            {filterCategory === 'games' && (
                                                                <div className="mb-1 -mx-1">
                                                                    <GameActivityVisual activityId={activity.id} title={activity.title} />
                                                                </div>
                                                            )}
                                                            {filterCategory === 'pronunciation' && (
                                                                <div className="mb-1 -mx-1">
                                                                    <PronunciationActivityVisual activityId={activity.id} title={activity.title} content={activity.content} ui={activity.ui} />
                                                                </div>
                                                            )}

                                                            {/* Learning outcome / description - PRIMARY FOCUS */}
                                                            <div className="flex-1">
                                                                {filterCategory === 'grammar' && grammarCopy ? (
                                                                    <>
                                                                        <p
                                                                            className="text-sm font-semibold leading-snug mb-1"
                                                                            style={{ color: 'var(--text-color)' }}
                                                                        >
                                                                            {grammarCopy.friendlyTitle}
                                                                        </p>
                                                                        <p
                                                                            className="text-xs leading-relaxed pl-4 relative"
                                                                            style={{ color: 'var(--text-color-muted)' }}
                                                                        >
                                                                            <span
                                                                                aria-hidden="true"
                                                                                className="absolute left-0 top-[0.45rem] block h-px w-2.5"
                                                                                style={{ backgroundColor: 'currentColor', opacity: 0.45 }}
                                                                            />
                                                                            {grammarCopy.useThisFor}
                                                                        </p>
                                                                    </>
                                                                ) : filterCategory === 'vocabulary' ? (
                                                                    <>
                                                                        <p
                                                                            className="text-sm font-semibold leading-snug mb-1"
                                                                            style={{ color: isCompleted ? 'var(--secondary-color)' : 'var(--text-color)' }}
                                                                        >
                                                                            {vocabTheme}
                                                                        </p>
                                                                        <p
                                                                            className="text-xs leading-relaxed pl-4 relative"
                                                                            style={{ color: 'var(--text-color-muted)' }}
                                                                        >
                                                                            <span
                                                                                aria-hidden="true"
                                                                                className="absolute left-0 top-[0.45rem] block h-px w-2.5"
                                                                                style={{ backgroundColor: 'currentColor', opacity: 0.45 }}
                                                                            />
                                                                            {vocabSupport}
                                                                        </p>
                                                                    </>
                                                                ) : filterCategory === 'games' && gameCopy ? (
                                                                    <>
                                                                        <p
                                                                            className="text-sm font-semibold leading-snug mb-1"
                                                                            style={{ color: isCompleted ? 'var(--secondary-color)' : 'var(--text-color)' }}
                                                                        >
                                                                            {gameCopy.friendlyTitle}
                                                                        </p>
                                                                        <p
                                                                            className="text-xs leading-relaxed pl-4 relative"
                                                                            style={{ color: 'var(--text-color-muted)' }}
                                                                        >
                                                                            <span
                                                                                aria-hidden="true"
                                                                                className="absolute left-0 top-[0.45rem] block h-px w-2.5"
                                                                                style={{ backgroundColor: 'currentColor', opacity: 0.45 }}
                                                                            />
                                                                            {gameCopy.useThisFor}
                                                                        </p>
                                                                    </>
                                                                ) : filterCategory === 'pronunciation' ? (
                                                                    <>
                                                                        <p
                                                                            className="text-sm font-semibold leading-snug mb-1"
                                                                            style={{ color: isCompleted ? 'var(--secondary-color)' : 'var(--text-color)' }}
                                                                        >
                                                                            {pronunciationCopy.friendlyTitle}
                                                                        </p>
                                                                        <p
                                                                            className="text-xs leading-relaxed pl-4 relative"
                                                                            style={{ color: 'var(--text-color-muted)' }}
                                                                        >
                                                                            <span
                                                                                aria-hidden="true"
                                                                                className="absolute left-0 top-[0.45rem] block h-px w-2.5"
                                                                                style={{ backgroundColor: 'currentColor', opacity: 0.45 }}
                                                                            />
                                                                            {pronunciationCopy.useThisFor}
                                                                        </p>
                                                                    </>
                                                                ) : (
                                                                    <p
                                                                        className="text-sm font-medium leading-snug"
                                                                        style={{ color: 'var(--text-color)' }}
                                                                    >
                                                                        {cardTitle}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Bottom row: Progress / Points */}
                                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle/50">
                                                                {showCompletedState ? (
                                                                    <span className="text-[11px] font-semibold text-secondary">
                                                                        Completed
                                                                    </span>
                                                                ) : showProgressState ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                            <div
                                                                                className="h-full rounded-full transition-all"
                                                                                style={{
                                                                                    width: `${progress}%`,
                                                                                    backgroundColor: texture?.color ?? 'var(--primary-color)',
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <span className="text-[10px] font-medium text-text-muted">
                                                                            {progress}%
                                                                        </span>
                                                                    </div>
                                                                ) : !isGameCard ? (
                                                                    <span className="text-[11px] font-medium text-text-muted">
                                                                        Not started
                                                                    </span>
                                                                ) : <span />}

                                                                {!showCompletedState && points > 0 && (
                                                                    <span
                                                                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                                                        style={{
                                                                            backgroundColor: 'rgba(244, 211, 94, 0.15)',
                                                                            color: '#92400e',
                                                                        }}
                                                                    >
                                                                        +{points} pts
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </ActivityLink>
                                            );
                                        })}
                                    </DesktopCarousel>
                                ) : (
                                    <div className={`space-y-2.5 ${filterCategory === 'games' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 space-y-0' : ''}`}>
                                        {sortedActivities.map(activity => renderActivityCard(activity, accentColor, true, section.label))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {filteredCategories.map((category, idx) => {
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
                        {/* Main Category Header */}
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

                        {/* Category Content */}
                        {isExpanded && (
                            <div className="border-t border-border/30 bg-bg-light/20">
                                {category.subCategories ? (
                                    // Has subcategories (like Verb Tenses)
                                    <div className="divide-y divide-border/20">
                                        {category.subCategories?.map((subCategory) => {
                                            const subKey = `${category.name}-${subCategory.name}`;
                                            const isSubExpanded = expandedSubCategories.has(subKey);

                                            return (
                                                <div key={subKey}>
                                                    <button
                                                        onClick={() => toggleSubCategory(subKey)}
                                                        className="w-full flex items-center justify-between p-4 pl-6 hover:bg-white/50 transition-colors group cursor-pointer touch-manipulation"
                                                        style={{
                                                            touchAction: 'manipulation'
                                                        }}
                                                    >
                                                        <span className="flex-1 min-w-0 text-left text-base font-semibold text-text group-hover:text-primary transition-colors pointer-events-none">
                                                            {subCategory.name}
                                                        </span>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <span className="text-xs text-text-muted font-medium bg-white px-2 py-1 rounded-full pointer-events-none">
                                                                {getSubCategoryCount(subCategory)}
                                                            </span>
                                                            <svg
                                                                className={`w-5 h-5 text-text-muted transition-transform duration-300 pointer-events-none ${isSubExpanded ? 'rotate-90' : ''}`}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </button>

                                                    {isSubExpanded && (
                                                        subCategory.subCategories ? (
                                                            // Has sub-subcategories (like Verb Tenses -> Simple, Continuous, etc.)
                                                            subCategory.name === 'Tenses' ? (
                                                                // Carousel layout for Tenses - each tense family as horizontal scroll
                                                                <div className="px-4 py-4 space-y-6 bg-white/30">
                                                                    {subCategory.subCategories
                                                                        ?.filter((subSubCategory) => subSubCategory.activities.length > 0)
                                                                        .map((subSubCategory) => {
                                                                            const subSubKey = `${subKey}-${subSubCategory.name}`;
                                                                            const subtitle = getSubcategorySubtitle(subSubCategory.name.toUpperCase());
                                                                            const sectionTexture = getSectionTexture(subSubCategory.name.toLowerCase(), filterCategory);

                                                                            return (
                                                                                <div key={subSubKey}>
                                                                                    {/* Section Header - Dual line */}
                                                                                    <div className="mb-3">
                                                                                        <div
                                                                                            className="text-[10px] font-bold tracking-widest uppercase"
                                                                                            style={{ color: sectionTexture?.color ?? 'var(--text-color-muted)' }}
                                                                                        >
                                                                                            {subSubCategory.name}
                                                                                        </div>
                                                                                        {subtitle && (
                                                                                            <div
                                                                                                className="text-base font-semibold mt-0.5"
                                                                                                style={{ color: 'var(--text-color)' }}
                                                                                            >
                                                                                                {subtitle}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>

                                                                                    {/* Horizontal Carousel */}
                                                                                    <DesktopCarousel ariaLabel={subSubCategory.name}>
                                                                                        {subSubCategory.activities.map((activity) => {
                                                                                            const isCompleted = completedActivityIds?.has(activity.id) || completedActivityTitles?.has(activity.title);
                                                                                            const progress = progressMap?.[activity.id]?.progress ?? 0;
                                                                                            const hasProgress = progress > 0 && progress < 100;
                                                                                            const isGameCard = filterCategory === 'games';
                                                                                            const showCompletedState = isCompleted && !isGameCard;
                                                                                            const showProgressState = hasProgress && !isGameCard;
                                                                                            const texture = getActivityTextureForCard(activity, subSubCategory.name);
                                                                                            const cardTitle = displayTitle(activity.title);
                                                                                            const vocabUnitBadge = filterCategory === 'vocabulary' ? getVocabLevelBadgeLabel(activity) : null;
                                                                                            const grammarCopy = getGrammarChipCopyForActivity(activity);
                                                                                            const hasGrammarVisual = hasGrammarGuideVisual(activity.title);
                                                                                            const points = getActivityPoints(activity.type, { id: activity.id, ui: activity.ui ?? undefined, content: activity.content ?? undefined });
                                                                                            const pronunciationCopy = getPronunciationCardCopy(activity.id, activity.title, activity.content, activity.ui);

                                                                                            return (
                                                                                                <ActivityLink
                                                                                                    key={activity.id}
                                                                                                    activityId={activity.id}
                                                                                                    className="activity-carousel-card block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-2xl"
                                                                                                >
                                                                                                    <div
                                                                                                        className={`relative rounded-2xl border bg-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] h-full
                                                                                                            ${showCompletedState
                                                                                                                ? 'border-secondary/30 bg-secondary/[0.02]'
                                                                                                                : hasProgress
                                                                                                                    ? 'border-primary/30'
                                                                                                                    : 'border-border-subtle hover:border-primary/40'
                                                                                                            }`}
                                                                                                        style={{
                                                                                                            borderTopWidth: '3px',
                                                                                                            borderTopColor: showCompletedState
                                                                                                                ? 'var(--secondary-color)'
                                                                                                                : texture?.color ?? 'var(--primary-color)',
                                                                                                        }}
                                                                                                    >
                                                                                                        {/* Texture gradient background */}
                                                                                                        {texture && !showCompletedState && (
                                                                                                            <div
                                                                                                                className="absolute inset-0 pointer-events-none opacity-60"
                                                                                                                style={{ background: texture.gradient }}
                                                                                                            />
                                                                                                        )}

                                                                                                        {/* Completed state background */}
                                                        {showCompletedState && (
                                                            <div className="absolute inset-0 bg-secondary/[0.04] pointer-events-none" />
                                                        )}

                                                                                                        {/* Card Content */}
                                                                                                        <div className="relative z-10 p-4 flex flex-col h-full min-h-[180px]">
                                                                                                            {/* Top row: Tense badge + completion check */}
                                                                                                            <div className="flex items-start justify-between mb-2">
                                                                                                                <span
                                                                                                                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                                                                                                                    style={{
                                                                                                                        backgroundColor: showCompletedState
                                                                                                                            ? 'rgba(123, 168, 132, 0.12)'
                                                                                                                            : `${texture?.color ?? '#d97757'}14`,
                                                                                                                        color: showCompletedState
                                                                                                                            ? 'var(--secondary-color)'
                                                                                                                            : texture?.color ?? '#d97757',
                                                                                                                    }}
                                                                                                                >
                                                                    {filterCategory === 'pronunciation' && pronunciationCopy.pathChip
                                                                        ? pronunciationCopy.pathChip
                                                                        : vocabUnitBadge
                                                                        ? vocabUnitBadge
                                                                        : (() => {
                                                                            const shortened = cardTitle.replace(/ Guide$/i, '').replace(/ Review$/i, '');
                                                                            return shortened === 'Cycle 1' ? 'Cycle 1 Review' : shortened;
                                                                        })()}
                                                                                                                </span>

                                                                {showCompletedState && (
                                                                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shadow-sm flex-shrink-0">
                                                                                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                                                                                        </svg>
                                                                                                                    </div>
                                                                                                                )}
                                                                                                            </div>

                                                                                                            {/* Grammar / vocabulary visual */}
                                                                                                            {filterCategory === 'grammar' && hasGrammarVisual && (
                                                                                                                <div className="mb-2 -mx-1">
                                                                                                                    <GrammarGuideVisual title={activity.title} isCompleted={isCompleted} />
                                                                                                                </div>
                                                                                                            )}
                                                                                                            {filterCategory === 'vocabulary' && (
                                                                                                                <div className="mb-2 -mx-1">
                                                                                                                    <VocabActivityVisual
                                                                                                                        activityId={activity.id}
                                                                                                                        title={activity.title}
                                                                                                                        unitNumber={activityCardMetaById.get(activity.id)?.vocabUnitNumber}
                                                                                                                    />
                                                                                                                </div>
                                                                                                            )}
                                                                                                            {filterCategory === 'games' && (
                                                                                                                <div className="mb-2 -mx-1">
                                                                                                                    <GameActivityVisual activityId={activity.id} title={activity.title} />
                                                                                                                </div>
                                                                                                            )}
                                                                                                            {filterCategory === 'pronunciation' && (
                                                                                                                <div className="mb-2 -mx-1">
                                                                                                                    <PronunciationActivityVisual activityId={activity.id} title={activity.title} content={activity.content} ui={activity.ui} />
                                                                                                                </div>
                                                                                                            )}

                                                                                                            {/* Learning outcome / description - PRIMARY FOCUS */}
                                                                                                            <div className="flex-1">
                                                                                                                {filterCategory === 'grammar' && grammarCopy ? (
                                                                                                                    <>
                                                                                                                        <p
                                                                                                                            className="text-sm font-semibold leading-snug mb-1"
                                                                            style={{ color: showCompletedState ? 'var(--secondary-color)' : 'var(--text-color)' }}
                                                                                                                        >
                                                                                                                            {grammarCopy.friendlyTitle}
                                                                                                                        </p>
                                                                                                                        <p
                                                                                                                            className="text-xs leading-relaxed pl-4 relative"
                                                                                                                            style={{ color: 'var(--text-color-muted)' }}
                                                                                                                        >
                                                                                                                            <span
                                                                                                                                aria-hidden="true"
                                                                                                                                className="absolute left-0 top-[0.45rem] block h-px w-2.5"
                                                                                                                                style={{ backgroundColor: 'currentColor', opacity: 0.45 }}
                                                                                                                            />
                                                                                                                            {grammarCopy.useThisFor}
                                                                                                                        </p>
                                                                                                                    </>
                                                                                                                ) : filterCategory === 'vocabulary' ? (
                                                                                                                    <>
                                                                                                                        <p
                                                                                                                            className="text-sm font-semibold leading-snug mb-1"
                                                                            style={{ color: showCompletedState ? 'var(--secondary-color)' : 'var(--text-color)' }}
                                                                                                                        >
                                                                                                                            {(() => {
                                                                                                                                const theme = activityCardMetaById.get(activity.id)?.vocabThemeChip;
                                                                                                                                return theme ? capitalizeFirstLetter(theme) : 'Build topic vocabulary';
                                                                                                                            })()}
                                                                                                                        </p>
                                                                                                                        <p
                                                                                                                            className="text-xs leading-relaxed pl-4 relative"
                                                                                                                            style={{ color: 'var(--text-color-muted)' }}
                                                                                                                        >
                                                                                                                            <span
                                                                                                                                aria-hidden="true"
                                                                                                                                className="absolute left-0 top-[0.45rem] block h-px w-2.5"
                                                                                                                                style={{ backgroundColor: 'currentColor', opacity: 0.45 }}
                                                                                                                            />
                                                                                                                            {activityCardMetaById.get(activity.id)?.vocabWordsChip || activity.description || 'Study and use key words in context.'}
                                                                                                                        </p>
                                                                                                                    </>
                                                                                                                ) : filterCategory === 'games' && activityCardMetaById.get(activity.id)?.gameCardCopy ? (
                                                                                                                    <>
                                                                                                                        <p
                                                                                                                           className="text-sm font-semibold leading-snug mb-1"
                                                                                                                            style={{ color: showCompletedState ? 'var(--secondary-color)' : 'var(--text-color)' }}
                                                                                                                        >
                                                                                                                            {activityCardMetaById.get(activity.id)?.gameCardCopy?.friendlyTitle}
                                                                                                                        </p>
                                                                                                                        <p
                                                                                                                            className="text-xs leading-relaxed pl-4 relative"
                                                                                                                            style={{ color: 'var(--text-color-muted)' }}
                                                                                                                        >
                                                                                                                            <span
                                                                                                                                aria-hidden="true"
                                                                                                                                className="absolute left-0 top-[0.45rem] block h-px w-2.5"
                                                                                                                                style={{ backgroundColor: 'currentColor', opacity: 0.45 }}
                                                                                                                            />
                                                                                                                            {activityCardMetaById.get(activity.id)?.gameCardCopy?.useThisFor}
                                                                                                                        </p>
                                                                                                                    </>
                                                                                                                ) : filterCategory === 'pronunciation' ? (
                                                                                                                    <>
                                                                                                                        <p
                                                                                                                           className="text-sm font-semibold leading-snug mb-1"
                                                                                                                            style={{ color: showCompletedState ? 'var(--secondary-color)' : 'var(--text-color)' }}
                                                                                                                        >
                                                                                                                            {pronunciationCopy.friendlyTitle}
                                                                                                                        </p>
                                                                                                                        <p
                                                                                                                            className="text-xs leading-relaxed pl-4 relative"
                                                                                                                            style={{ color: 'var(--text-color-muted)' }}
                                                                                                                        >
                                                                                                                            <span
                                                                                                                                aria-hidden="true"
                                                                                                                                className="absolute left-0 top-[0.45rem] block h-px w-2.5"
                                                                                                                                style={{ backgroundColor: 'currentColor', opacity: 0.45 }}
                                                                                                                            />
                                                                                                                            {pronunciationCopy.useThisFor}
                                                                                                                        </p>
                                                                                                                    </>
                                                                                                                ) : (
                                                                                                                    <p
                                                                                                                       className="text-sm font-medium leading-snug"
                                                                                                                        style={{ color: showCompletedState ? 'var(--secondary-color)' : 'var(--text-color)' }}
                                                                                                                    >
                                                                                                                        {cardTitle}
                                                                                                                    </p>
                                                                                                                )}
                                                                                                            </div>

                                                                                                            {/* Bottom row: Progress / Points */}
                                                                                                           <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-subtle/50">
                                                                {showCompletedState ? (
                                                                    <span className="text-[11px] font-semibold text-secondary">
                                                                        Completed
                                                                    </span>
                                                                ) : showProgressState ? (
                                                                    <div className="flex items-center gap-2">
                                                                                                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                                                                            <div
                                                                                                                                className="h-full rounded-full transition-all"
                                                                                                                                style={{
                                                                                                                                    width: `${progress}%`,
                                                                                                                                    backgroundColor: texture?.color ?? 'var(--primary-color)',
                                                                                                                                }}
                                                                                                                            />
                                                                                                                        </div>
                                                                                                                        <span className="text-[10px] font-medium text-text-muted">
                                                                                                                            {progress}%
                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                ) : filterCategory !== 'games' ? (
                                                                                                                    <span className="text-[11px] font-medium text-text-muted">
                                                                                                                        Not started
                                                                                                                    </span>
                                                                                                                ) : <span />}

                                                                {!showCompletedState && points > 0 && (
                                                                    <span
                                                                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                                                        style={{
                                                                            backgroundColor: 'rgba(244, 211, 94, 0.15)',
                                                                            color: '#92400e',
                                                                        }}
                                                                    >
                                                                        +{points} pts
                                                                    </span>
                                                                )}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </ActivityLink>
                                                                                            );
                                                                                        })}
                                                                                    </DesktopCarousel>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                </div>
                                                            ) : (
                                                                <div className="divide-y divide-border/10">
                                                                    {subCategory.subCategories
                                                                        ?.filter((subSubCategory) => subSubCategory.activities.length > 0)
                                                                        .map((subSubCategory) => {
                                                                        const subSubKey = `${subKey}-${subSubCategory.name}`;
                                                                        const isSubSubExpanded = expandedSubCategories.has(subSubKey);

                                                                        return (
                                                                            <div key={subSubKey}>
                                                                                <button
                                                                                    onClick={() => toggleSubCategory(subSubKey)}
                                                                                    className="w-full flex items-center justify-between p-3 pl-10 hover:bg-white/30 transition-colors group cursor-pointer touch-manipulation"
                                                                                    style={{
                                                                                        touchAction: 'manipulation'
                                                                                    }}
                                                                                >
                                                                                    <span className="flex-1 min-w-0 text-left text-sm font-medium text-text group-hover:text-primary transition-colors pointer-events-none">
                                                                                        {subSubCategory.name}
                                                                                    </span>
                                                                                    <div className="flex items-center gap-2 shrink-0">
                                                                                        <span className="text-xs text-text-muted font-medium bg-white px-2 py-0.5 rounded-full pointer-events-none">
                                                                                            {subSubCategory.activities.length}
                                                                                        </span>
                                                                                        <svg
                                                                                            className={`w-4 h-4 text-text-muted transition-transform duration-300 pointer-events-none ${isSubSubExpanded ? 'rotate-90' : ''}`}
                                                                                            fill="none"
                                                                                            stroke="currentColor"
                                                                                            viewBox="0 0 24 24"
                                                                                        >
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                                        </svg>
                                                                                    </div>
                                                                                </button>

                                                                                {isSubSubExpanded && subSubCategory.activities.length > 0 && (
                                                                                    <div className="pl-20 pr-4 pb-3 space-y-2">
                                                                                        {subSubCategory.activities.map((a) => renderActivityCard(a))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )
                                                        ) : subCategory.activities.length > 0 && (
                                                            // No sub-subcategories - show activities directly
                                                            <div className="pl-12 pr-4 pb-4 space-y-2">
                                                                {subCategory.activities.map(a => renderActivityCard(a))}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    // No subcategories - show activities directly
                                    <div className="p-4 space-y-2">
                                        {category.activities.length > 0 ? (
                                            category.activities.map(a => renderActivityCard(a))
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
