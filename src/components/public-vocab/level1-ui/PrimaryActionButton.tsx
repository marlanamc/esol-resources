"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface PrimaryActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
  showArrow?: boolean;
  size?: "md" | "lg";
}

const SIZE = {
  md: "h-12 px-5 text-base",
  lg: "h-14 px-6 text-lg",
};

export function PrimaryActionButton({
  children,
  variant = "primary",
  showArrow = false,
  size = "lg",
  className = "",
  ...rest
}: PrimaryActionButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50";
  const skin =
    variant === "primary"
      ? "bg-[#0f9b8e] text-white shadow-[0_10px_24px_-10px_rgba(15,155,142,0.6)] hover:bg-[#0c8a7d] focus-visible:ring-emerald-400/60"
      : "bg-white/70 backdrop-blur border border-white/70 text-[#0a6b62] hover:bg-white focus-visible:ring-emerald-400/60";

  return (
    <button type="button" className={`${base} ${SIZE[size]} ${skin} ${className}`} {...rest}>
      {children}
      {showArrow ? <ArrowRight size={18} strokeWidth={2.5} aria-hidden /> : null}
    </button>
  );
}
