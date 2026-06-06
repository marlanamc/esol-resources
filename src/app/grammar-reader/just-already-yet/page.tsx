import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { justAlreadyYetContent } from "@/content/grammar/just-already-yet";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Just, Already, Yet - Interactive Guide | Class Companion",
    description: "Learn the meaning and placement of just, already, and yet in everyday English — running errands, checking a to-do list, and talking with neighbors in East Boston.",
};

export default async function JustAlreadyYetPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Just, Already, Yet",
        "guide",
        "grammar"
    );

    if (session.user.role === "student" && activityId) {
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { isReleased: true },
        });
        if (!activity?.isReleased) redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={justAlreadyYetContent}
                completionKey="just-already-yet"
                activityId={activityId}
            />
        </div>
    );
}
