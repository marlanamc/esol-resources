import { applyFSRSRating, calculateCardPriority, estimateOptimalDailyLimit } from "@/lib/fsrs-algorithm";
import type { VocabReviewRating } from "@/types/vocab-review";

function testFSRSAlgorithm() {
  console.log("🧪 Testing FSRS Algorithm\n");

  // Test 1: New card progression
  console.log("📝 Test 1: New card progression");
  let state: {
    step: number;
    easeFactor: number;
    difficulty: number;
    stability: number;
    lastInterval: number;
    totalReviews: number;
    lapses: number;
    performanceHistory: number[];
  } | null = null;
  const ratings: VocabReviewRating[] = ["good", "good", "easy", "hard", "good"];
  
  ratings.forEach((rating, index) => {
    const result = applyFSRSRating(state, rating, new Date());
    console.log(`  Review ${index + 1} (${rating}): Step ${result.step}, Due in ${Math.round((result.dueAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`);
    console.log(`    Ease: ${result.easeFactor.toFixed(2)}, Difficulty: ${result.difficulty.toFixed(2)}, Stability: ${result.stability.toFixed(2)}`);
    state = result;
  });

  // Test 2: "Again" rating behavior
  console.log("\n🔄 Test 2: 'Again' rating behavior");
  state = { step: 3, easeFactor: 2.8, difficulty: 0.3, stability: 1.2, lastInterval: 14, totalReviews: 5, lapses: 0, performanceHistory: [0.8, 0.8, 1.0, 0.5, 0.8] };
  const againResult = applyFSRSRating(state, "again", new Date());
  console.log(`  'Again' rating: Step ${againResult.step}, Due in ${Math.round((againResult.dueAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`);
  console.log(`    Ease: ${againResult.easeFactor.toFixed(2)}, Difficulty: ${againResult.difficulty.toFixed(2)}, Lapses: ${againResult.lapses}`);

  // Test 3: Card priority calculation
  console.log("\n🎯 Test 3: Card priority calculation");
  const now = new Date();
  const overdueCard = {
    dueAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day overdue
    difficulty: 0.4,
    easeFactor: 2.5,
    isNew: false,
    performanceHistory: [0.8, 0.5]
  };
  
  const newCard = {
    dueAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Due tomorrow
    difficulty: 0.2,
    easeFactor: 2.8,
    isNew: true,
    performanceHistory: []
  };
  
  const futureCard = {
    dueAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
    difficulty: 0.8,
    easeFactor: 1.8,
    isNew: false,
    performanceHistory: [0.8, 0.8, 0.8]
  };

  console.log(`  Overdue card priority: ${calculateCardPriority(overdueCard, now)}`);
  console.log(`  New card priority: ${calculateCardPriority(newCard, now)}`);
  console.log(`  Future card priority: ${calculateCardPriority(futureCard, now)}`);

  // Test 4: Optimal daily limit calculation
  console.log("\n📊 Test 4: Optimal daily limit calculation");
  const cards = [
    { difficulty: 0.2, isDue: true, isNew: false },
    { difficulty: 0.8, isDue: true, isNew: false },
    { difficulty: 0.1, isDue: true, isNew: false },
    { difficulty: 0.5, isDue: false, isNew: true },
    { difficulty: 0.3, isDue: false, isNew: true },
    { difficulty: 0.9, isDue: false, isNew: true },
  ];

  const optimalLimit = estimateOptimalDailyLimit(cards);
  console.log(`  Cards: ${cards.length} (3 due, 3 new)`);
  console.log(`  Optimal daily limit: ${optimalLimit} cards`);

  console.log("\n✅ FSRS Algorithm tests completed!");
}

if (require.main === module) {
  testFSRSAlgorithm();
}

export { testFSRSAlgorithm };
