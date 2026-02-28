/**
 * Irregular Verbs organized by pattern groups
 * Each group contains verbs that follow the same conjugation pattern
 * Based on: https://www.englishclub.com/grammar/verbs-irregular.htm
 */

import type { VerbGroup, IrregularVerb } from '@/types/irregular-verbs';

/**
 * GROUP 1: FORM DOESN'T CHANGE
 * All three verb forms are identical
 */
export const GROUP_1: VerbGroup = {
  id: 'group-1',
  title: 'Form Doesn\'t Change',
  pattern: 'All three forms (base, past, past participle) are identical',
  patternExample: 'cut → cut → cut',
  colorClass: 'bg-emerald-100 border-emerald-300 text-emerald-900',
  difficulty: 1,
  prerequisite: null,
  verbs: [
    { base: 'cost', past: 'cost', pastParticiple: 'cost' },
    { base: 'cut', past: 'cut', pastParticiple: 'cut' },
    { base: 'hit', past: 'hit', pastParticiple: 'hit' },
    { base: 'hurt', past: 'hurt', pastParticiple: 'hurt' },
    { base: 'let', past: 'let', pastParticiple: 'let' },
    { base: 'put', past: 'put', pastParticiple: 'put' },
    { base: 'quit', past: 'quit', pastParticiple: 'quit' },
    { base: 'set', past: 'set', pastParticiple: 'set' },
    { base: 'shut', past: 'shut', pastParticiple: 'shut' }
  ]
};

/**
 * GROUP 2A: -OUGHT PATTERN
 * Past and past participle end with -ought
 */
export const GROUP_2A: VerbGroup = {
  id: 'group-2a',
  title: '-ought Pattern',
  pattern: 'Past and past participle forms end with -ought',
  patternExample: 'bring → brought → brought',
  colorClass: 'bg-sky-100 border-sky-300 text-sky-900',
  difficulty: 2,
  prerequisite: 'group-1',
  verbs: [
    { base: 'bring', past: 'brought', pastParticiple: 'brought' },
    { base: 'buy', past: 'bought', pastParticiple: 'bought' },
    { base: 'catch', past: 'caught', pastParticiple: 'caught' },
    { base: 'fight', past: 'fought', pastParticiple: 'fought' },
    { base: 'teach', past: 'taught', pastParticiple: 'taught' },
    { base: 'think', past: 'thought', pastParticiple: 'thought' }
  ]
};

/**
 * GROUP 2B: -D TO -T PATTERN
 * Base form ends in -d, changes to -t in past forms
 */
export const GROUP_2B: VerbGroup = {
  id: 'group-2b',
  title: '-d to -t Pattern',
  pattern: 'Base form ends in -d, changes to -t in past and past participle',
  patternExample: 'spend → spent → spent',
  colorClass: 'bg-cyan-100 border-cyan-300 text-cyan-900',
  difficulty: 2,
  prerequisite: 'group-2a',
  verbs: [
    { base: 'spend', past: 'spent', pastParticiple: 'spent' },
    { base: 'send', past: 'sent', pastParticiple: 'sent' }
  ]
};

/**
 * GROUP 2C: ALSO -T ENDING
 * Various patterns ending in -t (from various base forms)
 */
export const GROUP_2C: VerbGroup = {
  id: 'group-2c',
  title: 'Also -t Ending',
  pattern: 'Past and past participle forms end in -t, with various base form patterns',
  patternExample: 'spell → spelt → spelt',
  colorClass: 'bg-blue-100 border-blue-300 text-blue-900',
  difficulty: 2,
  prerequisite: 'group-2b',
  verbs: [
    { base: 'build', past: 'built', pastParticiple: 'built' },
    { base: 'deal', past: 'dealt', pastParticiple: 'dealt' },
    { base: 'feel', past: 'felt', pastParticiple: 'felt' },
    { base: 'keep', past: 'kept', pastParticiple: 'kept' },
    { base: 'learn', past: 'learnt', pastParticiple: 'learnt' },
    { base: 'leave', past: 'left', pastParticiple: 'left' },
    { base: 'mean', past: 'meant', pastParticiple: 'meant' },
    { base: 'meet', past: 'met', pastParticiple: 'met' },
    { base: 'sleep', past: 'slept', pastParticiple: 'slept' },
    { base: 'spell', past: 'spelt', pastParticiple: 'spelt' },
    { base: 'sweep', past: 'swept', pastParticiple: 'swept' },
    { base: 'weep', past: 'wept', pastParticiple: 'wept' }
  ]
};

/**
 * GROUP 2D: ENDING IN -D
 * Past and past participle end in -d (vowel change common)
 */
export const GROUP_2D: VerbGroup = {
  id: 'group-2d',
  title: 'Ending in -d',
  pattern: 'Past and past participle forms end in -d',
  patternExample: 'lead → led → led',
  colorClass: 'bg-indigo-100 border-indigo-300 text-indigo-900',
  difficulty: 2,
  prerequisite: 'group-2c',
  verbs: [
    { base: 'hear', past: 'heard', pastParticiple: 'heard' },
    { base: 'hold', past: 'held', pastParticiple: 'held' },
    { base: 'lead', past: 'led', pastParticiple: 'led' },
    { base: 'pay', past: 'paid', pastParticiple: 'paid' },
    { base: 'say', past: 'said', pastParticiple: 'said' },
    { base: 'sell', past: 'sold', pastParticiple: 'sold' },
    { base: 'tell', past: 'told', pastParticiple: 'told' }
  ]
};

/**
 * GROUP 2E: OTHER SAME PAST/PARTICIPLE FORMS
 * Various patterns where past and past participle are identical
 */
export const GROUP_2E: VerbGroup = {
  id: 'group-2e',
  title: 'Other Same Past/Participle Forms',
  pattern: 'Past and past participle forms are identical (not -ought or -t)',
  patternExample: 'get → got → got',
  colorClass: 'bg-purple-100 border-purple-300 text-purple-900',
  difficulty: 2,
  prerequisite: 'group-2d',
  verbs: [
    { base: 'find', past: 'found', pastParticiple: 'found' },
    { base: 'get', past: 'got', pastParticiple: 'got' },
    { base: 'have', past: 'had', pastParticiple: 'had' },
    { base: 'make', past: 'made', pastParticiple: 'made' },
    { base: 'shine', past: 'shone', pastParticiple: 'shone' },
    { base: 'shoot', past: 'shot', pastParticiple: 'shot' },
    { base: 'sit', past: 'sat', pastParticiple: 'sat' },
    { base: 'understand', past: 'understood', pastParticiple: 'understood' },
    { base: 'win', past: 'won', pastParticiple: 'won' }
  ]
};

/**
 * GROUP 3A: I-A-U VOWEL PATTERN
 * Three different forms with i → a → u vowel shift
 */
export const GROUP_3A: VerbGroup = {
  id: 'group-3a',
  title: 'i-a-u Vowel Pattern',
  pattern: 'Three different forms with vowel shift: i (base) → a (past) → u (past participle)',
  patternExample: 'sing → sang → sung',
  colorClass: 'bg-pink-100 border-pink-300 text-pink-900',
  difficulty: 3,
  prerequisite: 'group-2e',
  verbs: [
    { base: 'begin', past: 'began', pastParticiple: 'begun' },
    { base: 'drink', past: 'drank', pastParticiple: 'drunk' },
    { base: 'ring', past: 'rang', pastParticiple: 'rung' },
    { base: 'shrink', past: 'shrank', pastParticiple: 'shrunk' },
    { base: 'sing', past: 'sang', pastParticiple: 'sung' },
    { base: 'sink', past: 'sank', pastParticiple: 'sunk' },
    { base: 'swim', past: 'swam', pastParticiple: 'swum' }
  ]
};

/**
 * GROUP 3B: PAST PARTICIPLE -EN
 * Three different forms, past participle ends in -en
 */
export const GROUP_3B: VerbGroup = {
  id: 'group-3b',
  title: 'Past Participle -en',
  pattern: 'Three different forms with past participle ending in -en',
  patternExample: 'take → took → taken',
  colorClass: 'bg-rose-100 border-rose-300 text-rose-900',
  difficulty: 3,
  prerequisite: 'group-3a',
  verbs: [
    { base: 'bite', past: 'bit', pastParticiple: 'bitten' },
    { base: 'break', past: 'broke', pastParticiple: 'broken' },
    { base: 'choose', past: 'chose', pastParticiple: 'chosen' },
    { base: 'drive', past: 'drove', pastParticiple: 'driven' },
    { base: 'eat', past: 'ate', pastParticiple: 'eaten' },
    { base: 'fall', past: 'fell', pastParticiple: 'fallen' },
    { base: 'give', past: 'gave', pastParticiple: 'given' },
    { base: 'ride', past: 'rode', pastParticiple: 'ridden' },
    { base: 'shake', past: 'shook', pastParticiple: 'shaken' },
    { base: 'speak', past: 'spoke', pastParticiple: 'spoken' },
    { base: 'steal', past: 'stole', pastParticiple: 'stolen' },
    { base: 'take', past: 'took', pastParticiple: 'taken' },
    { base: 'wake', past: 'woke', pastParticiple: 'woken' },
    { base: 'write', past: 'wrote', pastParticiple: 'written' }
  ]
};

/**
 * GROUP 3C: PAST PARTICIPLE -OWN
 * Three different forms, past participle ends in -own
 */
export const GROUP_3C: VerbGroup = {
  id: 'group-3c',
  title: 'Past Participle -own',
  pattern: 'Three different forms with past participle ending in -own',
  patternExample: 'throw → threw → thrown',
  colorClass: 'bg-amber-100 border-amber-300 text-amber-900',
  difficulty: 3,
  prerequisite: 'group-3b',
  verbs: [
    { base: 'blow', past: 'blew', pastParticiple: 'blown' },
    { base: 'fly', past: 'flew', pastParticiple: 'flown' },
    { base: 'grow', past: 'grew', pastParticiple: 'grown' },
    { base: 'know', past: 'knew', pastParticiple: 'known' },
    { base: 'swear', past: 'swore', pastParticiple: 'sworn' },
    { base: 'tear', past: 'tore', pastParticiple: 'torn' },
    { base: 'throw', past: 'threw', pastParticiple: 'thrown' }
  ]
};

/**
 * GROUP 3D: OTHER THREE DIFFERENT FORMS
 * Unique or less common three-form patterns (including "be")
 */
export const GROUP_3D: VerbGroup = {
  id: 'group-3d',
  title: 'Other Three Different Forms',
  pattern: 'Three completely different forms that don\'t follow other patterns',
  patternExample: 'be → was/were → been',
  colorClass: 'bg-red-100 border-red-300 text-red-900',
  difficulty: 3,
  prerequisite: 'group-3c',
  verbs: [
    { base: 'be', past: 'was/were', pastParticiple: 'been' },
    { base: 'do', past: 'did', pastParticiple: 'done' },
    { base: 'go', past: 'went', pastParticiple: 'gone' },
    { base: 'see', past: 'saw', pastParticiple: 'seen' }
  ]
};

/**
 * All verb groups in order
 * Maintains sequential unlock order
 */
export const VERB_GROUPS: VerbGroup[] = [
  GROUP_1,
  GROUP_2A,
  GROUP_2B,
  GROUP_2C,
  GROUP_2D,
  GROUP_2E,
  GROUP_3A,
  GROUP_3B,
  GROUP_3C,
  GROUP_3D
];

/**
 * Helper function to get a group by ID
 */
export function getVerbGroupById(groupId: string): VerbGroup | undefined {
  return VERB_GROUPS.find(group => group.id === groupId);
}

/**
 * Helper function to get all verbs from a group
 */
export function getVerbsFromGroup(groupId: string): IrregularVerb[] {
  const group = getVerbGroupById(groupId);
  return group?.verbs ?? [];
}

/**
 * Helper function to get next group in sequence
 */
export function getNextGroup(currentGroupId: string): VerbGroup | undefined {
  const currentIndex = VERB_GROUPS.findIndex(g => g.id === currentGroupId);
  return currentIndex >= 0 ? VERB_GROUPS[currentIndex + 1] : undefined;
}

/**
 * Helper function to get group index (position in sequence)
 */
export function getGroupIndex(groupId: string): number {
  return VERB_GROUPS.findIndex(g => g.id === groupId);
}

/**
 * Statistics about verb groups
 */
export const VERB_GROUPS_STATS = {
  totalGroups: VERB_GROUPS.length,
  totalVerbs: VERB_GROUPS.reduce((sum, group) => sum + group.verbs.length, 0),
  groupsByDifficulty: {
    1: VERB_GROUPS.filter(g => g.difficulty === 1).length,
    2: VERB_GROUPS.filter(g => g.difficulty === 2).length,
    3: VERB_GROUPS.filter(g => g.difficulty === 3).length
  }
};
