/**
 * Type definitions for the application
 * @module types
 */

// Activity types
export type {
    ActivityType,
    FormulaPartType,
    FormulaPart,
    ExerciseItem,
    Exercise,
    UsageMeaning,
    ComparisonRow,
    TimeExpression,
    VerbTable,
    InteractiveGuideSection,
    LegacyGuideMetadata,
    MiniQuizQuestion,
    QuestionResponse,
    SpeakingPrompt,
    KeyPhrase,
    ActivityProgressStatus,
    SoloStep,
    SpeakingStep,
    SoloModeConfig,
    SpeakingModeConfig,
    SpeakingSubmission,
    SpeakingActivityContent,
    InteractiveGuideContent,
    LegacyGuideContent,
    QuizQuestion,
    QuizContent,
    WorksheetSection,
    WorksheetContent,
    SlidesContent,
    GuideSection,
    GuideContent,
    FlashcardContent,
    MatchingContent,
    FillInBlankContent,
    VocabularyContent,
    EdPronunciationContent,
    MinimalPairsContent,
    ActivityContent,
    LegacyGuideResponse,
} from './activity';

export {
    parseActivityContent,
    isInteractiveGuideContent,
    isLegacyGuideContent,
    isSpeakingActivityContent,
    isVocabularyContent,
    isEdPronunciationContent,
    isMinimalPairsContent,
} from './activity';

// Gerund-Infinitive types
export type {
    VerbForm,
    PatternCategory,
    GerundInfinitivePattern,
    PatternExample,
    GerundInfinitiveGroup,
    GIExerciseType,
    GIExercise,
    ErrorToken,
    MeaningContext,
    SortingItem,
    PatternPerformance,
    GIRoundMode,
    GIGroupStage,
    GIRoundProgress,
    GIGroupProgress,
    GIUserPreferences,
    GerundInfinitiveContent,
    GIExerciseAnswer,
    GIGamePhase,
    GIGameState,
    GIRoundResults,
} from './gerund-infinitive';

export {
    GI_UNLOCK_THRESHOLD,
    GI_MASTERY_THRESHOLD,
    GI_ROUND1_SIZE,
    GI_ROUND2_SIZE,
    GI_CHECKPOINT_SIZE,
    GI_REVIEW_SIZE,
    GI_FINAL_SIZE,
    GI_REVIEW_UNLOCK_GROUPS,
    GI_ADAPTIVE_HINT_STREAK,
} from './gerund-infinitive';

// Irregular verbs types
export type {
    IrregularVerb,
    VerbRoundMode,
    VerbGroupStage,
    VerbGroup,
    ExerciseType,
    VerbExercise,
    VerbPerformance,
    VerbRoundProgress,
    GroupProgress,
    UserVerbPreferences,
    IrregularVerbsContent,
    VerbExerciseAnswer,
    VerbGameState,
    VerbGameRoundResults,
} from './irregular-verbs';

// Verb quiz types
export type {
    VerbData,
    VerbQuizContent,
    VerbQuizAnswers,
    VerbQuizSubmission,
} from './verb-quiz';

// Vocab review types
export type {
    VocabReviewRating,
    VocabReviewFilterGroup,
    VocabReviewFilter,
    VocabReviewCard,
    VocabReviewSummary,
    VocabReviewQueue,
    VocabReviewSubmissionResult,
} from './vocab-review';

// PWA types
export type {
    ServiceWorkerMessage,
    SwUpdateAvailableDetail,
    QueuedSubmission,
    SubmissionOutboxSnapshot,
} from './pwa';

// NextAuth types are augmented declarations, not re-exported
export type { UserRole } from './next-auth.d';
