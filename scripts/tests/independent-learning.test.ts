import test from "node:test";
import assert from "node:assert/strict";
import {
  getCurrentIndependentRecommendation,
  getIndependentDisplayTitle,
  getIndependentNewActivityCards,
} from "@/lib/independent-learning";

const now = new Date();

function stageOneActivities() {
  return [
    {
      id: "vocab-daily-review",
      title: "Daily Vocab Review",
      description: null,
      type: "word-list",
      category: "vocabulary",
      isReleased: true,
      content: "{}",
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 4.5 * 60 * 60 * 1000),
    },
    {
      id: "vocab-september",
      title: "September Vocabulary",
      description: null,
      type: "word-list",
      category: "vocabulary",
      isReleased: true,
      content: "{}",
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      id: "present-simple-guide",
      title: "Present Simple Guide",
      description: null,
      type: "guide",
      category: "grammar",
      isReleased: true,
      content: "{}",
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    },
    {
      id: "cmlkkffid00000enstsk7a3cc",
      title: "Minimal Pairs Listening Lab",
      description: null,
      type: "game",
      category: "pronunciation",
      isReleased: true,
      content: "{}",
      createdAt: new Date(now.getTime() - 110 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 100 * 60 * 1000),
    },
  ];
}

test("getCurrentIndependentRecommendation returns the full current unit across categories", () => {
  const recommendation = getCurrentIndependentRecommendation({
    activities: stageOneActivities(),
    progressRows: [],
    submissions: [],
  });

  assert.deepEqual(
    recommendation.map((item) => item.activityId),
    [
      "present-simple-guide",
      "vocab-daily-review",
      "vocab-september",
      "cmlkkffid00000enstsk7a3cc",
    ]
  );
  assert.equal(recommendation[0]?.assignmentId, null);
  assert.equal(recommendation[1]?.displayTitle, "Daily Vocab Review");
  assert.equal(recommendation[2]?.displayTitle, "Unit 1 Vocabulary: Getting to Know You");
  assert.equal(recommendation[3]?.displayTitle, "Minimal Pairs Lab");
  assert.equal(recommendation[1]?.href, "/dashboard/vocab-review");
  assert.equal(recommendation[2]?.href, "/activity/vocab-september");
});

test("getCurrentIndependentRecommendation keeps the learner inside the same stage until that full unit is done", () => {
  const recommendation = getCurrentIndependentRecommendation({
    activities: stageOneActivities(),
    progressRows: [],
    submissions: [
      {
        activityId: "present-simple-guide",
        score: 85,
        completedAt: new Date(now.getTime() - 60 * 60 * 1000),
      },
    ],
  });

  assert.deepEqual(
    recommendation.map((item) => item.activityId),
    [
      "present-simple-guide",
      "vocab-daily-review",
      "vocab-september",
      "cmlkkffid00000enstsk7a3cc",
    ]
  );
  assert.equal(recommendation[0]?.progressStatus, "completed");
  assert.equal(recommendation[2]?.displayTitle, "Unit 1 Vocabulary: Getting to Know You");
});

test("getCurrentIndependentRecommendation unlocks the next unit only after the whole current unit is completed", () => {
  const recommendation = getCurrentIndependentRecommendation({
    activities: [
      ...stageOneActivities(),
      {
        id: "present-continuous-guide",
        title: "Present Continuous Guide",
        description: null,
        type: "guide",
        category: "grammar",
        isReleased: true,
        content: "{}",
        createdAt: new Date(now.getTime() - 70 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 65 * 60 * 1000),
      },
      {
        id: "vocab-october-flashcards",
        title: "October Flash Cards",
        description: null,
        type: "flashcards",
        category: "vocabulary",
        isReleased: true,
        content: "{}",
        createdAt: new Date(now.getTime() - 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 55 * 60 * 1000),
      },
      {
        id: "countable-uncountable-nouns",
        title: "Countable and Uncountable Nouns",
        description: null,
        type: "game",
        category: "games",
        isReleased: true,
        content: "{}",
        createdAt: new Date(now.getTime() - 50 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 45 * 60 * 1000),
      },
    ],
    progressRows: [
      {
        activityId: "vocab-daily-review",
        progress: 100,
        status: "completed",
        categoryData: null,
      },
      {
        activityId: "vocab-september",
        progress: 100,
        status: "completed",
        categoryData: null,
      },
      {
        activityId: "cmlkkffid00000enstsk7a3cc",
        progress: 100,
        status: "completed",
        categoryData: null,
      },
    ],
    submissions: [
      {
        activityId: "present-simple-guide",
        score: 85,
        completedAt: new Date(now.getTime() - 60 * 60 * 1000),
      },
    ],
  });

  assert.deepEqual(
    recommendation.map((item) => item.activityId),
    [
      "present-continuous-guide",
      "vocab-october-flashcards",
      "countable-uncountable-nouns",
    ]
  );
  assert.equal(recommendation[1]?.displayTitle, "Unit 2 Vocabulary: Daily Life in the Community");
  assert.equal(recommendation[2]?.displayTitle, "Countable vs Uncountable Practice");
});

test("getIndependentNewActivityCards excludes path items and keeps only recent new releases", () => {
  const cards = getIndependentNewActivityCards({
    activities: [
      {
        id: "present-simple-guide",
        title: "Present Simple Guide",
        description: null,
        type: "guide",
        category: "grammar",
        isReleased: true,
        content: "{}",
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        id: "brand-new-game",
        title: "Brand New Game",
        description: "Fresh activity",
        type: "game",
        category: "games",
        isReleased: false,
        content: "{}",
        createdAt: new Date(now.getTime() - 30 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 30 * 60 * 1000),
      },
      {
        id: "older-activity",
        title: "Older Activity",
        description: null,
        type: "game",
        category: "games",
        isReleased: false,
        content: "{}",
        createdAt: new Date(now.getTime() - 30 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 30 * 60 * 60 * 1000),
      },
    ],
    progressRows: [],
    submissions: [],
  });

  assert.equal(cards.length, 1);
  assert.equal(cards[0]?.activityId, "brand-new-game");
});

test("getIndependentDisplayTitle uses independent-only vocab labels without changing stored titles", () => {
  assert.equal(
    getIndependentDisplayTitle({
      activityId: "vocab-september",
      title: "September Vocabulary",
    }),
    "Unit 1 Vocabulary: Getting to Know You"
  );

  assert.equal(
    getIndependentDisplayTitle({
      activityId: "vocab-october-flashcards",
      title: "Unit 2: Daily Life in the Community - Flash Cards",
    }),
    "Unit 2 Vocabulary: Daily Life in the Community"
  );
});
