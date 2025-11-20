import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSunPosition, getSunTimes, getMoonData } from '@/lib/sun-calc';
import { fetchWeather } from '@/lib/api-client';
import {
  formatTemperature,
  formatPercentage,
  formatDegrees,
  formatTime,
  degreesToCardinal,
} from '@/lib/utils';

/**
 * Home Page Component
 *
 * IMPLEMENTATION NOTES FOR AI ARCHITECT:
 * - Main dashboard showing current sun/moon position and weather
 * - Real-time updates of sun position
 * - Location search functionality to be implemented
 * - Displays golden hour, blue hour timing
 * - Shows current weather conditions
 *
 * TODO FOR IMPLEMENTATION:
 * 1. Add location search with geocoding API
 * 2. Add location persistence (localStorage or user preferences)
 * 3. Implement sun position visualization (e.g., arc diagram)
 * 4. Add notifications for upcoming golden hour
 * 5. Create reusable Card components in components/ui/
 */

export default function HomePage() {
  // Default location: San Francisco
  const [location, setLocation] = useState({
    name: 'San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194,
  });

  // Get current sun position
  const sunPosition = getSunPosition(location.latitude, location.longitude);
  const sunTimes = getSunTimes(location.latitude, location.longitude);
  const moonData = getMoonData();

  // Fetch weather data
  const { data: weather } = useQuery({
    queryKey: ['weather', location.latitude, location.longitude],
    queryFn: () => fetchWeather({
      latitude: location.latitude,
      longitude: location.longitude,
    }),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            LightLog
          </h1>
          <p className="text-muted-foreground">Photography Lighting Tracker</p>
        </header>

        {/* Location */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <h2 className="text-lg font-semibold mb-2">Location</h2>
          <p className="text-xl">{location.name}</p>
          <button className="mt-2 text-sm text-primary hover:underline">
            Change Location (TO IMPLEMENT)
          </button>
        </div>

        {/* Sun Position */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">Current Sun Position</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Elevation</p>
              <p className="text-3xl font-bold text-primary">
                {formatDegrees(sunPosition.elevation)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Azimuth</p>
              <p className="text-3xl font-bold text-secondary">
                {formatDegrees(sunPosition.azimuth)} {degreesToCardinal(sunPosition.azimuth)}
              </p>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {sunPosition.elevation > 6 && '☀️ Daytime'}
            {sunPosition.elevation <= 6 && sunPosition.elevation > -0.833 && '🌅 Golden Hour'}
            {sunPosition.elevation <= -0.833 && sunPosition.elevation > -6 && '🌆 Blue Hour'}
            {sunPosition.elevation <= -6 && '🌙 Night'}
          </div>
        </div>

        {/* Sun Times */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">Today's Sun Events</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Sunrise</p>
              <p className="text-lg font-semibold">{formatTime(sunTimes.sunrise)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Golden Hour End</p>
              <p className="text-lg font-semibold">{formatTime(sunTimes.goldenHourEnd)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Golden Hour Start</p>
              <p className="text-lg font-semibold">{formatTime(sunTimes.goldenHour)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sunset</p>
              <p className="text-lg font-semibold">{formatTime(sunTimes.sunset)}</p>
            </div>
          </div>
        </div>

        {/* Weather */}
        {weather && (
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">Current Weather</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-lg font-semibold">
                  {formatTemperature(weather.temperature)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-lg font-semibold">
                  {formatPercentage(weather.humidity)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cloud Cover</p>
                <p className="text-lg font-semibold">
                  {formatPercentage(weather.cloudCover)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Visibility</p>
                <p className="text-lg font-semibold">
                  {(weather.visibility / 1000).toFixed(1)} km
                </p>
              </div>
            </div>
            {weather.description && (
              <p className="mt-4 text-muted-foreground capitalize">
                {weather.description}
              </p>
            )}
          </div>
        )}

        {/* Moon */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">Moon Phase</h2>
          <div className="flex items-center gap-6">
            <div className="text-6xl">🌙</div>
            <div>
              <p className="text-xl font-semibold">{moonData.phaseName}</p>
              <p className="text-muted-foreground">
                {formatPercentage(moonData.illumination * 100)} illuminated
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/camera-wizard"
            className="bg-primary text-primary-foreground p-6 rounded-lg text-center font-semibold hover:bg-primary/90 transition-colors"
          >
            📸 Camera Settings Wizard
          </a>
          <a
            href="/sessions"
            className="bg-secondary text-secondary-foreground p-6 rounded-lg text-center font-semibold hover:bg-secondary/90 transition-colors"
          >
            📊 View Sessions
          </a>
        </div>
      </div>
    </div>
  );
}
