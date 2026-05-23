/**
 * Shared types for the TodaysAssignments feature (checklist and cards variants).
 */

export interface VocabCategoryData {
    'word-list'?: { completed: boolean; progress: number; completedAt?: string };
    'flashcards'?: { completed: boolean; progress: number; completedAt?: string };
    'matching'?: { completed: boolean; progress: number; completedAt?: string };
    'fill-blank'?: { completed: boolean; progress: number; completedAt?: string };
}

export interface FeaturedAssignment {
    id: string;
    assignmentId?: string | null;
    title?: string | null;
    displayTitle?: string | null;
    activityId: string;
    href?: string;
    sectionCount?: number;
    dueDate?: string | Date | null;
    isRequired?: boolean;
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

export interface CategoryStyle {
    label: string;
    bg: string;
    pastelBg: string;
    text: string;
    accent: string;
    border: string;
}
