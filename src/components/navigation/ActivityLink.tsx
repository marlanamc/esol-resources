"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { buildActivityHref, withReturnTo } from "@/lib/learner/navigation";
import { useCurrentAppHref } from "@/hooks/useCurrentAppHref";

interface ActivityLinkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, "href"> {
    activityId: string;
    assignmentId?: string | null;
    href?: string;
    vocabUi?: string;
    returnTo?: string | null;
    children: ReactNode;
}

export function ActivityLink({
    activityId,
    assignmentId,
    href,
    vocabUi,
    returnTo,
    children,
    ...props
}: ActivityLinkProps) {
    const currentHref = useCurrentAppHref();

    // Override the built href if this is the daily vocab review activity
    let defaultHref = buildActivityHref(activityId, assignmentId);
    if (activityId === 'vocab-daily-review') {
        defaultHref = '/dashboard/vocab-review';
    } else if (vocabUi) {
        const url = new URL(defaultHref, 'http://x');
        url.searchParams.set('ui', vocabUi);
        defaultHref = `${url.pathname}${url.search}`;
    }

    const resolvedHref = withReturnTo(href ?? defaultHref, returnTo ?? currentHref);

    return (
        <Link href={resolvedHref} {...props}>
            {children}
        </Link>
    );
}
