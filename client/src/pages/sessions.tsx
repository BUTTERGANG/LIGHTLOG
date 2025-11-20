import { useQuery } from '@tanstack/react-query';
import { getAllSessions } from '@/lib/api-client';
import { formatDateTime } from '@/lib/utils';

/**
 * Sessions Page Component
 *
 * IMPLEMENTATION NOTES FOR AI ARCHITECT:
 * - Displays all photography sessions
 * - Shows session details: location, time, notes
 * - Clicking a session shows readings and weather data
 * - Create new session button
 *
 * TODO FOR IMPLEMENTATION:
 * 1. Add session creation dialog/modal
 * 2. Add session detail view with readings
 * 3. Add session editing and deletion
 * 4. Add export functionality (CSV, JSON)
 * 5. Add filtering and sorting
 * 6. Implement pagination for large lists
 */

export default function SessionsPage() {
  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: getAllSessions,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load sessions</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Sessions</h1>
            <p className="text-muted-foreground">
              {sessions?.length || 0} lighting session{sessions?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            + New Session (TO IMPLEMENT)
          </button>
        </div>

        {/* Sessions List */}
        {!sessions || sessions.length === 0 ? (
          <div className="bg-card rounded-lg p-12 border border-border text-center">
            <p className="text-muted-foreground mb-4">No sessions yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first session to start tracking lighting conditions
            </p>
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Create First Session
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-card rounded-lg p-6 border border-border hover:border-primary transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {session.locationName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Started:</span>{' '}
                        {formatDateTime(session.startTime)}
                      </div>
                      {session.endTime && (
                        <div>
                          <span className="font-medium">Ended:</span>{' '}
                          {formatDateTime(session.endTime)}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Coordinates:</span>{' '}
                        {session.latitude.toFixed(4)}, {session.longitude.toFixed(4)}
                      </div>
                    </div>
                    {session.notes && (
                      <p className="mt-3 text-sm">{session.notes}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    {!session.endTime && (
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="text-sm text-primary hover:underline">
                    View Details
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button className="text-sm text-muted-foreground hover:text-foreground">
                    Edit
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button className="text-sm text-destructive hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block text-primary hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
