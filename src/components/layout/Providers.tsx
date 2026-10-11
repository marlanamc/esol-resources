"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { invalidateStudentSummary } from "@/hooks/useStudentSummary";
import { setActiveLearnerId } from "@/lib/learner-session";
import { ReactNode, useEffect } from "react";

function LearnerSessionBridge() {
    const { data, status } = useSession();
    useEffect(() => {
        if (status !== "loading") setActiveLearnerId(data?.user?.id ?? null);
    }, [data?.user?.id, status]);
    useEffect(() => {
        if (!data?.user?.id) return;
        const userId = data.user.id;
        const invalidate = () => invalidateStudentSummary(userId);
        window.addEventListener("submissionSaved", invalidate);
        window.addEventListener("activity-progress-updated", invalidate);
        return () => {
            window.removeEventListener("submissionSaved", invalidate);
            window.removeEventListener("activity-progress-updated", invalidate);
        };
    }, [data?.user?.id]);
    return null;
}

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider
            basePath="/api/auth"
            refetchWhenOffline={false}
            refetchInterval={0} // Focus refresh handles PWA resume without hidden-tab polling
            refetchOnWindowFocus={true} // Refetch when app comes into focus (important for PWA)
        >
            <LearnerSessionBridge />
            {children}
        </SessionProvider>
    );
}


