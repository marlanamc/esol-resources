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
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Class
                </span>
                <select
                    value={selectedClassId}
                    onChange={(e) => updateSelection(e.target.value, selectedActivityId)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
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
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Grammar guide mini-quiz
                </span>
                <select
                    value={selectedActivityId}
                    onChange={(e) => updateSelection(selectedClassId, e.target.value)}
                    disabled={!selectedClassId}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:bg-[var(--color-bg-light)] disabled:text-[var(--color-text-light)]"
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
