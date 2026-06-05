import type { ReactNode } from "react";
import Link from "next/link";
import { MomentumCard } from "@/components/dashboard/MomentumCard";
import { BarChartIcon, ClipboardIcon, StarIcon, UsersIcon } from "@/components/icons/Icons";
import { formatDashboardWeekRangeLabel } from "@/lib/dashboard/week-range-label";

export type DashboardWelcomeHeroMomentumProps = {
    initialStreak?: number;
    initialLongestStreak?: number;
    initialSevenDayActivity?: boolean[];
    initialTotalPoints?: number;
};

export type DashboardWelcomeHeroTeacherStatsProps = {
    activeStudents: number;
    totalClasses: number;
    pendingReviews?: number;
    showBackendLink?: boolean;
};

interface DashboardWelcomeHeroProps {
    userName: string;
    nameEmoji?: ReactNode;
    momentum?: DashboardWelcomeHeroMomentumProps;
    teacherStats?: DashboardWelcomeHeroTeacherStatsProps;
    weekLabel?: string;
    eyebrowIcon?: ReactNode;
    helperText?: string;
    /** Inside shared week hub panel — no extra outer card */
    weekHub?: boolean;
}

export function DashboardWelcomeHero({
    userName,
    nameEmoji,
    momentum,
    teacherStats,
    weekLabel = formatDashboardWeekRangeLabel(new Date()),
    eyebrowIcon,
    helperText,
    weekHub = false,
}: DashboardWelcomeHeroProps) {
    const displayName = userName.trim() || "there";
    const isTeacherMode = Boolean(teacherStats);
    const resolvedHelperText = helperText ?? (isTeacherMode
        ? "Here's your teaching week at a glance."
        : "Here's your path and progress for this week.");
    const resolvedEyebrowIcon = eyebrowIcon ?? (isTeacherMode ? "🧑‍🏫" : "📋");

    return (
        <section
            className={`hidden lg:flex w-full min-w-0 ${weekHub ? "" : "dashboard-panel paper-texture rounded-2xl overflow-hidden"}`}
            aria-label="Welcome"
        >
            <div className="flex w-full min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-8">
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-6 py-4 xl:px-8 xl:py-4.5 xl:pr-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted flex items-center gap-2">
                        <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-sm leading-none bg-primary/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                            aria-hidden
                        >
                            {resolvedEyebrowIcon}
                        </span>
                        {weekLabel}
                    </p>
                    <h1
                        className="font-display font-bold text-text leading-tight tracking-tight flex items-baseline gap-x-2.5 gap-y-1 flex-wrap"
                        style={{ textWrap: "balance" }}
                    >
                        <span className="text-lg xl:text-xl text-text-muted font-medium">
                            Welcome back,
                        </span>
                        <span className="text-[1.8rem] xl:text-[2rem] text-primary relative inline-block leading-none">
                            {displayName}
                            <span className="absolute -bottom-0.5 left-0 right-0 h-2 bg-[#88A392]/40 -z-10 rounded-sm -rotate-1" />
                        </span>
                        {nameEmoji ? (
                            <span className="inline-flex text-2xl leading-none">{nameEmoji}</span>
                        ) : null}
                    </h1>
                    <p className="text-xs text-text-muted/90 leading-relaxed max-w-lg mt-0.5">
                        {resolvedHelperText}
                    </p>
                </div>

                <div
                    className={`hidden xl:block w-px shrink-0 self-stretch ${weekHub ? "my-4" : "my-5"}`}
                    style={{ background: "color-mix(in srgb, var(--dashboard-border) 65%, transparent)" }}
                    aria-hidden
                />

                <div
                    className={`w-full shrink-0 ${
                        weekHub
                            ? "px-6 pb-4 pt-0 xl:w-[min(100%,380px)] xl:px-8 xl:pb-4.5 xl:pt-4 xl:pl-4"
                            : "px-6 pb-4 pt-0 xl:w-[min(100%,380px)] xl:px-8 xl:py-4.5 xl:pl-2 xl:pb-4.5 xl:pt-4"
                    }`}
                >
                    {teacherStats ? (
                        <TeacherWelcomeStats stats={teacherStats} />
                    ) : momentum ? (
                        <MomentumCard variant="header" embedded borderless={weekHub} {...momentum} />
                    ) : null}
                </div>
            </div>
        </section>
    );
}

function TeacherWelcomeStats({ stats }: { stats: DashboardWelcomeHeroTeacherStatsProps }) {
    const pendingReviews = stats.pendingReviews ?? 0;
    const hasPendingReviews = pendingReviews > 0;
    const spanOpenSlot = !hasPendingReviews || !stats.showBackendLink;

    return (
        <div className="grid grid-cols-2 gap-2.5">
            <TeacherStatTile
                label="Students"
                value={stats.activeStudents}
                suffix="active"
                icon={<UsersIcon size={16} />}
                toneClassName="text-secondary"
            />
            <TeacherStatTile
                label="Classes"
                value={stats.totalClasses}
                suffix="total"
                icon={<StarIcon size={16} />}
                toneClassName="text-info"
            />
            {hasPendingReviews ? (
                <TeacherStatTile
                    href="/dashboard/stats"
                    label="Reviews"
                    value={pendingReviews}
                    suffix="new"
                    icon={<ClipboardIcon size={16} />}
                    toneClassName="text-warning"
                    className={spanOpenSlot ? "col-span-2" : undefined}
                />
            ) : null}
            {stats.showBackendLink ? (
                <Link
                    href="/dashboard/backend"
                    className={`dashboard-pill stats-badge-polish flex min-h-[58px] items-center gap-2.5 border-primary/30 px-3 py-2 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${spanOpenSlot ? "col-span-2" : ""}`}
                    style={{ backgroundColor: "var(--dashboard-surface-start)" }}
                >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <BarChartIcon size={16} />
                    </span>
                    <span className="min-w-0 leading-tight">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">Admin</span>
                        <span className="block text-sm font-bold text-primary">Backend Users</span>
                    </span>
                </Link>
            ) : null}
        </div>
    );
}

function TeacherStatTile({
    href,
    label,
    value,
    suffix,
    icon,
    toneClassName,
    className,
}: {
    href?: string;
    label: string;
    value: number;
    suffix: string;
    icon: ReactNode;
    toneClassName: string;
    className?: string;
}) {
    const content = (
        <>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 ${toneClassName}`}>
                {icon}
            </span>
            <span className="min-w-0 leading-tight">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">{label}</span>
                <span className="block text-lg font-bold text-text tabular-nums">
                    {value} <span className="text-xs font-semibold text-text-muted">{suffix}</span>
                </span>
            </span>
        </>
    );

    const tileClassName = `dashboard-pill stats-badge-polish flex min-h-[58px] items-center gap-2.5 px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${className ?? ""}`;

    if (href) {
        return (
            <Link href={href} className={tileClassName}>
                {content}
            </Link>
        );
    }

    return <div className={tileClassName}>{content}</div>;
}
