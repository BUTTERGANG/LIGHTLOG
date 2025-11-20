import express, { type Request, type Response } from 'express';
import { z } from 'zod';
import { storage } from './storage.js';
import {
  sessionSchema,
  readingSchema,
  weatherDataSchema,
  weatherRequestSchema,
} from '../shared/schema.js';

/**
 * API Routes for LightLog
 *
 * IMPLEMENTATION NOTES FOR AI ARCHITECT:
 * - All routes validate input with Zod schemas
 * - Errors are handled consistently with try/catch
 * - Weather API integration is optional (falls back to simulated data)
 * - CORS is handled by Express middleware in index.ts
 */

export const router = express.Router();

// ============================================================================
// WEATHER ROUTES
// ============================================================================

/**
 * POST /api/weather
 * Fetch weather data for given coordinates
 *
 * IMPLEMENTATION NOTE:
 * - Requires OPENWEATHER_API_KEY environment variable (optional)
 * - Falls back to simulated data if API key missing
 * - OpenWeather API endpoint: https://api.openweathermap.org/data/2.5/weather
 */
router.post('/weather', async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = weatherRequestSchema.parse(req.body);

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      // Fallback to simulated weather data
      const simulatedWeather = {
        temperature: 20 + Math.random() * 10,
        humidity: 50 + Math.random() * 30,
        cloudCover: Math.random() * 100,
        visibility: 8000 + Math.random() * 2000,
        windSpeed: Math.random() * 10,
        windDirection: Math.random() * 360,
        description: 'Clear sky',
        icon: '01d',
      };
      return res.json(simulatedWeather);
    }

    // Fetch real weather data from OpenWeather API
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    const weatherData = {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      cloudCover: data.clouds.all,
      visibility: data.visibility,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      description: data.weather[0]?.description || 'Unknown',
      icon: data.weather[0]?.icon || '01d',
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Weather fetch error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  }
});

// ============================================================================
// SESSION ROUTES
// ============================================================================

/**
 * POST /api/sessions
 * Create a new lighting session
 */
router.post('/sessions', async (req: Request, res: Response) => {
  try {
    const sessionData = sessionSchema.omit({ id: true, createdAt: true }).parse(req.body);
    const session = await storage.createSession(sessionData);
    res.status(201).json(session);
  } catch (error) {
    console.error('Create session error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid session data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create session' });
    }
  }
});

/**
 * GET /api/sessions
 * Get all sessions
 */
router.get('/sessions', async (_req: Request, res: Response) => {
  try {
    const sessions = await storage.getAllSessions();
    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

/**
 * GET /api/sessions/:id
 * Get a specific session by ID
 */
router.get('/sessions/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const session = await storage.getSession(id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

/**
 * PATCH /api/sessions/:id
 * Update a session
 */
router.patch('/sessions/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const updates = sessionSchema.partial().parse(req.body);
    const session = await storage.updateSession(id, updates);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Update session error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid update data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update session' });
    }
  }
});

/**
 * DELETE /api/sessions/:id
 * Delete a session and all related data
 */
router.delete('/sessions/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const deleted = await storage.deleteSession(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ success: true, message: 'Session deleted' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// ============================================================================
// READING ROUTES
// ============================================================================

/**
 * POST /api/readings
 * Create a new lighting reading
 */
router.post('/readings', async (req: Request, res: Response) => {
  try {
    const readingData = readingSchema.omit({ id: true }).parse(req.body);
    const reading = await storage.createReading(readingData);
    res.status(201).json(reading);
  } catch (error) {
    console.error('Create reading error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid reading data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create reading' });
    }
  }
});

/**
 * GET /api/sessions/:sessionId/readings
 * Get all readings for a session
 */
router.get('/sessions/:sessionId/readings', async (req: Request, res: Response) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    if (isNaN(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const readings = await storage.getSessionReadings(sessionId);
    res.json(readings);
  } catch (error) {
    console.error('Get readings error:', error);
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
});

// ============================================================================
// WEATHER DATA ROUTES
// ============================================================================

/**
 * POST /api/weather-data
 * Store weather data for a session
 */
router.post('/weather-data', async (req: Request, res: Response) => {
  try {
    const weatherData = weatherDataSchema.omit({ id: true }).parse(req.body);
    const saved = await storage.createWeatherData(weatherData);
    res.status(201).json(saved);
  } catch (error) {
    console.error('Create weather data error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid weather data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to save weather data' });
    }
  }
});

/**
 * GET /api/sessions/:sessionId/weather
 * Get weather data for a session
 */
router.get('/sessions/:sessionId/weather', async (req: Request, res: Response) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    if (isNaN(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const weather = await storage.getSessionWeather(sessionId);
    res.json(weather);
  } catch (error) {
    console.error('Get weather data error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', async (_req: Request, res: Response) => {
  try {
    const stats = await storage.getStats();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      storage: stats,
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: 'Storage unavailable' });
  }
});
