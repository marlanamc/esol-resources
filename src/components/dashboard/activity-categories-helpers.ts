import {
  displayTitle,
  cleanVocabTerm,
  dedupeVocabTerms,
  extractVocabTermsFromJsonContent,
} from './activity-categories-vocab-utils';
import { resolveActivityGameUi } from '@/lib/gamification/activity-points';
import type { Activity, Category, SubCategory } from './activity-categories-types';

export const extractVocabTermsFromPlainTextContent = (content: string): string[] => {
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

export const extractVocabTermsFromJsonRawFields = (content: string): string[] => {
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

export const extractVocabTermsFromDescription = (description: string | null): string[] => {
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

export const getVocabWordsChip = (activity: Activity): string | null => {
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

export const getVerbQuizWordsChip = (activity: Activity): string | null => {
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

export const getActivityCardTitle = (activity: Activity): string => {
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

export interface GrammarChipCopy {
    pattern: RegExp;
    friendlyTitle: string;
    useThisFor: string;
}

export const GRAMMAR_CHIP_COPY: GrammarChipCopy[] = [
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

export const getGrammarChipCopy = (title: string): { friendlyTitle: string; useThisFor: string } => {
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
export const getGrammarChipCopyForActivity = (activity: Activity): { friendlyTitle: string; useThisFor: string } | null => {
    if (activity.category !== 'grammar') return null;
    return getGrammarChipCopy(activity.title);
};

export const capitalizeFirstLetter = (value: string): string =>
    value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;

export const parseTitleDateMs = (title?: string | null) => {
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

export const compareByTitleDateDesc = (a: Activity, b: Activity) => {
    const aDate = parseTitleDateMs(a.title);
    const bDate = parseTitleDateMs(b.title);
    if (aDate !== null && bDate !== null) return bDate - aDate;
    if (aDate !== null) return -1;
    if (bDate !== null) return 1;
    return (b.title || '').localeCompare(a.title || '');
};

export const getSubCategoryCount = (subCategory: SubCategory) => {
    const directCount = subCategory.activities?.length || 0;
    const nestedCount = subCategory.subCategories
        ? subCategory.subCategories.reduce((sum, sub) => sum + (sub.activities?.length || 0), 0)
        : 0;
    return directCount + nestedCount;
};

export const getCategoryCount = (category: Category) => {
    const directCount = category.activities?.length || 0;
    const nestedCount = category.subCategories
        ? category.subCategories.reduce((sum, sub) => sum + getSubCategoryCount(sub), 0)
        : 0;
    return directCount + nestedCount;
};

export const getProgress = (id: string, progressMap?: Record<string, { progress: number; categoryData?: string }>) => {
    const data = progressMap?.[id];
    return data?.progress ?? 0;
};

export const isPronunciationPracticeActivity = (activity: Activity) => {
    if (activity.category === 'pronunciation') return true;
    if (activity.type !== 'game') return false;
    const gameUi = resolveActivityGameUi(activity);
    return gameUi === 'ed-pronunciation' || gameUi === 'minimal-pairs' || gameUi === 'pronunciation-listening';
};

export const getDisplayProgress = (
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

export const isActivityCompleted = (
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

