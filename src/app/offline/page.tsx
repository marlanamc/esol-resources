import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl border border-border/50 bg-white p-6 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-text mb-2">You are offline</h1>
        <p className="text-sm text-text-muted mb-5">
          Class Companion could not load this page without internet. Reconnect and try again.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        >
          Back to Dashboard
        </Link>
      </section>
    </main>
  );
}
