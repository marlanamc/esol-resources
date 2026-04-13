// Re-export from new location for backward compatibility
export {
  isLearnerVisibleActivity,
  filterLearnerVisibleActivities,
  assertLearnerCanAccessActivity,
  createLearnerContentMetadataCache,
  getLearnerContentMetadata,
  type LearnerVisibleActivityInput,
  type LearnerContentMetadata,
  type LearnerContentMetadataCache,
} from "./learner/visibility";
