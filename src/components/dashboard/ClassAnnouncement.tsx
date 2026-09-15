'use client';

import React, { useState } from 'react';
import { Megaphone, ChevronDown, ChevronUp } from 'lucide-react';

export interface AnnouncementItem {
    className: string;
    message: string;
    messageHtml: string;
}

interface ClassAnnouncementProps {
    announcements: AnnouncementItem[];
}

export const ClassAnnouncement: React.FC<ClassAnnouncementProps> = ({ announcements }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (!announcements || announcements.length === 0) return null;

    return (
        <section className="dashboard-panel max-w-4xl rounded-2xl px-4 py-3 sm:px-5" aria-label="Announcements">
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                    <Megaphone className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                    <h2 className="truncate font-display text-base font-bold text-text">
                        Announcements
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={() => setIsCollapsed((collapsed) => !collapsed)}
                    className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                    aria-label={isCollapsed ? 'Show announcements' : 'Hide announcements'}
                    aria-expanded={!isCollapsed}
                >
                    <span>{isCollapsed ? 'Show' : 'Hide'}</span>
                    {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
            </div>

            {!isCollapsed && (
                <div className="mt-2 divide-y divide-[var(--dashboard-divider)]">
                    {announcements.map((announcement, index) => (
                        <div key={`${announcement.className}-${index}`} className="flex flex-wrap items-start gap-x-3 gap-y-1.5 py-2.5 first:pt-2">
                            <span className="shrink-0 rounded-md bg-primary/5 px-2 py-0.5 text-xs font-semibold text-primary">
                                {announcement.className}
                            </span>
                            <div
                                className="announcement-markdown prose prose-sm min-w-0 flex-1 basis-56 text-sm leading-relaxed text-text/85 sm:text-base"
                                dangerouslySetInnerHTML={{ __html: announcement.messageHtml }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};
