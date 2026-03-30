'use client';

import { Info } from 'lucide-react';

interface InlineInfoTooltipProps {
  text: string;
  className?: string;
}

export function InlineInfoTooltip({ text, className = '' }: InlineInfoTooltipProps) {
  return (
    <div className={`mt-3 flex justify-end ${className}`}>
      <div className="group relative inline-flex">
        <button
          type="button"
          aria-label={text}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/40 bg-white/40 text-text-muted/55 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-[#162b3d]/40"
        >
          <Info size={14} />
        </button>
        <div className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-52 sm:w-60 rounded-2xl border border-white/15 bg-slate-950/95 px-2.5 py-2 text-[10px] sm:text-[11px] font-medium leading-relaxed text-white opacity-0 shadow-2xl transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          {text}
        </div>
      </div>
    </div>
  );
}
