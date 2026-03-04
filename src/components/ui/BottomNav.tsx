'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  items: NavItem[];
}

export const BottomNav: React.FC<BottomNavProps> = ({ items }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // On mobile, if the height decreases significantly, it's usually the keyboard
      const isMobile = window.innerWidth <= 768;
      if (!isMobile) return;

      const isKeyboardOpen = window.visualViewport 
        ? window.visualViewport.height < window.innerHeight * 0.8
        : false;
      
      setKeyboardVisible(isKeyboardOpen);
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <>
      {/* Spacer for content above the fixed nav */}
      <div className="h-[60px] md:hidden" />
      
      <nav
        className={`fixed left-1/2 -translate-x-1/2 w-[calc(100%-1.25rem)] max-w-[480px] rounded-[2rem] border md:hidden bottom-nav touch-manipulation overflow-hidden transition-all duration-300 ${
          isKeyboardVisible ? 'translate-y-32 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
        style={{
          bottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))',
          borderColor: 'rgba(214, 202, 190, 0.4)',
          zIndex: 'var(--z-fixed)',
          background: 'rgba(255, 252, 248, 0.85)',
          boxShadow: '0 8px 24px rgba(49, 62, 84, 0.1), inset 0 1px 1px rgba(255,255,255,0.9)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)'
        }}
      >
        <div
          className="relative grid h-[52px] items-center px-1"
          style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        >
          <AnimatePresence>
            {items.map((item) => {
              const isActive = item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e: React.MouseEvent) => handleClick(e, item.href)}
                  aria-label={item.label}
                  className="relative flex h-full w-full items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c88470]/40 rounded-full"
                  style={{
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  {/* Sliding Indicator (Pill) */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-y-1 inset-x-1 z-0 rounded-[1.5rem]"
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        mass: 0.8
                      }}
                      style={{
                        backgroundColor: 'rgba(244, 237, 235, 0.95)',
                        boxShadow: '0 4px 10px rgba(211,145,127,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
                        border: '1px solid rgba(211, 145, 127, 0.15)'
                      }}
                    />
                  )}

                  <motion.div
                    className="relative z-10 flex flex-col items-center justify-center gap-0 -translate-y-0.5"
                    animate={{
                      scale: isActive ? 1.02 : 1,
                      color: isActive ? '#c88470' : '#7d8aa1'
                    }}
                    whileTap={{ scale: 0.94 }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center transition-colors">
                      <div className="h-5.5 w-5.5 [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:mx-auto">
                        {item.icon}
                      </div>
                    </div>
                    {/* Optional small label for better UX if space permits, or stick to sr-only */}
                    <span className={`text-[8.5px] font-bold tracking-tight leading-none -mt-1.5 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0 h-0 hidden'}`}>
                      {item.label}
                    </span>
                    {!isActive && <span className="sr-only">{item.label}</span>}
                  </motion.div>
                </Link>
              );
            })}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
};

