"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { BackButtonProps } from "@/components/ui/BackButton";
import { BackButton } from "@/components/ui/BackButton";
import { useResolvedLearnerReturnHref } from "@/hooks/useResolvedLearnerReturnHref";
import { resolveLearnerReturnHrefSync } from "@/lib/learner-navigation";

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
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (onClick) {
        return <BackButton onClick={onClick} {...props} />;
    }

    // The painted href can briefly be the fallback while sessionStorage sources resolve.
    // Resolving again at click time guarantees a fast tap never navigates to a stale target.
    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
            return;
        }
        event.preventDefault();
        router.push(
            resolveLearnerReturnHrefSync({
                pathname,
                search: searchParams.toString(),
                fallbackHref,
            })
        );
    };

    return <BackButton href={href} onClick={handleClick} {...props} />;
}
