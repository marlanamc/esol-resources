"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface IndependentFeaturedToggleProps {
    activityId: string;
    initial: boolean;
}

export function IndependentFeaturedToggle({
    activityId,
    initial,
}: IndependentFeaturedToggleProps) {
    const [featured, setFeatured] = useState(initial);
    const [loading, setLoading] = useState(false);

    async function handleToggle() {
        const next = !featured;
        setLoading(true);
        setFeatured(next);
        try {
            const res = await fetch(
                `/api/admin/activities/${activityId}/featured-independent`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isFeaturedForIndependent: next }),
                }
            );
            if (!res.ok) {
                setFeatured(!next);
                console.error("Failed to toggle featured-for-independent");
            }
        } catch (error) {
            setFeatured(!next);
            console.error("Error toggling featured-for-independent:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            title={
                featured
                    ? "Featured in independent learner carousel — click to unfeature"
                    : "Click to feature in independent learner carousel"
            }
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                featured
                    ? "bg-amber-100 border-amber-300 hover:bg-amber-200"
                    : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
        >
            <Star
                className="h-3.5 w-3.5"
                style={{
                    color: featured ? "#d97706" : "#cbd5e1",
                    fill: featured ? "#f59e0b" : "transparent",
                }}
            />
        </button>
    );
}
