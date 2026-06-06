"use client";

import Link from "next/link";
import { CourseMapReturnButton } from "@/components/navigation/CourseMapReturnButton";

interface CertificateContinueActionsProps {
    fromCourseMap: boolean;
    guideHref: string;
    passed: boolean;
}

export function CertificateContinueActions({
    fromCourseMap,
    guideHref,
    passed,
}: CertificateContinueActionsProps) {
    if (fromCourseMap) {
        return (
            <div className="mt-8 animate-fade-in-up delay-500">
                <CourseMapReturnButton className="w-full max-w-md mx-auto" />
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row gap-3 mt-8 animate-fade-in-up delay-500">
            <Link
                href="/dashboard/profile#mini-quiz-certificates"
                className="rounded-xl bg-primary px-6 py-3 text-center text-sm font-semibold text-white shadow-lg hover:bg-primary-dark transition-colors"
            >
                View All Certificates
            </Link>
            <Link
                href={guideHref}
                className="rounded-xl border border-white/30 bg-white/10 backdrop-blur px-6 py-3 text-center text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
                {passed ? "Return to Activity" : "Keep Practicing"}
            </Link>
        </div>
    );
}
