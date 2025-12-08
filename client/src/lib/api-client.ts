import type {
  Session,
  Reading,
  WeatherData,
  WeatherRequest,
} from '@shared/schema';

/**
 * API Client for LightLog
 *
 * IMPLEMENTATION NOTES FOR AI ARCHITECT:
 * - All functions are async and return Promises
 * - Base URL is configured for both dev and production
 * - Error handling with descriptive messages
 * - Type-safe with shared schemas
 * - Works with TanStack Query for caching
 */

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: response.statusText,
      }));
      throw new Error(error.error || `API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error');
  }
}

// ============================================================================
// WEATHER API
// ============================================================================

export async function fetchWeather(request: WeatherRequest) {
  return apiFetch<{
    temperature: number;
    humidity: number;
    cloudCover: number;
    visibility: number;
    windSpeed?: number;
    windDirection?: number;
    description?: string;
    icon?: string;
  }>('/weather', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// ============================================================================
// SESSION API
// ============================================================================

export async function createSession(
  data: Omit<Session, 'id' | 'createdAt'>
): Promise<Session> {
  return apiFetch<Session>('/sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAllSessions(): Promise<Session[]> {
  return apiFetch<Session[]>('/sessions');
}

export async function getSession(id: number): Promise<Session> {
  return apiFetch<Session>(`/sessions/${id}`);
}

export async function updateSession(
  id: number,
  data: Partial<Session>
): Promise<Session> {
  return apiFetch<Session>(`/sessions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteSession(id: number): Promise<void> {
  await apiFetch<{ success: boolean }>(`/sessions/${id}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// READING API
// ============================================================================

export async function createReading(
  data: Omit<Reading, 'id'>
): Promise<Reading> {
  return apiFetch<Reading>('/readings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getSessionReadings(sessionId: number): Promise<Reading[]> {
  return apiFetch<Reading[]>(`/sessions/${sessionId}/readings`);
}

// ============================================================================
// WEATHER DATA API
// ============================================================================

export async function saveWeatherData(
  data: Omit<WeatherData, 'id'>
): Promise<WeatherData> {
  return apiFetch<WeatherData>('/weather-data', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getSessionWeather(
  sessionId: number
): Promise<WeatherData[]> {
  return apiFetch<WeatherData[]>(`/sessions/${sessionId}/weather`);
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

export async function getHealthStatus() {
  return apiFetch<{
    status: string;
    timestamp: string;
    storage: {
      sessions: number;
      readings: number;
      weather: number;
    };
  }>('/health');
}
