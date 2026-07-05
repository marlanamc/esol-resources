import test from "node:test";
import assert from "node:assert/strict";
import { isLearnerVisibleActivity } from "@/lib/learner/visibility";
import {
  buildTeacherStudentCategorySummaries,
  filterVisibleTeacherAnalyticsAssignments,
} from "@/lib/teacher-student-analytics";

test("assigned work without progress is marked not started", () => {
  const summaries = buildTeacherStudentCategorySummaries({
    now: new Date("2026-03-11T12:00:00.000Z"),
    assignments: [
      {
        id: "assign-1",
        title: "Present Perfect Family",
        dueDate: new Date("2026-03-14T00:00:00.000Z"),
        activityId: "grammar-guide-1",
        activity: {
          id: "grammar-guide-1",
          title: "Present Perfect Family",
          category: "grammar",
        },
      },
    ],
    progressRows: [],
    submissionRows: [],
  });

  assert.equal(summaries.grammar.assignedCount, 1);
  assert.equal(summaries.grammar.startedCount, 0);
  assert.equal(summaries.grammar.completedCount, 0);
  assert.equal(summaries.grammar.completionRate, 0);
  assert.equal(summaries.grammar.status, "not-started");
  assert.equal(summaries.grammar.nextAction?.actionType, "start");
});

test("stalled incomplete work is flagged for intervention", () => {
  const summaries = buildTeacherStudentCategorySummaries({
    now: new Date("2026-03-11T12:00:00.000Z"),
    assignments: [
      {
        id: "assign-1",
        title: "Food Vocabulary",
        dueDate: new Date("2026-03-20T00:00:00.000Z"),
        activityId: "vocab-food",
        activity: {
          id: "vocab-food",
          title: "Food Vocabulary",
          category: "vocab",
        },
      },
    ],
    progressRows: [
      {
        id: "progress-1",
        activityId: "vocab-food",
        assignmentId: "assign-1",
        progress: 45,
        status: "in_progress",
        updatedAt: new Date("2026-03-01T10:00:00.000Z"),
        activity: {
          id: "vocab-food",
          title: "Food Vocabulary",
          category: "vocab",
        },
      },
    ],
    submissionRows: [],
  });

  assert.equal(summaries.vocab.startedCount, 1);
  assert.equal(summaries.vocab.stalledCount, 1);
  assert.equal(summaries.vocab.overdueCount, 0);
  assert.equal(summaries.vocab.status, "needs-attention");
  assert.equal(summaries.vocab.nextAction?.actionType, "resume");
});

test("oldest overdue assignment is prioritized as the next action", () => {
  const summaries = buildTeacherStudentCategorySummaries({
    now: new Date("2026-03-11T12:00:00.000Z"),
    assignments: [
      {
        id: "assign-oldest",
        title: "Countable Nouns",
        dueDate: new Date("2026-03-02T00:00:00.000Z"),
        activityId: "countable-1",
        activity: {
          id: "countable-1",
          title: "Countable Nouns",
          category: "grammar",
        },
      },
      {
        id: "assign-newer",
        title: "Uncountable Nouns",
        dueDate: new Date("2026-03-05T00:00:00.000Z"),
        activityId: "uncountable-1",
        activity: {
          id: "uncountable-1",
          title: "Uncountable Nouns",
          category: "grammar",
        },
      },
    ],
    progressRows: [],
    submissionRows: [],
  });

  assert.equal(summaries.grammar.overdueCount, 2);
  assert.equal(summaries.grammar.nextAction?.assignmentId, "assign-oldest");
  assert.equal(summaries.grammar.nextAction?.actionType, "resume");
});

test("ambiguous legacy unscoped progress is ignored when multiple assignments share an activity", () => {
  const summaries = buildTeacherStudentCategorySummaries({
    now: new Date("2026-03-11T12:00:00.000Z"),
    assignments: [
      {
        id: "assign-a",
        title: "Numbers Practice A",
        dueDate: null,
        activityId: "numbers-shared",
        activity: {
          id: "numbers-shared",
          title: "Numbers Practice",
          category: "numbers",
        },
      },
      {
        id: "assign-b",
        title: "Numbers Practice B",
        dueDate: null,
        activityId: "numbers-shared",
        activity: {
          id: "numbers-shared",
          title: "Numbers Practice",
          category: "numbers",
        },
      },
    ],
    progressRows: [
      {
        id: "progress-legacy",
        activityId: "numbers-shared",
        assignmentId: null,
        progress: 90,
        status: "in_progress",
        updatedAt: new Date("2026-03-10T12:00:00.000Z"),
        activity: {
          id: "numbers-shared",
          title: "Numbers Practice",
          category: "numbers",
        },
      },
    ],
    submissionRows: [],
  });

  assert.equal(summaries.numbers.assignedCount, 2);
  assert.equal(summaries.numbers.startedCount, 0);
  assert.equal(summaries.numbers.status, "not-started");
});

test("visibility filtering excludes unreleased learner-hidden assignments", () => {
  const visibleAssignments = filterVisibleTeacherAnalyticsAssignments(
    [
      {
        id: "visible-grammar",
        title: "Released Guide",
        dueDate: null,
        activityId: "guide-visible",
        activity: {
          id: "guide-visible",
          title: "Released Guide",
          type: "guide",
          category: "grammar",
          isReleased: true,
          content: null,
          deletedAt: null,
        },
      },
      {
        id: "hidden-grammar",
        title: "Hidden Guide",
        dueDate: null,
        activityId: "guide-hidden",
        activity: {
          id: "guide-hidden",
          title: "Hidden Guide",
          type: "guide",
          category: "grammar",
          isReleased: false,
          content: null,
          deletedAt: null,
        },
      },
    ],
    isLearnerVisibleActivity
  );

  assert.deepEqual(
    visibleAssignments.map((assignment) => assignment.id),
    ["visible-grammar"]
  );
});
