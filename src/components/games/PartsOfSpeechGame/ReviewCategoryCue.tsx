import { Box, Zap, Palette, Type, UserRound, Target, Link2, Clock3, MapPin } from 'lucide-react';
import type { ReviewCategory } from '@/lib/parts-of-speech-review/content';
import styles from './PartsOfSpeechReview.module.css';

// A stable visual vocabulary. Icons and written labels always accompany color.
const categoryVisuals = {
  Noun: ['blue', Box], Verb: ['coral', Zap], Adjective: ['plum', Palette],
  Article: ['gold', Type], Pronoun: ['teal', UserRound], Determiner: ['gold', Type],
  Subject: ['indigo', UserRound], Object: ['teal', Target], Complement: ['plum', Link2],
  'Base form': ['coral', Zap], 'Past form': ['coral', Clock3], 'Past participle': ['coral', Clock3],
  'Helping verb': ['coral', Link2], 'Main verb': ['coral', Zap], 'Linking verb': ['coral', Link2],
  Adverb: ['rose', Clock3], Preposition: ['teal', MapPin], Conjunction: ['indigo', Link2],
  Gerund: ['blue', Box], Infinitive: ['coral', Zap],
} as const;
export function categoryColorClass(category: ReviewCategory) {
  return styles[categoryVisuals[category][0]];
}
export function ReviewCategoryCue({ category, compact = false }: { category: ReviewCategory; compact?: boolean }) {
  const Icon = categoryVisuals[category][1];
  return <span className={`${categoryColorClass(category)} ${compact ? styles.categoryLabel : styles.categoryChip}`}>
    <Icon size={16} aria-hidden="true" /><span>{category}</span>
  </span>;
}
