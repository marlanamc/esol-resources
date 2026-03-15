import type { LearnerVisibleActivityInput } from "./visibility";

export type LearnerSearchContext = "search-page" | "quick-open";

export type LearnerSearchFilter =
    | "all"
    | "grammar"
    | "vocabulary"
    | "games"
    | "pronunciation"
    | "speaking"
    | "reading"
    | "writing"
    | "quizzes";

export type LearnerSearchResultKind = "activity" | "grammar-guide" | "tool";

export type LearnerSearchAvailability =
    | {
        type: "always";
    }
    | {
        type: "activity";
        activity: LearnerVisibleActivityInput & {
            id: string;
            title: string;
        };
    }
    | {
        type: "grammar-guide";
        slug: string;
        activityTitles: string[];
    };

export interface LearnerSearchIndexRecord {
    id: string;
    canonicalKey: string;
    kind: LearnerSearchResultKind;
    source: "activity" | "grammar-registry" | "tool";
    title: string;
    description: string | null;
    href: string;
    category: string | null;
    type: string | null;
    level: string | null;
    keywords: string[];
    aliases: string[];
    destinationLabel: string;
    priority: number;
    searchText: string;
    availability: LearnerSearchAvailability;
}

export interface LearnerSearchResult {
    id: string;
    kind: LearnerSearchResultKind;
    title: string;
    description: string | null;
    href: string;
    category: string | null;
    type: string | null;
    level: string | null;
    destinationLabel: string;
}

export interface LearnerSearchFilterOption {
    key: LearnerSearchFilter;
    label: string;
    count: number;
}

export type SearchViewerScope =
    | {
        role: "student";
    }
    | {
        role: "teacher";
        userId: string;
        admin: boolean;
    };

export interface LearnerSearchResponse {
    query: string;
    appliedFilter: LearnerSearchFilter;
    results: LearnerSearchResult[];
    availableFilters: LearnerSearchFilterOption[];
    totalCount: number;
}
