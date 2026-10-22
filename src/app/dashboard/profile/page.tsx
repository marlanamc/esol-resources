import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/database/prisma";
import { trackLogin } from "@/lib/gamification/gamification";
import { normalizeGuideTitle } from "@/lib/grammar-activity-resolution";
import { getEffectiveStreak } from "@/lib/gamification/streak-utils";
import Link from "next/link";
import { StatCard } from "@/components/ui/StatCard";
import { ClickableAvatarDisplay } from "@/components/ui/ClickableAvatarDisplay";
import { getVisibleMap, type CourseMapUnit } from "@/lib/course-map";
import { enrichCourseMapUnitsWithGrammarIds } from "@/lib/course-map-progress.server";
import { isLearnerVisibleActivity } from "@/lib/learner/visibility";
import { getProfileCourseMapProgress } from "@/lib/course-map-week";
import { getStudentWeeklyQuizCatchUp } from "@/lib/learner/weekly-quiz-status";
import { WeeklyQuizCatchUpCard } from "@/components/dashboard/WeeklyQuizCatchUpCard";
import { ProfileCourseMapCard } from "@/components/profile/ProfileCourseMapCard";
import { ProfileQuizGrades } from "@/components/profile/ProfileQuizGrades";
import { ProfileStreakWeek } from "@/components/profile/ProfileStreakWeek";
import { Trophy, Flame, BookOpen, Target, Check, ChevronRight } from "lucide-react";

// Force dynamic rendering to show real-time activity data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ParsedActivityContent {
    released?: boolean;
    miniQuiz?: unknown;
}

interface QuizGradeRow {
    id: string;
    title: string;
    score: number | null;
    submittedAt: Date | null;
}

const parseActivityContent = (content: string): ParsedActivityContent | null => {
    try {
        const parsed: unknown = JSON.parse(content);
        if (!parsed || typeof parsed !== "object") return null;
        return parsed as ParsedActivityContent;
    } catch {
        return null;
    }
};

const hasMiniQuiz = (content: string): boolean => {
    const parsed = parseActivityContent(content);
    return Boolean(parsed?.miniQuiz);
};

function collectVisibleMapActivityIds(units: CourseMapUnit[]): Set<string> {
    const ids = new Set<string>();
    for (const unit of units) {
        for (const level of unit.levels) {
            for (const item of [...level.requiredActivities, ...(level.extraPractice ?? [])]) {
                if (item.activityId) ids.add(item.activityId);
            }
        }
    }
    return ids;
}

const cleanGuideTitle = (title: string): string => {
    return title
        .replace(/\s*-\s*Complete Guide$/i, "")
        .replace(/\s+Guide$/i, "")
        .replace(/\s+/g, " ")
        .trim();
};

const getOrderedGrammarGuidesForActivities = <T extends { title: string }>(guides: T[]): T[] => {
    const normalizeTitle = (title?: string | null) => cleanGuideTitle(title || "").toLowerCase();
    const sortAlpha = (list: T[]) =>
        list.sort((a, b) => cleanGuideTitle(a.title || "").localeCompare(cleanGuideTitle(b.title || "")));

    const sortByTenseOrder = (list: T[]) => {
        const order = ["present", "past", "future", "review"];
        const getOrder = (t: string) => {
            for (let i = 0; i < order.length; i++) {
                if (t.includes(order[i])) return i;
            }
            return order.length;
        };

        return list.sort((a, b) => {
            const aNorm = normalizeTitle(a.title);
            const bNorm = normalizeTitle(b.title);
            const aIdx = getOrder(aNorm);
            const bIdx = getOrder(bNorm);
            if (aIdx !== bIdx) return aIdx - bIdx;
            return cleanGuideTitle(a.title || "").localeCompare(cleanGuideTitle(b.title || ""));
        });
    };

    const sortByKeywordOrder = (list: T[], keywordsInOrder: string[]) => {
        const getKeywordIndex = (t: string) => {
            for (let i = 0; i < keywordsInOrder.length; i++) {
                if (t.includes(keywordsInOrder[i])) return i;
            }
            return keywordsInOrder.length;
        };

        return list.sort((a, b) => {
            const aNorm = normalizeTitle(a.title);
            const bNorm = normalizeTitle(b.title);
            const aIdx = getKeywordIndex(aNorm);
            const bIdx = getKeywordIndex(bNorm);
            if (aIdx !== bIdx) return aIdx - bIdx;
            return cleanGuideTitle(a.title || "").localeCompare(cleanGuideTitle(b.title || ""));
        });
    };

    const remaining = [...guides];
    const take = (predicate: (guide: T) => boolean) => {
        const matched: T[] = [];
        for (let i = remaining.length - 1; i >= 0; i--) {
            const item = remaining[i];
            if (predicate(item)) {
                matched.push(item);
                remaining.splice(i, 1);
            }
        }
        return matched.reverse();
    };

    const simple = sortByTenseOrder(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("simple") && !t.includes("vs");
        })
    );
    const perfectContinuous = sortByTenseOrder(take((guide) => normalizeTitle(guide.title).includes("perfect continuous")));
    const continuous = sortByTenseOrder(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("continuous") && !t.includes("perfect continuous") && !t.includes("vs");
        })
    );
    const perfect = sortByTenseOrder(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("perfect") && !t.includes("continuous") && !t.includes("vs");
        })
    );

    const mixedAllTenses = sortAlpha(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            if (t.includes("gerund") || t.includes("infinitive")) return false;
            return t.includes("tenses") || t.includes("review") || t.includes(" vs ");
        })
    );
    const questionsAndCommands = sortByKeywordOrder(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("question") || t.includes("imperative") || t.includes("declarative");
        }),
        ["information questions", "imperatives", "declaratives"]
    );
    const conditionals = sortByKeywordOrder(
        take((guide) => normalizeTitle(guide.title).includes("conditional")),
        ["zero", "first", "second", "third"]
    );
    const modals = sortAlpha(take((guide) => normalizeTitle(guide.title).includes("modal")));
    const habitsAndPreferences = sortAlpha(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("used to") || t.includes("would rather");
        })
    );
    const voiceAndReporting = sortByKeywordOrder(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("passive") || t.includes("reported");
        }),
        ["passive", "reported"]
    );
    const gerundsAndInfinitives = sortByKeywordOrder(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("gerund") || t.includes("infinitive");
        }),
        ["infinitives vs gerunds", "verbs + gerunds", "gerunds after prepositions"]
    );
    const phrasalVerbs = sortAlpha(take((guide) => normalizeTitle(guide.title).includes("phrasal")));
    const wordsAndQuantity = sortByKeywordOrder(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("parts of speech") || t.includes("superlative") || t.includes("quantifier");
        }),
        ["parts of speech", "superlatives", "quantifiers"]
    );
    const writingMechanics = sortByKeywordOrder(
        take((guide) => {
            const t = normalizeTitle(guide.title);
            return t.includes("punctuation") || t.includes("capitalization") || t.includes("paragraph");
        }),
        ["punctuation", "capitalization", "paragraph"]
    );

    const otherGrammar = sortAlpha(remaining);
    return [
        ...simple,
        ...continuous,
        ...perfect,
        ...perfectContinuous,
        ...mixedAllTenses,
        ...sortAlpha([...questionsAndCommands, ...modals, ...voiceAndReporting]),
        ...gerundsAndInfinitives,
        ...sortAlpha([...phrasalVerbs, ...habitsAndPreferences]),
        ...conditionals,
        ...sortAlpha(wordsAndQuantity),
        ...sortAlpha([...writingMechanics, ...otherGrammar]),
    ];
};

const getVerbQuizOrder = (title: string): number => {
    const weekMatch = title.match(/(\d+)/);
    return weekMatch ? Number(weekMatch[1]) : Number.MAX_SAFE_INTEGER;
};

/** The streak card shows the last 7 days; 8 covers any time-zone offset. */
const getStreakWindowStart = (): Date => new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = session.user?.role || "student";
    const userId = session.user?.id;

    if (!userId) {
        redirect("/login");
    }

    // Count daily app opens toward streak even when session is still active.
    await trackLogin(userId);

    // Get user data with stats
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            classes: {
                include: {
                    class: true,
                },
            },
            _count: {
                select: {
                    submissions: true,
                    classes: true,
                },
            },
        },
    });

    if (!user) {
        redirect("/login");
    }

    // Run all independent database queries in parallel to eliminate async waterfall
    const streakWindowStart = getStreakWindowStart();
    const [
        pointsLedgerDates,
        activityProgressDates,
        releasedVerbQuizActivitiesRaw,
        releasedGrammarGuideActivities,
        verbQuizSubmissions,
        grammarQuizSubmissions,
        visibleMapUnits,
        courseMapProgress,
        weeklyQuizCatchUp,
    ] = await Promise.all([
        // Get activity dates for streak calendar - PointsLedger (for completed activities)
        prisma.pointsLedger.findMany({
            where: { userId, createdAt: { gte: streakWindowStart } },
            select: { createdAt: true },
        }),
        // Get activity dates for streak calendar - ActivityProgress updates (for any activity)
        prisma.activityProgress.findMany({
            where: { userId, updatedAt: { gte: streakWindowStart } },
            select: { updatedAt: true },
        }),
        prisma.activity.findMany({
            where: {
                type: "quiz",
                category: "quizzes",
                deletedAt: null,
                OR: [
                    { content: { contains: '"type":"verb-quiz"' } },
                    { content: { contains: '"type":"weekly-quiz"' } },
                ],
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                type: true,
                category: true,
                isReleased: true,
                deletedAt: true,
            },
            orderBy: { createdAt: "asc" },
        }),
        prisma.activity.findMany({
            where: {
                type: "guide",
                category: "grammar",
                deletedAt: null,
                isReleased: true,
            },
            select: {
                id: true,
                title: true,
                content: true,
                type: true,
                category: true,
                isReleased: true,
                deletedAt: true,
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.submission.findMany({
            where: {
                userId,
                score: { not: null },
                activity: {
                    type: "quiz",
                    category: "quizzes",
                    OR: [
                        { content: { contains: '"type":"verb-quiz"' } },
                        { content: { contains: '"type":"weekly-quiz"' } },
                    ],
                },
            },
            select: {
                activityId: true,
                score: true,
                updatedAt: true,
            },
            orderBy: { updatedAt: "desc" },
        }),
        prisma.submission.findMany({
            where: {
                userId,
                score: { not: null },
                activity: {
                    type: "guide",
                    category: "grammar",
                },
            },
            select: {
                activityId: true,
                score: true,
                updatedAt: true,
                activity: {
                    select: {
                        title: true,
                    },
                },
            },
            orderBy: { updatedAt: "desc" },
        }),
        getVisibleMap({ id: userId, role: userRole }).then(({ units }) =>
            enrichCourseMapUnitsWithGrammarIds(units)
        ),
        getProfileCourseMapProgress({ id: userId, role: userRole }).catch((error) => {
            console.error("[Profile] Course map progress unavailable", error);
            return null;
        }),
        getStudentWeeklyQuizCatchUp(userId).catch((error) => {
            console.error("[Profile] Weekly quiz catch-up unavailable", error);
            return { missing: [], notPerfect: [] };
        }),
    ]);

    // Combine both date sources
    const activityDates = [
        ...pointsLedgerDates.map(p => p.createdAt),
        ...activityProgressDates.map(p => p.updatedAt),
    ];

    const visibleMapActivityIds = collectVisibleMapActivityIds(visibleMapUnits);

    const releasedVerbQuizActivities = releasedVerbQuizActivitiesRaw
        .filter((activity) => isLearnerVisibleActivity(activity))
        .sort((a, b) => getVerbQuizOrder(a.title) - getVerbQuizOrder(b.title));

    const latestVerbSubmissionByActivityId = new Map<string, { score: number; submittedAt: Date }>();
    for (const submission of verbQuizSubmissions) {
        if (submission.score === null) continue;
        const existing = latestVerbSubmissionByActivityId.get(submission.activityId);
        if (!existing || submission.updatedAt > existing.submittedAt) {
            latestVerbSubmissionByActivityId.set(submission.activityId, {
                score: submission.score,
                submittedAt: submission.updatedAt,
            });
        }
    }

    const verbQuizGrades: QuizGradeRow[] = releasedVerbQuizActivities
        .filter((activity) =>
            visibleMapActivityIds.has(activity.id) || latestVerbSubmissionByActivityId.has(activity.id)
        )
        .map((activity) => {
        const submission = latestVerbSubmissionByActivityId.get(activity.id);
        return {
            id: activity.id,
            title: activity.title,
            score: submission?.score ?? null,
            submittedAt: submission?.submittedAt ?? null,
        };
    });

    const orderedReleasedGrammarGuideActivities = getOrderedGrammarGuidesForActivities(releasedGrammarGuideActivities);
    const miniQuizEligibleActivities = orderedReleasedGrammarGuideActivities.filter((activity) =>
        hasMiniQuiz(activity.content) && isLearnerVisibleActivity(activity)
    );

    const miniQuizEligibleIds = new Set(miniQuizEligibleActivities.map((activity) => activity.id));
    const miniQuizEligibleIdByTitle = new Map(
        miniQuizEligibleActivities.map((activity) => [normalizeGuideTitle(activity.title), activity.id] as const)
    );

    const latestMiniQuizSubmissionByActivityId = new Map<string, { score: number; submittedAt: Date }>();
    for (const submission of grammarQuizSubmissions) {
        if (submission.score === null) continue;

        const canonicalActivityId = miniQuizEligibleIds.has(submission.activityId)
            ? submission.activityId
            : miniQuizEligibleIdByTitle.get(normalizeGuideTitle(submission.activity.title));

        if (!canonicalActivityId) continue;

        const existing = latestMiniQuizSubmissionByActivityId.get(canonicalActivityId);
        if (!existing || submission.updatedAt > existing.submittedAt) {
            latestMiniQuizSubmissionByActivityId.set(canonicalActivityId, {
                score: submission.score,
                submittedAt: submission.updatedAt,
            });
        }
    }

    const releasedMiniQuizActivities = miniQuizEligibleActivities.filter((activity) =>
        visibleMapActivityIds.has(activity.id) || latestMiniQuizSubmissionByActivityId.has(activity.id)
    );

    const miniQuizGrades: QuizGradeRow[] = releasedMiniQuizActivities.map((activity) => {
        const submission = latestMiniQuizSubmissionByActivityId.get(activity.id);
        return {
            id: activity.id,
            title: cleanGuideTitle(activity.title),
            score: submission?.score ?? null,
            submittedAt: submission?.submittedAt ?? null,
        };
    });

    const effectiveCurrentStreak = getEffectiveStreak(user.currentStreak, user.lastActivityDate);

    // Student view
    if (userRole === 'student') {
        const firstName = user.username ?? user.name?.split(' ')[0] ?? 'there';
        const currentWeek = courseMapProgress?.weeks.find((week) => week.isCurrent);
        const completedWeeksCount = courseMapProgress?.completedWeeksCount ?? 0;
        const stats = [
            { label: "Points", value: user.points.toLocaleString(), icon: <Trophy className="h-4 w-4" aria-hidden />, tone: "text-primary" },
            { label: "Day streak", value: effectiveCurrentStreak, icon: <Flame className="h-4 w-4" aria-hidden />, tone: "text-amber-700 dark:text-amber-300" },
            { label: completedWeeksCount === 1 ? "Week done" : "Weeks done", value: completedWeeksCount, icon: <Check className="h-4 w-4" aria-hidden />, tone: "text-emerald-700 dark:text-emerald-300" },
        ];

        return (
            <div className="min-h-dvh bg-gradient-to-br from-background via-background to-primary/5 pb-24">
                <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 sm:px-6">
                    {/* Header: who I am and my three numbers */}
                    <section className="space-y-4 rounded-2xl border border-border/60 bg-surface-elevated p-5 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="shrink-0 rounded-full bg-primary p-[3px]">
                                <div className="rounded-full bg-white p-0.5 dark:bg-surface-base">
                                    <ClickableAvatarDisplay size="lg" />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h1 className="font-display text-[28px] font-bold leading-tight tracking-tight text-text">
                                    Hi, {firstName}!
                                </h1>
                                {currentWeek && (
                                    <p className="line-clamp-2 text-[15px] leading-snug text-text-muted">
                                        Week {currentWeek.weekNumber} · {currentWeek.title}
                                    </p>
                                )}
                            </div>
                        </div>
                        <dl className="grid grid-cols-3 gap-2">
                            {stats.map((stat) => (
                                <div key={stat.label} className="flex flex-col-reverse items-center gap-0.5 rounded-xl bg-surface-subtle px-1 py-2.5 text-center">
                                    <dt className="text-[13px] font-medium text-text-muted">{stat.label}</dt>
                                    <dd className={`flex items-center gap-1 text-xl font-extrabold tabular-nums ${stat.tone}`}>
                                        {stat.icon}
                                        {stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    {/* Weekly quiz homework: missing quizzes and retakes for 100% */}
                    <WeeklyQuizCatchUpCard catchUp={weeklyQuizCatchUp} />

                    {/* Course map: finish past weeks */}
                    {courseMapProgress && <ProfileCourseMapCard progress={courseMapProgress} />}

                    <ProfileQuizGrades weekly={[...verbQuizGrades].reverse()} mini={miniQuizGrades} />

                    <ProfileStreakWeek
                        activityDates={activityDates.map((date) => date.toISOString())}
                        currentStreak={effectiveCurrentStreak}
                    />
                </div>
            </div>
        );
    }

    // Teacher view - simplified profile
    const teacherClasses = user.classes.length;
    const teacherStats = await prisma.activity.count({
        where: { createdBy: userId },
    });

    return (
        <div className="min-h-dvh bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
                {/* Header */}
                <div className="mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-text mb-2">
                            {user.name || 'Teacher Profile'}
                        </h1>
                        <p className="text-text-muted">Your teaching overview</p>
                    </div>
                </div>

                {/* Teacher Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        label="Your Classes"
                        value={teacherClasses}
                        icon={<BookOpen />}
                        color="primary"
                    />
                    <StatCard
                        label="Activities Created"
                        value={teacherStats}
                        icon={<Trophy />}
                        color="success"
                    />
                    <StatCard
                        label="Total Students"
                        value={user._count.classes}
                        icon={<Target />}
                        color="accent"
                    />
                </div>

                {/* Quick Links */}
                <div className="bg-white/95 backdrop-blur-sm border border-border/60 rounded-xl p-6 shadow-md">
                    <h2 className="text-xl font-bold text-text mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/dashboard/classes"
                            className="flex items-center justify-between p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors group"
                        >
                            <span className="font-medium text-text">View All Classes</span>
                            <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/dashboard/stats"
                            className="flex items-center justify-between p-4 bg-success/5 hover:bg-success/10 rounded-lg transition-colors group"
                        >
                            <span className="font-medium text-text">View Analytics</span>
                            <ChevronRight className="w-5 h-5 text-success group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/dashboard/activities/new"
                            className="flex items-center justify-between p-4 bg-accent/5 hover:bg-accent/10 rounded-lg transition-colors group"
                        >
                            <span className="font-medium text-text">Create Activity</span>
                            <ChevronRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/dashboard/passwords"
                            className="flex items-center justify-between p-4 bg-warning/5 hover:bg-warning/10 rounded-lg transition-colors group"
                        >
                            <span className="font-medium text-text">Reset Passwords</span>
                            <ChevronRight className="w-5 h-5 text-warning group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

            </div>

        </div>
    );
}
