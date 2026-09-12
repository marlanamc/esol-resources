"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { ExcludeLeaderboardToggle } from "@/components/admin/ExcludeLeaderboardToggle";

export type AdminStudentRow = {
    id: string;
    username: string;
    name: string | null;
    excludeFromLeaderboard: boolean;
    lastActivityDate: string | null;
    createdAt: string;
    classes: { id: string; name: string }[];
};

type Props = {
    students: AdminStudentRow[];
};

export function AdminStudentsTable({ students }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSectionId, setSelectedSectionId] = useState("all");
    const [leaderboardFilter, setLeaderboardFilter] = useState<"all" | "included" | "excluded">("all");

    const sectionOptions = useMemo(() => {
        const sectionMap = new Map<string, { id: string; name: string; count: number }>();
        let independentCount = 0;

        students.forEach((student) => {
            if (student.classes.length === 0) {
                independentCount += 1;
                return;
            }
            student.classes.forEach((cls) => {
                const existing = sectionMap.get(cls.id);
                if (existing) {
                    existing.count += 1;
                } else {
                    sectionMap.set(cls.id, { id: cls.id, name: cls.name, count: 1 });
                }
            });
        });

        const options = Array.from(sectionMap.values()).sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );

        if (independentCount > 0) {
            options.push({ id: "independent", name: "Independent", count: independentCount });
        }

        return options;
    }, [students]);

    const filteredStudents = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return students.filter((student) => {
            const matchesSearch =
                !query ||
                student.username.toLowerCase().includes(query) ||
                (student.name?.toLowerCase() || "").includes(query);

            const matchesSection =
                selectedSectionId === "all" ||
                (selectedSectionId === "independent"
                    ? student.classes.length === 0
                    : student.classes.some((cls) => cls.id === selectedSectionId));

            const matchesLeaderboard =
                leaderboardFilter === "all" ||
                (leaderboardFilter === "excluded"
                    ? student.excludeFromLeaderboard
                    : !student.excludeFromLeaderboard);

            return matchesSearch && matchesSection && matchesLeaderboard;
        });
    }, [students, searchQuery, selectedSectionId, leaderboardFilter]);

    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2
                    className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider"
                    style={{ color: "#64748b" }}
                >
                    <Users className="h-3.5 w-3.5" />
                    Students ({filteredStudents.length}
                    {filteredStudents.length !== students.length ? ` of ${students.length}` : ""})
                </h2>
            </div>

            <div
                className="rounded-2xl overflow-hidden border bg-white"
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
                <div
                    className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 p-4 border-b"
                    style={{ borderColor: "rgba(0,0,0,0.06)", background: "#f8f9fc" }}
                >
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or username…"
                        aria-label="Search students"
                        className="w-full px-3 py-2 min-h-[44px] rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#b05740]"
                        style={{ borderColor: "rgba(0,0,0,0.12)", color: "#1e2640" }}
                    />
                    <select
                        value={selectedSectionId}
                        onChange={(e) => setSelectedSectionId(e.target.value)}
                        aria-label="Filter by section"
                        className="w-full md:w-[220px] px-3 py-2 min-h-[44px] rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#b05740]"
                        style={{ borderColor: "rgba(0,0,0,0.12)", color: "#1e2640" }}
                    >
                        <option value="all">All sections ({students.length})</option>
                        {sectionOptions.map((section) => (
                            <option key={section.id} value={section.id}>
                                {section.name} ({section.count})
                            </option>
                        ))}
                    </select>
                    <select
                        value={leaderboardFilter}
                        onChange={(e) =>
                            setLeaderboardFilter(e.target.value as "all" | "included" | "excluded")
                        }
                        aria-label="Filter by leaderboard status"
                        className="w-full md:w-[200px] px-3 py-2 min-h-[44px] rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#b05740]"
                        style={{ borderColor: "rgba(0,0,0,0.12)", color: "#1e2640" }}
                    >
                        <option value="all">All leaderboard</option>
                        <option value="included">On leaderboard</option>
                        <option value="excluded">Excluded</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr style={{ background: "#f8f9fc", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                {["Username", "Name", "Enrolled In", "Leaderboard", "Last Active", "Joined"].map(
                                    (h) => (
                                        <th
                                            key={h}
                                            className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "#94a3b8" }}
                                        >
                                            {h}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-10 px-4 text-center text-sm"
                                        style={{ color: "#94a3b8" }}
                                    >
                                        No students match your filters
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((u) => {
                                    const classNames = u.classes.map((c) => c.name);
                                    return (
                                        <tr key={u.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                                            <td
                                                className="py-3 px-4 text-sm font-semibold"
                                                style={{ color: "#1e2640" }}
                                            >
                                                {u.username}
                                            </td>
                                            <td className="py-3 px-4 text-sm" style={{ color: "#475569" }}>
                                                {u.name || "—"}
                                            </td>
                                            <td className="py-3 px-4 text-xs" style={{ color: "#64748b" }}>
                                                {classNames.length > 0 ? (
                                                    classNames.join(", ")
                                                ) : (
                                                    <em style={{ color: "#94a3b8" }}>independent</em>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <ExcludeLeaderboardToggle
                                                    userId={u.id}
                                                    initialExcluded={u.excludeFromLeaderboard}
                                                />
                                            </td>
                                            <td className="py-3 px-4 text-xs" style={{ color: "#94a3b8" }}>
                                                {u.lastActivityDate
                                                    ? new Date(u.lastActivityDate).toLocaleDateString("en-US", {
                                                          month: "short",
                                                          day: "numeric",
                                                      })
                                                    : "Never"}
                                            </td>
                                            <td className="py-3 px-4 text-xs" style={{ color: "#94a3b8" }}>
                                                {new Date(u.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
