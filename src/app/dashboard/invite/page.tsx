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

const DEFAULT_SHARE_MESSAGE = "Check out this app I’m using to learn English:";

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

        const shareMessage = `${DEFAULT_SHARE_MESSAGE} ${invite.url}`;
        const shareData = {
            title: "Join Class Companion",
            text: DEFAULT_SHARE_MESSAGE,
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

    const whatsappHref = invite?.url
        ? `https://wa.me/?text=${encodeURIComponent(`${DEFAULT_SHARE_MESSAGE} ${invite.url}`)}`
        : "";

    const textHref = invite?.url
        ? `sms:?&body=${encodeURIComponent(`${DEFAULT_SHARE_MESSAGE} ${invite.url}`)}`
        : "";

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
                <div className="rounded-2xl overflow-hidden bg-[var(--color-white)] dark:bg-[var(--color-surface-elevated)] shadow-[var(--shadow-card)] border border-[var(--color-border-subtle)]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 px-6">
                            <p className="text-error mb-4">{error}</p>
                            <button
                                onClick={fetchOrCreateInvite}
                                className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors shadow-[var(--dashboard-button-shadow)]"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : invite ? (
                        <div className="p-5 sm:p-6 space-y-6">
                            {/* Invite Link Section */}
                            <div className="space-y-3">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                                    Your invite link
                                </label>
                                <div className="flex gap-2 items-stretch">
                                    <div className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-[var(--color-surface-base)] border border-[var(--color-border-subtle)] flex items-center">
                                        <span className="text-sm font-mono text-[var(--color-text)] truncate" title={invite.url}>
                                            {invite.url}
                                        </span>
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        aria-label={copied ? "Copied to clipboard" : "Copy link"}
                                        className={`shrink-0 px-5 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                                            copied
                                                ? "bg-secondary text-white shadow-sm"
                                                : "bg-[var(--color-surface-elevated)] text-[var(--color-text)] border border-[var(--color-border-strong)] hover:border-primary/40 hover:bg-[var(--color-surface-base)] active:scale-[0.98]"
                                        }`}
                                    >
                                        {copied ? (
                                            <>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-[var(--color-border-subtle)]" />

                            {/* Share Section */}
                            <div className="space-y-4">
                                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                                    {DEFAULT_SHARE_MESSAGE}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <a
                                        href={whatsappHref || undefined}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-disabled={!invite?.url}
                                        className={`min-h-[52px] rounded-xl px-4 py-3 text-base font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
                                            invite?.url
                                                ? "bg-[#25D366] text-white hover:bg-[#1ebe5d] hover:shadow-md active:scale-[0.99]"
                                                : "pointer-events-none bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]"
                                        }`}
                                    >
                                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        WhatsApp
                                    </a>

                                    <a
                                        href={textHref || undefined}
                                        aria-disabled={!invite?.url}
                                        className={`min-h-[52px] rounded-xl px-4 py-3 text-base font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
                                            invite?.url
                                                ? "bg-[var(--color-surface-elevated)] text-[var(--color-text)] border-2 border-[var(--color-border-strong)] hover:border-primary/40 hover:bg-[var(--color-surface-base)] active:scale-[0.99]"
                                                : "pointer-events-none bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]"
                                        }`}
                                    >
                                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Text
                                    </a>
                                </div>

                                <button
                                    onClick={shareInvite}
                                    className="w-full min-h-[52px] py-3 px-4 rounded-xl text-base font-semibold text-white bg-primary hover:bg-primary-dark transition-all duration-200 shadow-[var(--dashboard-button-shadow)] hover:shadow-[var(--dashboard-button-shadow-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 flex items-center justify-center gap-2.5 active:scale-[0.99]"
                                >
                                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                        />
                                    </svg>
                                    Share Invite Link
                                </button>
                            </div>

                            {shareError && (
                                <p className="text-center text-sm text-secondary" role="status">{shareError}</p>
                            )}
                        </div>
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
