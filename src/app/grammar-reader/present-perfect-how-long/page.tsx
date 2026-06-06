import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { presentPerfectHowLongContent } from "@/content/grammar/present-perfect-how-long";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Present Perfect + How Long - Interactive Grammar Guide | Class Companion",
    description: "Learn how to use Present Perfect with 'How long', for, and since in job interviews and real work conversations.",
};

export default async function PresentPerfectHowLongPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Present Perfect + How Long",
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
                content={presentPerfectHowLongContent}
                completionKey="present-perfect-how-long"
                activityId={activityId}
            />
        </div>
    );
}
