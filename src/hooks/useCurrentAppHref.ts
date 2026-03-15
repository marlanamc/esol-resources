"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Returns the current full app URL (pathname + search string) for use in redirects or links.
 * Updates when pathname or search params change.
 */
export function useCurrentAppHref(): string {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchKey = searchParams.toString();

    return useMemo(() => {
        return searchKey ? `${pathname}?${searchKey}` : pathname;
    }, [pathname, searchKey]);
}
