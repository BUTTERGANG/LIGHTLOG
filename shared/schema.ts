import { z } from 'zod';

// ============================================================================
// LOCATION SCHEMAS
// ============================================================================

export const locationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Location name is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().optional(),
});

export type Location = z.infer<typeof locationSchema>;

// ============================================================================
// WEATHER SCHEMAS
// ============================================================================

export const weatherDataSchema = z.object({
  id: z.number().optional(),
  sessionId: z.number(),
  temperature: z.number(),
  humidity: z.number(),
  cloudCover: z.number().min(0).max(100),
  visibility: z.number(),
  windSpeed: z.number().optional(),
  windDirection: z.number().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  timestamp: z.string().datetime().or(z.date()),
});

export type WeatherData = z.infer<typeof weatherDataSchema>;

// Request schema for fetching weather
export const weatherRequestSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type WeatherRequest = z.infer<typeof weatherRequestSchema>;

// ============================================================================
// SESSION SCHEMAS
// ============================================================================

export const sessionSchema = z.object({
  id: z.number().optional(),
  locationName: z.string().min(1, 'Location name is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  startTime: z.string().datetime().or(z.date()),
  endTime: z.string().datetime().or(z.date()).optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.string().datetime().or(z.date()).optional(),
});

export type Session = z.infer<typeof sessionSchema>;

// ============================================================================
// READING SCHEMAS
// ============================================================================

export const readingSchema = z.object({
  id: z.number().optional(),
  sessionId: z.number(),
  timestamp: z.string().datetime().or(z.date()),
  lightLevel: z.number().min(0),
  colorTemperature: z.number().min(0).optional().nullable(),
  notes: z.string().optional().nullable(),
  // Camera settings
  iso: z.number().optional().nullable(),
  aperture: z.string().optional().nullable(),
  shutterSpeed: z.string().optional().nullable(),
  // Sun position data
  sunElevation: z.number().optional().nullable(),
  sunAzimuth: z.number().optional().nullable(),
});

export type Reading = z.infer<typeof readingSchema>;

// ============================================================================
// SUN POSITION SCHEMAS
// ============================================================================

export const sunPositionSchema = z.object({
  elevation: z.number(), // degrees above horizon (-90 to 90)
  azimuth: z.number(),   // degrees from north (0 to 360)
  altitude: z.number(),  // alias for elevation (SunCalc compatibility)
});

export type SunPosition = z.infer<typeof sunPositionSchema>;

export const sunTimesSchema = z.object({
  sunrise: z.string().datetime().or(z.date()),
  sunset: z.string().datetime().or(z.date()),
  sunriseEnd: z.string().datetime().or(z.date()),
  sunsetStart: z.string().datetime().or(z.date()),
  dawn: z.string().datetime().or(z.date()),
  dusk: z.string().datetime().or(z.date()),
  nauticalDawn: z.string().datetime().or(z.date()),
  nauticalDusk: z.string().datetime().or(z.date()),
  goldenHourEnd: z.string().datetime().or(z.date()),
  goldenHour: z.string().datetime().or(z.date()),
});

export type SunTimes = z.infer<typeof sunTimesSchema>;

// ============================================================================
// MOON SCHEMAS
// ============================================================================

export const moonDataSchema = z.object({
  phase: z.number().min(0).max(1), // 0 = new moon, 0.5 = full moon, 1 = new moon
  illumination: z.number().min(0).max(1), // fraction illuminated
  angle: z.number(), // moon rotation angle
  phaseName: z.enum([
    'New Moon',
    'Waxing Crescent',
    'First Quarter',
    'Waxing Gibbous',
    'Full Moon',
    'Waning Gibbous',
    'Last Quarter',
    'Waning Crescent',
  ]),
});

export type MoonData = z.infer<typeof moonDataSchema>;

// ============================================================================
// CAMERA WIZARD SCHEMAS
// ============================================================================

export const cameraSettingsSchema = z.object({
  iso: z.string(),
  aperture: z.string(),
  shutterSpeed: z.string(),
  mode: z.string(),
  focus: z.string(),
  meteringMode: z.string(),
  tips: z.array(z.string()),
  lightingType: z.enum([
    'Golden Hour',
    'Blue Hour',
    'Midday',
    'Night',
    'Sunrise',
    'Sunset',
    'Twilight',
  ]),
});

export type CameraSettings = z.infer<typeof cameraSettingsSchema>;

export const cameraWizardRequestSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timestamp: z.string().datetime().or(z.date()).optional(),
  weather: weatherDataSchema.optional(),
});

export type CameraWizardRequest = z.infer<typeof cameraWizardRequestSchema>;

// ============================================================================
// API RESPONSE SCHEMAS
// ============================================================================

export const apiErrorSchema = z.object({
  error: z.string(),
  details: z.unknown().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export const apiSuccessSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.unknown().optional(),
});

export type ApiSuccess = z.infer<typeof apiSuccessSchema>;

// ============================================================================
// THEME SCHEMAS
// ============================================================================

export const themeTypeSchema = z.enum(['day', 'golden', 'blue', 'night']);
export type ThemeType = z.infer<typeof themeTypeSchema>;

export const themeColorsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  card: z.string(),
  text: z.string(),
});

export type ThemeColors = z.infer<typeof themeColorsSchema>;
