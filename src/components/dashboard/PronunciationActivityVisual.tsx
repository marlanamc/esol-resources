'use client';

import React from 'react';
import {
  getPronunciationActivityDescriptor,
  type PronunciationVisualMotif,
} from '@/lib/pronunciation-activity';

function VisualSvg({
  motif,
  color,
}: {
  motif: PronunciationVisualMotif;
  color: string;
}) {
  const soft = `${color}20`;
  const mid = `${color}4d`;

  return (
    <svg width="100%" height="56" viewBox="0 0 100 56" className="overflow-visible" aria-hidden="true">
      {motif === 'minimal-pairs' && (
        <>
          <circle cx="28" cy="26" r="9" fill={soft} stroke={color} strokeWidth="2" />
          <circle cx="72" cy="26" r="9" fill="white" stroke={color} strokeWidth="2" />
          <path d="M22 26c2-3 4-3 6 0s4 3 6 0" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M66 26c2 3 4 3 6 0s4-3 6 0" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M40 17c4-3 8-5 12-5s8 2 12 5" fill="none" stroke={mid} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
          <path d="M40 35c4 3 8 5 12 5s8-2 12-5" fill="none" stroke={mid} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
          <circle cx="50" cy="26" r="2.5" fill={color} />
        </>
      )}

      {motif === 'ed-sounds' && (
        <>
          <rect x="18" y="18" width="16" height="14" rx="4" fill={soft} stroke={color} strokeWidth="2" />
          <rect x="42" y="12" width="16" height="14" rx="4" fill="white" stroke={color} strokeWidth="2" />
          <rect x="66" y="18" width="16" height="14" rx="4" fill={soft} stroke={color} strokeWidth="2" />
          <text x="26" y="27" textAnchor="middle" fontSize="8" fontWeight="700" fill={color}>/t/</text>
          <text x="50" y="21" textAnchor="middle" fontSize="8" fontWeight="700" fill={color}>/d/</text>
          <text x="74" y="27" textAnchor="middle" fontSize="7.2" fontWeight="700" fill={color}>/id/</text>
          <path d="M28 38c8 4 16 4 24 0s16-4 24 0" fill="none" stroke={mid} strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}

      {motif === 'sentence-listening' && (
        <>
          <rect x="16" y="15" width="46" height="26" rx="8" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M24 23h30M24 29h24M24 35h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M70 18c5 2 5 10 0 12M79 14c8 4 8 16 0 20" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="68" cy="24" r="3" fill={color} />
        </>
      )}

      {motif === 'mixed-review' && (
        <>
          <circle cx="24" cy="26" r="7" fill={soft} stroke={color} strokeWidth="2" />
          <rect x="40" y="18" width="18" height="16" rx="5" fill="white" stroke={color} strokeWidth="2" />
          <path d="M68 20c4 2 4 10 0 12M76 16c7 4 7 18 0 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M31 26h6M51 36v6M20 15l5 5" stroke={mid} strokeWidth="2" strokeLinecap="round" />
          <circle cx="51" cy="26" r="2.5" fill={color} />
        </>
      )}

      {motif === 'pronunciation-wave' && (
        <>
          <circle cx="30" cy="28" r="5" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M39 22c5 2 5 10 0 12M48 18c8 4 8 16 0 20M59 14c11 7 11 25 0 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M64 28h12" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="79" cy="28" r="2.5" fill={color} />
        </>
      )}
    </svg>
  );
}

export function getPronunciationCardCopy(activityId: string, title: string, content?: string | null, ui?: string | null) {
  const descriptor = getPronunciationActivityDescriptor({ id: activityId, title, content, ui });
  return {
    friendlyTitle: descriptor.friendlyTitle,
    useThisFor: descriptor.useThisFor,
    pathChip: descriptor.pathChip,
  };
}

export function PronunciationActivityVisual({
  activityId,
  title,
  content,
  ui,
}: {
  activityId: string;
  title: string;
  content?: string | null;
  ui?: string | null;
}) {
  const spec = getPronunciationActivityDescriptor({ id: activityId, title, content, ui });
  return <VisualSvg motif={spec.motif} color={spec.color} />;
}
