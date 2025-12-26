'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Activity {
    id: string;
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    level: string | null;
    content?: string;
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

interface ActivityCategoriesProps {
    activities: Activity[];
    completedActivityIds?: Set<string>;
    progressMap?: Record<string, { progress: number; categoryData?: string }>;
    showEmpty?: boolean;
}

export const ActivityCategories: React.FC<ActivityCategoriesProps> = ({
    activities,
    completedActivityIds = new Set(),
    progressMap,
    showEmpty = false
}) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());

    const displayTitle = (title: string) =>
        title
            .replace(/\s*-\s*Complete Step-by-Step Guide\s*$/i, ' Guide')
            .replace(/\s*-\s*Complete Guide\s*$/i, ' Guide')
            .trim();

    const toggleCategory = (categoryName: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryName)) {
            newExpanded.delete(categoryName);
        } else {
            newExpanded.add(categoryName);
        }
        setExpandedCategories(newExpanded);
    };

    const toggleSubCategory = (subCategoryKey: string) => {
        const newExpanded = new Set(expandedSubCategories);
        if (newExpanded.has(subCategoryKey)) {
            newExpanded.delete(subCategoryKey);
        } else {
            newExpanded.add(subCategoryKey);
        }
        setExpandedSubCategories(newExpanded);
    };

    const getSubCategoryCount = (subCategory: SubCategory) => {
        const directCount = subCategory.activities?.length || 0;
        const nestedCount = subCategory.subCategories
            ? subCategory.subCategories.reduce((sum, sub) => sum + (sub.activities?.length || 0), 0)
            : 0;
        return directCount + nestedCount;
    };

    const getCategoryCount = (category: Category) => {
        const directCount = category.activities?.length || 0;
        const nestedCount = category.subCategories
            ? category.subCategories.reduce((sum, sub) => sum + getSubCategoryCount(sub), 0)
            : 0;
        return directCount + nestedCount;
    };

    const vocabMonths = [
        { id: 'september', label: 'Unit 1: September: Getting to Know You' },
        { id: 'october', label: 'Unit 2: October: Daily Life in the Community' },
        { id: 'november', label: 'Unit 3: November: Community Participation' },
        { id: 'december', label: 'Unit 4: December: Consumer Smarts' },
        { id: 'january', label: 'Unit 5: January: Housing' },
        { id: 'february', label: 'Unit 6: February: Workforce Preparation' },
        { id: 'march', label: 'Unit 7: March: Career Awareness' },
        { id: 'april', label: 'Unit 8: April: Health' },
        { id: 'may', label: 'Unit 9: May: Holistic Wellness' },
        { id: 'june', label: 'Unit 10: June: Future Academic Goals' },
    ];

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

    const compareByTitleDateDesc = (a: Activity, b: Activity) => {
        const aDate = parseTitleDateMs(a.title);
        const bDate = parseTitleDateMs(b.title);
        if (aDate !== null && bDate !== null) return bDate - aDate;
        if (aDate !== null) return -1;
        if (bDate !== null) return 1;
        return (b.title || '').localeCompare(a.title || '');
    };

    const buildGrammarSubCategories = (): SubCategory[] => {
        const grammarActivities = activities.filter((a) => a.category === "grammar");

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

            return list.sort((a, b) => {
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
            take((a) => {
                const t = normalizeTitle(a.title);
                return t.includes("simple") && !t.includes("vs");
            })
        );

        const perfectContinuous = sortByTenseOrder(take((a) => normalizeTitle(a.title).includes("perfect continuous")));

        const continuous = sortByTenseOrder(
            take((a) => {
                const t = normalizeTitle(a.title);
                return t.includes("continuous") && !t.includes("perfect continuous") && !t.includes("vs");
            })
        );

        const perfect = sortByTenseOrder(
            take((a) => {
                const t = normalizeTitle(a.title);
                return t.includes("perfect") && !t.includes("continuous") && !t.includes("vs");
            })
        );

        const mixedAllTenses = sortAlpha(
            take((a) => {
                const t = normalizeTitle(a.title);
                // Exclude gerund/infinitive activities from tenses
                if (t.includes("gerund") || t.includes("infinitive")) return false;
                return t.includes("tenses") || t.includes("review") || t.includes(" vs ");
            })
        );

        const questionsAndCommands = sortByKeywordOrder(
            take((a) => {
                const t = normalizeTitle(a.title);
                return t.includes("question") || t.includes("imperative") || t.includes("declarative");
            }),
            ["information questions", "imperatives", "declaratives"]
        );

        const conditionals = sortAlpha(take((a) => normalizeTitle(a.title).includes("conditional")));
        const modals = sortAlpha(take((a) => normalizeTitle(a.title).includes("modal")));
        const habitsAndPreferences = sortAlpha(
            take((a) => {
                const t = normalizeTitle(a.title);
                return t.includes("used to") || t.includes("would rather");
            })
        );

        const voiceAndReporting = sortByKeywordOrder(
            take((a) => {
                const t = normalizeTitle(a.title);
                return t.includes("passive") || t.includes("reported");
            }),
            ["passive", "reported"]
        );

        const gerundsAndInfinitives = sortByKeywordOrder(
            take((a) => {
                const t = normalizeTitle(a.title);
                return t.includes("gerund") || t.includes("infinitive");
            }),
            ["infinitives vs gerunds", "verbs + gerunds", "gerunds after prepositions"]
        );

        const phrasalVerbs = sortAlpha(take((a) => normalizeTitle(a.title).includes("phrasal")));

        const wordsAndQuantity = sortByKeywordOrder(
            take((a) => {
                const t = normalizeTitle(a.title);
                return t.includes("parts of speech") || t.includes("superlative") || t.includes("quantifier");
            }),
            ["parts of speech", "superlatives", "quantifiers"]
        );

        const writingMechanics = sortByKeywordOrder(
            take((a) => {
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
                ].sort((a, b) => displayTitle(a.title || "").localeCompare(displayTitle(b.title || "")))
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
                ].sort((a, b) => displayTitle(a.title || "").localeCompare(displayTitle(b.title || "")))
            },
            {
                name: "Describing & Comparing",
                activities: [
                    ...conditionals,
                    ...wordsAndQuantity
                ].sort((a, b) => displayTitle(a.title || "").localeCompare(displayTitle(b.title || "")))
            },
            {
                name: "Writing Basics",
                activities: [
                    ...writingMechanics,
                    ...otherGrammar
                ].sort((a, b) => displayTitle(a.title || "").localeCompare(displayTitle(b.title || "")))
            },
        ];
    };

    // Organize activities by top-level categories with subcategories
    const categories: Category[] = [
        {
            name: 'Vocabulary',
            color: '#f4a261', // warm orange
            subCategories: vocabMonths.map(month => {
                const monthActivities = activities.filter(a => a.id?.startsWith(`vocab-${month.id}`));

                // Define custom sort order
                const sortOrder = ['packet', 'flashcards', 'matching', 'fillblank'];
                const sorted = monthActivities.sort((a, b) => {
                    const aType = a.id?.split('-').pop() || '';
                    const bType = b.id?.split('-').pop() || '';
                    const aIndex = sortOrder.indexOf(aType);
                    const bIndex = sortOrder.indexOf(bType);
                    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
                });

                return {
                    name: month.label,
                    activities: sorted
                };
            }),
            activities: []
        },
        {
            name: 'Grammar',
            color: '#e76f51', // coral/terracotta
            subCategories: buildGrammarSubCategories(),
            activities: []
        },
        {
            name: 'Numbers',
            color: '#4a90e2', // blue
            subCategories: [
                {
                    name: 'Games',
                    activities: activities.filter(a => {
                        // Filter for numbers game activities
                        // Check type and category first
                        if (a.type !== 'game') return false;
                        if (a.category !== 'numbers' && a.category !== 'number') return false;
                        
                        // Check if it's a numbers game by checking content
                        if (!a.content) return false;
                        
                        try {
                            const content = JSON.parse(a.content);
                            return content && typeof content === 'object' && content.type === 'numbers-game';
                        } catch {
                            // If content is not valid JSON, it's not a numbers game
                            return false;
                        }
                    })
                }
            ],
            activities: activities.filter(a => 
                (a.category === 'numbers' || a.category === 'number') && 
                a.type !== 'game'
            )
        },
        {
            name: 'Reading',
            color: '#2a9d8f', // teal
            activities: activities.filter(a => a.category === 'reading' || a.category === 'writing-reading')
        },
        {
            name: 'Writing',
            color: '#7ba884', // sage green
            activities: activities.filter(a => a.category === 'writing' || a.category === 'writing-reading')
        },
        {
            name: 'Pronunciation',
            color: '#6a4c93', // purple
            activities: activities.filter(a => a.category === 'pronunciation')
        },
        {
            name: 'Speaking',
            color: '#e09f3e', // gold/amber
            activities: activities.filter(a => {
                if (a.category !== 'speaking') return false;

                // Only show released speaking activities to students
                try {
                    const content = JSON.parse(a.content || '{}');
                    return content.released === true;
                } catch {
                    return false;
                }
            }).sort(compareByTitleDateDesc)
        },
        {
            name: 'Quizzes',
            color: '#c86b51', // terracotta
            activities: activities.filter(a => {
                if (a.category !== 'quizzes') return false;

                // Only show released quizzes to students
                try {
                    const content = JSON.parse(a.content || '{}');
                    return content.released === true;
                } catch {
                    return false;
                }
            })
                .sort((a, b) => {
                    // Sort by week number (Week 1, Week 2, etc.)
                    const getWeekNum = (title: string) => {
                        const match = title.match(/Week (\d+)/);
                        return match ? parseInt(match[1]) : 999;
                    };
                    return getWeekNum(a.title || '') - getWeekNum(b.title || '');
                })
        }
    ];

    const filteredCategories = showEmpty
        ? categories
        : categories
            // Hide any categories (and their subcategories) that have zero activities
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

    const getProgress = (id: string) => {
        const data = progressMap?.[id];
        return data?.progress ?? 0;
    };

    const getCategoryProgressText = (id: string) => {
        const data = progressMap?.[id];
        if (!data?.categoryData) return null;

        try {
            const categories = JSON.parse(data.categoryData) as unknown;
            if (!categories || typeof categories !== "object") return null;
            const values = Object.values(categories as Record<string, unknown>);
            const completed = values.filter((value) => {
                if (!value || typeof value !== "object") return false;
                const entry = value as { completed?: unknown };
                return entry.completed === true;
            }).length;
            const total = values.length;
            return `${completed}/${total} categories`;
        } catch {
            return null;
        }
    };

    return (
        <div className="space-y-4">
            {filteredCategories.map((category, idx) => {
                const isExpanded = expandedCategories.has(category.name);
                const totalActivities = getCategoryCount(category);

                return (
                    <div
                        key={category.name}
                        className="bg-white rounded-xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                        style={{
                            borderColor: `${category.color}40`,
                            animationDelay: `${idx * 50}ms`
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
                                                        className="w-full flex items-center justify-between p-4 pl-6 hover:bg-white/50 transition-colors group text-left cursor-pointer touch-manipulation"
                                                        style={{
                                                            touchAction: 'manipulation'
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <span className="text-base font-semibold text-text group-hover:text-primary transition-colors text-left pointer-events-none">
                                                                {subCategory.name}
                                                            </span>
                                                            <span className="text-xs text-text-muted font-medium bg-white px-2 py-1 rounded-full shrink-0 pointer-events-none">
                                                                {getSubCategoryCount(subCategory)}
                                                            </span>
                                                        </div>
                                                        <svg
                                                            className={`w-5 h-5 text-text-muted transition-transform duration-300 shrink-0 ml-2 pointer-events-none ${isSubExpanded ? 'rotate-180' : ''}`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>

                                                    {isSubExpanded && (
                                                        subCategory.subCategories ? (
                                                            // Has sub-subcategories (like Verb Tenses -> Simple, Continuous, etc.)
                                                            subCategory.name === 'Tenses' ? (
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
                                                                                        className="w-full flex items-center justify-between p-3 pl-16 hover:bg-white/30 transition-colors group cursor-pointer touch-manipulation"
                                                                                        style={{
                                                                                            touchAction: 'manipulation'
                                                                                        }}
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className="text-sm font-bold text-text group-hover:text-primary transition-colors pointer-events-none">
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
                                                                                        <div className="pl-20 pr-4 pb-3 space-y-2">
                                                                                            {subSubCategory.activities.map((activity) => {
                                                                                                const progressValue = getProgress(activity.id);
                                                                                                const isCompleted = completedActivityIds.has(activity.id) || progressValue >= 100;
                                                                                                return (
                                                                                                    <Link
                                                                                                        key={activity.id}
                                                                                                        href={`/activity/${activity.id}`}
                                                                                                        className={`group relative block rounded-xl border bg-white/95 p-3.5 hover:-translate-y-[1px] hover:border-primary/50 hover:shadow-md transition-all duration-200 ${isCompleted ? 'border-secondary/40 bg-secondary/5' : 'border-border/40'
                                                                                                            }`}
                                                                                                    >
                                                                                                        {isCompleted && (
                                                                                                            <div className="absolute top-3 right-3">
                                                                                                                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                                                                                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                                                    </svg>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        )}
                                                                                                        <div className="flex items-start gap-3">
                                                                                                            <span className="mt-1 w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
                                                                                                            <div className="flex-1 min-w-0">
                                                                                                                <h4 className={`text-sm font-semibold leading-snug group-hover:text-primary transition-colors truncate ${isCompleted ? 'text-secondary' : 'text-text'
                                                                                                                    }`}>
                                                                                                                    {displayTitle(activity.title)}
                                                                                                                </h4>
                                                                                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                                                                                                                    <span className="px-2 py-1 bg-secondary/10 text-secondary font-bold rounded-full uppercase tracking-tight">
                                                                                                                        {activity.type}
                                                                                                                    </span>
                                                                                                                    {progressValue > 0 && (
                                                                                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold">
                                                                                                                            {activity.id === 'numbers-game' && getCategoryProgressText(activity.id)
                                                                                                                                ? getCategoryProgressText(activity.id)
                                                                                                                                : `${progressValue}% done`}
                                                                                                                        </span>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        {progressValue > 0 && (
                                                                                                            <div className="mt-3 h-1.5 bg-border/40 rounded-full overflow-hidden">
                                                                                                                <div
                                                                                                                    className={`h-full ${isCompleted ? 'bg-secondary' : 'bg-primary'}`}
                                                                                                                    style={{ width: `${Math.min(progressValue, 100)}%` }}
                                                                                                                />
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </Link>
                                                                                                );
                                                                                            })}
                                                                                        </div>
                                                                                    )}
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
                                                                                    <div className="pl-20 pr-4 pb-3 space-y-2">
                                                                                        {subSubCategory.activities.map((activity) => {
                                                                                            const progressValue = getProgress(activity.id);
                                                                                            const isCompleted = completedActivityIds.has(activity.id) || progressValue >= 100;
                                                                                            return (
                                                                                                <Link
                                                                                                    key={activity.id}
                                                                                                    href={`/activity/${activity.id}`}
                                                                                                    className={`group relative block rounded-xl border bg-white/95 p-3.5 hover:-translate-y-[1px] hover:border-primary/50 hover:shadow-md transition-all duration-200 ${isCompleted ? 'border-secondary/40 bg-secondary/5' : 'border-border/40'
                                                                                                        }`}
                                                                                                >
                                                                                                    {isCompleted && (
                                                                                                        <div className="absolute top-3 right-3">
                                                                                                            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                                                                                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                                                </svg>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}
                                                                                                    <div className="flex items-start gap-3">
                                                                                                        <span className="mt-1 w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
                                                                                                        <div className="flex-1 min-w-0">
                                                                                                            <h4 className={`text-sm font-semibold leading-snug group-hover:text-primary transition-colors truncate ${isCompleted ? 'text-secondary' : 'text-text'
                                                                                                                }`}>
                                                                                                                {displayTitle(activity.title)}
                                                                                                            </h4>
                                                                                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                                                                                                                <span className="px-2 py-1 bg-secondary/10 text-secondary font-bold rounded-full uppercase tracking-tight">
                                                                                                                    {activity.type}
                                                                                                                </span>
                                                                                                                {progressValue > 0 && (
                                                                                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold">
                                                                                                                        {activity.id === 'numbers-game' && getCategoryProgressText(activity.id)
                                                                                                                            ? getCategoryProgressText(activity.id)
                                                                                                                            : `${progressValue}% done`}
                                                                                                                    </span>
                                                                                                                )}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    {progressValue > 0 && (
                                                                                                        <div className="mt-3 h-1.5 bg-border/40 rounded-full overflow-hidden">
                                                                                                            <div
                                                                                                                className={`h-full ${isCompleted ? 'bg-secondary' : 'bg-primary'}`}
                                                                                                                style={{ width: `${Math.min(progressValue, 100)}%` }}
                                                                                                            />
                                                                                                        </div>
                                                                                                    )}
                                                                                                </Link>
                                                                                            );
                                                                                        })}
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
                                                                {subCategory.activities.map((activity) => {
                                                                    const progressValue = getProgress(activity.id);
                                                                    const isCompleted = completedActivityIds.has(activity.id) || progressValue >= 100;
                                                                    return (
                                                                        <Link
                                                                            key={activity.id}
                                                                            href={`/activity/${activity.id}`}
                                                                            className={`group relative block rounded-xl border bg-white/95 p-3.5 hover:-translate-y-[1px] hover:border-primary/50 hover:shadow-md transition-all duration-200 ${isCompleted ? 'border-secondary/40 bg-secondary/5' : 'border-border/40'
                                                                                }`}
                                                                        >
                                                                            {isCompleted && (
                                                                                <div className="absolute top-3 right-3">
                                                                                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                                                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                        </svg>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            <div className="flex items-start gap-3">
                                                                                <span className="mt-1 w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
                                                                                <div className="flex-1 min-w-0">
                                                                                    <h4 className={`font-semibold leading-snug group-hover:text-primary transition-colors truncate ${isCompleted ? 'text-secondary' : 'text-text'
                                                                                        }`}>
                                                                                        {displayTitle(activity.title)}
                                                                                    </h4>
                                                                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                                                                                        <span className="px-2 py-1 bg-secondary/10 text-secondary font-bold rounded-full uppercase tracking-tight">
                                                                                            {activity.type}
                                                                                        </span>
                                                                                        {progressValue > 0 && (
                                                                                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold">
                                                                                                {activity.id === 'numbers-game' && getCategoryProgressText(activity.id)
                                                                                                    ? getCategoryProgressText(activity.id)
                                                                                                    : `${progressValue}% done`}
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {progressValue > 0 && (
                                                                                <div className="mt-3 h-1.5 bg-border/40 rounded-full overflow-hidden">
                                                                                    <div
                                                                                        className={`h-full ${isCompleted ? 'bg-secondary' : 'bg-primary'}`}
                                                                                        style={{ width: `${Math.min(progressValue, 100)}%` }}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </Link>
                                                                    );
                                                                })}
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
                                            category.activities.map((activity) => {
                                            const progressValue = getProgress(activity.id);
                                            const isCompleted = completedActivityIds.has(activity.id) || progressValue >= 100;
                                                return (
                                                    <Link
                                                        key={activity.id}
                                                        href={`/activity/${activity.id}`}
                                                        className={`group relative block rounded-xl border bg-white/95 p-3.5 hover:-translate-y-[1px] hover:border-primary/50 hover:shadow-md transition-all duration-200 ${isCompleted ? 'border-secondary/40 bg-secondary/5' : 'border-border/40'
                                                            }`}
                                                    >
                                                        {isCompleted && (
                                                            <div className="absolute top-3 right-3">
                                                                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="flex items-start gap-3">
                                                            <span className="mt-1 w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className={`font-semibold leading-snug group-hover:text-primary transition-colors truncate ${isCompleted ? 'text-secondary' : 'text-text'
                                                                    }`}>
                                                                    {displayTitle(activity.title)}
                                                                </h4>
                                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                                                                    <span className="px-2 py-1 bg-secondary/10 text-secondary font-bold rounded-full uppercase tracking-tight">
                                                                        {activity.type}
                                                                    </span>
                                                                {progressValue > 0 && (
                                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold">
                                                                        {activity.id === 'numbers-game' && getCategoryProgressText(activity.id)
                                                                            ? getCategoryProgressText(activity.id)
                                                                            : `${progressValue}% done`}
                                                                    </span>
                                                                )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {progressValue > 0 && (
                                                            <div className="mt-3 h-1.5 bg-border/40 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full ${isCompleted ? 'bg-secondary' : 'bg-primary'}`}
                                                                    style={{ width: `${Math.min(progressValue, 100)}%` }}
                                                                />
                                                            </div>
                                                        )}
                                                    </Link>
                                                );
                                            })
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
};
