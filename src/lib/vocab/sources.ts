import { VOCAB_WEEKLY_UNITS, VOCAB_WEEKLY_UNIT_NUMBER } from "@/data/weekly-vocab-units";
import type { VocabReviewFilterGroup } from "@/types/vocab-review";

export const ALL_VOCAB_SOURCE_KEY = "all";

export interface VocabReviewSourceDefinition {
  key: string;
  label: string;
  shortLabel: string;
  group: Exclude<VocabReviewFilterGroup, "all">;
  unitNumber: number;
  sortOrder: number;
  activityId: string;
}

const MONTHLY_VOCAB_SOURCES: VocabReviewSourceDefinition[] = [
  {
    key: "september",
    label: "Unit 1: September",
    shortLabel: "September",
    group: "month",
    unitNumber: 1,
    sortOrder: 0,
    activityId: "vocab-september-flashcards",
  },
  {
    key: "october",
    label: "Unit 2: October",
    shortLabel: "October",
    group: "month",
    unitNumber: 2,
    sortOrder: 1,
    activityId: "vocab-october-flashcards",
  },
  {
    key: "november",
    label: "Unit 3: November",
    shortLabel: "November",
    group: "month",
    unitNumber: 3,
    sortOrder: 2,
    activityId: "vocab-november-flashcards",
  },
  {
    key: "december",
    label: "Unit 4: December",
    shortLabel: "December",
    group: "month",
    unitNumber: 4,
    sortOrder: 3,
    activityId: "vocab-december-flashcards",
  },
  {
    key: "january",
    label: "Unit 5: January",
    shortLabel: "January",
    group: "month",
    unitNumber: 5,
    sortOrder: 4,
    activityId: "vocab-january-flashcards",
  },
];

const WEEKLY_VOCAB_SOURCES: VocabReviewSourceDefinition[] = VOCAB_WEEKLY_UNITS.map((unit, index) => {
  const unitNumber = VOCAB_WEEKLY_UNIT_NUMBER[unit.id] ?? 6;
  return {
    key: unit.id,
    label: `Unit ${unitNumber}: ${unit.label}`,
    shortLabel: unit.label,
    group: "week",
    unitNumber,
    sortOrder: MONTHLY_VOCAB_SOURCES.length + index,
    activityId: `vocab-${unit.id}`,
  };
});

export const VOCAB_REVIEW_SOURCE_DEFINITIONS = [
  ...MONTHLY_VOCAB_SOURCES,
  ...WEEKLY_VOCAB_SOURCES,
] as const satisfies readonly VocabReviewSourceDefinition[];

const SOURCE_BY_KEY = new Map(VOCAB_REVIEW_SOURCE_DEFINITIONS.map((source) => [source.key, source]));
const SOURCE_BY_ACTIVITY_ID = new Map(VOCAB_REVIEW_SOURCE_DEFINITIONS.map((source) => [source.activityId, source]));

export function getVocabReviewSourceByKey(key: string): VocabReviewSourceDefinition | null {
  return SOURCE_BY_KEY.get(key) ?? null;
}

export function getVocabReviewSourceByActivityId(activityId: string): VocabReviewSourceDefinition | null {
  return SOURCE_BY_ACTIVITY_ID.get(activityId) ?? null;
}

export function isKnownVocabReviewSourceKey(key: string): boolean {
  return SOURCE_BY_KEY.has(key);
}
