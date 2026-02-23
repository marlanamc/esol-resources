const CURLY_APOSTROPHE_REGEX = /[\u2018\u2019]/g;
const TRAILING_PUNCTUATION_REGEX = /[.!?]+$/g;
const WHITESPACE_REGEX = /\s+/g;
const CANNOT_REGEX = /\bcannot\b/g;
const CANT_REGEX = /\bcan'?t\b/g;
const WONT_REGEX = /\bwon'?t\b/g;
const SHANT_REGEX = /\bshan'?t\b/g;
const NEGATIVE_CONTRACTION_REGEX =
  /\b(could|should|would|must|do|does|did|is|are|was|were|has|have|had|need|might|may)n'?t\b/g;
const IM_REGEX = /\bi'?m\b/g;
const RE_CONTRACTION_REGEX = /\b([a-z]+)'re\b/g;
const VE_CONTRACTION_REGEX = /\b([a-z]+)'ve\b/g;
const LL_CONTRACTION_REGEX = /\b([a-z]+)'ll\b/g;
const LETS_REGEX = /\blet'?s\b/g;

export function normalizeExerciseAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .replace(CURLY_APOSTROPHE_REGEX, "'")
    .trim()
    .replace(WHITESPACE_REGEX, " ")
    .replace(TRAILING_PUNCTUATION_REGEX, "")
    .replace(CANNOT_REGEX, "can not")
    .replace(CANT_REGEX, "can not")
    .replace(WONT_REGEX, "will not")
    .replace(SHANT_REGEX, "shall not")
    .replace(NEGATIVE_CONTRACTION_REGEX, "$1 not")
    .replace(IM_REGEX, "i am")
    .replace(RE_CONTRACTION_REGEX, "$1 are")
    .replace(VE_CONTRACTION_REGEX, "$1 have")
    .replace(LL_CONTRACTION_REGEX, "$1 will")
    .replace(LETS_REGEX, "let us")
    .replace(WHITESPACE_REGEX, " ")
    .trim();
}

export function areExerciseAnswersEquivalent(userAnswer: string, expectedAnswer: string): boolean {
  return normalizeExerciseAnswer(userAnswer) === normalizeExerciseAnswer(expectedAnswer);
}
