"use client";

import React, { Component, type ReactNode, type ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional fallback UI to show when an error occurs */
  fallback?: ReactNode;
  /** Optional callback when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Optional custom error message */
  errorMessage?: string;
  /** Whether to show a retry button (default: true) */
  showRetry?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component that catches JavaScript errors in child components.
 * Prevents the entire app from crashing when a component fails.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary fallback={<p>Something went wrong</p>}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error);
      console.error("Component stack:", errorInfo.componentStack);
    }

    // Call optional error callback
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div
          className="flex flex-col items-center justify-center p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          role="alert"
        >
          <div className="text-red-600 dark:text-red-400 mb-2">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-1">
            {this.props.errorMessage || "Something went wrong"}
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4 text-center">
            An error occurred while loading this content.
            {process.env.NODE_ENV === "development" && this.state.error && (
              <span className="block mt-1 font-mono text-xs">
                {this.state.error.message}
              </span>
            )}
          </p>
          {(this.props.showRetry ?? true) && (
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Specialized error boundary for game components.
 * Shows a game-friendly error message.
 */
export function GameErrorBoundary({
  children,
  gameName,
}: {
  children: ReactNode;
  gameName?: string;
}) {
  return (
    <ErrorBoundary
      errorMessage={`${gameName || "This game"} encountered an error`}
      fallback={
        <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700">
          <span className="text-4xl mb-3">🎮</span>
          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
            Oops! Game Error
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 text-center mb-4">
            {gameName || "The game"} ran into a problem. Try refreshing the
            page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
          >
            Refresh Page
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Specialized error boundary for activity renderers.
 */
export function ActivityErrorBoundary({
  children,
  activityType,
}: {
  children: ReactNode;
  activityType?: string;
}) {
  return (
    <ErrorBoundary
      errorMessage={`Failed to load ${activityType || "activity"}`}
      fallback={
        <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-3xl mb-2">📚</span>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Activity Unavailable
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            This activity couldn&apos;t be loaded. Please try again later.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
