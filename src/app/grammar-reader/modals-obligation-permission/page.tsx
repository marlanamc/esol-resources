import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { modalsObligationPermissionContent } from "@/content/grammar/modals-obligation-permission";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";

export const metadata: Metadata = {
    title: "Modals for Obligation & Permission - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master workplace modals: must, have to, can, may, could, should. Learn politeness levels for professional requests, permission, and obligations with real workplace examples.",
};

export default async function ModalsObligationPermissionPage() {
    // Fetch the activity ID for progress tracking
    const activityId = await getActivityIdSafely(
        "Modals for Obligation & Permission Guide",
        "guide",
        "grammar"
    );

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={modalsObligationPermissionContent}
                completionKey="modals-obligation-permission"
                activityId={activityId}
            />
        </div>
    );
}
