export interface SpeedRoundVerb {
  v1: string;
  /** Simple past. Use "/" for accepted alternates: "learned/learnt" */
  v2: string;
  /** Past participle. "=" or "S" means "same as V2" — input auto-skipped. */
  v3: string;
}

export interface VerbSpeedRoundContent {
  type: 'verb-speed-round';
  /** Verbs per round (defaults to 10). */
  verbsPerRound?: number;
}

const SAME_AS_V2_SENTINELS = new Set(['=', 's', '']);

export function v3IsSameAsV2(correctV3: string): boolean {
  return SAME_AS_V2_SENTINELS.has(correctV3.trim().toLowerCase());
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '');
}

export function isFormCorrect(userAnswer: string, correctAnswer: string): boolean {
  const u = normalize(userAnswer);
  const c = normalize(correctAnswer);
  if (u === '') return false;
  if (!c.includes('/')) return u === c;
  const correctParts = c.split('/').filter(Boolean);
  return correctParts.includes(u);
}

export function resolveCorrectV3(verb: SpeedRoundVerb): string {
  return v3IsSameAsV2(verb.v3) ? verb.v2 : verb.v3;
}
