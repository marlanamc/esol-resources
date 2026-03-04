'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
      <div className="h-[72px] md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
      
      <nav
        className={`fixed bottom-0 left-0 right-0 w-full border-t md:hidden bottom-nav touch-manipulation transition-all duration-300 ${
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
          className="relative grid h-[64px] items-center px-2"
          style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        >
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
                className="relative flex h-full w-full items-center justify-center focus-visible:outline-none rounded-xl"
                style={{
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <motion.div
                  className="relative z-10 flex flex-col items-center justify-center gap-1"
                  animate={{
                    color: isActive ? '#c88470' : '#7d8aa1'
                  }}
                  whileTap={{ scale: 0.92 }}
                >
                  <div className="flex h-7 w-7 items-center justify-center transition-colors">
                    <div className="h-6 w-6 [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:mx-auto">
                      {item.icon}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold tracking-tight leading-none transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    {item.label}
                  </span>
                </motion.div>
                
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#c88470] rounded-b-full"
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

