import { useQuery } from '@tanstack/react-query';
import { getAllSessions } from '@/lib/api-client';
import { formatDateTime } from '@/lib/utils';

/**
 * Sessions Page - Enhanced with Dramatic Visual Design
 *
 * Features:
 * - Glass-morphism cards
 * - Responsive grid layout
 * - Hover animations
 * - Empty state with call-to-action
 */

export default function SessionsPage() {
  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: getAllSessions,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-pulse text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-muted-foreground">Loading sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md">
          <div className="text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-destructive text-lg font-semibold mb-2">Failed to load sessions</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <header className="animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-2">Sessions</h1>
              <p className="text-lg text-muted-foreground">
                {sessions?.length || 0} lighting session{sessions?.length !== 1 ? 's' : ''} tracked
              </p>
            </div>
            <button className="px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold hover-lift transition-all whitespace-nowrap">
              + New Session
            </button>
          </div>
        </header>

        {/* Sessions Grid */}
        {!sessions || sessions.length === 0 ? (
          <div className="glass-card p-12 sm:p-16 text-center animate-slide-up">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6 animate-float">📸</div>
              <h2 className="text-2xl font-bold mb-3">No Sessions Yet</h2>
              <p className="text-muted-foreground mb-8">
                Create your first session to start tracking lighting conditions for your photography
              </p>
              <button className="px-8 py-4 rounded-xl bg-gradient-secondary text-white font-semibold hover-lift transition-all">
                Create First Session
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sessions.map((session, index) => (
              <div
                key={session.id}
                className="glass-card hover-lift cursor-pointer group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors mb-2">
                      {session.locationName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>📍</span>
                      <span>
                        {session.latitude.toFixed(4)}°, {session.longitude.toFixed(4)}°
                      </span>
                    </div>
                  </div>
                  {!session.endTime && (
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-semibold animate-glow">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      Active
                    </span>
                  )}
                </div>

                {/* Time Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground">Started:</span>
                    <span className="font-medium">{formatDateTime(session.startTime)}</span>
                  </div>
                  {session.endTime && (
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-muted-foreground">Ended:</span>
                      <span className="font-medium">{formatDateTime(session.endTime)}</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {session.notes && (
                  <p className="text-sm text-muted-foreground bg-background/30 p-3 rounded-lg mb-4 line-clamp-2">
                    {session.notes}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <button className="text-sm font-medium text-primary hover:underline transition-colors">
                    View Details
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Edit
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button className="text-sm font-medium text-destructive hover:underline transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Navigation */}
        <div className="text-center pt-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass font-semibold hover-lift transition-all"
          >
            <span>←</span>
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    </div>
  );
}
