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

interface TeacherActivityCategoriesProps {
    activities: Activity[];
    featuredActivityIds?: Set<string>;
    defaultClassId?: string | null;
    activityAssignmentMap?: Record<string, string>;
}

export const TeacherActivityCategories: React.FC<TeacherActivityCategoriesProps> = ({
    activities,
    featuredActivityIds = new Set(),
    defaultClassId,
    activityAssignmentMap = {}
}) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());
    const [featuredIds, setFeaturedIds] = useState<Set<string>>(new Set(featuredActivityIds));
    const [assignmentMap, setAssignmentMap] = useState<Record<string, string>>(activityAssignmentMap);
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [assignError, setAssignError] = useState<string | null>(null);

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
            subCategories: [
                {
                    name: 'Verb Tenses',
                    activities: [],
                    subCategories: [
                        {
                            name: 'Simple',
                            activities: activities
                                .filter(a => {
                                    const title = a.title?.toLowerCase() || '';
                                    // Include Simple tenses OR Simple Tenses Review
                                    return title.includes('simple') &&
                                        !title.includes('vs') &&
                                        a.category === 'grammar';
                                })
                                .sort((a, b) => {
                                    const titleA = a.title?.toLowerCase() || '';
                                    const titleB = b.title?.toLowerCase() || '';
                                    const order = ['present', 'past', 'future', 'review'];
                                    const getOrder = (title: string) => {
                                        for (let i = 0; i < order.length; i++) {
                                            if (title.includes(order[i])) return i;
                                        }
                                        return order.length;
                                    };
                                    return getOrder(titleA) - getOrder(titleB);
                                })
                        },
                        {
                            name: 'Continuous',
                            activities: activities
                                .filter(a => {
                                    const title = a.title?.toLowerCase() || '';
                                    // Include Continuous tenses (not perfect continuous) OR Continuous Tenses Review
                                    const isContinuous = title.includes('continuous') &&
                                        !title.includes('perfect continuous') &&
                                        !title.includes('vs');
                                    return isContinuous && a.category === 'grammar';
                                })
                                .sort((a, b) => {
                                    const titleA = a.title?.toLowerCase() || '';
                                    const titleB = b.title?.toLowerCase() || '';
                                    const order = ['present', 'past', 'future', 'review'];
                                    const getOrder = (title: string) => {
                                        for (let i = 0; i < order.length; i++) {
                                            if (title.includes(order[i])) return i;
                                        }
                                        return order.length;
                                    };
                                    return getOrder(titleA) - getOrder(titleB);
                                })
                        },
                        {
                            name: 'Perfect',
                            activities: activities
                                .filter(a => {
                                    const title = a.title?.toLowerCase() || '';
                                    // Include Perfect tenses (not continuous) OR Perfect Tenses Review
                                    const isPerfectTense = title.includes('perfect') &&
                                        !title.includes('continuous') &&
                                        !title.includes('vs');
                                    const isPerfectReview = title.includes('perfect tenses review') &&
                                        !title.includes('continuous');
                                    return (isPerfectTense || isPerfectReview) && a.category === 'grammar';
                                })
                                .sort((a, b) => {
                                    const titleA = a.title?.toLowerCase() || '';
                                    const titleB = b.title?.toLowerCase() || '';
                                    const order = ['present', 'past', 'future', 'review'];
                                    const getOrder = (title: string) => {
                                        for (let i = 0; i < order.length; i++) {
                                            if (title.includes(order[i])) return i;
                                        }
                                        return order.length;
                                    };
                                    return getOrder(titleA) - getOrder(titleB);
                                })
                        },
                        {
                            name: 'Perfect Continuous',
                            activities: activities
                                .filter(a => {
                                    const title = a.title?.toLowerCase() || '';
                                    // Include Perfect Continuous tenses OR Perfect Continuous Review
                                    return title.includes('perfect continuous') && a.category === 'grammar';
                                })
                                .sort((a, b) => {
                                    const titleA = a.title?.toLowerCase() || '';
                                    const titleB = b.title?.toLowerCase() || '';
                                    const order = ['present', 'past', 'future', 'review'];
                                    const getOrder = (title: string) => {
                                        for (let i = 0; i < order.length; i++) {
                                            if (title.includes(order[i])) return i;
                                        }
                                        return order.length;
                                    };
                                    return getOrder(titleA) - getOrder(titleB);
                                })
                        },
                        {
                            name: 'Mixed/All Tenses',
                            activities: activities.filter(a => {
                                const title = a.title?.toLowerCase() || '';
                                // Exclude all tense-specific reviews (they belong in their own categories)
                                const isSimpleReview = title.includes('simple') && title.includes('review');
                                const isContinuousReview = title.includes('continuous') && title.includes('review') && !title.includes('perfect');
                                const isPerfectReview = title.includes('perfect') && title.includes('review');
                                const isPerfectContinuousReview = title.includes('perfect continuous') && title.includes('review');

                                return (
                                    (title.includes('vs') ||
                                        title.includes('review') ||
                                        title.includes('tenses')) &&
                                    a.category === 'grammar' &&
                                    !isSimpleReview &&
                                    !isContinuousReview &&
                                    !isPerfectReview &&
                                    !isPerfectContinuousReview
                                );
                            })
                        },
                        {
                            name: 'Verb Forms',
                            activities: activities.filter(a =>
                                (a.title?.toLowerCase().includes('gerund') ||
                                    a.title?.toLowerCase().includes('infinitive') ||
                                    a.title?.toLowerCase().includes('state verb') ||
                                    a.title?.toLowerCase().includes('action verb')) &&
                                a.category === 'grammar'
                            )
                        },
                        {
                            name: 'Phrasal Verbs',
                            activities: activities.filter(a =>
                                a.title?.toLowerCase().includes('phrasal') &&
                                a.category === 'grammar'
                            )
                        },
                        {
                            name: 'Passive Voice',
                            activities: activities.filter(a =>
                                a.title?.toLowerCase().includes('passive') &&
                                a.category === 'grammar'
                            )
                        }
                    ]
                },
                {
                    name: 'Conditionals',
                    activities: activities.filter(a =>
                        a.title?.toLowerCase().includes('conditional') &&
                        a.category === 'grammar'
                    )
                },
                {
                    name: 'Modals and Modal-like Verbs',
                    activities: activities.filter(a =>
                        a.title?.toLowerCase().includes('modal') &&
                        a.category === 'grammar'
                    )
                },
                {
                    name: 'Reported Speech',
                    activities: activities.filter(a =>
                        a.title?.toLowerCase().includes('reported') &&
                        a.category === 'grammar'
                    )
                },
                {
                    name: 'Sentences',
                    activities: activities.filter(a =>
                        a.title?.toLowerCase().includes('sentence') &&
                        !a.title?.toLowerCase().includes('builder') &&
                        a.category === 'grammar'
                    )
                },
                {
                    name: 'Parts of Speech',
                    activities: activities.filter(a =>
                        (a.title?.toLowerCase().includes('noun') ||
                        a.title?.toLowerCase().includes('adjective') ||
                        a.title?.toLowerCase().includes('adverb') ||
                        a.title?.toLowerCase().includes('pronoun') ||
                        a.title?.toLowerCase().includes('preposition') ||
                        a.title?.toLowerCase().includes('conjunction') ||
                        a.title?.toLowerCase().includes('article') ||
                        a.title?.toLowerCase().includes('determiner') ||
                        (a.title?.toLowerCase().includes('part') && a.title?.toLowerCase().includes('speech'))) &&
                        a.category === 'grammar'
                    )
                }
            ],
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
            activities: activities.filter(a => a.category === 'speaking')
        },
        {
            name: 'Quizzes',
            color: '#c86b51', // terracotta
            activities: activities.filter(a => a.category === 'quizzes')
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

    const ActivityCard = ({ activity }: { activity: Activity }) => {
        const isFeatured = featuredIds.has(activity.id);
        const [isReleasing, setIsReleasing] = React.useState(false);

        // Check if this is a verb quiz or speaking activity and if it's released
        let isQuiz = false;
        let isSpeaking = false;
        let isReleased = false;
        try {
            const content = JSON.parse(activity.content || '{}');
            isQuiz = content.type === 'verb-quiz';
            isSpeaking = content.type === 'speaking';
            isReleased = content.released === true;
        } catch {}

        const handleRelease = async () => {
            setIsReleasing(true);
            try {
                const apiEndpoint = isSpeaking ? '/api/speaking/release' : '/api/quiz/release';
                const res = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        activityId: activity.id,
                        released: !isReleased
                    })
                });

                if (!res.ok) {
                    throw new Error('Failed to update release status');
                }

                // Refresh the page to show updated status
                window.location.reload();
            } catch (error) {
                console.error(error);
                const activityType = isSpeaking ? 'speaking activity' : 'quiz';
                alert(`Failed to update ${activityType} release status`);
            } finally {
                setIsReleasing(false);
            }
        };

        const handleAssign = async () => {
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
                        title: activity.title
                    })
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || 'Failed to assign activity');
                }

                const created = await res.json();

                // Mark as featured locally so the badge updates without a full refresh
                setFeaturedIds(prev => new Set(prev).add(activity.id));
                setAssignmentMap(prev => ({ ...prev, [activity.id]: created.id }));
            } catch (error: any) {
                setAssignError(error.message || 'Failed to assign activity');
            } finally {
                setAssigningId(null);
            }
        };

        const handleUnassign = async () => {
            const assignmentId = assignmentMap[activity.id];
            if (!defaultClassId || !assignmentId || assigningId) return;
            setAssignError(null);
            setAssigningId(activity.id);
            try {
                const res = await fetch('/api/assignments', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        assignmentId,
                        isFeatured: false
                    })
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || 'Failed to unassign activity');
                }

                setFeaturedIds(prev => {
                    const next = new Set(prev);
                    next.delete(activity.id);
                    return next;
                });
            } catch (error: any) {
                setAssignError(error.message || 'Failed to unassign activity');
            } finally {
                setAssigningId(null);
            }
        };

        return (
            <div
                className={`block bg-white rounded-lg p-4 hover:shadow-md transition-all duration-200 border group relative ${isFeatured ? 'border-accent/60 bg-accent/5' : 'border-border/40'
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
                            {activity.title}
                        </h4>
                        <p className="text-sm text-text-muted line-clamp-2 mt-1 mb-3">
                            {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full uppercase">
                                {activity.type}
                            </span>

                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={`/activity/${activity.id}`}
                                className="px-4 py-2 text-sm font-semibold transition-all rounded-full border border-border/50 text-text bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                            >
                                Open
                            </Link>
                            {isFeatured ? (
                                <button
                                    type="button"
                                    onClick={handleUnassign}
                                    disabled={!defaultClassId || assigningId === activity.id}
                                    className={`px-4 py-2 text-white text-sm font-semibold transition-all rounded-full shadow-sm inline-flex items-center justify-center ${!defaultClassId
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-secondary hover:brightness-110 hover:shadow-md hover:-translate-y-0.5'
                                        } ${assigningId === activity.id ? 'opacity-70' : ''}`}
                                >
                                    {assigningId === activity.id ? 'Unassigning...' : 'Unassign'}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleAssign}
                                    disabled={!defaultClassId || assigningId === activity.id}
                                    className={`px-4 py-2 text-white text-sm font-semibold transition-all rounded-full shadow-sm inline-flex items-center justify-center ${!defaultClassId
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-primary hover:brightness-110 hover:shadow-md hover:-translate-y-0.5'
                                        } ${assigningId === activity.id ? 'opacity-70' : ''}`}
                                >
                                    {assigningId === activity.id ? 'Assigning...' : 'Assign'}
                                </button>
                            )}
                            {(isQuiz || isSpeaking) && (
                                <button
                                    type="button"
                                    onClick={handleRelease}
                                    disabled={isReleasing}
                                    className={`px-4 py-2 text-white text-sm font-semibold transition-all rounded-full shadow-sm inline-flex items-center justify-center ${
                                        isReleased
                                            ? 'bg-gray-500 hover:bg-gray-600'
                                            : 'bg-terracotta hover:brightness-110'
                                    } hover:shadow-md hover:-translate-y-0.5 ${isReleasing ? 'opacity-70' : ''}`}
                                    style={{ backgroundColor: isReleased ? undefined : (isSpeaking ? '#e09f3e' : '#c86b51') }}
                                >
                                    {isReleasing ? 'Updating...' : isReleased ? (isSpeaking ? 'Hide' : 'Hide Quiz') : (isSpeaking ? 'Release' : 'Release Quiz')}
                                </button>
                            )}
                        </div>
                        {assignError && (
                            <p className="text-[11px] text-red-600 mt-2">{assignError}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {categories.map((category, idx) => {
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
                        <button
                            onClick={() => toggleCategory(category.name)}
                            onTouchStart={(e) => {
                                e.preventDefault();
                                toggleCategory(category.name);
                            }}
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
                                                        onTouchStart={(e) => {
                                                            e.preventDefault();
                                                            toggleSubCategory(subKey);
                                                        }}
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
                                                            // Has sub-subcategories (like Verb Tenses -> Simple, Continuous, etc.)
                                                            <div className="divide-y divide-border/10">
                                                                {subCategory.subCategories.map((subSubCategory) => {
                                                                    const subSubKey = `${subKey}-${subSubCategory.name}`;
                                                                    const isSubSubExpanded = expandedSubCategories.has(subSubKey);

                                                                    return (
                                                                        <div key={subSubKey}>
                                                                            <button
                                                                                onClick={() => toggleSubCategory(subSubKey)}
                                                                                onTouchStart={(e) => {
                                                                                    e.preventDefault();
                                                                                    toggleSubCategory(subSubKey);
                                                                                }}
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
                                                                                    {subSubCategory.activities.map((activity) => (
                                                                                        <ActivityCard key={activity.id} activity={activity} />
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : subCategory.activities.length > 0 && (
                                                            // No sub-subcategories - show activities directly
                                                            <div className="pl-12 pr-4 pb-4 space-y-2">
                                                                {subCategory.activities.map((activity) => (
                                                                    <ActivityCard key={activity.id} activity={activity} />
                                                                ))}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-4 space-y-2">
                                        {category.activities.length > 0 ? (
                                            category.activities.map((activity) => (
                                                <ActivityCard key={activity.id} activity={activity} />
                                            ))
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
