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
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/exclude-leaderboard`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excluded: !excluded }),
      });

      if (res.ok) {
        setExcluded(!excluded);
      } else {
        setError("Could not update. Try again.");
      }
    } catch (error) {
      console.error("Error toggling exclusion:", error);
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <button
      type="button"
      role="switch"
      aria-checked={!excluded}
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex px-2 py-1 rounded-full border text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        excluded
          ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
          : "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
      }`}
      title={`Shown on leaderboard: ${excluded ? "No" : "Yes"}. Click to ${excluded ? "include" : "exclude"} this user.`}
    >
      <span className="sr-only">Shown on leaderboard: </span>
      {loading ? "..." : excluded ? "No" : "Yes"}
    </button>
    {error ? (
      <span role="alert" className="mt-1 block text-xs font-medium text-red-700 dark:text-red-300">
        {error}
      </span>
    ) : null}
    </>
  );
}
