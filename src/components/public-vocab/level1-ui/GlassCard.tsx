import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { GLASS_SURFACE, GLASS_SURFACE_RAISED } from "./tokens";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  raised?: boolean;
  as?: "div" | "section" | "article";
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard({ raised, className = "", children, ...rest }, ref) {
    const surface = raised ? GLASS_SURFACE_RAISED : GLASS_SURFACE;
    return (
      <div
        ref={ref}
        className={`relative overflow-hidden rounded-3xl ${surface} ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
