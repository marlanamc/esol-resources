import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { medicalInstructionsCompleteContent } from "@/content/grammar/medical-instructions-complete";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Medical Instructions: Modals, Imperatives & Declaratives | ESOL Teacher Resources",
    description:
        "Interactive healthcare English guide: imperatives on labels, declaratives in the exam room, modals for advice and permission, and tone in real clinic scenes.",
};

export default async function MedicalInstructionsCompletePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Medical Instructions: Modals, Imperatives & Declaratives",
        "guide",
        "grammar"
    );

    if (session.user.role === "student" && activityId) {
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { isReleased: true },
        });

        if (!activity?.isReleased) {
            redirect("/dashboard");
        }
    }

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={medicalInstructionsCompleteContent}
                completionKey="medical-instructions-complete"
                activityId={activityId}
            />
        </div>
    );
}
