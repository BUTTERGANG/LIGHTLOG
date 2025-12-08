import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSunPosition, getMoonData, getLightingType } from '@/lib/sun-calc';
import { fetchWeather } from '@/lib/api-client';
import { formatDegrees, formatTemperature, formatPercentage } from '@/lib/utils';

/**
 * Camera Wizard Page - Enhanced with Dramatic Visual Design
 *
 * Features:
 * - AI-powered camera settings recommendations
 * - Beautiful gradient cards for settings
 * - Responsive layout
 * - Contextual photography tips
 */

interface CameraRecommendation {
  iso: string;
  aperture: string;
  shutterSpeed: string;
  mode: string;
  focus: string;
  meteringMode: string;
  tips: string[];
  lightingType: string;
}

function generateRecommendations(
  sunElevation: number,
  weather?: {
    cloudCover: number;
    temperature: number;
    visibility: number;
  },
  moonIllumination?: number
): CameraRecommendation {
  const lightingType = getLightingType(sunElevation);
  let iso = '100-200';
  let aperture = 'f/8-f/11';
  let shutterSpeed = '1/125';
  let mode = 'Aperture Priority';
  let focus = 'Single AF';
  let meteringMode = 'Evaluative';
  const tips: string[] = [];

  if (lightingType === 'Golden Hour') {
    iso = '100-400';
    aperture = 'f/5.6-f/8';
    shutterSpeed = '1/250';
    tips.push('Perfect time for warm, golden tones');
    tips.push('Shoot with sun low on horizon for dramatic side lighting');
    tips.push('Use graduated ND filter for balanced exposure');
  } else if (lightingType === 'Blue Hour') {
    iso = '400-1600';
    aperture = 'f/8-f/11';
    shutterSpeed = '1/30-1s (use tripod)';
    mode = 'Manual';
    tips.push('Tripod essential for longer exposures');
    tips.push('Great for cityscapes with artificial lights');
    tips.push('Bracket exposures for HDR');
  } else if (lightingType === 'Midday') {
    iso = '100-200';
    aperture = 'f/11-f/16';
    shutterSpeed = '1/250';
    tips.push('Harsh light - consider shooting in shade');
    tips.push('Use polarizing filter to reduce glare');
    tips.push('Look for strong shadows and contrast');
  } else if (lightingType === 'Night') {
    iso = '1600-6400';
    aperture = 'f/1.4-f/2.8';
    shutterSpeed = '15s-30s (use tripod)';
    mode = 'Manual';
    focus = 'Manual Focus';
    meteringMode = 'Spot';
    tips.push('Tripod and remote shutter essential');
    tips.push('Use manual focus on bright stars or distant lights');

    if (moonIllumination && moonIllumination > 0.7) {
      tips.push('Bright moon - reduce ISO to 400-800');
      iso = '400-800';
      shutterSpeed = '1s-5s';
    } else {
      tips.push('New moon - perfect for Milky Way photography');
    }
  }

  if (weather) {
    if (weather.cloudCover > 70) {
      tips.push('Overcast conditions - diffused light, great for portraits');
      tips.push('Colors may appear muted - boost saturation in post');
    } else if (weather.cloudCover > 30) {
      tips.push('Partly cloudy - watch for dynamic cloud formations');
    }

    if (weather.visibility < 5000) {
      tips.push('Low visibility - consider misty/foggy atmosphere shots');
    }
  }

  return {
    iso,
    aperture,
    shutterSpeed,
    mode,
    focus,
    meteringMode,
    tips,
    lightingType,
  };
}

export default function CameraWizardPage() {
  const [location, setLocation] = useState({
    name: 'San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194,
  });

  const sunPosition = getSunPosition(location.latitude, location.longitude);
  const moonData = getMoonData();

  const { data: weather } = useQuery({
    queryKey: ['weather', location.latitude, location.longitude],
    queryFn: () => fetchWeather({
      latitude: location.latitude,
      longitude: location.longitude,
    }),
  });

  const recommendations = generateRecommendations(
    sunPosition.elevation,
    weather,
    moonData.illumination
  );

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <header className="text-center space-y-3 py-6 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-gradient">
            📸 Camera Settings Wizard
          </h1>
          <p className="text-lg text-muted-foreground">
            AI-powered recommendations for {recommendations.lightingType.toLowerCase()}
          </p>
        </header>

        {/* Current Conditions Card */}
        <div className="glass-card">
          <h2 className="text-xl font-bold mb-4">Current Conditions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <ConditionStat label="Location" value={location.name} icon="📍" />
            <ConditionStat label="Lighting" value={recommendations.lightingType} icon="💡" />
            <ConditionStat label="Sun Elevation" value={formatDegrees(sunPosition.elevation)} icon="🌞" />
            <ConditionStat
              label="Conditions"
              value={weather?.description || 'Clear'}
              icon="🌤️"
            />
          </div>
        </div>

        {/* Hero Recommendations Card */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-primary glow animate-slide-up">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Recommended Settings
            </h2>

            {/* Main Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <SettingCard
                label="ISO"
                value={recommendations.iso}
                icon="📊"
              />
              <SettingCard
                label="Aperture"
                value={recommendations.aperture}
                icon="⚪"
              />
              <SettingCard
                label="Shutter Speed"
                value={recommendations.shutterSpeed}
                icon="⚡"
              />
            </div>

            {/* Secondary Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SecondaryCard label="Mode" value={recommendations.mode} />
              <SecondaryCard label="Focus" value={recommendations.focus} />
              <SecondaryCard label="Metering" value={recommendations.meteringMode} />
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Pro Tips */}
        <div className="glass-card hover-lift animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">💡</span>
            <h2 className="text-2xl font-bold">Pro Tips</h2>
          </div>
          <div className="space-y-3">
            {recommendations.tips.map((tip, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                  {index + 1}
                </span>
                <span className="flex-1 text-sm leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weather & Environment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weather */}
          {weather && (
            <div className="glass-card hover-lift">
              <h2 className="text-xl font-bold mb-6">🌤️ Weather Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <WeatherDetail label="Temperature" value={formatTemperature(weather.temperature)} />
                <WeatherDetail label="Humidity" value={formatPercentage(weather.humidity)} />
                <WeatherDetail label="Cloud Cover" value={formatPercentage(weather.cloudCover)} />
                <WeatherDetail label="Visibility" value={`${(weather.visibility / 1000).toFixed(1)} km`} />
              </div>
            </div>
          )}

          {/* Moon Phase */}
          <div className="glass-card hover-lift">
            <h2 className="text-xl font-bold mb-6">🌙 Moon Phase</h2>
            <div className="text-center py-4">
              <p className="text-2xl font-bold mb-2">{moonData.phaseName}</p>
              <p className="text-muted-foreground">
                {formatPercentage(moonData.illumination * 100)} illuminated
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pb-6">
          <button className="px-8 py-4 rounded-xl bg-gradient-secondary text-white font-semibold hover-lift transition-all">
            💾 Save Settings (TO IMPLEMENT)
          </button>
          <a
            href="/"
            className="px-8 py-4 rounded-xl glass text-center font-semibold hover-lift transition-all"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function ConditionStat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="text-center p-3 rounded-lg bg-background/20">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-bold truncate">{value}</p>
    </div>
  );
}

function SettingCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-colors">
      <div className="text-3xl mb-3">{icon}</div>
      <p className="text-white/70 text-sm mb-2 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function SecondaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
      <p className="text-white/60 text-xs mb-1 uppercase">{label}</p>
      <p className="text-white font-semibold text-sm">{value}</p>
    </div>
  );
}

function WeatherDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-lg bg-background/20">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
