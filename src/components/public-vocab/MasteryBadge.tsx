
import React from "react";
import type { MasteryLevel } from "@/lib/vocab-progress";

interface MasteryBadgeProps {
  level: MasteryLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const MASTERY_CONFIG = {
  untouched: {
    icon: "⭕",
    label: "Not started",
    color: "text-gray-400",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
  started: {
    icon: "🥉",
    label: "Bronze",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  practiced: {
    icon: "🥈",
    label: "Silver",
    color: "text-slate-500",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
  },
  mastered: {
    icon: "🥇",
    label: "Gold",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
};

const SIZE_CONFIG = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1.5",
  lg: "text-base px-4 py-2",
};

/**
 * Mastery badge showing progress through a theme
 * Bronze: 1 activity, Silver: 2-3, Gold: all 4
 */
export function MasteryBadge({
  level,
  size = "md",
  showLabel = true,
}: MasteryBadgeProps) {
  const config = MASTERY_CONFIG[level];
  const sizeClass = SIZE_CONFIG[size];

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.borderColor} ${config.bgColor} ${sizeClass}`}
    >
      <span className="text-lg" aria-hidden>
        {config.icon}
      </span>
      {showLabel && <span className={`font-semibold ${config.color}`}>{config.label}</span>}
    </div>
  );
}

export default MasteryBadge;
