/**
 * Curated Unsplash photo library for the Parts of Speech visual gallery.
 * Photos are chosen for East Boston ESOL relevance — working-class, diverse, everyday life.
 *
 * URL format: images.unsplash.com/photo-{ID}?w=400&q=80&auto=format&fit=crop
 * (Direct CDN URLs; source.unsplash.com redirects are NOT used — Next Image doesn't follow redirects.)
 *
 * To update: browse Unsplash → open image in new tab → copy CDN URL → append query string above.
 */

import type { POSPhotoEntry } from '@/types/parts-of-speech';

// ─── Noun photos ──────────────────────────────────────────────────────────────

export const NOUN_PHOTOS: POSPhotoEntry[] = [
  {
    word: 'doctor',
    partOfSpeech: 'noun',
    subcategoryLabel: 'Person',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80&auto=format&fit=crop',
    altText: 'A doctor in a medical setting',
  },
  {
    word: 'school',
    partOfSpeech: 'noun',
    subcategoryLabel: 'Place',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80&auto=format&fit=crop',
    altText: 'Students in a classroom raising their hands',
  },
  {
    word: 'apartment',
    partOfSpeech: 'noun',
    subcategoryLabel: 'Thing',
    imageUrl: 'https://images.unsplash.com/photo-1758448511487-15f69dd6107b?w=400&q=80&auto=format&fit=crop',
    altText: 'A modern apartment building with balconies',
  },
  {
    word: 'family',
    partOfSpeech: 'noun',
    subcategoryLabel: 'Idea',
    imageUrl: 'https://images.unsplash.com/photo-1484665754804-74b091211472?w=400&q=80&auto=format&fit=crop',
    altText: 'A happy family playing together at home',
  },
];

// ─── Verb photos ──────────────────────────────────────────────────────────────

// Verb gallery focuses on STATE verbs — the ones students struggle with.
// Action verbs (walk, run, cook) are obvious. State verbs (have, need, want) are not.
// One action verb is included as a clear anchor/contrast point.
export const VERB_PHOTOS: POSPhotoEntry[] = [
  {
    word: 'work',
    partOfSpeech: 'verb',
    subcategoryLabel: 'Action Verb',
    imageUrl: 'https://images.unsplash.com/photo-1691958050227-85762ee1cea5?w=400&q=80&auto=format&fit=crop',
    altText: 'A chef actively cooking in a restaurant kitchen',
  },
  {
    word: 'have',
    partOfSpeech: 'verb',
    subcategoryLabel: 'State Verb',
    imageUrl: 'https://images.unsplash.com/photo-1738750396386-09c35bb4f1ad?w=400&q=80&auto=format&fit=crop',
    altText: 'A smiling family together — she has a family',
  },
  {
    word: 'need',
    partOfSpeech: 'verb',
    subcategoryLabel: 'State Verb',
    imageUrl: 'https://images.unsplash.com/photo-1632052999447-e542d08d4f7d?w=400&q=80&auto=format&fit=crop',
    altText: 'A doctor examining a patient — he needs help',
  },
  {
    word: 'want',
    partOfSpeech: 'verb',
    subcategoryLabel: 'State Verb',
    imageUrl: 'https://images.unsplash.com/photo-1639586052112-6d123b4505ad?w=400&q=80&auto=format&fit=crop',
    altText: 'A woman at a restaurant deciding what she wants',
  },
];

// ─── Pronoun photos ───────────────────────────────────────────────────────────

export const PRONOUN_PHOTOS: POSPhotoEntry[] = [
  {
    word: 'I / me',
    partOfSpeech: 'pronoun',
    subcategoryLabel: 'Subject (I)',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80&auto=format&fit=crop',
    altText: 'Close-up portrait of a woman smiling',
  },
  {
    word: 'we / they',
    partOfSpeech: 'pronoun',
    subcategoryLabel: 'Group (we / they)',
    imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&q=80&auto=format&fit=crop',
    altText: 'A diverse group of people smiling together',
  },
];

// NOTE: No photo galleries for adjectives, adverbs, articles, prepositions, or conjunctions.
// These POS are abstract — a photo of a "happy" person would make students think "woman" (noun),
// not "happy" (adjective). For those groups, the walkthrough uses bold sentence highlighting
// with large colorful text instead of photos.
//
// Photos work clearly for: nouns (the thing itself) and action verbs (the action itself).
// Pronouns get simple person/group portrait photos with careful labeling.

// ─── Photo sort distractor bank ───────────────────────────────────────────────
// Used to fill photo-sort exercises with non-target POS images (nouns + verbs only)

export const PHOTO_SORT_DISTRACTOR_BANK: POSPhotoEntry[] = [
  ...NOUN_PHOTOS,
  ...VERB_PHOTOS,
];
