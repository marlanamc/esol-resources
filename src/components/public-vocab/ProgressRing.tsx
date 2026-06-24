
import React from "react";

interface ProgressRingProps {
  percentage: number; // 0-100
  size?: number; // diameter in pixels
  strokeWidth?: number;
  animated?: boolean;
}

/**
 * Circular progress indicator for theme completion
 * Shows 0-100% with color gradient (gray → yellow → green)
 */
export function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 6,
  animated = true,
}: ProgressRingProps) {
  // Ensure percentage is within bounds
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  // Circle calculation
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safePercentage / 100) * circumference;

  // Color based on progress
  const getColor = () => {
    if (safePercentage === 0) return "#e5e7eb"; // gray
    if (safePercentage < 50) return "#fbbf24"; // yellow
    if (safePercentage < 100) return "#34d399"; // emerald
    return "#10b981"; // green
  };

  const color = getColor();

  return (
    <div className="flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className={animated ? "transition-all duration-500" : ""}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={animated ? "transition-all duration-500" : ""}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: `${size / 2}px ${size / 2}px`,
          }}
        />

        {/* Center text */}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm font-bold fill-text"
          fontSize="14"
        >
          {safePercentage}%
        </text>
      </svg>
    </div>
  );
}

export default ProgressRing;
