import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { timedQuery } from "@/lib/shared/perf-log";
import { GradebookClient } from "@/app/dashboard/gradebook/GradebookClient";
import { loadGradebookRoster } from "@/lib/teach/gradebook-roster";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import { resolveTeachClassId } from "@/lib/teach/active-class";

export const metadata = { title: "Gradebook | My ESOL Class" };

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

function parsePositiveInt(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return parsed;
}

export default async function TeachGradebookPage({
    searchParams,
}: {
    searchParams: Promise<{ classId?: string; page?: string; pageSize?: string; q?: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    if (!canUseTeacherTools(session.user)) redirect("/dashboard");

    const userRole = session.user.role || "student";
    const userId = session.user.id;
    const admin = isAdmin(session.user);

    const params = await searchParams;
    // The Teaching header owns the class selection; this page follows it.
    const { classId: selectedClassId } = await resolveTeachClassId(userId, admin, params.classId);
    const searchQuery = (params.q || "").trim();
    const requestedPage = parsePositiveInt(params.page, DEFAULT_PAGE);
    const requestedPageSize = Math.min(MAX_PAGE_SIZE, parsePositiveInt(params.pageSize, DEFAULT_PAGE_SIZE));

    const classes = await timedQuery(
        { route: "/teach/gradebook", queryLabel: "class.findMany.gradebookClasses", userRole },
        () => withPrismaReadRetry(() =>
            prisma.class.findMany({
                where: admin ? {} : { teacherId: userId },
                select: {
                    id: true,
                    name: true,
                },
            })
        ),
        (r) => r.length
    );

    const filteredClasses = selectedClassId ? classes.filter((c) => c.id === selectedClassId) : classes;
    const classOptions = classes.map((c) => ({ id: c.id, name: c.name }));
    const activeClassName = classes.find((c) => c.id === selectedClassId)?.name ?? null;
    const gradebook = await loadGradebookRoster(
        filteredClasses.map((c) => c.id), searchQuery, requestedPage, requestedPageSize
    );

    return (
        <div>
            <div className="mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--secondary)" }}>
                    Assessment
                </p>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-text mt-0.5">
                    Weekly Quiz Gradebook
                </h1>
                <p className="text-sm text-text-muted mt-1">
                    Best weekly quiz scores, ordered by week
                    {activeClassName ? ` · ${activeClassName}` : ""}.
                </p>
            </div>

            <GradebookClient
                diagnosticsBasePath={null}
                {...gradebook}
                classes={classOptions}
                selectedClassId={selectedClassId}
                showClassFilter={false}
                searchQuery={searchQuery}
            />
        </div>
    );
}
