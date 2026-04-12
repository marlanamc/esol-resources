'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface GIBigPictureCalloutProps {
  text: string;
}

/**
 * Plain-English "why this pattern exists" — optional per group; split on newlines for short paragraphs.
 */
export function GIBigPictureCallout({ text }: GIBigPictureCalloutProps) {
  const lines = text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.02 }}
      className="p-4 rounded-2xl border border-border bg-white/90 dark:bg-[#1a2435]/90 shadow-sm"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2 mb-2">
        <MessageCircle size={14} className="text-primary flex-shrink-0" aria-hidden />
        Why this matters
      </p>
      <div className="space-y-2">
        {lines.map((line, i) => (
          <p key={i} className="text-sm text-text leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}
