import { getPronunciationActivityDescriptor } from '@/lib/pronunciation-activity';
import { getVocabUnitNumberFromActivity } from './activity-categories-vocab-utils';
import type { Activity } from './activity-categories-types';

export type TexturePattern = 'solid' | 'wave' | 'dots' | 'diagonal' | 'mixed' | 'grid' | 'bubbles' | 'lines' | 'pulse' | 'scatter';

export interface ActivityTexture {
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
export type TenseFamily = 'simple' | 'continuous' | 'perfect' | 'perfect-continuous' | 'review' | 'grammar-other';

export const TENSE_TEXTURES: Record<TenseFamily, ActivityTexture> = {
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
export type VocabFamily = 'flashcard' | 'matching' | 'fill-blank' | 'word-scramble' | 'vocab-unit' | 'vocab-other';

export const VOCAB_TEXTURES: Record<VocabFamily, ActivityTexture> = {
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

export const VOCAB_UNIT_TEXTURES: Record<number, ActivityTexture> = {
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

export const getVocabTextureByActivity = (activity: Activity): ActivityTexture | undefined => {
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

export const getVocabTextureBySection = (sectionLabel: string): ActivityTexture | undefined => {
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
export type GameFamily =
    | 'numbers'
    | 'verb-forms'
    | 'irregular-patterns'
    | 'time-indicators'
    | 'sound-choice'
    | 'countable-sort'
    | 'matching-game'
    | 'game-other';

export const GAME_TEXTURES: Record<GameFamily, ActivityTexture> = {
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
export type QuizFamily = 'weekly-quiz' | 'assessment' | 'quiz-other';

export const QUIZ_TEXTURES: Record<QuizFamily, ActivityTexture> = {
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
export type SpeakingFamily = 'pronunciation' | 'conversation' | 'speaking-other';
export type PronunciationFamily = 'minimal-pairs' | 'ed-sounds' | 'sentence-listening' | 'mixed-review' | 'pronunciation-other';

export const SPEAKING_TEXTURES: Record<SpeakingFamily, ActivityTexture> = {
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

export const PRONUNCIATION_TEXTURES: Record<PronunciationFamily, ActivityTexture> = {
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
    'sentence-listening': {
        id: 'sentence-listening',
        color: '#0ea5a4',
        bgColor: 'rgba(14, 165, 164, 0.05)',
        gradient: 'linear-gradient(135deg, rgba(45, 212, 191, 0.08) 0%, rgba(14, 165, 164, 0.02) 100%)',
        pattern: 'wave',
        icon: '🗣',
    },
    'mixed-review': {
        id: 'mixed-review',
        color: '#7c3aed',
        bgColor: 'rgba(124, 58, 237, 0.05)',
        gradient: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(124, 58, 237, 0.03) 100%)',
        pattern: 'mixed',
        icon: '◌',
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
export type WritingFamily = 'paragraph' | 'sentence' | 'writing-other';

export const WRITING_TEXTURES: Record<WritingFamily, ActivityTexture> = {
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
export const detectTenseFamily = (title: string): TenseFamily => {
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
export const detectVocabType = (activityId: string, title: string): VocabFamily => {
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
export const detectGameType = (activityId: string, ui: string | null): GameFamily => {
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
export const detectQuizType = (title: string): QuizFamily => {
    const t = title.toLowerCase();

    if (t.includes('week')) return 'weekly-quiz';
    if (t.includes('assessment') || t.includes('test')) return 'assessment';
    return 'quiz-other';
};

// Detect speaking type
export const detectSpeakingType = (title: string): SpeakingFamily => {
    const t = title.toLowerCase();

    if (t.includes('pronuncia') || t.includes('sound')) return 'pronunciation';
    if (t.includes('conversation') || t.includes('dialogue') || t.includes('talk')) return 'conversation';
    return 'speaking-other';
};

export const detectPronunciationType = (activity: Pick<Activity, 'id' | 'title' | 'ui' | 'content'>): PronunciationFamily => {
    const descriptor = getPronunciationActivityDescriptor({
        id: activity.id,
        title: activity.title,
        ui: activity.ui,
        content: activity.content,
    });

    if (descriptor.motif === 'minimal-pairs') return 'minimal-pairs';
    if (descriptor.motif === 'ed-sounds') return 'ed-sounds';
    if (descriptor.motif === 'sentence-listening') return 'sentence-listening';
    if (descriptor.motif === 'mixed-review') return 'mixed-review';
    return 'pronunciation-other';
};

// Detect writing type
export const detectWritingType = (title: string): WritingFamily => {
    const t = title.toLowerCase();

    if (t.includes('paragraph')) return 'paragraph';
    if (t.includes('sentence')) return 'sentence';
    return 'writing-other';
};

// Master function to get texture for any activity
export const getActivityTexture = (activity: Activity, sectionLabel?: string): ActivityTexture | undefined => {
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
    if (category === 'pronunciation' || activity.ui === 'ed-pronunciation' || activity.ui === 'minimal-pairs' || activity.ui === 'pronunciation-listening') {
        const pronunciationType = detectPronunciationType(activity);
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
export const getSectionTexture = (sectionLabel: string, filterCategory?: string): ActivityTexture | undefined => {
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
        if (label.includes('verb tense') || label.includes('verb forms')) return GAME_TEXTURES['verb-forms'];
        if (label.includes('parts of speech')) return GAME_TEXTURES['countable-sort'];
        if (label.includes('gerund') || label.includes('infinitive')) return GAME_TEXTURES['matching-game'];
        if (label.includes('grammar') || label.includes('sentence')) return GAME_TEXTURES['irregular-patterns'];
        if (label.includes('numbers')) return GAME_TEXTURES['numbers'];
        if (label.includes('conversation') || label.includes('fun')) return GAME_TEXTURES['game-other'];
        return GAME_TEXTURES['game-other'];
    }

    return undefined;
};

/** Wrapper for carousel card texture - uses sectionLabel for tense detection */
export const getActivityTextureForCard = (
    activity: Activity,
    sectionLabel: string
): ActivityTexture | undefined => {
    return getActivityTexture(activity, sectionLabel);
};

// Legacy type alias for backward compatibility
export type TenseTexture = ActivityTexture;
