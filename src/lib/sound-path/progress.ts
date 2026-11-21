import { createPathEngine, type PathUpNext } from "@/lib/pattern-path/engine";
import { SOUND_PATH_FINAL_ID, SOUND_PATH_LEVELS, SOUND_PATH_WORLDS, type SoundPathWorldId } from "./levels";

/** Badge key stored in progress.badges when the final is first passed. */
export const SOUND_MASTER_BADGE = "soundMaster";

export type SoundUpNext = PathUpNext<SoundPathWorldId>;

export const {
  isWorldUnlocked,
  isCheckpointUnlocked,
  isFinalUnlocked,
  getUpNext,
  getSummary,
  processRound,
} = createPathEngine<SoundPathWorldId>({
  worlds: SOUND_PATH_WORLDS,
  levels: SOUND_PATH_LEVELS,
  finalId: SOUND_PATH_FINAL_ID,
  badgeKey: SOUND_MASTER_BADGE,
});
