'use client';

import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';
import type { GerundInfinitiveGroup } from '@/types/gerund-infinitive';

interface PatternHintProps {
  group: GerundInfinitiveGroup;
  patternId?: string;
}

export function PatternHint({ group, patternId }: PatternHintProps) {
  const pattern = patternId ? group.patterns.find(p => p.id === patternId) : group.patterns[0];
  if (!pattern) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm"
    >
      <p className="flex items-center gap-1.5 font-semibold text-primary mb-1">
        <BookOpen size={13} />
        Pattern Reminder
      </p>
      <div className="flex items-center gap-1.5 flex-wrap text-text">
        <code className="px-1.5 py-0.5 bg-primary/10 rounded text-primary font-mono text-xs">{pattern.trigger}</code>
        <ChevronRight size={12} className="text-text-muted" />
        <span className="text-text-muted text-xs">
          {pattern.correctForm === 'gerund'
            ? 'verb + -ing'
            : pattern.correctForm === 'infinitive'
            ? 'to + verb'
            : 'gerund OR infinitive (both OK)'}
        </span>
      </div>
      {/* Memory tricks removed - relying on pattern exposure instead */}
    </motion.div>
  );
}
