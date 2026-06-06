const WEEK_KEY = "course-map:last-week";
const SCROLL_KEY = "course-map:scroll-y";

export interface CourseMapSessionState {
    week: number | null;
    scrollY: number;
}

function isValidWeek(week: number): boolean {
    return Number.isFinite(week) && week >= 1 && week <= 36;
}

export function readCourseMapSessionState(): CourseMapSessionState | null {
    if (typeof window === "undefined") return null;
    try {
        const weekRaw = sessionStorage.getItem(WEEK_KEY);
        const scrollRaw = sessionStorage.getItem(SCROLL_KEY);
        const week = weekRaw != null ? Number.parseInt(weekRaw, 10) : null;
        const scrollY = scrollRaw != null ? Number.parseInt(scrollRaw, 10) : 0;
        if (week != null && !isValidWeek(week)) return null;
        return {
            week: week != null && isValidWeek(week) ? week : null,
            scrollY: Number.isFinite(scrollY) && scrollY >= 0 ? scrollY : 0,
        };
    } catch {
        return null;
    }
}

export function writeCourseMapSessionState(week: number | null, scrollY: number): void {
    if (typeof window === "undefined") return;
    try {
        if (week != null && isValidWeek(week)) {
            sessionStorage.setItem(WEEK_KEY, String(week));
        } else {
            sessionStorage.removeItem(WEEK_KEY);
        }
        sessionStorage.setItem(SCROLL_KEY, String(Math.max(0, Math.round(scrollY))));
    } catch {
        // Ignore quota / private-mode errors.
    }
}

export function resolveInitialMapOpenWeek(options: {
    initialWeek: number | null | undefined;
    hashWeek: number | null;
    progressWeek: number | null;
}): number | null {
    if (options.initialWeek != null) return options.initialWeek;
    if (options.hashWeek != null) return options.hashWeek;

    const session = readCourseMapSessionState();
    if (session?.week != null) return session.week;

    return options.progressWeek;
}
