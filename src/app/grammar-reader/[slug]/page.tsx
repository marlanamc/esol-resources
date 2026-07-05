import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import type { Metadata } from "next";
import { getGrammarGuideActivity } from "@/lib/grammar-guide-activity";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { notFound, redirect } from "next/navigation";
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

    const activity = await getGrammarGuideActivity(guide.activityTitle);

    // SECURITY: Block student access to unreleased guides. A guide with no
    // activity row (or an unreachable DB) stays viewable, matching the old
    // id-lookup behavior.
    if (session.user.role === "student" && activity && !activity.isReleased) {
        redirect("/dashboard");
    }

    const content = await guide.loadContent();

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={content}
                completionKey={slug}
                activityId={activity?.id}
            />
        </div>
    );
}
