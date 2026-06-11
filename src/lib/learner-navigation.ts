// Re-export from new location for backward compatibility
export {
  RETURN_TO_QUERY_PARAM,
  ACTIVITIES_LAST_HREF_STORAGE_KEY,
  sanitizeInternalHref,
  withReturnTo,
  buildActivityHref,
  buildReturnStorageKey,
  resolveLearnerReturnHrefSync,
} from "./learner/navigation";
