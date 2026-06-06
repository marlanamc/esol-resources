"use client";

import { useRouter } from "next/navigation";

type ClassOption = {
    id: string;
    name: string;
};

type Props = {
    classes: ClassOption[];
    selectedClassId: string;
};

export function TeachClassSwitcher({ classes, selectedClassId }: Props) {
    const router = useRouter();

    if (classes.length <= 1) return null;

    return (
        <label className="inline-flex items-center gap-2">
            <span className="sr-only">Switch class</span>
            <select
                value={selectedClassId}
                onChange={(e) => {
                    const nextClassId = e.target.value;
                    router.push(nextClassId ? `/teach?classId=${nextClassId}` : "/teach");
                }}
                className="rounded border bg-white px-3 py-2 text-sm font-bold text-[#345476] outline-none transition-colors focus:border-[#b05740] focus:ring-2 focus:ring-[#b05740]/20"
                style={{ borderColor: "#bdb7af" }}
            >
                {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                        {cls.name}
                    </option>
                ))}
            </select>
        </label>
    );
}
