"use client";

import { Check, ChevronDown, ChevronRight } from "lucide-react";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { ActivityLink } from "@/components/navigation/ActivityLink";
import type { CourseMapUnit } from "@/lib/course-map";
import type { CourseMapProgressState } from "@/lib/course-map-progress";
import {
    buildMapReturnHref,
    COURSE_MAP_OPEN_WEEK_EVENT,
    type CourseMapOpenWeekDetail,
    focusMapWeekHeading,
    isMapActivityActionable,
    isMapActivityCompleted,
    parseMapWeekFromHash,
    scrollToMapTarget,
    syncMapUrl,
} from "@/lib/course-map-navigation";
import {
    readCourseMapSessionState,
    resolveInitialMapOpenWeek,
    writeCourseMapSessionState,
} from "@/lib/course-map-session-state";
import {
    type GuidedAssignmentInfo,
    type PathActivity,
    type UnitGroup,
    type UnitSummary,
    type WeekSummary,
    CoursePathReturnHrefContext,
    activityTypeIcon,
    flattenRequired,
} from "./course-path/shared";
import { DesktopUnitSection } from "./course-path/desktop";
import { MobileUnitSection } from "./course-path/mobile";

interface Props {
    assignments: PathActivity[];
    guidedUnits?: CourseMapUnit[];
    guidedAssignments?: Record<string, GuidedAssignmentInfo>;
    guidedProgress?: CourseMapProgressState;
    desktopLayout?: boolean;
    initialWeek?: number | null;
    focusNextActivity?: boolean;
    mobileWayfinding?: ReactNode;
    /** School-year month labels (e.g. September) — classroom only */
    showUnitMonths?: boolean;
}


function GuidedCoursePath({
    guidedUnits,
    guidedAssignments,
    guidedProgress,
    desktopLayout = false,
    initialWeek = null,
    focusNextActivity = false,
    mobileWayfinding,
    showUnitMonths = true,
}: {
    guidedUnits: CourseMapUnit[];
    guidedAssignments: Record<string, GuidedAssignmentInfo>;
    guidedProgress: CourseMapProgressState;
    desktopLayout?: boolean;
    initialWeek?: number | null;
    focusNextActivity?: boolean;
    mobileWayfinding?: ReactNode;
    showUnitMonths?: boolean;
}) {
    const pathname = usePathname();
    const requiredActivities = useMemo(() => flattenRequired(guidedUnits), [guidedUnits]);
    const completedRequired = requiredActivities.filter((activity) =>
        isMapActivityCompleted(activity, guidedProgress)
    ).length;
    const firstIncomplete = requiredActivities.find((activity) =>
        isMapActivityActionable(activity) && !isMapActivityCompleted(activity, guidedProgress)
    );
    const hasAnyCompleted = completedRequired > 0;
    const currentLabel = hasAnyCompleted ? "Next up" : "Start here";
    const currentId = firstIncomplete?.id ?? null;
    const weekSummaries = useMemo<WeekSummary[]>(() => (
        guidedUnits.flatMap((unit) =>
            unit.levels.map((level) => {
                const actionableRequired = level.requiredActivities.filter(isMapActivityActionable);
                const requiredDone = actionableRequired.filter((activity) =>
                    isMapActivityCompleted(activity, guidedProgress)
                ).length;
                const requiredTotal = actionableRequired.length;
                return {
                    unitNumber: unit.unitNumber,
                    unitTitle: unit.unitTitle,
                    unitMonth: unit.month,
                    level,
                    requiredDone,
                    requiredTotal,
                    hasCurrent: level.requiredActivities.some((activity) => activity.id === currentId),
                    isDone: requiredTotal > 0 && requiredDone === requiredTotal,
                };
            })
        )
    ), [guidedUnits, guidedProgress, currentId]);

    const unitSummaries = useMemo<UnitSummary[]>(() => {
        const map = new Map<number, UnitSummary>();
        for (const week of weekSummaries) {
            if (!map.has(week.unitNumber)) {
                map.set(week.unitNumber, {
                    unitNumber: week.unitNumber,
                    unitTitle: week.unitTitle,
                    unitMonth: week.unitMonth,
                    weeks: [],
                    doneWeeks: 0,
                    totalWeeks: 0,
                    hasCurrent: false,
                    status: "todo",
                });
            }
            const u = map.get(week.unitNumber)!;
            u.weeks.push(week);
            u.totalWeeks++;
            if (week.isDone) u.doneWeeks++;
            if (week.hasCurrent) u.hasCurrent = true;
        }
        for (const u of map.values()) {
            u.status = u.doneWeeks === u.totalWeeks && u.totalWeeks > 0
                ? "done"
                : u.hasCurrent
                    ? "current"
                    : "todo";
        }
        return Array.from(map.values());
    }, [weekSummaries]);

    const currentWeek = weekSummaries.find((week) => week.hasCurrent) ?? weekSummaries.find((week) => !week.isDone) ?? weekSummaries[0];
    const currentUnit = unitSummaries.find((u) => u.hasCurrent) ?? unitSummaries.find((u) => u.status !== "done") ?? unitSummaries[0];
    const progressWeekNumber = currentWeek?.level.levelNumber ?? null;
    const resolveOpenWeek = () =>
        resolveInitialMapOpenWeek({
            initialWeek,
            hashWeek: typeof window !== "undefined" ? parseMapWeekFromHash(window.location.hash) : null,
            progressWeek: progressWeekNumber,
        });
    const [openUnitNumber, setOpenUnitNumber] = useState<number | null>(() => currentUnit?.unitNumber ?? null);
    const [mobileOpenWeek, setMobileOpenWeek] = useState<number | null>(resolveOpenWeek);
    const [mobileOptionalOpen, setMobileOptionalOpen] = useState<Record<number, boolean>>({});
    const [desktopSelectedWeek, setDesktopSelectedWeek] = useState<number | null>(resolveOpenWeek);
    const [desktopOptionalOpen, setDesktopOptionalOpen] = useState<Record<number, boolean>>({});
    const [pulseCurrentActivity, setPulseCurrentActivity] = useState(focusNextActivity);
    const didInitialScroll = useRef(false);

    const openDesktopWeek = desktopSelectedWeek;
    const activeWeekNumber = desktopLayout
        ? (openDesktopWeek ?? currentWeek?.level.levelNumber ?? null)
        : (mobileOpenWeek ?? currentWeek?.level.levelNumber ?? null);
    const mapReturnHref =
        pathname === "/dashboard/map" && activeWeekNumber != null
            ? buildMapReturnHref(activeWeekNumber, true)
            : null;

    const navigateToWeek = useCallback((weekNumber: number, focusActivity = false) => {
        const parentUnit = weekSummaries.find((w) => w.level.levelNumber === weekNumber);
        if (parentUnit) setOpenUnitNumber(parentUnit.unitNumber);
        if (desktopLayout) {
            setDesktopSelectedWeek(weekNumber);
        } else {
            setMobileOpenWeek(weekNumber);
        }
        window.requestAnimationFrame(() => {
            scrollToMapTarget(`week-${weekNumber}`);
            if (focusActivity) {
                setPulseCurrentActivity(true);
                window.requestAnimationFrame(() => scrollToMapTarget("map-activity-current"));
            } else {
                focusMapWeekHeading(weekNumber);
            }
        });
    }, [desktopLayout, weekSummaries]);

    useEffect(() => {
        if (didInitialScroll.current) return;
        const hashWeek = parseMapWeekFromHash(window.location.hash);
        const explicitWeek = initialWeek ?? hashWeek;

        if (explicitWeek || focusNextActivity) {
            const targetWeek = explicitWeek ?? progressWeekNumber;
            if (targetWeek == null) return;
            didInitialScroll.current = true;
            navigateToWeek(targetWeek, focusNextActivity);
            return;
        }

        const session = readCourseMapSessionState();
        if (session?.week) {
            didInitialScroll.current = true;
            navigateToWeek(session.week, false);
            if (session.scrollY > 0) {
                window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(() => {
                        window.scrollTo({ top: session.scrollY, behavior: "auto" });
                    });
                });
            }
        }
    }, [focusNextActivity, initialWeek, navigateToWeek, progressWeekNumber]);

    useEffect(() => {
        if (pathname !== "/dashboard/map") return;
        if (activeWeekNumber == null) return;
        writeCourseMapSessionState(activeWeekNumber, window.scrollY);

        let timeout: number;
        const onScroll = () => {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(() => {
                writeCourseMapSessionState(activeWeekNumber, window.scrollY);
            }, 150);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.clearTimeout(timeout);
        };
    }, [activeWeekNumber, pathname]);

    useEffect(() => {
        if (!pulseCurrentActivity) return;
        const timeout = window.setTimeout(() => setPulseCurrentActivity(false), 2400);
        return () => window.clearTimeout(timeout);
    }, [pulseCurrentActivity]);

    useEffect(() => {
        if (pathname !== "/dashboard/map") return;
        syncMapUrl(activeWeekNumber, Boolean(pulseCurrentActivity));
    }, [activeWeekNumber, pathname, pulseCurrentActivity]);

    useEffect(() => {
        const handler = (event: Event) => {
            const detail = (event as CustomEvent<CourseMapOpenWeekDetail>).detail;
            if (!detail?.week) return;
            navigateToWeek(detail.week, detail.focusActivity);
        };
        window.addEventListener(COURSE_MAP_OPEN_WEEK_EVENT, handler);
        return () => window.removeEventListener(COURSE_MAP_OPEN_WEEK_EVENT, handler);
    }, [navigateToWeek]);

    let content: ReactNode;

    if (!desktopLayout) {
        content = (
            <div className="space-y-3">
                {mobileWayfinding}

                <div className="space-y-3">
                    {unitSummaries.map((unit) => (
                        <MobileUnitSection
                            key={unit.unitNumber}
                            unit={unit}
                            isOpen={openUnitNumber === unit.unitNumber}
                            openWeekNumber={mobileOpenWeek}
                            openOptional={mobileOptionalOpen}
                            currentId={currentId}
                            currentLabel={currentLabel}
                            guidedAssignments={guidedAssignments}
                            guidedProgress={guidedProgress}
                            showUnitMonths={showUnitMonths}
                            onToggle={() =>
                                setOpenUnitNumber((prev) =>
                                    prev === unit.unitNumber ? null : unit.unitNumber
                                )
                            }
                            onWeekToggle={(weekNumber) =>
                                setMobileOpenWeek((prev) =>
                                    prev === weekNumber ? null : weekNumber
                                )
                            }
                            onOptionalToggle={(weekNumber) =>
                                setMobileOptionalOpen((prev) => ({
                                    ...prev,
                                    [weekNumber]: !prev[weekNumber],
                                }))
                            }
                        />
                    ))}
                </div>
            </div>
        );
    } else {
        content = (
        <div className="space-y-4">
            {unitSummaries.map((unit) => (
                <DesktopUnitSection
                    key={unit.unitNumber}
                    unit={unit}
                    isOpen={openUnitNumber === unit.unitNumber}
                    openWeekNumber={desktopSelectedWeek}
                    openOptional={desktopOptionalOpen}
                    currentId={currentId}
                    currentLabel={currentLabel}
                    guidedAssignments={guidedAssignments}
                    guidedProgress={guidedProgress}
                    pulseCurrentActivity={pulseCurrentActivity}
                    showUnitMonths={showUnitMonths}
                    onToggle={() =>
                        setOpenUnitNumber((prev) =>
                            prev === unit.unitNumber ? null : unit.unitNumber
                        )
                    }
                    onWeekToggle={(weekNumber) =>
                        setDesktopSelectedWeek((prev) =>
                            prev === weekNumber ? null : weekNumber
                        )
                    }
                    onOptionalToggle={(weekNumber) =>
                        setDesktopOptionalOpen((prev) => ({
                            ...prev,
                            [weekNumber]: !prev[weekNumber],
                        }))
                    }
                />
            ))}
        </div>
        );
    }

    return (
        <CoursePathReturnHrefContext.Provider value={mapReturnHref}>
            {content}
        </CoursePathReturnHrefContext.Provider>
    );
}

function LegacyCoursePath({ assignments }: { assignments: PathActivity[] }) {
    const sequenced = assignments
        .filter((a) => a.sequenceNumber != null)
        .sort((a, b) => (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0));

    const unsequenced = assignments.filter((a) => a.sequenceNumber == null);

    const units = useMemo<UnitGroup[]>(() => {
        const groups: UnitGroup[] = [];
        const seen = new Map<string, UnitGroup>();
        for (const a of sequenced) {
            const label = a.unitLabel || "Course Activities";
            if (!seen.has(label)) {
                const group: UnitGroup = { label, activities: [] };
                groups.push(group);
                seen.set(label, group);
            }
            seen.get(label)!.activities.push(a);
        }
        return groups;
    }, [sequenced]);

    const nextUpId = useMemo(() => {
        return sequenced.find((a) => !a.isCompleted)?.id ?? null;
    }, [sequenced]);

    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const toggle = (label: string) =>
        setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));

    if (sequenced.length === 0 && unsequenced.length === 0) return null;
    if (sequenced.length === 0) return null;

    return (
        <div className="dashboard-panel rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text">Your Course Path</h3>
                <span className="text-xs font-medium text-text-muted">Next activity highlighted</span>
            </div>

            <div className="space-y-4">
                {units.map((unit) => {
                    const unitDone = unit.activities.filter((a) => a.isCompleted).length;
                    const unitTotal = unit.activities.length;
                    const isUnitDone = unitDone === unitTotal;
                    const isOpen = !collapsed[unit.label];
                    const hasNextUp = unit.activities.some((a) => a.id === nextUpId);

                    return (
                        <div key={unit.label}>
                            <button
                                onClick={() => toggle(unit.label)}
                                className="w-full flex items-center gap-2 text-left group"
                                aria-expanded={isOpen}
                            >
                                <span
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-colors ${
                                        isUnitDone
                                            ? "border-[var(--tone-grammar-accent,#b05740)] bg-[var(--tone-grammar-chip-bg,#f5ede8)] text-[var(--tone-grammar-accent,#b05740)]"
                                            : hasNextUp
                                              ? "border-[var(--tone-vocab-accent,#6a8d73)] bg-[var(--tone-vocab-chip-bg,#eef3ee)] text-[var(--tone-vocab-accent,#6a8d73)]"
                                              : "border-[var(--border-subtle,#ddd6ca)] bg-[var(--surface-subtle,#f8f4ef)] text-text-muted"
                                    }`}
                                >
                                    {isUnitDone ? <Check size={10} /> : unitDone}
                                </span>
                                <span className="flex-1 text-xs font-semibold tracking-wide uppercase text-text-muted">
                                    {unit.label}
                                </span>
                                {isOpen ? (
                                    <ChevronDown size={13} className="text-text-muted shrink-0" />
                                ) : (
                                    <ChevronRight size={13} className="text-text-muted shrink-0" />
                                )}
                            </button>

                            {isOpen && (
                                <div className="relative mt-2 pl-5">
                                    <div
                                        className="absolute left-[9px] top-1 bottom-1 w-px rounded-full"
                                        style={{ background: "var(--border-subtle, #ddd6ca)" }}
                                    />

                                    <div className="space-y-1.5">
                                        {unit.activities.map((activity) => {
                                            const isNext = activity.id === nextUpId;
                                            const label = activity.title || activity.activity.title;
                                            const icon = activityTypeIcon(
                                                activity.activity.type,
                                                activity.activity.category
                                            );

                                            return (
                                                <div key={activity.id} className="relative flex items-center gap-2.5">
                                                    <div
                                                        className={`absolute -left-5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors ${
                                                            activity.isCompleted
                                                                ? "border-[var(--tone-grammar-accent,#b05740)] bg-[var(--tone-grammar-chip-bg,#f5ede8)]"
                                                                : isNext
                                                                  ? "border-[var(--tone-vocab-accent,#6a8d73)] bg-[var(--tone-vocab-chip-bg,#eef3ee)]"
                                                                  : "border-[var(--border-subtle,#ddd6ca)] bg-[var(--surface-subtle,#f8f4ef)]"
                                                        }`}
                                                    >
                                                        {activity.isCompleted ? (
                                                            <Check
                                                                size={9}
                                                                className="text-[var(--tone-grammar-accent,#b05740)]"
                                                            />
                                                        ) : isNext ? (
                                                            <span className="block h-2 w-2 rounded-full bg-[var(--tone-vocab-accent,#6a8d73)]" />
                                                        ) : (
                                                            <span className="block h-1.5 w-1.5 rounded-full bg-[var(--border-subtle,#ddd6ca)]" />
                                                        )}
                                                    </div>

                                                    <ActivityLink
                                                        activityId={activity.activityId}
                                                        assignmentId={activity.id}
                                                        className={`flex flex-1 items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-all duration-150 ${
                                                            activity.isCompleted
                                                                ? "text-text-muted opacity-70 hover:opacity-90"
                                                                : isNext
                                                                  ? "font-semibold text-text bg-[var(--tone-vocab-surface,rgba(106,141,115,0.06))] hover:bg-[var(--tone-vocab-surface,rgba(106,141,115,0.1))]"
                                                                  : "text-text-muted hover:text-text hover:bg-surface-subtle"
                                                        }`}
                                                    >
                                                        <span className="shrink-0 text-base leading-none" aria-hidden>
                                                            {icon}
                                                        </span>
                                                        <span className={`flex-1 leading-snug ${activity.isCompleted ? "line-through" : ""}`}>
                                                            {label}
                                                        </span>
                                                        {isNext && (
                                                            <span className="shrink-0 rounded-full bg-[var(--tone-vocab-chip-bg,#eef3ee)] px-2 py-0.5 text-[10px] font-bold text-[var(--tone-vocab-accent,#6a8d73)]">
                                                                Next up
                                                            </span>
                                                        )}
                                                    </ActivityLink>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {unsequenced.length > 0 && (
                <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--border-subtle, #ddd6ca)" }}>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                        More Activities
                    </p>
                    <div className="space-y-1">
                        {unsequenced.map((a) => (
                            <ActivityLink
                                key={a.id}
                                activityId={a.activityId}
                                assignmentId={a.id}
                                className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm text-text-muted hover:text-text hover:bg-surface-subtle transition-colors"
                            >
                                <span className="shrink-0 text-base leading-none" aria-hidden>
                                    {activityTypeIcon(a.activity.type, a.activity.category)}
                                </span>
                                <span className="flex-1 leading-snug">{a.title || a.activity.title}</span>
                                {a.isCompleted && <Check size={12} className="shrink-0 text-text-muted" />}
                            </ActivityLink>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function ClassCoursePath({
    assignments,
    guidedUnits = [],
    guidedAssignments = {},
    guidedProgress = {},
    desktopLayout = false,
    initialWeek = null,
    focusNextActivity = false,
    mobileWayfinding,
    showUnitMonths = true,
}: Props) {
    if (guidedUnits.length > 0) {
        return (
            <GuidedCoursePath
                guidedUnits={guidedUnits}
                guidedAssignments={guidedAssignments}
                guidedProgress={guidedProgress}
                desktopLayout={desktopLayout}
                initialWeek={initialWeek}
                focusNextActivity={focusNextActivity}
                mobileWayfinding={mobileWayfinding}
                showUnitMonths={showUnitMonths}
            />
        );
    }

    return <LegacyCoursePath assignments={assignments} />;
}
