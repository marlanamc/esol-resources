"use client";

import type { BackButtonProps } from "@/components/ui/BackButton";
import { BackButton } from "@/components/ui/BackButton";
import { useResolvedLearnerReturnHref } from "@/hooks/useResolvedLearnerReturnHref";

type ContextualBackButtonProps = Omit<BackButtonProps, "href" | "onClick"> & {
    fallbackHref?: string;
    onClick?: () => void;
};

export function ContextualBackButton({
    fallbackHref = "/dashboard",
    onClick,
    ...props
}: ContextualBackButtonProps) {
    const href = useResolvedLearnerReturnHref({ fallbackHref });

    if (onClick) {
        return <BackButton onClick={onClick} {...props} />;
    }

    return <BackButton href={href} {...props} />;
}
