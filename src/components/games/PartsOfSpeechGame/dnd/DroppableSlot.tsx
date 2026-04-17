'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

export interface DroppableSlotProps {
  id: string;
  disabled?: boolean;
  className?: string;
  activeClassName?: string;
  style?: CSSProperties;
  children: ReactNode;
  ariaLabel?: string;
}

/**
 * A region that accepts dropped DraggableWord items.
 *
 * `activeClassName` is applied when a drag is hovering over this slot, giving
 * callers a simple hook for visual hinting.
 */
export function DroppableSlot({
  id,
  disabled,
  className,
  activeClassName,
  style,
  children,
  ariaLabel,
}: DroppableSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled });

  return (
    <div
      ref={setNodeRef}
      aria-label={ariaLabel}
      data-over={isOver ? 'true' : 'false'}
      className={`${className ?? ''} ${isOver && activeClassName ? activeClassName : ''}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}
