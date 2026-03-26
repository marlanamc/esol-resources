'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MousePointer2, Info, Keyboard, Eye } from 'lucide-react';

type HowToPlayMode = 'build' | 'read' | 'overview';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: HowToPlayMode;
}

function BuildContent() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Column 1: Elements */}
        <div>
          <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
            Understand the Stamps
          </h3>
          <div className="space-y-3">
            <StampCard
              svg={<circle cx={20} cy={15} r={6} fill="#3b82f6" />}
              title="Moment (Dot)"
              desc='Tense clue: Simple in a time zone (Past Simple or Future Simple). Use one dot for one moment.'
            />
            <StampCard
              svg={
                <>
                  <circle cx={8} cy={15} r={4} fill="#3b82f6" />
                  <circle cx={20} cy={15} r={4} fill="#3b82f6" />
                  <circle cx={32} cy={15} r={4} fill="#3b82f6" />
                </>
              }
              title="Habit/Fact (Dots)"
              desc='Tense clue: Present Simple. Use multiple dots for habits, routines, or facts.'
            />
            <StampCard
              svg={
                <path d="M 8 15 L 32 15" stroke="#3b82f6" strokeWidth={5} strokeLinecap="round" strokeDasharray="8 6" />
              }
              title="Duration (Line)"
              desc='Tense clue: Continuous family. Use a duration line for actions in progress over time.'
            />
          </div>
        </div>

        {/* Column 2: Connections */}
        <div>
          <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
            Master the Links
          </h3>
          <div className="space-y-3">
            <StampCard
              svg={<path d="M 8 15 Q 20 3 32 15" fill="none" stroke="#3b82f6" strokeWidth={3} />}
              title="Link (Arc)"
              desc='Tense clue: Perfect family. Use an arc to show one event linked to another event or to NOW.'
            />
            <StampCard
              svg={
                <>
                  <path d="M 5 15 Q 18 5 32 15" fill="none" stroke="#3b82f6" strokeWidth={4} strokeLinecap="round" strokeDasharray="5 4" />
                  <circle cx={5} cy={15} r={3} fill="#3b82f6" />
                  <circle cx={32} cy={15} r={3} fill="#3b82f6" />
                </>
              }
              title="Ongoing Link"
              desc={'Tense clue: Perfect Continuous. Use a duration + link shape when an ongoing action reaches another event or NOW.'}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/20 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <MousePointer2 className="text-primary" size={20} />
        </div>
        <div>
          <p className="font-bold text-primary text-sm">How to Play</p>
          <p className="text-sm text-text-muted">Select a stamp from the toolkit, then tap a zone on the timeline to place it. Tap any placed stamp at the bottom of the screen to remove it.</p>
        </div>
      </div>

      <TenseCheatSheet className="mt-6" />
    </>
  );
}

function ReadContent() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Column 1: Reading shapes */}
        <div>
          <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
            Read the Shapes
          </h3>
          <div className="space-y-3">
            <StampCard
              svg={<circle cx={20} cy={15} r={6} fill="#f59e0b" />}
              title="Single Dot"
              desc='Simple clue: one moment in time (Past Simple or Future Simple, depending on zone).'
            />
            <StampCard
              svg={
                <>
                  <circle cx={8} cy={15} r={4} fill="#f59e0b" />
                  <circle cx={20} cy={15} r={4} fill="#f59e0b" />
                  <circle cx={32} cy={15} r={4} fill="#f59e0b" />
                </>
              }
              title="Multiple Dots"
              desc='Present Simple clue: habits, routines, and facts.'
            />
            <StampCard
              svg={
                <path d="M 8 15 L 32 15" stroke="#f59e0b" strokeWidth={5} strokeLinecap="round" strokeDasharray="8 6" />
              }
              title="Dashed Line"
              desc='Continuous clue: an action in progress over time.'
            />
          </div>
        </div>

        {/* Column 2: Connections & filling */}
        <div>
          <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
            Read the Connections
          </h3>
          <div className="space-y-3">
            <StampCard
              svg={
                <>
                  <circle cx={8} cy={15} r={4} fill="#f59e0b" />
                  <path d="M 8 15 Q 20 3 32 15" fill="none" stroke="#f59e0b" strokeWidth={3} />
                  <circle cx={32} cy={15} r={4} fill="#10b981" />
                </>
              }
              title="Link Arc"
              desc='Perfect clue: a linked action/result connected to another event or to NOW.'
            />
            <StampCard
              svg={
                <>
                  <circle cx={5} cy={15} r={3} fill="#f59e0b" />
                  <path d="M 5 15 Q 18 5 32 15" fill="none" stroke="#f59e0b" strokeWidth={4} strokeLinecap="round" strokeDasharray="5 4" />
                  <circle cx={32} cy={15} r={4} fill="#10b981" />
                </>
              }
              title="Ongoing Link"
              desc='Perfect Continuous clue: ongoing duration linked to another event or to NOW.'
            />
            <StampCard
              svg={
                <>
                  <circle cx={8} cy={15} r={4} fill="#f59e0b" />
                  <path d="M 8 15 Q 20 3 32 15" fill="none" stroke="#f59e0b" strokeWidth={3} />
                  <circle cx={32} cy={15} r={4} fill="#f59e0b" />
                </>
              }
              title="Arc between Events"
              desc='Perfect clue: one event linked to another event (e.g. Past Perfect with a past reference point).'
            />
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/20 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Keyboard className="text-primary" size={20} />
        </div>
        <div>
          <p className="font-bold text-primary text-sm">How to Play</p>
          <p className="text-sm text-text-muted">Study the shapes on the timeline and which zone they are in (Past, Now, or Future). Then type the correct verb form into each blank. Press <kbd className="px-1.5 py-0.5 rounded bg-border/40 text-xs font-mono">Enter</kbd> to move between blanks.</p>
        </div>
      </div>

      <TenseCheatSheet className="mt-6" />
    </>
  );
}

function StampCard({ svg, title, desc }: { svg: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-4 p-3 rounded-xl bg-surface-elevated border border-border">
      <div className="w-12 h-12 flex-shrink-0 bg-white dark:bg-slate-800 rounded-lg border border-border flex items-center justify-center">
        <svg viewBox="0 0 40 30" className="w-10 h-8">
          {svg}
        </svg>
      </div>
      <div>
        <p className="font-bold text-sm text-text">{title}</p>
        <p className="text-xs text-text-muted mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function TenseCheatSheet({ className = '' }: { className?: string }) {
  const rows = [
    { stamp: 'Dot / Moment', tense: 'Past Simple or Future Simple' },
    { stamp: 'Multiple Dots / Habit-Fact', tense: 'Present Simple' },
    { stamp: 'Duration Line (solid/dashed)', tense: 'Continuous Family' },
    { stamp: 'Link / Arc', tense: 'Perfect' },
    { stamp: 'Duration + Link (ongoing link)', tense: 'Perfect Continuous' },
  ];

  return (
    <div className={`rounded-2xl border border-primary/20 bg-primary/5 p-4 ${className}`}>
      <p className="text-sm font-bold text-primary mb-3">Stamp to Tense Cheat Sheet</p>
      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.stamp}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-lg bg-white/70 dark:bg-white/5 border border-border/60 px-3 py-2"
          >
            <span className="text-xs sm:text-sm font-bold text-text">{row.stamp}</span>
            <span className="text-xs sm:text-sm font-medium text-text-muted">{row.tense}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HowToPlayModal({ isOpen, onClose, mode = 'overview' }: HowToPlayModalProps) {
  const getTitle = () => {
    if (mode === 'build') return 'How to Build';
    if (mode === 'read') return 'How to Read';
    return 'How to Play';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#162b3d] rounded-3xl shadow-2xl overflow-hidden border border-border dark:border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Info className="text-primary" size={24} />
                </div>
                <h2 className="text-2xl font-bold font-display text-text">{getTitle()}</h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-surface-elevated flex items-center justify-center transition-colors text-text-muted hover:text-text"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              {mode === 'build' && <BuildContent />}
              {mode === 'read' && <ReadContent />}
              {mode === 'overview' && (
                <div className="space-y-10">
                  {/* Build section */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <MousePointer2 className="text-secondary" size={18} />
                      </div>
                      <h3 className="text-base font-bold text-text uppercase tracking-wide">Build the Timeline</h3>
                    </div>
                    <BuildContent />
                  </div>

                  <div className="border-t border-border dark:border-white/10" />

                  {/* Read section */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Eye className="text-primary" size={18} />
                      </div>
                      <h3 className="text-base font-bold text-text uppercase tracking-wide">Read the Timeline</h3>
                    </div>
                    <ReadContent />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-surface-elevated border-t border-border dark:border-white/10 text-center">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
