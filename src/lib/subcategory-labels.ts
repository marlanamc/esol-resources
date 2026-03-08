/**
 * Descriptive subtitles for grammar subcategories.
 * These appear below the grammatical term in section headers
 * to help students understand what they'll learn.
 */

export const SUBCATEGORY_SUBTITLES: Record<string, string> = {
  // Tense families
  'SIMPLE': 'Present, Past & Future',
  'CONTINUOUS': 'Actions in Progress',
  'PERFECT': 'Completed Actions',
  'PERFECT CONTINUOUS': 'Duration & Results',
  'REVIEWS & MIXED': 'Practice All Tenses',

  // Specific tenses (if used as headers)
  'Present Simple': 'Habits, routines, and facts',
  'Past Simple': 'Finished actions in the past',
  'Future Simple': 'Plans and predictions',
  'Present Continuous': 'Actions happening now',
  'Past Continuous': 'Actions in progress in the past',
  'Future Continuous': 'Actions in progress in the future',
  'Present Perfect': 'Past actions connected to now',
  'Past Perfect': 'Actions before another past action',
  'Future Perfect': 'Actions completed before a future time',
  'Present Perfect Continuous': 'Duration up to now',
  'Past Perfect Continuous': 'Duration before a past moment',
  'Future Perfect Continuous': 'Duration up to a future moment',

  // Other grammar topics
  'QUESTIONS & MODALS': 'Asking & Expressing Ability',
  'GERUNDS': 'Verb + -ing as Nouns',
  'VERBS': 'Forms & Patterns',
  'CONDITIONALS': 'If...Then Situations',
  'DESCRIBING': 'Adjectives & Adverbs',
  'WRITING': 'Structure & Style',

  // Vocabulary subcategories
  'Cycle 1': 'September – December',
  'Cycle 2': 'January – May',
};

/**
 * Get the descriptive subtitle for a subcategory.
 * Returns undefined if no subtitle is defined.
 */
export function getSubcategorySubtitle(subcategoryName: string): string | undefined {
  // Try exact match first
  if (SUBCATEGORY_SUBTITLES[subcategoryName]) {
    return SUBCATEGORY_SUBTITLES[subcategoryName];
  }

  // Try uppercase match
  const upperName = subcategoryName.toUpperCase();
  if (SUBCATEGORY_SUBTITLES[upperName]) {
    return SUBCATEGORY_SUBTITLES[upperName];
  }

  // Try title case match
  const titleCase = subcategoryName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  if (SUBCATEGORY_SUBTITLES[titleCase]) {
    return SUBCATEGORY_SUBTITLES[titleCase];
  }

  return undefined;
}
