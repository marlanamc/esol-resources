"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const baseClass =
  "inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-light)] hover:border-[var(--color-border-dark)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2";

interface BackButtonBaseProps {
  children?: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

interface BackButtonLinkProps extends BackButtonBaseProps {
  href: string;
  onClick?: never;
}

interface BackButtonButtonProps extends BackButtonBaseProps {
  href?: never;
  onClick: () => void;
}

export type BackButtonProps = BackButtonLinkProps | BackButtonButtonProps;

export function BackButton({
  href,
  onClick,
  children = "Back",
  className = "",
  "aria-label": ariaLabel = "Go back",
}: BackButtonProps) {
  const combinedClass = [baseClass, className].filter(Boolean).join(" ");
  const icon = <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />;

  if (href) {
    return (
      <Link href={href} className={combinedClass} aria-label={ariaLabel}>
        {icon}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={combinedClass}
      aria-label={ariaLabel}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
