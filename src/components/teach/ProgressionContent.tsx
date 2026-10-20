"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/** Open every <details> around the linked section, as the standalone reference did. */
function revealHash(container: HTMLElement) {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (!target || !container.contains(target)) return false;
    for (let detail = target.closest("details"); detail; detail = detail.parentElement?.closest("details") ?? null) {
        detail.open = true;
    }
    target.scrollIntoView();
    return true;
}

export function ProgressionContent({
    html,
    className,
    scrollToId,
}: {
    html: string;
    className?: string;
    /** Section to show when the URL has no hash, e.g. this week's card. */
    scrollToId?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const container = ref.current;
        if (!container) return;
        if (!revealHash(container) && scrollToId) document.getElementById(scrollToId)?.scrollIntoView();
        const onHash = () => revealHash(container);
        window.addEventListener("hashchange", onHash);
        return () => window.removeEventListener("hashchange", onHash);
    }, [html, scrollToId]);

    // Keep links between reference pages inside the app instead of reloading the workspace.
    const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
        const link = (event.target as HTMLElement).closest("a");
        const href = link?.getAttribute("href");
        if (!href?.startsWith("/teach/progression") || link?.target) return;
        event.preventDefault();
        router.push(href);
    };

    return (
        <div ref={ref} className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
    );
}
