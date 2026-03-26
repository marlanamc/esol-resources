'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import type {
  SentenceToTimelineQuestion,
  TimelineElement,
  TimelineElementType,
  TimelineZone,
} from '@/types/activity';
import { TimelineCanvas } from '../TimelineCanvas';
import { StampToolkit } from '../StampToolkit';
import { FeedbackPanel } from '../FeedbackPanel';
import { useTimelineAudio } from '../hooks/useTimelineAudio';
import type { TimelineDrawingAnswer } from '../hooks/useTimelineTensesState';
import { elementsUseSplitPast, validateTimelineDrawingElements } from '../timelineTensesUtils';

interface SentenceToTimelineExerciseProps {
  question: SentenceToTimelineQuestion;
  onSubmit: (answer: TimelineDrawingAnswer, isCorrect: boolean, tenseName?: string) => void;
  onNext: () => void;
  showFeedback: boolean;
  lastAnswerCorrect: boolean | null;
}

interface PlacedStamp {
  id: string;
  type: TimelineElementType;
  zone: TimelineZone;
  position: number;
}

const autoLayoutStamps = (stamps: PlacedStamp[]): PlacedStamp[] => {
  return stamps.map((stamp) => {
    const isDuration = stamp.type === 'solid-line' || stamp.type === 'dashed-line';
    if (isDuration) {
      return { ...stamp, position: 50 };
    }
    
    const punctualsInZone = stamps.filter(s => s.zone === stamp.zone && s.type !== 'solid-line' && s.type !== 'dashed-line');
    const pIndex = punctualsInZone.findIndex(s => s.id === stamp.id);
    const pCount = punctualsInZone.length;
    
    // Check if there is a duration in this zone serving as the background
    const hasDurationInZone = stamps.some(s => s.zone === stamp.zone && (s.type === 'solid-line' || s.type === 'dashed-line'));
    
    let position = 50;
    if (pCount === 1) {
      // If there's a duration, an interrupting dot looks best placed near the end of the duration
      position = hasDurationInZone ? 68 : 50;
    } else if (pCount === 2) {
      position = pIndex === 0 ? 32 : 68;
    } else if (pCount === 3) {
      position = pIndex === 0 ? 20 : pIndex === 1 ? 50 : 80;
    } else if (pCount > 3) {
      position = 10 + (80 / (pCount - 1)) * pIndex;
    }

    return { ...stamp, position };
  });
};

export function SentenceToTimelineExercise({
  question,
  onSubmit,
  onNext,
  showFeedback,
  lastAnswerCorrect,
}: SentenceToTimelineExerciseProps) {
  const [selectedStamp, setSelectedStamp] = useState<TimelineElementType | null>(null);
  const [placedStamps, setPlacedStamps] = useState<PlacedStamp[]>([]);
  const [highlightZone, setHighlightZone] = useState<TimelineZone | null>(null);
  const [showHint, setShowHint] = useState(false);
  const { playPing, playThump } = useTimelineAudio();

  const CONNECTION_STAMPS: TimelineElementType[] = ['arc', 'solid-to-now'];
  const useSplitPast =
    elementsUseSplitPast(question.correctElements) ||
    (selectedStamp !== null && CONNECTION_STAMPS.includes(selectedStamp)) ||
    placedStamps.some((s) => s.zone === 'past-earlier' || s.zone === 'past-later');

  // Generate hint based on correct elements
  const getHint = useCallback((): string => {
    const zones = [...new Set(question.correctElements.map((el) => el.zone))];
    const zoneNames: Record<TimelineZone, string> = {
      past: 'past',
      'past-earlier': 'earlier past (further from now)',
      'past-later': 'later past (closer to now)',
      present: 'present (now)',
      future: 'future',
    };
    const zoneList = zones.map((z) => zoneNames[z]).join(' and ');
    const elementCount = question.correctElements.length;

    if (elementCount === 1) {
      return `Place 1 element in the ${zoneList} zone.`;
    }
    if (zones.length === 1) {
      return `Place ${elementCount} elements in the ${zoneList} zone.`;
    }
    return `This tense uses ${elementCount} elements across the ${zoneList} zones.`;
  }, [question.correctElements]);

  // Handle placing a stamp on the timeline
  const handleTimelineClick = useCallback(
    (zone: TimelineZone) => {
      if (!selectedStamp) return;

      setPlacedStamps((prev) => {
        const newStamp: PlacedStamp = {
          id: `stamp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: selectedStamp,
          zone,
          position: 50,
        };

        return autoLayoutStamps([...prev, newStamp]);
      });
      setSelectedStamp(null);
      setHighlightZone(null);
    },
    [selectedStamp]
  );

  // Remove a placed stamp
  const handleRemoveStamp = useCallback((id: string) => {
    setPlacedStamps((prev) => autoLayoutStamps(prev.filter((s) => s.id !== id)));
  }, []);

  // Validate answer
  const validateAnswer = useCallback((): boolean => {
    return validateTimelineDrawingElements(question.correctElements, placedStamps);
  }, [placedStamps, question.correctElements]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    const isCorrect = validateAnswer();
    const elements: TimelineElement[] = placedStamps.map((s) => ({
      id: s.id,
      type: s.type,
      zone: s.zone,
      position: s.position,
    }));

    if (isCorrect) {
      playPing();
    } else {
      playThump();
    }
    onSubmit({ elements }, isCorrect, question.tenseName);
  }, [validateAnswer, placedStamps, onSubmit, question.tenseName, playPing, playThump]);

  // Convert placed stamps to timeline elements for display
  const displayElements: TimelineElement[] = placedStamps.map((s) => ({
    id: s.id,
    type: s.type,
    zone: s.zone,
    position: s.position,
  }));

  return (
    <div className="px-2 sm:px-0 max-w-full overflow-hidden">
      {/* Question card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-6 sm:p-10 mb-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 rounded-full bg-primary" />
            <div className="text-xs font-black text-primary uppercase tracking-[0.3em]">
              Timeline Sketching
            </div>
          </div>
          {/* Proactive stamp count indicator */}
          {question.correctElements.length > 1 && (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider"
            >
              {question.correctElements.length} stamps required
            </motion.div>
          )}
        </div>

        <div className="text-3xl sm:text-4xl font-display font-black text-text leading-[1.15] tracking-tight">
          "{question.sentence}"
        </div>
      </motion.div>

      {!showFeedback ? (
        <>
          {/* Interactive Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/60 dark:bg-[#162b3d]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 p-4 sm:p-10 mb-8 shadow-xl overflow-visible relative"
          >
            {/* Instruction with animated indicator */}
            <div className="text-xs font-black text-text-muted/40 uppercase tracking-[0.2em] mb-8 text-center flex items-center justify-center gap-3">
              {selectedStamp ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                  <span className="text-primary-dark">Tap the timeline to place your stamp</span>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted/20" />
                  <span>Choose a stamp from the toolkit below</span>
                </>
              )}
            </div>

            {/* Clickable zones */}
            <div className="relative group">
              <TimelineCanvas
                elements={displayElements}
                interactive={!!selectedStamp}
                highlightZone={highlightZone}
                pastTimelineLayout={useSplitPast ? 'split' : 'single'}
              />

              {/* Interaction Overlay Glow */}
              {selectedStamp && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-primary/20 bg-primary/2 animate-pulse" />
              )}

              {/* Click overlays */}
              {selectedStamp && (
                <div className="absolute inset-0 flex pointer-events-auto">
                  {useSplitPast ? (
                    <>
                      <button
                        style={{ flex: '0 0 23%' }}
                        className="rounded-l-[2rem] focus:outline-none transition-colors hover:bg-white/5"
                        onClick={() => handleTimelineClick('past-earlier')}
                        onMouseEnter={() => setHighlightZone('past-earlier')}
                        onMouseLeave={() => setHighlightZone(null)}
                      />
                      <button
                        style={{ flex: '0 0 19%' }}
                        className="focus:outline-none transition-colors hover:bg-white/5"
                        onClick={() => handleTimelineClick('past-later')}
                        onMouseEnter={() => setHighlightZone('past-later')}
                        onMouseLeave={() => setHighlightZone(null)}
                      />
                      <div style={{ flex: '0 0 4.5%' }} className="pointer-events-none" />
                    </>
                  ) : (
                    <button
                      style={{ flex: '0 0 46.5%' }}
                      className="rounded-l-[2rem] focus:outline-none transition-colors hover:bg-white/5"
                      onClick={() => handleTimelineClick('past')}
                      onMouseEnter={() => setHighlightZone('past')}
                      onMouseLeave={() => setHighlightZone(null)}
                    />
                  )}

                  <button
                    style={{ flex: '0 0 7%' }}
                    className="focus:outline-none transition-colors hover:bg-white/5"
                    onClick={() => handleTimelineClick('present')}
                    onMouseEnter={() => setHighlightZone('present')}
                    onMouseLeave={() => setHighlightZone(null)}
                  />
                  <button
                    style={{ flex: '0 0 46.5%' }}
                    className="rounded-r-[2rem] focus:outline-none transition-colors hover:bg-white/5"
                    onClick={() => handleTimelineClick('future')}
                    onMouseEnter={() => setHighlightZone('future')}
                    onMouseLeave={() => setHighlightZone(null)}
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Stamp Toolkit */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <StampToolkit
              selectedStamp={selectedStamp}
              onSelectStamp={setSelectedStamp}
              placedStamps={placedStamps}
              onRemoveStamp={handleRemoveStamp}
            />
          </motion.div>

          {/* Hint section */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-8"
              >
                <div className="p-6 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Lightbulb className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-amber-600/60 uppercase tracking-widest mb-1">Teaching Tip</div>
                    <p className="text-text font-medium leading-relaxed">
                      {getHint()}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit and hint buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-4 sm:p-6 shadow-lg"
          >
            <div className="flex flex-col items-stretch gap-3">
            <button
              onClick={handleSubmit}
              disabled={placedStamps.length === 0}
              className="w-full py-4 sm:py-5 px-6 sm:px-10 bg-primary text-white rounded-2xl font-black text-lg sm:text-xl shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] hover:shadow-[0_20px_32px_-12px_rgba(var(--primary-color-rgb),0.6)] hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden"
            >
              Check Answer
            </button>
            {!showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="w-full px-5 sm:px-6 py-3 sm:py-4 text-sm font-black text-text-muted/70 hover:text-primary uppercase tracking-[0.18em] border border-border/40 hover:border-primary/30 bg-white/40 dark:bg-[#162b3d]/40 hover:bg-primary/5 rounded-2xl flex items-center justify-center gap-2 transition-all"
              >
                <Lightbulb size={18} />
                Need a Hint?
              </button>
            )}
            </div>
          </motion.div>
        </>
      ) : (
        /* Feedback */
        <div className="space-y-8">
          {!lastAnswerCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 dark:bg-[#162b3d]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 p-6 sm:p-10 shadow-xl overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
              
              <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Correct Mapping
              </div>
              
              <div className="opacity-90 scale-95 origin-top filter drop-shadow-lg">
                <TimelineCanvas
                  elements={question.correctElements}
                  interactive={false}
                  showLabels={true}
                  pastTimelineLayout={question.correctElements.some(el => el.zone.startsWith('past-')) ? 'split' : 'single'}
                />
              </div>
              
              <div className="mt-8 pt-6 border-t border-emerald-500/10 text-center">
                <p className="text-sm font-bold text-text-muted/60">Study how the stamps correspond to the tense.</p>
              </div>
            </motion.div>
          )}

          <FeedbackPanel
            isCorrect={lastAnswerCorrect ?? false}
            tenseName={question.tenseName}
            explanation={question.explanation}
            onContinue={onNext}
          />
        </div>
      )}
    </div>
  );
}
