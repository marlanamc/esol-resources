"use client";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useSession } from "next-auth/react";

export type StudentSummaryResponse = {
    totalPoints: number;
    effectiveCurrentStreak: number;
    actualWeeklyPoints: number;
    sevenDayActivity: boolean[];
};
type SummaryState = { data: StudentSummaryResponse | null; status: "loading" | "ready" | "stale"; at: number };
const EMPTY: SummaryState = { data: null, status: "loading", at: 0 };
const states = new Map<string, SummaryState>();
const requests = new Map<string, Promise<StudentSummaryResponse | null>>();
const listeners = new Set<() => void>();
const retryAfter = new Map<string, number>();
const TTL = 60000;
function publish(userId: string, state: SummaryState) {
    states.set(userId, state);
    listeners.forEach(notify => notify());
}
export function invalidateStudentSummary(userId: string) {
    const state = states.get(userId);
    if (state) publish(userId, { ...state, at: 0 });
}
export function getFreshStudentSummaryCache(userId?: string): StudentSummaryResponse | null {
    const state = userId ? states.get(userId) : null;
    return state && Date.now() - state.at < TTL ? state.data : null;
}
export async function loadStudentSummary(userId?: string, force = false): Promise<StudentSummaryResponse | null> {
    if (!userId) return null;
    const previous = states.get(userId) ?? EMPTY;
    if (requests.has(userId)) return requests.get(userId)!;
    if (!force && Date.now() - previous.at < TTL) return previous.data;
    if (Date.now() < (retryAfter.get(userId) ?? 0)) return previous.data;
    const request = (async () => {
        publish(userId, { ...previous, status: "loading" });
        try {
            const response = await fetch("/api/dashboard/student-summary", { cache: "no-store", signal: AbortSignal.timeout(15000) });
            if (!response.ok) throw new Error("Summary unavailable");
            const data = await response.json();
            if (data.userId !== userId || ![data.totalPoints, data.actualWeeklyPoints, data.effectiveCurrentStreak].every(Number.isFinite) || !Array.isArray(data.sevenDayActivity)) throw new Error("Invalid summary");
            publish(userId, { data, at: Date.now(), status: "ready" });
            retryAfter.delete(userId);
            return data as StudentSummaryResponse;
        } catch {
            // Preserve confirmed numbers. Failed reads never become zero points.
            retryAfter.set(userId, Date.now() + 15000 + Math.random() * 5000);
            publish(userId, { ...previous, status: "stale" });
            return previous.data;
        } finally { requests.delete(userId); }
    })();
    requests.set(userId, request);
    return request;
}
function subscribe(notify: () => void) { listeners.add(notify); return () => { listeners.delete(notify); }; }
// One resume listener per signed-in learner, regardless of the number of stats widgets.
const watchers = new Map<string, { count: number; stop: () => void }>();
function watch(userId: string) {
    const existing = watchers.get(userId);
    if (existing) { existing.count++; return; }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
        if (document.visibilityState === "hidden" || !navigator.onLine) return;
        clearTimeout(timer);
        timer = setTimeout(() => { void loadStudentSummary(userId); }, 600 + Math.random() * 700);
    };
    const saved = () => {
        const state = states.get(userId);
        if (state) states.set(userId, { ...state, at: 0 });
        refresh();
    };
    window.addEventListener("online", refresh);
    window.addEventListener("pageshow", refresh);
    window.addEventListener("submissionSaved", saved);
    window.addEventListener("activity-progress-updated", saved);
    document.addEventListener("visibilitychange", refresh);
    const interval = setInterval(refresh, TTL);
    refresh();
    watchers.set(userId, { count: 1, stop: () => {
        clearTimeout(timer); clearInterval(interval);
        window.removeEventListener("online", refresh); window.removeEventListener("pageshow", refresh);
        window.removeEventListener("submissionSaved", saved); window.removeEventListener("activity-progress-updated", saved); document.removeEventListener("visibilitychange", refresh);
    } });
}
export function useStudentSummaryState() {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const getSnapshot = useCallback(() => userId ? states.get(userId) ?? EMPTY : EMPTY, [userId]);
    const state = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
    useEffect(() => {
        if (!userId) return;
        watch(userId);
        return () => {
            const watcher = watchers.get(userId);
            if (watcher && --watcher.count === 0) { watcher.stop(); watchers.delete(userId); }
        };
    }, [userId]);
    return { ...state, refresh: () => { void loadStudentSummary(userId, true); } };
}
export function useStudentSummary() { return useStudentSummaryState().data; }
