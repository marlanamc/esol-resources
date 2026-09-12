"use client";

import { usePathname, useRouter } from "next/navigation";
import { TEACH_CLASS_COOKIE } from "@/lib/teach/active-class-shared";

type ClassOption = {
    id: string;
    name: string;
};

type Props = {
    classes: ClassOption[];
    selectedClassId: string;
};

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function TeachClassSwitcher({ classes, selectedClassId }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    if (classes.length <= 1) return null;

    return (
        <label className="inline-flex items-center gap-2">
            <span className="sr-only">Switch class</span>
            <select
                value={selectedClassId}
                onChange={(e) => {
                    const nextClassId = e.target.value;
                    if (!nextClassId) return;

                    // Remember the choice so it survives navigation to other /teach pages.
                    document.cookie = `${TEACH_CLASS_COOKIE}=${encodeURIComponent(nextClassId)}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;

                    // Drop any stale `?classId=` so the freshly written cookie wins
                    // on this page and every other /teach page.
                    const basePath = pathname?.startsWith("/teach") ? pathname : "/teach";
                    router.replace(basePath);
                    router.refresh();
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
