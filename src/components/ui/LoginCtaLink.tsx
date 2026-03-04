"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

export default function LoginCtaLink() {
    const router = useRouter();
    const prefetchedRef = useRef(false);

    const prefetchLogin = useCallback(() => {
        if (prefetchedRef.current) return;
        prefetchedRef.current = true;
        router.prefetch("/login");
    }, [router]);

    useEffect(() => {
        const run = () => prefetchLogin();
        if ("requestIdleCallback" in window) {
            const id = window.requestIdleCallback(run, { timeout: 1500 });
            return () => window.cancelIdleCallback(id);
        }
        const id = setTimeout(run, 300);
        return () => clearTimeout(id);
    }, [prefetchLogin]);

    return (
        <Link
            href="/login"
            prefetch
            onMouseEnter={prefetchLogin}
            onFocus={prefetchLogin}
            onTouchStart={prefetchLogin}
            className="group inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-semibold shadow-lg hover:shadow-xl hover:bg-primary-dark transition-[background-color,transform,box-shadow] duration-300 transform hover:scale-105"
        >
            <span>Log In</span>
            <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </Link>
    );
}
