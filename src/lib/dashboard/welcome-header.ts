export type DashboardWelcomeMode = "classroom" | "independent";

export type WelcomeHighlight = "streak" | "weekly-goal" | "rank" | "default";

export type DashboardWelcomeChip = {
    key: string;
    label: string;
    tone?: "default" | "primary" | "secondary" | "accent";
};

export function getTimeOfDayGreeting(now: Date = new Date()): string {
    const hour = now.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good evening";
}

export function getWelcomeEyebrow(mode: DashboardWelcomeMode, weekLabel?: string): { icon: string; label: string } {
    if (mode === "independent") {
        return { icon: "🌱", label: "Self-paced learning" };
    }
    return { icon: "📋", label: weekLabel ?? "This week" };
}

export function getWelcomeMessage(params: {
    mode: DashboardWelcomeMode;
    streak?: number;
    weeklyCompleted?: number;
    weeklyGoal?: number;
    leaderboardRank?: number | null;
    weekLabel?: string;
}): { subline: string; highlight: WelcomeHighlight } {
    const {
        mode,
        weeklyCompleted,
        weeklyGoal,
        leaderboardRank,
        weekLabel,
    } = params;

    const weeklyRemaining =
        weeklyGoal != null && weeklyCompleted != null
            ? Math.max(0, weeklyGoal - weeklyCompleted)
            : null;
    const weeklyMet =
        weeklyGoal != null && weeklyCompleted != null && weeklyCompleted >= weeklyGoal;

    // Streak messaging lives in the sidebar MomentumCard — skip here to avoid duplication.

    if (weeklyRemaining === 1) {
        return {
            highlight: "weekly-goal",
            subline: "One activity away from your weekly goal.",
        };
    }

    if (weeklyMet) {
        return {
            highlight: "weekly-goal",
            subline: "Weekly goal crushed — keep the momentum going.",
        };
    }

    if (leaderboardRank != null && leaderboardRank <= 3) {
        return {
            highlight: "rank",
            subline: `#${leaderboardRank} on the leaderboard this week.`,
        };
    }

    if (leaderboardRank != null) {
        return {
            highlight: "rank",
            subline: `#${leaderboardRank} on the self-paced leaderboard this week.`,
        };
    }

    if (mode === "independent") {
        return {
            highlight: "default",
            subline: "Learning at your own pace — your path, your pace.",
        };
    }

    return {
        highlight: "default",
        subline: weekLabel ? `${weekLabel} · Ready for what's next.` : "Ready for what's next.",
    };
}

/** Chips complement the subline — never repeat its headline stat. */
export function getWelcomeChips(params: {
    streak?: number;
    leaderboardRank?: number | null;
    highlight: WelcomeHighlight;
}): DashboardWelcomeChip[] {
    const chips: DashboardWelcomeChip[] = [];
    const { streak = 0, leaderboardRank, highlight } = params;

    if (highlight !== "streak" && streak > 0) {
        chips.push({
            key: "streak",
            label: streak === 1 ? "1-day streak" : `${streak}-day streak`,
            tone: streak >= 7 ? "accent" : "primary",
        });
    }

    if (highlight !== "rank" && leaderboardRank != null) {
        chips.push({
            key: "rank",
            label: `#${leaderboardRank} this week`,
            tone: "accent",
        });
    }

    return chips.slice(0, 2);
}

// Back-compat helpers
export function getWelcomeSubline(
    params: Parameters<typeof getWelcomeMessage>[0]
): string {
    return getWelcomeMessage(params).subline;
}
