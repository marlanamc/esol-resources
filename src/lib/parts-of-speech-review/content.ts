export const REVIEW_ACTIVITY_ID = 'parts-of-speech-game';
export const REVIEW_CATEGORIES = ['Noun', 'Verb', 'Adjective', 'Pronoun', 'Article', 'Determiner', 'Subject', 'Object', 'Complement', 'Base form', 'Past form', 'Past participle', 'Helping verb', 'Main verb', 'Linking verb', 'Adverb', 'Preposition', 'Conjunction', 'Gerund', 'Infinitive'] as const;
export type ReviewCategory = typeof REVIEW_CATEGORIES[number];
export type ReviewLessonId = 'sentence-check-in' | 'description-check-in' | 'pattern-check-in' | 'week-4-describing' | 'week-5-subjects' | 'week-6-objects' | 'week-7-adverbs' | 'foundation-check-in' | 'nouns-verbs' | 'adjectives-articles' | 'more-word-jobs' | 'pronouns' | 'determiners' | 'subjects' | 'verb-forms' | 'verb-phrases' | 'objects' | 'complements' | 'adjective-placement' | 'adverbs' | 'adverb-placement' | 'prepositions' | 'preposition-partners' | 'conjunctions' | 'dependent-clauses' | 'gerunds' | 'verb-patterns' | 'complete-patterns' | 'foundation-review' | 'sentence-review' | 'modifier-review' | 'connector-review' | 'final-review';
/** label: choose the highlighted part's job. find: tap the word with this job. choose: fill the blank with the word that fits. */
export type ReviewQuestionKind = 'label' | 'find' | 'choose';
export interface ReviewItem {
  id: string;
  kind?: ReviewQuestionKind;
  /** choose only: the words offered for the blank, including the target. */
  options?: string[];
  before: string;
  target: string;
  after: string;
  answer: ReviewCategory;
  explanation: string;
  review?: boolean;
  categories?: ReviewCategory[];
  prompt?: string;
}
export interface ReviewLesson {
  id: ReviewLessonId;
  title: string;
  categories: ReviewCategory[];
  prompt?: string;
  bridge?: boolean;
  transfer?: { prompt: string; example: string; check: string; parts?: { text: string; category?: ReviewCategory }[] };
  examples: ReviewItem[];
  /** Every scored question in order. For a lesson with rounds, the rounds flattened. */
  questions: ReviewItem[];
  rounds?: ReviewRound[];
}
/** One question type per round: label, then find, then choose. */
export interface ReviewRound {
  kind: ReviewQuestionKind;
  title: string;
  intro: string;
  questions: ReviewItem[];
}
const ROUND_COPY: Record<ReviewQuestionKind, { title: string; intro: string }> = {
  label: { title: 'What’s its job?', intro: 'Look at the highlighted part. Choose its job.' },
  find: { title: 'Find it', intro: 'Read the sentence. Tap the word with that job.' },
  choose: { title: 'Fill the blank', intro: 'Choose the word that fits the sentence.' },
};
function rounds(label: ReviewItem[], find: ReviewItem[], choose: ReviewItem[]): Pick<ReviewLesson, 'rounds' | 'questions'> {
  const all = ([['label', label], ['find', find], ['choose', choose]] as const).map(([kind, questions]) => ({ kind, ...ROUND_COPY[kind], questions }));
  return { rounds: all, questions: all.flatMap(round => round.questions) };
}
function item(id: string, before: string, target: string, after: string, answer: ReviewCategory, explanation: string): ReviewItem {
  return { id, before, target, after, answer, explanation };
}
/** Find questions: the target is one word, and the only word in the sentence with this job. */
function find(id: string, before: string, target: string, after: string, answer: ReviewCategory, explanation: string): ReviewItem {
  return { ...item(id, before, target, after, answer, explanation), kind: 'find' };
}
/** Choose questions: answer is the job the blank needs; options are the words offered. */
function choose(id: string, before: string, target: string, after: string, answer: ReviewCategory, options: string[], explanation: string): ReviewItem {
  return { ...item(id, before, target, after, answer, explanation), kind: 'choose', options };
}
export const REVIEW_LESSONS: Record<ReviewLessonId, ReviewLesson> = {
  "week-4-describing": {
    id: "week-4-describing", title: "Adjectives and articles", categories: ["Adjective", "Article"],
    transfer: {"prompt": "Describe one thing in your home. Use an article and an adjective.", "example": "I have a small table.", "check": "Point to the article, the adjective, and the noun in your sentence.", parts: [{"text": "I have "}, {"text": "a", "category": "Article"}, {"text": " "}, {"text": "small", "category": "Adjective"}, {"text": " "}, {"text": "table", "category": "Noun"}, {"text": "."}] },
    examples: [
      item("week-4-describing-examples-1", "We have a ", "small", " kitchen.", "Adjective", "Small describes the kitchen. An adjective describes a noun."),
      item("week-4-describing-examples-2", "We have ", "a", " small kitchen.", "Article", "A introduces the noun kitchen. The articles are a, an, and the."),
    ],
    ...rounds([
      item("week-4-describing-questions-1", "The soup is ", "hot", ".", "Adjective", "Hot describes the soup. Adjectives can come after is."),
      item("week-4-describing-questions-5", "Please close ", "the", " door.", "Article", "The introduces a particular door."),
      item("week-4-describing-questions-7", "My coat is ", "warm", ".", "Adjective", "Warm describes my coat."),
      item("week-4-describing-questions-8", "I saw ", "an", " old friend.", "Article", "An introduces old friend. We use an before a vowel sound."),
      { ...item("week-4-describing-review-1", "The ", "bus", " arrives at eight.", "Noun", "Bus names a thing."), review: true, categories: ["Noun", "Verb"], prompt: "Remember this: choose the label for the highlighted part." },
      { ...item("week-4-describing-review-2", "We ", "cook", " dinner together.", "Verb", "Cook tells what we do."), review: true, categories: ["Noun", "Verb"], prompt: "Remember this: choose the label for the highlighted part." },
    ], [
      find("week-4-describing-questions-3", "She has ", "an", " appointment.", "Article", "An introduces appointment. We use an before a vowel sound."),
      find("week-4-describing-questions-4", "The ", "new", " student is here.", "Adjective", "New describes the student."),
      find("week-4-describing-questions-9", "I want ", "a", " sandwich.", "Article", "A introduces the noun sandwich."),
      find("week-4-describing-questions-10", "This apple is ", "sweet", ".", "Adjective", "Sweet describes the apple."),
      find("week-4-describing-questions-11", "We had lunch at ", "the", " park.", "Article", "The introduces a particular park."),
      find("week-4-describing-questions-12", "She has ", "long", " hair.", "Adjective", "Long describes her hair."),
    ], [
      choose("week-4-describing-questions-2", "I need ", "a", " pen.", "Article", ["a", "an"], "We say a pen. Use a before a consonant sound."),
      choose("week-4-describing-questions-6", "Our neighbor is ", "friendly", ".", "Adjective", ["friend", "friendly"], "We need an adjective here. Friendly describes our neighbor."),
      choose("week-4-describing-questions-13", "I eat ", "an", " egg every day.", "Article", ["a", "an"], "We say an egg. Use an before a vowel sound."),
      choose("week-4-describing-questions-14", "The street is ", "busy", " today.", "Adjective", ["business", "busy"], "We need an adjective here. Busy describes the street."),
      choose("week-4-describing-questions-15", "Can you open ", "the", " window?", "Article", ["an", "the"], "We say the window. Window starts with a consonant sound, so an does not fit."),
      choose("week-4-describing-questions-16", "We live in a ", "small", " apartment.", "Adjective", ["smile", "small"], "We need an adjective here. Small describes the apartment."),
    ]),
  },
  "week-5-subjects": {
    id: "week-5-subjects", title: "Subjects and verbs", categories: ["Subject", "Verb"],
    prompt: "What is the highlighted part’s job in this sentence?",
    bridge: true,
    transfer: {"prompt": "Say or write one sentence about someone you know.", "example": "My sister works at a clinic.", "check": "Point to the subject and the verb. Who or what is your sentence about?", parts: [{"text": "My sister", "category": "Subject"}, {"text": " "}, {"text": "works", "category": "Verb"}, {"text": " at a clinic."}] },
    examples: [
      item("week-5-subjects-examples-1", "", "The teacher", " helps us.", "Subject", "The teacher is who this sentence is about. Teacher is a noun; The teacher is the subject."),
      item("week-5-subjects-examples-2", "The teacher ", "helps", " us.", "Verb", "Helps tells what the teacher does."),
    ],
    ...rounds([
      item("week-5-subjects-questions-1", "", "My sister", " works at a clinic.", "Subject", "My sister is who works at the clinic."),
      item("week-5-subjects-questions-4", "The soup ", "is", " hot.", "Verb", "Is links the soup to the description hot. A verb does not have to show an action."),
      item("week-5-subjects-questions-5", "", "The bus", " is late.", "Subject", "The bus is what this sentence is about, even without an action."),
      item("week-5-subjects-questions-7", "", "My neighbors", " have a garden.", "Subject", "My neighbors is who has the garden."),
      { ...item("week-5-subjects-review-1", "The ", "new", " student is here.", "Adjective", "New describes the student."), review: true, categories: ["Adjective", "Article"], prompt: "Remember this: choose the label for the highlighted part." },
      { ...item("week-5-subjects-review-2", "I need ", "a", " pen.", "Article", "A introduces the noun pen."), review: true, categories: ["Adjective", "Article"], prompt: "Remember this: choose the label for the highlighted part." },
    ], [
      find("week-5-subjects-questions-2", "The children ", "play", " outside.", "Verb", "Play tells what the children do."),
      find("week-5-subjects-questions-3", "", "We", " need more time.", "Subject", "We is who needs more time. A pronoun can be a subject."),
      find("week-5-subjects-questions-8", "", "Maria", " works at a bank.", "Subject", "Maria is who works at the bank."),
      find("week-5-subjects-questions-9", "My son ", "studies", " English.", "Verb", "Studies tells what my son does."),
      find("week-5-subjects-questions-10", "Every morning, ", "she", " drinks tea.", "Subject", "She is who drinks tea. The subject does not always come first."),
      find("week-5-subjects-questions-11", "The store ", "closes", " at nine.", "Verb", "Closes tells what the store does."),
    ], [
      choose("week-5-subjects-questions-6", "They ", "have", " a car.", "Verb", ["has", "have"], "They goes with have. Have is the verb."),
      choose("week-5-subjects-questions-12", "She ", "works", " at a hotel.", "Verb", ["work", "works"], "She goes with works. Works is the verb."),
      choose("week-5-subjects-questions-13", "", "They", " live near the park.", "Subject", ["Them", "They"], "We need a subject here. They can be a subject; them cannot."),
      choose("week-5-subjects-questions-14", "My brother ", "is", " a cook.", "Verb", ["is", "are"], "My brother is one person, so we use is."),
      choose("week-5-subjects-questions-15", "", "We", " take the bus.", "Subject", ["Us", "We"], "We need a subject here. We can be a subject; us cannot."),
      choose("week-5-subjects-questions-16", "The baby ", "sleeps", " in the afternoon.", "Verb", ["sleep", "sleeps"], "The baby is one person, so we use sleeps."),
    ]),
  },
  "week-6-objects": {
    id: "week-6-objects", title: "Actions and descriptions", categories: ["Object", "Complement"],
    prompt: "What is the highlighted part’s job in this sentence?",
    transfer: {"prompt": "Describe someone, or tell what they do. Choose one sentence pattern.", "example": "My friend is kind. / My friend helps a neighbor.", "check": "Does the part after the verb describe your person, or tell who or what the action affects?", parts: [{"text": "My friend is "}, {"text": "kind", "category": "Complement"}, {"text": ". / My friend helps "}, {"text": "a neighbor", "category": "Object"}, {"text": "."}] },
    examples: [
      item("week-6-objects-examples-1", "She helps ", "a friend", ".", "Object", "A friend is who she helps. This part is the object."),
      item("week-6-objects-examples-2", "She is ", "friendly", ".", "Complement", "Friendly describes her after is. This description completes the sentence; it is a complement."),
    ],
    ...rounds([
      item("week-6-objects-questions-1", "He reads ", "a book", ".", "Object", "A book is what he reads."),
      item("week-6-objects-questions-4", "My brother is ", "a driver", ".", "Complement", "A driver tells who my brother is after is."),
      item("week-6-objects-questions-5", "They carry ", "the bags", ".", "Object", "The bags are what they carry."),
      item("week-6-objects-questions-7", "Our teacher is ", "very patient", ".", "Complement", "Very patient describes our teacher after is."),
      { ...item("week-6-objects-review-1", "", "The teacher", " helps us.", "Subject", "The teacher is the subject: who this sentence is about."), review: true, categories: ["Subject", "Verb"], prompt: "Remember this: choose the label for the highlighted part." },
      { ...item("week-6-objects-review-2", "The teacher ", "helps", " us.", "Verb", "Helps tells what the teacher does."), review: true, categories: ["Subject", "Verb"], prompt: "Remember this: choose the label for the highlighted part." },
    ], [
      find("week-6-objects-questions-2", "The room is ", "quiet", ".", "Complement", "Quiet describes the room after is."),
      find("week-6-objects-questions-3", "We need ", "help", ".", "Object", "Help is what we need."),
      find("week-6-objects-questions-8", "I want ", "water", ".", "Object", "Water is what I want."),
      find("week-6-objects-questions-9", "My mother is ", "tired", ".", "Complement", "Tired describes my mother after is."),
      find("week-6-objects-questions-10", "He fixes ", "cars", ".", "Object", "Cars are what he fixes."),
      find("week-6-objects-questions-11", "The store is ", "open", ".", "Complement", "Open describes the store after is."),
    ], [
      choose("week-6-objects-questions-6", "The children are ", "happy", ".", "Complement", ["happily", "happy"], "After are, we need a complement that describes the children: happy."),
      choose("week-6-objects-questions-12", "Please call ", "me", " later.", "Object", ["I", "me"], "Me is the object: who you call. After a verb, use me, not I."),
      choose("week-6-objects-questions-13", "He is ", "tired", " today.", "Complement", ["tire", "tired"], "After is, we need a word that describes him: tired."),
      choose("week-6-objects-questions-14", "My friend helps ", "them", " every week.", "Object", ["them", "they"], "Them is the object: who my friend helps. After a verb, use them, not they."),
      choose("week-6-objects-questions-15", "The test was ", "easy", ".", "Complement", ["easily", "easy"], "After was, we need a word that describes the test: easy."),
      choose("week-6-objects-questions-16", "I visit ", "her", " on Sundays.", "Object", ["her", "she"], "Her is the object: who I visit. After a verb, use her, not she."),
    ]),
  },
  "week-7-adverbs": {
    id: "week-7-adverbs", title: "Adverbs: how and how often", categories: ["Adjective", "Adverb"],
    transfer: {"prompt": "Say or write a sentence about how you do something, or how often you do it.", "example": "I usually cook at home.", "check": "Point to your adverb. Does it tell how, or how often?", parts: [{"text": "I "}, {"text": "usually", "category": "Adverb"}, {"text": " "}, {"text": "cook", "category": "Verb"}, {"text": " at home."}] },
    examples: [
      item("week-7-adverbs-examples-1", "She drives ", "carefully", ".", "Adverb", "Carefully tells how she drives. An adverb can add information about a verb."),
      item("week-7-adverbs-examples-2", "She ", "often", " drives to work.", "Adverb", "Often tells how frequently she drives. Adverbs can tell how often."),
    ],
    ...rounds([
      item("week-7-adverbs-questions-4", "The children are ", "happy", ".", "Adjective", "Happy describes the children."),
      item("week-7-adverbs-questions-5", "She is ", "always", " early.", "Adverb", "Always tells how consistently she is early. It comes after is here."),
      item("week-7-adverbs-questions-7", "She sings ", "beautifully", ".", "Adverb", "Beautifully tells how she sings."),
      item("week-7-adverbs-questions-8", "We had a ", "quiet", " evening.", "Adjective", "Quiet describes the noun evening."),
      { ...item("week-7-adverbs-review-1", "She helps ", "a friend", ".", "Object", "A friend is who she helps: the object."), review: true, categories: ["Object", "Complement"], prompt: "Remember this: choose the label for the highlighted part." },
      { ...item("week-7-adverbs-review-2", "She is ", "friendly", ".", "Complement", "Friendly describes her after is: a complement."), review: true, categories: ["Object", "Complement"], prompt: "Remember this: choose the label for the highlighted part." },
    ], [
      find("week-7-adverbs-questions-3", "We ", "usually", " cook at home.", "Adverb", "Usually tells how often we cook."),
      find("week-7-adverbs-questions-6", "He walks ", "quickly", ".", "Adverb", "Quickly tells how he walks."),
      find("week-7-adverbs-questions-9", "I ", "sometimes", " eat breakfast.", "Adverb", "Sometimes tells how often I eat breakfast."),
      find("week-7-adverbs-questions-10", "This is a ", "difficult", " question.", "Adjective", "Difficult describes the noun question."),
      find("week-7-adverbs-questions-11", "My son ", "never", " eats vegetables.", "Adverb", "Never tells how often my son eats vegetables."),
      find("week-7-adverbs-questions-12", "I have a ", "new", " phone.", "Adjective", "New describes the noun phone."),
    ], [
      choose("week-7-adverbs-questions-1", "He speaks ", "slowly", ".", "Adverb", ["slow", "slowly"], "Slowly tells how he speaks. An adverb describes an action verb."),
      choose("week-7-adverbs-questions-2", "He is a ", "careful", " driver.", "Adjective", ["careful", "carefully"], "Careful describes the noun driver, so we need an adjective."),
      choose("week-7-adverbs-questions-13", "Please talk ", "quietly", " at night.", "Adverb", ["quiet", "quietly"], "Quietly tells how to talk, so we need an adverb."),
      choose("week-7-adverbs-questions-14", "She is a ", "good", " cook.", "Adjective", ["good", "well"], "Good describes the noun cook, so we need an adjective."),
      choose("week-7-adverbs-questions-15", "He works ", "well", " with others.", "Adverb", ["good", "well"], "Well tells how he works, so we need an adverb."),
      choose("week-7-adverbs-questions-16", "The weather is ", "beautiful", " today.", "Adjective", ["beautiful", "beautifully"], "After is, beautiful describes the weather, so we need an adjective."),
    ]),
  },
  'foundation-check-in': {
    id: 'foundation-check-in', title: 'Quick foundation check-in', categories: ['Pronoun', 'Article'],
    examples: [
      item('fc-example-1', '', 'She', ' is my neighbor.', 'Pronoun', 'She stands in for a person’s name.'),
      item('fc-example-2', 'She has ', 'a', ' car.', 'Article', 'A introduces the noun car. A, an, and the are articles.'),
    ],
    questions: [
      item('fc-1', '', 'They', ' live nearby.', 'Pronoun', 'They stands in for the people we mean.'),
      choose("fc-2", "I need ", "an", " umbrella.", "Article", ["a", "an"], "We say an umbrella. Use an before a vowel sound."),
      find("fc-3", "", "He", " works here.", "Pronoun", "He stands in for a person’s name."),
      item('fc-4', 'Please close ', 'the', ' door.', 'Article', 'The introduces a particular door.'),
      { ...item('fc-5', 'The ', 'bus', ' is here.', 'Noun', 'Bus names a thing.'), review: true, categories: ['Noun', 'Verb'] },
      { ...item('fc-6', 'We ', 'cook', ' dinner.', 'Verb', 'Cook tells what we do.'), review: true, categories: ['Noun', 'Verb'] },
    ],
    transfer: { prompt: 'Say or write one sentence with a pronoun and an article.', example: 'She has a bike.', check: 'Point to the pronoun and the article.', parts: [{"text": "She", "category": "Pronoun"}, {"text": " has "}, {"text": "a", "category": "Article"}, {"text": " bike."}] },
  },
  "sentence-check-in": {
    id: "sentence-check-in", title: "Sentence check-in", categories: ["Subject", "Verb", "Object", "Complement"],
    prompt: "Choose the label for the highlighted part.",
    examples: [
      item("sentence-check-in-examples-0", "", "The teacher", " helps us.", "Subject", "The teacher is who this sentence is about."),
      item("sentence-check-in-examples-1", "The teacher ", "helps", " us.", "Verb", "Helps tells what the teacher does."),
    ],
    questions: [
      item("sentence-check-in-questions-0", "", "My sister", " works nearby.", "Subject", "My sister is who works nearby."),
      find("sentence-check-in-questions-1", "We ", "need", " help.", "Verb", "Need is the verb. It tells what we require."),
      item("sentence-check-in-questions-2", "She reads ", "a book", ".", "Object", "A book is what she reads."),
      find("sentence-check-in-questions-3", "The soup is ", "hot", ".", "Complement", "Hot describes the soup after is."),
      item("sentence-check-in-questions-4", "He helps ", "a neighbor", ".", "Object", "A neighbor is who he helps."),
      item("sentence-check-in-questions-5", "My sister is ", "a nurse", ".", "Complement", "A nurse tells who my sister is after is."),
    ],
  },
  "description-check-in": {
    id: "description-check-in", title: "Describing words check-in", categories: ["Adjective", "Article", "Adverb"],
    prompt: "Choose the label for the highlighted part.",
    examples: [
      item("description-check-in-examples-0", "The ", "quiet", " room is upstairs.", "Adjective", "Quiet describes the room."),
      item("description-check-in-examples-1", "She speaks ", "quietly", ".", "Adverb", "Quietly tells how she speaks."),
    ],
    questions: [
      choose("description-check-in-questions-0", "I have ", "a", " bag.", "Article", ["a", "an"], "We say a bag. Use a before a consonant sound."),
      item("description-check-in-questions-1", "The bag is ", "heavy", ".", "Adjective", "Heavy describes the bag after is."),
      item("description-check-in-questions-2", "We ", "often", " walk home.", "Adverb", "Often tells how often we walk."),
      item("description-check-in-questions-3", "She has ", "an", " umbrella.", "Article", "An introduces umbrella."),
      find("description-check-in-questions-4", "He has a ", "blue", " coat.", "Adjective", "Blue describes the coat."),
      choose("description-check-in-questions-5", "They work ", "carefully", ".", "Adverb", ["careful", "carefully"], "Carefully tells how they work. An adverb describes an action verb."),
    ],
  },
  "pattern-check-in": {
    id: "pattern-check-in", title: "Sentence patterns check-in", categories: ["Gerund", "Infinitive"],
    prompt: "Choose the label for the highlighted part.",
    examples: [
      item("pattern-check-in-examples-0", "I enjoy ", "reading", ".", "Gerund", "The useful partnership is enjoy reading."),
      item("pattern-check-in-examples-1", "I want ", "to read", ".", "Infinitive", "The useful partnership is want to read. Enjoy and want are both verbs, but use different patterns."),
    ],
    questions: [
      choose("pattern-check-in-questions-0", "We decided ", "to walk", ".", "Infinitive", ["to walk", "walking"], "Decide goes with to + verb: decided to walk."),
      item("pattern-check-in-questions-1", "He finished ", "cleaning", ".", "Gerund", "The pattern is finish doing something."),
      choose("pattern-check-in-questions-2", "She hopes ", "to visit", ".", "Infinitive", ["to visit", "visiting"], "Hope goes with to + verb: hopes to visit."),
      choose("pattern-check-in-questions-3", "I enjoy ", "cooking", ".", "Gerund", ["cooking", "to cook"], "Enjoy goes with -ing: enjoy cooking."),
      item("pattern-check-in-questions-4", "They need ", "to study", ".", "Infinitive", "The pattern is need to do something."),
      item("pattern-check-in-questions-5", "Please keep ", "trying", ".", "Gerund", "The pattern is keep doing something."),
    ],
  },
  'nouns-verbs': {
    id: 'nouns-verbs', title: 'Nouns and verbs', categories: ['Noun', 'Verb'],
    transfer: { prompt: 'Say or write one sentence about your day.', example: 'My children walk to school.', check: 'Point to a noun and the verb in your sentence.', parts: [{"text": "My "}, {"text": "children", "category": "Noun"}, {"text": " "}, {"text": "walk", "category": "Verb"}, {"text": " to school."}] },
    examples: [
      item('nv-example-noun', 'The ', 'teacher', ' helps us.', 'Noun', 'Teacher names a person. A noun names a person, place, thing, or idea.'),
      item('nv-example-verb', 'The teacher ', 'helps', ' us.', 'Verb', 'Helps tells what the teacher does. A verb can show an action or a state, as in “She is ready.”'),
    ],
    ...rounds([
      item('nv-1', 'The ', 'bus', ' arrives at eight.', 'Noun', 'Bus names a thing.'),
      item('nv-3', 'My sister ', 'is', ' a nurse.', 'Verb', 'Is links my sister to who she is. Is is a verb, even though it does not show an action.'),
      item('nv-7', 'We ', 'need', ' more time.', 'Verb', 'Need tells what we require. It is a verb, even though you cannot see an action.'),
      item('nv-9', 'My ', 'neighbor', ' works at night.', 'Noun', 'Neighbor names a person.'),
      item('nv-10', 'The store ', 'opens', ' at nine.', 'Verb', 'Opens tells what the store does.'),
      item('nv-11', 'We buy ', 'rice', ' every week.', 'Noun', 'Rice names a thing.'),
    ], [
      find('nv-2', 'We ', 'cook', ' dinner together.', 'Verb', 'Cook tells what we do.'),
      find('nv-5', 'I ', 'have', ' two children.', 'Verb', 'Have expresses a relationship or possession. It is a verb.'),
      find('nv-8', 'Good ', 'health', ' is important.', 'Noun', 'Health names an idea or condition. Nouns do not always name things you can touch.'),
      find('nv-12', 'I like ', 'music', '.', 'Noun', 'Music names a thing you enjoy.'),
      find('nv-13', 'They ', 'live', ' here.', 'Verb', 'Live tells what they do.'),
      find('nv-14', 'It is my ', 'birthday', '.', 'Noun', 'Birthday names a special day.'),
    ], [
      choose('nv-4', 'The children ', 'walk', ' to school.', 'Verb', ['school', 'walk'], 'We need a verb here. Walk tells what the children do.'),
      choose('nv-6', 'The ', 'doctor', ' listens carefully.', 'Noun', ['listen', 'doctor'], 'We need a noun here. Who listens? The doctor. Doctor names a person.'),
      choose('nv-15', 'My son ', 'plays', ' soccer.', 'Verb', ['plays', 'player'], 'We need a verb here. Plays tells what my son does.'),
      choose('nv-16', 'I drink ', 'coffee', ' in the morning.', 'Noun', ['cook', 'coffee'], 'We need a noun here. Coffee names what I drink.'),
      choose('nv-17', 'The ', 'baby', ' sleeps a lot.', 'Noun', ['baby', 'sleep'], 'We need a noun here. Who sleeps? The baby. Baby names a person.'),
      choose('nv-18', 'We ', 'work', ' on Saturday.', 'Verb', ['job', 'work'], 'We need a verb here. Work tells what we do.'),
    ]),
  },
  'adjectives-articles': {
    id: 'adjectives-articles', title: 'Adjectives and articles', categories: ['Adjective', 'Article'],
    examples: [
      item('aa-example-adj', 'We have a ', 'small', ' kitchen.', 'Adjective', 'Small describes the kitchen. An adjective describes a noun.'),
      item('aa-example-art', 'We have ', 'a', ' small kitchen.', 'Article', 'A introduces the noun kitchen. The articles are a, an, and the. An adjective can come between an article and its noun.'),
    ],
    questions: [
      item('aa-1', 'The soup is ', 'hot', '.', 'Adjective', 'Hot describes the soup. An adjective can come after is.'),
      item('aa-2', 'I need ', 'a', ' pen.', 'Article', 'A introduces the noun pen.'),
      item('aa-3', 'She has ', 'an', ' appointment.', 'Article', 'An introduces the noun appointment. We use an before a vowel sound.'),
      item('aa-4', 'The ', 'new', ' student is here.', 'Adjective', 'New describes the student.'),
      item('aa-5', 'Please close ', 'the', ' door.', 'Article', 'The introduces a particular door.'),
      item('aa-6', 'Our neighbor is ', 'friendly', '.', 'Adjective', 'Friendly describes our neighbor.'),
      item('aa-7', 'He carries a ', 'heavy', ' bag.', 'Adjective', 'Heavy describes the bag.'),
      item('aa-8', 'We saw ', 'an', ' old house.', 'Article', 'An introduces the noun house. Old describes the house and begins with a vowel sound.'),
    ],
  },
  "pronouns": {
    id: "pronouns", title: "Pronouns", categories: ["Noun", "Pronoun"],
    examples: [
      item("pronouns-examples-1", "", "Maria", " is my neighbor.", "Noun", "Maria names a person."),
      item("pronouns-examples-2", "", "She", " is my neighbor.", "Pronoun", "She stands in for Maria."),
    ],
    questions: [
      find("pronouns-questions-1", "", "They", " work together.", "Pronoun", "They stands in for the people we mean."),
      find("pronouns-questions-2", "The ", "teacher", " helps us.", "Noun", "Teacher names a person."),
      item("pronouns-questions-3", "The teacher helps ", "us", ".", "Pronoun", "Us stands in for the speaker and other people."),
      choose("pronouns-questions-4", "Please call ", "him", ".", "Pronoun", ["he", "him"], "After a verb, use him, not he. Him is a pronoun."),
      item("pronouns-questions-5", "The ", "bus", " is late.", "Noun", "Bus names a thing."),
      item("pronouns-questions-6", "", "It", " is late.", "Pronoun", "It stands in for the bus."),
    ],
  },
  "determiners": {
    id: "determiners", title: "Articles and other determiners", categories: ["Article", "Determiner"],
    prompt: "Is the highlighted determiner an article or another determiner?",
    examples: [
      item("determiners-examples-1", "I need ", "a", " bag.", "Article", "A is an article. Articles are one kind of determiner."),
      item("determiners-examples-2", "I need ", "this", " bag.", "Determiner", "This points to a particular bag. It is a determiner, but not an article."),
    ],
    questions: [
      item("determiners-questions-1", "", "The", " bus is here.", "Article", "The is one of the three articles: a, an, and the."),
      find("determiners-questions-2", "", "My", " bus is late.", "Determiner", "My shows whose bus we mean. Before a noun, my is a possessive determiner."),
      choose("determiners-questions-3", "We have ", "some", " rice.", "Determiner", ["a", "some"], "Rice is uncountable, so we say some rice, not a rice."),
      item("determiners-questions-4", "She has ", "an", " umbrella.", "Article", "An is an article."),
      choose("determiners-questions-5", "", "Those", " shoes are wet.", "Determiner", ["That", "Those"], "Shoes is plural, so we use those."),
      item("determiners-questions-6", "Do you have ", "any", " questions?", "Determiner", "Any gives information about quantity in this question."),
    ],
  },
  "subjects": {
    id: "subjects", title: "Finding the subject", categories: ["Subject", "Verb"],
    prompt: "What is the highlighted part’s job in this sentence?",
    examples: [
      item("subjects-examples-1", "", "The nurse", " works here.", "Subject", "The nurse is who the sentence is about."),
      item("subjects-examples-2", "The nurse ", "works", " here.", "Verb", "Works tells what the nurse does."),
    ],
    questions: [
      item("subjects-questions-1", "", "We", " need help.", "Subject", "We is who needs help."),
      find("subjects-questions-2", "My brother ", "cooks", " dinner.", "Verb", "Cooks tells what my brother does."),
      item("subjects-questions-3", "", "Ana and Luis", " live nearby.", "Subject", "Ana and Luis together form the subject."),
      item("subjects-questions-4", "", "Swimming", " is fun.", "Subject", "Swimming is the activity the sentence is about."),
      choose("subjects-questions-5", "The bus ", "arrives", " at eight.", "Verb", ["arrive", "arrives"], "The bus is one thing, so the verb is arrives."),
      find("subjects-questions-6", "", "It", " is raining.", "Subject", "It fills the subject position in this weather sentence."),
    ],
  },
  "verb-forms": {
    id: "verb-forms", title: "Base, past, and participle forms", categories: ["Base form", "Past form", "Past participle"],
    prompt: "Which verb form is highlighted?",
    examples: [
      item("verb-forms-examples-1", "I ", "go", " to class every day.", "Base form", "Go is the base form: V1."),
      item("verb-forms-examples-2", "Yesterday I ", "went", " to class.", "Past form", "Went is the past form of go: V2."),
    ],
    questions: [
      choose("verb-forms-questions-1", "I have ", "gone", " home.", "Past participle", ["gone", "went"], "After have, use the past participle: have gone."),
      item("verb-forms-questions-2", "We ", "eat", " lunch at noon.", "Base form", "Eat is the base form: V1."),
      choose("verb-forms-questions-3", "Yesterday we ", "ate", " early.", "Past form", ["ate", "eaten"], "Yesterday is finished time, so use the past form: ate."),
      item("verb-forms-questions-4", "We have ", "eaten", " lunch.", "Past participle", "Eaten is the past participle: V3."),
      item("verb-forms-questions-5", "She ", "wrote", " a letter yesterday.", "Past form", "Wrote is the past form of write: V2."),
      choose("verb-forms-questions-6", "I can ", "write", " my name.", "Base form", ["write", "wrote"], "After can, use the base form: can write."),
    ],
  },
  "verb-phrases": {
    id: "verb-phrases", title: "Helping and linking verbs", categories: ["Helping verb", "Main verb", "Linking verb"],
    prompt: "What job does the highlighted verb do here?",
    examples: [
      item("verb-phrases-examples-1", "She ", "is", " cooking.", "Helping verb", "Is helps cooking show an action happening now."),
      item("verb-phrases-examples-2", "She ", "is", " tired.", "Linking verb", "Is links she to the description tired."),
    ],
    questions: [
      find("verb-phrases-questions-1", "We ", "can", " swim.", "Helping verb", "Can helps the main verb swim express ability."),
      item("verb-phrases-questions-2", "We can ", "swim", ".", "Main verb", "Swim names the main action."),
      item("verb-phrases-questions-3", "They ", "have", " finished.", "Helping verb", "Have helps finished form the present perfect."),
      find("verb-phrases-questions-4", "He ", "became", " a teacher.", "Linking verb", "Became links he to a teacher."),
      find("verb-phrases-questions-5", "She has been ", "working", ".", "Main verb", "Working gives the main action in has been working."),
      item("verb-phrases-questions-6", "I ", "have", " two children.", "Main verb", "Have is the main verb here. It is not helping another verb."),
    ],
  },
  "objects": {
    id: "objects", title: "Subjects and objects", categories: ["Subject", "Object"],
    prompt: "Is the highlighted part a subject or an object?",
    examples: [
      item("objects-examples-1", "", "The student", " reads a book.", "Subject", "The student does the reading."),
      item("objects-examples-2", "The student reads ", "a book", ".", "Object", "A book is what the student reads."),
    ],
    questions: [
      find("objects-questions-1", "", "We", " help our neighbors.", "Subject", "We do the helping."),
      choose("objects-questions-2", "Our neighbors help ", "us", ".", "Object", ["us", "we"], "After the verb help, use us, not we. Us is the object."),
      item("objects-questions-3", "She gave ", "him", " a key.", "Object", "Him is the indirect object: the person receiving the key."),
      item("objects-questions-4", "She gave him ", "a key", ".", "Object", "A key is the direct object: the thing given."),
      item("objects-questions-5", "", "Cooking", " takes time.", "Subject", "Cooking is the activity the sentence is about."),
      find("objects-questions-6", "I enjoy ", "cooking", ".", "Object", "Cooking is what I enjoy, so it is the object."),
    ],
  },
  "complements": {
    id: "complements", title: "Objects and complements", categories: ["Object", "Complement"],
    prompt: "Is the highlighted part an object or a complement?",
    examples: [
      item("complements-examples-1", "She bought ", "a coat", ".", "Object", "A coat is what she bought."),
      item("complements-examples-2", "She is ", "a nurse", ".", "Complement", "A nurse identifies she and completes the linking verb is."),
    ],
    questions: [
      find("complements-questions-1", "The soup is ", "hot", ".", "Complement", "Hot describes the soup after the linking verb is."),
      item("complements-questions-2", "He opened ", "the door", ".", "Object", "The door is what he opened."),
      find("complements-questions-3", "They became ", "friends", ".", "Complement", "Friends identifies what they became."),
      item("complements-questions-4", "We painted the wall ", "blue", ".", "Complement", "Blue describes the wall after painting: an object complement."),
      item("complements-questions-5", "I need ", "a pen", ".", "Object", "A pen is what I need."),
      item("complements-questions-6", "The keys are ", "on the table", ".", "Complement", "On the table completes this sentence by telling where the keys are."),
    ],
  },
  "adjective-placement": {
    id: "adjective-placement", title: "Adjectives in sentences", categories: ["Adjective", "Noun"],
    examples: [
      item("adjective-placement-examples-1", "We have a ", "quiet", " room.", "Adjective", "Quiet describes room and comes before the noun."),
      item("adjective-placement-examples-2", "The room is ", "quiet", ".", "Adjective", "Quiet still describes room, now after is."),
    ],
    questions: [
      find("adjective-placement-questions-1", "She has a ", "blue", " bag.", "Adjective", "Blue describes the bag."),
      find("adjective-placement-questions-2", "Her ", "bag", " is blue.", "Noun", "Bag names a thing."),
      choose("adjective-placement-questions-3", "This room is ", "larger", " than ours.", "Adjective", ["large", "larger"], "With than, use the comparative: larger than."),
      item("adjective-placement-questions-4", "We saw a beautiful old ", "house", ".", "Noun", "House is the noun described by beautiful and old."),
      item("adjective-placement-questions-5", "He is ", "bilingual", ".", "Adjective", "Bilingual describes him."),
      item("adjective-placement-questions-6", "I have an ", "old", " phone.", "Adjective", "Old describes phone, between the article and noun."),
    ],
  },
  "adverbs": {
    id: "adverbs", title: "Adjectives and adverbs", categories: ["Adjective", "Adverb"],
    examples: [
      item("adverbs-examples-1", "She is a ", "careful", " driver.", "Adjective", "Careful describes the noun driver."),
      item("adverbs-examples-2", "She drives ", "carefully", ".", "Adverb", "Carefully tells how she drives."),
    ],
    questions: [
      find("adverbs-questions-1", "He speaks ", "slowly", ".", "Adverb", "Slowly tells how he speaks."),
      item("adverbs-questions-2", "Our neighbor is ", "friendly", ".", "Adjective", "Friendly describes our neighbor. An -ly ending does not always mean adverb."),
      item("adverbs-questions-3", "The train moves ", "fast", ".", "Adverb", "Fast tells how the train moves."),
      item("adverbs-questions-4", "This is a ", "fast", " train.", "Adjective", "Fast describes the noun train."),
      find("adverbs-questions-5", "I am ", "very", " tired.", "Adverb", "Very adds information about the adjective tired."),
      choose("adverbs-questions-6", "The children are ", "happy", ".", "Adjective", ["happily", "happy"], "After are, use an adjective to describe the children: happy."),
    ],
  },
  "adverb-placement": {
    id: "adverb-placement", title: "Adverbs of time and frequency", categories: ["Adverb", "Verb"],
    examples: [
      item("adverb-placement-examples-1", "We ", "often", " walk to school.", "Adverb", "Often tells how frequently we walk."),
      item("adverb-placement-examples-2", "We often ", "walk", " to school.", "Verb", "Walk names the action."),
    ],
    questions: [
      item("adverb-placement-questions-1", "She is ", "always", " kind.", "Adverb", "Always tells how consistently she is kind. It comes after is here."),
      find("adverb-placement-questions-2", "I ", "usually", " cook at home.", "Adverb", "Usually tells how often I cook."),
      choose("adverb-placement-questions-3", "We arrived ", "yesterday", ".", "Adverb", ["tomorrow", "yesterday"], "Arrived is past, so we say yesterday. Yesterday is an adverb of time."),
      find("adverb-placement-questions-4", "They ", "arrived", " early.", "Verb", "Arrived tells the action."),
      item("adverb-placement-questions-5", "", "Tomorrow", ", we will study.", "Adverb", "Tomorrow tells when. It can come at the start of a sentence."),
      item("adverb-placement-questions-6", "He has ", "never", " visited Boston.", "Adverb", "Never tells how often. Here it comes between the helping verb and main verb."),
    ],
  },
  "prepositions": {
    id: "prepositions", title: "Prepositions", categories: ["Preposition", "Noun"],
    examples: [
      item("prepositions-examples-1", "The keys are ", "on", " the table.", "Preposition", "On shows the relationship between the keys and the table."),
      item("prepositions-examples-2", "The keys are on the ", "table", ".", "Noun", "Table names a thing."),
    ],
    questions: [
      choose("prepositions-questions-1", "We meet ", "at", " noon.", "Preposition", ["at", "on"], "Use at with clock times: at noon."),
      find("prepositions-questions-2", "She works in a ", "hospital", ".", "Noun", "Hospital names a place."),
      find("prepositions-questions-3", "The bag is ", "under", " the chair.", "Preposition", "Under shows where the bag is."),
      choose("prepositions-questions-4", "We travel ", "by", " bus.", "Preposition", ["at", "by"], "We travel by bus, by car, or by train."),
      item("prepositions-questions-5", "He walked to ", "school", ".", "Noun", "School names a place."),
      item("prepositions-questions-6", "I study ", "with", " my sister.", "Preposition", "With shows who studies together."),
    ],
  },
  "preposition-partners": {
    id: "preposition-partners", title: "Words that go with prepositions", categories: ["Preposition", "Adjective", "Verb"],
    examples: [
      item("preposition-partners-examples-1", "I am interested ", "in", " music.", "Preposition", "Interested in is a useful word partnership. Learn the two words together."),
      item("preposition-partners-examples-2", "We ", "wait", " for the bus.", "Verb", "Wait is the action. Wait for is a useful word partnership."),
    ],
    questions: [
      choose("preposition-partners-questions-1", "Please listen ", "to", " the teacher.", "Preposition", ["at", "to"], "We say listen to someone."),
      find("preposition-partners-questions-2", "She is ", "good", " at math.", "Adjective", "Good describes her ability. The partnership is good at."),
      choose("preposition-partners-questions-3", "We depend ", "on", " the bus.", "Preposition", ["in", "on"], "We say depend on something."),
      item("preposition-partners-questions-4", "I ", "look", " for my keys.", "Verb", "Look is the verb. Look for means try to find."),
      find("preposition-partners-questions-5", "He is afraid ", "of", " dogs.", "Preposition", "The partnership is afraid of."),
      item("preposition-partners-questions-6", "We are ", "proud", " of our class.", "Adjective", "Proud describes how we feel. The partnership is proud of."),
    ],
  },
  "conjunctions": {
    id: "conjunctions", title: "Joining ideas", categories: ["Conjunction", "Preposition"],
    examples: [
      item("conjunctions-examples-1", "I like tea ", "and", " coffee.", "Conjunction", "And joins tea and coffee."),
      item("conjunctions-examples-2", "I drink tea ", "with", " milk.", "Preposition", "With introduces what goes with the tea."),
    ],
    questions: [
      item("conjunctions-questions-1", "I am tired, ", "but", " I will finish.", "Conjunction", "But joins two contrasting ideas."),
      find("conjunctions-questions-2", "We can walk ", "or", " take the bus.", "Conjunction", "Or joins two choices."),
      item("conjunctions-questions-3", "The bus stops ", "near", " school.", "Preposition", "Near shows a place relationship."),
      choose("conjunctions-questions-4", "It rained, ", "so", " we stayed home.", "Conjunction", ["but", "so"], "The rain is the reason we stayed home. So shows a result."),
      item("conjunctions-questions-5", "She works ", "at", " a clinic.", "Preposition", "At introduces a place."),
      find("conjunctions-questions-6", "Ana ", "and", " Luis study together.", "Conjunction", "And joins two names."),
    ],
  },
  "dependent-clauses": {
    id: "dependent-clauses", title: "Because, when, and if", categories: ["Conjunction", "Preposition"],
    examples: [
      item("dependent-clauses-examples-1", "We stayed home ", "because", " it rained.", "Conjunction", "Because introduces a clause that gives a reason."),
      item("dependent-clauses-examples-2", "We stayed home ", "during", " the storm.", "Preposition", "During introduces a noun phrase, the storm."),
    ],
    questions: [
      find("dependent-clauses-questions-1", "Call me ", "when", " you arrive.", "Conjunction", "When introduces a clause about time."),
      find("dependent-clauses-questions-2", "I will help ", "if", " I can.", "Conjunction", "If introduces a condition."),
      item("dependent-clauses-questions-3", "We walked ", "through", " the park.", "Preposition", "Through introduces the noun phrase the park."),
      choose("dependent-clauses-questions-4", "", "Although", " she was tired, she studied.", "Conjunction", ["Although", "Because"], "Being tired and studying are a contrast. Although shows a contrast."),
      item("dependent-clauses-questions-5", "We ate ", "after", " class.", "Preposition", "After introduces the noun class here."),
      item("dependent-clauses-questions-6", "We ate ", "after", " class ended.", "Conjunction", "After introduces a clause with a subject and verb here: class ended."),
    ],
  },
  "gerunds": {
    id: "gerunds", title: "When an -ing form names an activity", categories: ["Gerund", "Verb"],
    prompt: "How is the highlighted -ing form used here?",
    examples: [
      item("gerunds-examples-1", "", "Swimming", " is fun.", "Gerund", "Swimming names an activity and works as the subject. This use is called a gerund."),
      item("gerunds-examples-2", "She is ", "swimming", ".", "Verb", "Swimming is part of the verb phrase is swimming."),
    ],
    questions: [
      choose("gerunds-questions-1", "I enjoy ", "cooking", ".", "Gerund", ["cooking", "to cook"], "Enjoy goes with -ing: enjoy cooking."),
      item("gerunds-questions-2", "He is ", "cooking", " dinner.", "Verb", "Cooking is part of the verb phrase is cooking."),
      find("gerunds-questions-3", "", "Reading", " helps me learn.", "Gerund", "Reading names an activity and works as the subject."),
      item("gerunds-questions-4", "We are ", "reading", " together.", "Verb", "Reading is part of the verb phrase are reading."),
      choose("gerunds-questions-5", "She is good at ", "drawing", ".", "Gerund", ["draw", "drawing"], "After a preposition like at, use -ing: good at drawing."),
      item("gerunds-questions-6", "They were ", "drawing", " a map.", "Verb", "Drawing is part of the verb phrase were drawing."),
    ],
  },
  "verb-patterns": {
    id: "verb-patterns", title: "What comes after a verb?", categories: ["Gerund", "Infinitive"],
    prompt: "Which verb pattern is highlighted?",
    examples: [
      item("verb-patterns-examples-1", "I enjoy ", "reading", ".", "Gerund", "Enjoy is followed by an -ing form: enjoy reading."),
      item("verb-patterns-examples-2", "I want ", "to read", ".", "Infinitive", "Want is followed by to plus the base verb: want to read."),
    ],
    questions: [
      item("verb-patterns-questions-1", "We decided ", "to walk", ".", "Infinitive", "The pattern is decide to do something."),
      choose("verb-patterns-questions-2", "She avoids ", "driving", " at night.", "Gerund", ["driving", "to drive"], "Avoid goes with -ing: avoids driving."),
      choose("verb-patterns-questions-3", "They hope ", "to visit", " soon.", "Infinitive", ["to visit", "visiting"], "Hope goes with to + verb: hope to visit."),
      choose("verb-patterns-questions-4", "He finished ", "cleaning", ".", "Gerund", ["cleaning", "to clean"], "Finish goes with -ing: finished cleaning."),
      item("verb-patterns-questions-5", "I need ", "to study", ".", "Infinitive", "The pattern is need to do something."),
      item("verb-patterns-questions-6", "Please keep ", "trying", ".", "Gerund", "The pattern is keep doing something."),
    ],
  },
  "complete-patterns": {
    id: "complete-patterns", title: "Completing a sentence", categories: ["Object", "Complement"],
    prompt: "How does the highlighted part complete the sentence?",
    examples: [
      item("complete-patterns-examples-1", "I need ", "help", ".", "Object", "Help is what I need. The pattern is subject + verb + object."),
      item("complete-patterns-examples-2", "I feel ", "ready", ".", "Complement", "Ready describes me. The pattern is subject + linking verb + complement."),
    ],
    questions: [
      item("complete-patterns-questions-1", "She reads ", "a book", ".", "Object", "A book is what she reads."),
      item("complete-patterns-questions-2", "He became ", "a doctor", ".", "Complement", "A doctor tells who he became."),
      find("complete-patterns-questions-3", "We enjoy ", "music", ".", "Object", "Music is what we enjoy."),
      choose("complete-patterns-questions-4", "The food smells ", "delicious", ".", "Complement", ["delicious", "deliciously"], "Smells links the food to a description, so use an adjective: delicious."),
      item("complete-patterns-questions-5", "They bought ", "a table", ".", "Object", "A table is what they bought."),
      find("complete-patterns-questions-6", "The children seem ", "happy", ".", "Complement", "Happy describes the children after seem."),
    ],
  },
  "foundation-review": {
    id: "foundation-review", title: "Foundation review", categories: ["Noun", "Pronoun", "Article", "Determiner"],
    prompt: "Choose the label for the highlighted part.",
    examples: [
      item("foundation-review-examples-1", "", "Maria", " is my neighbor.", "Noun", "Maria names a person."),
      item("foundation-review-examples-2", "I need ", "a", " bag.", "Article", "A is an article. Articles are one kind of determiner."),
    ],
    questions: [
      find("foundation-review-questions-1", "", "They", " work together.", "Pronoun", "They stands in for the people we mean."),
      item("foundation-review-questions-2", "The ", "teacher", " helps us.", "Noun", "Teacher names a person."),
      item("foundation-review-questions-3", "The teacher helps ", "us", ".", "Pronoun", "Us stands in for the speaker and other people."),
      item("foundation-review-questions-4", "", "The", " bus is here.", "Article", "The is one of the three articles: a, an, and the."),
      choose("foundation-review-questions-5", "", "My", " bus is late.", "Determiner", ["I", "My"], "My shows who the bus belongs to. My is a determiner."),
      find("foundation-review-questions-6", "We have ", "some", " rice.", "Determiner", "Some gives information about quantity."),
    ],
  },
  "sentence-review": {
    id: "sentence-review", title: "Sentence structure review", categories: ["Subject", "Verb", "Object", "Complement"],
    prompt: "Choose the label for the highlighted part.",
    examples: [
      item("sentence-review-examples-1", "", "The nurse", " works here.", "Subject", "The nurse is who the sentence is about."),
      item("sentence-review-examples-2", "She bought ", "a coat", ".", "Object", "A coat is what she bought."),
    ],
    questions: [
      item("sentence-review-questions-1", "", "We", " need help.", "Subject", "We is who needs help."),
      choose("sentence-review-questions-2", "My brother ", "cooks", " dinner.", "Verb", ["cook", "cooks"], "My brother is one person, so the verb is cooks."),
      item("sentence-review-questions-3", "The soup is ", "hot", ".", "Complement", "Hot describes the soup after the linking verb is."),
      find("sentence-review-questions-4", "They became ", "friends", ".", "Complement", "Friends identifies what they became."),
      find("sentence-review-questions-5", "Our neighbors help ", "us", ".", "Object", "Us receives the help."),
      item("sentence-review-questions-6", "She gave ", "him", " a key.", "Object", "Him is the indirect object: the person receiving the key."),
    ],
  },
  "modifier-review": {
    id: "modifier-review", title: "Describing words review", categories: ["Adjective", "Noun", "Adverb", "Verb"],
    prompt: "Choose the label for the highlighted part.",
    examples: [
      item("modifier-review-examples-1", "We have a ", "quiet", " room.", "Adjective", "Quiet describes room and comes before the noun."),
      item("modifier-review-examples-2", "We ", "often", " walk to school.", "Adverb", "Often tells how frequently we walk."),
    ],
    questions: [
      find("modifier-review-questions-1", "She has a ", "blue", " bag.", "Adjective", "Blue describes the bag."),
      item("modifier-review-questions-2", "Her ", "bag", " is blue.", "Noun", "Bag names a thing."),
      item("modifier-review-questions-3", "This room is ", "larger", " than ours.", "Adjective", "Larger describes the room by comparing it with another room."),
      choose("modifier-review-questions-4", "He speaks ", "slowly", ".", "Adverb", ["slow", "slowly"], "Slowly tells how he speaks. An adverb describes an action verb."),
      item("modifier-review-questions-5", "Our neighbor is ", "friendly", ".", "Adjective", "Friendly describes our neighbor. An -ly ending does not always mean adverb."),
      find("modifier-review-questions-6", "They ", "arrived", " early.", "Verb", "Arrived tells the action."),
    ],
  },
  "connector-review": {
    id: "connector-review", title: "Connecting words review", categories: ["Preposition", "Noun", "Conjunction"],
    prompt: "Choose the label for the highlighted part.",
    examples: [
      item("connector-review-examples-1", "The keys are ", "on", " the table.", "Preposition", "On shows the relationship between the keys and the table."),
      item("connector-review-examples-2", "We stayed home ", "because", " it rained.", "Conjunction", "Because introduces a clause that gives a reason."),
    ],
    questions: [
      choose("connector-review-questions-1", "We meet ", "at", " noon.", "Preposition", ["at", "on"], "Use at with clock times: at noon."),
      item("connector-review-questions-2", "She works in a ", "hospital", ".", "Noun", "Hospital names a place."),
      find("connector-review-questions-3", "The bag is ", "under", " the chair.", "Preposition", "Under shows where the bag is."),
      item("connector-review-questions-4", "I am tired, ", "but", " I will finish.", "Conjunction", "But joins two contrasting ideas."),
      item("connector-review-questions-5", "We can walk ", "or", " take the bus.", "Conjunction", "Or joins two choices."),
      find("connector-review-questions-6", "Call me ", "when", " you arrive.", "Conjunction", "When introduces a clause about time."),
    ],
  },
  "final-review": {
    id: "final-review", title: "Mixed review", categories: ["Noun", "Pronoun", "Adjective", "Adverb", "Conjunction", "Preposition"],
    prompt: "Choose the label for the highlighted part.",
    examples: [
      item("final-review-examples-1", "", "Maria", " is my neighbor.", "Noun", "Maria names a person."),
      item("final-review-examples-2", "I like tea ", "and", " coffee.", "Conjunction", "And joins tea and coffee."),
    ],
    questions: [
      item("final-review-questions-1", "", "They", " work together.", "Pronoun", "They stands in for the people we mean."),
      find("final-review-questions-2", "The ", "teacher", " helps us.", "Noun", "Teacher names a person."),
      item("final-review-questions-3", "We meet ", "at", " noon.", "Preposition", "At introduces a time."),
      choose("final-review-questions-4", "He speaks ", "slowly", ".", "Adverb", ["slow", "slowly"], "Slowly tells how he speaks. An adverb describes an action verb."),
      item("final-review-questions-5", "Our neighbor is ", "friendly", ".", "Adjective", "Friendly describes our neighbor. An -ly ending does not always mean adverb."),
      find("final-review-questions-6", "I am tired, ", "but", " I will finish.", "Conjunction", "But joins contrasting ideas."),
    ],
  },
  // Keep the original authored lesson so older saved attempts remain valid.
  'more-word-jobs': {
    id: 'more-word-jobs', title: 'Adjectives, pronouns, and articles', categories: ['Adjective', 'Pronoun', 'Article'],
    examples: [
      item('more-example-adj', 'The ', 'new', ' student is here.', 'Adjective', 'New describes the student. An adjective describes a noun.'),
      item('more-example-pron', '', 'She', ' is here.', 'Pronoun', 'She takes the place of a person’s name. A pronoun can stand in for a noun or noun phrase.'),
      item('more-example-art', 'I have ', 'a', ' question.', 'Article', 'A introduces the noun question. The articles are a, an, and the.'),
    ],
    questions: [
      item('more-1', 'The soup is ', 'hot', '.', 'Adjective', 'Hot describes the soup.'),
      item('more-2', '', 'They', ' live near the school.', 'Pronoun', 'They stands in for the people we are talking about.'),
      item('more-3', 'She has ', 'an', ' appointment.', 'Article', 'An introduces the noun appointment.'),
      item('more-4', 'We have a ', 'small', ' kitchen.', 'Adjective', 'Small describes the kitchen.'),
      item('more-5', 'The teacher helps ', 'us', '.', 'Pronoun', 'Us stands in for the speaker and other people.'),
      item('more-6', 'Please close ', 'the', ' door.', 'Article', 'The introduces a particular door.'),
      item('more-7', 'Our neighbor is ', 'friendly', '.', 'Adjective', 'Friendly describes our neighbor. Not every word ending in -ly is an adverb.'),
      item('more-8', '', 'He', ' works at the clinic.', 'Pronoun', 'He stands in for a person’s name.'),
      item('more-9', 'I need ', 'a', ' pen.', 'Article', 'A introduces the noun pen.'),
    ],
  },
};
export function reviewSentence(item: ReviewItem) { return item.before + item.target + item.after; }
export function reviewWords(item: ReviewItem) { return reviewSentence(item).split(' '); }
/** The answer a student must give: a category (label), a word position (find), or a word (choose). */
export function reviewCorrectAnswer(item: ReviewItem): string {
  if (item.kind === 'find') return String(item.before.split(' ').filter(Boolean).length);
  if (item.kind === 'choose') return item.target;
  return item.answer;
}
/** Every answer the student can pick for this question. */
export function reviewChoices(item: ReviewItem, lesson: ReviewLesson): string[] {
  if (item.kind === 'find') return reviewWords(item).map((_, index) => String(index));
  if (item.kind === 'choose') return item.options ?? [];
  return item.categories ?? lesson.categories;
}

/** A suggested first pass, not mastery deadlines or locked prerequisites. */
export const WEEKLY_REVIEW_LESSONS = [
  { id: 'nouns-verbs', week: 3, phase: 'Phase 1 · Foundation' },
  { id: 'week-4-describing', week: 4, phase: 'Phases 1 & 3 · Describing things' },
  { id: 'week-5-subjects', week: 5, phase: 'Phase 2 · Building sentences' },
  { id: 'week-6-objects', week: 6, phase: 'Phase 2 · Building sentences' },
  { id: 'week-7-adverbs', week: 8, phase: 'Phase 3 · Adding detail' },
] as const;
export const REVIEW_PHASES: { title: string; description: string; core: ReviewLessonId[]; extra: ReviewLessonId[]; checkIn: ReviewLessonId }[] = [
  { title: 'Phase 1: Foundation', description: 'Notice nouns, verbs, basic pronouns, and a, an, the. Revisit these whenever you need to.', core: ['nouns-verbs', 'pronouns', 'week-4-describing'], extra: ['determiners', 'foundation-review'], checkIn: 'foundation-check-in' },
  { title: 'Phase 2: Building sentences', description: 'Find subjects and verbs, then explore simple actions and descriptions.', core: ['week-5-subjects', 'week-6-objects'], extra: ['subjects', 'verb-forms', 'verb-phrases', 'objects', 'complements', 'complete-patterns', 'sentence-review'], checkIn: 'sentence-check-in' },
  { title: 'Phase 3: Adding detail', description: 'Use adjectives and common adverbs to add detail to familiar sentences.', core: ['week-4-describing', 'week-7-adverbs'], extra: ['adjective-placement', 'adverbs', 'adverb-placement', 'adjectives-articles', 'modifier-review'], checkIn: 'description-check-in' },
  { title: 'Phase 4: Connecting ideas', description: 'Start with useful prepositions and and, but, so. Then try because, when, and if.', core: ['prepositions', 'conjunctions', 'dependent-clauses'], extra: ['preposition-partners'], checkIn: 'connector-review' },
  { title: 'Phase 5: Using sentence patterns', description: 'Learn useful word partnerships, such as enjoy reading and want to read. The particular word matters, not only its part of speech.', core: ['gerunds', 'verb-patterns'], extra: ['final-review'], checkIn: 'pattern-check-in' },
];
// Retained for consumers of the original short-lesson catalogue.
export const LATER_REVIEW_SECTIONS = REVIEW_PHASES.map(phase => ({ title: phase.title, lessons: [...new Set([...phase.core, ...phase.extra, phase.checkIn])] }));

/** Start-screen topics. Numbered only: no weeks, months, or phases, because the schedule can change. */
export const REVIEW_TOPICS: { title: string; what: string; cues: ReviewCategory[]; core: ReviewLessonId[]; check: ReviewLessonId; extra: ReviewLessonId[] }[] = [
  { title: 'Word basics', what: 'Nouns, verbs, pronouns, a / an / the', cues: ['Noun', 'Verb', 'Pronoun', 'Article'],
    core: ['nouns-verbs', 'pronouns', 'week-4-describing'], check: 'foundation-check-in', extra: ['determiners', 'foundation-review'] },
  { title: 'Building sentences', what: 'Who does it? What happens?', cues: ['Subject', 'Verb', 'Object'],
    core: ['week-5-subjects', 'week-6-objects'], check: 'sentence-check-in',
    extra: ['subjects', 'verb-forms', 'verb-phrases', 'objects', 'complements', 'complete-patterns', 'sentence-review'] },
  { title: 'Adding detail', what: 'Adjectives and adverbs', cues: ['Adjective', 'Adverb'],
    core: ['week-7-adverbs', 'adjective-placement'], check: 'description-check-in', extra: ['adverbs', 'adverb-placement', 'modifier-review'] },
  { title: 'Connecting ideas', what: 'in, on, and, but, because', cues: ['Preposition', 'Conjunction'],
    core: ['prepositions', 'conjunctions', 'dependent-clauses'], check: 'connector-review', extra: ['preposition-partners'] },
  { title: 'Word partners', what: 'enjoy reading · want to read', cues: ['Gerund', 'Infinitive'],
    core: ['gerunds', 'verb-patterns'], check: 'pattern-check-in', extra: ['final-review'] },
];
