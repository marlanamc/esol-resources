import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import GrammarMapClient from '@/components/grammar-map/GrammarMapClient';
import Link from 'next/link';
import { MapIcon } from '@/components/icons/Icons';

export const metadata = {
    title: 'Grammar Map | Class Companion',
    description: 'Visual map of all Level 3 grammar topics showing your progress and how concepts connect',
};

export default async function GrammarMapPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    const userId = session.user.id;

    // Fetch user's activity progress
    const activityProgress = await prisma.activityProgress.findMany({
        where: { userId },
        select: {
            activityId: true,
            progress: true,
            status: true,
        },
    });

    // Convert to a map for easy lookup
    const progressMap = activityProgress.reduce((acc, progress) => {
        acc[progress.activityId] = {
            completionPercentage: progress.progress,
            status: progress.status,
        };
        return acc;
    }, {} as Record<string, { completionPercentage: number; status: string }>);

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <header className="sticky top-0 backdrop-blur-lg border-b z-40 bg-white/90 border-border/60 shadow-sm">
                <div className="container mx-auto py-4 px-4 sm:px-6 flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <MapIcon className="w-7 h-7 text-primary" />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold font-display text-[var(--text)]">
                            Level 3 Grammar Map
                        </h1>
                        <p className="text-sm text-[var(--text)]/70">
                            See how topics connect and track your progress.
                        </p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 sm:px-6 pb-28 md:pb-10">
                <GrammarMapClient progressMap={progressMap} />
            </main>
        </div>
    );
}
