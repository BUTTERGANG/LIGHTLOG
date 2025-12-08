import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility Functions for LightLog
 *
 * IMPLEMENTATION NOTES FOR AI ARCHITECT:
 * - cn() is for className merging with Tailwind
 * - Formatting utilities for display
 * - Date/time helpers
 */

/**
 * Merge Tailwind classes with proper precedence
 * Used throughout components for conditional styling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format temperature with unit
 */
export function formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    temp = (temp * 9) / 5 + 32;
  }
  return `${Math.round(temp)}°${unit}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Format degrees (azimuth)
 */
export function formatDegrees(degrees: number): string {
  return `${Math.round(degrees)}°`;
}

/**
 * Convert degrees to cardinal direction
 */
export function degreesToCardinal(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((degrees % 360) / 45)) % 8;
  return directions[index] || 'N';
}

/**
 * Format time from Date or ISO string
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format date from Date or ISO string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format duration in milliseconds to human readable
 */
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${minutes}m`;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format ISO string to locale date time
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
