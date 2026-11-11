import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useCourseMapNextLaunch } from '@/hooks/useCourseMapNextLaunch';
const hooks = vi.hoisted(() => ({ values: [] as unknown[], index: 0, effects: [] as Array<() => unknown>, href: '/dashboard/map?week=8#week-8' }));
vi.mock('react', () => ({
    useState: (initial: unknown) => {
        const index = hooks.index++;
        if (!(index in hooks.values)) hooks.values[index] = initial;
        return [hooks.values[index], (next: unknown) => { hooks.values[index] = next; }];
    },
    useEffect: (effect: () => unknown) => hooks.effects.push(effect),
}));
vi.mock('@/hooks/useResolvedLearnerReturnHref', () => ({ useResolvedLearnerReturnHref: () => hooks.href }));
function render() {
    hooks.index = 0;
    // This isolated harness supplies mocked React state/effects, not a mounted component.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCourseMapNextLaunch();
}
beforeEach(() => { hooks.values = []; hooks.effects = []; hooks.href = '/dashboard/map?week=8#week-8'; });
afterEach(() => vi.unstubAllGlobals());
it('never replaces the origin with an earlier server recommendation', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({
        mapReturnHref: '/dashboard/map?week=1#week-1', launch: { href: '/activity/old', title: 'Old work', weekNumber: 1 },
    }) });
    vi.stubGlobal('fetch', fetch);
    expect(render().mapReturnHref).toBe(hooks.href);
    hooks.effects[0]();
    await vi.waitFor(() => expect(render().isLoading).toBe(false));
    expect(fetch).toHaveBeenCalledWith('/api/course-map/next-launch?week=8');
    expect(render()).toMatchObject({ mapReturnHref: hooks.href, nextLaunch: null });
});
it('keeps the exact return anchor while offering the next lesson in the same week', async () => {
    const launch = { href: '/activity/next', title: 'Next game', weekNumber: 8 };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ launch, mapReturnHref: '/dashboard/map' }) }));
    render(); hooks.effects[0]();
    await vi.waitFor(() => expect(render().isLoading).toBe(false));
    expect(render()).toMatchObject({ mapReturnHref: hooks.href, nextLaunch: launch });
});
it('still returns to the originating week when next-step lookup fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    render(); hooks.effects[0]();
    await vi.waitFor(() => expect(render().isLoading).toBe(false));
    expect(render()).toMatchObject({ mapReturnHref: hooks.href, nextLaunch: null });
});
