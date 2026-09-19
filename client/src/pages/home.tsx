import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { getSunPosition, getSunTimes, getMoonData, getLightingType } from '@/lib/sun-calc';
import { fetchWeather } from '@/lib/api-client';
import SunPathChart from '@/components/sun-position-chart';
import {
  formatTemperature,
  formatPercentage,
  formatDegrees,
  formatTime,
  degreesToCardinal,
} from '@/lib/utils';

/**
 * Home Page Component - Enhanced with Dramatic Visual Design
 *
 * Features:
 * - Animated glass-morphism cards
 * - Gradient text effects
 * - Responsive grid layouts
 * - Floating animations
 * - Time-of-day aware styling
 */

export default function HomePage() {
  // Default location: San Francisco
  const [location, setLocation] = useState({
    name: 'San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194,
  });

  // Get current sun position and times
  const sunPosition = getSunPosition(location.latitude, location.longitude);
  const sunTimes = getSunTimes(location.latitude, location.longitude);
  const moonData = getMoonData();
  const lightingType = getLightingType(sunPosition.elevation);

  // Fetch weather data
  const { data: weather, isLoading: isWeatherLoading, isError: isWeatherError } = useQuery({
    queryKey: ['weather', location.latitude, location.longitude],
    queryFn: () => fetchWeather({
      latitude: location.latitude,
      longitude: location.longitude,
    }),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  // Get lighting emoji based on type
  const getLightingEmoji = () => {
    switch (lightingType) {
      case 'Golden Hour': return '🌅';
      case 'Blue Hour': return '🌆';
      case 'Midday': return '☀️';
      case 'Night': return '🌙';
      default: return '🌄';
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Animated Header */}
        <header className="text-center space-y-3 py-8 animate-slide-up">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gradient animate-glow">
            LightLog
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Photography Lighting Tracker
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
            <span className="text-2xl animate-float">{getLightingEmoji()}</span>
            <span className="font-semibold">{lightingType}</span>
          </div>
        </header>

        {/* Location Card - Glass Morphism */}
        <div className="glass-card hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm text-muted-foreground mb-1">Current Location</h2>
              <p className="text-2xl font-bold">{location.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
              </p>
            </div>
          </div>
        </div>

        {/* Hero Sun Position Card */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-primary glow">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Current Sun Position
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
                  Elevation
                </p>
                <p className="text-5xl sm:text-6xl font-black text-white">
                  {formatDegrees(sunPosition.elevation)}
                </p>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: `${((sunPosition.elevation + 90) / 180) * 100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
                  Azimuth
                </p>
                <p className="text-5xl sm:text-6xl font-black text-white">
                  {formatDegrees(sunPosition.azimuth)}
                </p>
                <p className="text-2xl font-bold text-white/90">
                  {degreesToCardinal(sunPosition.azimuth)}
                </p>
              </div>
            </div>
          </div>
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Sun Elevation Arc Chart */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Sun Elevation Arc</h2>
            <span className="text-xs text-muted-foreground">Today · San Francisco, CA</span>
          </div>
          <SunPathChart latitude={location.latitude} longitude={location.longitude} />
        </div>

        {/* Sun Events Timeline - Responsive Grid */}
        <div className="glass-card">
          <h2 className="text-2xl font-bold mb-6">Today's Light Schedule</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <TimeCard label="Sunrise" time={sunTimes.sunrise} icon="🌄" />
            <TimeCard label="Golden Hour End" time={sunTimes.goldenHourEnd} icon="🌅" />
            <TimeCard label="Golden Hour" time={sunTimes.goldenHour} icon="🌇" />
            <TimeCard label="Sunset" time={sunTimes.sunset} icon="🌆" />
          </div>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <TimeCard label="Dawn" time={sunTimes.dawn} icon="🌄" variant="secondary" />
            <TimeCard label="Dusk" time={sunTimes.dusk} icon="🌃" variant="secondary" />
            <TimeCard label="Nautical Dawn" time={sunTimes.nauticalDawn} icon="🌌" variant="secondary" />
            <TimeCard label="Nautical Dusk" time={sunTimes.nauticalDusk} icon="🌠" variant="secondary" />
          </div>
        </div>

        {/* Weather & Moon - Side by Side on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weather Card */}
          {isWeatherLoading ? (
            <div className="glass-card hover-lift">
              <h2 className="text-2xl font-bold mb-6">Weather</h2>
              <div className="animate-pulse text-center py-6">
                <div className="text-4xl mb-3">⏳</div>
                <p className="text-muted-foreground">Loading weather...</p>
              </div>
            </div>
          ) : isWeatherError ? (
            <div className="glass-card hover-lift">
              <h2 className="text-2xl font-bold mb-6">Weather</h2>
              <div className="text-center py-6">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-muted-foreground">Weather data is unavailable right now.</p>
              </div>
            </div>
          ) : weather ? (
            <div className="glass-card hover-lift">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Weather</h2>
                <span className="text-4xl">{getWeatherEmoji(weather.description || '')}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <WeatherStat
                  label="Temperature"
                  value={formatTemperature(weather.temperature)}
                  icon="🌡️"
                />
                <WeatherStat
                  label="Humidity"
                  value={formatPercentage(weather.humidity)}
                  icon="💧"
                />
                <WeatherStat
                  label="Cloud Cover"
                  value={formatPercentage(weather.cloudCover)}
                  icon="☁️"
                />
                <WeatherStat
                  label="Visibility"
                  value={`${(weather.visibility / 1000).toFixed(1)} km`}
                  icon="👁️"
                />
              </div>
              {weather.description && (
                <p className="text-center text-sm text-muted-foreground capitalize py-3 px-4 bg-background/30 rounded-lg">
                  {weather.description}
                </p>
              )}
            </div>
          ) : null}

          {/* Moon Card */}
          <div className="glass-card hover-lift">
            <h2 className="text-2xl font-bold mb-6">Moon Phase</h2>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-8xl mb-4 animate-float">
                {getMoonEmoji(moonData.phase)}
              </div>
              <p className="text-2xl font-bold mb-2">{moonData.phaseName}</p>
              <p className="text-muted-foreground mb-4">
                {formatPercentage(moonData.illumination * 100)} illuminated
              </p>
              <div className="w-full max-w-xs">
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-secondary rounded-full transition-all duration-1000"
                    style={{ width: `${moonData.illumination * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Animated Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <Link
            href="/camera-wizard"
            className="relative overflow-hidden group rounded-2xl p-8 bg-gradient-primary hover-lift transition-all duration-300"
          >
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">📸</span>
              <span className="text-2xl font-bold text-white">Camera Wizard</span>
              <span className="text-white/80 mt-2">Get optimal settings</span>
            </div>
            <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>

          <Link
            href="/sessions"
            className="relative overflow-hidden group rounded-2xl p-8 bg-gradient-secondary hover-lift transition-all duration-300"
          >
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">📊</span>
              <span className="text-2xl font-bold text-white">Sessions</span>
              <span className="text-white/80 mt-2">View your history</span>
            </div>
            <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function TimeCard({ label, time, icon, variant = 'primary' }: {
  label: string;
  time: string;
  icon: string;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <div className={`p-4 rounded-xl ${variant === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'} hover:scale-105 transition-transform`}>
      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
        <span>{icon}</span>
        <span>{label}</span>
      </p>
      <p className="text-xl font-bold">{formatTime(time)}</p>
    </div>
  );
}

function WeatherStat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="text-center p-3 rounded-lg bg-background/20">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function getMoonEmoji(phase: number): string {
  if (phase < 0.03 || phase > 0.97) return '🌑';
  if (phase < 0.22) return '🌒';
  if (phase < 0.28) return '🌓';
  if (phase < 0.47) return '🌔';
  if (phase < 0.53) return '🌕';
  if (phase < 0.72) return '🌖';
  if (phase < 0.78) return '🌗';
  return '🌘';
}

function getWeatherEmoji(description: string): string {
  const desc = description.toLowerCase();
  if (desc.includes('clear')) return '☀️';
  if (desc.includes('cloud')) return '☁️';
  if (desc.includes('rain')) return '🌧️';
  if (desc.includes('storm') || desc.includes('thunder')) return '⛈️';
  if (desc.includes('snow')) return '❄️';
  if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
  return '🌤️';
}
