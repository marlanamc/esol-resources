"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Trash2 } from "lucide-react";

const SUPPORT_EMAIL = "mcreed@ebhcs.org";

interface DeleteAccountSectionProps {
  userRole: "student" | "teacher";
}

export function DeleteAccountSection({ userRole }: DeleteAccountSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => {
    setShowModal(true);
    setReason("");
    setConfirmed(false);
    setError("");
  };

  const handleClose = () => {
    setShowModal(false);
    setReason("");
    setConfirmed(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = reason.trim();
    if (trimmed.length < 10) {
      setError("Please provide a reason (at least 10 characters).");
      return;
    }
    if (!confirmed) {
      setError("Please confirm that you understand your data will be permanently deleted.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: trimmed }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Failed to delete account");
        setLoading(false);
        return;
      }

      await signOut({ redirect: false });
      window.location.href = "/";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (userRole === "teacher") {
    return (
      <div className="mt-10 pt-8 border-t border-[var(--color-border-subtle)]">
        <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">
          Delete account
        </h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          To delete your teacher account, please contact{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-primary font-medium hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
          . Teacher accounts manage classes and require manual handling.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 pt-8 border-t border-[var(--color-border-subtle)]">
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-red-600 dark:hover:text-red-400 transition-colors"
          aria-label="Delete my account"
        >
          <Trash2 className="w-4 h-4" aria-hidden />
          Delete my account
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div
            className="bg-white dark:bg-[var(--color-surface-elevated)] rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="delete-account-title"
              className="text-lg font-semibold text-[var(--color-text)]"
            >
              Delete my account
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              This action cannot be undone. All your progress, points, and data
              will be permanently deleted.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="delete-reason"
                  className="block text-sm font-medium text-[var(--color-text)] mb-1"
                >
                  Why are you leaving? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="delete-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. No longer need it, privacy concerns, using something else..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                  minLength={10}
                  maxLength={2000}
                  disabled={loading}
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 rounded border-[var(--color-border-strong)] text-primary focus:ring-primary/50"
                  disabled={loading}
                />
                <span className="text-sm text-[var(--color-text)]">
                  I understand my data will be permanently deleted and cannot be
                  recovered.
                </span>
              </label>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-border-strong)] text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Deleting…" : "Delete my account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
