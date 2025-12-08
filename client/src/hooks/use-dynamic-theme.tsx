import { useState, useEffect } from 'react';
import { getSunPosition } from '@/lib/sun-calc';
import type { ThemeType } from '@shared/schema';

/**
 * Dynamic Theme Hook
 *
 * IMPLEMENTATION NOTES FOR AI ARCHITECT:
 * - Theme changes based on sun elevation at selected location
 * - Default location is San Francisco (can be changed by user)
 * - Updates every minute to keep theme current
 * - Theme types: 'day', 'golden', 'blue', 'night'
 * - Used in App.tsx to apply theme class to root element
 *
 * CUSTOMIZATION POINTS:
 * - Add location context to make this user-configurable
 * - Persist theme preference in localStorage
 * - Add manual override option
 */

interface UseDynamicThemeReturn {
  themeType: ThemeType;
  sunElevation: number;
}

export function useDynamicTheme(
  latitude: number = 37.7749,  // Default: San Francisco
  longitude: number = -122.4194
): UseDynamicThemeReturn {
  const [themeType, setThemeType] = useState<ThemeType>('night');
  const [sunElevation, setSunElevation] = useState<number>(0);

  useEffect(() => {
    const updateTheme = () => {
      const position = getSunPosition(latitude, longitude);
      const elevation = position.elevation;

      setSunElevation(elevation);

      // Determine theme based on sun elevation
      let newTheme: ThemeType;

      if (elevation > 6) {
        // Sun is well above horizon - daytime
        newTheme = 'day';
      } else if (elevation > -0.833) {
        // Sun near horizon - golden hour
        newTheme = 'golden';
      } else if (elevation > -6) {
        // Sun just below horizon - blue hour/twilight
        newTheme = 'blue';
      } else {
        // Sun well below horizon - night
        newTheme = 'night';
      }

      setThemeType(newTheme);
    };

    // Update immediately
    updateTheme();

    // Update every minute
    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, [latitude, longitude]);

  return { themeType, sunElevation };
}

/**
 * USAGE EXAMPLE:
 *
 * In a component:
 * ```tsx
 * const { themeType, sunElevation } = useDynamicTheme(userLat, userLon);
 *
 * return (
 *   <div className={`theme-${themeType}`}>
 *     <p>Current elevation: {sunElevation.toFixed(1)}°</p>
 *     <p>Theme: {themeType}</p>
 *   </div>
 * );
 * ```
 *
 * The theme class is applied in App.tsx at the root level,
 * which changes CSS variables throughout the app.
 */
