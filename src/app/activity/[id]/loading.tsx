// Route-level loading UI for /activity/[id]. Rendered instantly during the navigation
// transition (e.g. from the course map) so the click-through never flashes blank or
// generic chrome before the activity shell mounts. Kept neutral so it reads cleanly under
// both the immersive and standard activity layouts in page.tsx.
export default function ActivityLoading() {
    return (
        <div className="min-h-screen bg-bg flex flex-col">
            {/* Slim header placeholder to match the activity shells' top bar */}
            <div className="h-[60px] flex-shrink-0 border-b border-black/5 dark:border-white/10" />
            {/* Calm centered spinner */}
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
        </div>
    );
}
