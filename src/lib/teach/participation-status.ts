export type ParticipationFilter = "all" | "active" | "inactive" | "never";
export function participationStatus(
    lastActive: Date | string | null,
    now: number,
): Exclude<ParticipationFilter, "all"> {
    if (!lastActive) return "never";
    return now - new Date(lastActive).getTime() >= 7 * 86400000
        ? "inactive"
        : "active";
}
export const participationLabels = {
    all: "All students",
    active: "Active in the last 7 days",
    inactive: "No activity for 7+ days",
    never: "Not started yet",
};
export function parseParticipationFilter(
    value: string | null | undefined,
): ParticipationFilter {
    return value === "active" || value === "inactive" || value === "never"
        ? value
        : "all";
}
export function latestActivityDate(
    ...dates: (Date | null | undefined)[]
): Date | null {
    return dates.reduce<Date | null>(
        (latest, date) => (date && (!latest || date > latest) ? date : latest),
        null,
    );
}
export function safeProgressReturn(value: string | undefined): string {
    if (!value) return "/teach/reports";
    try {
        const url = new URL(value, "https://workspace.local");
        return url.origin === "https://workspace.local" &&
            url.pathname === "/teach/reports"
            ? url.pathname + url.search
            : "/teach/reports";
    } catch {
        return "/teach/reports";
    }
}
