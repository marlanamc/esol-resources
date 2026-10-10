"use client";

import { useState } from "react";
import Link from "next/link";
import type { StudentCourseMapStatus } from "@/lib/course-map-week";
import { RosterStudentActions } from "./RosterStudentActions";

export interface RosterStudent {
    id: string;
    name: string | null;
    username: string;
    weeklyPoints: number;
    currentStreak: number;
    lastActivityDate: string | null;
    courseMap: StudentCourseMapStatus | null;
}

export function ClassRoster({
    students,
    classId,
    now,
    full = false,
}: {
    students: RosterStudent[];
    classId: string;
    now: number;
    full?: boolean;
}) {
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("name");
    const visible = students
        .filter((s) =>
            `${s.name ?? ""} ${s.username}`
                .toLowerCase()
                .includes(query.toLowerCase()),
        )
        .sort((a, b) => {
            const byName = (a.name || a.username).localeCompare(
                b.name || b.username,
            );
            if (sort === "week")
                return (
                    (a.courseMap?.currentWeek.percent ?? -1) -
                        (b.courseMap?.currentWeek.percent ?? -1) || byName
                );
            if (sort === "recent")
                return (
                    (b.lastActivityDate ? Date.parse(b.lastActivityDate) : 0) -
                        (a.lastActivityDate
                            ? Date.parse(a.lastActivityDate)
                            : 0) || byName
                );
            return byName;
        });
    const returnTo = full
        ? `/teach/classes/${classId}#roster`
        : `/teach?classId=${encodeURIComponent(classId)}#roster`;
    return (
        <section
            id="roster"
            className={`workspace-panel roster-panel ${full ? "roster-full" : ""}`}
            aria-labelledby="roster-title"
        >
            <div className="p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2
                        id="roster-title"
                        className="font-display text-xl font-bold"
                    >
                        Class roster
                    </h2>
                    {!full && (
                        <Link
                            className="text-sm font-semibold text-primary min-h-11 inline-flex items-center"
                            href={`/teach/classes/${classId}#roster`}
                        >
                            Full roster →
                        </Link>
                    )}
                </div>
                <div className="flex flex-wrap gap-3">
                    <label className="flex-1 min-w-[180px]">
                        <span className="sr-only">Search roster</span>
                        <input
                            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                            placeholder="Search students…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </label>
                    <label className="max-w-full">
                        <span className="sr-only">Sort roster</span>
                        <select
                            className="max-w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="name">Name A–Z</option>
                            <option value="week">
                                Weekly completion: lowest first
                            </option>
                            <option value="recent">Most recently active</option>
                        </select>
                    </label>
                </div>
                <p className="text-xs text-text-muted" role="status">
                    {visible.length} of {students.length} enrolled students ·
                    Weekly completion follows each student’s current course
                    week.
                </p>
            </div>
            <div className="roster-scroll">
                <table className="roster-table">
                    <caption className="sr-only">
                        Student weekly course progress and participation
                    </caption>
                    <thead>
                        <tr>
                            {[
                                "Student",
                                "This week",
                                "Week points",
                                "Last active",
                                ...(full
                                    ? ["Course map", "Streak", "Actions"]
                                    : []),
                            ].map((label) => (
                                <th scope="col" key={label}>
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {visible.map((s) => {
                            const week = s.courseMap?.currentWeek;
                            const days = s.lastActivityDate
                                ? Math.max(
                                      0,
                                      Math.floor(
                                          (now -
                                              Date.parse(s.lastActivityDate)) /
                                              86400000,
                                      ),
                                  )
                                : null;
                            return (
                                <tr key={s.id}>
                                    <td data-label="Student">
                                        <Link
                                            className="font-semibold text-primary hover:underline inline-block py-1"
                                            href={`/teach/students/${s.id}?classId=${encodeURIComponent(classId)}&returnTo=${encodeURIComponent(returnTo)}`}
                                        >
                                            {s.name || s.username}
                                        </Link>
                                        <span className="block text-xs text-text-muted break-all">
                                            @{s.username}
                                        </span>
                                    </td>
                                    <td data-label="This week">
                                        {week && week.total > 0 ? (
                                            <div
                                                className="roster-progress"
                                                title={week.title}
                                            >
                                                <div className="flex justify-between gap-2">
                                                    <span className="text-xs text-text-muted">
                                                        Week {week.number}
                                                    </span>
                                                    <strong className="tabular-nums">
                                                        {week.percent}%
                                                    </strong>
                                                </div>
                                                <progress
                                                    className="w-full h-2"
                                                    value={week.done}
                                                    max={week.total}
                                                    aria-label={`${s.name || s.username}: Week ${week.number} completion`}
                                                />
                                                <span className="text-xs text-text-muted">
                                                    {week.done} of {week.total}{" "}
                                                    required
                                                    {s.courseMap?.weekComplete
                                                        ? " · Done"
                                                        : ""}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-text-muted">
                                                {week
                                                    ? `Week ${week.number}: no required work available`
                                                    : "No current course week available"}
                                            </span>
                                        )}
                                    </td>
                                    <td
                                        data-label="Week points"
                                        className="tabular-nums whitespace-nowrap font-semibold"
                                    >
                                        {s.weeklyPoints} pts
                                    </td>
                                    <td
                                        data-label="Last active"
                                        className="text-text-muted"
                                    >
                                        {days === null
                                            ? "No recorded activity"
                                            : days === 0
                                              ? "Today"
                                              : days === 1
                                                ? "1 day ago"
                                                : `${days} days ago`}
                                    </td>
                                    {full && (
                                        <>
                                            <td data-label="Course map">
                                                <span className="tabular-nums">
                                                    {s.courseMap &&
                                                    s.courseMap.overall.total >
                                                        0
                                                        ? `${s.courseMap.overall.percent}% overall`
                                                        : "No released work"}
                                                </span>
                                                <span className="block text-xs text-text-muted">
                                                    {s.courseMap
                                                        ?.completedWeeksCount ??
                                                        0}{" "}
                                                    weeks completed
                                                </span>
                                            </td>
                                            <td
                                                data-label="Streak"
                                                className="tabular-nums"
                                            >
                                                {s.currentStreak} days
                                            </td>
                                            <td data-label="Actions">
                                                <details className="roster-actions">
                                                    <summary
                                                        className="cursor-pointer py-2 font-semibold"
                                                        aria-label={`Actions for ${s.name || s.username}`}
                                                    >
                                                        Actions
                                                    </summary>
                                                    <RosterStudentActions
                                                        classId={classId}
                                                        studentId={s.id}
                                                        studentName={
                                                            s.name || s.username
                                                        }
                                                        status="active"
                                                    />
                                                </details>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {!visible.length && (
                <p className="p-6 text-sm text-text-muted">
                    {students.length
                        ? "No matching students. Try another name."
                        : "No students enrolled yet. Share your class join code to get started."}
                </p>
            )}
            <p className="p-4 border-t border-border text-xs text-text-muted">
                Includes active enrollments. Activity reports may exclude
                students omitted from reporting. Points recognize practice
                effort; completion is not a mastery score.
            </p>
        </section>
    );
}
