'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MousePointer2, Info } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
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
                <h2 className="text-2xl font-bold font-display text-text">How to Play</h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Rule 1: Elements */}
                <div>
                  <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
                    Understand the Tools
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 p-3 rounded-xl bg-surface-elevated border border-border">
                      <div className="w-12 h-12 flex-shrink-0 bg-white rounded-lg border border-border flex items-center justify-center">
                        <svg viewBox="0 0 40 30" className="w-10 h-8">
                          <circle cx={20} cy={15} r={6} fill="#3b82f6" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text">Moment (Dot)</p>
                        <p className="text-xs text-text-muted mt-0.5">A sudden or finished action (e.g. "I moved to Revere")</p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-3 rounded-xl bg-surface-elevated border border-border">
                      <div className="w-12 h-12 flex-shrink-0 bg-white rounded-lg border border-border flex items-center justify-center">
                        <svg viewBox="0 0 40 30" className="w-10 h-8">
                          <circle cx={8} cy={15} r={4} fill="#3b82f6" />
                          <circle cx={20} cy={15} r={4} fill="#3b82f6" />
                          <circle cx={32} cy={15} r={4} fill="#3b82f6" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text">Habit/Fact (Dots)</p>
                        <p className="text-xs text-text-muted mt-0.5">Repeated actions or general states (e.g. "I work every day")</p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-3 rounded-xl bg-surface-elevated border border-border">
                      <div className="w-12 h-12 flex-shrink-0 bg-white rounded-lg border border-border flex items-center justify-center">
                        <svg viewBox="0 0 40 30" className="w-10 h-8">
                          <path d="M 8 15 L 32 15" stroke="#3b82f6" strokeWidth={5} strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text">Duration (Line)</p>
                        <p className="text-xs text-text-muted mt-0.5">Something in progress (e.g. "I was living in Chelsea")</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rule 2: Connections */}
                <div>
                  <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
                    Master the Links
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 p-3 rounded-xl bg-surface-elevated border border-border">
                      <div className="w-12 h-12 flex-shrink-0 bg-white rounded-lg border border-border flex items-center justify-center">
                        <svg viewBox="0 0 40 30" className="w-10 h-8">
                          <path d="M 8 15 Q 20 3 32 15" fill="none" stroke="#3b82f6" strokeWidth={3} strokeDasharray="4 3" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text">Link (Arc)</p>
                        <p className="text-xs text-text-muted mt-0.5">Shows how two moments relate (e.g. "I finished *before* you arrived")</p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-3 rounded-xl bg-surface-elevated border border-border">
                      <div className="w-12 h-12 flex-shrink-0 bg-white rounded-lg border border-border flex items-center justify-center">
                        <svg viewBox="0 0 40 30" className="w-10 h-8">
                          <path d="M 5 15 Q 18 5 32 15" fill="none" stroke="#3b82f6" strokeWidth={4} strokeLinecap="round" strokeDasharray="5 4" />
                          <circle cx={5} cy={15} r={3} fill="#3b82f6" />
                          <circle cx={32} cy={15} r={3} fill="#3b82f6" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text">Ongoing Link</p>
                        <p className="text-xs text-text-muted mt-0.5">A duration that reaches another event or NOW (e.g. "I've been working")</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-4 bg-primary/5 rounded-2xl border border-primary/20 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <MousePointer2 className="text-primary" size={20} />
                </div>
                <div>
                  <p className="font-bold text-primary text-sm">Interaction Tip</p>
                  <p className="text-sm text-text-muted">Select a stamp from the toolkit, then tap a zone on the timeline to place it. Tap any placed stamp at the bottom of the screen to delete it.</p>
                </div>
              </div>
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
