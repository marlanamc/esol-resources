import type { getVocabActivityType } from '@/lib/vocab/display';

export interface Activity {
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

export interface SubSubCategory {
    name: string;
    activities: Activity[];
}

export interface SubCategory {
    name: string;
    activities: Activity[];
    subCategories?: SubSubCategory[];
}

export interface Category {
    name: string;
    color: string;
    subCategories?: SubCategory[];
    activities: Activity[];
}

export interface ActivityCategoriesProps {
    activities: Activity[];
    completedActivityIds?: Set<string>;
    completedActivityTitles?: Set<string>;
    progressMap?: Record<string, { progress: number; categoryData?: string }>;
    showEmpty?: boolean;
    filterCategory?: string;
}



export interface ActivityCardMeta {
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
