"use client";

import type { ReactNode } from "react";
import { MiniCalendar, type CalendarEvent, eventOverlapsMonth, useCalendarViewDate } from "./MiniCalendar";
import UpcomingEventsList from "./UpcomingEventsList";

function monthEventsFor(events: CalendarEvent[], viewDate: Date) {
    return events.filter((event) => eventOverlapsMonth(event, viewDate));
}

export function DashboardCalendarCard({ events }: { events: CalendarEvent[] }) {
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
};

export function CalendarMonthSplit({
    events,
    allowDelete = false,
    showSyncedLabel = false,
    extraColumn,
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
            <MiniCalendar events={events} viewDate={viewDate} onViewDateChange={setViewDate} />
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
                    <MiniCalendar events={events} viewDate={viewDate} onViewDateChange={setViewDate} />
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

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-center w-full">{calendarCard}</div>
            {eventsCard}
        </div>
    );
}
