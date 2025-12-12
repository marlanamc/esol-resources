'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register service worker on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production' &&
      isMobile
    ) {
      let registration: ServiceWorkerRegistration | null = null;
      let updateInterval: NodeJS.Timeout | null = null;

      const checkForUpdates = () => {
        if (registration) {
          registration.update().catch((error) => {
            console.error('Error checking for service worker updates:', error);
          });
        }
      };

      navigator.serviceWorker
        .register('/sw.js', { updateViaCache: 'none' })
        .then((reg) => {
          registration = reg;
          console.log('Service Worker registered successfully:', reg.scope);

          // Check if there's already a waiting service worker
          if (reg.waiting && navigator.serviceWorker.controller) {
            console.log('Waiting service worker found on page load');
            window.dispatchEvent(
              new CustomEvent('swUpdateAvailable', {
                detail: { waitingWorker: reg.waiting }
              })
            );
          }

          // Listen for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;

            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                // When the new service worker is installed and waiting
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // Notify the app that an update is available
                  console.log('New service worker available! Notifying user...');

                  // Dispatch custom event that PWAUpdateNotification listens for
                  window.dispatchEvent(
                    new CustomEvent('swUpdateAvailable', {
                      detail: { waitingWorker: newWorker }
                    })
                  );
                }
              });
            }
          });

          // Check for updates immediately on page load
          checkForUpdates();

          // Check for updates when window regains focus
          window.addEventListener('focus', checkForUpdates);

          // Check for updates periodically (every hour)
          updateInterval = setInterval(() => {
            checkForUpdates();
          }, 60 * 60 * 1000);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Cleanup function
      return () => {
        if (updateInterval) {
          clearInterval(updateInterval);
        }
        window.removeEventListener('focus', checkForUpdates);
      };
    }
  }, []);

  return null;
}


