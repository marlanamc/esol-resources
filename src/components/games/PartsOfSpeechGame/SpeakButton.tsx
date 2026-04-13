'use client';

import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTTS } from '@/hooks/useTTS';

interface SpeakButtonProps {
  text: string;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Tap to hear the sentence read aloud via ElevenLabs TTS.
 * Audio is cached per session — second tap is instant.
 * Degrades silently on error (icon grays out, no crash).
 */
export function SpeakButton({ text, size = 'sm', className = '' }: SpeakButtonProps) {
  const { speak, cancel, state } = useTTS();

  const isPlaying = state === 'playing';
  const isLoading = state === 'loading';
  const isError = state === 'error';

  const dim = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 14 : 18;

  const handleClick = () => {
    if (isPlaying) {
      cancel();
    } else {
      speak(text);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.92 }}
      title={isPlaying ? 'Stop' : 'Listen'}
      aria-label={isPlaying ? 'Stop audio' : `Listen: ${text}`}
      className={`
        flex-shrink-0 inline-flex items-center justify-center rounded-full border transition-all duration-200
        ${dim}
        ${isError
          ? 'border-border bg-surface text-text-muted/40 cursor-default'
          : isPlaying
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-white dark:bg-[#162b3d] text-text-muted hover:border-primary/50 hover:text-primary cursor-pointer'
        }
        ${className}
      `}
    >
      {isLoading ? (
        <Loader2 size={iconSize} className="animate-spin text-primary" />
      ) : isPlaying ? (
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          <VolumeX size={iconSize} />
        </motion.span>
      ) : (
        <Volume2 size={iconSize} />
      )}
    </motion.button>
  );
}
