"use client";

import { useSyncExternalStore } from "react";
import { Flame } from "lucide-react";

const DAYS_SHOWN = 7;

function localDateKey(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}

const subscribe = () => () => {};
// "Today" depends on the learner's time zone, so the days render on the client only.
const getTodayKey = () => localDateKey(new Date());
const getServerTodayKey = () => null;

/** Last seven days as flame circles: a small, friendly stand-in for the full streak heat map. */
export function ProfileStreakWeek({ activityDates, currentStreak }: { activityDates: string[]; currentStreak: number }) {
    const todayKey = useSyncExternalStore(subscribe, getTodayKey, getServerTodayKey);

    const activeKeys = new Set(activityDates.map((iso) => localDateKey(new Date(iso))));
    const practicedToday = todayKey !== null && activeKeys.has(todayKey);

    const days = todayKey === null ? [] : Array.from({ length: DAYS_SHOWN }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (DAYS_SHOWN - 1 - index));
        const key = localDateKey(date);
        return {
            key,
            isToday: key === todayKey,
            active: activeKeys.has(key),
            label: date.toLocaleDateString("en-US", { weekday: "short" }),
            longLabel: date.toLocaleDateString("en-US", { weekday: "long" }),
        };
    });

    const heading = currentStreak > 0 ? `My streak: ${currentStreak} ${currentStreak === 1 ? "day" : "days"}` : "Start a streak today!";
    const subtext = practicedToday
        ? "You practiced today. Great job!"
        : currentStreak > 0
          ? `Practice today to make it ${currentStreak + 1}!`
          : "Do one activity today to start.";

    return (
        <section aria-labelledby="profile-streak-heading" className="space-y-4 rounded-2xl border border-border/60 bg-surface-elevated p-5 shadow-sm">
            <div>
                <h2 id="profile-streak-heading" className="text-xl font-extrabold text-text">{heading}</h2>
                <p className="text-[15px] text-text-muted">{subtext}</p>
            </div>
            <ol className="grid min-h-[62px] grid-cols-7 gap-1.5" aria-label="Last 7 days">
                {days.map((day) => (
                    <li key={day.key} className="flex flex-col items-center gap-1.5">
                        <span
                            className={`flex h-[38px] w-[38px] items-center justify-center rounded-full border-2 ${
                                day.active
                                    ? "border-amber-700 bg-amber-700 text-white dark:border-amber-300 dark:bg-amber-300 dark:text-amber-950"
                                    : day.isToday
                                      ? "border-dashed border-amber-700 dark:border-amber-300"
                                      : "border-border"
                            }`}
                        >
                            {day.active && <Flame className="h-4 w-4" strokeWidth={2.6} aria-hidden />}
                            <span className="sr-only">
                                {day.isToday ? "Today" : day.longLabel}: {day.active ? "practiced" : "no practice"}
                            </span>
                        </span>
                        <span className={`text-xs font-bold ${day.isToday ? "text-text" : "text-text-muted"}`} aria-hidden>
                            {day.isToday ? "Today" : day.label}
                        </span>
                    </li>
                ))}
            </ol>
        </section>
    );
}
