import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { router } from './routes.js';

/**
 * Main Express Server for LightLog
 *
 * IMPLEMENTATION NOTES FOR AI ARCHITECT:
 * - Uses ES modules (type: "module" in package.json)
 * - Serves static files from dist/public in production
 * - API routes mounted at /api
 * - Handles SPA routing (all non-API routes serve index.html)
 * - CORS enabled for development
 * - Port configurable via PORT environment variable
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// CORS for development (Vite dev server runs on different port)
if (isDev) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
}

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// API ROUTES
// ============================================================================

app.use('/api', router);

// ============================================================================
// STATIC FILE SERVING (Production)
// ============================================================================

if (!isDev) {
  const publicPath = path.join(__dirname, '..', 'public');
  app.use(express.static(publicPath));

  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: isDev ? err.message : 'Something went wrong',
  });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🌅 LightLog Server                                         ║
║                                                              ║
║   Environment: ${isDev ? 'Development' : 'Production'}                                   ║
║   Port:        ${PORT}                                           ║
║   API:         http://localhost:${PORT}/api                      ║
║   Health:      http://localhost:${PORT}/api/health               ║
║                                                              ║
║   ${isDev ? 'Run "npm run dev" in another terminal for Vite' : 'Serving static files from dist/public'}        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});
