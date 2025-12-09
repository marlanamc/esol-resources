'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  return (
    <>
      <div className="bottom-nav-spacer md:hidden" />
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 shadow-lg md:hidden bottom-nav" style={{ borderColor: 'var(--color-border)', zIndex: 'var(--z-fixed)' }}>
        <div
          className="grid h-16"
          style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        >
          {items.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                  isActive
                    ? ''
                    : 'active:scale-95'
                }`}
                style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
              >
                <div className={`w-6 h-6 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-b-full" style={{ background: 'var(--color-primary)' }} />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};
