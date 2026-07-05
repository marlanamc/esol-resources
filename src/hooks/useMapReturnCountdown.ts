"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sanitizeInternalHref, RETURN_TO_QUERY_PARAM } from "@/lib/learner/navigation";
import { useCourseMapNextLaunch } from "@/hooks/useCourseMapNextLaunch";

const COUNTDOWN_SECONDS = 5;
const MAP_PATH = "/dashboard/map";

interface UseMapReturnCountdownOptions {
  /** Set to true when the activity is in a completed state and the countdown should start. */
  active: boolean;
}

interface UseMapReturnCountdownResult {
  /** Whether the countdown is running (returnTo points at the map). */
  isActive: boolean;
  /** Seconds remaining. */
  secondsLeft: number;
  /** The resolved return href (always set when isActive is true). */
  returnHref: string;
  /** Where the countdown will navigate when it finishes. */
  destinationHref: string;
  /** Human-readable destination label for UI copy. */
  destinationLabel: string;
  /** Cancel the countdown (e.g. when user clicks Play Again). */
  cancel: () => void;
  /** Navigate immediately without waiting for the countdown. */
  goNow: () => void;
}

export function useMapReturnCountdown({ active }: UseMapReturnCountdownOptions): UseMapReturnCountdownResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = sanitizeInternalHref(searchParams.get(RETURN_TO_QUERY_PARAM));
  const isMapReturn = Boolean(returnTo?.startsWith(MAP_PATH));
  const { nextLaunch, mapReturnHref } = useCourseMapNextLaunch(active && isMapReturn);

  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [cancelled, setCancelled] = useState(false);
  const hasNavigated = useRef(false);

  const destinationHref = nextLaunch?.href ?? returnTo ?? MAP_PATH;
  const destinationLabel = nextLaunch?.title ?? "Course Map";

  // Reset when active flips on
  useEffect(() => {
    if (active && isMapReturn) {
      setSecondsLeft(COUNTDOWN_SECONDS);
      setCancelled(false);
      hasNavigated.current = false;
    }
  }, [active, isMapReturn]);

  useEffect(() => {
    if (!active || !isMapReturn || cancelled) return;

    if (secondsLeft <= 0) {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push(destinationHref);
      }
      return;
    }

    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [active, isMapReturn, cancelled, secondsLeft, destinationHref, router]);

  const cancel = () => setCancelled(true);

  const goNow = () => {
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      router.push(destinationHref);
    }
  };

  return {
    isActive: isMapReturn && active && !cancelled,
    secondsLeft,
    returnHref: mapReturnHref,
    destinationHref,
    destinationLabel,
    cancel,
    goNow,
  };
}
