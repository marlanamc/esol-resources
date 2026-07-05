import { prisma } from "@/lib/database/prisma";

export type DiagnosableGuide = {
    id: string;
    title: string;
};

export function activityHasMiniQuiz(content: string): boolean {
    try {
        const parsed = JSON.parse(content) as { miniQuiz?: unknown };
        return Array.isArray(parsed.miniQuiz) && parsed.miniQuiz.length > 0;
    } catch {
        return false;
    }
}

export async function getDiagnosableGrammarGuides(): Promise<DiagnosableGuide[]> {
    const activities = await prisma.activity.findMany({
        where: { category: "grammar", type: "guide", isReleased: true },
        select: { id: true, title: true, content: true },
        orderBy: { title: "asc" },
    });

    return activities
        .filter((activity) => activityHasMiniQuiz(activity.content))
        .map((activity) => ({
            id: activity.id,
            title: activity.title.replace(/ Guide$/i, ""),
        }));
}
