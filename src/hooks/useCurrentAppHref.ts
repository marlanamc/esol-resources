"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useCurrentAppHref(): string {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchKey = searchParams.toString();

    return useMemo(() => {
        return searchKey ? `${pathname}?${searchKey}` : pathname;
    }, [pathname, searchKey]);
}
