import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { medicineLabelsInsuranceContent } from "@/content/grammar/medicine-labels-insurance";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Medicine Labels & Insurance Cards | ESOL Teacher Resources",
    description:
        "Interactive healthcare English guide for reading medicine labels, dosage warnings, pharmacy questions, insurance cards, and common U.S. insurance terms.",
};

export default async function MedicineLabelsInsurancePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Medicine Labels & Insurance Cards Guide",
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
                content={medicineLabelsInsuranceContent}
                completionKey="medicine-labels-insurance"
                activityId={activityId}
            />
        </div>
    );
}
