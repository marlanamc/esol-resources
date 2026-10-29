"use client";

import { createContext, useCallback, useContext, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./TeachHomeTabs.module.css";

export type TeachHomeTab = {
    id: string;
    label: string;
    count: number;
    hint: string;
    /** Highlight the count when it is something the teacher still has to do. */
    attention?: boolean;
    panel: ReactNode;
};

const AdjustCountContext = createContext<(delta: number) => void>(() => {});

/** Panels call this to move their tab's count when the teacher clears (or reopens) an item. No-op outside the tabs. */
export function useAdjustTabCount() {
    return useContext(AdjustCountContext);
}

/** The teacher Home "Needs you" tiles: each one is a tab with a live count. Panels stay mounted so drafts survive switching. */
export function TeachHomeTabs({ tabs, initialTab }: { tabs: TeachHomeTab[]; initialTab: string }) {
    const baseId = useId();
    const [selected, setSelected] = useState(tabs.some((t) => t.id === initialTab) ? initialTab : tabs[0]?.id);
    const [counts, setCounts] = useState(() => Object.fromEntries(tabs.map((t) => [t.id, t.count])));
    const buttons = useRef<(HTMLButtonElement | null)[]>([]);

    const select = useCallback((id: string) => {
        setSelected(id);
        const url = new URL(window.location.href);
        url.searchParams.set("view", id);
        window.history.replaceState(window.history.state, "", url);
    }, []);

    function onKeyDown(event: KeyboardEvent, index: number) {
        const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        if (!step) return;
        event.preventDefault();
        const next = (index + step + tabs.length) % tabs.length;
        buttons.current[next]?.focus();
        select(tabs[next].id);
    }

    return (
        <div>
            <div role="tablist" aria-label="Needs you" className={styles.tabList}>
                {tabs.map((tab, index) => (
                    <button
                        key={tab.id}
                        ref={(el) => {
                            buttons.current[index] = el;
                        }}
                        type="button"
                        role="tab"
                        id={`${baseId}-tab-${tab.id}`}
                        aria-controls={`${baseId}-panel-${tab.id}`}
                        aria-selected={selected === tab.id}
                        tabIndex={selected === tab.id ? 0 : -1}
                        data-attention={tab.attention && counts[tab.id] > 0}
                        className={styles.tab}
                        onClick={() => select(tab.id)}
                        onKeyDown={(event) => onKeyDown(event, index)}
                    >
                        <span className={`${styles.count} font-display text-3xl font-bold tabular-nums`}>{counts[tab.id]}</span>
                        <span className="text-sm font-semibold">{tab.label}</span>
                        <span className={`${styles.hint} text-xs`}>{tab.hint}</span>
                    </button>
                ))}
            </div>
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    role="tabpanel"
                    id={`${baseId}-panel-${tab.id}`}
                    aria-labelledby={`${baseId}-tab-${tab.id}`}
                    hidden={selected !== tab.id}
                    className={styles.panel}
                >
                    <AdjustCountContext.Provider
                        value={(delta) => setCounts((c) => ({ ...c, [tab.id]: Math.max(0, (c[tab.id] ?? 0) + delta) }))}
                    >
                        {tab.panel}
                    </AdjustCountContext.Provider>
                </div>
            ))}
        </div>
    );
}
