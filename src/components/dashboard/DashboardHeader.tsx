import React from 'react';
import { MiniCalendar, CalendarEvent } from './MiniCalendar';
import { AssignmentCard } from './AssignmentCard';

interface Assignment {
    id: string;
    title?: string | null;
    className?: string;
    dueDate?: Date | string | null;
    activityId: string;
    activity: {
        title: string | null;
        description: string | null;
    };
}

interface DashboardHeaderProps {
    userName?: string | null;
    role?: string;
    upcomingAssignments?: Assignment[];
    calendarEvents?: CalendarEvent[];
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    userName,
    role = 'student',
    upcomingAssignments = [],
    calendarEvents = [],
}) => {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const monthEvents = calendarEvents.filter((ev) => {
        const d = new Date(ev.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    return (
        <div className="mb-12 animate-fade-in-up border-b border-border/60 pb-12">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-text-muted uppercase mb-8">
                <span className="opacity-60">Home</span>
                <span className="opacity-40">/</span>
                <span className="text-primary">{role === 'teacher' ? 'Faculty Portal' : 'Student Dashboard'}</span>
            </div>

            {/* Top Row: Welcome & Calendar */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-5xl md:text-6xl font-bold font-display text-text tracking-tight mb-3">
                        {userName ? `Welcome, ${userName.split(' ')[0]}.` : 'Welcome back.'}
                    </h1>
                    <p className="text-xl text-text-muted serif italic font-display opacity-80 mb-8">
                        {date}
                    </p>

                    {/* Assignments Slot - Moved under date */}
                    {upcomingAssignments && upcomingAssignments.length > 0 && (
                        <div className="animate-fade-in-up delay-200 max-w-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-8 bg-primary/80 rounded-full"></div>
                                <h2 className="text-3xl font-display font-bold text-text">Upcoming Assignments</h2>
                            </div>
                            <div className="space-y-4">
                                {upcomingAssignments.map((assignment, index) => (
                                    <AssignmentCard key={assignment.id} assignment={assignment} index={index} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="hidden lg:block self-start w-72">
                    <MiniCalendar events={calendarEvents} />
                    <div className="mt-4 space-y-2 border border-border/30 rounded-xl bg-white/80 shadow-sm px-3 py-3">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">This Month</p>
                            <span className="text-[10px] text-text-muted/70">{now.toLocaleString('en-US', { month: 'short', year: 'numeric' })}</span>
                        </div>
                        {monthEvents.length === 0 ? (
                            <p className="text-xs text-text-muted italic">No events this month.</p>
                        ) : (
                            <div className="space-y-1.5">
                                {monthEvents.slice(0, 6).map((ev, idx) => {
                                    const startDate = new Date(ev.date);
                                    const endDate = ev.endDate ? new Date(ev.endDate) : startDate;
                                    const sameDay = startDate.toDateString() === endDate.toDateString();
                                    const dateLabel = sameDay
                                        ? startDate.toLocaleDateString()
                                        : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
                                    const color =
                                        ev.type === 'holiday'
                                            ? 'bg-[#1d6deb]'
                                            : ev.type === 'quiz'
                                                ? 'bg-[#2d7a46]'
                                                : 'bg-accent';
                                    return (
                                        <div key={`${ev.title}-${idx}`} className="flex items-center justify-between text-xs border border-border/30 rounded-lg px-2 py-2 bg-white">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${color}`} />
                                                <span className="font-medium text-text line-clamp-1">{ev.title}</span>
                                            </div>
                                            <span className="text-[11px] text-text-muted whitespace-nowrap">{dateLabel}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
