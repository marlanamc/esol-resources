/**
 * useVerbPreferences Hook
 * Manages user preferences for the Irregular Verbs game
 * Currently: hideVerbExplanations toggle
 */

'use client';

import { useState, useEffect } from 'react';

interface VerbPreferences {
  hideVerbExplanations: boolean;
}

export function useVerbPreferences() {
  const [preferences, setPreferences] = useState<VerbPreferences>({
    hideVerbExplanations: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user's preferences from API
   */
  useEffect(() => {
    fetchPreferences();
  }, []);

  async function fetchPreferences() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/user/preferences', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch preferences: ${res.statusText}`);
      }

      const data = await res.json();
      setPreferences({
        hideVerbExplanations: data.hideVerbExplanations ?? false
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching preferences:', err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Toggle the "hide explanations" preference
   */
  async function toggleHideExplanations() {
    try {
      const newValue = !preferences.hideVerbExplanations;

      // Optimistic update
      setPreferences(prev => ({
        ...prev,
        hideVerbExplanations: newValue
      }));

      // Save to API
      const res = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hideVerbExplanations: newValue
        })
      });

      if (!res.ok) {
        // Revert on error
        setPreferences(prev => ({
          ...prev,
          hideVerbExplanations: !newValue
        }));
        throw new Error(`Failed to update preferences: ${res.statusText}`);
      }

      const data = await res.json();
      setPreferences({
        hideVerbExplanations: data.hideVerbExplanations ?? newValue
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error updating preferences:', err);
    }
  }

  /**
   * Update any preference
   */
  async function updatePreference<K extends keyof VerbPreferences>(
    key: K,
    value: VerbPreferences[K]
  ) {
    try {
      if (key === 'hideVerbExplanations') {
        // Optimistic update
        setPreferences(prev => ({
          ...prev,
          [key]: value
        }));

        // Save to API
        const res = await fetch('/api/user/preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            hideVerbExplanations: value
          })
        });

        if (!res.ok) {
          throw new Error(`Failed to update preferences: ${res.statusText}`);
        }

        const data = await res.json();
        setPreferences(prev => ({
          ...prev,
          [key]: data.hideVerbExplanations ?? value
        }));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error updating preference:', err);
    }
  }

  return {
    preferences,
    hideExplanations: preferences.hideVerbExplanations,
    loading,
    error,
    toggleHideExplanations,
    updatePreference,
    refetch: fetchPreferences
  };
}
