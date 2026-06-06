"use client";

import { useRouter } from "next/navigation";

type ClassOption = {
    id: string;
    name: string;
    studentCount: number;
};

type GuideOption = {
    id: string;
    title: string;
};

type Props = {
    classes: ClassOption[];
    guides: GuideOption[];
    selectedClassId?: string;
    selectedActivityId?: string;
};

export function AdminDiagnosticsPicker({
    classes,
    guides,
    selectedClassId = "",
    selectedActivityId = "",
}: Props) {
    const router = useRouter();

    const updateSelection = (classId: string, activityId: string) => {
        const params = new URLSearchParams();
        if (classId) params.set("classId", classId);
        if (activityId) params.set("activityId", activityId);
        const query = params.toString();
        router.push(query ? `/admin/diagnostics?${query}` : "/admin/diagnostics");
    };

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b8174]">
                    Class
                </span>
                <select
                    value={selectedClassId}
                    onChange={(e) => updateSelection(e.target.value, selectedActivityId)}
                    className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-[#2d261f] outline-none transition-colors focus:border-[#b05740] focus:ring-2 focus:ring-[#b05740]/20"
                    style={{ borderColor: "rgba(0,0,0,0.12)" }}
                >
                    <option value="">Choose a class…</option>
                    {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                            {cls.name} ({cls.studentCount} student{cls.studentCount === 1 ? "" : "s"})
                        </option>
                    ))}
                </select>
            </label>

            <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b8174]">
                    Grammar guide mini-quiz
                </span>
                <select
                    value={selectedActivityId}
                    onChange={(e) => updateSelection(selectedClassId, e.target.value)}
                    disabled={!selectedClassId}
                    className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-[#2d261f] outline-none transition-colors focus:border-[#b05740] focus:ring-2 focus:ring-[#b05740]/20 disabled:cursor-not-allowed disabled:bg-[#f5f3ef] disabled:text-[#a8a196]"
                    style={{ borderColor: "rgba(0,0,0,0.12)" }}
                >
                    <option value="">Choose a grammar guide…</option>
                    {guides.map((guide) => (
                        <option key={guide.id} value={guide.id}>
                            {guide.title}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}
