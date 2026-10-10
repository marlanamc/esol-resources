"use client";

import { useEffect } from 'react';
import styles from './WordRescue.module.css';

/** Acknowledges saved credit; never awards points or interrupts the next word. */
export function WordRewardToast({ points, onComplete }: { points: number; onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return <div className={styles.wordRewardToast} role="status" aria-live="polite" aria-atomic="true">
    <strong>+{points} points</strong>
    <span>Word practiced!</span>
  </div>;
}
