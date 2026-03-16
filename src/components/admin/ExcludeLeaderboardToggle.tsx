"use client";

import { useState } from "react";

interface ExcludeLeaderboardToggleProps {
  userId: string;
  initialExcluded: boolean;
}

export function ExcludeLeaderboardToggle({
  userId,
  initialExcluded,
}: ExcludeLeaderboardToggleProps) {
  const [excluded, setExcluded] = useState(initialExcluded);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/exclude-leaderboard`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excluded: !excluded }),
      });

      if (res.ok) {
        setExcluded(!excluded);
      } else {
        console.error("Failed to toggle exclusion");
      }
    } catch (error) {
      console.error("Error toggling exclusion:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex px-2 py-1 rounded-full border text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        excluded
          ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
          : "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
      }`}
      title={`Click to ${excluded ? "include in" : "exclude from"} leaderboard`}
    >
      {loading ? "..." : excluded ? "Yes" : "No"}
    </button>
  );
}
