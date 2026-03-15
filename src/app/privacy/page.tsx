import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Class Companion",
  description:
    "Privacy policy for Class Companion ESOL learning platform. How we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--color-bg-gradient-start) 0%, var(--color-bg) 50%, var(--color-bg-gradient-end) 100%)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50"
          style={{ animationDuration: "6s" }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-12 sm:py-16">
        <div className="bg-white/95 dark:bg-[var(--color-surface-elevated)] rounded-2xl shadow-lg border border-[var(--color-border-subtle)] p-8 sm:p-10 space-y-8">
          <div>
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:underline mb-4 inline-block"
            >
              ← Back to Home
            </Link>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--color-text)]">
              Privacy Policy
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Last updated: March 2026
            </p>
          </div>

          <p className="text-[var(--color-text)]">
            Class Companion (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
            is an ESOL (English for Speakers of Other Languages) learning
            platform. This privacy policy explains how we collect, use, and
            protect your information.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              Information We Collect
            </h2>
            <p className="text-[var(--color-text)] mb-2">
              When you use Class Companion, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-[var(--color-text)]">
              <li>
                <strong>Account information:</strong> Username, name (if
                provided), and a securely hashed password
              </li>
              <li>
                <strong>Learning data:</strong> Your submissions, quiz scores,
                activity progress, and points
              </li>
              <li>
                <strong>Usage data:</strong> Login activity, streak information,
                and achievement history
              </li>
              <li>
                <strong>Push notifications (optional):</strong> If you enable
                vocab reminders, we store your push subscription details to send
                notifications
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              How We Use Your Information
            </h2>
            <p className="text-[var(--color-text)]">
              We use your information to operate the learning platform, track
              your progress, award points and achievements, show leaderboards,
              and send you optional reminder notifications. Your teacher may see
              your progress and scores within your class.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              Analytics
            </h2>
            <p className="text-[var(--color-text)]">
              We use Vercel Analytics to understand how people use our app
              (e.g., page views, navigation patterns). This helps us improve the
              product. Vercel Analytics does not collect personally identifiable
              information and complies with privacy regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              Data Retention &amp; Security
            </h2>
            <p className="text-[var(--color-text)]">
              Your data is stored for as long as your account exists. We use
              industry-standard security practices: passwords are hashed,
              connections use HTTPS, and access is restricted. When you delete
              your account, your data is permanently removed from our systems.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              Your Rights
            </h2>
            <p className="text-[var(--color-text)]">
              You can view and manage your profile, change your password, and
              request deletion of your account at any time. Account deletion is
              available in your profile settings and permanently removes all
              your data. Teachers managing classes should contact support for
              account deletion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              Contact
            </h2>
            <p className="text-[var(--color-text)]">
              If you have questions about this privacy policy or your data,
              contact us at{" "}
              <a
                href="mailto:mcreed@ebhcs.org"
                className="text-primary font-medium hover:underline"
              >
                mcreed@ebhcs.org
              </a>
              .
            </p>
          </section>

          <div className="pt-4 border-t border-[var(--color-border-subtle)]">
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
