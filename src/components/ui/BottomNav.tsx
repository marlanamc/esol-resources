'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HomeIcon, MapIcon, CalendarIcon, TrophyIcon, StarIcon, BookOpenIcon } from '@/components/icons/Icons';

// ─── Stable nav config (never changes, never creates new references) ───
type NavItemConfig = {
  href: string;
  label: string;
  iconKey: 'home' | 'map' | 'calendar' | 'leaderboard' | 'profile' | 'activities';
};

const CLASSROOM_NAV_ITEMS: NavItemConfig[] = [
  { href: '/dashboard', label: 'Home', iconKey: 'home' },
  { href: '/dashboard/map', label: 'Map', iconKey: 'map' },
  { href: '/dashboard/calendar', label: 'Calendar', iconKey: 'calendar' },
  { href: '/dashboard/leaderboard', label: 'Leaderboard', iconKey: 'leaderboard' },
];

const INDEPENDENT_NAV_ITEMS: NavItemConfig[] = [
  { href: '/dashboard/independent', label: 'Home', iconKey: 'home' },
  { href: '/dashboard/map', label: 'Map', iconKey: 'map' },
  { href: '/dashboard/activities', label: 'Activities', iconKey: 'activities' },
  { href: '/dashboard/leaderboard', label: 'Leaderboard', iconKey: 'leaderboard' },
];

const ICON_MAP: Record<NavItemConfig['iconKey'], React.FC<{ className?: string }>> = {
  home: HomeIcon,
  map: MapIcon,
  calendar: CalendarIcon,
  leaderboard: TrophyIcon,
  profile: StarIcon,
  activities: BookOpenIcon,
};

// ─── Telemetry (tab-nav metrics) ───
type TrackedTabPath = '/dashboard' | '/dashboard/calendar' | '/dashboard/map';

interface TabNavMetric {
  fromPath: TrackedTabPath;
  toPath: TrackedTabPath;
  clickToRouteCommitMs: number;
  clickToFirstFrameMs: number;
  clickToIdleMs: number | null;
  at: string;
}

const TAB_NAV_METRIC_ENDPOINT = '/api/diagnostics/tab-nav';
const TAB_NAV_QUEUE_STORAGE_KEY = 'tab-nav-metrics-queue-v1';
const TAB_NAV_SAMPLE_RATE = 0.35;
const TAB_NAV_BATCH_SIZE = 5;
function toTrackedTabPath(pathname: string | null | undefined): TrackedTabPath | null {
  if (!pathname) return null;
  if (pathname === '/dashboard') return '/dashboard';
  if (pathname.startsWith('/dashboard/calendar')) return '/dashboard/calendar';
  if (pathname.startsWith('/dashboard/map')) return '/dashboard/map';
  return null;
}

function readQueue(): TabNavMetric[] {
  try {
    const raw = window.sessionStorage.getItem(TAB_NAV_QUEUE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as TabNavMetric[];
  } catch {
    return [];
  }
}

function writeQueue(queue: TabNavMetric[]) {
  try {
    window.sessionStorage.setItem(TAB_NAV_QUEUE_STORAGE_KEY, JSON.stringify(queue.slice(-50)));
  } catch {
    // Best effort telemetry only.
  }
}

function beaconBatch(batch: TabNavMetric[]): boolean {
  if (!batch.length) return true;
  if (typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') return false;
  const payload = JSON.stringify({ events: batch });
  const blob = new Blob([payload], { type: 'application/json' });
  return navigator.sendBeacon(TAB_NAV_METRIC_ENDPOINT, blob);
}

function flushQueue(force = false) {
  const queue = readQueue();
  if (!queue.length) return;
  if (!force && queue.length < TAB_NAV_BATCH_SIZE) return;
  const toSend = queue.slice(0, TAB_NAV_BATCH_SIZE);
  const didSend = beaconBatch(toSend);
  if (didSend) {
    writeQueue(queue.slice(toSend.length));
    return;
  }
  writeQueue(queue.slice(toSend.length));
  void fetch(TAB_NAV_METRIC_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: toSend }),
    credentials: 'same-origin',
    keepalive: true,
  });
}

// ─── Component ───
interface BottomNavProps {
  variant?: 'classroom' | 'independent';
}

export const BottomNav = React.memo(function BottomNav({ variant }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const navTapAtRef = useRef<number | null>(null);
  const navFromPathRef = useRef<TrackedTabPath | null>(null);
  const shouldTrackRef = useRef(false);
  const previousPathnameRef = useRef<string | null>(null);
  // Layout passes variant for enrolled teachers previewing independent mode
  const isIndependentVariant = variant === 'independent';
  const navItems = isIndependentVariant ? INDEPENDENT_NAV_ITEMS : CLASSROOM_NAV_ITEMS;

  // Keyboard visibility detection (mobile only)
  useEffect(() => {
    const DEBOUNCE_MS = 150;
    const MIN_VALID_HEIGHT = 100;
    let debounceId: ReturnType<typeof setTimeout> | null = null;

    const runCheck = () => {
      if (document.visibilityState === 'hidden') return;
      const isMobile = window.innerWidth <= 768;
      if (!isMobile) return;
      const innerH = window.innerHeight;
      const viewportH = window.visualViewport?.height ?? innerH;
      if (innerH < MIN_VALID_HEIGHT || viewportH < MIN_VALID_HEIGHT) {
        setKeyboardVisible(false);
        return;
      }
      setKeyboardVisible(viewportH < innerH * 0.8);
    };

    const handleResize = () => {
      if (debounceId) clearTimeout(debounceId);
      debounceId = setTimeout(runCheck, DEBOUNCE_MS);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (debounceId) clearTimeout(debounceId);
        debounceId = setTimeout(runCheck, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (debounceId) clearTimeout(debounceId);
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Flush telemetry on visibility change / page hide
  useEffect(() => {
    const onVisibilityOrHide = () => flushQueue(true);
    document.addEventListener('visibilitychange', onVisibilityOrHide);
    window.addEventListener('pagehide', onVisibilityOrHide);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityOrHide);
      window.removeEventListener('pagehide', onVisibilityOrHide);
    };
  }, []);

  // Track route changes for telemetry
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      previousPathnameRef.current = pathname;
    }

    const previousPathname = previousPathnameRef.current;
    const fromPath = navFromPathRef.current;
    const toPath = toTrackedTabPath(pathname);
    const clickAt = navTapAtRef.current;
    const shouldTrack = shouldTrackRef.current;
    const navDurationMs = clickAt ? Math.round(performance.now() - clickAt) : null;

    if (shouldTrack && clickAt && fromPath && toPath) {
      const routeCommitMs = Math.max(0, Math.round(performance.now() - clickAt));
      requestAnimationFrame(() => {
        const firstFrameMs = Math.max(0, Math.round(performance.now() - clickAt));
        const enqueue = (idleMs: number | null) => {
          const nextQueue = readQueue();
          nextQueue.push({
            fromPath,
            toPath,
            clickToRouteCommitMs: routeCommitMs,
            clickToFirstFrameMs: firstFrameMs,
            clickToIdleMs: idleMs,
            at: new Date().toISOString(),
          });
          writeQueue(nextQueue);
          flushQueue(false);
        };

        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            enqueue(Math.max(0, Math.round(performance.now() - clickAt)));
          }, { timeout: 1200 });
        } else {
          setTimeout(() => enqueue(null), 200);
        }
      });
    }

    if (process.env.NODE_ENV === 'development' && previousPathname && previousPathname !== pathname) {
      const durationText = navDurationMs !== null ? ` in ${navDurationMs}ms` : '';
      console.debug(`[BottomNav] route changed: ${previousPathname} -> ${pathname}${durationText}`);
    }

    navTapAtRef.current = null;
    navFromPathRef.current = null;
    shouldTrackRef.current = false;
    previousPathnameRef.current = pathname;
  }, [pathname]);

  // Prefetch all tab routes once on mount (stable dependency)
  useEffect(() => {
    navItems.forEach((item) => router.prefetch(item.href));
  }, [navItems, router]);

  const handleClick = useCallback(
    (item: NavItemConfig) => {
      const fromPath = toTrackedTabPath(pathname);
      const toPath = toTrackedTabPath(item.href);
      const shouldTrack = Boolean(
        fromPath &&
        toPath &&
        fromPath !== toPath &&
        (process.env.NODE_ENV === 'development' || Math.random() < TAB_NAV_SAMPLE_RATE)
      );
      navTapAtRef.current = performance.now();
      navFromPathRef.current = fromPath;
      shouldTrackRef.current = shouldTrack;
    },
    [pathname],
  );

  const handleTouchStart = useCallback(
    (href: string) => {
      router.prefetch(href);
    },
    [router],
  );

  return (
    <>
      {/* Spacer for content above the fixed nav */}
      <div
        className="md:hidden"
        style={{
          height: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))'
        }}
      />
      
      <nav
        className={`fixed bottom-0 left-0 right-0 w-full border-t md:hidden bottom-nav bottom-nav-motion touch-manipulation ${
          isKeyboardVisible ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
        style={{
          borderColor: 'var(--border-subtle)',
          zIndex: 'var(--z-fixed)',
          background: 'color-mix(in srgb, var(--color-bg) 94%, transparent)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          boxShadow: '0 -2px 16px rgba(13, 22, 32, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.04)'
        }}
      >
        <div
          className="relative grid items-center px-2"
          style={{
            height: 'var(--bottom-nav-height)',
            gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))`
          }}
        >
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : item.href === '/dashboard/independent'
              ? pathname === '/dashboard/independent'
              : pathname === item.href || pathname?.startsWith(item.href + '/');
            const IconComponent = ICON_MAP[item.iconKey];

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={() => handleClick(item)}
                onTouchStart={() => handleTouchStart(item.href)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex h-full w-full items-center justify-center rounded-xl focus-visible:outline-none"
                style={{
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <div
                  className="relative z-10 flex flex-col items-center justify-center gap-0.5 transition-colors duration-150"
                  style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}
                >
                  <div className="relative flex h-8 w-8 items-center justify-center">
                    <div className="relative h-7 w-7 [&_svg]:mx-auto [&_svg]:block [&_svg]:h-full [&_svg]:w-full">
                      <IconComponent />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold tracking-tight">
                    {item.label}
                  </span>
                </div>

                <div
                  className={`bottom-nav-indicator absolute top-0 left-1/2 h-1 w-10 -translate-x-1/2 rounded-b-full ${
                    isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                  }`}
                  style={{
                    background: 'var(--primary)',
                    boxShadow: isActive
                      ? '0 2px 6px color-mix(in srgb, var(--primary) 35%, transparent)'
                      : 'none',
                  }}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
});
