'use client';

import { useCallback, useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  /** 'default' centers and scales in. 'sheet' slides up from the bottom on mobile, centers on sm+. */
  variant?: 'default' | 'sheet';
}

export function Dialog({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = 'max-w-2xl',
  variant = 'default',
}: DialogProps) {
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isSheet = variant === 'sheet';

  const handleEscape = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleEscape);
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.clearTimeout(t);
    };
  }, [isOpen, handleEscape]);

  const header = (
    <div className="flex items-center justify-between p-6 border-b border-border dark:border-white/10 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h2 id={titleId} className="text-xl font-bold font-display text-text truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-text-muted/60 font-medium mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <button
        ref={closeBtnRef}
        type="button"
        onClick={onClose}
        className="w-10 h-10 rounded-full hover:bg-surface-elevated flex items-center justify-center transition-colors text-text-muted hover:text-text shrink-0"
        aria-label="Close"
      >
        <X size={24} />
      </button>
    </div>
  );

  const body = (
    <div className="overflow-y-auto custom-scrollbar flex-1">
      {children}
    </div>
  );

  const footerEl = footer ? (
    <div className="p-6 bg-surface-elevated border-t border-border dark:border-white/10 text-center shrink-0">
      {footer}
    </div>
  ) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 ${isSheet ? 'z-[200]' : 'z-[99]'} bg-black/60 backdrop-blur-sm`}
            aria-hidden
          />

          {isSheet ? (
            <motion.div
              key="dialog-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed bottom-0 left-0 right-0 z-[201] sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:${maxWidth} sm:w-full`}
              onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
            >
              <div className="bg-white dark:bg-[var(--surface-base)] rounded-t-[2rem] sm:rounded-[2rem] border border-white/20 shadow-2xl max-h-[90vh] flex flex-col">
                {header}
                {body}
                {footerEl}
              </div>
            </motion.div>
          ) : (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
              <motion.div
                key="dialog-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`relative w-full ${maxWidth} pointer-events-auto`}
                onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
              >
                <div className="bg-white dark:bg-[var(--surface-base)] rounded-3xl shadow-2xl overflow-hidden border border-border dark:border-white/10">
                  {header}
                  <div className="overflow-y-auto custom-scrollbar max-h-[70vh]">
                    {children}
                  </div>
                  {footerEl}
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
