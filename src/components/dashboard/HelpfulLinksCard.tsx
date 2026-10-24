import { ChevronDown, Link2 } from "lucide-react";
import { getHelpfulLinks } from "@/lib/helpful-links";
import { HelpfulLinkRow } from "@/components/dashboard/HelpfulLinkRow";
import roadStyles from "@/components/dashboard/course-map-road/road.module.css";

interface HelpfulLinksCardProps {
    /** `plain` is the folded row on the phone home; `contained` is a sidebar panel */
    variant?: "plain" | "contained";
}

export function HelpfulLinksCard({ variant = "contained" }: HelpfulLinksCardProps) {
    const links = getHelpfulLinks();
    if (links.length === 0) return null;

    const list = (
        <div className="divide-y divide-[var(--border-subtle)]">
            {links.map((link) => (
                <HelpfulLinkRow key={link.id} link={link} />
            ))}
        </div>
    );

    if (variant === "plain") {
        // Phone home: folded to one quiet row so it never competes with the week card.
        return (
            <details
                className={`group rounded-[14px] border border-dashed px-3.5 ${roadStyles.road}`}
                style={{ borderColor: "var(--road-rail)" }}
            >
                <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-[14px] text-[0.875rem] text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                    <Link2 size={18} aria-hidden className="shrink-0" />
                    <span className="min-w-0 flex-1 truncate">
                        <strong className="font-bold text-text">Class links</strong> · {links.slice(0, 2).map((link) => link.label).join(", ")}
                    </span>
                    <ChevronDown size={16} aria-hidden className="shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
                </summary>
                <div className="pb-1">{list}</div>
            </details>
        );
    }

    return (
        <section aria-label="Class resources">
            <div
                className="dashboard-panel rounded-2xl px-4 py-3"
                style={{ borderColor: "var(--dashboard-border)" }}
            >
                <h2 className="font-display text-base font-bold text-text">Class resources</h2>
                <div className="mt-1">{list}</div>
            </div>
        </section>
    );
}
