import test from "node:test";
import assert from "node:assert/strict";
import {
  DAILY_HABIT_KEYS,
  buildDailyVocabHabit,
  getDailyVocabHabitForUser,
  getLearnerDayKey,
  markDailyHabitCompleted,
  shouldShowDailyVocabHabit,
} from "@/lib/daily-habits";

test("buildDailyVocabHabit hides the row when nothing is due or new", () => {
  assert.equal(buildDailyVocabHabit({ dueCount: 0, newCount: 0 }, false), null);
});

test("shouldShowDailyVocabHabit keeps the row visible when vocab review exists", () => {
  assert.equal(shouldShowDailyVocabHabit({ dueCount: 0, newCount: 0, totalCount: 6 }, false), true);
  assert.equal(shouldShowDailyVocabHabit({ dueCount: 0, newCount: 0, totalCount: 0 }, false), false);
});

test("buildDailyVocabHabit returns needs-review state for actionable vocab", () => {
  const habit = buildDailyVocabHabit({ dueCount: 4, newCount: 2 }, false);

  assert.ok(habit);
  assert.equal(habit.status, "needs-review");
  assert.equal(habit.completedToday, false);
  assert.equal(habit.dueCount, 4);
  assert.equal(habit.newCount, 2);
  assert.equal(habit.reviewedTodayCount, 0);
});

test("buildDailyVocabHabit returns done-today state after one completed session", () => {
  const habit = buildDailyVocabHabit({ dueCount: 3, newCount: 1 }, true, 6);

  assert.ok(habit);
  assert.equal(habit.status, "done-today");
  assert.equal(habit.completedToday, true);
  assert.equal(habit.reviewedTodayCount, 6);
  assert.match(habit.description, /finished one vocab review session today/i);
});

test("buildDailyVocabHabit still returns a completed row after today's queue is clear", () => {
  const habit = buildDailyVocabHabit({ dueCount: 0, newCount: 0 }, true);

  assert.ok(habit);
  assert.equal(habit.status, "done-today");
  assert.equal(habit.dueCount, 0);
  assert.equal(habit.newCount, 0);
  assert.match(habit.description, /finished today's vocab review/i);
});

test("buildDailyVocabHabit still returns a visible row when the learner has vocab cards but nothing is due right now", () => {
  const habit = buildDailyVocabHabit({ dueCount: 0, newCount: 0, totalCount: 6 }, false);

  assert.ok(habit);
  assert.equal(habit.status, "needs-review");
  assert.match(habit.description, /caught up for now/i);
});

test("getLearnerDayKey uses America/New_York day boundaries", () => {
  assert.equal(getLearnerDayKey(new Date("2026-03-11T03:30:00.000Z")), "2026-03-10");
  assert.equal(getLearnerDayKey(new Date("2026-03-11T13:00:00.000Z")), "2026-03-11");
});

test("markDailyHabitCompleted upserts using the learner day key", async () => {
  const recordedArgs: Array<Record<string, unknown>> = [];
  const now = new Date("2026-03-11T13:00:00.000Z");
  const db = {
    dailyHabitCompletion: {
      upsert: async (args: Record<string, unknown>) => {
        recordedArgs.push(args);
        return null;
      },
    },
  };

  await markDailyHabitCompleted(db as never, "student-1", DAILY_HABIT_KEYS.vocabReview, now);

  assert.equal(recordedArgs.length, 1);
  assert.deepEqual(recordedArgs[0].where, {
    userId_habitKey_dayKey: {
      userId: "student-1",
      habitKey: DAILY_HABIT_KEYS.vocabReview,
      dayKey: "2026-03-11",
    },
  });
});

test("getDailyVocabHabitForUser returns null when vocab review is not actionable", async () => {
  const db = {
    activity: {
      findMany: async () => [],
    },
    vocabCard: {
      count: async () => 1,
      findMany: async () => [],
    },
    userVocabReviewState: {
      findMany: async () => [],
    },
    dailyHabitCompletion: {
      findUnique: async () => null,
    },
  };

  const habit = await getDailyVocabHabitForUser(db as never, "student-1", new Date("2026-03-11T12:00:00.000Z"));
  assert.equal(habit, null);
});

test("getDailyVocabHabitForUser still returns a row when vocab cards exist but nothing is due today", async () => {
  const db = {
    activity: {
      findMany: async () => [],
    },
    vocabCard: {
      count: async () => 1,
      findMany: async () => [
        {
          id: "new-card",
          term: "timesheet",
          definition: "a form that records your work hours",
          example: null,
          audioPath: "/audio/vocab/timesheet.mp3",
          sourceKeys: ["feb-10-12"],
          sourceLabels: ["Unit 6: February 10-12"],
          unitNumbers: [6],
          topics: ["Workplace"],
          sortOrder: 2,
        },
      ],
    },
    userVocabReviewState: {
      findMany: async () => [
        {
          vocabCardId: "new-card",
          step: 3,
          dueAt: new Date("2026-03-12T12:00:00.000Z"),
          lastRating: "good",
          lastReviewedAt: new Date("2026-03-11T12:00:00.000Z"),
          totalReviews: 2,
          lapses: 0,
          easeFactor: 2.5,
          difficulty: 0,
          stability: 0.5,
          lastInterval: 1,
        },
      ],
    },
    dailyHabitCompletion: {
      findUnique: async () => null,
    },
    pointsLedger: {
      findMany: async () => [],
    },
  };

  const habit = await getDailyVocabHabitForUser(db as never, "student-1", new Date("2026-03-11T12:00:00.000Z"));
  assert.ok(habit);
  assert.equal(habit.status, "needs-review");
  assert.equal(habit.dueCount, 0);
  assert.equal(habit.newCount, 0);
  assert.equal(habit.reviewedTodayCount, 0);
});

test("getDailyVocabHabitForUser keeps the habit row after completion even with no due cards left", async () => {
  const db = {
    activity: {
      findMany: async () => [],
    },
    vocabCard: {
      count: async () => 1,
      findMany: async () => [],
    },
    userVocabReviewState: {
      findMany: async () => [],
    },
    dailyHabitCompletion: {
      findUnique: async () => ({ id: "completion-1" }),
    },
  };

  const habit = await getDailyVocabHabitForUser(db as never, "student-1", new Date("2026-03-11T12:00:00.000Z"));
  assert.ok(habit);
  assert.equal(habit.status, "done-today");
});

test("getDailyVocabHabitForUser includes completion state when cards are actionable", async () => {
  const db = {
    activity: {
      findMany: async () => [],
    },
    vocabCard: {
      count: async () => 2,
      findMany: async () => [
        {
          id: "due-card",
          term: "obstacle",
          definition: "something that blocks your way",
          example: null,
          audioPath: "/audio/vocab/obstacle.mp3",
          sourceKeys: ["october"],
          sourceLabels: ["Unit 2: October"],
          unitNumbers: [2],
          topics: ["Daily Life"],
          sortOrder: 1,
        },
        {
          id: "new-card",
          term: "timesheet",
          definition: "a form that records your work hours",
          example: null,
          audioPath: "/audio/vocab/timesheet.mp3",
          sourceKeys: ["feb-10-12"],
          sourceLabels: ["Unit 6: February 10-12"],
          unitNumbers: [6],
          topics: ["Workplace"],
          sortOrder: 2,
        },
      ],
    },
    userVocabReviewState: {
      findMany: async () => [
        {
          vocabCardId: "due-card",
          step: 1,
          dueAt: new Date("2026-03-10T12:00:00.000Z"),
          lastRating: "good",
          lastReviewedAt: new Date("2026-03-09T12:00:00.000Z"),
          totalReviews: 1,
          lapses: 0,
          easeFactor: 2.5,
          difficulty: 0,
          stability: 0.5,
          lastInterval: 1,
        },
      ],
    },
    dailyHabitCompletion: {
      findUnique: async () => ({ id: "completion-1" }),
    },
    pointsLedger: {
      findMany: async () => [
        {
          createdAt: new Date("2026-03-11T14:00:00.000Z"),
          reason: "Vocab review: 6 cards",
        },
      ],
    },
  };

  const habit = await getDailyVocabHabitForUser(db as never, "student-1", new Date("2026-03-11T12:00:00.000Z"));
  assert.ok(habit);
  assert.equal(habit.status, "done-today");
  assert.equal(habit.dueCount, 1);
  assert.equal(habit.newCount, 1);
  assert.equal(habit.reviewedTodayCount, 6);
});
