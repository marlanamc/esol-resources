import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fillInBlankSource = readFileSync(
  new URL("../../src/components/ui/FillInBlankGame.tsx", import.meta.url),
  "utf8"
);

const matchingSource = readFileSync(
  new URL("../../src/components/ui/MatchingGame.tsx", import.meta.url),
  "utf8"
);

const vocabMatchingStart = matchingSource.indexOf(
  "// --- Vocab (term::definition) matching UI ---"
);
const vocabMatchingEnd = matchingSource.indexOf(
  "// --- Time Indicators Sorting UI ---"
);

assert.notEqual(vocabMatchingStart, -1, "Vocab matching section should exist");
assert.notEqual(vocabMatchingEnd, -1, "Time indicator section marker should exist");

const vocabMatchingSection = matchingSource.slice(
  vocabMatchingStart,
  vocabMatchingEnd
);

test("FillInBlankGame uses dark-safe success and error state classes", () => {
  assert.match(
    fillInBlankSource,
    /correctOptionStateClasses = "bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950\/40 dark:border-emerald-500\/60 dark:text-emerald-50"/
  );
  assert.match(
    fillInBlankSource,
    /wrongOptionStateClasses = "bg-rose-50 border-rose-300 text-rose-950 dark:bg-rose-950\/40 dark:border-rose-500\/60 dark:text-rose-100"/
  );
  assert.match(
    fillInBlankSource,
    /text-\[var\(--color-text-on-accent\)\]/
  );
  assert.ok(
    !fillInBlankSource.includes(
      'bg-[var(--color-secondary)] text-white rounded-xl p-6 text-center mb-4'
    ),
    "completion card should no longer hard-code white text on the success surface"
  );
});

test("Vocab matching UI avoids light-only mobile card and inline hex state colors", () => {
  assert.match(
    vocabMatchingSection,
    /bg-\[var\(--tone-vocabulary-surface\)\]/
  );
  assert.match(
    vocabMatchingSection,
    /text-\[var\(--color-text-on-accent\)\]/
  );
  assert.ok(
    !vocabMatchingSection.includes("bg-blue-50"),
    "selected-word mobile card should not use a light-only blue background"
  );
  assert.ok(
    !vocabMatchingSection.includes("#f0fdf4"),
    "matched cards should not rely on inline light-mode hex colors"
  );
  assert.ok(
    !vocabMatchingSection.includes("#fef2f2"),
    "wrong-answer cards should not rely on inline light-mode hex colors"
  );
  assert.ok(
    !vocabMatchingSection.includes("rgba(176, 87, 64, 0.1)"),
    "selected cards should not rely on inline RGBA colors"
  );
  assert.match(
    vocabMatchingSection,
    /w-full min-h-\[48px\] rounded-lg border-2 px-4 py-3 text-left/
  );
  assert.match(
    matchingSource,
    /VOCAB_MATCH_CARD_STYLES/
  );
  assert.match(
    vocabMatchingSection,
    /style=\{getTermCardStyle\(p\.id\)\}/
  );
  assert.match(
    vocabMatchingSection,
    /style=\{getDefinitionCardStyle\(p\.id\)\}/
  );
  assert.ok(
    matchingSource.includes("backgroundColor: \"var(--tone-vocabulary-surface-muted)\""),
    "selected cards should use an explicit theme-aware inline background"
  );
});
