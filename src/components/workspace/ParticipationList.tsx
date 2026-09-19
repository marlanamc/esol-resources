"use client";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import {
    parseParticipationFilter,
    participationLabels,
    participationStatus,
} from "@/lib/teach/participation-status";

type Student = {
    id: string;
    name: string | null;
    username: string;
    weeklyPoints: number;
    lastActive: Date | null;
    recentPractice: string | null;
};
export function ParticipationList({
    students,
    classId,
    now,
}: {
    students: Student[];
    classId: string | null;
    now: number;
}) {
    const params = useSearchParams();
    const pathname = usePathname();
    const query = params.get("q") ?? "";
    const filter = parseParticipationFilter(params.get("status"));
    const sort = params.get("sort") ?? "name";
    function update(key: string, value: string) {
        const next = new URLSearchParams(params.toString());
        if (classId) next.set("classId", classId);
        if (value) next.set(key, value);
        else next.delete(key);
        window.history.replaceState(null, "", `${pathname}?${next}`);
    }
    const visible = students
        .filter(
            (s) =>
                `${s.name ?? ""} ${s.username}`
                    .toLowerCase()
                    .includes(query.toLowerCase()) &&
                (filter === "all" ||
                    participationStatus(s.lastActive, now) === filter),
        )
        .sort((a, b) =>
            sort === "recent"
                ? (b.lastActive ? new Date(b.lastActive).getTime() : 0) -
                  (a.lastActive ? new Date(a.lastActive).getTime() : 0)
                : sort === "points"
                  ? b.weeklyPoints - a.weeklyPoints
                  : (a.name || a.username).localeCompare(b.name || b.username),
        );
    const returnParams = new URLSearchParams(params.toString());
    if (classId) returnParams.set("classId", classId);
    const returnTo = `${pathname}?${returnParams}`;
    function when(value: Date | null) {
        if (!value) return "No recorded activity";
        const days = Math.max(
            0,
            Math.floor((now - new Date(value).getTime()) / 86400000),
        );
        return days === 0
            ? "Within the last day"
            : days === 1
              ? "1 day ago"
              : `${days} days ago`;
    }
    return (
        <section
            aria-label="Student participation"
            className="workspace-panel !p-0 overflow-hidden"
        >
            <div className="p-4 border-b border-border space-y-3">
                <div className="flex flex-col xl:flex-row gap-3">
                    <label className="flex-1 min-w-0">
                        <span className="sr-only">Search students</span>
                        <input
                            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                            placeholder="Search students…"
                            value={query}
                            onChange={(e) => update("q", e.target.value)}
                        />
                    </label>
                    <label>
                        <span className="sr-only">Participation filter</span>
                        <select
                            className="w-full rounded-lg border border-border bg-bg px-3 text-sm"
                            value={filter}
                            onChange={(e) => update("status", e.target.value)}
                        >
                            {Object.entries(participationLabels).map(
                                ([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ),
                            )}
                        </select>
                    </label>
                    <label>
                        <span className="sr-only">Sort students</span>
                        <select
                            className="w-full rounded-lg border border-border bg-bg px-3 text-sm"
                            value={sort}
                            onChange={(e) => update("sort", e.target.value)}
                        >
                            <option value="name">Name A–Z</option>
                            <option value="recent">Most recently active</option>
                            <option value="points">Weekly points</option>
                        </select>
                    </label>
                </div>
                <p className="text-xs text-text-muted" role="status">
                    {visible.length} of {students.length} students
                </p>
            </div>
            <div
                className="hidden md:grid grid-cols-[1.2fr_1fr_1.4fr_.5fr] gap-4 px-5 py-3 border-b border-border text-xs font-semibold text-text-muted"
                aria-hidden="true"
            >
                <span>Student</span>
                <span>Last active</span>
                <span>Recent practice</span>
                <span className="text-right">Week pts</span>
            </div>
            <ul className="divide-y divide-border">
                {visible.map((s) => (
                    <li key={s.id}>
                        <Link
                            className="grid grid-cols-[1fr_auto] md:grid-cols-[1.2fr_1fr_1.4fr_.5fr] gap-x-4 gap-y-2 p-4 md:px-5 hover:bg-bg-light transition-colors"
                            href={`/teach/students/${s.id}?returnTo=${encodeURIComponent(returnTo)}${classId ? `&classId=${encodeURIComponent(classId)}` : ""}`}
                        >
                            <span className="min-w-0">
                                <span className="block font-semibold text-sm break-words">
                                    {s.name || s.username}
                                </span>
                                <span className="block text-xs text-text-muted break-all">
                                    @{s.username}
                                </span>
                            </span>
                            <span className="text-xs md:text-sm md:order-none order-3 col-span-2 md:col-span-1">
                                <span className="block">
                                    {when(s.lastActive)}
                                </span>
                                <span
                                    className={`text-xs ${participationStatus(s.lastActive, now) === "inactive" ? "text-amber-800" : "text-text-muted"}`}
                                >
                                    {participationStatus(s.lastActive, now) ===
                                    "active"
                                        ? "Practiced in the last 7 days"
                                        : participationLabels[
                                              participationStatus(
                                                  s.lastActive,
                                                  now,
                                              )
                                          ]}
                                </span>
                            </span>
                            <span className="text-sm text-text-muted min-w-0 break-words order-4 md:order-none col-span-2 md:col-span-1">
                                {s.recentPractice ?? "No practice recorded yet"}
                            </span>
                            <span className="text-right tabular-nums text-sm font-semibold order-2 md:order-none">
                                {s.weeklyPoints}
                                <span className="block text-xs font-normal text-text-muted md:sr-only">
                                    week pts
                                </span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
            {!visible.length && (
                <div className="p-8 text-center">
                    <p className="font-semibold">
                        {students.length
                            ? "No matching students"
                            : "No students to report on yet"}
                    </p>
                    <p className="mt-2 text-sm text-text-muted">
                        {students.length
                            ? "Try another name or participation filter."
                            : "Enrolled students will appear here when they are included in reporting."}
                    </p>
                    {students.length > 0 && (
                        <button
                            className="workspace-button mt-4"
                            onClick={() =>
                                window.history.replaceState(
                                    null,
                                    "",
                                    `${pathname}${classId ? `?classId=${encodeURIComponent(classId)}` : ""}`,
                                )
                            }
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}
