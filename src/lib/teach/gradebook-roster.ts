import { prisma } from '@/lib/database/prisma';
import { withPrismaReadRetry } from '@/lib/database/retry';
import { buildLeaderboardEligibleUserWhere } from '@/lib/gamification/leaderboard-filter';
import { loadWeeklyQuizGradebook } from './weekly-quiz-gradebook';
import { gradebookAverages } from './gradebook-averages';

export async function loadGradebookRoster(classIds: string[], search: string, page: number, pageSize: number) {
    const [eligible, roster] = await Promise.all([
        withPrismaReadRetry(() => prisma.user.findMany({
            where: buildLeaderboardEligibleUserWhere({ classes: { some: { classId: { in: classIds }, status: 'active' } } }),
            select: { id: true },
        })),
        withPrismaReadRetry(() => prisma.user.findMany({
            where: { role: 'student', isSystemAccount: false, classes: { some: { classId: { in: classIds } } } },
            select: { id: true, name: true, username: true, classes: { where: { classId: { in: classIds } }, select: { status: true } } },
            orderBy: [{ name: 'asc' }, { id: 'asc' }],
        })),
    ]);
    const currentIds = new Set(eligible.map(s => s.id));
    const matches = roster.filter(s => `${s.name ?? ''}\n${s.username}`.toLowerCase().includes(search.toLowerCase()));
    const current = matches.filter(s => currentIds.has(s.id));
    const formerStudents = matches.filter(s => !currentIds.has(s.id)).map(s => ({
        id: s.id, name: s.name, username: s.username,
        enrollmentLabel: s.classes.some(e => e.status === 'active') ? 'Excluded from leaderboard'
            : s.classes.some(e => e.status === 'graduated') ? 'Graduated' : 'Removed',
    }));
    const totalPages = Math.max(1, Math.ceil(current.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const students = current.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(s => ({ id: s.id, name: s.name, username: s.username }));
    const { activities, submissions } = await loadWeeklyQuizGradebook({ classIds, studentIds: roster.map(s => s.id) });
    const { classAverage } = gradebookAverages(submissions, [...currentIds], activities.map(a => a.id));
    const visibleIds = new Set([...students, ...formerStudents].map(s => s.id));
    return { students, formerStudents, activities, submissions: submissions.filter(s => visibleIds.has(s.userId)), classAverage,
        pagination: { page: currentPage, pageSize, total: current.length, totalPages } };
}
