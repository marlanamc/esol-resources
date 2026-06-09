import type { SpeedRoundVerb } from '@/types/verb-speed-round';
import { v3IsSameAsV2 } from '@/types/verb-speed-round';

/**
 * 99 high-frequency verbs from the worksheet at
 * worksheets/printouts/verb-speed-round-quizzes-1-20.html.
 *
 * - V2 = simple past; V3 = past participle.
 * - "/" indicates accepted alternate spellings (e.g. "learned/learnt").
 * - "=" or "S" in V3 means the form is identical to V2 — game will skip the V3 input.
 */
export const VERB_SPEED_ROUND_POOL: SpeedRoundVerb[] = [
  { v1: 'be', v2: 'was/were', v3: 'been' },
  { v1: 'say', v2: 'said', v3: '=' },
  { v1: 'get', v2: 'got', v3: 'gotten/got' },
  { v1: 'see', v2: 'saw', v3: 'seen' },
  { v1: 'give', v2: 'gave', v3: 'given' },
  { v1: 'tell', v2: 'told', v3: '=' },
  { v1: 'feel', v2: 'felt', v3: '=' },
  { v1: 'leave', v2: 'left', v3: '=' },
  { v1: 'put', v2: 'put', v3: '=' },
  { v1: 'hear', v2: 'heard', v3: '=' },
  { v1: 'stand', v2: 'stood', v3: '=' },
  { v1: 'meet', v2: 'met', v3: '=' },
  { v1: 'speak', v2: 'spoke', v3: 'spoken' },
  { v1: 'hold', v2: 'held', v3: '=' },
  { v1: 'eat', v2: 'ate', v3: 'eaten' },
  { v1: 'wake', v2: 'woke', v3: 'woken' },
  { v1: 'ride', v2: 'rode', v3: 'ridden' },
  { v1: 'have', v2: 'had', v3: '=' },
  { v1: 'make', v2: 'made', v3: '=' },
  { v1: 'know', v2: 'knew', v3: 'known' },
  { v1: 'come', v2: 'came', v3: 'come' },
  { v1: 'use', v2: 'used', v3: '=' },
  { v1: 'ask', v2: 'asked', v3: '=' },
  { v1: 'try', v2: 'tried', v3: '=' },
  { v1: 'call', v2: 'called', v3: '=' },
  { v1: 'mean', v2: 'meant', v3: '=' },
  { v1: 'write', v2: 'wrote', v3: 'written' },
  { v1: 'lose', v2: 'lost', v3: '=' },
  { v1: 'read', v2: 'read', v3: '=' },
  { v1: 'buy', v2: 'bought', v3: '=' },
  { v1: 'build', v2: 'built', v3: '=' },
  { v1: 'drink', v2: 'drank', v3: 'drunk' },
  { v1: 'run', v2: 'ran', v3: 'run' },
  { v1: 'fly', v2: 'flew', v3: 'flown' },
  { v1: 'do', v2: 'did', v3: 'done' },
  { v1: 'go', v2: 'went', v3: 'gone' },
  { v1: 'think', v2: 'thought', v3: '=' },
  { v1: 'take', v2: 'took', v3: 'taken' },
  { v1: 'find', v2: 'found', v3: '=' },
  { v1: 'work', v2: 'worked', v3: '=' },
  { v1: 'need', v2: 'needed', v3: '=' },
  { v1: 'keep', v2: 'kept', v3: '=' },
  { v1: 'begin', v2: 'began', v3: 'begun' },
  { v1: 'sit', v2: 'sat', v3: '=' },
  { v1: 'pay', v2: 'paid', v3: '=' },
  { v1: 'understand', v2: 'understood', v3: '=' },
  { v1: 'send', v2: 'sent', v3: '=' },
  { v1: 'break', v2: 'broke', v3: 'broken' },
  { v1: 'sleep', v2: 'slept', v3: '=' },
  { v1: 'drive', v2: 'drove', v3: 'driven' },
  { v1: 'wear', v2: 'wore', v3: 'worn' },
  { v1: 'hurt', v2: 'hurt', v3: '=' },
  { v1: 'fall', v2: 'fell', v3: 'fallen' },
  { v1: 'cost', v2: 'cost', v3: '=' },
  { v1: 'apply', v2: 'applied', v3: '=' },
  { v1: 'confirm', v2: 'confirmed', v3: '=' },
  { v1: 'forward', v2: 'forwarded', v3: '=' },
  { v1: 'contact', v2: 'contacted', v3: '=' },
  { v1: 'mention', v2: 'mentioned', v3: '=' },
  { v1: 'freeze', v2: 'froze', v3: 'frozen' },
  { v1: 'fix', v2: 'fixed', v3: '=' },
  { v1: 'store', v2: 'stored', v3: '=' },
  { v1: 'shake', v2: 'shook', v3: 'shaken' },
  { v1: 'mix', v2: 'mixed', v3: '=' },
  { v1: 'feed', v2: 'fed', v3: '=' },
  { v1: 'spread', v2: 'spread', v3: '=' },
  { v1: 'grow', v2: 'grew', v3: 'grown' },
  { v1: 'bring', v2: 'brought', v3: '=' },
  { v1: 'choose', v2: 'chose', v3: 'chosen' },
  { v1: 'lend', v2: 'lent', v3: '=' },
  { v1: 'submit', v2: 'submitted', v3: '=' },
  { v1: 'respond', v2: 'responded', v3: '=' },
  { v1: 'report', v2: 'reported', v3: '=' },
  { v1: 'chat', v2: 'chatted', v3: '=' },
  { v1: 'talk', v2: 'talked', v3: '=' },
  { v1: 'burst', v2: 'burst', v3: '=' },
  { v1: 'prescribe', v2: 'prescribed', v3: '=' },
  { v1: 'refill', v2: 'refilled', v3: '=' },
  { v1: 'forgive', v2: 'forgave', v3: 'forgiven' },
  { v1: 'heat', v2: 'heated', v3: '=' },
  { v1: 'bite', v2: 'bit', v3: 'bitten' },
  { v1: 'spoil', v2: 'spoiled/spoilt', v3: '=' },
  { v1: 'lead', v2: 'led', v3: '=' },
  { v1: 'cut', v2: 'cut', v3: '=' },
  { v1: 'sell', v2: 'sold', v3: '=' },
  { v1: 'spend', v2: 'spent', v3: '=' },
  { v1: 'schedule', v2: 'scheduled', v3: '=' },
  { v1: 'reply', v2: 'replied', v3: '=' },
  { v1: 'document', v2: 'documented', v3: '=' },
  { v1: 'discuss', v2: 'discussed', v3: '=' },
  { v1: 'comply', v2: 'complied', v3: '=' },
  { v1: 'leak', v2: 'leaked', v3: '=' },
  { v1: 'examine', v2: 'examined', v3: '=' },
  { v1: 'catch', v2: 'caught', v3: '=' },
  { v1: 'overcome', v2: 'overcame', v3: 'overcome' },
  { v1: 'rest', v2: 'rested', v3: '=' },
  { v1: 'burn', v2: 'burned/burnt', v3: '=' },
  { v1: 'teach', v2: 'taught', v3: '=' },
  { v1: 'deal', v2: 'dealt', v3: '=' },
];

/**
 * Frequency tier weights — the pool is ordered roughly by usage frequency,
 * so we give earlier verbs a much higher chance of being drawn.
 */
function frequencyWeight(index: number): number {
  if (index < 30) return 6;   // top 30 most frequent: be, get, see, give, make…
  if (index < 60) return 3;   // mid-frequency: write, drive, choose, freeze…
  return 1;                   // lower-frequency: prescribe, refill, comply…
}

/**
 * Pick one verb from a weighted pool of indices. Removes the chosen index
 * from `available` so the same verb can't appear twice in a round.
 */
function weightedPick(
  available: number[],
  weightFor: (index: number) => number
): number {
  const totalWeight = available.reduce((sum, i) => sum + weightFor(i), 0);
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < available.length; i++) {
    roll -= weightFor(available[i]);
    if (roll <= 0) {
      return available.splice(i, 1)[0];
    }
  }
  return available.splice(available.length - 1, 1)[0];
}

/**
 * Pick a balanced, frequency-weighted set of verbs for one round.
 *
 * - Targets ~60% verbs with a distinct V3 (so students practice the
 *   past-participle form, not just V2) and ~40% verbs where V3 = V2.
 * - Within each bucket, earlier (more-frequent) verbs are heavily favored.
 */
export function pickRandomVerbs(count: number): SpeedRoundVerb[] {
  const distinctV3Indices: number[] = [];
  const sameAsV2Indices: number[] = [];
  VERB_SPEED_ROUND_POOL.forEach((verb, i) => {
    if (v3IsSameAsV2(verb.v3)) sameAsV2Indices.push(i);
    else distinctV3Indices.push(i);
  });

  const targetDistinct = Math.round(count * 0.6);
  const targetSame = count - targetDistinct;
  const picked: number[] = [];

  for (let i = 0; i < targetDistinct && distinctV3Indices.length > 0; i++) {
    picked.push(weightedPick(distinctV3Indices, frequencyWeight));
  }
  for (let i = 0; i < targetSame && sameAsV2Indices.length > 0; i++) {
    picked.push(weightedPick(sameAsV2Indices, frequencyWeight));
  }
  // Top up from whichever bucket still has verbs (handles edge cases)
  while (picked.length < count) {
    const remaining = distinctV3Indices.length > 0 ? distinctV3Indices : sameAsV2Indices;
    if (remaining.length === 0) break;
    picked.push(weightedPick(remaining, frequencyWeight));
  }

  // Shuffle so distinct-V3 and same-as-V2 verbs interleave inside the round
  for (let i = picked.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picked[i], picked[j]] = [picked[j], picked[i]];
  }

  return picked.map((i) => VERB_SPEED_ROUND_POOL[i]);
}
