'use client';

import { useMemo, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';
import type { DragEndEvent } from '@dnd-kit/core';
import { POS_LABELS, POS_COLORS } from '@/types/parts-of-speech';
import type { POSExercise, PartOfSpeech, PhotoSortItem } from '@/types/parts-of-speech';
import { SpeakButton } from '../SpeakButton';
import { PosDndProvider, DraggableWord, DroppableSlot, useDragFeedback } from '../dnd';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

const TRAY_ID = '__tray__';

/**
 * Photo Sort as drag-and-drop: four photos start in a tray; students drag each
 * one into the POS bin matching its word. Bins are derived from the unique POS
 * values present in the item set.
 */
export const PhotoSortExercise = memo(function PhotoSortExercise({ exercise, onAnswer, answered }: Props) {
  const data = exercise.photoSortData;
  const playFeedback = useDragFeedback();

  const bins: PartOfSpeech[] = useMemo(() => {
    if (!data) return [];
    const unique = new Set<PartOfSpeech>();
    for (const item of data.items) unique.add(item.partOfSpeech);
    // Put target first, then others in a stable order.
    const order: PartOfSpeech[] = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'article'];
    const list: PartOfSpeech[] = [];
    if (unique.has(data.targetPOS)) list.push(data.targetPOS);
    for (const pos of order) {
      if (pos !== data.targetPOS && unique.has(pos)) list.push(pos);
    }
    return list;
  }, [data]);

  const [placement, setPlacement] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    if (data) for (const item of data.items) m[item.id] = TRAY_ID;
    return m;
  });
  const [submitted, setSubmitted] = useState(false);

  if (!data) return null;
  const { items, targetPOS } = data;

  const tray = items.filter(i => placement[i.id] === TRAY_ID);
  const allPlaced = tray.length === 0;

  const handleDragEnd = (event: DragEndEvent) => {
    if (submitted || answered) return;
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;
    if (!overId) return;
    if (overId === TRAY_ID) {
      setPlacement(prev => ({ ...prev, [activeId]: TRAY_ID }));
      playFeedback('drop');
      return;
    }
    if (bins.includes(overId as PartOfSpeech)) {
      setPlacement(prev => ({ ...prev, [activeId]: overId }));
      playFeedback('drop');
    }
  };

  const handleSubmit = () => {
    if (submitted || !allPlaced) return;
    setSubmitted(true);
    const correctCount = items.reduce((acc, item) => acc + (placement[item.id] === item.partOfSpeech ? 1 : 0), 0);
    const pass = correctCount === items.length;
    playFeedback(pass ? 'correct' : 'wrong');
    onAnswer(pass);
  };

  const renderPhotoCard = (item: PhotoSortItem, size: 'md' | 'sm') => {
    const dims = size === 'md' ? 'w-28 h-28 sm:w-32 sm:h-32' : 'w-20 h-20';
    const posCorrect = submitted && placement[item.id] === item.partOfSpeech;
    const posWrong = submitted && placement[item.id] !== item.partOfSpeech;

    return (
      <div className={`relative ${dims} rounded-2xl overflow-hidden border-2 shadow-sm ${
        submitted
          ? posCorrect
            ? 'border-secondary ring-2 ring-secondary/40'
            : posWrong
            ? 'border-error ring-2 ring-error/40'
            : 'border-border'
          : 'border-border'
      }`}>
        <Image
          src={item.imageUrl}
          alt={item.altText}
          fill
          className="object-cover pointer-events-none"
          sizes="(max-width: 640px) 30vw, 128px"
          unoptimized
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-6 pb-1.5 px-2">
          <p className="text-[11px] font-bold text-white leading-tight truncate">{item.word}</p>
        </div>
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1.5 left-1.5"
            >
              {posCorrect ? (
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-md">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
              ) : posWrong ? (
                <div className="w-6 h-6 rounded-full bg-error flex items-center justify-center shadow-md">
                  <XCircle size={14} className="text-white" />
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <PosDndProvider
      onDragEnd={handleDragEnd}
      onDragStart={() => playFeedback('pick')}
      renderOverlay={(id) => {
        const item = items.find(i => i.id === id);
        if (!item) return null;
        return <div className="opacity-95 rotate-1">{renderPhotoCard(item, 'md')}</div>;
      }}
    >
      <div className="space-y-5">
        <div className="text-center space-y-1">
          <p className="font-display text-sm text-text-muted uppercase tracking-wider">
            Drag each photo to the matching part of speech
          </p>
          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border-2 ${POS_COLORS[targetPOS]}`}>
            Target: {POS_LABELS[targetPOS]}
          </span>
        </div>

        {/* Tray */}
        <DroppableSlot
          id={TRAY_ID}
          ariaLabel="Photo tray"
          className="flex flex-wrap gap-3 justify-center min-h-[140px] p-4 bg-bg-gray/40 rounded-2xl border-2 border-dashed border-border/60 transition-colors"
          activeClassName="!border-primary/60 !bg-primary/5"
        >
          {tray.length > 0 ? (
            tray.map(item => (
              <div key={item.id} className="flex flex-col items-center gap-1.5 relative">
                <DraggableWord
                  id={item.id}
                  disabled={submitted}
                  className="p-0 bg-transparent border-0 cursor-grab active:cursor-grabbing data-[dragging=true]:opacity-30"
                  ariaLabel={`${item.word}, a ${POS_LABELS[item.partOfSpeech]}. Drag into a bin.`}
                >
                  {renderPhotoCard(item, 'md')}
                </DraggableWord>
                <div className="absolute -top-1 -right-1 z-10" onClick={e => e.stopPropagation()}>
                  <SpeakButton text={item.word} size="sm" />
                </div>
              </div>
            ))
          ) : (
            <p className="text-primary font-bold text-sm flex items-center gap-2 self-center">
              ✓ Ready to check!
            </p>
          )}
        </DroppableSlot>

        {/* Bins */}
        <div className={`grid gap-3 ${bins.length === 2 ? 'grid-cols-2' : bins.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
          {bins.map(bin => {
            const placedItems = items.filter(i => placement[i.id] === bin);
            const isTarget = bin === targetPOS;
            return (
              <div key={bin} className="space-y-1.5">
                <h3 className={`text-center text-[11px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg border ${POS_COLORS[bin]} ${isTarget ? 'ring-2 ring-offset-1 ring-primary/40' : ''}`}>
                  {POS_LABELS[bin]}
                </h3>
                <DroppableSlot
                  id={bin}
                  ariaLabel={`${POS_LABELS[bin]} bin`}
                  className="min-h-[96px] p-2 rounded-xl border-2 border-dashed flex flex-wrap gap-1.5 content-start bg-white dark:bg-[#162b3d]/30 border-border transition-colors"
                  activeClassName="!border-primary !bg-primary/5 ring-4 ring-primary/10"
                >
                  {placedItems.map(item => (
                    <motion.div key={item.id} layoutId={item.id}>
                      {submitted ? (
                        renderPhotoCard(item, 'sm')
                      ) : (
                        <DraggableWord
                          id={item.id}
                          className="p-0 bg-transparent border-0 data-[dragging=true]:opacity-30"
                          ariaLabel={`${item.word}, placed in ${POS_LABELS[bin]}. Drag to move.`}
                        >
                          {renderPhotoCard(item, 'sm')}
                        </DraggableWord>
                      )}
                    </motion.div>
                  ))}
                  {placedItems.length === 0 && !submitted && (
                    <div className="flex items-center justify-center w-full text-[10px] font-bold uppercase tracking-tight text-text-muted/40 py-4 pointer-events-none">
                      Drop here
                    </div>
                  )}
                </DroppableSlot>
              </div>
            );
          })}
        </div>

        {!submitted && allPlaced && (
          <motion.button
            type="button"
            onClick={handleSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl font-semibold text-sm bg-primary text-white shadow-sm hover:bg-primary-dark transition-colors"
          >
            Check my answer
          </motion.button>
        )}
      </div>
    </PosDndProvider>
  );
});
