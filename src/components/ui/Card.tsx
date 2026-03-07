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
  const baseClass = 'bg-white dark:bg-[#162b3d] border border-border/40 dark:border-white/10 shadow-[0_2px_12px_rgba(52,43,34,0.05)] dark:shadow-[0_2px_12px_rgba(13,22,32,0.3)] rounded-2xl';
  const hoverClass = hover ? 'hover:shadow-[0_8px_24px_rgba(52,43,34,0.08)] dark:hover:shadow-[0_8px_24px_rgba(13,22,32,0.4)] hover:-translate-y-0.5 transition-all duration-250 cursor-pointer' : '';

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
  <div className={`p-6 border-b border-border dark:border-white/10 ${className}`}>
    {children}
  </div>
);

const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-border dark:border-white/10 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
