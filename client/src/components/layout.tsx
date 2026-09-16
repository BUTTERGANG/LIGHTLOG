import { Link, useLocation } from 'wouter';
import { Home, Sun, Sunset, CloudMoon, MoonStar, RotateCcw, Camera, ListChecks, Layers } from 'lucide-react';
import type { ThemeOverride } from '@/hooks/use-dynamic-theme';
import { cn } from '@/lib/utils';

/**
 * Layout — persistent glass navigation + site footer applied to every page.
 * Also exposes the manual time-of-day / theme override control persisted to
 * localStorage (state lives in the useDynamicTheme hook in App.tsx).
 */

export const THEME_PRESETS: { value: ThemeOverride; label: string; icon: React.ReactNode }[] = [
  { value: 'auto', label: 'Auto (sun position)', icon: <RotateCcw className="w-4 h-4" /> },
  { value: 'day', label: 'Day', icon: <Sun className="w-4 h-4" /> },
  { value: 'golden', label: 'Golden Hour', icon: <Sunset className="w-4 h-4" /> },
  { value: 'blue', label: 'Blue Hour', icon: <CloudMoon className="w-4 h-4" /> },
  { value: 'night', label: 'Night', icon: <MoonStar className="w-4 h-4" /> },
];

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
  { href: '/sessions', label: 'Sessions', icon: <ListChecks className="w-4 h-4" /> },
  { href: '/camera-wizard', label: 'Camera Wizard', icon: <Camera className="w-4 h-4" /> },
];

interface LayoutProps {
  override: ThemeOverride;
  onOverrideChange: (o: ThemeOverride) => void;
  sunElevation: number;
  children: React.ReactNode;
}

export function Layout({ override, onOverrideChange, sunElevation, children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Persistent glass nav */}
      <header className="sticky top-0 z-50 glass/85 backdrop-blur-xl border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <span className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-white" />
            </span>
            <span className="text-xl font-bold text-gradient hidden sm:block">LightLog</span>
          </Link>

          {/* Page links */}
          <nav className="flex items-center gap-1 flex-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/' ? location === '/' : location.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                  )}
                >
                  {link.icon}
                  <span className="hidden md:inline">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Manual time-of-day / theme override control */}
          <div className="flex items-center gap-1 rounded-xl glass p-1 shrink-0">
            {THEME_PRESETS.map((preset) => {
              const isActive = override === preset.value;
              return (
                <button
                  key={preset.value}
                  title={`${preset.label}${preset.value === 'auto' ? '' : ' (override)'}`}
                  aria-pressed={isActive}
                  onClick={() => onOverrideChange(preset.value)}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    isActive
                      ? 'bg-gradient-primary text-white shadow scale-105'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                  )}
                >
                  {preset.icon}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Site footer */}
      <footer className="border-t border-border/60 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </span>
              <span className="font-bold text-gradient text-lg">LightLog</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Photography lighting tracker — sunset timing, sun elevation, and camera settings
              for the light you actually have.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Pages</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Lighting</h4>
            <p className="text-sm text-muted-foreground">
              Current sun elevation: <span className="text-foreground font-medium">{sunElevation.toFixed(1)}°</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Location: San Francisco, CA
            </p>
          </div>
        </div>
        <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} LightLog · Photography Lighting Tracker
        </div>
      </footer>
    </div>
  );
}