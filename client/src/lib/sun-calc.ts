import SunCalc from 'suncalc';
import type { SunPosition, SunTimes, MoonData } from '@shared/schema';

/**
 * Sun Position Calculation Utilities
 *
 * IMPLEMENTATION NOTES FOR AI ARCHITECT:
 * - Uses SunCalc library for astronomical calculations
 * - All angles in degrees (not radians)
 * - Elevation: -90 (below horizon) to +90 (overhead)
 * - Azimuth: 0 (North) to 360 (full circle)
 * - Times are returned as ISO 8601 strings
 * - Handles timezone conversions properly
 */

/**
 * Get current sun position for given coordinates
 * @param latitude - Latitude in degrees (-90 to 90)
 * @param longitude - Longitude in degrees (-180 to 180)
 * @param date - Optional date (defaults to now)
 * @returns Sun position with elevation and azimuth in degrees
 */
export function getSunPosition(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): SunPosition {
  const position = SunCalc.getPosition(date, latitude, longitude);

  // Convert radians to degrees
  const elevation = (position.altitude * 180) / Math.PI;
  const azimuth = ((position.azimuth * 180) / Math.PI + 180) % 360;

  return {
    elevation,
    azimuth,
    altitude: elevation, // SunCalc compatibility
  };
}

/**
 * Get sun times for a given date and location
 * @param latitude - Latitude in degrees
 * @param longitude - Longitude in degrees
 * @param date - Date to calculate times for
 * @returns Object with all sun time events as ISO strings
 */
export function getSunTimes(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): SunTimes {
  const times = SunCalc.getTimes(date, latitude, longitude);

  return {
    sunrise: times.sunrise.toISOString(),
    sunset: times.sunset.toISOString(),
    sunriseEnd: times.sunriseEnd.toISOString(),
    sunsetStart: times.sunsetStart.toISOString(),
    dawn: times.dawn.toISOString(),
    dusk: times.dusk.toISOString(),
    nauticalDawn: times.nauticalDawn.toISOString(),
    nauticalDusk: times.nauticalDusk.toISOString(),
    goldenHourEnd: times.goldenHourEnd.toISOString(),
    goldenHour: times.goldenHour.toISOString(),
  };
}

/**
 * Get moon phase and illumination data
 * @param date - Date to calculate moon data for
 * @returns Moon phase, illumination, and phase name
 */
export function getMoonData(date: Date = new Date()): MoonData {
  const illumination = SunCalc.getMoonIllumination(date);

  // Determine moon phase name based on phase value
  const phase = illumination.phase;
  let phaseName: MoonData['phaseName'];

  if (phase < 0.03 || phase > 0.97) {
    phaseName = 'New Moon';
  } else if (phase < 0.22) {
    phaseName = 'Waxing Crescent';
  } else if (phase < 0.28) {
    phaseName = 'First Quarter';
  } else if (phase < 0.47) {
    phaseName = 'Waxing Gibbous';
  } else if (phase < 0.53) {
    phaseName = 'Full Moon';
  } else if (phase < 0.72) {
    phaseName = 'Waning Gibbous';
  } else if (phase < 0.78) {
    phaseName = 'Last Quarter';
  } else {
    phaseName = 'Waning Crescent';
  }

  return {
    phase: illumination.phase,
    illumination: illumination.fraction,
    angle: illumination.angle,
    phaseName,
  };
}

/**
 * Determine lighting type based on sun elevation
 * @param elevation - Sun elevation in degrees
 * @returns Lighting type string
 */
export function getLightingType(elevation: number): string {
  if (elevation > 6) {
    return 'Midday';
  } else if (elevation > -0.833) {
    return 'Golden Hour';
  } else if (elevation > -6) {
    return 'Blue Hour';
  } else if (elevation > -12) {
    return 'Twilight';
  } else {
    return 'Night';
  }
}

/**
 * Check if it's currently golden hour
 * @param latitude - Latitude in degrees
 * @param longitude - Longitude in degrees
 * @param date - Date to check (defaults to now)
 * @returns True if within golden hour window
 */
export function isGoldenHour(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): boolean {
  const times = SunCalc.getTimes(date, latitude, longitude);
  const now = date.getTime();

  const morningGolden = times.sunrise.getTime() <= now && now <= times.goldenHourEnd.getTime();
  const eveningGolden = times.goldenHour.getTime() <= now && now <= times.sunset.getTime();

  return morningGolden || eveningGolden;
}

/**
 * Check if it's currently blue hour
 * @param latitude - Latitude in degrees
 * @param longitude - Longitude in degrees
 * @param date - Date to check (defaults to now)
 * @returns True if within blue hour window
 */
export function isBlueHour(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): boolean {
  const times = SunCalc.getTimes(date, latitude, longitude);
  const now = date.getTime();

  const morningBlue = times.nauticalDawn.getTime() <= now && now <= times.dawn.getTime();
  const eveningBlue = times.dusk.getTime() <= now && now <= times.nauticalDusk.getTime();

  return morningBlue || eveningBlue;
}

/**
 * Calculate time until next golden hour
 * @param latitude - Latitude in degrees
 * @param longitude - Longitude in degrees
 * @param date - Current date (defaults to now)
 * @returns Milliseconds until next golden hour, or null if currently in golden hour
 */
export function getTimeUntilGoldenHour(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): number | null {
  if (isGoldenHour(latitude, longitude, date)) {
    return null;
  }

  const times = SunCalc.getTimes(date, latitude, longitude);
  const now = date.getTime();

  // If before sunrise golden hour
  if (now < times.sunrise.getTime()) {
    return times.sunrise.getTime() - now;
  }

  // If after morning golden hour but before evening
  if (now < times.goldenHour.getTime()) {
    return times.goldenHour.getTime() - now;
  }

  // After evening golden hour, get tomorrow's sunrise
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = SunCalc.getTimes(tomorrow, latitude, longitude);
  return tomorrowTimes.sunrise.getTime() - now;
}
