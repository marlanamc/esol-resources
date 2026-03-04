'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const INSTALL_PROMPT_DISMISS_KEY = 'pwa-install-prompt-dismissed-at-v1';
const INSTALL_PROMPT_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;
const INSTALL_PROMPT_LAST_SHOWN_KEY = "pwa-install-prompt-last-shown-at-v1";
const INSTALL_PROMPT_VISIT_COUNT_KEY = "pwa-install-prompt-visit-count-v1";
const INSTALL_PROMPT_PERMANENT_DISMISS_KEY = "pwa-install-prompt-permanent-dismiss-v1";
const INSTALL_PROMPT_SESSION_VISIT_KEY = "pwa-install-prompt-session-visit-v1";
const MIN_VISITS_BEFORE_IOS_PROMPT = 3;
const IOS_PROMPT_SHOW_INTERVAL_MS = 21 * 24 * 60 * 60 * 1000;

const copy = {
  installTitle: "Install Class Companion",
  installDescription: "Add to your home screen for quick access and offline use.",
  iosTitle: "Add to Home Screen",
  iosDescription: "Tap Share, then choose “Add to Home Screen” for faster access.",
  installButton: "Install",
  dismissButton: "Maybe Later",
  dismissForever: "Don’t show this tip",
};

function isIosSafari(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return isIOS && isSafari;
}

function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDismissedByCooldown, setIsDismissedByCooldown] = useState(false);
  const [dismissForever, setDismissForever] = useState(false);

  useEffect(() => {
    if (isStandaloneMode()) {
      setIsInstalled(true);
      return;
    }

    const iOS = isIosSafari();
    setIsIOS(iOS);
    const permanentDismiss = window.localStorage.getItem(INSTALL_PROMPT_PERMANENT_DISMISS_KEY) === "1";
    setDismissForever(permanentDismiss);

    const dismissedAtRaw = window.localStorage.getItem(INSTALL_PROMPT_DISMISS_KEY);
    let isCooldownDismissed = false;
    if (dismissedAtRaw) {
      const dismissedAt = Number(dismissedAtRaw);
      if (Number.isFinite(dismissedAt) && Date.now() - dismissedAt < INSTALL_PROMPT_COOLDOWN_MS) {
        isCooldownDismissed = true;
        setIsDismissedByCooldown(true);
      }
    }

    const hasSessionVisit = window.sessionStorage.getItem(INSTALL_PROMPT_SESSION_VISIT_KEY) === "1";
    let visitCount = Number(window.localStorage.getItem(INSTALL_PROMPT_VISIT_COUNT_KEY) || "0");
    if (!hasSessionVisit) {
      visitCount += 1;
      window.localStorage.setItem(INSTALL_PROMPT_VISIT_COUNT_KEY, String(visitCount));
      window.sessionStorage.setItem(INSTALL_PROMPT_SESSION_VISIT_KEY, "1");
    }

    const lastShownAt = Number(window.localStorage.getItem(INSTALL_PROMPT_LAST_SHOWN_KEY) || "0");
    const canShowByInterval = !Number.isFinite(lastShownAt) || Date.now() - lastShownAt > IOS_PROMPT_SHOW_INTERVAL_MS;
    const isEligibleIOSPrompt =
      iOS &&
      !permanentDismiss &&
      !isCooldownDismissed &&
      visitCount >= MIN_VISITS_BEFORE_IOS_PROMPT &&
      canShowByInterval;

    if (isEligibleIOSPrompt) {
      setShowPrompt(true);
      window.localStorage.setItem(INSTALL_PROMPT_LAST_SHOWN_KEY, String(Date.now()));
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isCooldownDismissed) {
        setShowPrompt(true);
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    window.localStorage.setItem(INSTALL_PROMPT_DISMISS_KEY, String(Date.now()));
    setIsDismissedByCooldown(true);
  };

  const handleDismissForever = () => {
    setShowPrompt(false);
    setDismissForever(true);
    window.localStorage.setItem(INSTALL_PROMPT_PERMANENT_DISMISS_KEY, "1");
  };

  // Don't show if already installed or dismissed this session
  if (isInstalled || !showPrompt || isDismissedByCooldown || dismissForever) {
    return null;
  }

  const isAndroidInstallPrompt = !!deferredPrompt;
  const shouldShowIosGuide = isIOS && !isAndroidInstallPrompt;
  if (!isAndroidInstallPrompt && !shouldShowIosGuide) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 animate-fade-in-up">
      <div className="bg-white border-2 border-primary/20 rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg text-text mb-1">
              {shouldShowIosGuide ? copy.iosTitle : copy.installTitle}
            </h3>
            <p className="text-sm text-text-muted mb-4">
              {shouldShowIosGuide ? copy.iosDescription : copy.installDescription}
            </p>
            <div className="flex gap-2">
              {isAndroidInstallPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-2 min-h-[44px] bg-primary text-white font-semibold rounded-lg hover:brightness-110 transition text-sm"
                >
                  {copy.installButton}
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="px-4 py-2 min-h-[44px] border border-border text-text-muted font-medium rounded-lg hover:bg-bg-light transition text-sm"
              >
                {copy.dismissButton}
              </button>
            </div>
            {shouldShowIosGuide && (
              <button
                onClick={handleDismissForever}
                className="mt-2 text-xs text-text-muted hover:text-text underline underline-offset-2"
              >
                {copy.dismissForever}
              </button>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="text-text-muted hover:text-text transition p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
