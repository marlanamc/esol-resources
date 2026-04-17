'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  type Announcements,
  type ScreenReaderInstructions,
} from '@dnd-kit/core';

interface PosDndContextValue {
  activeDragId: string | null;
}

const PosDndCtx = createContext<PosDndContextValue>({ activeDragId: null });

export function usePosDnd(): PosDndContextValue {
  return useContext(PosDndCtx);
}

export interface PosDndProviderProps {
  onDragEnd: (event: DragEndEvent) => void;
  onDragStart?: (event: DragStartEvent) => void;
  /** Preview rendered in a portal while dragging. Receives the active id. */
  renderOverlay?: (activeId: string) => ReactNode;
  /** Optional announcements override. */
  announcements?: Announcements;
  /** Optional screen-reader instructions. */
  instructions?: ScreenReaderInstructions;
}

const defaultInstructions: ScreenReaderInstructions = {
  draggable:
    'To pick up a word, press space or enter. While dragging, use the arrow keys to move. Press space or enter again to drop, or escape to cancel.',
};

/**
 * Shared DnD provider configured with Pointer + Touch + Keyboard sensors.
 * A small activation distance prevents accidental drags when tapping.
 */
export function PosDndProvider({
  children,
  onDragEnd,
  onDragStart,
  renderOverlay,
  announcements,
  instructions = defaultInstructions,
}: PropsWithChildren<PosDndProviderProps>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveId(String(event.active.id));
      onDragStart?.(event);
    },
    [onDragStart],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      onDragEnd(event);
    },
    [onDragEnd],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const value = useMemo(() => ({ activeDragId: activeId }), [activeId]);

  return (
    <PosDndCtx.Provider value={value}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        accessibility={{ announcements, screenReaderInstructions: instructions }}
      >
        {children}
        <DragOverlay dropAnimation={null}>
          {activeId && renderOverlay ? renderOverlay(activeId) : null}
        </DragOverlay>
      </DndContext>
    </PosDndCtx.Provider>
  );
}
