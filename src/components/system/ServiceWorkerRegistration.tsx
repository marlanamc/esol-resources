'use client';

import { useEffect } from 'react';
import type { SwUpdateAvailableDetail } from '@/types/pwa';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Register service worker on ALL devices (not just mobile)
    // This ensures consistent behavior and update notifications everywhere
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      const buildId = process.env.NEXT_PUBLIC_BUILD_ID || 'local-dev';
      let registration: ServiceWorkerRegistration | null = null;
      let updateInterval: NodeJS.Timeout | null = null;
      let hasReloaded = false;
      const SW_UPDATE_INTERVAL_MS = 3 * 60 * 1000;
      const SW_UPDATE_RETRY_COOLDOWN_MS = 30 * 1000;
      const SW_VISIBILITY_DELAY_MS = 300;
      const SW_VISIBILITY_THROTTLE_MS = 30 * 1000;
      let lastUpdateCheckAt = 0;
      let updateRetryBackoffUntil = 0;

      const checkForUpdates = () => {
        if (registration) {
          const now = Date.now();
          if (now < updateRetryBackoffUntil) return;
          if (now - lastUpdateCheckAt < 2000) return;
          lastUpdateCheckAt = now;
          registration.update().catch((error) => {
            console.error('[SW] Error checking for updates:', error);
            updateRetryBackoffUntil = Date.now() + SW_UPDATE_RETRY_COOLDOWN_MS;
          });
        }
      };

      const dispatchUpdateEvent = (worker: ServiceWorker) => {
        const detail: SwUpdateAvailableDetail = { waitingWorker: worker };
        window.dispatchEvent(new CustomEvent<SwUpdateAvailableDetail>('swUpdateAvailable', { detail }));
      };

      let lastVisibilityCheckAt = 0;
      let visibilityCheckTimeoutId: ReturnType<typeof setTimeout> | null = null;

      const handleVisibilityChange = () => {
        if (document.visibilityState !== 'visible') return;

        if (visibilityCheckTimeoutId) {
          clearTimeout(visibilityCheckTimeoutId);
          visibilityCheckTimeoutId = null;
        }

        const now = Date.now();
        const timeSinceLastCheck = now - lastVisibilityCheckAt;
        if (timeSinceLastCheck < SW_VISIBILITY_THROTTLE_MS) {
          return;
        }

        visibilityCheckTimeoutId = setTimeout(() => {
          visibilityCheckTimeoutId = null;
          lastVisibilityCheckAt = Date.now();
          checkForUpdates();
        }, SW_VISIBILITY_DELAY_MS);
      };

      const handleControllerChange = () => {
        if (hasReloaded) return;
        hasReloaded = true;
        window.location.reload();
      };

      navigator.serviceWorker
        .register(`/sw.js?build=${encodeURIComponent(buildId)}`, { updateViaCache: 'none' })
        .then((reg) => {
          registration = reg;

          // Check if there's already a waiting service worker
          if (reg.waiting && navigator.serviceWorker.controller) {
            dispatchUpdateEvent(reg.waiting);
          }

          // Listen for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;

            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  dispatchUpdateEvent(newWorker);
                }
              });
            }
          });

          // Check for updates immediately
          checkForUpdates();

          // Check for updates when window regains focus (user returns to app)
          window.addEventListener('focus', checkForUpdates);

          // Check for updates when coming back online
          window.addEventListener('online', checkForUpdates);

          // Check for updates on a classroom-friendly cadence and still keep students current.
          updateInterval = setInterval(() => {
            checkForUpdates();
          }, SW_UPDATE_INTERVAL_MS);

          // Also check on visibility change (when tab becomes visible)
          document.addEventListener('visibilitychange', handleVisibilityChange);
          navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange, {
            once: true,
          });
        })
        .catch((error) => {
          console.error('[SW] Registration failed:', error);
        });

      return () => {
        if (updateInterval) {
          clearInterval(updateInterval);
        }
        if (visibilityCheckTimeoutId) {
          clearTimeout(visibilityCheckTimeoutId);
        }
        window.removeEventListener('focus', checkForUpdates);
        window.removeEventListener('online', checkForUpdates);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      };
    }
  }, []);

  return null;
}
