'use client';

import React from 'react';

type PronunciationMotif = 'minimal-pairs' | 'ed-sounds' | 'pronunciation-wave';

function getPronunciationVisualSpec(activityId: string, title: string) {
  const haystack = `${activityId} ${title}`.toLowerCase();

  if (haystack.includes('minimal-pairs') || haystack.includes('minimal pairs')) {
    return { motif: 'minimal-pairs' as const, color: '#4f46e5' };
  }

  if (haystack.includes('ed-pronunciation') || haystack.includes('-ed') || haystack.includes('ed sounds')) {
    return { motif: 'ed-sounds' as const, color: '#ec4899' };
  }

  return { motif: 'pronunciation-wave' as const, color: '#f472b6' };
}

function VisualSvg({
  motif,
  color,
}: {
  motif: PronunciationMotif;
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

export function getPronunciationCardCopy(activityId: string, title: string) {
  const haystack = `${activityId} ${title}`.toLowerCase();

  if (haystack.includes('minimal-pairs') || haystack.includes('minimal pairs')) {
    return {
      friendlyTitle: 'Minimal pairs listening',
      useThisFor: 'hear the difference between similar English sounds',
    };
  }

  if (haystack.includes('ed-pronunciation') || haystack.includes('-ed') || haystack.includes('ed sounds')) {
    return {
      friendlyTitle: 'Past -ed endings',
      useThisFor: 'practice the /t/, /d/, and /id/ sound patterns clearly',
    };
  }

  return {
    friendlyTitle: 'Pronunciation practice',
    useThisFor: 'listen closely and produce clearer English sounds',
  };
}

export function PronunciationActivityVisual({
  activityId,
  title,
}: {
  activityId: string;
  title: string;
}) {
  const spec = getPronunciationVisualSpec(activityId, title);
  return <VisualSvg {...spec} />;
}
