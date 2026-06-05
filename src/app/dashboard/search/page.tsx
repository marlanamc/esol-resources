import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { parseLearnerSearchFilter, searchLearnerContent } from "@/lib/learner-search";
import { LearnerSearchSurface } from "@/components/search/LearnerSearchSurface";
import { canUseTeacherTools, isAdmin } from "@/lib/roles";

type Props = {
    searchParams: Promise<{
        q?: string;
        filter?: string;
    }>;
};

export default async function LearnerSearchPage({ searchParams }: Props) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/login");
    }
    if (session.user.role !== "student" && !canUseTeacherTools(session.user)) {
        redirect("/dashboard");
    }

    const params = await searchParams;
    const query = params.q || "";
    const filter = parseLearnerSearchFilter(params.filter) ?? "all";
    const initialResponse = await searchLearnerContent({
        query,
        filter,
        limit: 24,
        viewer: canUseTeacherTools(session.user)
            ? {
                role: "teacher",
                userId: session.user.id,
                admin: isAdmin(session.user),
            }
            : { role: "student" },
    });

    return (
        <main className="mx-auto max-w-5xl px-4 py-6 pb-28 sm:px-6 lg:px-8">
            <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">Learner Search</p>
                <h1 className="mt-2 text-3xl font-bold text-text">Find lessons and tools fast</h1>
                <p className="mt-2 max-w-2xl text-sm text-text-muted">
                    Search activities, grammar guides, quizzes, and tools you already have access to.
                </p>
            </div>

            <LearnerSearchSurface
                context="search-page"
                initialResponse={initialResponse}
                initialQuery={query}
                initialFilter={filter}
                limit={24}
                syncUrl
            />
        </main>
    );
}
