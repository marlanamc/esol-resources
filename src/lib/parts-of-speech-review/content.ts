export const REVIEW_ACTIVITY_ID = 'parts-of-speech-game';
export type ReviewCategory = 'Noun' | 'Verb' | 'Adjective' | 'Pronoun' | 'Article';
export type ReviewLessonId = 'nouns-verbs' | 'more-word-jobs';
export interface ReviewItem {
  id: string;
  before: string;
  target: string;
  after: string;
  answer: ReviewCategory;
  explanation: string;
}
export interface ReviewLesson {
  id: ReviewLessonId;
  title: string;
  categories: ReviewCategory[];
  examples: ReviewItem[];
  questions: ReviewItem[];
}
function item(id: string, before: string, target: string, after: string, answer: ReviewCategory, explanation: string): ReviewItem {
  return { id, before, target, after, answer, explanation };
}
export const REVIEW_LESSONS: Record<ReviewLessonId, ReviewLesson> = {
  'nouns-verbs': {
    id: 'nouns-verbs', title: 'Nouns and verbs', categories: ['Noun', 'Verb'],
    examples: [
      item('nv-example-noun', 'The ', 'teacher', ' helps us.', 'Noun', 'Teacher names a person. A noun names a person, place, thing, or idea.'),
      item('nv-example-verb', 'The teacher ', 'helps', ' us.', 'Verb', 'Helps tells what the teacher does. A verb can show an action or a state, as in “She is ready.”'),
    ],
    questions: [
      item('nv-1', 'The ', 'bus', ' arrives at eight.', 'Noun', 'Bus names a thing.'),
      item('nv-2', 'We ', 'cook', ' dinner together.', 'Verb', 'Cook tells what we do.'),
      item('nv-3', 'My sister ', 'is', ' a nurse.', 'Verb', 'Is links my sister to who she is. Is is a verb, even though it does not show an action.'),
      item('nv-4', 'The children walk to ', 'school', '.', 'Noun', 'School names a place.'),
      item('nv-5', 'I ', 'have', ' two children.', 'Verb', 'Have expresses a relationship or possession. It is a verb.'),
      item('nv-6', 'The ', 'doctor', ' listens carefully.', 'Noun', 'Doctor names a person.'),
      item('nv-7', 'We ', 'need', ' more time.', 'Verb', 'Need tells what we require. It is a verb, even though you cannot see an action.'),
      item('nv-8', 'Good ', 'health', ' is important.', 'Noun', 'Health names an idea or condition. Nouns do not always name things you can touch.'),
    ],
  },
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
