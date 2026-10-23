import type { ReactNode } from "react";

interface AuthPageShellProps {
    children: ReactNode;
    id: string;
    title: string;
    skipLabel: string;
    brand?: string;
    subtitle?: string;
}

/** Shared framing for the public sign-in, registration, and help screens. */
export function AuthPageShell({
    children,
    id,
    title,
    skipLabel,
    brand = "My ESOL Class",
    subtitle = "Class Companion",
}: AuthPageShellProps) {
    return (
        <main className="min-h-dvh flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 bg-bg">
            <a
                href={`#${id}`}
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg"
            >
                {skipLabel}
            </a>
            <div id={id} className="max-w-md w-full space-y-5 sm:space-y-6" tabIndex={-1}>
                <header className="text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-2 text-primary">
                        {brand}
                    </h1>
                    <p className="text-base sm:text-lg mb-3 sm:mb-4 font-bold text-secondary">
                        {subtitle}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3 sm:mb-4 text-[var(--color-text)] text-balance">
                        {title}
                    </h2>
                </header>
                {children}
            </div>
        </main>
    );
}
