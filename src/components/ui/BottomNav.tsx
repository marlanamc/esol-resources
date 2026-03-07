'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

interface BottomNavRenderItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  items: BottomNavRenderItem[];
}

type TrackedTabPath = '/dashboard' | '/dashboard/calendar' | '/dashboard/activities';

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
  if (pathname.startsWith('/dashboard/activities')) return '/dashboard/activities';
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

export const BottomNav: React.FC<BottomNavProps> = ({ items }) => {
  const ACTIVITIES_LAST_HREF_STORAGE_KEY = 'dashboard-activities-last-href-v1';
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const navTapAtRef = useRef<number | null>(null);
  const navFromPathRef = useRef<TrackedTabPath | null>(null);
  const shouldTrackRef = useRef(false);
  const previousPathnameRef = useRef<string | null>(null);

  const flushQueue = (force = false) => {
    const queue = readQueue();
    if (!queue.length) return;
    if (!force && queue.length < TAB_NAV_BATCH_SIZE) return;
    const toSend = queue.slice(0, TAB_NAV_BATCH_SIZE);
    const didSend = beaconBatch(toSend);
    if (didSend) {
      writeQueue(queue.slice(toSend.length));
      return;
    }

    // Fallback for environments where sendBeacon is unavailable.
    writeQueue(queue.slice(toSend.length));
    void fetch(TAB_NAV_METRIC_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: toSend }),
      credentials: 'same-origin',
      keepalive: true,
    });
  };

  useEffect(() => {
    const DEBOUNCE_MS = 150;
    const MIN_VALID_HEIGHT = 100;
    let debounceId: ReturnType<typeof setTimeout> | null = null;

    const runCheck = () => {
      // Skip when tab is hidden - dimensions are unreliable during tab transitions
      if (document.visibilityState === 'hidden') return;

      const isMobile = window.innerWidth <= 768;
      if (!isMobile) return;

      // Guard against invalid dimensions (e.g. during tab switch, browser may report 0)
      const innerH = window.innerHeight;
      const viewportH = window.visualViewport?.height ?? innerH;
      if (innerH < MIN_VALID_HEIGHT || viewportH < MIN_VALID_HEIGHT) {
        setKeyboardVisible(false);
        return;
      }

      const isKeyboardOpen = viewportH < innerH * 0.8;
      setKeyboardVisible(isKeyboardOpen);
    };

    const handleResize = () => {
      if (debounceId) clearTimeout(debounceId);
      debounceId = setTimeout(runCheck, DEBOUNCE_MS);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Short delay when tab becomes visible to let browser settle
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

  useEffect(() => {
    const onVisibilityOrHide = () => flushQueue(true);
    document.addEventListener('visibilitychange', onVisibilityOrHide);
    window.addEventListener('pagehide', onVisibilityOrHide);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityOrHide);
      window.removeEventListener('pagehide', onVisibilityOrHide);
    };
  }, []);

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

  useEffect(() => {
    // Proactively warm tab routes to reduce perceived tab-switch latency.
    items.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [items, router]);

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
          background: 'var(--surface-overlay)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          boxShadow: '0 -2px 16px rgba(13, 22, 32, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.04)'
        }}
      >
        <div
          className="relative grid items-center px-2"
          style={{
            height: 'var(--bottom-nav-height)',
            gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`
          }}
        >
          {items.map((item) => {
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname === item.href || pathname?.startsWith(item.href + '/');
            const isActivitiesTab = item.href === '/dashboard/activities';

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={(event) => {
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
                  if (item.href === '/dashboard/activities') {
                    const lastActivitiesHref = window.sessionStorage.getItem(ACTIVITIES_LAST_HREF_STORAGE_KEY);
                    if (lastActivitiesHref && lastActivitiesHref !== '/dashboard/activities') {
                      event.preventDefault();
                      router.push(lastActivitiesHref, { scroll: false });
                    }
                  }
                }}
                onTouchStart={() => {
                  router.prefetch(item.href);
                }}
                aria-label={item.label}
                className="relative flex h-full w-full items-center justify-center focus-visible:outline-none rounded-xl"
                style={{
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <div
                  className={`relative z-10 flex flex-col items-center justify-center gap-0.5 transition-[color,opacity] duration-150 ${
                    isActivitiesTab
                      ? isActive
                        ? resolvedTheme === 'dark' ? 'text-[#8bc4a8]' : 'text-[#9f523d]'
                        : resolvedTheme === 'dark' ? 'text-[#6da88a]' : 'text-[#b86a56]'
                      : isActive
                        ? resolvedTheme === 'dark' ? 'text-[#e8a090]' : 'text-[#c88470]'
                        : resolvedTheme === 'dark' ? 'text-[#6b7280]' : 'text-[#7d8aa1]'
                  }`}
                >
                  <div
                    className={`relative flex items-center justify-center transition-all ${
                      isActivitiesTab ? 'h-10 w-10' : 'h-8 w-8'
                    }`}
                  >
                    {isActivitiesTab && (
                      <div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: resolvedTheme === 'dark'
                            ? isActive
                              ? 'linear-gradient(135deg, rgba(139, 196, 168, 0.2) 0%, rgba(109, 168, 138, 0.12) 48%, rgba(89, 140, 110, 0.16) 100%)'
                              : 'linear-gradient(135deg, rgba(139, 196, 168, 0.1) 0%, rgba(109, 168, 138, 0.05) 48%, rgba(89, 140, 110, 0.08) 100%)'
                            : isActive
                            ? 'linear-gradient(135deg, rgba(152, 185, 162, 0.28) 0%, rgba(122, 157, 132, 0.16) 48%, rgba(92, 126, 103, 0.22) 100%)'
                            : 'linear-gradient(135deg, rgba(152, 185, 162, 0.16) 0%, rgba(122, 157, 132, 0.08) 48%, rgba(92, 126, 103, 0.14) 100%)',
                          boxShadow: resolvedTheme === 'dark'
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
                        isActivitiesTab ? 'h-8 w-8' : 'h-7 w-7'
                      }`}
                      style={isActivitiesTab
                        ? {
                            color: resolvedTheme === 'dark'
                              ? isActive ? '#8bc4a8' : '#6da88a'
                              : isActive ? '#5c7e67' : '#6f9279',
                            filter: resolvedTheme === 'dark'
                              ? isActive
                                ? 'drop-shadow(0 2px 6px rgba(139,196,168,0.15))'
                                : 'drop-shadow(0 1px 3px rgba(139,196,168,0.1))'
                              : isActive
                              ? 'drop-shadow(0 2px 6px rgba(122,157,132,0.22))'
                              : 'drop-shadow(0 1px 3px rgba(122,157,132,0.16))'
                          }
                        : undefined}
                    >
                      {item.icon}
                    </div>
                  </div>
                  <span className={`font-bold tracking-tight leading-none transition-all duration-200 ${
                    isActivitiesTab
                      ? isActive
                        ? `text-[10px] opacity-100 ${resolvedTheme === 'dark' ? 'text-[#8bc4a8]' : 'text-[#5c7e67]'}`
                        : `text-[11px] opacity-95 ${resolvedTheme === 'dark' ? 'text-[#6da88a]' : 'text-[#6f9279]'}`
                      : isActive
                        ? `text-[10px] opacity-100 ${resolvedTheme === 'dark' ? 'text-[#e8a090]' : 'text-[#c88470]'}`
                        : `text-[10px] opacity-70 ${resolvedTheme === 'dark' ? 'text-[#6b7280]' : 'text-[#7d8aa1]'}`
                  }`}>
                    {item.label}
                  </span>
                </div>
                
                <div
                  className={`bottom-nav-indicator absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full ${
                    isActivitiesTab ? 'w-14 h-1.5' : 'w-10 h-1'
                  } ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}
                  style={{
                    background: resolvedTheme === 'dark'
                      ? isActivitiesTab
                        ? 'linear-gradient(90deg, #f5d98a 0%, #e8a090 50%, #d08878 100%)'
                        : '#e8a090'
                      : isActivitiesTab
                      ? 'linear-gradient(90deg, #e9c46a 0%, #c88470 50%, #b86a56 100%)'
                      : '#c88470',
                    boxShadow: resolvedTheme === 'dark'
                      ? isActive ? '0 2px 6px rgba(232, 160, 144, 0.2)' : 'none'
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
};
