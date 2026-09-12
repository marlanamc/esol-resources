
import React from "react";
import Link from "next/link";
import { CertificateMedal } from "./CertificateMedal";
import { getMedalTier, getMedalTierLabel, qualifiesForMedal } from "./MedalIcons";
import { RefreshCw, HelpCircle } from "lucide-react";
import { ActivityLink } from "@/components/navigation/ActivityLink";

export interface MiniCertificateCardProps {
    /** Certificate data */
    certificate: {
        activityId: string;
        slug: string;
        title: string;
        score: number;
        issuedAt: Date | null;
    };
    /** Additional CSS classes */
    className?: string;
}

export function MiniCertificateCard({ certificate, className = "" }: MiniCertificateCardProps) {
    const tier = getMedalTier(certificate.score);
    const tierLabel = getMedalTierLabel(tier);

    // If score is below 70%, this component shouldn't be used - use NeedsImprovementCard instead
    if (!qualifiesForMedal(certificate.score) || tier === null) {
        return <NeedsImprovementCard certificate={certificate} className={className} />;
    }

    const href = `/dashboard/certificates/mini-quiz?activityId=${encodeURIComponent(certificate.activityId)}&slug=${encodeURIComponent(certificate.slug)}`;

    // Background gradient based on tier
    const bgGradient = {
        bronze: "from-amber-50/80 via-orange-50/60 to-amber-50/80 dark:from-amber-950/70 dark:via-orange-950/50 dark:to-amber-950/70",
        silver: "from-slate-50/80 via-gray-50/60 to-slate-50/80 dark:from-slate-800/80 dark:via-slate-900/70 dark:to-slate-800/80",
        gold: "from-amber-50/90 via-yellow-50/70 to-amber-50/90 dark:from-amber-950/80 dark:via-yellow-950/60 dark:to-amber-950/80",
        platinum: "from-cyan-50/80 via-sky-50/60 to-cyan-50/80 dark:from-cyan-950/70 dark:via-sky-950/50 dark:to-cyan-950/70",
    }[tier];

    const borderColor = {
        bronze: "border-amber-300/60 hover:border-amber-400/80 dark:border-amber-500/40 dark:hover:border-amber-400/60",
        silver: "border-slate-300/60 hover:border-slate-400/80 dark:border-slate-500/40 dark:hover:border-slate-400/60",
        gold: "border-amber-300/70 hover:border-amber-400/90 dark:border-amber-400/40 dark:hover:border-amber-300/60",
        platinum: "border-cyan-300/60 hover:border-cyan-400/80 dark:border-cyan-500/40 dark:hover:border-cyan-400/60",
    }[tier];

    const tierBadgeStyle = {
        bronze: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700",
        silver: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600",
        gold: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700",
        platinum: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-200 dark:border-cyan-700",
    }[tier];

    return (
        <Link
            href={href}
            className={`
                group relative flex flex-col items-center
                min-w-[180px] max-w-[220px] flex-1
                rounded-2xl border-2 ${borderColor}
                bg-gradient-to-br ${bgGradient}
                p-5 shadow-sm
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-lg
                ${className}
            `}
        >
            {/* Mini Medal */}
            <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
                <CertificateMedal
                    score={certificate.score}
                    title={certificate.title}
                    size="md"
                    interactive={false}
                />
            </div>

            {/* Tier Badge */}
            <div
                className={`
                    mb-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider
                    border ${tierBadgeStyle}
                `}
            >
                {tierLabel}
            </div>

            {/* Title */}
            <p className="mb-2 line-clamp-2 text-center text-sm font-bold leading-tight text-text transition-colors group-hover:text-primary">
                {certificate.title}
            </p>

            {/* Score */}
            <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-text">{certificate.score}%</span>
            </div>

            {/* Date */}
            <p className="mt-1 text-xs text-text-muted">
                {certificate.issuedAt
                    ? certificate.issuedAt.toLocaleDateString()
                    : "Recently earned"}
            </p>

            {/* Hover Glow Effect */}
            <div
                className={`
                    absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 pointer-events-none
                `}
                style={{
                    boxShadow: `0 0 30px var(--medal-${tier}-glow)`,
                }}
            />
        </Link>
    );
}

/**
 * Empty state placeholder for when no certificates exist
 */
export function EmptyCertificateCard({ className = "" }: { className?: string }) {
    return (
        <div
            className={`
                flex flex-col items-center justify-center
                min-w-[180px] max-w-[220px] min-h-[200px]
                rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/15
                bg-gray-50/50 p-5 dark:bg-black/30
                ${className}
            `}
        >
            {/* Ghost Medal */}
            <div className="mb-4 opacity-30">
                <div
                    className="rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-800"
                    style={{ width: 64, height: 64 }}
                />
            </div>

            {/* Locked Badge */}
            <div className="mb-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
                Locked
            </div>

            {/* Message */}
            <p className="text-center text-sm text-text-muted">
                Complete a mini quiz to unlock!
            </p>
        </div>
    );
}

/**
 * Card for scores under 70% - encourages students to try again
 */
export function NeedsImprovementCard({
    certificate,
    className = ""
}: MiniCertificateCardProps) {
    return (
        <ActivityLink
            activityId={certificate.activityId}
            className={`
                group relative flex flex-col items-center
                min-w-[180px] max-w-[220px] flex-1
                rounded-2xl border-2 border-rose-200/60 hover:border-rose-300/80
                dark:border-rose-500/40 dark:hover:border-rose-400/60
                bg-gradient-to-br from-rose-50/60 via-orange-50/40 to-rose-50/60
                dark:from-rose-950/50 dark:via-orange-950/30 dark:to-rose-950/50
                p-5 shadow-sm
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-lg
                ${className}
            `}
        >
            {/* Icon - Retry symbol */}
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-orange-100 text-rose-500 transition-transform duration-300 group-hover:scale-110 dark:from-rose-900 dark:to-orange-900 dark:text-rose-300">
                <RefreshCw className="h-8 w-8" />
            </div>

            {/* Badge */}
            <div className="mb-2 rounded-full border border-rose-200 bg-rose-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-600 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300">
                Try Again
            </div>

            {/* Title */}
            <p className="mb-2 line-clamp-2 text-center text-sm font-bold leading-tight text-text transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400">
                {certificate.title}
            </p>

            {/* Score */}
            <div className="mb-2 flex items-center gap-1.5">
                <span className="text-lg font-bold text-rose-600 dark:text-rose-400">{certificate.score}%</span>
            </div>

            {/* Encouragement Message */}
            <div className="space-y-1 text-center">
                <p className="text-xs leading-snug text-text-muted">
                    Keep practicing! You need 70% to earn a medal.
                </p>
                <p className="flex items-center justify-center gap-1 text-[10px] text-rose-500/80 dark:text-rose-400/80">
                    <HelpCircle className="h-3 w-3" />
                    Ask your teacher for help
                </p>
            </div>

            {/* Click hint */}
            <div className="mt-2 text-[10px] text-text-muted opacity-0 transition-opacity group-hover:opacity-100">
                Click to retry
            </div>
        </ActivityLink>
    );
}

export default MiniCertificateCard;
