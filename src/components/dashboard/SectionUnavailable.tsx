"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
export function SectionUnavailable({ title }: { title: string }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [cooldown, setCooldown] = useState(false);
    return <section className="rounded-xl border border-border bg-bg p-4" aria-label={title}>
        <p role="status" className="text-sm text-text-muted">{title} is temporarily unavailable. You can keep using the other sections.</p>
        <button type="button" disabled={pending || cooldown} className="mt-2 min-h-11 rounded-lg border border-border px-3 text-sm disabled:opacity-50"
            onClick={() => { setCooldown(true); setTimeout(() => setCooldown(false), 5000); startTransition(() => router.refresh()); }}>
            {pending ? "Loading…" : "Try again"}
        </button>
    </section>;
}
