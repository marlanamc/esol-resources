'use client';

import React, { useState } from 'react';
import { Megaphone, ChevronDown, ChevronUp } from 'lucide-react';

interface ClassAnnouncementProps {
    announcements: {
        className: string;
        message: string;
        messageHtml: string;
    }[];
}

export const ClassAnnouncement: React.FC<ClassAnnouncementProps> = ({ announcements }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (!announcements || announcements.length === 0) return null;

    return (
        <section>
            <div className="dashboard-panel paper-texture relative max-w-4xl overflow-hidden rounded-2xl p-6" style={{ borderColor: 'var(--dashboard-border)', background: 'linear-gradient(180deg, var(--dashboard-surface-start) 0%, color-mix(in srgb, #d97706 2%, var(--dashboard-surface-end)) 100%)' }}>
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-200/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                                <Megaphone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-700/80 leading-none">
                                    Notice
                                </p>
                                <h2 className="text-base sm:text-lg font-bold font-display text-text mt-0.5">
                                    From teacher
                                </h2>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="dashboard-soft-button flex items-center gap-1 rounded-lg border border-amber-200/30 p-1.5 text-xs font-semibold text-amber-700 transition-colors sm:p-2 sm:text-sm"
                            style={{ backgroundColor: 'color-mix(in srgb, var(--dashboard-surface-start) 90%, transparent)' }}
                            aria-label={isCollapsed ? "Show announcements" : "Hide announcements"}
                        >
                            <span className="hidden sm:inline">{isCollapsed ? "Show" : "Hide"}</span>
                            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                        </button>
                    </div>

                    {!isCollapsed && (
                        <div className="mt-4 space-y-4">
                            {announcements.map((announcement, index) => (
                                <div
                                    key={`${announcement.className}-${index}`}
                                    className="group relative"
                                >
                                    <div
                                        className="dashboard-panel dashboard-panel-hover flex items-start gap-4 rounded-2xl p-4 sm:p-5"
                                        style={{
                                            borderColor: 'var(--dashboard-divider)',
                                            background: 'linear-gradient(180deg, var(--dashboard-surface-start) 0%, color-mix(in srgb, #d97706 1.5%, var(--dashboard-surface-end)) 100%)',
                                        }}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="handwritten text-primary text-xs sm:text-sm font-bold bg-primary/5 px-2 py-0.5 rounded-md">
                                                    {announcement.className}
                                                </span>
                                                <div className="h-[1px] flex-1 bg-gradient-to-r from-amber-100 to-transparent"></div>
                                            </div>
                                            <div
                                                className="announcement-markdown prose prose-sm max-w-prose text-sm sm:text-base text-text/85"
                                                dangerouslySetInnerHTML={{ __html: announcement.messageHtml }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
