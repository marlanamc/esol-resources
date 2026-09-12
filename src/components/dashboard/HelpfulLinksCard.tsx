import { GraduationCap } from "lucide-react";
import { getHelpfulLinks } from "@/lib/helpful-links";
import { HelpfulLinkRow } from "@/components/dashboard/HelpfulLinkRow";

export function HelpfulLinksCard() {
    const links = getHelpfulLinks();
    if (links.length === 0) return null;

    return (
        <section aria-label="Class resources">
            <div
                className="dashboard-panel paper-texture rounded-2xl p-4"
                style={{ borderColor: "var(--dashboard-border)" }}
            >
                <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <GraduationCap className="h-4.5 w-4.5" aria-hidden />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70 leading-none">
                            Quick links
                        </p>
                        <h2 className="mt-0.5 font-display text-base font-bold text-text">Class resources</h2>
                    </div>
                </div>
                <div className="space-y-2.5">
                    {links.map((link) => (
                        <HelpfulLinkRow key={link.id} link={link} />
                    ))}
                </div>
            </div>
        </section>
    );
}
