import { useState, useEffect, useCallback } from 'react';
import { getSunPosition } from '@/lib/sun-calc';
import type { ThemeType } from '@shared/schema';

/**
 * Dynamic Theme Hook with Manual Override
 *
 * IMPLEMENTATION NOTES FOR AI ARCHITECT:
 * - Theme changes based on sun elevation at the selected location
 * - Default location is San Francisco (can be changed by user)
 * - Updates every minute to keep theme current
 * - Theme types: 'day', 'golden', 'blue', 'night'
 * - A manual override (persisted to localStorage) pins the theme regardless
 *   of sun position; 'auto' returns to sun-position-driven theming.
 *
 * CUSTOMIZATION POINTS:
 * - Add location context to make this user-configurable
 * - Persist theme preference in localStorage
 * - Add manual override option
 */

export const THEME_OVERRIDE_KEY = 'lightlog-theme-override';

export type ThemeOverride = ThemeType | 'auto';

const OVERRIDE_VALUES: ThemeOverride[] = ['auto', 'day', 'golden', 'blue', 'night'];

function readStoredOverride(): ThemeOverride {
  if (typeof window === 'undefined') return 'auto';
  try {
    const stored = window.localStorage.getItem(THEME_OVERRIDE_KEY) as ThemeOverride | null;
    if (stored && OVERRIDE_VALUES.includes(stored)) {
      return stored;
    }
  } catch {
    // ignore localStorage access errors (private mode, etc.)
  }
  return 'auto';
}

interface UseDynamicThemeReturn {
  themeType: ThemeType;
  sunElevation: number;
  override: ThemeOverride;
  setOverride: (override: ThemeOverride) => void;
  isManual: boolean;
}

export function useDynamicTheme(
  latitude: number = 37.7749,  // Default: San Francisco
  longitude: number = -122.4194
): UseDynamicThemeReturn {
  const [autoTheme, setAutoTheme] = useState<ThemeType>('night');
  const [sunElevation, setSunElevation] = useState<number>(0);
  const [override, setOverrideState] = useState<ThemeOverride>(readStoredOverride);

  useEffect(() => {
    const updateTheme = () => {
      const position = getSunPosition(latitude, longitude);
      const elevation = position.elevation;

      setSunElevation(elevation);

      let newTheme: ThemeType;
      if (elevation > 6) {
        newTheme = 'day';
      } else if (elevation > -0.833) {
        newTheme = 'golden';
      } else if (elevation > -6) {
        newTheme = 'blue';
      } else {
        newTheme = 'night';
      }

      setAutoTheme(newTheme);
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, [latitude, longitude]);

  // Persist override to localStorage whenever it changes.
  const setOverride = useCallback((next: ThemeOverride) => {
    setOverrideState(next);
    try {
      window.localStorage.setItem(THEME_OVERRIDE_KEY, next);
    } catch {
      // ignore persistence failures
    }
  }, []);

  const themeType: ThemeType = override === 'auto' ? autoTheme : override;

  return {
    themeType,
    sunElevation,
    override,
    setOverride,
    isManual: override !== 'auto',
  };
}