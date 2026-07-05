import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { isLearnerVisibleActivity, type LearnerVisibleActivityInput } from "./visibility";
import { grammarContentSlugs } from "@/lib/grammar-content-loader";
import { grammarTopics } from "@/data/grammar-map";
import { collapseEdPronunciationActivities } from "@/lib/activity-list-dedupe";
import { completionKeyFromActivityTitle } from "@/utils/completionKey";
import { parseActivityContent } from "@/types/activity";
import type {
    LearnerSearchAvailability,
    LearnerSearchFilter,
    LearnerSearchFilterOption,
    LearnerSearchIndexRecord,
    LearnerSearchResponse,
    LearnerSearchResult,
    SearchViewerScope,
} from "./types";

type SearchActivitySource = {
    id: string;
    title: string;
    description: string | null;
    type: string | null;
    category: string | null;
    level: string | null;
    ui: string | null;
    content: string | null;
    isReleased: boolean;
    deletedAt: Date | null;
    createdBy: string | null;
};

type SearchRankedRecord = {
    record: LearnerSearchIndexRecord;
    score: number;
};

const SEARCH_CACHE_TTL_MS = 60_000;
const FILTER_LABELS: Record<LearnerSearchFilter, string> = {
    all: "All",
    grammar: "Grammar",
    vocabulary: "Vocab",
    games: "Games",
    pronunciation: "Pronunciation",
    speaking: "Speaking",
    reading: "Reading",
    writing: "Writing",
    quizzes: "Quiz",
};

const SHARED_ALIAS_GROUPS = [
    ["job", "jobs", "work", "career", "workplace"],
    ["doctor", "docter", "health", "healthcare", "clinic", "medical"],
    ["speaking", "conversation", "dialogue", "speeking"],
    ["grammar", "questions", "gramer"],
    ["interview", "interveiw"],
];

const TOOL_RECORDS: Array<{
    id: string;
    title: string;
    description: string;
    href: string;
    category: string;
    type: string;
    keywords: string[];
    aliases: string[];
    destinationLabel: string;
    priority: number;
}> = [
    {
        id: "tool:grammar-map",
        title: "Grammar Map",
        description: "See grammar topics, connections, and your progress in one place.",
        href: "/grammar-map",
        category: "Grammar",
        type: "tool",
        keywords: ["grammar", "topics", "progress", "map"],
        aliases: ["roadmap", "guide map", "grammar chart"],
        destinationLabel: "Tool",
        priority: 140,
    },
    {
        id: "tool:vocab-review",
        title: "Vocab Review",
        description: "Review vocabulary cards you have already studied and keep words fresh.",
        href: "/dashboard/vocab-review",
        category: "Vocab",
        type: "tool",
        keywords: ["vocabulary", "vocab", "review", "flashcards", "study"],
        aliases: ["word review", "word study"],
        destinationLabel: "Tool",
        priority: 145,
    },
];

let cachedDataset: { expiresAt: number; records: LearnerSearchIndexRecord[] } | null = null;
let inflightDataset: Promise<LearnerSearchIndexRecord[]> | null = null;
const GRAMMAR_SLUG_SET = new Set(grammarContentSlugs);
const NORMALIZED_GRAMMAR_TOPIC_TITLE_MAP = new Map<string, string>(
    grammarTopics.flatMap((topic) => {
        const labels = [
            topic.title,
            ...(topic.activityTitles ?? []),
        ];

        return labels
            .map((label) => normalizeText(label))
            .filter(Boolean)
            .map((label) => [label, topic.id] as const);
    })
);

function normalizeText(value: string): string {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function tokenize(value: string): string[] {
    return normalizeText(value).split(" ").filter(Boolean);
}

function titleFromSlug(slug: string): string {
    const matchingTopic = grammarTopics.find((topic) => topic.id === slug);
    if (matchingTopic) {
        return matchingTopic.title;
    }

    return slug
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
    return Array.from(
        new Set(
            values
                .map((value) => (value ? value.trim() : ""))
                .filter((value) => value.length > 0)
        )
    );
}

function quizTermsFromContent(content: string | null | undefined, isReleased: boolean): string[] {
    if (!isReleased || !content) {
        return [];
    }

    const parsed = parseActivityContent(content);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return [];
    }

    const terms = new Set<string>();
    const typed = parsed as Record<string, unknown>;

    if (typed.type === "verb-quiz" && typed.verbs && typeof typed.verbs === "object" && !Array.isArray(typed.verbs)) {
        const verbs = typed.verbs as Record<string, unknown>;
        for (const [baseVerb, forms] of Object.entries(verbs)) {
            terms.add(baseVerb);

            if (!forms || typeof forms !== "object" || Array.isArray(forms)) {
                continue;
            }

            for (const value of Object.values(forms as Record<string, unknown>)) {
                if (typeof value !== "string") {
                    continue;
                }
                for (const token of tokenize(value)) {
                    if (token.length >= 3) {
                        terms.add(token);
                    }
                }
            }
        }
    }

    if (Array.isArray(typed.questions)) {
        for (const question of typed.questions) {
            if (!question || typeof question !== "object" || Array.isArray(question)) {
                continue;
            }

            const questionObj = question as { question?: unknown; options?: unknown };
            if (typeof questionObj.question === "string") {
                for (const token of tokenize(questionObj.question)) {
                    if (token.length >= 4) {
                        terms.add(token);
                    }
                }
            }

            if (Array.isArray(questionObj.options)) {
                for (const option of questionObj.options) {
                    if (typeof option !== "string") {
                        continue;
                    }
                    for (const token of tokenize(option)) {
                        if (token.length >= 4) {
                            terms.add(token);
                        }
                    }
                }
            }
        }
    }

    return Array.from(terms).slice(0, 24);
}

function expandAliasGroups(values: string[]): string[] {
    const normalizedValues = values.map((value) => normalizeText(value)).filter(Boolean);
    const aliases = new Set<string>();

    for (const group of SHARED_ALIAS_GROUPS) {
        const matched = group.some((member) => normalizedValues.some((value) => value.includes(member)));
        if (!matched) {
            continue;
        }

        for (const member of group) {
            aliases.add(member);
        }
    }

    return Array.from(aliases);
}

function categoryKeywords(activity: SearchActivitySource): string[] {
    const type = (activity.type || "").toLowerCase();
    const category = (activity.category || "").toLowerCase();
    const keywords = new Set<string>();
    const isPronunciationActivity =
        category === "pronunciation" || activity.ui === "minimal-pairs" || activity.ui === "ed-pronunciation" || activity.ui === "pronunciation-listening";

    if (category === "grammar" || type === "guide") {
        keywords.add("grammar");
        keywords.add("guide");
    }
    if (type === "speaking" || category === "speaking") {
        keywords.add("speaking");
        keywords.add("conversation");
    }
    if (type === "quiz" || category === "quizzes") {
        keywords.add("quiz");
        keywords.add("practice");
        for (const term of quizTermsFromContent(activity.content, activity.isReleased)) {
            keywords.add(term);
        }
    }
    if (category === "reading" || category === "writing-reading") {
        keywords.add("reading");
    }
    if (category === "writing" || category === "writing-reading") {
        keywords.add("writing");
    }
    if (activity.id.startsWith("vocab-") || category === "vocabulary") {
        keywords.add("vocabulary");
        keywords.add("vocab");
        keywords.add("words");
        keywords.add("flashcards");
    }
    if (isPronunciationActivity) {
        keywords.add("pronunciation");
        keywords.add("sounds");
    }
    if ((category === "games" || type === "game") && !isPronunciationActivity) {
        keywords.add("game");
        keywords.add("practice");
    }

    return Array.from(keywords);
}

function toActivityDestinationLabel(activity: SearchActivitySource): string {
    const type = (activity.type || "").toLowerCase();
    const category = (activity.category || "").toLowerCase();
    const isPronunciationActivity =
        category === "pronunciation" || activity.ui === "minimal-pairs" || activity.ui === "ed-pronunciation" || activity.ui === "pronunciation-listening";

    if (type === "guide" && category === "grammar") {
        return "Grammar Guide";
    }
    if (isPronunciationActivity) {
        return "Pronunciation Activity";
    }
    if (type === "speaking" || category === "speaking") {
        return "Speaking Activity";
    }
    if (type === "quiz" || category === "quizzes") {
        return "Quiz";
    }
    if (activity.id.startsWith("vocab-") || category === "vocabulary") {
        return "Vocab Activity";
    }
    if (type === "game" || category === "games") {
        return "Practice Activity";
    }

    return "Activity";
}

function toSearchCategory(activity: SearchActivitySource): string | null {
    const category = (activity.category || "").toLowerCase();
    if (category === "games" && (activity.ui === "minimal-pairs" || activity.ui === "ed-pronunciation" || activity.ui === "pronunciation-listening")) {
        return "pronunciation";
    }
    if (activity.id.startsWith("vocab-") || category === "vocabulary" || category === "vocab" || category === "numbers" || category === "number") {
        return "Vocab";
    }

    return activity.category;
}

function toFilter(record: LearnerSearchIndexRecord): LearnerSearchFilter {
    const category = (record.category || "").toLowerCase();
    const type = (record.type || "").toLowerCase();
    const isPronunciationRecord =
        category === "pronunciation" ||
        record.destinationLabel === "Pronunciation Activity" ||
        record.keywords.includes("pronunciation") ||
        record.aliases.some((alias) => {
            const normalized = normalizeText(alias);
            return normalized.includes("pronunciation") || normalized.includes("minimal pairs") || normalized.includes("ed pronunciation");
        });

    if (record.kind === "grammar-guide" || category === "grammar") {
        return "grammar";
    }
    if (category === "vocabulary" || category === "vocab" || category === "numbers" || category === "number") {
        return "vocabulary";
    }
    if (isPronunciationRecord) {
        return "pronunciation";
    }
    if (category === "games" || type === "game") {
        return "games";
    }
    if (type === "speaking" || category === "speaking") {
        return "speaking";
    }
    if (category === "reading" || category === "writing-reading") {
        return "reading";
    }
    if (category === "writing") {
        return "writing";
    }
    if (type === "quiz" || category === "quizzes") {
        return "quizzes";
    }

    return "all";
}

function buildSearchText(record: {
    title: string;
    description: string | null;
    category: string | null;
    type: string | null;
    destinationLabel: string;
    keywords: string[];
    aliases: string[];
}): string {
    return normalizeText(
        [
            record.title,
            record.description || "",
            record.category || "",
            record.type || "",
            record.destinationLabel,
            ...record.keywords,
            ...record.aliases,
        ].join(" ")
    );
}

/**
 * Resolve a valid grammar-reader slug for a grammar guide activity.
 * Only returns slugs that exist in grammarContentRegistry to prevent 404 links.
 */
function resolveGrammarSlugForSearch(activity: SearchActivitySource): string | null {
    if (!activity.id || !activity.title) {
        return null;
    }

    if (GRAMMAR_SLUG_SET.has(activity.id)) {
        return activity.id;
    }

    const normalizedTitle = normalizeText(activity.title);
    const mappedSlug = NORMALIZED_GRAMMAR_TOPIC_TITLE_MAP.get(normalizedTitle);
    if (mappedSlug && GRAMMAR_SLUG_SET.has(mappedSlug)) {
        return mappedSlug;
    }

    const derived = completionKeyFromActivityTitle(activity.title);
    return GRAMMAR_SLUG_SET.has(derived) ? derived : null;
}

function buildActivityRecord(activity: SearchActivitySource): LearnerSearchIndexRecord {
    const normalizedCategory = (activity.category || "").toLowerCase();
    const normalizedType = (activity.type || "").toLowerCase();
    const grammarSlug = resolveGrammarSlugForSearch(activity);
    const isGrammarGuide =
        Boolean(grammarSlug) &&
        (normalizedCategory === "grammar" || normalizedType === "guide");
    const href = activity.id === "vocab-daily-review"
        ? "/dashboard/vocab-review"
        : isGrammarGuide && grammarSlug
            ? `/grammar-reader/${grammarSlug}`
            : `/activity/${activity.id}`;
    const baseVocabId = activity.id.startsWith("vocab-")
        ? activity.id.replace(/-flash-?cards$/i, "")
        : null;
    const canonicalKey = activity.id === "vocab-daily-review"
        ? "tool:vocab-review"
        : baseVocabId
            ? `vocab:${baseVocabId}`
            : isGrammarGuide && grammarSlug
                ? `grammar:${grammarSlug}`
                : `href:${href}`;
    const keywords = categoryKeywords(activity);
    const aliases = uniqueStrings([
        ...expandAliasGroups([activity.title, activity.category || "", activity.type || "", activity.description || ""]),
    ]);

    const record: LearnerSearchIndexRecord = {
        id: `activity:${activity.id}`,
        canonicalKey,
        kind: isGrammarGuide ? "grammar-guide" : "activity",
        source: "activity",
        title: activity.title,
        description: activity.description,
        href,
        category: toSearchCategory(activity),
        type: activity.type,
        level: activity.level,
        keywords,
        aliases,
        destinationLabel: toActivityDestinationLabel(activity),
        priority: isGrammarGuide ? 95 : activity.id === "vocab-daily-review" ? 120 : 90,
        searchText: "",
        availability: {
            type: "activity",
            activity: {
                id: activity.id,
                title: activity.title,
                deletedAt: activity.deletedAt,
                type: activity.type,
                category: activity.category,
                isReleased: activity.isReleased,
                content: activity.content,
                createdBy: activity.createdBy,
            },
        },
    };

    return {
        ...record,
        searchText: buildSearchText(record),
    };
}

function buildGrammarRegistryRecord(slug: string): LearnerSearchIndexRecord {
    const matchingTopic = grammarTopics.find((topic) => topic.id === slug);
    const title = titleFromSlug(slug);
    const activityTitles = uniqueStrings(matchingTopic?.activityTitles ?? []);
    const aliases = uniqueStrings([
        ...expandAliasGroups([title, slug, "grammar guide"]),
        slug.replace(/-/g, " "),
        "grammar",
    ]);
    const keywords = uniqueStrings([
        "grammar",
        "guide",
        ...(matchingTopic?.relatedTopics ?? []),
    ]);

    const record: LearnerSearchIndexRecord = {
        id: `grammar:${slug}`,
        canonicalKey: `grammar:${slug}`,
        kind: "grammar-guide",
        source: "grammar-registry",
        title,
        description: `${title} grammar guide.`,
        href: `/grammar-reader/${slug}`,
        category: "Grammar",
        type: "guide",
        level: null,
        keywords,
        aliases,
        destinationLabel: "Grammar Guide",
        priority: 110,
        searchText: "",
        availability: {
            type: "grammar-guide",
            slug,
            activityTitles,
        },
    };

    return {
        ...record,
        searchText: buildSearchText(record),
    };
}

function buildToolRecord(tool: (typeof TOOL_RECORDS)[number]): LearnerSearchIndexRecord {
    const aliases = uniqueStrings([
        ...tool.aliases,
        ...expandAliasGroups([tool.title, tool.description, ...tool.keywords]),
    ]);

    const record: LearnerSearchIndexRecord = {
        id: tool.id,
        canonicalKey: tool.id,
        kind: "tool",
        source: "tool",
        title: tool.title,
        description: tool.description,
        href: tool.href,
        category: tool.category,
        type: tool.type,
        level: null,
        keywords: tool.keywords,
        aliases,
        destinationLabel: tool.destinationLabel,
        priority: tool.priority,
        searchText: "",
        availability: {
            type: "always",
        },
    };

    return {
        ...record,
        searchText: buildSearchText(record),
    };
}

function isValidGrammarReaderHref(href: string): boolean {
    if (!href.startsWith("/grammar-reader/")) return true;
    const slug = href.replace("/grammar-reader/", "").split("?")[0];
    return GRAMMAR_SLUG_SET.has(slug);
}

export function buildCanonicalLearnerSearchDataset(params: {
    activities: SearchActivitySource[];
}): LearnerSearchIndexRecord[] {
    const collapsedActivities = collapseEdPronunciationActivities(params.activities);
    const activityRecords = collapsedActivities.map((activity) => buildActivityRecord(activity));
    const grammarRecords = grammarContentSlugs.map((slug) => buildGrammarRegistryRecord(slug));
    const toolRecords = TOOL_RECORDS.map((tool) => buildToolRecord(tool));

    const allRecords = [...toolRecords, ...grammarRecords, ...activityRecords];
    return allRecords.filter((r) => isValidGrammarReaderHref(r.href));
}

async function fetchActivitySources(): Promise<SearchActivitySource[]> {
    return withPrismaReadRetry(() =>
        prisma.activity.findMany({
            where: {
                deletedAt: null,
            },
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                category: true,
                level: true,
                ui: true,
                content: true,
                isReleased: true,
                deletedAt: true,
                createdBy: true,
            },
        })
    );
}

export async function loadCanonicalLearnerSearchDataset(): Promise<LearnerSearchIndexRecord[]> {
    const now = Date.now();
    if (cachedDataset && cachedDataset.expiresAt > now) {
        return cachedDataset.records;
    }

    if (inflightDataset) {
        return inflightDataset;
    }

    inflightDataset = fetchActivitySources()
        .then((activities) => buildCanonicalLearnerSearchDataset({ activities }))
        .then((records) => {
            cachedDataset = {
                expiresAt: Date.now() + SEARCH_CACHE_TTL_MS,
                records,
            };
            return records;
        })
        .finally(() => {
            inflightDataset = null;
        });

    return inflightDataset;
}

function resolveAvailabilityActivity(
    availability: LearnerSearchAvailability,
    visibleActivityByTitle: Map<string, LearnerVisibleActivityInput>
): LearnerVisibleActivityInput | null {
    if (availability.type === "always") {
        return null;
    }

    if (availability.type === "activity") {
        return availability.activity;
    }

    const candidates = availability.activityTitles
        .map((title) => visibleActivityByTitle.get(title.toLowerCase()))
        .filter((activity): activity is LearnerVisibleActivityInput => Boolean(activity));

    if (candidates.length > 0) {
        return candidates[0];
    }

    return visibleActivityByTitle.get(availability.slug) ?? null;
}

function isVisibleForSearchViewer(
    activity: LearnerVisibleActivityInput & { createdBy?: string | null },
    viewer: SearchViewerScope
): boolean {
    if (viewer.role === "student") {
        return isLearnerVisibleActivity(activity);
    }

    if (activity.deletedAt) {
        return false;
    }

    return viewer.admin || activity.createdBy === viewer.userId;
}

export function filterVisibleLearnerSearchRecords(
    records: LearnerSearchIndexRecord[],
    viewer: SearchViewerScope = { role: "student" }
): LearnerSearchIndexRecord[] {
    const activityRecords = records
        .flatMap((record) => (
            record.availability.type === "activity"
                ? [record.availability.activity]
                : []
        ));

    const visibleActivityByTitle = new Map<string, LearnerVisibleActivityInput>();
    for (const activity of activityRecords) {
        if (!isVisibleForSearchViewer(activity, viewer)) {
            continue;
        }

        visibleActivityByTitle.set(activity.title.toLowerCase(), activity);
        visibleActivityByTitle.set(completionKeyFromActivityTitle(activity.title), activity);
    }

    return records.filter((record) => {
        if (record.availability.type === "always") {
            return true;
        }

        const activity = resolveAvailabilityActivity(record.availability, visibleActivityByTitle);
        if (!activity) {
            return false;
        }

        return isVisibleForSearchViewer(activity, viewer);
    });
}

function matchesAllTokens(tokens: string[], candidateTokens: string[]): boolean {
    return tokens.every((token) => candidateTokens.some((candidate) => candidate.startsWith(token)));
}

function scoreLearnerSearchRecord(record: LearnerSearchIndexRecord, query: string): number {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) {
        return record.priority;
    }

    const queryTokens = tokenize(normalizedQuery);
    const titleText = normalizeText(record.title);
    const titleTokens = tokenize(record.title);
    const aliasTokens = tokenize([...record.aliases, ...record.keywords].join(" "));
    const labelTokens = tokenize([record.category || "", record.type || "", record.destinationLabel].join(" "));
    const descriptionTokens = tokenize(record.description || "");
    const allTokens = tokenize(record.searchText);

    if (!matchesAllTokens(queryTokens, allTokens)) {
        return -1;
    }

    let score = 0;

    if (titleText === normalizedQuery) {
        score += 1200;
    } else if (titleText.startsWith(normalizedQuery)) {
        score += 900;
    } else if (matchesAllTokens(queryTokens, titleTokens)) {
        score += 700;
    }

    if (record.aliases.some((alias) => normalizeText(alias) === normalizedQuery)) {
        score += 450;
    } else if (matchesAllTokens(queryTokens, aliasTokens)) {
        score += 300;
    }

    if (matchesAllTokens(queryTokens, labelTokens)) {
        score += 170;
    }

    if (descriptionTokens.length > 0 && matchesAllTokens(queryTokens, descriptionTokens)) {
        score += 80;
    }

    return score + record.priority;
}

function compareRankedRecords(left: SearchRankedRecord, right: SearchRankedRecord): number {
    if (right.score !== left.score) {
        return right.score - left.score;
    }
    if (right.record.priority !== left.record.priority) {
        return right.record.priority - left.record.priority;
    }
    return left.record.title.localeCompare(right.record.title);
}

export function rankLearnerSearchRecords(records: LearnerSearchIndexRecord[], query: string): SearchRankedRecord[] {
    return records
        .map((record) => ({
            record,
            score: scoreLearnerSearchRecord(record, query),
        }))
        .filter((entry) => entry.score >= 0)
        .sort(compareRankedRecords);
}

export function dedupeRankedLearnerSearchRecords(records: SearchRankedRecord[]): SearchRankedRecord[] {
    const deduped = new Map<string, SearchRankedRecord>();

    for (const entry of records) {
        const existing = deduped.get(entry.record.canonicalKey);
        if (!existing || compareRankedRecords(existing, entry) > 0) {
            deduped.set(entry.record.canonicalKey, entry);
        }
    }

    return Array.from(deduped.values()).sort(compareRankedRecords);
}

function toPublicResult(record: LearnerSearchIndexRecord): LearnerSearchResult {
    return {
        id: record.id,
        kind: record.kind,
        title: record.title,
        description: record.description,
        href: record.href,
        category: record.category,
        type: record.type,
        level: record.level,
        destinationLabel: record.destinationLabel,
    };
}

function buildAvailableFilters(records: SearchRankedRecord[], activeFilter: LearnerSearchFilter): LearnerSearchFilterOption[] {
    const deduped = dedupeRankedLearnerSearchRecords(records);
    const counts = new Map<LearnerSearchFilter, number>();

    for (const filter of Object.keys(FILTER_LABELS) as LearnerSearchFilter[]) {
        counts.set(filter, 0);
    }

    for (const entry of deduped) {
        const filter = toFilter(entry.record);
        if (filter !== "all") {
            counts.set(filter, (counts.get(filter) || 0) + 1);
        }
    }

    const filters: LearnerSearchFilterOption[] = [
        {
            key: "all",
            label: FILTER_LABELS.all,
            count: deduped.length,
        },
    ];

    for (const filter of Object.keys(FILTER_LABELS) as LearnerSearchFilter[]) {
        if (filter === "all") {
            continue;
        }
        const count = counts.get(filter) || 0;
        if (count <= 0 && filter !== activeFilter) {
            continue;
        }
        filters.push({
            key: filter,
            label: FILTER_LABELS[filter],
            count,
        });
    }

    return filters;
}

export async function searchLearnerContent(params: {
    query: string;
    filter: LearnerSearchFilter;
    limit: number;
    viewer?: SearchViewerScope;
}): Promise<LearnerSearchResponse> {
    const allRecords = await loadCanonicalLearnerSearchDataset();
    const visibleRecords = filterVisibleLearnerSearchRecords(allRecords, params.viewer);
    const rankedAcrossAllFilters = rankLearnerSearchRecords(visibleRecords, params.query);
    const availableFilters = buildAvailableFilters(rankedAcrossAllFilters, params.filter);
    const filteredRankedRecords = params.filter === "all"
        ? rankedAcrossAllFilters
        : rankedAcrossAllFilters.filter(({ record }) => toFilter(record) === params.filter);
    const ranked = dedupeRankedLearnerSearchRecords(filteredRankedRecords);
    const limited = ranked.slice(0, params.limit).map(({ record }) => toPublicResult(record));

    return {
        query: params.query,
        appliedFilter: params.filter,
        results: limited,
        availableFilters,
        totalCount: ranked.length,
    };
}

export function clampLearnerSearchLimit(value: number | null | undefined, fallback: number): number {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return fallback;
    }

    return Math.max(1, Math.min(40, Math.round(value)));
}

export function parseLearnerSearchFilter(value: string | null | undefined): LearnerSearchFilter | null {
    if (value === "quiz") {
        return "quizzes";
    }
    if (value === "vocab") {
        return "vocabulary";
    }
    if (
        value === "all" ||
        value === "grammar" ||
        value === "vocabulary" ||
        value === "games" ||
        value === "pronunciation" ||
        value === "speaking" ||
        value === "reading" ||
        value === "writing" ||
        value === "quizzes"
    ) {
        return value;
    }

    return null;
}

export { normalizeText as normalizeLearnerSearchText };
