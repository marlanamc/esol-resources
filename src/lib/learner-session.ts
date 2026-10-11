/** Current authenticated learner, set by the root session bridge. Never persisted. */
let learnerId: string | null = null;
export const getActiveLearnerId = () => learnerId;
export function setActiveLearnerId(id: string | null) { learnerId = id; }
