"use client";
export default function WorkspaceError({reset}:{reset:()=>void}) {
    return <div role="alert" className="workspace-panel space-y-4"><h2 className="font-display text-xl font-bold">This page couldn’t load</h2><p className="text-sm text-text-muted">Try again to reload your classroom information.</p><button className="workspace-button" onClick={reset}>Try again</button></div>;
}
