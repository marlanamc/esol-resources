"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, BookOpen } from "lucide-react";

export type ViewMode = "teaching" | "student" | "admin";

/** Existing saved student/teaching/admin preferences remain valid. */
export function ViewModeSwitcher(_props: {
    showAdmin?: boolean;
    size?: "sm" | "md";
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const inWorkspace =
        pathname.startsWith("/teach") || pathname.startsWith("/admin");
    const Icon = inWorkspace ? ArrowUpRight : BookOpen;
    async function switchView() {
        setPending(true);
        setError("");
        try {
            const response = await fetch("/api/user/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    gameSettings: {
                        dashboard: {
                            mode: inWorkspace ? "student" : "teaching",
                        },
                    },
                }),
            });
            if (!response.ok)
                throw new Error("Unable to switch views. Please try again.");
            router.push(inWorkspace ? "/dashboard" : "/teach");
            router.refresh();
        } catch {
            setError("Unable to switch views. Please try again.");
        } finally {
            setPending(false);
        }
    }
    return (
        <div>
            <button
                type="button"
                onClick={switchView}
                disabled={pending}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-text disabled:opacity-60"
            >
                <Icon size={17} aria-hidden="true" />
                {pending
                    ? "Opening…"
                    : inWorkspace
                      ? "Student view"
                      : "Teaching workspace"}
            </button>
            {error && (
                <p role="alert" className="mt-2 text-sm text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}
