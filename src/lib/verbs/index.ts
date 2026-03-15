// Verbs domain barrel exports
// Note: irregular verbs and gerund-infinitive have similar function names
// Use namespaced imports to avoid conflicts

// Verb definitions (shared)
export { getVerbDefinition } from "./definitions";

// Irregular verbs progress - namespaced as 'irregularVerbs'
import * as irregularVerbsProgress from "./irregular-progress";
export { irregularVerbsProgress };

// Re-export commonly used irregular verb constants
export {
  UNLOCK_THRESHOLD as IV_UNLOCK_THRESHOLD,
  ROUND_2_MASTERY_THRESHOLD as IV_MASTERY_THRESHOLD,
  ALL_PATTERNS_GROUP_ID,
  ALL_PATTERNS_GROUP,
} from "./irregular-progress";

// Gerund-infinitive progress - namespaced as 'gerundInfinitive'
import * as gerundInfinitiveProgress from "./gerund-infinitive-progress";
export { gerundInfinitiveProgress };

// Re-export commonly used gerund-infinitive constants
export {
  UNLOCK_THRESHOLD as GI_UNLOCK_THRESHOLD_CONST,
  ROUND_2_MASTERY_THRESHOLD as GI_MASTERY_THRESHOLD_CONST,
  REVIEW_UNLOCK_COUNT as GI_REVIEW_UNLOCK_COUNT,
} from "./gerund-infinitive-progress";
