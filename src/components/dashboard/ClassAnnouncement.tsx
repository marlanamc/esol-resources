'use client';

import { useEffect, useState } from 'react';
import { Megaphone, X } from 'lucide-react';

export interface AnnouncementItem {
    id: string;
    className: string;
    message: string;
    messageHtml: string;
    dismissed: boolean;
}

interface ClassAnnouncementProps {
    announcements: AnnouncementItem[];
    /** Omit for anonymous visitors; authenticated dismissals are saved to their account. */
    studentId?: string;
}

const storageKey = (id: string) => `announcement-dismissed:anonymous:${id}`;
const dismissButtonClass = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';

export function ClassAnnouncement({ announcements, studentId }: ClassAnnouncementProps) {
    const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());
    const [ready, setReady] = useState(Boolean(studentId));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (studentId) return;
        const readDismissals = () => {
            try {
                setDismissed(new Set(announcements.filter((item) => localStorage.getItem(storageKey(item.id)) === '1').map((item) => item.id)));
            } catch {
                // Storage may be blocked. Announcements remain available for this visit.
            }
            setReady(true);
        };
        readDismissals();
        window.addEventListener('storage', readDismissals);
        return () => window.removeEventListener('storage', readDismissals);
    }, [announcements, studentId]);

    const visible = ready ? announcements.filter((item) => !item.dismissed && !dismissed.has(item.id)) : [];

    const dismiss = async (id: string) => {
        setDismissed((previous) => new Set(previous).add(id));
        setError(null);
        if (!studentId) {
            try {
                localStorage.setItem(storageKey(id), '1');
            } catch {
                setError('Hidden for this visit. Your browser could not save the dismissal.');
            }
            return;
        }
        try {
            const response = await fetch('/api/announcements/dismiss', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ announcementId: id }),
            });
            if (!response.ok) throw new Error('Dismissal failed');
        } catch {
            setDismissed((previous) => {
                const next = new Set(previous);
                next.delete(id);
                return next;
            });
            setError('Could not save your dismissal. Please try the X again.');
        }
    };

    if (visible.length === 0 && !error) return null;

    return (
        <div className="mb-3 max-w-4xl">
            {error && <p role="alert" className="mb-2 text-sm text-text-muted">{error}</p>}
            {visible.length > 0 && (
                <section aria-label="Teacher announcements" className="space-y-2">
                    {visible.map((announcement) => (
                        <article key={announcement.id} className="dashboard-panel flex items-start gap-2 rounded-2xl py-1.5 pl-3.5 pr-1 lg:pl-5">
                            <Megaphone className="mt-3 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
                            <div className="min-w-0 flex-1 py-1">
                                <p className="m-0 text-[0.6875rem] font-extrabold uppercase tracking-[.07em] text-text-muted lg:text-xs">
                                    {announcements.length > 1 ? announcement.className : 'From your teacher'}
                                </p>
                                <div className="announcement-markdown prose prose-sm mt-0.5 min-w-0 text-[0.9375rem] leading-snug text-text lg:text-base"
                                    dangerouslySetInnerHTML={{ __html: announcement.messageHtml }} />
                            </div>
                            <button type="button" onClick={() => void dismiss(announcement.id)} aria-label="Dismiss announcement" className={dismissButtonClass}>
                                <X size={16} aria-hidden />
                            </button>
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}
