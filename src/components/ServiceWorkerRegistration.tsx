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

      const checkForUpdates = () => {
        if (registration) {
          console.log('[SW] Checking for updates...');
          registration.update().catch((error) => {
            console.error('[SW] Error checking for updates:', error);
          });
        }
      };

      const dispatchUpdateEvent = (worker: ServiceWorker) => {
        const detail: SwUpdateAvailableDetail = { waitingWorker: worker };
        window.dispatchEvent(new CustomEvent<SwUpdateAvailableDetail>('swUpdateAvailable', { detail }));
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          checkForUpdates();
        }
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
          console.log('[SW] Registered successfully:', reg.scope);

          // Check if there's already a waiting service worker
          if (reg.waiting && navigator.serviceWorker.controller) {
            console.log('[SW] Update waiting on page load');
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
                  console.log('[SW] New version available!');
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

          // Check for updates every 5 MINUTES (not every hour)
          // This ensures students get new content quickly
          updateInterval = setInterval(() => {
            checkForUpdates();
          }, 5 * 60 * 1000);

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
        window.removeEventListener('focus', checkForUpdates);
        window.removeEventListener('online', checkForUpdates);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      };
    }
  }, []);

  return null;
}
