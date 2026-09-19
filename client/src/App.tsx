import { Route, Switch, Link } from 'wouter';
import { useDynamicTheme } from './hooks/use-dynamic-theme';
import { Layout } from './components/layout';
import HomePage from './pages/home';
import SessionsPage from './pages/sessions';
import CameraWizardPage from './pages/camera-wizard';

/**
 * Main App Component with Routing
 *
 * IMPLEMENTATION NOTES FOR AI ARCHITECT:
 * - Uses Wouter for lightweight client-side routing
 * - Dynamic theming based on sun position (implemented in useDynamicTheme hook)
 * - Persistent glass nav bar + site footer via Layout (applied to every page)
 * - Manual time-of-day/theme override persisted to localStorage
 * - Three main pages: Home, Sessions, Camera Wizard
 * - Mobile-first responsive design
 * - Theme classes applied to root div for CSS variable cascading
 */

function App() {
  const { themeType, sunElevation, override, setOverride } = useDynamicTheme();

  return (
    <div className={`min-h-screen theme-${themeType}`}>
      <Layout
        override={override}
        onOverrideChange={setOverride}
        sunElevation={sunElevation}
      >
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/sessions" component={SessionsPage} />
          <Route path="/camera-wizard" component={CameraWizardPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Layout>
    </div>
  );
}

/**
 * 404 Not Found Page
 */
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default App;