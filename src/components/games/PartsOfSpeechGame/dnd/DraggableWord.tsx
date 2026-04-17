'use client';

import { forwardRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export interface DraggableWordProps {
  id: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** Optional label for assistive tech. */
  ariaLabel?: string;
}

/**
 * A word/tile that can be dragged via pointer, touch, or keyboard.
 *
 * Visual state for the active tile is handled via `data-dragging` attribute.
 */
export const DraggableWord = forwardRef<HTMLButtonElement, DraggableWordProps>(function DraggableWord(
  { id, disabled, className, style, children, ariaLabel },
  ref,
) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });

  const mergedStyle: CSSProperties = {
    ...style,
    transform: CSS.Translate.toString(transform),
    touchAction: 'manipulation',
  };

  return (
    <button
      type="button"
      ref={(node) => {
        setNodeRef(node);
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }}
      aria-label={ariaLabel ?? (typeof children === 'string' ? children : undefined)}
      data-dragging={isDragging ? 'true' : 'false'}
      disabled={disabled}
      style={mergedStyle}
      className={className}
      {...listeners}
      {...attributes}
    >
      {children}
    </button>
  );
});
