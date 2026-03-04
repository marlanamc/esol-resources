'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavRenderItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  items: BottomNavRenderItem[];
}

export const BottomNav: React.FC<BottomNavProps> = ({ items }) => {
  const pathname = usePathname();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const navTapAtRef = useRef<number | null>(null);
  const previousPathnameRef = useRef<string | null>(null);

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
    if (process.env.NODE_ENV !== 'development') {
      previousPathnameRef.current = pathname;
      return;
    }

    const previousPathname = previousPathnameRef.current;
    if (previousPathname && previousPathname !== pathname) {
      const navDurationMs = navTapAtRef.current ? Math.round(performance.now() - navTapAtRef.current) : null;
      const durationText = navDurationMs !== null ? ` in ${navDurationMs}ms` : '';
      console.debug(`[BottomNav] route changed: ${previousPathname} -> ${pathname}${durationText}`);
      navTapAtRef.current = null;
    }
    previousPathnameRef.current = pathname;
  }, [pathname]);

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
          borderColor: 'rgba(214, 202, 190, 0.4)',
          zIndex: 'var(--z-fixed)',
          background: 'rgba(255, 252, 248, 0.94)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          boxShadow: '0 -8px 30px rgba(49, 62, 84, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
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

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  navTapAtRef.current = performance.now();
                }}
                aria-label={item.label}
                className="relative flex h-full w-full items-center justify-center focus-visible:outline-none rounded-xl"
                style={{
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <div
                  className={`relative z-10 flex flex-col items-center justify-center gap-0.5 transition-[color,opacity] duration-150 ${
                    isActive ? 'text-[#c88470]' : 'text-[#7d8aa1]'
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center transition-colors">
                    <div className="h-7 w-7 [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:mx-auto">
                      {item.icon}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold tracking-tight leading-none transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    {item.label}
                  </span>
                </div>
                
                <div
                  className={`bottom-nav-indicator absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#c88470] rounded-b-full ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};
