"use client";

/**
 * Small checkmark indicator showing activity completion
 */
export function ActivityCheckmark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-green-500"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default ActivityCheckmark;
