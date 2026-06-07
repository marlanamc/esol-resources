'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
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
  const { resolvedTheme } = useTheme();
  const [hasMounted, setHasMounted] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const navTapAtRef = useRef<number | null>(null);
  const navFromPathRef = useRef<TrackedTabPath | null>(null);
  const shouldTrackRef = useRef(false);
  const previousPathnameRef = useRef<string | null>(null);
  const renderTheme = hasMounted ? resolvedTheme : 'light';
  // Layout passes variant for enrolled teachers previewing independent mode
  const isIndependentVariant = variant === 'independent';
  const navItems = isIndependentVariant ? INDEPENDENT_NAV_ITEMS : CLASSROOM_NAV_ITEMS;

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
            const isMapTab = item.href === '/dashboard/map';
            const IconComponent = ICON_MAP[item.iconKey];
            const useIndependentTabStyle = isIndependentVariant;

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={() => handleClick(item)}
                onTouchStart={() => handleTouchStart(item.href)}
                aria-label={item.label}
                className="relative flex h-full w-full items-center justify-center focus-visible:outline-none rounded-xl"
                style={{
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <div
                  className={`relative z-10 flex flex-col items-center justify-center transition-[color,opacity] duration-150 ${
                    useIndependentTabStyle
                      ? 'gap-0'
                      : 'gap-0.5'
                  } ${
                    isMapTab
                      ? isActive
                        ? renderTheme === 'dark' ? 'text-[#8bc4a8]' : 'text-[#9f523d]'
                        : renderTheme === 'dark' ? 'text-[#6da88a]' : 'text-[#b86a56]'
                      : isActive
                        ? renderTheme === 'dark' ? 'text-[#7fb3d5]' : 'text-[#9f523d]'
                        : renderTheme === 'dark' ? 'text-[#8a9bb0]' : 'text-[#4a5a6a]'
                  }`}
                >
                  <div
                    className={`relative flex items-center justify-center transition-all ${
                      useIndependentTabStyle
                        ? 'h-8 w-8'
                        : isMapTab
                        ? 'h-10 w-10'
                        : 'h-8 w-8'
                    }`}
                  >
                    {isMapTab && (
                      <div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: renderTheme === 'dark'
                            ? isActive
                              ? 'linear-gradient(135deg, rgba(139, 196, 168, 0.2) 0%, rgba(109, 168, 138, 0.12) 48%, rgba(89, 140, 110, 0.16) 100%)'
                              : 'linear-gradient(135deg, rgba(139, 196, 168, 0.1) 0%, rgba(109, 168, 138, 0.05) 48%, rgba(89, 140, 110, 0.08) 100%)'
                            : isActive
                            ? 'linear-gradient(135deg, rgba(152, 185, 162, 0.28) 0%, rgba(122, 157, 132, 0.16) 48%, rgba(92, 126, 103, 0.22) 100%)'
                            : 'linear-gradient(135deg, rgba(152, 185, 162, 0.16) 0%, rgba(122, 157, 132, 0.08) 48%, rgba(92, 126, 103, 0.14) 100%)',
                          boxShadow: renderTheme === 'dark'
                            ? isActive
                              ? '0 0 16px rgba(139, 196, 168, 0.15), 0 6px 14px rgba(89, 140, 110, 0.08), inset 0 1px 0 rgba(255,255,255,0.1)'
                              : '0 0 10px rgba(139, 196, 168, 0.08), 0 3px 8px rgba(89, 140, 110, 0.04), inset 0 1px 0 rgba(255,255,255,0.05)'
                            : isActive
                            ? '0 0 16px rgba(122, 157, 132, 0.24), 0 6px 14px rgba(92, 126, 103, 0.12), inset 0 1px 0 rgba(255,255,255,0.55)'
                            : '0 0 10px rgba(122, 157, 132, 0.14), 0 3px 8px rgba(92, 126, 103, 0.08), inset 0 1px 0 rgba(255,255,255,0.45)'
                        }}
                      />
                    )}

                    <div
                      className={`relative [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:mx-auto ${
                        useIndependentTabStyle
                          ? 'h-6.5 w-6.5'
                          : isMapTab
                          ? 'h-8 w-8'
                          : 'h-7 w-7'
                      }`}
                      style={isMapTab
                        ? {
                            color: renderTheme === 'dark'
                              ? isActive ? '#8bc4a8' : '#6da88a'
                              : isActive ? '#5c7e67' : '#4a6e53',
                            filter: renderTheme === 'dark'
                              ? isActive
                                ? 'drop-shadow(0 2px 6px rgba(139,196,168,0.15))'
                                : 'drop-shadow(0 1px 3px rgba(139,196,168,0.1))'
                              : isActive
                              ? 'drop-shadow(0 2px 6px rgba(122,157,132,0.22))'
                              : 'drop-shadow(0 1px 3px rgba(122,157,132,0.16))'
                          }
                        : useIndependentTabStyle
                        ? {
                            color: renderTheme === 'dark'
                              ? isActive ? '#9fc0da' : '#93a6ba'
                              : isActive ? '#8fc6aa' : '#a9b8c6',
                            filter: renderTheme === 'dark'
                              ? isActive
                                ? 'drop-shadow(0 2px 6px rgba(159,192,218,0.18))'
                                : 'drop-shadow(0 1px 2px rgba(147,166,186,0.10))'
                              : isActive
                              ? 'drop-shadow(0 2px 6px rgba(143,198,170,0.18))'
                              : 'drop-shadow(0 1px 2px rgba(169,184,198,0.10))'
                          }
                        : undefined}
                    >
                      <IconComponent />
                    </div>
                  </div>
                  <span className={`font-bold tracking-tight transition-all duration-200 opacity-100 ${
                    useIndependentTabStyle
                      ? isActive
                        ? 'mt-0.5 text-[10px] leading-none text-[#dce8f4] dark:text-[#dce8f4]'
                        : 'mt-0.5 text-[10px] leading-none text-[#a9b8c6] dark:text-[#9aacbe]'
                      : isMapTab
                      ? isActive
                        ? 'text-[10px] text-[#3d5c47] dark:text-[#8bc4a8]'
                        : 'text-[11px] text-[#3d5c47] dark:text-[#6da88a]'
                      : isActive
                        ? 'text-[10px] text-[#9f523d] dark:text-[#7fb3d5]'
                        : 'text-[10px] text-[#3d4d5d] dark:text-[#9aacbe]'
                  }`}>
                    {item.label}
                  </span>
                </div>
                
                <div
                  className={`bottom-nav-indicator absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full ${
                    useIndependentTabStyle
                      ? 'w-8 h-1'
                      : isMapTab
                      ? 'w-14 h-1.5'
                      : 'w-10 h-1'
                  } ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}
                  style={{
                    background: useIndependentTabStyle
                      ? renderTheme === 'dark'
                        ? 'linear-gradient(90deg, #8fc6aa 0%, #9fc0da 100%)'
                        : 'linear-gradient(90deg, #88A392 0%, #7fb3d5 100%)'
                      : renderTheme === 'dark'
                      ? isMapTab
                        ? 'linear-gradient(90deg, #f5d98a 0%, #e8a090 50%, #d08878 100%)'
                        : 'linear-gradient(90deg, #5a92b8 0%, #7fb3d5 50%, #a8d5f7 100%)'
                      : isMapTab
                      ? 'linear-gradient(90deg, #e9c46a 0%, #c88470 50%, #b86a56 100%)'
                      : '#c88470',
                    boxShadow: renderTheme === 'dark'
                      ? isActive
                        ? isMapTab ? '0 2px 6px rgba(232, 160, 144, 0.2)' : '0 2px 6px rgba(127, 179, 213, 0.3)'
                        : 'none'
                      : isActive ? '0 2px 6px rgba(200, 132, 112, 0.3)' : 'none'
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
