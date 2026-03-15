"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";

interface VocabReminderOptInProps {
  className?: string;
}

export function VocabReminderOptIn({ className = "" }: VocabReminderOptInProps) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [configOk, setConfigOk] = useState(false);

  useEffect(() => {
    setPushSupported(
      typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window
    );
  }, []);

  useEffect(() => {
    if (!pushSupported) return;
    fetch("/api/push/vapid-public")
      .then((r) => r.json())
      .then((data) => setConfigOk(Boolean(data.enabled && data.publicKey)))
      .catch(() => setConfigOk(false));
  }, [pushSupported]);

  useEffect(() => {
    if (!pushSupported || !configOk) return;
    fetch("/api/push/status")
      .then((r) => r.json())
      .then((data) => setEnabled(Boolean(data.subscribed)))
      .catch(() => setEnabled(false));
  }, [pushSupported, configOk]);

  const toggle = async () => {
    if (enabled === null || loading || !configOk) return;
    setLoading(true);
    try {
      if (enabled) {
        await fetch("/api/push/unsubscribe", { method: "POST" });
        setEnabled(false);
      } else {
        const perm = await Notification.requestPermission();
        if (perm !== "granted") {
          setLoading(false);
          return;
        }
        const reg = await navigator.serviceWorker.ready;
        const vapidRes = await fetch("/api/push/vapid-public");
        const { publicKey } = await vapidRes.json();
        if (!publicKey) throw new Error("No public key");
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
        });
        const payload = sub.toJSON();
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setEnabled(true);
      }
    } catch (err) {
      console.error("Push subscribe error", err);
    } finally {
      setLoading(false);
    }
  };

  if (!pushSupported || !configOk) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading || enabled === null}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${className}`}
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: enabled ? "var(--secondary)" : "var(--surface-elevated)",
        color: enabled ? "white" : "var(--text)",
      }}
      aria-pressed={enabled ?? false}
    >
      {enabled ? (
        <>
          <Bell className="h-4 w-4" aria-hidden />
          Daily reminder on
        </>
      ) : (
        <>
          <BellOff className="h-4 w-4" aria-hidden />
          Enable daily reminder
        </>
      )}
    </button>
  );
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}
