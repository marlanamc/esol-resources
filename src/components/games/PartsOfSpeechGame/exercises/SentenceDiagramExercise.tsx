'use client';

import { memo, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { POSExercise, GrammaticalRole } from '@/types/parts-of-speech';
import { SpeakButton } from '../SpeakButton';

interface Props {
  exercise: POSExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

const ROLE_LABELS: Record<GrammaticalRole, string> = {
  'subject':         'Subject',
  'verb':            'Verb',
  'direct-object':   'Direct Object',
  'indirect-object': 'Indirect Object',
  'modifier':        'Modifier',
  'complement':      'Complement',
  'connector':       'Connector',
};

const ROLE_COLORS: Record<GrammaticalRole, string> = {
  'subject':         'bg-green-100 text-green-800 border-green-300',
  'verb':            'bg-red-100 text-red-800 border-red-300',
  'direct-object':   'bg-blue-100 text-blue-800 border-blue-300',
  'indirect-object': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'modifier':        'bg-amber-100 text-amber-800 border-amber-300',
  'complement':      'bg-teal-100 text-teal-800 border-teal-300',
  'connector':       'bg-orange-100 text-orange-800 border-orange-300',
};

interface Assignment {
  role: GrammaticalRole;
}

export const SentenceDiagramExercise = memo(function SentenceDiagramExercise({ exercise, onAnswer }: Props) {
  const data = exercise.diagramData;
  const [activeChunkId, setActiveChunkId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Record<string, Assignment | undefined>>({});
  const [submitted, setSubmitted] = useState(false);

  const targetChunks = useMemo(() => (data?.chunks ?? []).filter(c => c.isTarget), [data]);
  const allAssigned = targetChunks.length > 0 && targetChunks.every(c => assignments[c.id]);

  if (!data) return null;

  const handleChunkTap = (chunkId: string) => {
    if (submitted) return;
    const chunk = data.chunks.find(c => c.id === chunkId);
    if (!chunk || !chunk.isTarget) return;
    setActiveChunkId(prev => (prev === chunkId ? null : chunkId));
  };

  const handleRolePick = (role: GrammaticalRole) => {
    if (!activeChunkId || submitted) return;
    setAssignments(prev => ({ ...prev, [activeChunkId]: { role } }));
    // Move focus to next unassigned target.
    const currentIdx = targetChunks.findIndex(c => c.id === activeChunkId);
    const nextUnassigned = targetChunks
      .slice(currentIdx + 1)
      .concat(targetChunks.slice(0, currentIdx))
      .find(c => !assignments[c.id]);
    setActiveChunkId(nextUnassigned?.id ?? null);
  };

  const handleSubmit = () => {
    if (submitted || !allAssigned) return;
    setSubmitted(true);
    const correctCount = targetChunks.reduce((acc, c) => {
      const assigned = assignments[c.id];
      return acc + (assigned && assigned.role === c.correctRole ? 1 : 0);
    }, 0);
    const pass = correctCount / targetChunks.length >= 0.8;
    onAnswer(pass);
  };

  const getChunkStyle = (chunkId: string, isTarget: boolean, correctRole: GrammaticalRole | null) => {
    if (!isTarget) return 'text-text';
    const assigned = assignments[chunkId];
    const isActive = activeChunkId === chunkId;
    if (submitted && assigned) {
      const correct = assigned.role === correctRole;
      return correct
        ? 'bg-secondary/15 border-secondary text-secondary-dark'
        : 'bg-error/10 border-error text-error';
    }
    if (assigned) return `border-primary/60 ${ROLE_COLORS[assigned.role]}`;
    if (isActive) return 'border-primary bg-primary/10 text-primary ring-2 ring-primary/30';
    return 'border-dashed border-border bg-white dark:bg-[#162b3d] text-text hover:border-primary/40';
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-2">
        <p className="text-sm text-text-muted text-center">Tap each underlined chunk, then pick its role.</p>
        <SpeakButton text={data.sentence} size="sm" />
      </div>

      {/* Sentence */}
      <div className="rounded-2xl border-2 border-border bg-white dark:bg-[#162b3d] p-4 sm:p-6">
        <div className="flex flex-wrap gap-x-2 gap-y-3 justify-center text-lg sm:text-xl font-display leading-relaxed">
          {data.chunks.map(chunk => {
            if (!chunk.isTarget) {
              return (
                <span key={chunk.id} className="text-text">
                  {chunk.text}
                </span>
              );
            }
            const assigned = assignments[chunk.id];
            return (
              <div key={chunk.id} className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleChunkTap(chunk.id)}
                  disabled={submitted}
                  className={`px-2.5 py-1 rounded-lg border-2 font-semibold transition-all ${getChunkStyle(chunk.id, chunk.isTarget, chunk.correctRole)}`}
                >
                  {chunk.text}
                </button>
                <AnimatePresence>
                  {assigned && (
                    <motion.span
                      key={assigned.role}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${ROLE_COLORS[assigned.role]}`}
                    >
                      {ROLE_LABELS[assigned.role]}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role picker */}
      {!submitted && (
        <div className="space-y-2">
          <p className="text-xs text-text-muted text-center">
            {activeChunkId
              ? 'Choose the role for the selected chunk:'
              : allAssigned
              ? 'All chunks labeled — press Check to submit.'
              : 'Tap a chunk above to label it.'}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {data.roles.map(role => {
              const disabled = !activeChunkId;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRolePick(role)}
                  disabled={disabled}
                  className={`px-3 py-1.5 rounded-full border-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    disabled ? 'opacity-40 cursor-not-allowed border-border bg-bg-gray text-text-muted' : ROLE_COLORS[role]
                  }`}
                >
                  {ROLE_LABELS[role]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!submitted && allAssigned && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
        >
          Check Labels
        </motion.button>
      )}
    </div>
  );
});
