"use client";

import { useState, useCallback } from "react";
import { WeeklyGoalTracker } from "@/components/dashboard/independent";
import type { WeeklyGoalProgress } from "@/lib/independent-progress";

interface IndependentDashboardClientProps {
    initialGoal: number;
    weeklyGoalProgress: WeeklyGoalProgress;
    compact?: boolean;
}

export function IndependentDashboardClient({
    initialGoal,
    weeklyGoalProgress,
    compact = false,
}: IndependentDashboardClientProps) {
    const [goal, setGoal] = useState(initialGoal);
    const [isSaving, setIsSaving] = useState(false);

    const handleGoalChange = useCallback(async (newGoal: number) => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/user/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ weeklyActivityGoal: newGoal }),
            });

            if (response.ok) {
                setGoal(newGoal);
            }
        } catch (error) {
            console.error("Failed to save goal:", error);
        } finally {
            setIsSaving(false);
        }
    }, []);

    // Recalculate percent with current goal
    const adjustedProgress = {
        ...weeklyGoalProgress,
        goal,
        percentComplete: Math.min(100, Math.round((weeklyGoalProgress.completed / goal) * 100)),
        isGoalMet: weeklyGoalProgress.completed >= goal,
    };

    return (
        <WeeklyGoalTracker
            completed={adjustedProgress.completed}
            goal={adjustedProgress.goal}
            daysRemaining={adjustedProgress.daysRemaining}
            onGoalChange={handleGoalChange}
            editable={!isSaving}
            compact={compact}
        />
    );
}
