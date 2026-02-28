'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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

  const handleClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <>
      <div className="bottom-nav-spacer md:hidden" />
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-white border-t-2 shadow-lg md:hidden bottom-nav touch-manipulation" 
        style={{ 
          borderColor: 'var(--color-border)', 
          zIndex: 'var(--z-fixed)',
          touchAction: 'manipulation'
        }}
      >
        <div
          className="grid h-16"
          style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        >
          {items.map((item) => {
            // Dashboard root: only active on exact /dashboard. Others: active on path or sub-path
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`relative flex flex-col items-center justify-center gap-1 transition-[color,transform,background-color,box-shadow] duration-150 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-xl mx-1 my-1 overflow-visible ${
                  isActive
                    ? ''
                    : 'active:scale-95'
                }`}
                style={{
                  color: isActive ? '#5f5142' : 'var(--color-text-muted)',
                  backgroundColor: isActive ? '#f3ede3' : 'transparent',
                  boxShadow: isActive ? 'inset 0 0 0 1px rgba(176,155,127,0.45)' : 'none',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <div className={`w-6 h-6 transition-transform duration-150 pointer-events-none ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-xs font-medium pointer-events-none">{item.label}</span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-b-full pointer-events-none bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};
