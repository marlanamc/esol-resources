'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarClock, ClipboardList } from 'lucide-react';
import {
    formatMakeUpDeadlineLabel,
    getCurrentMakeUpDeadline,
} from '@/lib/catch-up-deadlines';

export function MissedClassCatchUpCard() {
    const makeUpDeadline = getCurrentMakeUpDeadline();
    const makeUpLabel = formatMakeUpDeadlineLabel(makeUpDeadline);

    return (
        <section
            aria-labelledby="catch-up-heading"
            className="dashboard-panel paper-texture overflow-hidden rounded-2xl border p-4 sm:p-5"
            style={{ borderColor: 'var(--dashboard-border)' }}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-3">
                    <div className="flex items-center gap-2.5">
                        <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg"
                            style={{
                                backgroundColor: 'color-mix(in srgb, var(--secondary) 16%, transparent)',
                                color: 'var(--secondary)',
                            }}
                        >
                            <ClipboardList className="h-4 w-4" aria-hidden />
                        </div>
                        <div>
                            <h2 id="catch-up-heading" className="text-base sm:text-lg font-display font-bold text-text leading-tight">
                                Missed class? Start here
                            </h2>
                            <p className="mt-0.5 text-xs sm:text-sm text-text-muted">
                                Same path every week — finish required items before the next class.
                            </p>
                        </div>
                    </div>

                    <ol className="space-y-1.5 text-sm text-text/85 list-decimal list-inside marker:font-semibold marker:text-primary">
                        <li>Log in at <strong>myesolclass.com</strong></li>
                        <li>Open <strong>This Week&apos;s Path</strong> below</li>
                        <li>Complete items marked <strong>Required</strong></li>
                        <li>Learn the 6 words + 3 verbs and finish the quiz</li>
                    </ol>

                    <p className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
                        style={{
                            borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)',
                            backgroundColor: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                            color: 'var(--text-color)',
                        }}
                    >
                        <CalendarClock className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                        {makeUpLabel}
                    </p>

                    <p className="text-xs text-text-muted leading-relaxed">
                        Missing class is okay. Partner stations are in-class only — you do not need to make those up at home.
                    </p>
                </div>

                <Link
                    href="#weekly-path"
                    className="dashboard-accent-button inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full px-4 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                    style={{
                        '--dashboard-button-accent': 'var(--secondary)',
                        '--dashboard-button-text': 'var(--secondary)',
                    } as React.CSSProperties}
                >
                    <span>Open This Week&apos;s Path</span>
                    <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
            </div>
        </section>
    );
}
