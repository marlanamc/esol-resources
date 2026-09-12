"use client";

import { ClipboardList, ExternalLink, Gamepad2, GraduationCap, Megaphone } from "lucide-react";
import { getHelpfulLinkColors, type HelpfulLink, type HelpfulLinkId } from "@/lib/helpful-links";
import { handleExternalLinkClick } from "@/lib/shared/open-external-link";

const LINK_ICONS: Record<HelpfulLinkId, typeof GraduationCap> = {
    "google-classroom": GraduationCap,
    "absence-form": ClipboardList,
    "advisor-bulletin-board": Megaphone,
    "in-class-games-library": Gamepad2,
};

export function HelpfulLinkRow({ link }: { link: HelpfulLink }) {
    const Icon = LINK_ICONS[link.id];
    const colors = getHelpfulLinkColors(link.id);

    return (
        <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => handleExternalLinkClick(event, link.href)}
            className="flex min-h-11 items-center gap-2.5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-sm"
        >
            <Icon className="h-4 w-4 shrink-0" style={{ color: colors.accent }} aria-hidden />
            <span className="min-w-0 flex-1 text-sm font-semibold text-text">
                {link.label}
            </span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden />
        </a>
    );
}
