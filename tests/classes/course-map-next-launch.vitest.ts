import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CourseMapUnit } from '@/lib/course-map';
import { getMapReturnWeek } from '@/lib/course-map-navigation';
import { getCourseMapNextLaunchForUser } from '@/lib/course-map-next-launch';

const db = vi.hoisted(() => ({ progress: {} as Record<string, { status: string; categoryData: null }>, units: [] as CourseMapUnit[] }));
vi.mock('@/lib/database/prisma', () => ({ prisma: { classEnrollment: { findMany: async () => [] } } }));
vi.mock('@/lib/database/retry', () => ({ withPrismaReadRetry: (fn: () => unknown) => fn() }));
vi.mock('@/lib/course-map', () => ({ getVisibleMap: async () => ({ units: db.units }) }));
vi.mock('@/lib/course-map-progress.server', () => ({
    enrichCourseMapUnitsWithGrammarIds: async (units: CourseMapUnit[]) => units,
    loadCourseMapProgressState: async () => db.progress,
}));
beforeEach(() => {
    db.progress = {};
    db.units = [{ unitNumber: 1, unitTitle: 'Cycle 1', month: 'Fall', levels: [1, 8, 9].map(week => ({
        levelNumber: week, levelTitle: `Week ${week}`, requiredActivities: [1, 2].map(step => ({
            id: `w${week}-${step}`, activityId: `w${week}-${step}`, title: `Game ${week}-${step}`,
            activityType: 'game' as const, status: 'available' as const,
        })),
    })) }];
});
describe('completion navigation stays in the launch week', () => {
    it('continues Week 8 despite unfinished Week 1 work', async () => {
        db.progress['w8-1'] = { status: 'completed', categoryData: null };
        const result = await getCourseMapNextLaunchForUser({ id: 'student' }, 8);
        expect(result?.launch).toMatchObject({ weekNumber: 8, activityId: 'w8-2' });
        const href = new URL(result!.launch!.href, 'https://example.test');
        expect(href.searchParams.get('returnTo')).toBe('/dashboard/map?week=8&focus=next#week-8');
        expect(result?.hero?.weekNumber).toBe(8);
    });
    it('offers no automatic lesson after finishing the week, even with older and newer unfinished weeks', async () => {
        db.progress = { 'w8-1': { status: 'completed', categoryData: null }, 'w8-2': { status: 'completed', categoryData: null } };
        expect(await getCourseMapNextLaunchForUser({ id: 'student' }, 8)).toMatchObject({ launch: null, hero: null });
    });
    it('respects an intentional visit to an earlier week', async () => {
        expect((await getCourseMapNextLaunchForUser({ id: 'student' }, 1))?.launch?.weekNumber).toBe(1);
    });
    it('does not substitute an earlier week for an unavailable requested week', async () => {
        expect((await getCourseMapNextLaunchForUser({ id: 'student' }, 36))?.launch).toBeNull();
    });
    it('preserves global next-up behavior for callers without a week', async () => {
        expect((await getCourseMapNextLaunchForUser({ id: 'student' }))?.launch?.weekNumber).toBe(1);
    });
    it.each([
        ['/dashboard/map?week=8#week-8', 8],
        ['/dashboard/map?week=8&focus=next#week-1', 8],
        ['/dashboard/map#week-8', 8],
        ['/dashboard/map', null],
        ['/dashboard/profile', null],
    ])('reads the week from %s', (href, expected) => expect(getMapReturnWeek(href)).toBe(expected));
});
