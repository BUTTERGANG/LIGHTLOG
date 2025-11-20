import type { Session, Reading, WeatherData } from '../shared/schema.js';

/**
 * Storage Interface for LightLog
 *
 * This interface defines the contract for data storage operations.
 * Current implementation uses in-memory storage for simplicity.
 * Future implementations can use PostgreSQL with Drizzle ORM.
 *
 * IMPLEMENTATION NOTE FOR AI ARCHITECT:
 * - All methods are async to support future database migration
 * - IDs are auto-incremented numbers
 * - Timestamps should be ISO 8601 strings
 * - All operations should handle errors gracefully
 */

// ============================================================================
// IN-MEMORY STORAGE IMPLEMENTATION
// ============================================================================

class InMemoryStorage {
  private sessions: Map<number, Session> = new Map();
  private readings: Map<number, Reading> = new Map();
  private weatherData: Map<number, WeatherData> = new Map();

  private sessionIdCounter = 1;
  private readingIdCounter = 1;
  private weatherIdCounter = 1;

  // --------------------------------------------------------------------------
  // SESSION OPERATIONS
  // --------------------------------------------------------------------------

  async createSession(data: Omit<Session, 'id' | 'createdAt'>): Promise<Session> {
    const session: Session = {
      ...data,
      id: this.sessionIdCounter++,
      createdAt: new Date().toISOString(),
    };
    this.sessions.set(session.id!, session);
    return session;
  }

  async getSession(id: number): Promise<Session | null> {
    return this.sessions.get(id) || null;
  }

  async getAllSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values()).sort((a, b) => {
      const dateA = new Date(a.createdAt!).getTime();
      const dateB = new Date(b.createdAt!).getTime();
      return dateB - dateA; // Most recent first
    });
  }

  async updateSession(id: number, data: Partial<Session>): Promise<Session | null> {
    const session = this.sessions.get(id);
    if (!session) return null;

    const updated = { ...session, ...data, id };
    this.sessions.set(id, updated);
    return updated;
  }

  async deleteSession(id: number): Promise<boolean> {
    // Also delete related readings and weather data
    const readingsToDelete = Array.from(this.readings.values())
      .filter(r => r.sessionId === id);
    readingsToDelete.forEach(r => this.readings.delete(r.id!));

    const weatherToDelete = Array.from(this.weatherData.values())
      .filter(w => w.sessionId === id);
    weatherToDelete.forEach(w => this.weatherData.delete(w.id!));

    return this.sessions.delete(id);
  }

  // --------------------------------------------------------------------------
  // READING OPERATIONS
  // --------------------------------------------------------------------------

  async createReading(data: Omit<Reading, 'id'>): Promise<Reading> {
    const reading: Reading = {
      ...data,
      id: this.readingIdCounter++,
    };
    this.readings.set(reading.id!, reading);
    return reading;
  }

  async getReading(id: number): Promise<Reading | null> {
    return this.readings.get(id) || null;
  }

  async getSessionReadings(sessionId: number): Promise<Reading[]> {
    return Array.from(this.readings.values())
      .filter(r => r.sessionId === sessionId)
      .sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateA - dateB; // Chronological order
      });
  }

  async updateReading(id: number, data: Partial<Reading>): Promise<Reading | null> {
    const reading = this.readings.get(id);
    if (!reading) return null;

    const updated = { ...reading, ...data, id };
    this.readings.set(id, updated);
    return updated;
  }

  async deleteReading(id: number): Promise<boolean> {
    return this.readings.delete(id);
  }

  // --------------------------------------------------------------------------
  // WEATHER DATA OPERATIONS
  // --------------------------------------------------------------------------

  async createWeatherData(data: Omit<WeatherData, 'id'>): Promise<WeatherData> {
    const weather: WeatherData = {
      ...data,
      id: this.weatherIdCounter++,
    };
    this.weatherData.set(weather.id!, weather);
    return weather;
  }

  async getWeatherData(id: number): Promise<WeatherData | null> {
    return this.weatherData.get(id) || null;
  }

  async getSessionWeather(sessionId: number): Promise<WeatherData[]> {
    return Array.from(this.weatherData.values())
      .filter(w => w.sessionId === sessionId)
      .sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateA - dateB; // Chronological order
      });
  }

  async deleteWeatherData(id: number): Promise<boolean> {
    return this.weatherData.delete(id);
  }

  // --------------------------------------------------------------------------
  // UTILITY METHODS
  // --------------------------------------------------------------------------

  async clear(): Promise<void> {
    this.sessions.clear();
    this.readings.clear();
    this.weatherData.clear();
    this.sessionIdCounter = 1;
    this.readingIdCounter = 1;
    this.weatherIdCounter = 1;
  }

  async getStats(): Promise<{
    sessions: number;
    readings: number;
    weather: number;
  }> {
    return {
      sessions: this.sessions.size,
      readings: this.readings.size,
      weather: this.weatherData.size,
    };
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const storage = new InMemoryStorage();

/**
 * MIGRATION GUIDE FOR AI ARCHITECT:
 *
 * To migrate to PostgreSQL with Drizzle ORM:
 *
 * 1. Install dependencies:
 *    npm install drizzle-orm postgres
 *    npm install -D drizzle-kit
 *
 * 2. Create drizzle.config.ts with database connection
 *
 * 3. Create schema in db/schema.ts using Drizzle schema definition
 *
 * 4. Replace InMemoryStorage class with DrizzleStorage class
 *    that implements the same interface but uses:
 *    - db.select().from(sessions)
 *    - db.insert(sessions).values(...)
 *    - db.update(sessions).set(...)
 *    - db.delete(sessions).where(...)
 *
 * 5. Update storage export to use new implementation
 *
 * The interface remains the same, so no changes needed in routes.ts
 */
