import { POS_DEFINITIONS } from '@/types/parts-of-speech';
import type { PartOfSpeech, POSSwipeSortCard } from '@/types/parts-of-speech';
import { getWordNote } from '@/data/parts-of-speech-word-notes';
import type { WordSortLevel, WordSortTarget } from './types';

// Brackets mark the exact occurrence being classified. IDs use explicit keys so
// editing a sentence does not invalidate a learner's saved review queue.
type Example = [key: string, markedSentence: string, explanation: string];
const examples: Record<PartOfSpeech, Example[]> = {
  verb: [
    ['work', 'I [work] at a school.', 'Work tells what I do. Here it is a verb.'],
    ['cook', 'We [cook] dinner at home.', 'Cook tells what we do.'],
    ['walk', 'They [walk] to the bus stop.', 'Walk tells what they do.'],
    ['drink', 'Please [drink] some water.', 'Drink tells someone what to do.'],
    ['read', 'I [read] before bed.', 'Read names an action.'],
    ['help', 'Can you [help] me?', 'Help is the action after can.'],
    ['play', 'The children [play] outside.', 'Play tells what the children do.'],
    ['call', 'Please [call] your teacher.', 'Call tells someone what to do.'],
    ['clean', 'We [clean] the kitchen.', 'Clean is an action here: we make the kitchen clean.'],
    ['open', 'Please [open] the window.', 'Open tells someone what to do to the window.'],
    ['water', 'I [water] the plants.', 'Water is an action here: giving water to plants.'],
    ['visit', 'We [visit] our neighbors.', 'Visit tells what we do.'],
    ['watch', 'We [watch] the children.', 'Watch is the action of looking after the children.'],
    ['book', 'Please [book] a table.', 'Book means reserve here, so it is a verb.'],
    ['light', 'They [light] the candles.', 'Light is an action here: making the candles burn.'],
    ['like', 'I [like] this music.', 'Like describes a feeling. Verbs can express feelings as well as actions.'],
    ['is', 'The soup [is] hot.', 'Is links the soup to a description. It is a verb.'],
    ['have', 'We [have] two cats.', 'Have expresses possession. It is a verb.'],
  ],
  noun: [
    ['teacher', 'The [teacher] is here.', 'Teacher names a person.'],
    ['school', 'Our [school] is nearby.', 'School names a place.'],
    ['bus', 'The [bus] is late.', 'Bus names a thing.'],
    ['table', 'Put it on the [table].', 'Table names a thing.'],
    ['dinner', 'Our [dinner] is ready.', 'Dinner names a meal.'],
    ['friend', 'My [friend] called.', 'Friend names a person.'],
    ['water', 'I need some [water].', 'Water names something to drink here.'],
    ['book', 'This [book] is interesting.', 'Book names a thing you can read.'],
    ['work', 'My [work] starts at nine.', 'Work names a job or activity here; it does not tell an action.'],
    ['walk', 'We took a [walk].', 'Walk names an activity after a.'],
    ['drink', 'Your [drink] is on the table.', 'Drink names something you can drink here.'],
    ['call', 'I missed your [call].', 'Call names an event here.'],
    ['watch', 'My [watch] is broken.', 'Watch names the thing that tells time.'],
    ['light', 'Turn on the [light].', 'Light names a thing here.'],
    ['help', 'Thank you for your [help].', 'Help names the assistance someone gave.'],
    ['visit', 'We enjoyed the [visit].', 'Visit names an event after the.'],
    ['play', 'The school [play] was funny.', 'Play names a performance here.'],
    ['love', 'Her [love] for her family is strong.', 'Love names a feeling here. A noun can name an idea or feeling.'],
  ],
  pronoun: [
    ['i', '[I] live nearby.', 'I stands for the speaker.'],
    ['you', '[You] can sit here.', 'You stands for the person being spoken to.'],
    ['he', '[He] takes the bus.', 'He stands for a person.'],
    ['she', '[She] works at the hospital.', 'She stands for a person.'],
    ['it', '[It] is raining.', 'It fills the subject position in this weather sentence.'],
    ['we', '[We] study together.', 'We stands for the speaker and other people.'],
    ['they', '[They] are waiting outside.', 'They stands for the people being discussed.'],
    ['me', 'Please help [me].', 'Me stands for the speaker receiving help.'],
    ['him', 'I called [him].', 'Him stands for the person who received the call.'],
    ['her', 'I saw [her] yesterday.', 'Her stands for a person here; it is not describing a following noun.'],
    ['us', 'Come with [us].', 'Us stands for the speaker and others.'],
    ['them', 'Please invite [them].', 'Them stands for the people to invite.'],
    ['this', '[This] is my seat.', 'This stands on its own for a thing; it replaces a noun here.'],
    ['that', '[That] is expensive.', 'That stands for the thing being discussed.'],
    ['mine', 'The red bag is [mine].', 'Mine replaces my bag.'],
    ['hers', 'This coat is [hers].', 'Hers replaces her coat.'],
    ['who', '[Who] called you?', 'Who stands for the unknown person in the question.'],
    ['someone', '[Someone] is at the door.', 'Someone stands for a person whose identity is not given.'],
  ],
  article: [
    ['a-bus', 'I take [a] bus to work.', 'A introduces one bus, without saying which bus.'],
    ['an-apple', 'She ate [an] apple.', 'An introduces one apple before a vowel sound.'],
    ['the-door', 'Please close [the] door.', 'The points to the door we know about.'],
    ['a-job', 'He needs [a] job.', 'A introduces one job, without specifying which one.'],
    ['an-egg', 'I cooked [an] egg.', 'An introduces one egg before a vowel sound.'],
    ['the-teacher', 'Ask [the] teacher.', 'The points to a particular teacher.'],
    ['a-pen', 'May I borrow [a] pen?', 'A introduces one pen; any suitable pen will do.'],
    ['an-orange', 'Would you like [an] orange?', 'An introduces one orange before a vowel sound.'],
    ['the-window', 'Open [the] window, please.', 'The points to a window understood by the speakers.'],
    ['a-friend', 'I met [a] friend today.', 'A introduces one friend.'],
    ['an-office', 'She works in [an] office.', 'An introduces an office before a vowel sound.'],
    ['the-bus', 'We missed [the] bus.', 'The points to the particular bus we wanted.'],
    ['an-hour', 'Wait for [an] hour.', 'An comes before a vowel sound. The h in hour is silent.'],
    ['a-uniform', 'He wears [a] uniform.', 'A comes before the consonant sound at the beginning of uniform.'],
    ['the-first', 'She was [the] first person here.', 'The is an article even when first comes between it and the noun.'],
    ['an-old', 'We live in [an] old house.', 'An is an article before old house. The next sound is a vowel.'],
    ['a-small', 'I have [a] small bag.', 'A introduces the noun phrase small bag.'],
    ['the-only', 'This is [the] only key.', 'The introduces a particular key; only describes it.'],
  ],
  adjective: [
    ['clean', 'The kitchen is [clean].', 'Clean describes the kitchen here; it is not an action.'],
    ['light', 'This bag is [light].', 'Light describes the bag: it is not heavy.'],
    ['open', 'The shop is [open].', 'Open describes the state of the shop.'],
    ['fast', 'It is a [fast] train.', 'Fast describes the noun train.'],
    ['daily', 'This is our [daily] meeting.', 'Daily describes the noun meeting.'],
    ['quiet', 'We need a [quiet] room.', 'Quiet describes the noun room.'],
  ],
  adverb: [
    ['fast', 'The train moves [fast].', 'Fast tells how the train moves. It modifies the verb.'],
    ['daily', 'We meet [daily].', 'Daily tells how often we meet.'],
    ['hard', 'She works [hard].', 'Hard tells how she works.'],
    ['well', 'He sings [well].', 'Well tells how he sings.'],
    ['very', 'The soup is [very] hot.', 'Very modifies the adjective hot.'],
    ['outside', 'Please wait [outside].', 'Outside tells where to wait; no noun follows it here.'],
  ],
  preposition: [
    ['before', 'Come [before] lunch.', 'Before connects the action to the noun lunch.'],
    ['after', 'We walked [after] dinner.', 'After introduces the noun dinner.'],
    ['like', 'It looks [like] a bird.', 'Like introduces a comparison with the noun phrase a bird.'],
    ['outside', 'Wait [outside] the school.', 'Outside introduces the noun phrase the school.'],
    ['under', 'The bag is [under] the chair.', 'Under shows the relationship between the bag and the chair.'],
    ['with', 'Come [with] your friend.', 'With connects the action to your friend.'],
  ],
  conjunction: [
    ['and', 'I bought bread [and] milk.', 'And joins two nouns.'],
    ['but', 'I called, [but] nobody answered.', 'But joins two clauses with contrasting ideas.'],
    ['or', 'Do you want tea [or] coffee?', 'Or joins two alternatives.'],
    ['because', 'We stayed home [because] it rained.', 'Because joins a reason clause to the main clause.'],
    ['before', 'Call [before] you leave.', 'Before introduces the clause you leave, rather than a noun.'],
    ['after', 'We ate [after] she arrived.', 'After introduces the clause she arrived.'],
  ],
};

const words: Record<WordSortTarget, string[]> = {
  verb: ['eat', 'read', 'sleep', 'write', 'listen', 'learn', 'help', 'work', 'walk', 'cook', 'drink', 'play', 'visit', 'arrive', 'go', 'come', 'say', 'make'],
  noun: ['teacher', 'school', 'bus', 'table', 'dinner', 'friend', 'water', 'book', 'doctor', 'kitchen', 'chair', 'window', 'family', 'coffee', 'music', 'hospital', 'child', 'letter'],
  pronoun: ['I', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'mine', 'yours', 'hers', 'ours', 'theirs', 'myself'],
  article: ['a', 'an', 'the'],
};

function contextualCard(pos: PartOfSpeech, [key, marked, explanation]: Example): POSSwipeSortCard {
  const start = marked.indexOf('[');
  const end = marked.indexOf(']');
  const word = marked.slice(start + 1, end);
  return { id: `context:${pos}:${key}`, word, correctBucket: pos,
    sentence: marked.replace('[', '').replace(']', ''), targetSpan: { start, end: end - 1 }, explanation };
}

export const WORD_SORT_CONTEXT_CARDS = Object.entries(examples).flatMap(([pos, entries]) =>
  entries.map(entry => contextualCard(pos as PartOfSpeech, entry)));
// Only everyday noun/verb pairs a beginner will meet both ways. Rare uses
// (to bus, to table, have a go) would teach that almost any word is both.
const nounVerbWords = new Set(['help', 'work', 'walk', 'cook', 'drink', 'play', 'visit', 'water', 'book']);
export const WORD_SORT_WORD_CARDS = Object.entries(words).flatMap(([pos, entries]) =>
  entries.map(word => {
    const note = nounVerbWords.has(word.toLowerCase())
      ? { accepts: ['noun', 'verb'] as PartOfSpeech[], note: `“${word}” can be a noun or a verb. Its role depends on the sentence.` }
      : getWordNote(word);
    return { id: `word:${pos}:${word.toLowerCase()}`, word, correctBucket: pos as PartOfSpeech,
      explanation: note?.note ?? POS_DEFINITIONS[pos as PartOfSpeech],
      ...(note ? { alsoAccepts: note.accepts.filter(accepted => accepted !== pos) } : {}) };
  }));

export function cardsFor(pos: PartOfSpeech, level: WordSortLevel): POSSwipeSortCard[] {
  if (level === 'words') return WORD_SORT_WORD_CARDS.filter(card => card.correctBucket === pos);
  const cards = WORD_SORT_CONTEXT_CARDS.filter(card => card.correctBucket === pos);
  // Challenge favors context-sensitive roles and more demanding noun phrases.
  return level === 'sentences' ? cards.slice(0, 12) : cards.slice(-12);
}

const cardIndex = new Map([...WORD_SORT_WORD_CARDS, ...WORD_SORT_CONTEXT_CARDS].map(card => [card.id, card]));
export function getWordSortCard(id: string): POSSwipeSortCard | undefined { return cardIndex.get(id); }

export function contrastsFor(target: WordSortTarget, level: WordSortLevel): PartOfSpeech[] {
  if (level === 'challenge') {
    return target === 'verb' ? ['noun', 'adjective', 'adverb', 'preposition']
      : target === 'noun' ? ['verb', 'adjective', 'adverb']
      : target === 'pronoun' ? ['noun', 'conjunction', 'adjective']
      : ['pronoun', 'adjective', 'preposition', 'conjunction'];
  }
  return target === 'verb' ? ['noun', 'pronoun'] : target === 'noun' ? ['verb', 'pronoun'] : ['noun', 'verb'];
}
