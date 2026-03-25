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
import { validateTimelineDrawingElements } from '../timelineTensesUtils';

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

  // Only show split past (EARLIER / LATER) for connection stamps that need the distinction
  const CONNECTION_STAMPS: TimelineElementType[] = ['arc', 'solid-to-now'];
  const useSplitPast = selectedStamp !== null && CONNECTION_STAMPS.includes(selectedStamp);

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
        const sameZoneCount = prev.filter((s) => s.zone === zone).length;
        // Spread stamps horizontally so arcs / duration stamps can resolve a
        // distinct reference Moment (earlier left, later right on the timeline).
        const positionSlots = [32, 68, 50, 20, 84];
        const position = positionSlots[sameZoneCount] ?? 50;

        const newStamp: PlacedStamp = {
          id: `stamp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: selectedStamp,
          zone,
          position,
        };

        return [...prev, newStamp];
      });
      setSelectedStamp(null);
      setHighlightZone(null);
    },
    [selectedStamp]
  );

  // Remove a placed stamp
  const handleRemoveStamp = useCallback((id: string) => {
    setPlacedStamps((prev) => prev.filter((s) => s.id !== id));
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
    <div className="px-4 sm:px-0">
      {/* Question card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-primary uppercase tracking-wide">
            Draw the Timeline
          </div>
          {/* Proactive stamp count indicator for multi-element questions */}
          {question.correctElements.length > 1 && (
            <div className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-full">
              {question.correctElements.length} stamps needed
            </div>
          )}
        </div>
        <div className="text-2xl sm:text-3xl font-display font-bold text-text leading-relaxed">
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
            className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-6 mb-6"
          >
            {/* Instruction with animated indicator when stamp selected */}
            <div className="text-sm font-semibold text-text-muted mb-4 text-center flex items-center justify-center gap-2">
              {selectedStamp ? (
                <>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block w-2 h-2 rounded-full bg-primary"
                  />
                  <span className="text-primary">Tap a zone below to place your stamp</span>
                </>
              ) : (
                'Select a stamp, then tap a zone'
              )}
            </div>

            {/* Clickable zones */}
            <div className="relative">
              <TimelineCanvas
                elements={displayElements}
                interactive={!!selectedStamp}
                highlightZone={highlightZone}
                pastTimelineLayout={useSplitPast ? 'split' : 'single'}
              />

              {/* Click overlays — invisible hitboxes aligned over the SVG */}
              {selectedStamp && (
                <div className="absolute inset-0 flex pointer-events-auto">
                  {useSplitPast ? (
                    <>
                      <button
                        style={{ flex: '0 0 23%' }}
                        className="rounded-l-xl focus:outline-none min-w-0"
                        onClick={() => handleTimelineClick('past-earlier')}
                        onMouseEnter={() => setHighlightZone('past-earlier')}
                        onMouseLeave={() => setHighlightZone(null)}
                        aria-label="Place in earlier past, not tied to now"
                      />
                      <button
                        style={{ flex: '0 0 19%' }}
                        className="focus:outline-none min-w-0"
                        onClick={() => handleTimelineClick('past-later')}
                        onMouseEnter={() => setHighlightZone('past-later')}
                        onMouseLeave={() => setHighlightZone(null)}
                        aria-label="Place in later past, closer to now"
                      />
                      {/* Gap for split past */}
                      <div
                        className="pointer-events-none"
                        style={{ flex: '0 0 4.5%' }}
                        aria-hidden
                      />
                    </>
                  ) : (
                    <button
                      style={{ flex: '0 0 46.5%' }}
                      className="rounded-l-xl focus:outline-none min-w-0"
                      onClick={() => handleTimelineClick('past')}
                      onMouseEnter={() => setHighlightZone('past')}
                      onMouseLeave={() => setHighlightZone(null)}
                      aria-label="Place in past zone"
                    />
                  )}

                  <button
                    style={{ flex: '0 0 7%' }}
                    className="focus:outline-none"
                    onClick={() => handleTimelineClick('present')}
                    onMouseEnter={() => setHighlightZone('present')}
                    onMouseLeave={() => setHighlightZone(null)}
                    aria-label="Place at present"
                  />
                  <button
                    style={{ flex: '0 0 46.5%' }}
                    className="rounded-r-xl focus:outline-none"
                    onClick={() => handleTimelineClick('future')}
                    onMouseEnter={() => setHighlightZone('future')}
                    onMouseLeave={() => setHighlightZone(null)}
                    aria-label="Place in future zone"
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Stamp Toolkit */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-6 mb-6"
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
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Lightbulb size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                        Hint
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        {getHint()}
                      </p>
                    </div>
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
            className="space-y-3"
          >
            <button
              onClick={handleSubmit}
              disabled={placedStamps.length === 0}
              className="w-full py-4 px-6 bg-primary text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
            >
              Check Answer
            </button>
            {!showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="w-full py-3 px-4 text-sm text-text-muted hover:text-text flex items-center justify-center gap-2 transition-colors"
              >
                <Lightbulb size={16} />
                Need a hint?
              </button>
            )}
          </motion.div>
        </>
      ) : (
        /* Feedback */
        <div className="space-y-6">
          {!lastAnswerCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-5"
            >
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Correct Answer Diagram
              </div>
              <div className="opacity-80 scale-90 origin-top">
                <TimelineCanvas
                  elements={question.correctElements}
                  interactive={false}
                  showLabels={true}
                  pastTimelineLayout={question.correctElements.some(el => el.zone.startsWith('past-')) ? 'split' : 'single'}
                />
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
