/** Tuesday–Monday week label (matches This Week's Path on the dashboard). */
export function formatDashboardWeekRangeLabel(referenceDate: Date): string {
    const weekStart = new Date(referenceDate);
    const day = weekStart.getDay();
    const offsetToTuesday = day <= 1 ? -5 - day : 2 - day;
    weekStart.setDate(weekStart.getDate() + offsetToTuesday);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const startMonth = weekStart.toLocaleDateString("en-US", { month: "short" });
    const endMonth = weekEnd.toLocaleDateString("en-US", { month: "short" });
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();

    if (weekStart.getFullYear() !== weekEnd.getFullYear()) {
        return `Week of ${startMonth} ${startDay}, ${weekStart.getFullYear()}–${endMonth} ${endDay}, ${weekEnd.getFullYear()}`;
    }

    if (startMonth === endMonth) {
        return `Week of ${startMonth} ${startDay}–${endDay}`;
    }

    return `Week of ${startMonth} ${startDay}–${endMonth} ${endDay}`;
}
