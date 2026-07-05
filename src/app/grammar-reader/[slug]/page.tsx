import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/database/prisma";
import { getGrammarGuide } from "@/lib/grammar-guide-registry";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const guide = getGrammarGuide(slug);
    if (!guide) return {};
    return {
        title: guide.metaTitle,
        description: guide.metaDescription,
    };
}

export default async function GrammarGuidePage({ params }: Props) {
    const { slug } = await params;
    const guide = getGrammarGuide(slug);
    if (!guide) notFound();

    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        guide.activityTitle,
        "guide",
        "grammar"
    );

    // SECURITY: Block student access to unreleased guides
    if (session.user.role === "student" && activityId) {
        let isReleased = false;

        try {
            const activity = await prisma.activity.findUnique({
                where: { id: activityId },
                select: { isReleased: true }
            });
            isReleased = activity?.isReleased === true;
        } catch (error) {
            // Fail closed for students if release-state lookup fails.
            console.error(`Release check failed for grammar guide "${slug}"`, error);
        }

        // `redirect()` throws NEXT_REDIRECT; keep it outside try/catch.
        if (!isReleased) {
            redirect("/dashboard");
        }
    }

    const content = await guide.loadContent();

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={content}
                completionKey={slug}
                activityId={activityId}
            />
        </div>
    );
}
