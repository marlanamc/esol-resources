import assert from "node:assert/strict";
import {
  areExerciseAnswersEquivalent,
  normalizeExerciseAnswer,
} from "@/lib/exercise-answer-normalization";

console.log("Running exercise answer normalization checks...");

assert.strictEqual(
  areExerciseAnswersEquivalent("do not sleep", "don't sleep"),
  true,
  "do not and don't should be equivalent"
);

assert.strictEqual(
  areExerciseAnswersEquivalent("do\u2019not sleep", "don't sleep"),
  false,
  "missing space should not be treated as valid text input"
);

assert.strictEqual(
  areExerciseAnswersEquivalent("do\u2019t sleep", "don't sleep"),
  false,
  "invalid contraction should not be accepted"
);

assert.strictEqual(
  areExerciseAnswersEquivalent("do\u2019t", "don't"),
  false,
  "invalid contraction token should not normalize to don't"
);

assert.strictEqual(
  areExerciseAnswersEquivalent("don\u2019t sleep", "do not sleep"),
  true,
  "curly apostrophes should be normalized"
);

assert.strictEqual(
  areExerciseAnswersEquivalent("doesnt", "doesn't"),
  true,
  "missing apostrophe in negative contractions should still pass"
);

assert.strictEqual(
  areExerciseAnswersEquivalent("is not", "isn't"),
  true,
  "is not and isn't should be equivalent"
);

assert.strictEqual(
  areExerciseAnswersEquivalent("won't attend", "will not attend"),
  true,
  "won't and will not should be equivalent"
);

assert.strictEqual(
  areExerciseAnswersEquivalent("cannot go", "can't go"),
  true,
  "cannot and can't should be equivalent"
);

assert.strictEqual(
  areExerciseAnswersEquivalent("I am not going", "I'm not going"),
  true,
  "I'm and I am should be equivalent"
);

assert.strictEqual(
  areExerciseAnswersEquivalent("they are working", "they're working"),
  true,
  "'re contractions should normalize to full form"
);

assert.strictEqual(
  areExerciseAnswersEquivalent("we have finished", "we've finished"),
  true,
  "'ve contractions should normalize to full form"
);

assert.strictEqual(
  areExerciseAnswersEquivalent("she will arrive", "she'll arrive"),
  true,
  "'ll contractions should normalize to full form"
);

assert.strictEqual(
  areExerciseAnswersEquivalent(
    "Could you tell me where the manager's office is?",
    "could you tell me where the manager's office is"
  ),
  true,
  "possessives should remain intact while punctuation is normalized"
);

assert.strictEqual(
  areExerciseAnswersEquivalent(
    "Could you tell me where the manager is office is?",
    "Could you tell me where the manager's office is?"
  ),
  false,
  "possessives should not be rewritten as contractions"
);

assert.strictEqual(
  normalizeExerciseAnswer("  DON'T   SLEEP!!! "),
  "do not sleep",
  "normalization should still collapse spaces and trailing punctuation"
);

console.log("✅ Exercise answer normalization checks passed.");
