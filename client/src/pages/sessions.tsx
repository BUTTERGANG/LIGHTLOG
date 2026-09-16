import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllSessions,
  createSession,
  createReading,
  deleteSession,
  getSessionReadings,
} from '@/lib/api-client';
import { formatDateTime } from '@/lib/utils';
import type { Session, Reading } from '@shared/schema';

/**
 * Sessions Page - Enhanced with Dramatic Visual Design
 *
 * Functional CRUD: create a session, open its detail view, add lighting
 * readings, delete the session, and list everything — all wired to the
 * backend API via TanStack Query.
 */

export default function SessionsPage() {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // List all sessions
  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: getAllSessions,
  });

  // Create a session
  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      setShowForm(false);
      if (session.id) setSelectedId(session.id);
    },
  });

  // Delete a session
  const deleteSessionMutation = useMutation({
    mutationFn: (id: number) => deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      setSelectedId(null);
    },
  });

  const selectedSession =
    selectedId ? sessions?.find((s) => s.id === selectedId) : undefined;

  // Readings for the selected session
  const { data: readings } = useQuery({
    queryKey: ['session-readings', selectedId],
    queryFn: () => getSessionReadings(selectedId!),
    enabled: !!selectedId,
  });

  // Add a reading to the selected session
  const createReadingMutation = useMutation({
    mutationFn: createReading,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['session-readings', selectedId] }),
  });

  if (isLoading && !sessions) {
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

  // If a session is selected, show its detail view (readings + add reading)
  if (selectedSession) {
    return (
      <SessionDetail
        session={selectedSession}
        readings={readings || []}
        onAddReading={(data) => createReadingMutation.mutate(data)}
        onDelete={() => deleteSessionMutation.mutate(selectedSession.id!)}
        onBack={() => setSelectedId(null)}
        pending={createReadingMutation.isPending || deleteSessionMutation.isPending}
      />
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
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold hover-lift transition-all whitespace-nowrap"
            >
              + New Session
            </button>
          </div>
        </header>

        {/* New Session Form */}
        {showForm && (
          <NewSessionForm
            onSubmit={(data) => createSessionMutation.mutate(data)}
            onCancel={() => setShowForm(false)}
            pending={createSessionMutation.isPending}
          />
        )}

        {/* Sessions Grid / Empty state */}
        {!sessions || sessions.length === 0 ? (
          <div className="glass-card p-12 sm:p-16 text-center animate-slide-up">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6 animate-float">📸</div>
              <h2 className="text-2xl font-bold mb-3">No Sessions Yet</h2>
              <p className="text-muted-foreground mb-8">
                Create your first session to start tracking lighting conditions for your photography
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-4 rounded-xl bg-gradient-secondary text-white font-semibold hover-lift transition-all"
              >
                Create First Session
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sessions.map((session, index) => (
              <div
                key={session.id}
                className="glass-card hover-lift group animate-slide-up"
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
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                      <span className="w-2 h-2 rounded-full bg-primary" />
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
                  <button
                    onClick={() => session.id && setSelectedId(session.id)}
                    className="text-sm font-medium text-primary hover:underline transition-colors"
                  >
                    View Details
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button
                    onClick={() => session.id && setSelectedId(session.id)}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Add Entry
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button
                    onClick={() => session.id && deleteSessionMutation.mutate(session.id)}
                    className="text-sm font-medium text-destructive hover:underline transition-colors"
                  >
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

/** Inline form for creating a new session. */
function NewSessionForm({
  onSubmit,
  onCancel,
  pending,
}: {
  onSubmit: (data: {
    locationName: string;
    latitude: number;
    longitude: number;
    startTime: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('37.7749');
  const [longitude, setLongitude] = useState('-122.4194');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!locationName.trim()) {
      setErrorMsg('Location name is required.');
      return;
    }
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setErrorMsg('Latitude and longitude must be valid numbers.');
      return;
    }
    setErrorMsg(null);
    onSubmit({
      locationName: locationName.trim(),
      latitude: lat,
      longitude: lng,
      startTime: new Date().toISOString(),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <h2 className="text-xl font-bold mb-4">New Session</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-sm text-muted-foreground">Location Name</span>
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="e.g. Golden Gate Bridge"
            className="mt-1 w-full px-3 py-2 rounded-lg bg-background/30 border border-border text-foreground"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted-foreground">Latitude</span>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-background/30 border border-border text-foreground"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted-foreground">Longitude</span>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-background/30 border border-border text-foreground"
          />
        </label>
      </div>
      <label className="block mt-4">
        <span className="text-sm text-muted-foreground">Notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes about this session..."
          className="mt-1 w-full px-3 py-2 rounded-lg bg-background/30 border border-border text-foreground"
          rows={2}
        />
      </label>
      {errorMsg && <p className="text-sm text-destructive mt-3">{errorMsg}</p>}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={pending}
          className="px-5 py-2.5 rounded-xl bg-gradient-primary text-white font-semibold hover-lift transition-all"
        >
          {pending ? 'Creating...' : 'Create Session'}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl glass font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/** Detail view for a single session: readings list + add-reading form + delete. */
function SessionDetail({
  session,
  readings,
  onAddReading,
  onDelete,
  onBack,
  pending,
}: {
  session: Session;
  readings: Reading[];
  onAddReading: (data: Omit<Reading, 'id'>) => void;
  onDelete: () => void;
  onBack: () => void;
  pending: boolean;
}) {
  const [lightLevel, setLightLevel] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fmt = (value: string | Date) =>
    formatDateTime(value instanceof Date ? value.toISOString() : value);

  const handleAdd = () => {
    const lvl = parseFloat(lightLevel);
    if (Number.isNaN(lvl) || lvl < 0) {
      setErrorMsg('Light level must be a number >= 0.');
      return;
    }
    setErrorMsg(null);
    onAddReading({
      sessionId: session.id!,
      timestamp: new Date().toISOString(),
      lightLevel: lvl,
      notes: notes.trim() || undefined,
    });
    setLightLevel('');
    setNotes('');
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        <button onClick={onBack} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Sessions
        </button>

        <div className="glass-card p-6">
          <h1 className="text-3xl font-bold text-gradient mb-1">{session.locationName}</h1>
          <p className="text-sm text-muted-foreground">
            📍 {session.latitude.toFixed(4)}°, {session.longitude.toFixed(4)}° · Started {fmt(session.startTime)}
          </p>
          {session.notes && <p className="text-sm text-muted-foreground bg-background/30 p-3 rounded-lg mt-3">{session.notes}</p>}
          <button
            onClick={onDelete}
            disabled={pending}
            className="mt-4 px-4 py-2 rounded-lg bg-destructive text-white text-sm font-semibold transition-colors hover:bg-destructive/90"
          >
            Delete Session
          </button>
        </div>

        {/* Add Reading form */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">Add Reading</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-muted-foreground">Light Level (lux)</span>
              <input
                type="number"
                step="any"
                min="0"
                value={lightLevel}
                onChange={(e) => setLightLevel(e.target.value)}
                placeholder="e.g. 32000"
                className="mt-1 w-full px-3 py-2 rounded-lg bg-background/30 border border-border text-foreground"
              />
            </label>
            <label className="block">
              <span className="text-sm text-muted-foreground">Notes</span>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional"
                className="mt-1 w-full px-3 py-2 rounded-lg bg-background/30 border border-border text-foreground"
              />
            </label>
          </div>
          {errorMsg && <p className="text-sm text-destructive mt-3">{errorMsg}</p>}
          <button
            onClick={handleAdd}
            disabled={pending}
            className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-primary text-white font-semibold hover-lift transition-all"
          >
            {pending ? 'Saving...' : '+ Add Entry'}
          </button>
        </div>

        {/* Readings list */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">Readings ({readings.length})</h2>
          {readings.length >= 2 && <ReadingsChart readings={readings} />}
          {readings.length === 0 ? (
            <p className="text-muted-foreground">No readings yet — add your first entry above.</p>
          ) : (
            <ul className="space-y-3">
              {readings.map((reading) => (
                <li key={reading.id} className="flex items-start gap-3 p-3 rounded-lg bg-background/20">
                  <span className="text-2xl">💡</span>
                  <div className="flex-1">
                    <p className="font-semibold">{reading.lightLevel.toLocaleString()} lux</p>
                    {reading.notes && <p className="text-sm text-muted-foreground">{reading.notes}</p>}
                    <p className="text-xs text-muted-foreground">{fmt(reading.timestamp)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
/** Light-level history line/area chart (rendered when a session has readings). */
function ReadingsChart({ readings }: { readings: Reading[] }) {
  const W = 600;
  const H = 180;
  const PAD = 36;
  const innerW = W - PAD * 2;
  const innerH = H - PAD * 2;

  const sorted = [...readings].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const levels = sorted.map((r) => r.lightLevel);
  const maxLevel = Math.max(...levels, 1);
  const minLevel = Math.min(...levels, 0);
  const range = Math.max(maxLevel - minLevel, 1);
  const start = new Date(sorted[0].timestamp).getTime();
  const end = new Date(sorted[sorted.length - 1].timestamp).getTime();
  const span = Math.max(end - start, 1);

  const px = (t: number) => PAD + ((t - start) / span) * innerW;
  const py = (v: number) => PAD + (1 - (v - minLevel) / range) * innerH;

  const linePath = sorted
    .map((r, i) => {
      const t = new Date(r.timestamp).getTime();
      return `${i === 0 ? 'M' : 'L'}${px(t).toFixed(1)},${py(r.lightLevel).toFixed(1)}`;
    })
    .join(' ');

  const areaPath = `${linePath} L${px(end).toFixed(1)},${(PAD + innerH).toFixed(1)} L${px(start).toFixed(1)},${(PAD + innerH).toFixed(1)} Z`;

  return (
    <div className="mb-5 rounded-xl border border-border bg-background/20 p-2">
      <div className="flex items-center justify-between px-2 pt-1 pb-2">
        <span className="text-sm font-semibold">Light Level History</span>
        <span className="text-xs text-muted-foreground">
          {formatDateTime(sorted[0].timestamp)} → {formatDateTime(sorted[sorted.length - 1].timestamp)}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Light level history chart">
        <defs>
          <linearGradient id="readingsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gradient-primary)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--gradient-secondary)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((f) => {
          const gy = (PAD + f * innerH).toFixed(1);
          const gv = (minLevel + (1 - f) * range).toFixed(0);
          return (
            <g key={f}>
              <line x1={PAD} y1={gy} x2={W - PAD} y2={gy} stroke="var(--border)" strokeWidth="1" strokeDasharray="2 4" />
              <text x={W - PAD + 4} y={gy} fontSize="10" fill="var(--muted-foreground)">{gv}</text>
            </g>
          );
        })}
        <path d={areaPath} fill="url(#readingsFill)" />
        <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {sorted.map((r, i) => {
          const t = new Date(r.timestamp).getTime();
          return <circle key={i} cx={px(t)} cy={py(r.lightLevel)} r="4" fill="var(--primary)" stroke="var(--background)" strokeWidth="1.5" />;
        })}
        <text x={PAD} y={H - 6} fontSize="10" fill="var(--muted-foreground)">first</text>
        <text x={W - PAD} y={H - 6} fontSize="10" fill="var(--muted-foreground)" textAnchor="end">latest · lux</text>
      </svg>
    </div>
  );
}
