import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCanonicalLearnerSearchDataset,
  dedupeRankedLearnerSearchRecords,
  filterVisibleLearnerSearchRecords,
  normalizeLearnerSearchText,
  rankLearnerSearchRecords,
} from "@/lib/learner-search";
import type { LearnerSearchIndexRecord } from "@/lib/learner-search/types";

function buildSearchText(record: Pick<LearnerSearchIndexRecord, "title" | "description" | "category" | "type" | "destinationLabel" | "keywords" | "aliases">) {
  return normalizeLearnerSearchText(
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

function makeRecord(overrides: Partial<LearnerSearchIndexRecord> = {}): LearnerSearchIndexRecord {
  const base: LearnerSearchIndexRecord = {
    id: "record:test",
    canonicalKey: "test",
    kind: "activity",
    source: "activity",
    title: "Present Simple Guide",
    description: "Practice daily routines and habits.",
    href: "/grammar-reader/present-simple",
    category: "Grammar",
    type: "guide",
    level: null,
    keywords: ["grammar", "guide"],
    aliases: ["questions", "gramer"],
    destinationLabel: "Grammar Guide",
    priority: 100,
    searchText: "",
    availability: {
      type: "activity",
      activity: {
        id: "present-simple-guide",
        title: "Present Simple Guide",
        type: "guide",
        category: "grammar",
        isReleased: true,
        content: "{}",
      },
    },
  };

  const record = { ...base, ...overrides };
  return { ...record, searchText: buildSearchText(record) };
}

test("normalizeLearnerSearchText is case insensitive and punctuation tolerant", () => {
  assert.equal(normalizeLearnerSearchText(" Present, SIMPLE! "), "present simple");
});

test("partial prefix matching works for title tokens", () => {
  const ranked = rankLearnerSearchRecords([makeRecord()], "pres sim");
  assert.equal(ranked.length, 1);
  assert.equal(ranked[0].record.title, "Present Simple Guide");
});

test("synonym and alias matching works for common learner wording", () => {
  const record = makeRecord({
    title: "Career Basics",
    aliases: ["job", "work", "career", "interveiw"],
    keywords: ["workplace", "speaking"],
    category: "Speaking",
    type: "speaking",
    destinationLabel: "Speaking Activity",
    availability: {
      type: "activity",
      activity: {
        id: "career-basics",
        title: "Career Basics",
        type: "speaking",
        category: "speaking",
        content: JSON.stringify({ released: true }),
      },
    },
  });

  assert.equal(rankLearnerSearchRecords([record], "job").length, 1);
  assert.equal(rankLearnerSearchRecords([record], "interveiw").length, 1);
});

test("title matches outrank description-only matches", () => {
  const titleMatch = makeRecord({
    id: "title-match",
    canonicalKey: "title-match",
    title: "Doctor Visit Practice",
    description: "Speaking warmup",
    keywords: ["health"],
  });
  const descriptionOnly = makeRecord({
    id: "description-match",
    canonicalKey: "description-match",
    title: "Clinic Conversation",
    description: "Doctor visit practice for learners.",
    keywords: ["health"],
  });

  const ranked = rankLearnerSearchRecords([descriptionOnly, titleMatch], "doctor visit");
  assert.equal(ranked[0].record.id, "title-match");
});

test("duplicate resolution keeps the preferred canonical learner destination", () => {
  const grammarActivity = makeRecord({
    id: "activity:present-simple-guide",
    canonicalKey: "grammar:present-simple",
    source: "activity",
    priority: 95,
    destinationLabel: "Grammar Guide",
  });
  const grammarRegistry = makeRecord({
    id: "grammar:present-simple",
    canonicalKey: "grammar:present-simple",
    source: "grammar-registry",
    priority: 110,
    destinationLabel: "Grammar Guide",
  });

  const deduped = dedupeRankedLearnerSearchRecords(
    rankLearnerSearchRecords([grammarActivity, grammarRegistry], "present simple")
  );

  assert.equal(deduped.length, 1);
  assert.equal(deduped[0].record.id, "grammar:present-simple");
});

test("hidden and unreleased records are excluded before ranking output", () => {
  const dataset = buildCanonicalLearnerSearchDataset({
    activities: [
      {
        id: "present-simple-guide",
        title: "Present Simple Guide",
        description: "Visible grammar guide",
        type: "guide",
        category: "grammar",
        level: null,
        ui: null,
        content: "{}",
        isReleased: true,
        deletedAt: null,
        createdBy: null,
      },
      {
        id: "future-perfect-guide",
        title: "Future Perfect Guide",
        description: "Hidden grammar guide",
        type: "guide",
        category: "grammar",
        level: null,
        ui: null,
        content: "{}",
        isReleased: false,
        deletedAt: null,
        createdBy: null,
      },
      {
        id: "classroom-basics",
        title: "Classroom Basics",
        description: "Hidden speaking activity",
        type: "speaking",
        category: "speaking",
        level: null,
        ui: null,
        content: JSON.stringify({ released: false }),
        isReleased: false,
        deletedAt: null,
        createdBy: null,
      },
      {
        id: "visible-worksheet",
        title: "Workplace Reading",
        description: "Visible worksheet",
        type: "worksheet",
        category: "reading",
        level: null,
        ui: null,
        content: "{}",
        isReleased: false,
        deletedAt: null,
        createdBy: null,
      },
    ],
  });

  const visible = filterVisibleLearnerSearchRecords(dataset);
  const visibleTitles = new Set(visible.map((record) => record.title));

  assert.equal(visibleTitles.has("Present Simple Guide"), true);
  assert.equal(visibleTitles.has("Workplace Reading"), true);
  assert.equal(visibleTitles.has("Future Perfect Guide"), false);
  assert.equal(visibleTitles.has("Classroom Basics"), false);
});

test("teacher visibility uses teacher-owned activities while student visibility stays learner-only", () => {
  const dataset = buildCanonicalLearnerSearchDataset({
    activities: [
      {
        id: "teacher-owned-worksheet",
        title: "Teacher Owned Worksheet",
        description: "Private teacher activity",
        type: "worksheet",
        category: "reading",
        level: null,
        ui: null,
        content: "{}",
        isReleased: false,
        deletedAt: null,
        createdBy: "teacher-1",
      },
      {
        id: "other-teacher-worksheet",
        title: "Other Teacher Worksheet",
        description: "Different teacher activity",
        type: "worksheet",
        category: "reading",
        level: null,
        ui: null,
        content: "{}",
        isReleased: false,
        deletedAt: null,
        createdBy: "teacher-2",
      },
    ],
  });

  const teacherVisible = filterVisibleLearnerSearchRecords(dataset, {
    role: "teacher",
    userId: "teacher-1",
    admin: false,
  });
  const studentVisible = filterVisibleLearnerSearchRecords(dataset, { role: "student" });

  assert.equal(teacherVisible.some((record) => record.title === "Teacher Owned Worksheet"), true);
  assert.equal(teacherVisible.some((record) => record.title === "Other Teacher Worksheet"), false);
  assert.equal(studentVisible.some((record) => record.title === "Teacher Owned Worksheet"), true);
});

test("activity-backed results are included with correct hrefs", () => {
  const dataset = filterVisibleLearnerSearchRecords(buildCanonicalLearnerSearchDataset({
    activities: [
      {
        id: "workplace-reading-1",
        title: "Workplace Reading",
        description: "Read and answer questions about work.",
        type: "worksheet",
        category: "reading",
        level: null,
        ui: null,
        content: "{}",
        isReleased: false,
        deletedAt: null,
        createdBy: null,
      },
    ],
  }));

  const ranked = dedupeRankedLearnerSearchRecords(rankLearnerSearchRecords(dataset, "workplace reading"));
  assert.equal(ranked[0].record.href, "/activity/workplace-reading-1");
});

test("grammar registry entries are included once and linked to grammar-reader pages", () => {
  const dataset = filterVisibleLearnerSearchRecords(buildCanonicalLearnerSearchDataset({
    activities: [
      {
        id: "present-simple-guide",
        title: "Present Simple Guide",
        description: "Guide for present simple.",
        type: "guide",
        category: "grammar",
        level: null,
        ui: null,
        content: "{}",
        isReleased: true,
        deletedAt: null,
        createdBy: null,
      },
    ],
  }));

  const ranked = dedupeRankedLearnerSearchRecords(rankLearnerSearchRecords(dataset, "present simple"));
  const matches = ranked.filter((entry) => entry.record.title === "Present Simple");

  assert.equal(matches.length, 1);
  assert.equal(matches[0].record.href, "/grammar-reader/present-simple");
});

test("grammar guide activity titles dedupe to the canonical grammar topic slug", () => {
  const dataset = filterVisibleLearnerSearchRecords(buildCanonicalLearnerSearchDataset({
    activities: [
      {
        id: "modals-obligation-permission-guide-legacy",
        title: "Modals for Obligation & Permission Guide",
        description: "Use must/have to/should and can/may/could for permission and requests.",
        type: null,
        category: "grammar",
        level: null,
        ui: null,
        content: "{}",
        isReleased: true,
        deletedAt: null,
        createdBy: null,
      },
    ],
  }));

  const ranked = dedupeRankedLearnerSearchRecords(rankLearnerSearchRecords(dataset, "modals"));
  const matches = ranked.filter((entry) => entry.record.href === "/grammar-reader/modals-obligation-permission");

  assert.equal(matches.length, 1);
  assert.equal(matches[0].record.canonicalKey, "grammar:modals-obligation-permission");
});

test("learner tools appear with expected labels", () => {
  const visible = filterVisibleLearnerSearchRecords(buildCanonicalLearnerSearchDataset({ activities: [] }));
  const ranked = dedupeRankedLearnerSearchRecords(rankLearnerSearchRecords(visible, "grammar map"));

  assert.equal(ranked[0].record.destinationLabel, "Tool");
  assert.equal(ranked[0].record.href, "/grammar-map");
});

test("released quizzes can be found by quiz vocabulary terms", () => {
  const dataset = filterVisibleLearnerSearchRecords(buildCanonicalLearnerSearchDataset({
    activities: [
      {
        id: "quiz-irregular-verbs-week-20",
        title: "Week 20 Irregular Verb Quiz",
        description: "Practice this week's irregular verbs.",
        type: "quiz",
        category: "quizzes",
        level: null,
        ui: null,
        content: JSON.stringify({
          type: "verb-quiz",
          released: true,
          verbs: {
            drink: { v1: "drink", v1_3rd: "drinks", v1_ing: "drinking", v2: "drank", v3: "drunk" },
            sleep: { v1: "sleep", v1_3rd: "sleeps", v1_ing: "sleeping", v2: "slept", v3: "slept" },
          },
        }),
        isReleased: false,
        deletedAt: null,
        createdBy: null,
      },
    ],
  }));

  const ranked = dedupeRankedLearnerSearchRecords(rankLearnerSearchRecords(dataset, "drank"));
  assert.equal(ranked.length, 1);
  assert.equal(ranked[0].record.title, "Week 20 Irregular Verb Quiz");
});
