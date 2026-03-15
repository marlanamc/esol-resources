import webpush from "web-push";
import { prisma } from "@/lib/prisma";

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

export function isPushConfigured(): boolean {
  return Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);
}

export function getVapidPublicKey(): string | null {
  return VAPID_PUBLIC_KEY ?? null;
}

export function initWebPush(): void {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return;
  webpush.setVapidDetails(
    "mailto:support@classcompanion.app",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export interface PushSubscriptionPayload {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export async function savePushSubscription(
  userId: string,
  subscription: PushSubscriptionPayload
): Promise<void> {
  initWebPush();
  await prisma.pushSubscription.upsert({
    where: { userId },
    create: {
      userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    update: {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  });
}

export async function removePushSubscription(userId: string): Promise<void> {
  await prisma.pushSubscription.deleteMany({ where: { userId } });
}

export async function getPushSubscriptionForUser(
  userId: string
): Promise<{ endpoint: string; p256dh: string; auth: string } | null> {
  const sub = await prisma.pushSubscription.findUnique({
    where: { userId },
    select: { endpoint: true, p256dh: true, auth: true },
  });
  return sub;
}

export async function sendVocabReminderToUser(userId: string): Promise<boolean> {
  if (!isPushConfigured()) return false;
  initWebPush();

  const sub = await getPushSubscriptionForUser(userId);
  if (!sub) return false;

  const payload = JSON.stringify({
    title: "📚 Time for vocab review!",
    body: "Practice your vocabulary to keep your streak going.",
    url: "/dashboard/vocab-review",
    tag: "vocab-daily",
  });

  try {
    await webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      },
      payload,
      { TTL: 86400 }
    );
    return true;
  } catch {
    return false;
  }
}
