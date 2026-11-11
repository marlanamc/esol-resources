import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/layout/LogoutButton";
import { BackButton } from "@/components/ui/BackButton";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { timedQuery } from "@/lib/shared/perf-log";
import { GradebookClient } from "./GradebookClient";
import { loadGradebookRoster } from "@/lib/teach/gradebook-roster";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

function parsePositiveInt(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return parsed;
}

export default async function GradebookPage({
    searchParams,
}: {
    searchParams: Promise<{ classId?: string; page?: string; pageSize?: string; q?: string }>;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = session.user?.role || "student";
    const userId = session.user?.id;
    const admin = isAdmin(session.user);

    if (!canUseTeacherTools(session.user)) {
        redirect("/dashboard");
    }

    const params = await searchParams;
    const selectedClassId = params.classId || null;
    const searchQuery = (params.q || "").trim();
    const requestedPage = parsePositiveInt(params.page, DEFAULT_PAGE);
    const requestedPageSize = Math.min(MAX_PAGE_SIZE, parsePositiveInt(params.pageSize, DEFAULT_PAGE_SIZE));

    const classes = await timedQuery(
        {
            route: "/dashboard/gradebook",
            queryLabel: "class.findMany.gradebookClasses",
            userRole,
        },
        () =>
            withPrismaReadRetry(() =>
                prisma.class.findMany({
                    where: admin ? {} : { teacherId: userId },
                    select: {
                        id: true,
                        name: true,
                    },
                })
            ),
        (result) => result.length
    );

    const filteredClasses = selectedClassId
        ? classes.filter((c) => c.id === selectedClassId)
        : classes;

    const classOptions = classes.map((c) => ({
        id: c.id,
        name: c.name,
    }));

    const gradebook = await loadGradebookRoster(
        filteredClasses.map((c) => c.id), searchQuery, requestedPage, requestedPageSize
    );

    return (
        <div className="min-h-dvh bg-bg">
            <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm z-50">
                <div className="container mx-auto max-w-[1400px] py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <BackButton href="/dashboard/stats" className="mb-1">Back to Stats</BackButton>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-text mt-1">
                            Weekly Quiz Gradebook
                        </h1>
                        <p className="text-sm text-text-muted">
                            Best weekly quiz scores, ordered by week.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
                <GradebookClient
                    diagnosticsBasePath={null}
                    {...gradebook}
                    classes={classOptions}
                    selectedClassId={selectedClassId}
                    searchQuery={searchQuery}
                />
            </main>
        </div>
    );
}
