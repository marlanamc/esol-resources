'use client';

import { motion } from 'framer-motion';
import { History, CircleDot, FastForward, Shuffle, Check } from 'lucide-react';
import type { TimelineTimeFrame } from '@/types/activity';

interface TimeFrameFilterProps {
  selectedTimeFrame: TimelineTimeFrame | 'all';
  onSelectTimeFrame: (timeFrame: TimelineTimeFrame | 'all') => void;
}

const TIME_FRAME_OPTIONS: Array<{
  id: TimelineTimeFrame | 'all';
  label: string;
  icon: typeof History;
}> = [
  { id: 'all', label: 'All Times', icon: Shuffle },
  { id: 'past', label: 'Past', icon: History },
  { id: 'present', label: 'Present', icon: CircleDot },
  { id: 'future', label: 'Future', icon: FastForward },
];

export function TimeFrameFilter({
  selectedTimeFrame,
  onSelectTimeFrame,
}: TimeFrameFilterProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {TIME_FRAME_OPTIONS.map((option) => {
        const isSelected = selectedTimeFrame === option.id;
        const Icon = option.icon;

        return (
          <motion.button
            key={option.id}
            onClick={() => onSelectTimeFrame(option.id)}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            aria-pressed={isSelected}
            className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border-2 ${
              isSelected
                ? 'bg-secondary text-white border-secondary-dark shadow-[0_8px_16px_-4px_rgba(106,141,115,0.3)] pr-5'
                : 'bg-white/50 dark:bg-white/5 text-text-muted border-transparent hover:bg-white/80 dark:hover:bg-white/10 hover:text-text'
            }`}
          >
            <div className="relative">
              <Icon size={16} className={isSelected ? 'text-white' : 'text-text-muted/60 group-hover:text-primary'} />
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-white text-secondary rounded-full p-1 shadow-sm"
                >
                  <Check size={12} strokeWidth={4} />
                </motion.div>
              )}
            </div>
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
}
