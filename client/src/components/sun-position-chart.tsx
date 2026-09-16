import { useMemo } from 'react';
import { getSunPosition } from '@/lib/sun-calc';
import { formatTime } from '@/lib/utils';

/**
 * SunPathChart — a real data chart of the sun's elevation arc across the day.
 *
 * It samples the sun's elevation for the given location every 15 minutes over
 * the full 24h day and draws an area chart (time on X, elevation on Y), with
 * a horizon line and a marker pinned at the current sun position.
 */

interface SunPathChartProps {
  latitude: number;
  longitude: number;
  date?: Date;
}

const W = 600;
const H = 240;
const PAD_X = 40;
const PAD_TOP = 24;
const PAD_BOTTOM = 30;

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

export default function SunPathChart({
  latitude,
  longitude,
  date = new Date(),
}: SunPathChartProps) {
  const chart = useMemo(() => {
    // Sample elevation every 15 minutes over the whole day.
    const samples: { t: number; elev: number }[] = [];
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const STEPS = 96; // 24h * 4
    for (let i = 0; i <= STEPS; i++) {
      const when = new Date(dayStart.getTime() + (i * 24 * 3600 * 1000) / STEPS);
      const elev = getSunPosition(latitude, longitude, when).elevation;
      samples.push({ t: i / STEPS, elev });
    }

    // Elevation range for scaling: min -12 (below horizon) .. max.
    const elevs = samples.map((s) => s.elev);
    const ceilMax = Math.max(6, Math.ceil(Math.max(...elevs) / 10) * 10);
    const ELEV_MIN = -12;
    const ELEV_MAX = ceilMax;

    const innerW = W - PAD_X * 2;
    const innerH = H - PAD_TOP - PAD_BOTTOM;

    const x = (t: number) => PAD_X + t * innerW;
    const y = (elev: number) =>
      PAD_TOP + (1 - clamp((elev - ELEV_MIN) / (ELEV_MAX - ELEV_MIN), 0, 1)) * innerH;

    const areaPath =
      samples.map((s, i) => `${i === 0 ? 'M' : 'L'}${x(s.t).toFixed(1)},${y(s.elev).toFixed(1)}`).join(' ') +
      ` L${x(1).toFixed(1)},${(PAD_TOP + innerH).toFixed(1)} L${x(0).toFixed(1)},${(PAD_TOP + innerH).toFixed(1)} Z`;

    // Current sun position marker.
    const current = getSunPosition(latitude, longitude, date);
    const nowT =
      (date.getTime() - dayStart.getTime()) / (24 * 3600 * 1000);

    // Gridlines for hours.
    const hourTicks = [0, 6, 12, 18, 24].map((h) => h / 24);
    const horizonY = y(0);

    return {
      areaPath,
      currentX: x(clamp(nowT, 0, 1)),
      currentY: y(current.elevation),
      currentElev: current.elevation,
      nowT: clamp(nowT, 0, 1),
      hourTicks,
      horizonY,
      currentLabel: formatTime(date),
    };
  }, [latitude, longitude, date]);

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-background/30 p-2">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          role="img"
          aria-label="Sun elevation across the day"
        >
          <defs>
            <linearGradient id="sunArcFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gradient-primary)" stopOpacity="0.65" />
              <stop offset="100%" stopColor="var(--gradient-secondary)" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Hour gridlines */}
          {chart.hourTicks.map((t) => {
            const gx = PAD_X + t * (W - PAD_X * 2);
            const gt = Math.round(t * 24);
            return (
              <g key={gt}>
                <line
                  x1={gx}
                  y1={PAD_TOP}
                  x2={gx}
                  y2={H - PAD_BOTTOM}
                  stroke="var(--border)"
                  strokeWidth="1"
                  strokeDasharray="2 5"
                />
                <text
                  x={gx}
                  y={H - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--muted-foreground)"
                >
                  {gt}h
                </text>
              </g>
            );
          })}

          {/* Horizon line */}
          <line
            x1={PAD_X}
            y1={chart.horizonY}
            x2={W - PAD_X}
            y2={chart.horizonY}
            stroke="var(--muted-foreground)"
            strokeOpacity="0.5"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
          <text
            x={4}
            y={chart.horizonY - 4}
            fontSize="10"
            fill="var(--muted-foreground)"
          >
            horizon
          </text>

          {/* Elevation arc area */}
          <path d={chart.areaPath} fill="url(#sunArcFill)" />

          {/* Current position marker */}
          <circle cx={chart.currentX} cy={chart.currentY} r="6" fill="var(--primary)" stroke="var(--background)" strokeWidth="2" />
          <line
            x1={chart.currentX}
            y1={chart.currentY - 9}
            x2={chart.currentX}
            y2={chart.currentY + 9}
            stroke="var(--primary)"
            strokeWidth="2"
            opacity="0.6"
          />
        </svg>

        {/* Current position readout */}
        <div className="absolute top-2 right-2 rounded-lg glass px-3 py-1.5 text-xs pointer-events-none">
          <span className="text-muted-foreground">Now </span>
          <span className="font-semibold">{chart.currentLabel}</span>
          <span className="mx-1 text-muted-foreground">·</span>
          <span className="font-semibold">{chart.currentElev.toFixed(1)}° elevation</span>
        </div>
      </div>
    </div>
  );
}