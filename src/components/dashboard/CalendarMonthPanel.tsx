"use client";

import type { ReactNode } from "react";
import type { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { MiniCalendar, type CalendarEvent, eventOverlapsMonth, useCalendarViewDate } from "./MiniCalendar";

type MiniCalendarProps = ComponentProps<typeof MiniCalendar>;
import UpcomingEventsList from "./UpcomingEventsList";

function monthEventsFor(events: CalendarEvent[], viewDate: Date) {
    return events.filter((event) => eventOverlapsMonth(event, viewDate));
}

/** The Home sidebar calendar. With practiceDays it ticks the learner's logged days, and a tapped day opens on the Calendar page. */
export function DashboardCalendarCard({ events, practiceDays }: { events: CalendarEvent[]; practiceDays?: Record<string, number> }) {
    const router = useRouter();
    const [viewDate, setViewDate] = useCalendarViewDate();
    const monthEvents = monthEventsFor(events, viewDate);

    return (
        <div className="dashboard-panel paper-texture rounded-2xl p-4">
            <MiniCalendar
                compact
                flat
                events={events}
                viewDate={viewDate}
                onViewDateChange={setViewDate}
                practiceDays={practiceDays}
                onSelectDay={practiceDays ? (dayKey) => router.push(`/dashboard/calendar?day=${dayKey}`) : undefined}
            />
            <div
                className="border-t mt-4 pt-4"
                style={{ borderColor: "color-mix(in srgb, var(--dashboard-border) 65%, transparent)" }}
            >
                <UpcomingEventsList
                    events={monthEvents}
                    allowDelete={false}
                    showSyncedLabel={false}
                    emptyMessage="No events this month."
                    compact
                />
            </div>
        </div>
    );
}

type CalendarMonthSplitProps = {
    events: CalendarEvent[];
    allowDelete?: boolean;
    showSyncedLabel?: boolean;
    extraColumn?: ReactNode;
    /** Practice log marks and day picking, passed through to MiniCalendar. */
    practice?: Pick<MiniCalendarProps, "practiceDays" | "practiceBadge" | "onSelectDay" | "selectedDayKey">;
    /** Shown under the calendar: the picked day's practice. Gets the month being viewed. */
    renderDayPanel?: (viewDate: Date) => ReactNode;
};

export function CalendarMonthSplit({
    events,
    allowDelete = false,
    showSyncedLabel = false,
    extraColumn,
    practice,
    renderDayPanel,
}: CalendarMonthSplitProps) {
    const [viewDate, setViewDate] = useCalendarViewDate();
    const monthEvents = monthEventsFor(events, viewDate);
    const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long" }).format(viewDate);

    const calendarCard = (
        <div
            className="w-full max-w-md rounded-2xl border p-4 sm:p-6 surface-card-shadow"
            style={{
                borderColor: "var(--border-subtle)",
                background: "linear-gradient(180deg, var(--surface-elevated) 0%, var(--surface-subtle) 100%)",
            }}
        >
            <MiniCalendar flat events={events} viewDate={viewDate} onViewDateChange={setViewDate} {...practice} />
        </div>
    );

    const eventsCard = (
        <div
            className="rounded-2xl border p-4 sm:p-6 surface-card-shadow"
            style={{
                borderColor: "var(--border-subtle)",
                background: "linear-gradient(180deg, var(--surface-elevated) 0%, var(--surface-subtle) 100%)",
            }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold text-text flex items-center gap-3">
                    <span className="w-1.5 h-6 rounded-full bg-[#7a6955]"></span>
                    {monthLabel}
                </h2>
            </div>
            <UpcomingEventsList
                events={monthEvents}
                allowDelete={allowDelete}
                showSyncedLabel={showSyncedLabel}
                emptyMessage="No events this month."
            />
        </div>
    );

    if (extraColumn) {
        return (
            <div className="grid gap-6 lg:grid-cols-[auto_1fr_300px]">
                <div
                    className="w-full max-w-sm rounded-2xl border p-4 sm:p-5 self-start"
                    style={{
                        borderColor: "var(--border-subtle)",
                        background: "linear-gradient(180deg, var(--surface-elevated) 0%, var(--surface-subtle) 100%)",
                    }}
                >
                    <MiniCalendar flat events={events} viewDate={viewDate} onViewDateChange={setViewDate} {...practice} />
                    {renderDayPanel ? <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>{renderDayPanel(viewDate)}</div> : null}
                </div>
                <div
                    className="rounded-2xl border p-4 sm:p-5"
                    style={{
                        borderColor: "var(--border-subtle)",
                        background: "linear-gradient(180deg, var(--surface-elevated) 0%, var(--surface-subtle) 100%)",
                    }}
                >
                    <h2 className="font-display font-bold text-lg text-text flex items-center gap-3 mb-4">
                        <span className="w-1.5 h-5 rounded-full" style={{ background: "#7a6955" }} />
                        {monthLabel}
                    </h2>
                    <UpcomingEventsList
                        events={monthEvents}
                        allowDelete={allowDelete}
                        showSyncedLabel={showSyncedLabel}
                        emptyMessage="No events this month."
                    />
                </div>
                {extraColumn}
            </div>
        );
    }

    if (renderDayPanel) {
        // Phone: calendar, the picked day, then the month's dates as short rows.
        // Desktop: calendar on the left, the day and the month's dates beside it.
        return (
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-6">
                <div className="lg:row-span-2 lg:sticky lg:top-4">
                    <div className="mx-auto w-full max-w-md lg:max-w-none">{calendarCard}</div>
                </div>
                <div
                    className="mx-auto w-full max-w-md rounded-2xl border p-4 sm:p-5 surface-card-shadow lg:max-w-none"
                    style={{ borderColor: "var(--border-subtle)", background: "var(--surface-elevated)" }}
                >
                    {renderDayPanel(viewDate)}
                </div>
                <div
                    className="mx-auto w-full max-w-md rounded-2xl border p-4 sm:p-5 lg:max-w-none"
                    style={{ borderColor: "var(--border-subtle)", background: "var(--surface-elevated)" }}
                >
                    <h2 className="m-0 mb-1 font-display text-lg font-bold text-text">Dates in {monthLabel}</h2>
                    <UpcomingEventsList events={monthEvents} allowDelete={false} showSyncedLabel={false} emptyMessage="No dates this month." compact />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-center w-full">{calendarCard}</div>
            {eventsCard}
        </div>
    );
}
