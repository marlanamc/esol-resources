"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface InviteData {
    id: string;
    code: string;
    url: string;
    createdAt: string;
    isNew?: boolean;
}

export default function InvitePage() {
    const [invite, setInvite] = useState<InviteData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [shareError, setShareError] = useState("");

    const fetchOrCreateInvite = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            // First try to create/get invite via POST
            const response = await fetch("/api/invites", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to get invite link");
            }

            const data = await response.json();
            if (data.ok && data.data) {
                setInvite(data.data);
            } else {
                throw new Error(data.error || "Failed to get invite link");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get invite link");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrCreateInvite();
    }, [fetchOrCreateInvite]);

    const copyToClipboard = async () => {
        if (!invite?.url) return;

        try {
            await navigator.clipboard.writeText(invite.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = invite.url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareInvite = async () => {
        if (!invite?.url) return;
        setShareError("");

        const shareData = {
            title: "Join Class Companion",
            text: "I'm inviting you to learn English with me on Class Companion!",
            url: invite.url,
        };

        try {
            if (navigator.share && navigator.canShare?.(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback to copy
                await copyToClipboard();
            }
        } catch (err) {
            // User cancelled share or share failed
            if (err instanceof Error && err.name !== "AbortError") {
                setShareError("Could not share. Link copied instead.");
                await copyToClipboard();
            }
        }
    };

    return (
        <div className="min-h-screen bg-bg px-4 py-6 sm:py-8">
            <div className="max-w-lg mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-base)] transition-colors"
                        aria-label="Back to dashboard"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-[var(--color-text)]">Invite Friends</h1>
                        <p className="text-sm text-[var(--color-text-muted)]">Share your invite link</p>
                    </div>
                </div>

                {/* Main Card */}
                <div className="border rounded-2xl p-5 sm:p-6 bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] border-[var(--color-border-strong)] shadow-md space-y-5">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-error mb-4">{error}</p>
                            <button
                                onClick={fetchOrCreateInvite}
                                className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : invite ? (
                        <>
                            {/* Invite Code Display */}
                            <div className="text-center">
                                <p className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">Your invite code</p>
                                <p className="text-3xl font-mono font-bold tracking-widest text-primary">
                                    {invite.code}
                                </p>
                            </div>

                            {/* Invite Link */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-[var(--color-text)]">
                                    Invite Link
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={invite.url}
                                        readOnly
                                        className="flex-1 px-4 py-3 min-h-[48px] border-2 rounded-xl bg-[var(--color-surface-base)] text-[var(--color-text)] border-[var(--color-border-subtle)] text-sm font-mono truncate"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className={`px-4 py-3 min-h-[48px] rounded-xl font-semibold transition-colors whitespace-nowrap ${
                                            copied
                                                ? "bg-secondary text-white"
                                                : "bg-[var(--color-surface-elevated)] text-[var(--color-text)] border-2 border-[var(--color-border-strong)] hover:bg-[var(--color-surface-base)]"
                                        }`}
                                    >
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                            </div>

                            {/* Share Button */}
                            <button
                                onClick={shareInvite}
                                className="w-full min-h-[52px] py-3 px-4 rounded-xl text-base font-semibold text-white bg-primary hover:bg-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 shadow-sm flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                    />
                                </svg>
                                Share Invite Link
                            </button>

                            {shareError && (
                                <p className="text-center text-sm text-secondary">{shareError}</p>
                            )}
                        </>
                    ) : null}
                </div>

                {/* Info Box */}
                <div className="border rounded-2xl p-4 sm:p-5 bg-[var(--color-surface-elevated)] border-[var(--color-border-subtle)] space-y-3">
                    <h3 className="font-semibold text-[var(--color-text)]">How it works</h3>
                    <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                        <li className="flex gap-2">
                            <span className="text-primary font-semibold">1.</span>
                            Share your invite link with friends, family, or coworkers
                        </li>
                        <li className="flex gap-2">
                            <span className="text-primary font-semibold">2.</span>
                            They create their own account using your link
                        </li>
                        <li className="flex gap-2">
                            <span className="text-primary font-semibold">3.</span>
                            They can start learning English right away
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
