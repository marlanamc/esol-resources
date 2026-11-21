import {
  createPathEngine,
  type PathProgress,
  type PathRoundResult,
  type PathStage,
  type PathStepProgress,
  type PathUpNext,
} from "@/lib/pattern-path/engine";
import { TENSE_PATH_FINAL_ID, TENSE_PATH_LEVELS, TENSE_PATH_WORLDS, type TensePathWorldId } from "./levels";

export {
  PASS_ACCURACY,
  calculatePathRoundPoints as calculateTensePathRoundPoints,
  checkpointId,
  emptyProgress,
  emptyStep,
  getLevelRoundMode,
  getLevelStage,
  getStep,
  isServerRoundPassed as isTensePathServerRoundPassed,
  normalizeProgress,
  toServerRoundMode,
} from "@/lib/pattern-path/engine";

export type TensePathStepProgress = PathStepProgress;
export type TensePathProgress = PathProgress;
export type TensePathStage = PathStage;
export type TensePathRoundResult = PathRoundResult;
export type UpNext = PathUpNext<TensePathWorldId>;

/** Badge key stored in progress.badges when the final is first passed. */
export const TENSE_MASTER_BADGE = "tenseMaster";

const engine = createPathEngine<TensePathWorldId>({
  worlds: TENSE_PATH_WORLDS,
  levels: TENSE_PATH_LEVELS,
  finalId: TENSE_PATH_FINAL_ID,
  badgeKey: TENSE_MASTER_BADGE,
});

export const {
  isWorldUnlocked,
  isCheckpointUnlocked,
  isFinalUnlocked,
  getUpNext,
  getSummary,
  isMapGoalMet,
  processRound,
} = engine;
