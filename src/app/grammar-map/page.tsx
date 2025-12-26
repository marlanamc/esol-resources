import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import GrammarMapClient from '@/components/grammar-map/GrammarMapClient';

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
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-[var(--text)] mb-4">
                        Level 3 Grammar Map
                    </h1>
                    <p className="text-lg text-[var(--text)]/70 max-w-3xl">
                        See how all grammar topics connect and track your progress through the curriculum.
                        Click on any topic to learn more or start studying!
                    </p>
                </div>

                <GrammarMapClient progressMap={progressMap} />
            </div>
        </div>
    );
}
