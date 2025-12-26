"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[App Error]", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-xl bg-white border border-border/60 rounded-2xl shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 font-bold">
                        !
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-text">Something went wrong</h1>
                        <p className="text-sm text-text-muted">
                            Try again, or go back to the dashboard.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={reset}
                        className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition"
                    >
                        Try again
                    </button>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 rounded-lg bg-white border border-border/60 text-text font-semibold hover:border-primary/40 transition"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {process.env.NODE_ENV !== "production" ? (
                    <pre className="text-xs bg-bg-gray/40 border border-border/50 rounded-lg p-3 overflow-auto whitespace-pre-wrap">
                        {error.message}
                        {error.digest ? `\n\ndigest: ${error.digest}` : ""}
                    </pre>
                ) : null}
            </div>
        </div>
    );
}

