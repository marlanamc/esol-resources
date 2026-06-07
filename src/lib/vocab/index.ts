// Vocab domain barrel exports

// Parser
export {
  parsePlainVocabulary,
  parseFlashcards,
  type FlashcardData,
} from "./parser";

// Display utilities
export {
  stripVocabTypeSuffix,
  extractTopicFromVocabDescription,
  getVocabUnitNumberFromActivityId,
  getVocabActivityDisplayTitle,
  parseVocabTypeLabel,
  getVocabTypeFromTitle,
  getVocabActivityType,
  getVocabSiblingIds,
  VOCAB_CHIP_CONFIG,
  type VocabActivityType,
} from "./display";

// Review system
export {
  DEFAULT_VOCAB_REVIEW_LIMIT,
  normalizeVocabTerm,
  buildVocabReviewSeedCards,
  syncVocabReviewCatalog,
  buildVocabReviewSummary,
  getOptimalDailyLimit,
  buildVocabReviewQueue,
  addDays,
  addHours,
  applyVocabReviewRating,
  getVocabReviewSummaryForUser,
  getVocabReviewQueueForUser,
  saveVocabReviewRating,
  type VocabReviewStateLike,
  type VocabReviewCardLike,
  type VocabReviewSeedCard,
} from "./review";

// Review sources
export {
  ALL_VOCAB_SOURCE_KEY,
  VOCAB_REVIEW_SOURCE_DEFINITIONS,
  getVocabReviewSourceByKey,
  getVocabReviewSourceByActivityId,
  isKnownVocabReviewSourceKey,
  type VocabReviewSourceDefinition,
} from "./sources";

// FSRS algorithm
export {
  applyFSRSRating as applyFSRSRatingAlgorithm,
  calculateCardPriority,
  estimateOptimalDailyLimit as estimateOptimalDailyLimitFSRS,
  type FSRSState,
  type FSRSResult,
} from "./fsrs";
