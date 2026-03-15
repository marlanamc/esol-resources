'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  vocabCycle1,
  vocabUnits,
  displayTitle,
  getVocabUnitNumberFromActivity,
  getVocabThemeChip,
  cleanVocabTerm,
  dedupeVocabTerms,
  extractVocabTermsFromJsonContent,
} from './activity-categories-vocab-utils';
import { getVocabActivityType, VOCAB_CHIP_CONFIG } from '@/lib/vocab-display';
import { resolveActivityGameUi, getActivityPoints } from '@/lib/gamification/activity-points';
import { getGameEmojiForActivity } from '@/lib/game-emoji';
import { ActivityLink } from '@/components/navigation/ActivityLink';
import { GrammarGuideVisual, hasGrammarGuideVisual } from './GrammarGuideVisual';
import { VocabActivityVisual } from './VocabActivityVisual';
import { GameActivityVisual, getGameCardCopy } from './GameActivityVisual';
import { PronunciationActivityVisual, getPronunciationCardCopy } from './PronunciationActivityVisual';
import { getSubcategorySubtitle } from '@/lib/subcategory-labels';

interface Activity {
    id: string;
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    level: string | null;
    ui: string | null;
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
    completedActivityTitles?: Set<string>;
    progressMap?: Record<string, { progress: number; categoryData?: string }>;
    showEmpty?: boolean;
    filterCategory?: string;
}

function isReleasedActivityContent(content?: string): boolean {
    try {
        const parsed = JSON.parse(content || '{}') as { released?: unknown };
        return parsed.released === true;
    } catch {
        return false;
    }
}

const extractVocabTermsFromPlainTextContent = (content: string): string[] => {
    const lines = content.split(/\r?\n/);
    const terms: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const numberedDash = trimmed.match(/^\d+\)\s*(.+?)(?:\s*\([^)]+\))?\s*[—-]\s+/u);
        if (numberedDash?.[1]) {
            terms.push(numberedDash[1]);
            continue;
        }

        // Match "term :: definition" but avoid swallowing JSON/object prefixes.
        const matchPair = trimmed.match(/^([A-Za-z][A-Za-z\s'-]{0,60})\s*::\s+.+$/u);
        if (matchPair?.[1]) {
            terms.push(matchPair[1]);
            continue;
        }

        const answerLine = trimmed.match(/^A:\s*(.+)$/iu);
        if (answerLine?.[1]) {
            terms.push(answerLine[1]);
        }
    }

    return dedupeVocabTerms(terms);
};

const extractVocabTermsFromJsonRawFields = (content: string): string[] => {
    try {
        const parsed = JSON.parse(content) as unknown;
        if (!parsed || typeof parsed !== 'object') return [];

        const obj = parsed as {
            raw?: unknown;
            wordList?: { raw?: unknown };
            flashcards?: { raw?: unknown };
            matching?: { raw?: unknown };
            fillInBlank?: { raw?: unknown };
        };

        const rawFields: unknown[] = [
            obj.raw,
            obj.wordList?.raw,
            obj.flashcards?.raw,
            obj.matching?.raw,
            obj.fillInBlank?.raw,
        ];

        const rawTerms = rawFields.flatMap((rawValue) => {
            if (typeof rawValue !== 'string') return [];
            return extractVocabTermsFromPlainTextContent(rawValue);
        });

        return dedupeVocabTerms(rawTerms);
    } catch {
        return [];
    }
};

const extractVocabTermsFromDescription = (description: string | null): string[] => {
    if (!description) return [];

    // Common monthly/weekly seed format: "Unit X vocabulary: topic. word1, word2, word3"
    const vocabListMatch = description.match(/vocabulary:\s*[^.]*\.\s*(.+)$/i);
    const listText = vocabListMatch?.[1] ?? '';
    if (!listText) return [];

    const terms = listText
        .split(',')
        .map((part) => cleanVocabTerm(part))
        .filter(Boolean);

    return dedupeVocabTerms(terms);
};

const getVocabWordsChip = (activity: Activity): string | null => {
    const isVocabActivity = activity.id.startsWith('vocab-') || activity.category?.toLowerCase() === 'vocabulary';
    if (!isVocabActivity) return null;

    const content = activity.content || '';
    const jsonTerms = extractVocabTermsFromJsonContent(content);
    const jsonRawTerms = jsonTerms.length ? [] : extractVocabTermsFromJsonRawFields(content);
    const textTerms = jsonTerms.length || jsonRawTerms.length ? [] : extractVocabTermsFromPlainTextContent(content);
    const descriptionTerms = jsonTerms.length || jsonRawTerms.length || textTerms.length
        ? []
        : extractVocabTermsFromDescription(activity.description);

    const terms = jsonTerms.length
        ? jsonTerms
        : jsonRawTerms.length
            ? jsonRawTerms
            : textTerms.length
                ? textTerms
                : descriptionTerms;
    if (!terms.length) return null;

    return terms.slice(0, 3).join(', ');
};

const getVerbQuizWordsChip = (activity: Activity): string | null => {
    const isQuizActivity = activity.type === 'quiz' || activity.category?.toLowerCase() === 'quizzes';
    if (!isQuizActivity || !activity.content) return null;

    try {
        const parsed = JSON.parse(activity.content) as unknown;
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

        const obj = parsed as {
            type?: unknown;
            verbs?: unknown;
        };

        const isVerbQuizType = obj.type === 'verb-quiz';
        const isVerbQuizTitle = /\bverb\s+quiz\b/i.test(activity.title ?? '');
        if (!isVerbQuizType && !isVerbQuizTitle) return null;

        const verbsObj = obj.verbs;
        if (!verbsObj || typeof verbsObj !== 'object' || Array.isArray(verbsObj)) return null;

        const keyTerms = Object.keys(verbsObj)
            .map((verb) => cleanVocabTerm(verb))
            .filter(Boolean);

        const valueTerms = Object.values(verbsObj as Record<string, unknown>)
            .map((entry) => {
                if (!entry || typeof entry !== 'object') return null;
                const v1 = (entry as { v1?: unknown }).v1;
                return typeof v1 === 'string' ? cleanVocabTerm(v1) : null;
            })
            .filter((verb): verb is string => Boolean(verb));

        const terms = dedupeVocabTerms(keyTerms.length ? keyTerms : valueTerms);
        if (!terms.length) return null;

        return terms.join(', ');
    } catch {
        return null;
    }
};

const getActivityCardTitle = (activity: Activity): string => {
    const normalizedTitle = displayTitle(activity.title);
    const isVocabActivity = activity.id.startsWith('vocab-') || activity.category?.toLowerCase() === 'vocabulary';
    if (!isVocabActivity) return normalizedTitle;

    // Cycle 1 titles can include both month and theme in the title; keep theme in chip only.
    const cycleOneTitleMatch = normalizedTitle.match(/^(Unit\s+[1-5]\s*:\s*[^:]+):\s*.+$/i);
    if (cycleOneTitleMatch?.[1]) {
        return cycleOneTitleMatch[1].trim();
    }

    return normalizedTitle;
};

interface GrammarChipCopy {
    pattern: RegExp;
    friendlyTitle: string;
    useThisFor: string;
}

const GRAMMAR_CHIP_COPY: GrammarChipCopy[] = [
    { pattern: /\bpresent perfect continuous\b/i, friendlyTitle: 'Talk about duration until now', useThisFor: 'showing ongoing actions up to the present' },
    { pattern: /\bpast perfect continuous\b/i, friendlyTitle: 'Talk about duration before a past event', useThisFor: 'showing how long something happened before another past action' },
    { pattern: /\bfuture perfect continuous\b/i, friendlyTitle: 'Talk about duration until a future time', useThisFor: 'showing ongoing duration up to a future point' },
    { pattern: /\bperfect continuous\b.*\breview\b/i, friendlyTitle: 'Review duration-focused tenses', useThisFor: 'comparing duration-focused tense choices' },
    { pattern: /\bpresent perfect\b/i, friendlyTitle: 'Connect past actions to now', useThisFor: 'life experience and recent results' },
    { pattern: /\bpast perfect\b/i, friendlyTitle: 'Show which past action happened first', useThisFor: 'ordering two past actions clearly' },
    { pattern: /\bfuture perfect\b/i, friendlyTitle: 'Talk about deadlines and completion', useThisFor: 'what will be finished before a future time' },
    { pattern: /\bperfect tenses\b.*\breview\b/i, friendlyTitle: 'Review perfect tenses', useThisFor: 'choosing the right perfect tense by timeline' },
    { pattern: /\bpresent continuous\b/i, friendlyTitle: 'Talk about actions happening now', useThisFor: 'describing actions in progress right now' },
    { pattern: /\bpast continuous\b/i, friendlyTitle: 'Describe actions in progress in the past', useThisFor: 'background actions at a past moment' },
    { pattern: /\bfuture continuous\b/i, friendlyTitle: 'Describe actions in progress in the future', useThisFor: 'actions that will be in progress later' },
    { pattern: /\bcontinuous tenses\b.*\breview\b/i, friendlyTitle: 'Review actions in progress across time', useThisFor: 'comparing present, past, and future continuous' },
    { pattern: /\bpresent simple\b/i, friendlyTitle: 'Talk about daily routines', useThisFor: 'habits, routines, and general facts' },
    { pattern: /\bpast simple\b/i, friendlyTitle: 'Talk about finished past events', useThisFor: 'completed actions in the past' },
    { pattern: /\bfuture simple\b/i, friendlyTitle: 'Talk about future plans', useThisFor: 'plans, predictions, and decisions' },
    { pattern: /\bsimple tenses\b.*\breview\b/i, friendlyTitle: 'Review simple past, present, and future', useThisFor: 'switching between basic time frames' },
    { pattern: /\bsimple\s*&\s*continuous tenses\b.*\breview\b/i, friendlyTitle: 'Review simple and continuous choices', useThisFor: 'choosing between habits and in-progress actions' },
    { pattern: /\ball verb tenses overview\b/i, friendlyTitle: 'Master all verb tenses', useThisFor: 'final tense review in real communication' },
    { pattern: /\bcycle 1 review\b/i, friendlyTitle: 'Review core grammar patterns', useThisFor: 'consolidating the key grammar from cycle 1' },
    { pattern: /\bzero\s*&\s*first conditional/i, friendlyTitle: 'Talk about real situations and results', useThisFor: 'real conditions and likely outcomes' },
    { pattern: /\bsecond\s*&\s*third conditional/i, friendlyTitle: 'Talk about unreal and past hypotheticals', useThisFor: 'imaginary situations and regrets' },
    { pattern: /\bmodals?\b/i, friendlyTitle: 'Give rules, advice, and permission', useThisFor: 'must, should, can, and may in daily life' },
    { pattern: /\binformation questions?\b/i, friendlyTitle: 'Ask clear information questions', useThisFor: 'building accurate WH-questions' },
    { pattern: /\bimperatives?\b|\bdeclaratives?\b/i, friendlyTitle: 'Give instructions and statements', useThisFor: 'commands, advice, and clear statements' },
    { pattern: /\bparts of speech\b/i, friendlyTitle: 'Build stronger sentences', useThisFor: 'understanding nouns, verbs, adjectives, and adverbs' },
    { pattern: /\barticles?\b/i, friendlyTitle: 'Use a, an, and the correctly', useThisFor: 'choosing the right article in context' },
    { pattern: /\bprepositions? of time\s*&\s*place\b/i, friendlyTitle: 'Use prepositions for time and place', useThisFor: 'at, on, in, and location/time phrases' },
    { pattern: /\bgerunds?\b|\binfinitives?\b/i, friendlyTitle: 'Choose gerunds or infinitives', useThisFor: 'verb pattern accuracy after common verbs' },
    { pattern: /\bpassive voice\b/i, friendlyTitle: 'Focus on actions and results', useThisFor: 'when the doer is unknown or less important' },
    { pattern: /\breported speech\b/i, friendlyTitle: 'Report what someone said', useThisFor: 'sharing speech with correct tense changes' },
    { pattern: /\bworkplace phrasal verbs\b/i, friendlyTitle: 'Use common workplace verb phrases', useThisFor: 'everyday work communication' },
    { pattern: /\bsuperlatives?\b|\bquantifiers?\b/i, friendlyTitle: 'Compare things and describe quantity', useThisFor: 'more/most and amount words' },
    { pattern: /\bpunctuation\b|\bcapitalization\b/i, friendlyTitle: 'Improve punctuation and capitalization', useThisFor: 'clearer and more correct writing' },
    { pattern: /\bparagraph format\b/i, friendlyTitle: 'Write clear, organized paragraphs', useThisFor: 'building topic, support, and conclusion' },
    { pattern: /\bused to\b|\bwould rather\b/i, friendlyTitle: 'Talk about past habits and preferences', useThisFor: 'describing old habits and current preferences' },
];

const getGrammarChipCopy = (title: string): { friendlyTitle: string; useThisFor: string } => {
    const normalizedTitle = displayTitle(title).replace(/\s*guide\s*$/i, '').trim();
    const match = GRAMMAR_CHIP_COPY.find(({ pattern }) => pattern.test(normalizedTitle));
    if (match) {
        return {
            friendlyTitle: match.friendlyTitle,
            useThisFor: match.useThisFor,
        };
    }
    return {
        friendlyTitle: 'Practice grammar in context',
        useThisFor: 'clearer speaking and writing',
    };
};

/** Get grammar chip copy for an activity (wrapper for carousel usage) */
const getGrammarChipCopyForActivity = (activity: Activity): { friendlyTitle: string; useThisFor: string } | null => {
    if (activity.category !== 'grammar') return null;
    return getGrammarChipCopy(activity.title);
};

const capitalizeFirstLetter = (value: string): string =>
    value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;

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

const getProgress = (id: string, progressMap?: Record<string, { progress: number; categoryData?: string }>) => {
    const data = progressMap?.[id];
    return data?.progress ?? 0;
};

const isPronunciationPracticeActivity = (activity: Activity) => {
    if (activity.category === 'pronunciation') return true;
    if (activity.type !== 'game') return false;
    const gameUi = resolveActivityGameUi(activity);
    return gameUi === 'ed-pronunciation' || gameUi === 'minimal-pairs';
};

const getDisplayProgress = (
    activity: Activity,
    progressMap: Record<string, { progress: number; categoryData?: string }> | undefined,
    completedActivityIds: Set<string>,
    completedActivityTitles?: Set<string>
) => {
    if (isPronunciationPracticeActivity(activity)) return 0;
    
    // Check if truly completed first (by ID or Title)
    const isGrammarGuide =
        activity.type === "guide" &&
        (activity.category || "").toLowerCase() === "grammar";
    
    const isCompleted = completedActivityIds.has(activity.id) || 
        (isGrammarGuide && activity.title && completedActivityTitles?.has(activity.title.toLowerCase().trim()));

    if (isCompleted) return 100;

    return getProgress(activity.id, progressMap);
};

const isActivityCompleted = (
    activity: Activity,
    completedActivityIds: Set<string>,
    progressMap?: Record<string, { progress: number; categoryData?: string }>,
    completedActivityTitles?: Set<string>
) => {
    if (isPronunciationPracticeActivity(activity)) return false;
    const isGrammarGuide =
        activity.type === "guide" &&
        (activity.category || "").toLowerCase() === "grammar";

    if (isGrammarGuide) {
        // Grammar guides are complete if their ID or Title matches a passing submission
        // OR if ActivityProgress shows 100% complete
        const byId = completedActivityIds.has(activity.id);
        const byTitle = activity.title ? completedActivityTitles?.has(activity.title.toLowerCase().trim()) : false;
        const byProgress = (progressMap?.[activity.id]?.progress ?? 0) >= 100;
        return byId || byTitle || byProgress;
    }
    const progressValue = getDisplayProgress(activity, progressMap, completedActivityIds, completedActivityTitles);
    return completedActivityIds.has(activity.id) || progressValue >= 100;
};

// =============================================================================
// SYNESTHESIA TEXTURE SYSTEM
// Each activity category and sub-type has a unique visual language:
// - Color palette that evokes the concept
// - Pattern/texture that reinforces the meaning
// - Icon that provides quick visual identification
// =============================================================================

type TexturePattern = 'solid' | 'wave' | 'dots' | 'diagonal' | 'mixed' | 'grid' | 'bubbles' | 'lines' | 'pulse' | 'scatter';

interface ActivityTexture {
    id: string;              // Unique identifier
    color: string;           // Primary accent color
    bgColor: string;         // Subtle background tint
    gradient: string;        // CSS gradient for texture
    pattern: TexturePattern;
    icon: string;            // Small visual indicator
}

// -----------------------------------------------------------------------------
// GRAMMAR TENSE TEXTURES
// Visual metaphors for time and aspect
// -----------------------------------------------------------------------------
type TenseFamily = 'simple' | 'continuous' | 'perfect' | 'perfect-continuous' | 'review' | 'grammar-other';

const TENSE_TEXTURES: Record<TenseFamily, ActivityTexture> = {
    simple: {
        id: 'simple',
        color: '#d97757',           // Warm terracotta - grounded, basic
        bgColor: 'rgba(217, 119, 87, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(217, 119, 87, 0.06) 0%, transparent 100%)',
        pattern: 'solid',
        icon: '●',                   // Solid dot - single point in time
    },
    continuous: {
        id: 'continuous',
        color: '#4a90a4',           // Flowing blue - ongoing, in motion
        bgColor: 'rgba(74, 144, 164, 0.04)',
        gradient: 'linear-gradient(90deg, rgba(74, 144, 164, 0.03) 0%, rgba(74, 144, 164, 0.08) 50%, rgba(74, 144, 164, 0.03) 100%)',
        pattern: 'wave',
        icon: '〰',                  // Wave - ongoing action
    },
    perfect: {
        id: 'perfect',
        color: '#7ba884',           // Fresh green - completed, accomplished
        bgColor: 'rgba(123, 168, 132, 0.04)',
        gradient: 'linear-gradient(135deg, transparent 0%, rgba(123, 168, 132, 0.08) 100%)',
        pattern: 'dots',
        icon: '✓',                   // Check - completed connection
    },
    'perfect-continuous': {
        id: 'perfect-continuous',
        color: '#8b7aa8',           // Soft purple - blend of perfect + continuous
        bgColor: 'rgba(139, 122, 168, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(139, 122, 168, 0.05) 0%, rgba(74, 144, 164, 0.05) 100%)',
        pattern: 'diagonal',
        icon: '↻',                   // Cycle - duration leading to now
    },
    review: {
        id: 'review',
        color: '#e09f3e',           // Golden amber - synthesis, mastery
        bgColor: 'rgba(224, 159, 62, 0.04)',
        gradient: 'linear-gradient(45deg, rgba(224, 159, 62, 0.04) 25%, transparent 25%, transparent 75%, rgba(224, 159, 62, 0.04) 75%)',
        pattern: 'mixed',
        icon: '◈',                   // Diamond - bringing it together
    },
    'grammar-other': {
        id: 'grammar-other',
        color: '#9a8478',           // Warm gray-brown
        bgColor: 'rgba(154, 132, 120, 0.03)',
        gradient: 'linear-gradient(135deg, rgba(154, 132, 120, 0.04) 0%, transparent 100%)',
        pattern: 'solid',
        icon: '◦',
    },
};

// -----------------------------------------------------------------------------
// VOCABULARY TEXTURES
// Visual metaphors for words, meaning, and memory
// -----------------------------------------------------------------------------
type VocabFamily = 'flashcard' | 'matching' | 'fill-blank' | 'word-scramble' | 'vocab-unit' | 'vocab-other';

const VOCAB_TEXTURES: Record<VocabFamily, ActivityTexture> = {
    flashcard: {
        id: 'flashcard',
        color: '#1565c0',           // Deep blue - memory, recall
        bgColor: 'rgba(21, 101, 192, 0.04)',
        gradient: 'linear-gradient(180deg, rgba(21, 101, 192, 0.06) 0%, transparent 50%)',
        pattern: 'grid',
        icon: '▢',                   // Card shape
    },
    matching: {
        id: 'matching',
        color: '#7c3aed',           // Vibrant purple - connections
        bgColor: 'rgba(124, 58, 237, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(124, 58, 237, 0.02) 100%)',
        pattern: 'dots',
        icon: '⟷',                   // Connection arrows
    },
    'fill-blank': {
        id: 'fill-blank',
        color: '#0891b2',           // Cyan - filling gaps
        bgColor: 'rgba(8, 145, 178, 0.04)',
        gradient: 'linear-gradient(90deg, transparent 0%, rgba(8, 145, 178, 0.06) 50%, transparent 100%)',
        pattern: 'lines',
        icon: '___',                 // Blank line
    },
    'word-scramble': {
        id: 'word-scramble',
        color: '#ea580c',           // Orange - puzzle, rearrange
        bgColor: 'rgba(234, 88, 12, 0.04)',
        gradient: 'linear-gradient(45deg, rgba(234, 88, 12, 0.03) 0%, rgba(234, 88, 12, 0.06) 100%)',
        pattern: 'scatter',
        icon: '⟲',                   // Shuffle symbol
    },
    'vocab-unit': {
        id: 'vocab-unit',
        color: '#2563eb',           // Royal blue - structured learning
        bgColor: 'rgba(37, 99, 235, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, transparent 100%)',
        pattern: 'grid',
        icon: '📖',
    },
    'vocab-other': {
        id: 'vocab-other',
        color: '#64748b',           // Slate
        bgColor: 'rgba(100, 116, 139, 0.03)',
        gradient: 'linear-gradient(135deg, rgba(100, 116, 139, 0.03) 0%, transparent 100%)',
        pattern: 'solid',
        icon: '○',
    },
};

const VOCAB_UNIT_TEXTURES: Record<number, ActivityTexture> = {
    1: {
        id: 'vocab-unit-1',
        color: '#2563eb',
        bgColor: 'rgba(37, 99, 235, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, transparent 100%)',
        pattern: 'grid',
        icon: '📘',
    },
    2: {
        id: 'vocab-unit-2',
        color: '#0891b2',
        bgColor: 'rgba(8, 145, 178, 0.04)',
        gradient: 'linear-gradient(90deg, rgba(8, 145, 178, 0.04) 0%, rgba(8, 145, 178, 0.09) 50%, rgba(8, 145, 178, 0.04) 100%)',
        pattern: 'wave',
        icon: '📗',
    },
    3: {
        id: 'vocab-unit-3',
        color: '#0d9488',
        bgColor: 'rgba(13, 148, 136, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(13, 148, 136, 0.07) 0%, transparent 100%)',
        pattern: 'dots',
        icon: '📙',
    },
    4: {
        id: 'vocab-unit-4',
        color: '#16a34a',
        bgColor: 'rgba(22, 163, 74, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(22, 163, 74, 0.07) 0%, transparent 100%)',
        pattern: 'solid',
        icon: '📕',
    },
    5: {
        id: 'vocab-unit-5',
        color: '#65a30d',
        bgColor: 'rgba(101, 163, 13, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(101, 163, 13, 0.07) 0%, transparent 100%)',
        pattern: 'diagonal',
        icon: '🏠',
    },
    6: {
        id: 'vocab-unit-6',
        color: '#d97706',
        bgColor: 'rgba(217, 119, 6, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(217, 119, 6, 0.07) 0%, transparent 100%)',
        pattern: 'lines',
        icon: '💼',
    },
    7: {
        id: 'vocab-unit-7',
        color: '#ea580c',
        bgColor: 'rgba(234, 88, 12, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(234, 88, 12, 0.07) 0%, transparent 100%)',
        pattern: 'mixed',
        icon: '🧭',
    },
    8: {
        id: 'vocab-unit-8',
        color: '#dc2626',
        bgColor: 'rgba(220, 38, 38, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(220, 38, 38, 0.07) 0%, transparent 100%)',
        pattern: 'pulse',
        icon: '🩺',
    },
    9: {
        id: 'vocab-unit-9',
        color: '#c026d3',
        bgColor: 'rgba(192, 38, 211, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(192, 38, 211, 0.07) 0%, transparent 100%)',
        pattern: 'bubbles',
        icon: '🌿',
    },
    10: {
        id: 'vocab-unit-10',
        color: '#7c3aed',
        bgColor: 'rgba(124, 58, 237, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.07) 0%, transparent 100%)',
        pattern: 'scatter',
        icon: '🎓',
    },
};

const getVocabTextureByActivity = (activity: Activity): ActivityTexture | undefined => {
    const vocabType = detectVocabType(activity.id, activity.title);
    if (vocabType !== 'vocab-unit') {
        return VOCAB_TEXTURES[vocabType];
    }

    const unitNumber = getVocabUnitNumberFromActivity(activity);
    if (unitNumber && VOCAB_UNIT_TEXTURES[unitNumber]) {
        return VOCAB_UNIT_TEXTURES[unitNumber];
    }

    return VOCAB_TEXTURES['vocab-unit'];
};

const getVocabTextureBySection = (sectionLabel: string): ActivityTexture | undefined => {
    const unitMatch = sectionLabel.match(/unit\s+(\d+)/i);
    if (unitMatch?.[1]) {
        const unitNumber = Number.parseInt(unitMatch[1], 10);
        if (Number.isFinite(unitNumber) && VOCAB_UNIT_TEXTURES[unitNumber]) {
            return VOCAB_UNIT_TEXTURES[unitNumber];
        }
    }

    if (sectionLabel.toLowerCase().includes('cycle 1')) {
        return VOCAB_UNIT_TEXTURES[1];
    }

    return undefined;
};

// -----------------------------------------------------------------------------
// GAMES TEXTURES
// Visual metaphors for play, challenge, and fun
// -----------------------------------------------------------------------------
type GameFamily =
    | 'numbers'
    | 'verb-forms'
    | 'irregular-patterns'
    | 'time-indicators'
    | 'sound-choice'
    | 'countable-sort'
    | 'matching-game'
    | 'game-other';

const GAME_TEXTURES: Record<GameFamily, ActivityTexture> = {
    numbers: {
        id: 'numbers',
        color: '#b692e6',           // Lavender - number system / category color
        bgColor: 'rgba(182, 146, 230, 0.05)',
        gradient: 'linear-gradient(135deg, rgba(182, 146, 230, 0.08) 0%, rgba(182, 146, 230, 0.02) 100%)',
        pattern: 'pulse',
        icon: '🔢',
    },
    'verb-forms': {
        id: 'verb-forms',
        color: '#7ba884',           // Sage - verb tense games section color
        bgColor: 'rgba(123, 168, 132, 0.05)',
        gradient: 'linear-gradient(90deg, rgba(123, 168, 132, 0.04) 0%, rgba(123, 168, 132, 0.1) 50%, rgba(123, 168, 132, 0.04) 100%)',
        pattern: 'wave',
        icon: '🔄',
    },
    'irregular-patterns': {
        id: 'irregular-patterns',
        color: '#7ba884',
        bgColor: 'rgba(123, 168, 132, 0.05)',
        gradient: 'linear-gradient(135deg, rgba(123, 168, 132, 0.07) 0%, transparent 100%)',
        pattern: 'diagonal',
        icon: '🧩',
    },
    'time-indicators': {
        id: 'time-indicators',
        color: '#7ba884',
        bgColor: 'rgba(123, 168, 132, 0.05)',
        gradient: 'linear-gradient(135deg, rgba(123, 168, 132, 0.04) 0%, rgba(123, 168, 132, 0.09) 100%)',
        pattern: 'lines',
        icon: '⏰',
    },
    'sound-choice': {
        id: 'sound-choice',
        color: '#7ba884',
        bgColor: 'rgba(123, 168, 132, 0.05)',
        gradient: 'linear-gradient(135deg, rgba(123, 168, 132, 0.04) 0%, rgba(123, 168, 132, 0.08) 100%)',
        pattern: 'bubbles',
        icon: '🔊',
    },
    'countable-sort': {
        id: 'countable-sort',
        color: '#9ec3e2',           // Powder blue - parts of speech section color
        bgColor: 'rgba(158, 195, 226, 0.05)',
        gradient: 'linear-gradient(135deg, rgba(158, 195, 226, 0.08) 0%, rgba(158, 195, 226, 0.02) 100%)',
        pattern: 'grid',
        icon: '🧺',
    },
    'matching-game': {
        id: 'matching-game',
        color: '#9ec3e2',
        bgColor: 'rgba(158, 195, 226, 0.05)',
        gradient: 'linear-gradient(135deg, rgba(158, 195, 226, 0.08) 0%, transparent 100%)',
        pattern: 'dots',
        icon: '🎯',
    },
    'game-other': {
        id: 'game-other',
        color: '#f59e0b',           // Amber - playful
        bgColor: 'rgba(245, 158, 11, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, transparent 100%)',
        pattern: 'bubbles',
        icon: '🎮',
    },
};

// -----------------------------------------------------------------------------
// QUIZZES TEXTURES
// Visual metaphors for testing and achievement
// -----------------------------------------------------------------------------
type QuizFamily = 'weekly-quiz' | 'assessment' | 'quiz-other';

const QUIZ_TEXTURES: Record<QuizFamily, ActivityTexture> = {
    'weekly-quiz': {
        id: 'weekly-quiz',
        color: '#be123c',           // Rose - important, graded
        bgColor: 'rgba(190, 18, 60, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(190, 18, 60, 0.05) 0%, rgba(244, 63, 94, 0.03) 100%)',
        pattern: 'diagonal',
        icon: '📋',
    },
    assessment: {
        id: 'assessment',
        color: '#9333ea',           // Purple - evaluation
        bgColor: 'rgba(147, 51, 234, 0.04)',
        gradient: 'linear-gradient(180deg, rgba(147, 51, 234, 0.05) 0%, transparent 100%)',
        pattern: 'lines',
        icon: '✎',
    },
    'quiz-other': {
        id: 'quiz-other',
        color: '#c2410c',           // Burnt orange
        bgColor: 'rgba(194, 65, 12, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(194, 65, 12, 0.04) 0%, transparent 100%)',
        pattern: 'solid',
        icon: '✎',
    },
};

// -----------------------------------------------------------------------------
// SPEAKING TEXTURES
// Visual metaphors for voice and communication
// -----------------------------------------------------------------------------
type SpeakingFamily = 'pronunciation' | 'conversation' | 'speaking-other';
type PronunciationFamily = 'minimal-pairs' | 'ed-sounds' | 'pronunciation-other';

const SPEAKING_TEXTURES: Record<SpeakingFamily, ActivityTexture> = {
    pronunciation: {
        id: 'pronunciation',
        color: '#db2777',           // Pink - distinct sound category
        bgColor: 'rgba(219, 39, 119, 0.05)',
        gradient: 'linear-gradient(90deg, rgba(219, 39, 119, 0.02) 0%, rgba(236, 72, 153, 0.07) 35%, rgba(236, 72, 153, 0.07) 65%, rgba(219, 39, 119, 0.02) 100%)',
        pattern: 'wave',
        icon: '🔊',
    },
    conversation: {
        id: 'conversation',
        color: '#0d9488',           // Teal - dialogue, exchange
        bgColor: 'rgba(13, 148, 136, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(13, 148, 136, 0.05) 0%, rgba(6, 182, 212, 0.03) 100%)',
        pattern: 'bubbles',
        icon: '💬',
    },
    'speaking-other': {
        id: 'speaking-other',
        color: '#f97316',           // Bright orange
        bgColor: 'rgba(249, 115, 22, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.04) 0%, transparent 100%)',
        pattern: 'solid',
        icon: '🎤',
    },
};

const PRONUNCIATION_TEXTURES: Record<PronunciationFamily, ActivityTexture> = {
    'minimal-pairs': {
        id: 'minimal-pairs',
        color: '#4f46e5',
        bgColor: 'rgba(79, 70, 229, 0.05)',
        gradient: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(79, 70, 229, 0.02) 100%)',
        pattern: 'pulse',
        icon: '◉',
    },
    'ed-sounds': {
        id: 'ed-sounds',
        color: '#db2777',
        bgColor: 'rgba(219, 39, 119, 0.05)',
        gradient: 'linear-gradient(90deg, rgba(219, 39, 119, 0.03) 0%, rgba(236, 72, 153, 0.08) 50%, rgba(219, 39, 119, 0.03) 100%)',
        pattern: 'dots',
        icon: '〰',
    },
    'pronunciation-other': {
        id: 'pronunciation-other',
        color: '#f472b6',
        bgColor: 'rgba(244, 114, 182, 0.05)',
        gradient: 'linear-gradient(135deg, rgba(244, 114, 182, 0.06) 0%, transparent 100%)',
        pattern: 'bubbles',
        icon: '🔊',
    },
};

// -----------------------------------------------------------------------------
// WRITING TEXTURES
// Visual metaphors for composition and expression
// -----------------------------------------------------------------------------
type WritingFamily = 'paragraph' | 'sentence' | 'writing-other';

const WRITING_TEXTURES: Record<WritingFamily, ActivityTexture> = {
    paragraph: {
        id: 'paragraph',
        color: '#4f46e5',           // Indigo - depth, structure
        bgColor: 'rgba(79, 70, 229, 0.04)',
        gradient: 'linear-gradient(180deg, rgba(79, 70, 229, 0.05) 0%, transparent 100%)',
        pattern: 'lines',
        icon: '¶',
    },
    sentence: {
        id: 'sentence',
        color: '#0284c7',           // Sky blue - clarity
        bgColor: 'rgba(2, 132, 199, 0.04)',
        gradient: 'linear-gradient(90deg, rgba(2, 132, 199, 0.04) 0%, transparent 100%)',
        pattern: 'lines',
        icon: '—',
    },
    'writing-other': {
        id: 'writing-other',
        color: '#475569',           // Slate - ink
        bgColor: 'rgba(71, 85, 105, 0.04)',
        gradient: 'linear-gradient(135deg, rgba(71, 85, 105, 0.04) 0%, transparent 100%)',
        pattern: 'solid',
        icon: '✏',
    },
};

// -----------------------------------------------------------------------------
// TEXTURE DETECTION FUNCTIONS
// -----------------------------------------------------------------------------

// Detect tense family from activity title (for grammar)
const detectTenseFamily = (title: string): TenseFamily => {
    const t = title.toLowerCase();

    // Check specific tense families FIRST (before "review" check)
    // This ensures "Continuous Tenses Review" gets continuous color, not review color
    if (t.includes('perfect continuous') || t.includes('perfect progressive')) {
        return 'perfect-continuous';
    }
    if (t.includes('perfect') && !t.includes('continuous') && !t.includes('progressive')) {
        return 'perfect';
    }
    if ((t.includes('continuous') || t.includes('progressive')) && !t.includes('perfect')) {
        return 'continuous';
    }
    if (t.includes('simple')) {
        return 'simple';
    }
    // Only use "review" style for generic reviews that don't specify a tense family
    if (t.includes('review') || t.includes(' vs ') || t.includes('mixed')) {
        return 'review';
    }
    return 'grammar-other';
};

// Detect vocab activity type
const detectVocabType = (activityId: string, title: string): VocabFamily => {
    const id = activityId.toLowerCase();
    const t = title.toLowerCase();

    if (id.includes('flashcard') || t.includes('flashcard')) return 'flashcard';
    if (id.includes('matching') || t.includes('matching')) return 'matching';
    if (id.includes('fill') || t.includes('fill in') || t.includes('fill-in')) return 'fill-blank';
    if (id.includes('scramble') || t.includes('scramble')) return 'word-scramble';
    if (id.startsWith('vocab-')) return 'vocab-unit';
    return 'vocab-other';
};

// Detect game type
const detectGameType = (activityId: string, ui: string | null): GameFamily => {
    const id = activityId.toLowerCase();

    if (id === 'numbers-game') return 'numbers';
    if (ui === 'verb-forms' || ui === 'verbforms') return 'verb-forms';
    if (id.includes('irregular')) return 'irregular-patterns';
    if (id.includes('time-indicator')) return 'time-indicators';
    if (id.includes('sounds-right') || id.includes('sound') || id.includes('pronunciation')) return 'sound-choice';
    if (id.includes('countable') || id.includes('uncountable')) return 'countable-sort';
    if (id.includes('matching') || id.includes('match')) return 'matching-game';
    return 'game-other';
};

// Detect quiz type
const detectQuizType = (title: string): QuizFamily => {
    const t = title.toLowerCase();

    if (t.includes('week')) return 'weekly-quiz';
    if (t.includes('assessment') || t.includes('test')) return 'assessment';
    return 'quiz-other';
};

// Detect speaking type
const detectSpeakingType = (title: string): SpeakingFamily => {
    const t = title.toLowerCase();

    if (t.includes('pronuncia') || t.includes('sound')) return 'pronunciation';
    if (t.includes('conversation') || t.includes('dialogue') || t.includes('talk')) return 'conversation';
    return 'speaking-other';
};

const detectPronunciationType = (activityId: string, title: string, ui: string | null): PronunciationFamily => {
    const haystack = `${activityId} ${title} ${ui ?? ''}`.toLowerCase();

    if (haystack.includes('minimal-pairs') || haystack.includes('minimal pairs')) return 'minimal-pairs';
    if (haystack.includes('ed-pronunciation') || haystack.includes('ed sounds') || haystack.includes('-ed')) return 'ed-sounds';
    return 'pronunciation-other';
};

// Detect writing type
const detectWritingType = (title: string): WritingFamily => {
    const t = title.toLowerCase();

    if (t.includes('paragraph')) return 'paragraph';
    if (t.includes('sentence')) return 'sentence';
    return 'writing-other';
};

// Master function to get texture for any activity
const getActivityTexture = (activity: Activity, sectionLabel?: string): ActivityTexture | undefined => {
    const category = activity.category?.toLowerCase() || '';
    const type = activity.type?.toLowerCase() || '';

    // Grammar activities
    if (category === 'grammar') {
        const family = detectTenseFamily(activity.title);
        if (family !== 'grammar-other') {
            return TENSE_TEXTURES[family];
        }
        // Try section label for non-tense grammar
        if (sectionLabel) {
            const sectionFamily = detectTenseFamily(sectionLabel);
            if (sectionFamily !== 'grammar-other') {
                return TENSE_TEXTURES[sectionFamily];
            }
        }
        return TENSE_TEXTURES['grammar-other'];
    }

    // Vocabulary activities
    if (category === 'vocabulary' || activity.id?.startsWith('vocab-')) {
        // Use per-activity unit texture so cards can vary within a section (e.g., Cycle 1).
        return getVocabTextureByActivity(activity);
    }

    // Pronunciation activities
    if (category === 'pronunciation' || activity.ui === 'ed-pronunciation' || activity.ui === 'minimal-pairs') {
        const pronunciationType = detectPronunciationType(activity.id, activity.title, activity.ui);
        return PRONUNCIATION_TEXTURES[pronunciationType];
    }

    // Game activities
    if (type === 'game' || category === 'games') {
        const gameType = detectGameType(activity.id, activity.ui);
        return GAME_TEXTURES[gameType];
    }

    // Quiz activities
    if (category === 'quizzes' || type === 'quiz') {
        const quizType = detectQuizType(activity.title);
        return QUIZ_TEXTURES[quizType];
    }

    // Speaking activities
    if (category === 'speaking') {
        const speakingType = detectSpeakingType(activity.title);
        return SPEAKING_TEXTURES[speakingType];
    }

    // Writing activities
    if (category === 'writing' || category === 'writing-reading') {
        const writingType = detectWritingType(activity.title);
        return WRITING_TEXTURES[writingType];
    }

    return undefined;
};

// Get texture for a section label (used in section headers)
const getSectionTexture = (sectionLabel: string, filterCategory?: string): ActivityTexture | undefined => {
    const label = sectionLabel.toLowerCase();

    // Grammar section textures
    if (filterCategory === 'grammar') {
        if (label.includes('simple')) return TENSE_TEXTURES.simple;
        if (label.includes('perfect continuous')) return TENSE_TEXTURES['perfect-continuous'];
        if (label.includes('continuous')) return TENSE_TEXTURES.continuous;
        if (label.includes('perfect')) return TENSE_TEXTURES.perfect;
        if (label.includes('review') || label.includes('mixed')) return TENSE_TEXTURES.review;
        return TENSE_TEXTURES['grammar-other'];
    }

    // Vocabulary section textures
    if (filterCategory === 'vocabulary') {
        const vocabSectionTexture = getVocabTextureBySection(sectionLabel);
        if (vocabSectionTexture) return vocabSectionTexture;
        if (label.includes('cycle 1')) return VOCAB_TEXTURES['vocab-unit'];
        if (label.includes('unit')) return VOCAB_TEXTURES['vocab-unit'];
        return VOCAB_TEXTURES['vocab-other'];
    }

    // Quiz section textures
    if (filterCategory === 'quizzes') {
        if (label.includes('week')) return QUIZ_TEXTURES['weekly-quiz'];
        return QUIZ_TEXTURES['quiz-other'];
    }

    // Game section textures
    if (filterCategory === 'games') {
        if (label.includes('verb tense')) return GAME_TEXTURES['verb-forms'];
        if (label.includes('parts of speech')) return GAME_TEXTURES['countable-sort'];
        if (label.includes('numbers')) return GAME_TEXTURES['numbers'];
        return GAME_TEXTURES['game-other'];
    }

    return undefined;
};

/** Wrapper for carousel card texture - uses sectionLabel for tense detection */
const getActivityTextureForCard = (
    activity: Activity,
    sectionLabel: string
): ActivityTexture | undefined => {
    return getActivityTexture(activity, sectionLabel);
};

// Legacy type alias for backward compatibility
type TenseTexture = ActivityTexture;

interface ActivityCardProps {
    activity: Activity;
    isCompleted: boolean;
    progressValue: number;
    progressText: string | null;
    accentColor?: string;
    hideTypeChip?: boolean;
    points?: number;
    tenseTexture?: TenseTexture;
    vocabType: ReturnType<typeof getVocabActivityType>;
    vocabUnitNumber: number | null;
    vocabThemeChip: string | null;
    vocabWordsChip: string | null;
    verbQuizWordsChip: string | null;
    activityCardTitle: string;
    grammarChipCopy: { friendlyTitle: string; useThisFor: string } | null;
    gameEmoji: string | null;
    showDecorativeTexture: boolean;
}

const getCategoryProgressText = (activityId: string, progressMap?: Record<string, { progress: number; categoryData?: string }>) => {
    const data = progressMap?.[activityId];
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

const ActivityCard = React.memo(function ActivityCard({
    activity,
    isCompleted,
    progressValue,
    progressText,
    accentColor,
    hideTypeChip,
    points,
    tenseTexture,
    vocabType,
    vocabUnitNumber,
    vocabThemeChip,
    vocabWordsChip,
    verbQuizWordsChip,
    activityCardTitle,
    grammarChipCopy,
    gameEmoji,
    showDecorativeTexture,
}: ActivityCardProps) {
    const progressChipLabel = activity.id === 'numbers-game' && progressText
        ? progressText
        : `${progressValue}% done`;
    const isVocabularyCard = activity.id.startsWith('vocab-') || activity.category?.toLowerCase() === 'vocabulary';
    const isGameCard = activity.type === 'game' || activity.category?.toLowerCase() === 'games';

    // Determine card state for styling
    const hasProgress = progressValue > 0 && progressValue < 100;
    const showCompletedState = isCompleted && !isGameCard;
    const showProgressState = hasProgress && !isGameCard;

    // Use tense texture color if provided, otherwise fall back to defaults
    const accentBorderColor = tenseTexture?.color || (showCompletedState ? undefined : accentColor);

    return (
        <div
            className={`group relative block rounded-xl border bg-white p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 overflow-hidden
                ${showCompletedState
                    ? 'border-secondary/30 shadow-sm'
                    : showProgressState
                        ? 'shadow-sm hover:shadow-md hover:-translate-y-0.5'
                        : 'shadow-sm hover:shadow-md hover:-translate-y-0.5'
                }`}
            style={{
                borderColor: showCompletedState ? undefined : (accentBorderColor ? `${accentBorderColor}40` : undefined),
                contentVisibility: 'auto',
                containIntrinsicSize: '160px',
            }}
        >
            {/* Tense texture background pattern */}
            {tenseTexture && !showCompletedState && (
                <div
                    className="absolute inset-0 pointer-events-none opacity-60"
                    style={{ background: tenseTexture.gradient }}
                />
            )}

            {/* Wave pattern overlay for continuous tenses */}
            {showDecorativeTexture && tenseTexture?.pattern === 'wave' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`wave-${activity.id}`} x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
                            <path
                                d="M0 10 Q10 0, 20 10 T40 10"
                                fill="none"
                                stroke={tenseTexture.color}
                                strokeWidth="2"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#wave-${activity.id})`} />
                </svg>
            )}

            {/* Dots pattern for perfect tenses */}
            {showDecorativeTexture && tenseTexture?.pattern === 'dots' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.12]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`dots-${activity.id}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                            <circle cx="8" cy="8" r="1.5" fill={tenseTexture.color} />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#dots-${activity.id})`} />
                </svg>
            )}

            {/* Diagonal lines for perfect continuous */}
            {showDecorativeTexture && tenseTexture?.pattern === 'diagonal' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`diagonal-${activity.id}`} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                            <path d="M0 12 L12 0" stroke={tenseTexture.color} strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#diagonal-${activity.id})`} />
                </svg>
            )}

            {/* Mixed pattern for reviews */}
            {showDecorativeTexture && tenseTexture?.pattern === 'mixed' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`mixed-${activity.id}`} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                            <circle cx="6" cy="6" r="1" fill={tenseTexture.color} />
                            <circle cx="18" cy="18" r="1" fill={tenseTexture.color} />
                            <path d="M12 0 L12 24" stroke={tenseTexture.color} strokeWidth="0.5" strokeDasharray="2,4" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#mixed-${activity.id})`} />
                </svg>
            )}

            {/* Grid pattern for vocab flashcards */}
            {showDecorativeTexture && tenseTexture?.pattern === 'grid' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`grid-${activity.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M20 0 L0 0 0 20" fill="none" stroke={tenseTexture.color} strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#grid-${activity.id})`} />
                </svg>
            )}

            {/* Bubbles pattern for speaking/conversation */}
            {showDecorativeTexture && tenseTexture?.pattern === 'bubbles' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`bubbles-${activity.id}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                            <circle cx="5" cy="5" r="3" fill="none" stroke={tenseTexture.color} strokeWidth="0.8" />
                            <circle cx="20" cy="18" r="4" fill="none" stroke={tenseTexture.color} strokeWidth="0.8" />
                            <circle cx="12" cy="25" r="2" fill="none" stroke={tenseTexture.color} strokeWidth="0.6" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#bubbles-${activity.id})`} />
                </svg>
            )}

            {/* Lines pattern for writing */}
            {showDecorativeTexture && tenseTexture?.pattern === 'lines' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`lines-${activity.id}`} x="0" y="0" width="100" height="12" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="11" x2="100" y2="11" stroke={tenseTexture.color} strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#lines-${activity.id})`} />
                </svg>
            )}

            {/* Pulse pattern for games (concentric circles) */}
            {showDecorativeTexture && tenseTexture?.pattern === 'pulse' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`pulse-${activity.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="6" fill="none" stroke={tenseTexture.color} strokeWidth="0.8" />
                            <circle cx="20" cy="20" r="12" fill="none" stroke={tenseTexture.color} strokeWidth="0.5" />
                            <circle cx="20" cy="20" r="18" fill="none" stroke={tenseTexture.color} strokeWidth="0.3" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#pulse-${activity.id})`} />
                </svg>
            )}

            {/* Scatter pattern for word scramble */}
            {showDecorativeTexture && tenseTexture?.pattern === 'scatter' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`scatter-${activity.id}`} x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                            <rect x="2" y="4" width="4" height="4" rx="1" fill={tenseTexture.color} transform="rotate(15 4 6)" />
                            <rect x="18" y="2" width="3" height="3" rx="0.5" fill={tenseTexture.color} transform="rotate(-10 19.5 3.5)" />
                            <rect x="8" y="20" width="5" height="5" rx="1" fill={tenseTexture.color} transform="rotate(25 10.5 22.5)" />
                            <rect x="24" y="22" width="3" height="3" rx="0.5" fill={tenseTexture.color} transform="rotate(-20 25.5 23.5)" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#scatter-${activity.id})`} />
                </svg>
            )}

            {/* Progress background fill */}
            {showProgressState && (
                <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                        background: tenseTexture
                            ? `linear-gradient(90deg, ${tenseTexture.color}08 0%, transparent 100%)`
                            : 'linear-gradient(90deg, rgba(217, 119, 87, 0.03) 0%, transparent 100%)',
                        width: `${Math.min(progressValue, 100)}%`
                    }}
                />
            )}

            {/* Completed state background */}
            {showCompletedState && (
                <div className="absolute inset-0 rounded-xl bg-secondary/[0.04] pointer-events-none" />
            )}

            {showCompletedState && (
                <div className="absolute top-3 right-3 z-20">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            )}

            <div className="flex items-start gap-3 relative z-10">
                {gameEmoji ? (
                    <span className="mt-0.5 text-xl flex-shrink-0">
                        {gameEmoji}
                    </span>
                ) : tenseTexture ? (
                    <span
                        className="mt-1 text-sm flex-shrink-0 font-medium select-none"
                        style={{ color: showCompletedState ? 'var(--secondary)' : tenseTexture.color }}
                        title={tenseTexture.id}
                    >
                        {tenseTexture.icon}
                    </span>
                ) : (
                    <span
                        className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${
                            isCompleted
                                ? 'bg-secondary'
                                : hasProgress
                                    ? 'bg-primary'
                                    : 'bg-gray-300'
                        }`}
                    />
                )}
                <div className="flex-1 min-w-0">
                    <ActivityLink
                        activityId={activity.id}
                        className={`text-sm font-semibold leading-snug group-hover:text-primary transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:rounded ${
                            showCompletedState ? 'text-secondary' : 'text-text'
                        }`}
                    >
                        {activityCardTitle}
                    </ActivityLink>
                    {isVocabularyCard && (
                        <div className="mt-2 -mx-1">
                            <VocabActivityVisual
                                activityId={activity.id}
                                title={activity.title}
                                unitNumber={vocabUnitNumber}
                            />
                        </div>
                    )}
                    <div className="mt-2 flex items-start gap-2 text-xs text-text-muted">
                        <div className="flex flex-1 min-w-0 flex-wrap items-center gap-2">
                            {vocabThemeChip && (
                                <span
                                    className="px-2 py-0.5 rounded-full border font-medium text-[11px]"
                                    style={{
                                        backgroundColor: `${tenseTexture?.color ?? '#2563eb'}08`,
                                        borderColor: `${tenseTexture?.color ?? '#2563eb'}2A`,
                                        color: tenseTexture?.color ?? '#1e3a8a',
                                    }}
                                >
                                    {capitalizeFirstLetter(vocabThemeChip)}
                                </span>
                            )}
                            {vocabWordsChip && (
                                <span
                                    className="px-2 py-0.5 rounded-full border font-medium text-[11px]"
                                    style={{
                                        backgroundColor: `${tenseTexture?.color ?? '#2563eb'}12`,
                                        borderColor: `${tenseTexture?.color ?? '#2563eb'}30`,
                                        color: tenseTexture?.color ?? '#1e3a8a',
                                    }}
                                >
                                    {vocabWordsChip}
                                </span>
                            )}
                            {verbQuizWordsChip && (
                                <span
                                    className="px-2 py-0.5 rounded-full border font-medium text-[11px]"
                                    style={{
                                        backgroundColor: `${tenseTexture?.color ?? '#15803d'}12`,
                                        borderColor: `${tenseTexture?.color ?? '#15803d'}30`,
                                        color: tenseTexture?.color ?? '#166534',
                                    }}
                                >
                                    {verbQuizWordsChip}
                                </span>
                            )}
                            {grammarChipCopy && (
                                <span
                                    className="px-2 py-0.5 rounded-full font-semibold text-[11px]"
                                    style={{
                                        backgroundColor: `${tenseTexture?.color ?? '#64748b'}14`,
                                        color: tenseTexture?.color ?? '#475569',
                                    }}
                                >
                                    {grammarChipCopy.friendlyTitle}
                                </span>
                            )}
                            {!hideTypeChip && (
                                vocabType ? (
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border ${VOCAB_CHIP_CONFIG[vocabType].className}`}
                                    >
                                        {VOCAB_CHIP_CONFIG[vocabType].icon} {VOCAB_CHIP_CONFIG[vocabType].label}
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-semibold rounded-full text-[10px] uppercase tracking-wide">
                                        {activity.type}
                                    </span>
                                )
                            )}
                            {points !== undefined && points > 0 && !showCompletedState && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-[11px]">
                                    +{points} pts
                                </span>
                            )}
                        </div>
                        {showProgressState && (
                            <span className="ml-auto shrink-0 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px]">
                                {progressChipLabel}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress bar - now more subtle and integrated */}
            {showProgressState && (
                <div className="mt-3 h-1.5 bg-gray-200/50 rounded-full overflow-hidden relative z-10 border border-gray-200/30">
                    <div
                        className="h-full bg-primary/80 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(var(--primary-rgb),0.2)]"
                        style={{ width: `${Math.min(progressValue, 100)}%` }}
                    />
                </div>
            )}
        </div>
    );
});

const DesktopCarousel = React.memo(function DesktopCarousel({
    children,
    ariaLabel,
}: {
    children: React.ReactNode;
    ariaLabel: string;
}) {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        const maxScrollLeft = el.scrollWidth - el.clientWidth;
        setCanScrollLeft(el.scrollLeft > 8);
        setCanScrollRight(maxScrollLeft > 8 && el.scrollLeft < maxScrollLeft - 8);
    }, []);

    useEffect(() => {
        updateScrollState();
        const el = scrollRef.current;
        if (!el) return;

        el.addEventListener('scroll', updateScrollState, { passive: true });
        window.addEventListener('resize', updateScrollState);

        return () => {
            el.removeEventListener('scroll', updateScrollState);
            window.removeEventListener('resize', updateScrollState);
        };
    }, [children, updateScrollState]);

    const scrollByPage = useCallback((direction: -1 | 1) => {
        const el = scrollRef.current;
        if (!el) return;

        el.scrollBy({
            left: el.clientWidth * 0.82 * direction,
            behavior: 'smooth',
        });
    }, []);

    return (
        <div className="relative">
            <div ref={scrollRef} className="activity-carousel">
                {children}
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden lg:block">
                <button
                    type="button"
                    aria-label={`Scroll ${ariaLabel} left`}
                    onClick={() => scrollByPage(-1)}
                    className={`pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 h-10 w-10 rounded-full border bg-white/95 shadow-md transition-all ${
                        canScrollLeft ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ borderColor: 'rgba(15, 23, 42, 0.08)', color: 'var(--text-color)' }}
                >
                    <span aria-hidden="true" className="text-lg leading-none">‹</span>
                </button>

                <button
                    type="button"
                    aria-label={`Scroll ${ariaLabel} right`}
                    onClick={() => scrollByPage(1)}
                    className={`pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 h-10 w-10 rounded-full border bg-white/95 shadow-md transition-all ${
                        canScrollRight ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ borderColor: 'rgba(15, 23, 42, 0.08)', color: 'var(--text-color)' }}
                >
                    <span aria-hidden="true" className="text-lg leading-none">›</span>
                </button>
            </div>
        </div>
    );
});

interface ActivityCardMeta {
    isCompleted: boolean;
    progressValue: number;
    progressText: string | null;
    vocabType: ReturnType<typeof getVocabActivityType>;
    vocabUnitNumber: number | null;
    vocabThemeChip: string | null;
    vocabWordsChip: string | null;
    verbQuizWordsChip: string | null;
    activityCardTitle: string;
    grammarChipCopy: { friendlyTitle: string; useThisFor: string } | null;
    gameCardCopy: { friendlyTitle: string; useThisFor: string } | null;
    points?: number;
    gameEmoji: string | null;
}

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

            if (
                activity.type === 'game' &&
                !isVocab &&
                (
                    activity.id === 'numbers-game' ||
                    activity.id === 'countable-uncountable-nouns' ||
                    activity.ui === 'verb-forms' ||
                    activity.ui === 'verbforms' ||
                    category === 'games'
                )
            ) {
                games.push(activity);
            }

            if (category === 'reading' || category === 'writing-reading') {
                reading.push(activity);
            }

            if (category === 'writing' || category === 'writing-reading') {
                writing.push(activity);
            }

            if (category === 'pronunciation' || activity.ui === 'ed-pronunciation' || activity.ui === 'minimal-pairs') {
                pronunciation.push(activity);
            }

            if (category === 'speaking' && isReleasedActivityContent(activity.content)) {
                speaking.push(activity);
            }

            if (category === 'quizzes' && isReleasedActivityContent(activity.content)) {
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

        return {
            vocabById,
            games: sortedGames,
            reading,
            writing,
            pronunciation,
            speaking: sortedSpeaking,
            quizzes: sortedQuizzes,
        };
    }, [activities]);

    const buildGameSubCategories = useCallback((): SubCategory[] => {
        const gameActivities = activityIndex.games;
        const normalizeTitle = (title?: string | null) => displayTitle(title || "").toLowerCase();
        const remaining = [...gameActivities];

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

        const sortAlpha = (list: Activity[]) =>
            list.sort((a, b) => displayTitle(a.title || "").localeCompare(displayTitle(b.title || "")));

        const verbTenseGames = sortAlpha(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return (
                    t.includes('verb forms') ||
                    t.includes('irregular') ||
                    t.includes('time indicators') ||
                    t.includes('sounds right')
                );
            })
        );

        const partsOfSpeechGames = sortAlpha(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('countable') || t.includes('uncountable');
            })
        );

        const gerundInfinitiveGames = sortAlpha(
            take((a: Activity) => {
                const t = normalizeTitle(a.title);
                return t.includes('gerund') || t.includes('infinitive');
            })
        );

        const numberGames = sortAlpha(
            take((a: Activity) => a.id === 'numbers-game' || normalizeTitle(a.title).includes('numbers'))
        );

        const otherGames = sortAlpha(remaining);

        return [
            { name: 'Verb Tense Games', activities: verbTenseGames },
            { name: 'Gerunds and Infinitives', activities: gerundInfinitiveGames },
            { name: 'Parts of Speech Games', activities: partsOfSpeechGames },
            { name: 'Numbers', activities: numberGames },
            { name: 'Other Games', activities: otherGames },
        ].filter((group) => group.activities.length > 0);
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
                    {
                        name: 'Cycle 1',
                        activities: vocabCycle1
                            .map((month) => activityIndex.vocabById.get(`vocab-${month.id}`))
                            .filter((activity): activity is Activity => Boolean(activity))
                    },
                    ...vocabUnits.map(unit => {
                        // Create a sub-category for each unit (6-10) with all week activities flattened
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
                                            const grammarCopy = getGrammarChipCopyForActivity(activity);
                                            const hasGrammarVisual = hasGrammarGuideVisual(activity.title);
                                            const cardMeta = activityCardMetaById.get(activity.id);
                                            const points = getActivityPoints(activity.type, { id: activity.id, ui: activity.ui ?? undefined, content: activity.content ?? undefined });
                                            const vocabTheme = cardMeta?.vocabThemeChip ? capitalizeFirstLetter(cardMeta.vocabThemeChip) : 'Build topic vocabulary';
                                            const vocabSupport = cardMeta?.vocabWordsChip || activity.description || 'Study and use key words in context.';
                                            const gameCopy = cardMeta?.gameCardCopy;
                                            const pronunciationCopy = getPronunciationCardCopy(activity.id, activity.title);

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
                                                                    {(() => {
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
                                                                    <PronunciationActivityVisual activityId={activity.id} title={activity.title} />
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
                                                                                            const grammarCopy = getGrammarChipCopyForActivity(activity);
                                                                                            const hasGrammarVisual = hasGrammarGuideVisual(activity.title);
                                                                                            const points = getActivityPoints(activity.type, { id: activity.id, ui: activity.ui ?? undefined, content: activity.content ?? undefined });
                                                                                            const pronunciationCopy = getPronunciationCardCopy(activity.id, activity.title);

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
                                                                                                                    {(() => {
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
                                                                                                                    <PronunciationActivityVisual activityId={activity.id} title={activity.title} />
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
