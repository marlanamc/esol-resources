import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
} = ({ children, className = '', hover = false, onClick }) => {
  const baseClass = 'bg-[var(--dashboard-surface-start)] dark:bg-[var(--dashboard-surface-start)] border border-[var(--dashboard-border)] dark:border-[var(--dashboard-border)] shadow-[inset_0_1px_0_var(--dashboard-inset-highlight),0_0_0_1px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_var(--dashboard-inset-highlight),0_0_0_1px_rgba(255,255,255,0.03),0_1px_2px_rgba(0,0,0,0.12),0_4px_12px_rgba(6,12,18,0.18),0_8px_24px_rgba(6,12,18,0.22)] rounded-2xl';
  const hoverClass = hover ? 'hover:shadow-[inset_0_1px_0_var(--dashboard-inset-highlight),0_0_0_1px_rgba(0,0,0,0.02),0_2px_4px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.04)] dark:hover:shadow-[inset_0_1px_0_var(--dashboard-inset-highlight),0_0_0_1px_rgba(255,255,255,0.04),0_2px_4px_rgba(0,0,0,0.15),0_8px_20px_rgba(6,12,18,0.22),0_12px_32px_rgba(6,12,18,0.26)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : '';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className={`${baseClass} transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${hoverClass} ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      className={`${baseClass} ${className}`}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-[var(--dashboard-divider)] ${className}`}>
    {children}
  </div>
);

const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-[var(--dashboard-divider)] ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
