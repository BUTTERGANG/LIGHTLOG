import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSunPosition, getMoonData, getLightingType } from '@/lib/sun-calc';
import { fetchWeather } from '@/lib/api-client';
import { formatDegrees, formatTemperature, formatPercentage } from '@/lib/utils';

/**
 * Camera Wizard Page Component
 *
 * IMPLEMENTATION NOTES FOR AI ARCHITECT:
 * - AI-powered camera settings recommendations
 * - Based on sun position, weather, and time of day
 * - Provides ISO, aperture, shutter speed suggestions
 * - Includes photography tips for current conditions
 *
 * ALGORITHM FOR RECOMMENDATIONS:
 * 1. Determine lighting type from sun elevation
 * 2. Factor in weather conditions (clouds, visibility)
 * 3. Consider moon phase for night photography
 * 4. Apply photography best practices for each scenario
 *
 * TODO FOR IMPLEMENTATION:
 * 1. Implement smart recommendation algorithm
 * 2. Add manual override options
 * 3. Add camera preset selection (portrait, landscape, etc.)
 * 4. Add export/save settings feature
 * 5. Add comparison with previous successful shots
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

  // Adjust based on lighting conditions
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

  // Adjust for weather
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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">📸 Camera Settings Wizard</h1>
          <p className="text-muted-foreground">
            AI-powered recommendations for optimal camera settings
          </p>
        </div>

        {/* Current Conditions */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-bold mb-4">Current Conditions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-semibold">{location.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Lighting</p>
              <p className="font-semibold">{recommendations.lightingType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Sun Elevation</p>
              <p className="font-semibold">{formatDegrees(sunPosition.elevation)}</p>
            </div>
            {weather && (
              <div>
                <p className="text-muted-foreground">Conditions</p>
                <p className="font-semibold">{weather.description || 'Clear'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Recommended Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-background/50 backdrop-blur rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">ISO</p>
              <p className="text-2xl font-bold text-primary">{recommendations.iso}</p>
            </div>
            <div className="bg-background/50 backdrop-blur rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Aperture</p>
              <p className="text-2xl font-bold text-secondary">{recommendations.aperture}</p>
            </div>
            <div className="bg-background/50 backdrop-blur rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Shutter Speed</p>
              <p className="text-2xl font-bold text-accent">{recommendations.shutterSpeed}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background/30 backdrop-blur rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Mode</p>
              <p className="font-semibold">{recommendations.mode}</p>
            </div>
            <div className="bg-background/30 backdrop-blur rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Focus</p>
              <p className="font-semibold">{recommendations.focus}</p>
            </div>
            <div className="bg-background/30 backdrop-blur rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Metering</p>
              <p className="font-semibold">{recommendations.meteringMode}</p>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-bold mb-4">💡 Pro Tips</h2>
          <ul className="space-y-2">
            {recommendations.tips.map((tip, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-primary">•</span>
                <span className="flex-1">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weather Details */}
        {weather && (
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-bold mb-4">🌤️ Weather Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Temperature</p>
                <p className="text-lg font-semibold">
                  {formatTemperature(weather.temperature)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Cloud Cover</p>
                <p className="text-lg font-semibold">
                  {formatPercentage(weather.cloudCover)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Visibility</p>
                <p className="text-lg font-semibold">
                  {(weather.visibility / 1000).toFixed(1)} km
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Humidity</p>
                <p className="text-lg font-semibold">
                  {formatPercentage(weather.humidity)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Save Settings (TO IMPLEMENT)
          </button>
          <a
            href="/"
            className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
