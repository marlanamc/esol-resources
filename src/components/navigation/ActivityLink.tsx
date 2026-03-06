"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { buildActivityHref, withReturnTo } from "@/lib/learner-navigation";
import { useCurrentAppHref } from "@/hooks/useCurrentAppHref";

interface ActivityLinkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, "href"> {
    activityId: string;
    assignmentId?: string | null;
    href?: string;
    children: ReactNode;
}

export function ActivityLink({
    activityId,
    assignmentId,
    href,
    children,
    ...props
}: ActivityLinkProps) {
    const currentHref = useCurrentAppHref();
    const resolvedHref = withReturnTo(href ?? buildActivityHref(activityId, assignmentId), currentHref);

    return (
        <Link href={resolvedHref} {...props}>
            {children}
        </Link>
    );
}
