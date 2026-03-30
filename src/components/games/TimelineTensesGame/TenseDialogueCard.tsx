'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import type { RealLifeDialogue } from '@/types/activity';

// Short, natural dialogues showing each tense in real conversation.
// Keyed by the tenseName string used in question data.
const TENSE_DIALOGUES: Record<string, [string, string]> = {
  'Present Simple': [
    'A: "Do you work on Sundays?"',
    'B: "No, I always take Sundays off."',
  ],
  'Past Simple': [
    'A: "Why are you tired?"',
    'B: "I stayed up until midnight."',
  ],
  'Future Simple': [
    'A: "What will you do after class?"',
    'B: "I\'ll probably grab something to eat."',
  ],
  'Present Continuous': [
    'A: "Hey, can you talk right now?"',
    'B: "Not really — I\'m cooking dinner."',
  ],
  'Past Continuous': [
    'A: "Were you sleeping when I called?"',
    'B: "Yes, I was — sorry I missed it!"',
  ],
  'Future Continuous': [
    'A: "I\'ll come by at 7. Is that okay?"',
    'B: "I\'ll be working then — can we do 8?"',
  ],
  'Present Perfect': [
    'A: "Have you ever tried sushi?"',
    'B: "Yes! I\'ve eaten it a few times."',
  ],
  'Past Perfect': [
    'A: "Why didn\'t she come to the party?"',
    'B: "She\'d already made other plans."',
  ],
  'Future Perfect': [
    'A: "Will the food be ready by 6?"',
    'B: "Yes — I\'ll have finished cooking by then."',
  ],
  'Present Perfect Continuous': [
    'A: "You look exhausted!"',
    'B: "I\'ve been working since 6am."',
  ],
  'Past Perfect Continuous': [
    'A: "She was so out of breath!"',
    'B: "She\'d been running for an hour."',
  ],
  'Future Perfect Continuous': [
    'A: "By June, how long will you have studied English?"',
    'B: "I\'ll have been studying for two years!"',
  ],
};

interface TenseDialogueCardProps {
  tenseName?: string;
  dialogue?: RealLifeDialogue;
}

export function TenseDialogueCard({ tenseName, dialogue }: TenseDialogueCardProps) {
  const lines = dialogue
    ? [dialogue.lineA, dialogue.lineB] as const
    : (tenseName ? TENSE_DIALOGUES[tenseName] : undefined);

  if (!lines) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="p-5 rounded-3xl bg-white/40 dark:bg-white/5 border border-white/20"
    >
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle size={14} className="text-text-muted/40" />
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/40">
          In real life
        </span>
      </div>
      <div className="space-y-1.5">
        {lines.map((line, i) => (
          <p key={i} className="text-sm font-medium text-text-muted leading-snug">
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}
