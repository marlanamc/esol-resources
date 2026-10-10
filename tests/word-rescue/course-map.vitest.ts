import { describe, expect, it } from 'vitest';
import { COURSE_MAP_UNITS } from '../../src/lib/course-map-data';
import { RESCUE_COLLECTIONS } from '../../src/lib/word-rescue/content';
import { buildCourseMapProgressState, isMapActivityCompleted, getMapActivityProgressId } from '../../src/lib/course-map-progress';
import type { CourseMapActivity } from '../../src/lib/course-map';
const item = (collection: string): CourseMapActivity => ({ id: collection, title: 'Word Rescue', activityType: 'pronunciation', status: 'available', href: `/activity/word-rescue?collection=${collection}` });
describe('weekly Word Rescue', () => {
  it('shows only FY27 map vocabulary, in map order with current week titles', () => {
    const sets = RESCUE_COLLECTIONS.filter(set => set.sourceActivityId);
    const mapped = COURSE_MAP_UNITS.flatMap(unit => unit.weeks).filter(week => week.items.some(item => item.id === `${week.id}-word-rescue`));
    expect(sets).toHaveLength(mapped.length);
    expect(sets.map(set => set.label)).toEqual(mapped.map(week => `Week ${week.number} · ${week.title}`));
    expect(sets.find(set => set.id === 'oct-learning')?.label).toContain('Week 4');
    expect(sets.some(set => set.id === 'mar-31-apr-2')).toBe(false);
  });
  it('links each supported vocabulary week to its own pronunciation collection', () => {
    for (const week of COURSE_MAP_UNITS.flatMap(unit => unit.weeks)) {
      const set = RESCUE_COLLECTIONS.find(set => set.sourceActivityId && week.items.some(item => item.activityId === set.sourceActivityId));
      const rescue = week.items.filter(item => item.id === `${week.id}-word-rescue`);
      expect(rescue).toHaveLength(set ? 1 : 0);
      if (set) {
        const url = new URL(rescue[0].href!, 'http://localhost');
        expect(url.searchParams.get('collection')).toBe(set.id);
        expect(url.searchParams.get('fromMap')).toBe('1');
        expect(url.searchParams.get('returnTo')).toBe(`/dashboard/map?week=${week.number}#week-${week.number}`);
        expect([...week.items].sort((a,b) => a.order-b.order)[0].id).toBe(rescue[0].id);
      }
    }
  });
  it('requires all distinct practiced words in that week, independent of global completion', () => {
    const [a,b] = RESCUE_COLLECTIONS.filter(set => set.sourceActivityId);
    const words = Object.fromEntries(a.wordIds.map(id => [id,{attempts:1}]));
    const progress = { 'word-rescue': { status: 'completed', categoryData: { wordRescue: { words } } } };
    expect(getMapActivityProgressId(item(a.id))).toBe('word-rescue');
    expect(isMapActivityCompleted(item(a.id),progress)).toBe(true);
    expect(isMapActivityCompleted(item(b.id),progress)).toBe(false);
    expect(isMapActivityCompleted(item('unknown'),progress)).toBe(false);
    for (const id of a.wordIds.slice(3)) words[id].attempts=0;
    expect(isMapActivityCompleted(item(a.id),progress)).toBe(false);
    words[a.wordIds[2]].attempts=0;
    words[a.wordIds[0]].attempts=10;
    expect(isMapActivityCompleted(item(a.id),progress)).toBe(false);
  });
  it('uses the latest cumulative snapshot when assignment and account records coexist', () => {
    const rows = [1,2].map(n => ({ activityId:'word-rescue',status:'completed',categoryData:JSON.stringify({wordRescue:{words:{count:n}}}),updatedAt:new Date(n) }));
    expect(buildCourseMapProgressState(rows)['word-rescue'].categoryData).toEqual({wordRescue:{words:{count:2}}});
    expect(buildCourseMapProgressState(rows.reverse())['word-rescue'].categoryData).toEqual({wordRescue:{words:{count:2}}});
  });
});
