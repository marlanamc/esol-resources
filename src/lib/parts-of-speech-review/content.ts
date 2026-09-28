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
  questions: ReviewItem[];
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
    questions: [
      item("week-4-describing-questions-1", "The soup is ", "hot", ".", "Adjective", "Hot describes the soup. Adjectives can come after is."),
      item("week-4-describing-questions-2", "I need ", "a", " pen.", "Article", "A introduces the noun pen."),
      item("week-4-describing-questions-3", "She has ", "an", " appointment.", "Article", "An introduces appointment. We use an before a vowel sound."),
      item("week-4-describing-questions-4", "The ", "new", " student is here.", "Adjective", "New describes the student."),
      item("week-4-describing-questions-5", "Please close ", "the", " door.", "Article", "The introduces a particular door."),
      item("week-4-describing-questions-6", "Our neighbor is ", "friendly", ".", "Adjective", "Friendly describes our neighbor."),
      { ...item("week-4-describing-review-1", "The ", "bus", " arrives at eight.", "Noun", "Bus names a thing."), review: true, categories: ["Noun", "Verb"], prompt: "Remember this: choose the label for the highlighted part." },
      { ...item("week-4-describing-review-2", "We ", "cook", " dinner together.", "Verb", "Cook tells what we do."), review: true, categories: ["Noun", "Verb"], prompt: "Remember this: choose the label for the highlighted part." },
    ],
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
    questions: [
      item("week-5-subjects-questions-1", "", "My sister", " works at a clinic.", "Subject", "My sister is who works at the clinic."),
      item("week-5-subjects-questions-2", "The children ", "play", " outside.", "Verb", "Play tells what the children do."),
      item("week-5-subjects-questions-3", "", "We", " need more time.", "Subject", "We is who needs more time. A pronoun can be a subject."),
      item("week-5-subjects-questions-4", "The soup ", "is", " hot.", "Verb", "Is links the soup to the description hot. A verb does not have to show an action."),
      item("week-5-subjects-questions-5", "", "The bus", " is late.", "Subject", "The bus is what this sentence is about, even without an action."),
      item("week-5-subjects-questions-6", "They ", "have", " a car.", "Verb", "Have tells about possession. It is the verb here."),
      { ...item("week-5-subjects-review-1", "The ", "new", " student is here.", "Adjective", "New describes the student."), review: true, categories: ["Adjective", "Article"], prompt: "Remember this: choose the label for the highlighted part." },
      { ...item("week-5-subjects-review-2", "I need ", "a", " pen.", "Article", "A introduces the noun pen."), review: true, categories: ["Adjective", "Article"], prompt: "Remember this: choose the label for the highlighted part." },
    ],
  },
  "week-6-objects": {
    id: "week-6-objects", title: "Actions and descriptions", categories: ["Object", "Complement"],
    prompt: "What is the highlighted part’s job in this sentence?",
    transfer: {"prompt": "Describe someone, or tell what they do. Choose one sentence pattern.", "example": "My friend is kind. / My friend helps a neighbor.", "check": "Does the part after the verb describe your person, or tell who or what the action affects?", parts: [{"text": "My friend is "}, {"text": "kind", "category": "Complement"}, {"text": ". / My friend helps "}, {"text": "a neighbor", "category": "Object"}, {"text": "."}] },
    examples: [
      item("week-6-objects-examples-1", "She helps ", "a friend", ".", "Object", "A friend is who she helps. This part is the object."),
      item("week-6-objects-examples-2", "She is ", "friendly", ".", "Complement", "Friendly describes her after is. This description completes the sentence; it is a complement."),
    ],
    questions: [
      item("week-6-objects-questions-1", "He reads ", "a book", ".", "Object", "A book is what he reads."),
      item("week-6-objects-questions-2", "The room is ", "quiet", ".", "Complement", "Quiet describes the room after is."),
      item("week-6-objects-questions-3", "We need ", "help", ".", "Object", "Help is what we need."),
      item("week-6-objects-questions-4", "My brother is ", "a driver", ".", "Complement", "A driver tells who my brother is after is."),
      item("week-6-objects-questions-5", "They carry ", "the bags", ".", "Object", "The bags are what they carry."),
      item("week-6-objects-questions-6", "The children are ", "happy", ".", "Complement", "Happy describes the children after are."),
      { ...item("week-6-objects-review-1", "", "The teacher", " helps us.", "Subject", "The teacher is the subject: who this sentence is about."), review: true, categories: ["Subject", "Verb"], prompt: "Remember this: choose the label for the highlighted part." },
      { ...item("week-6-objects-review-2", "The teacher ", "helps", " us.", "Verb", "Helps tells what the teacher does."), review: true, categories: ["Subject", "Verb"], prompt: "Remember this: choose the label for the highlighted part." },
    ],
  },
  "week-7-adverbs": {
    id: "week-7-adverbs", title: "Adverbs: how and how often", categories: ["Adjective", "Adverb"],
    transfer: {"prompt": "Say or write a sentence about how you do something, or how often you do it.", "example": "I usually cook at home.", "check": "Point to your adverb. Does it tell how, or how often?", parts: [{"text": "I "}, {"text": "usually", "category": "Adverb"}, {"text": " "}, {"text": "cook", "category": "Verb"}, {"text": " at home."}] },
    examples: [
      item("week-7-adverbs-examples-1", "She drives ", "carefully", ".", "Adverb", "Carefully tells how she drives. An adverb can add information about a verb."),
      item("week-7-adverbs-examples-2", "She ", "often", " drives to work.", "Adverb", "Often tells how frequently she drives. Adverbs can tell how often."),
    ],
    questions: [
      item("week-7-adverbs-questions-1", "He speaks ", "slowly", ".", "Adverb", "Slowly tells how he speaks."),
      item("week-7-adverbs-questions-2", "He is a ", "careful", " driver.", "Adjective", "Careful describes the noun driver."),
      item("week-7-adverbs-questions-3", "We ", "usually", " cook at home.", "Adverb", "Usually tells how often we cook."),
      item("week-7-adverbs-questions-4", "The children are ", "happy", ".", "Adjective", "Happy describes the children."),
      item("week-7-adverbs-questions-5", "She is ", "always", " early.", "Adverb", "Always tells how consistently she is early. It comes after is here."),
      item("week-7-adverbs-questions-6", "He walks ", "quickly", ".", "Adverb", "Quickly tells how he walks."),
      { ...item("week-7-adverbs-review-1", "She helps ", "a friend", ".", "Object", "A friend is who she helps: the object."), review: true, categories: ["Object", "Complement"], prompt: "Remember this: choose the label for the highlighted part." },
      { ...item("week-7-adverbs-review-2", "She is ", "friendly", ".", "Complement", "Friendly describes her after is: a complement."), review: true, categories: ["Object", "Complement"], prompt: "Remember this: choose the label for the highlighted part." },
    ],
  },
  'foundation-check-in': {
    id: 'foundation-check-in', title: 'Quick foundation check-in', categories: ['Pronoun', 'Article'],
    examples: [
      item('fc-example-1', '', 'She', ' is my neighbor.', 'Pronoun', 'She stands in for a person’s name.'),
      item('fc-example-2', 'She has ', 'a', ' car.', 'Article', 'A introduces the noun car. A, an, and the are articles.'),
    ],
    questions: [
      item('fc-1', '', 'They', ' live nearby.', 'Pronoun', 'They stands in for the people we mean.'),
      item('fc-2', 'I need ', 'an', ' umbrella.', 'Article', 'An introduces umbrella.'),
      item('fc-3', '', 'He', ' works here.', 'Pronoun', 'He stands in for a person’s name.'),
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
      item("sentence-check-in-questions-1", "We ", "need", " help.", "Verb", "Need is the verb. It tells what we require."),
      item("sentence-check-in-questions-2", "She reads ", "a book", ".", "Object", "A book is what she reads."),
      item("sentence-check-in-questions-3", "The soup is ", "hot", ".", "Complement", "Hot describes the soup after is."),
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
      item("description-check-in-questions-0", "I have ", "a", " bag.", "Article", "A introduces the noun bag."),
      item("description-check-in-questions-1", "The bag is ", "heavy", ".", "Adjective", "Heavy describes the bag after is."),
      item("description-check-in-questions-2", "We ", "often", " walk home.", "Adverb", "Often tells how often we walk."),
      item("description-check-in-questions-3", "She has ", "an", " umbrella.", "Article", "An introduces umbrella."),
      item("description-check-in-questions-4", "He has a ", "blue", " coat.", "Adjective", "Blue describes the coat."),
      item("description-check-in-questions-5", "They work ", "carefully", ".", "Adverb", "Carefully tells how they work."),
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
      item("pattern-check-in-questions-0", "We decided ", "to walk", ".", "Infinitive", "The pattern is decide to do something."),
      item("pattern-check-in-questions-1", "He finished ", "cleaning", ".", "Gerund", "The pattern is finish doing something."),
      item("pattern-check-in-questions-2", "She hopes ", "to visit", ".", "Infinitive", "The pattern is hope to do something."),
      item("pattern-check-in-questions-3", "I enjoy ", "cooking", ".", "Gerund", "The pattern is enjoy doing something."),
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
    questions: [
      item('nv-1', 'The ', 'bus', ' arrives at eight.', 'Noun', 'Bus names a thing.'),
      find('nv-2', 'We ', 'cook', ' dinner together.', 'Verb', 'Cook tells what we do.'),
      item('nv-3', 'My sister ', 'is', ' a nurse.', 'Verb', 'Is links my sister to who she is. Is is a verb, even though it does not show an action.'),
      choose('nv-4', 'The children ', 'walk', ' to school.', 'Verb', ['school', 'walk'], 'We need a verb here. Walk tells what the children do.'),
      find('nv-5', 'I ', 'have', ' two children.', 'Verb', 'Have expresses a relationship or possession. It is a verb.'),
      choose('nv-6', 'The ', 'doctor', ' listens carefully.', 'Noun', ['listen', 'doctor'], 'We need a noun here. Who listens? The doctor. Doctor names a person.'),
      item('nv-7', 'We ', 'need', ' more time.', 'Verb', 'Need tells what we require. It is a verb, even though you cannot see an action.'),
      find('nv-8', 'Good ', 'health', ' is important.', 'Noun', 'Health names an idea or condition. Nouns do not always name things you can touch.'),
    ],
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
      item("pronouns-questions-1", "", "They", " work together.", "Pronoun", "They stands in for the people we mean."),
      item("pronouns-questions-2", "The ", "teacher", " helps us.", "Noun", "Teacher names a person."),
      item("pronouns-questions-3", "The teacher helps ", "us", ".", "Pronoun", "Us stands in for the speaker and other people."),
      item("pronouns-questions-4", "Please call ", "him", ".", "Pronoun", "Him stands in for a person."),
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
      item("determiners-questions-2", "", "My", " bus is late.", "Determiner", "My shows whose bus we mean. Before a noun, my is a possessive determiner."),
      item("determiners-questions-3", "We have ", "some", " rice.", "Determiner", "Some gives information about quantity."),
      item("determiners-questions-4", "She has ", "an", " umbrella.", "Article", "An is an article."),
      item("determiners-questions-5", "", "Those", " shoes are wet.", "Determiner", "Those points to particular shoes."),
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
      item("subjects-questions-2", "My brother ", "cooks", " dinner.", "Verb", "Cooks tells what my brother does."),
      item("subjects-questions-3", "", "Ana and Luis", " live nearby.", "Subject", "Ana and Luis together form the subject."),
      item("subjects-questions-4", "", "Swimming", " is fun.", "Subject", "Swimming is the activity the sentence is about."),
      item("subjects-questions-5", "The bus ", "arrives", " at eight.", "Verb", "Arrives tells what the bus does."),
      item("subjects-questions-6", "", "It", " is raining.", "Subject", "It fills the subject position in this weather sentence."),
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
      item("verb-forms-questions-1", "I have ", "gone", " home.", "Past participle", "Gone is the past participle: V3. Here it follows have."),
      item("verb-forms-questions-2", "We ", "eat", " lunch at noon.", "Base form", "Eat is the base form: V1."),
      item("verb-forms-questions-3", "Yesterday we ", "ate", " early.", "Past form", "Ate is the past form of eat: V2."),
      item("verb-forms-questions-4", "We have ", "eaten", " lunch.", "Past participle", "Eaten is the past participle: V3."),
      item("verb-forms-questions-5", "She ", "wrote", " a letter yesterday.", "Past form", "Wrote is the past form of write: V2."),
      item("verb-forms-questions-6", "I can ", "write", " my name.", "Base form", "Write is the base form: V1. We use the base form after can."),
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
      item("verb-phrases-questions-1", "We ", "can", " swim.", "Helping verb", "Can helps the main verb swim express ability."),
      item("verb-phrases-questions-2", "We can ", "swim", ".", "Main verb", "Swim names the main action."),
      item("verb-phrases-questions-3", "They ", "have", " finished.", "Helping verb", "Have helps finished form the present perfect."),
      item("verb-phrases-questions-4", "He ", "became", " a teacher.", "Linking verb", "Became links he to a teacher."),
      item("verb-phrases-questions-5", "She has been ", "working", ".", "Main verb", "Working gives the main action in has been working."),
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
      item("objects-questions-1", "", "We", " help our neighbors.", "Subject", "We do the helping."),
      item("objects-questions-2", "Our neighbors help ", "us", ".", "Object", "Us receives the help."),
      item("objects-questions-3", "She gave ", "him", " a key.", "Object", "Him is the indirect object: the person receiving the key."),
      item("objects-questions-4", "She gave him ", "a key", ".", "Object", "A key is the direct object: the thing given."),
      item("objects-questions-5", "", "Cooking", " takes time.", "Subject", "Cooking is the activity the sentence is about."),
      item("objects-questions-6", "I enjoy ", "cooking", ".", "Object", "Cooking is what I enjoy, so it is the object."),
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
      item("complements-questions-1", "The soup is ", "hot", ".", "Complement", "Hot describes the soup after the linking verb is."),
      item("complements-questions-2", "He opened ", "the door", ".", "Object", "The door is what he opened."),
      item("complements-questions-3", "They became ", "friends", ".", "Complement", "Friends identifies what they became."),
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
      item("adjective-placement-questions-1", "She has a ", "blue", " bag.", "Adjective", "Blue describes the bag."),
      item("adjective-placement-questions-2", "Her ", "bag", " is blue.", "Noun", "Bag names a thing."),
      item("adjective-placement-questions-3", "This room is ", "larger", " than ours.", "Adjective", "Larger describes the room by comparing it with another room."),
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
      item("adverbs-questions-1", "He speaks ", "slowly", ".", "Adverb", "Slowly tells how he speaks."),
      item("adverbs-questions-2", "Our neighbor is ", "friendly", ".", "Adjective", "Friendly describes our neighbor. An -ly ending does not always mean adverb."),
      item("adverbs-questions-3", "The train moves ", "fast", ".", "Adverb", "Fast tells how the train moves."),
      item("adverbs-questions-4", "This is a ", "fast", " train.", "Adjective", "Fast describes the noun train."),
      item("adverbs-questions-5", "I am ", "very", " tired.", "Adverb", "Very adds information about the adjective tired."),
      item("adverbs-questions-6", "The children are ", "happy", ".", "Adjective", "Happy describes the children."),
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
      item("adverb-placement-questions-2", "I ", "usually", " cook at home.", "Adverb", "Usually tells how often I cook."),
      item("adverb-placement-questions-3", "We arrived ", "yesterday", ".", "Adverb", "Yesterday tells when we arrived."),
      item("adverb-placement-questions-4", "They ", "arrived", " early.", "Verb", "Arrived tells the action."),
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
      item("prepositions-questions-1", "We meet ", "at", " noon.", "Preposition", "At connects the meeting to a time."),
      item("prepositions-questions-2", "She works in a ", "hospital", ".", "Noun", "Hospital names a place."),
      item("prepositions-questions-3", "The bag is ", "under", " the chair.", "Preposition", "Under shows where the bag is."),
      item("prepositions-questions-4", "We travel ", "by", " bus.", "Preposition", "By introduces the way we travel."),
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
      item("preposition-partners-questions-1", "Please listen ", "to", " the teacher.", "Preposition", "Listen to is the word partnership here."),
      item("preposition-partners-questions-2", "She is ", "good", " at math.", "Adjective", "Good describes her ability. The partnership is good at."),
      item("preposition-partners-questions-3", "We depend ", "on", " the bus.", "Preposition", "The partnership is depend on."),
      item("preposition-partners-questions-4", "I ", "look", " for my keys.", "Verb", "Look is the verb. Look for means try to find."),
      item("preposition-partners-questions-5", "He is afraid ", "of", " dogs.", "Preposition", "The partnership is afraid of."),
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
      item("conjunctions-questions-2", "We can walk ", "or", " take the bus.", "Conjunction", "Or joins two choices."),
      item("conjunctions-questions-3", "The bus stops ", "near", " school.", "Preposition", "Near shows a place relationship."),
      item("conjunctions-questions-4", "It rained, ", "so", " we stayed home.", "Conjunction", "So joins a cause and its result."),
      item("conjunctions-questions-5", "She works ", "at", " a clinic.", "Preposition", "At introduces a place."),
      item("conjunctions-questions-6", "Ana ", "and", " Luis study together.", "Conjunction", "And joins two names."),
    ],
  },
  "dependent-clauses": {
    id: "dependent-clauses", title: "Because, when, and if", categories: ["Conjunction", "Preposition"],
    examples: [
      item("dependent-clauses-examples-1", "We stayed home ", "because", " it rained.", "Conjunction", "Because introduces a clause that gives a reason."),
      item("dependent-clauses-examples-2", "We stayed home ", "during", " the storm.", "Preposition", "During introduces a noun phrase, the storm."),
    ],
    questions: [
      item("dependent-clauses-questions-1", "Call me ", "when", " you arrive.", "Conjunction", "When introduces a clause about time."),
      item("dependent-clauses-questions-2", "I will help ", "if", " I can.", "Conjunction", "If introduces a condition."),
      item("dependent-clauses-questions-3", "We walked ", "through", " the park.", "Preposition", "Through introduces the noun phrase the park."),
      item("dependent-clauses-questions-4", "", "Although", " she was tired, she studied.", "Conjunction", "Although introduces a contrasting idea."),
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
      item("gerunds-questions-1", "I enjoy ", "cooking", ".", "Gerund", "Cooking names the activity I enjoy and works as an object."),
      item("gerunds-questions-2", "He is ", "cooking", " dinner.", "Verb", "Cooking is part of the verb phrase is cooking."),
      item("gerunds-questions-3", "", "Reading", " helps me learn.", "Gerund", "Reading names an activity and works as the subject."),
      item("gerunds-questions-4", "We are ", "reading", " together.", "Verb", "Reading is part of the verb phrase are reading."),
      item("gerunds-questions-5", "She is good at ", "drawing", ".", "Gerund", "Drawing names an activity after the preposition at."),
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
      item("verb-patterns-questions-2", "She avoids ", "driving", " at night.", "Gerund", "The pattern is avoid doing something."),
      item("verb-patterns-questions-3", "They hope ", "to visit", " soon.", "Infinitive", "The pattern is hope to do something."),
      item("verb-patterns-questions-4", "He finished ", "cleaning", ".", "Gerund", "The pattern is finish doing something."),
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
      item("complete-patterns-questions-3", "We enjoy ", "music", ".", "Object", "Music is what we enjoy."),
      item("complete-patterns-questions-4", "The food smells ", "delicious", ".", "Complement", "Delicious describes the food after smells."),
      item("complete-patterns-questions-5", "They bought ", "a table", ".", "Object", "A table is what they bought."),
      item("complete-patterns-questions-6", "The children seem ", "happy", ".", "Complement", "Happy describes the children after seem."),
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
      item("foundation-review-questions-1", "", "They", " work together.", "Pronoun", "They stands in for the people we mean."),
      item("foundation-review-questions-2", "The ", "teacher", " helps us.", "Noun", "Teacher names a person."),
      item("foundation-review-questions-3", "The teacher helps ", "us", ".", "Pronoun", "Us stands in for the speaker and other people."),
      item("foundation-review-questions-4", "", "The", " bus is here.", "Article", "The is one of the three articles: a, an, and the."),
      item("foundation-review-questions-5", "", "My", " bus is late.", "Determiner", "My shows whose bus we mean. Before a noun, my is a possessive determiner."),
      item("foundation-review-questions-6", "We have ", "some", " rice.", "Determiner", "Some gives information about quantity."),
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
      item("sentence-review-questions-2", "My brother ", "cooks", " dinner.", "Verb", "Cooks tells what my brother does."),
      item("sentence-review-questions-3", "The soup is ", "hot", ".", "Complement", "Hot describes the soup after the linking verb is."),
      item("sentence-review-questions-4", "They became ", "friends", ".", "Complement", "Friends identifies what they became."),
      item("sentence-review-questions-5", "Our neighbors help ", "us", ".", "Object", "Us receives the help."),
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
      item("modifier-review-questions-1", "She has a ", "blue", " bag.", "Adjective", "Blue describes the bag."),
      item("modifier-review-questions-2", "Her ", "bag", " is blue.", "Noun", "Bag names a thing."),
      item("modifier-review-questions-3", "This room is ", "larger", " than ours.", "Adjective", "Larger describes the room by comparing it with another room."),
      item("modifier-review-questions-4", "He speaks ", "slowly", ".", "Adverb", "Slowly tells how he speaks."),
      item("modifier-review-questions-5", "Our neighbor is ", "friendly", ".", "Adjective", "Friendly describes our neighbor. An -ly ending does not always mean adverb."),
      item("modifier-review-questions-6", "They ", "arrived", " early.", "Verb", "Arrived tells the action."),
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
      item("connector-review-questions-1", "We meet ", "at", " noon.", "Preposition", "At connects the meeting to a time."),
      item("connector-review-questions-2", "She works in a ", "hospital", ".", "Noun", "Hospital names a place."),
      item("connector-review-questions-3", "The bag is ", "under", " the chair.", "Preposition", "Under shows where the bag is."),
      item("connector-review-questions-4", "I am tired, ", "but", " I will finish.", "Conjunction", "But joins two contrasting ideas."),
      item("connector-review-questions-5", "We can walk ", "or", " take the bus.", "Conjunction", "Or joins two choices."),
      item("connector-review-questions-6", "Call me ", "when", " you arrive.", "Conjunction", "When introduces a clause about time."),
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
      item("final-review-questions-2", "The ", "teacher", " helps us.", "Noun", "Teacher names a person."),
      item("final-review-questions-3", "We meet ", "at", " noon.", "Preposition", "At introduces a time."),
      item("final-review-questions-4", "He speaks ", "slowly", ".", "Adverb", "Slowly tells how he speaks."),
      item("final-review-questions-5", "Our neighbor is ", "friendly", ".", "Adjective", "Friendly describes our neighbor. An -ly ending does not always mean adverb."),
      item("final-review-questions-6", "I am tired, ", "but", " I will finish.", "Conjunction", "But joins contrasting ideas."),
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
  { id: 'week-7-adverbs', week: 7, phase: 'Phase 3 · Adding detail' },
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
