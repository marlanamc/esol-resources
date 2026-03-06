"use client";

import type { BackButtonProps } from "@/components/ui/BackButton";
import { BackButton } from "@/components/ui/BackButton";
import { useResolvedLearnerReturnHref } from "@/hooks/useResolvedLearnerReturnHref";

type ContextualBackButtonProps = Omit<BackButtonProps, "href" | "onClick"> & {
    fallbackHref?: string;
};

export function ContextualBackButton({
    fallbackHref = "/dashboard",
    ...props
}: ContextualBackButtonProps) {
    const href = useResolvedLearnerReturnHref({ fallbackHref });

    return <BackButton href={href} {...props} />;
}
