# LightLog Implementation Guide

This document provides comprehensive guidance for implementing the remaining features of LightLog. The foundation has been set up, and this guide explains what's been built and what needs to be completed.

## 🏗️ What's Been Built

### ✅ Project Structure
```
LIGHTLOG/
├── client/                 # React frontend application
│   ├── index.html         # HTML entry point
│   └── src/
│       ├── main.tsx       # React entry point with QueryClient
│       ├── App.tsx        # Main app with routing
│       ├── index.css      # Global styles + Tailwind + CSS variables
│       ├── components/    # UI components (create your components here)
│       ├── hooks/         # Custom React hooks
│       │   └── use-dynamic-theme.tsx  # Theme based on sun position
│       ├── lib/           # Utility functions
│       │   ├── sun-calc.ts      # Sun/moon calculations
│       │   ├── api-client.ts    # API wrapper functions
│       │   └── utils.ts         # Helper functions
│       └── pages/         # Route pages
│           ├── home.tsx         # Dashboard with sun/weather data
│           ├── sessions.tsx     # Session list view
│           └── camera-wizard.tsx # Camera settings recommendations
├── server/                # Express backend
│   ├── index.js          # Main Express server
│   ├── routes.ts         # API route handlers
│   └── storage.ts        # In-memory storage interface
├── shared/               # Shared types and schemas
│   └── schema.ts         # Zod schemas and TypeScript types
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript config for client
├── tsconfig.server.json  # TypeScript config for server
├── vite.config.ts        # Vite build configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── .replit              # Replit run configuration
└── replit.nix           # Nix packages for Replit
```

### ✅ Core Technologies Configured
- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: Wouter (lightweight router)
- **Styling**: TailwindCSS with custom Miami Vice theme
- **State Management**: TanStack Query for server state
- **Backend**: Express + TypeScript (compiled to JS)
- **Validation**: Zod schemas shared between client/server
- **Astronomical Calculations**: SunCalc library
- **Deployment**: Replit-ready configuration

### ✅ API Endpoints Implemented

All endpoints are in `server/routes.ts`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/weather` | Fetch weather data for coordinates |
| POST | `/api/sessions` | Create new session |
| GET | `/api/sessions` | Get all sessions |
| GET | `/api/sessions/:id` | Get specific session |
| PATCH | `/api/sessions/:id` | Update session |
| DELETE | `/api/sessions/:id` | Delete session |
| POST | `/api/readings` | Create reading |
| GET | `/api/sessions/:sessionId/readings` | Get session readings |
| POST | `/api/weather-data` | Store weather data |
| GET | `/api/sessions/:sessionId/weather` | Get session weather |
| GET | `/api/health` | Health check |

### ✅ Key Features Working
1. **Sun Position Calculations** - Real-time sun elevation and azimuth
2. **Sun Times** - Sunrise, sunset, golden hour, blue hour
3. **Moon Phase** - Current phase and illumination
4. **Dynamic Theming** - Theme changes based on sun position
5. **Weather Integration** - OpenWeather API (with fallback to simulated data)
6. **Storage System** - In-memory storage with database-ready interface

---

## 🚧 What Needs to Be Implemented

### Priority 1: Core Functionality

#### 1.1 Location Search
**File to modify**: Create `client/src/components/location-search.tsx`

**What to implement**:
- Search input component using OpenStreetMap Nominatim API
- Geocoding: text → coordinates
- Reverse geocoding: coordinates → location name
- Save/persist selected location (localStorage)
- Location context/provider for global state

**API to use**:
```typescript
// Nominatim API (free, no API key required)
const searchUrl = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`;

// Example response structure
interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}
```

**Integration points**:
- Add to `home.tsx` to replace "Change Location" button
- Add to `camera-wizard.tsx`
- Create `LocationContext` to share location across pages

---

#### 1.2 Session Management
**Files to modify**:
- `client/src/pages/sessions.tsx`
- Create `client/src/components/session-dialog.tsx`

**What to implement**:

**A. Create Session Dialog**
- Form with location, start time, notes
- Use React Hook Form + Zod validation
- Submit to POST `/api/sessions`

**B. Session Detail View**
- Click session → show full details
- Display readings in timeline
- Show weather data graph
- Add/edit readings

**C. Edit/Delete Sessions**
- Update session endpoint integration
- Delete confirmation dialog
- Optimistic updates with TanStack Query

**Example form schema**:
```typescript
const sessionFormSchema = z.object({
  locationName: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  startTime: z.date(),
  notes: z.string().optional(),
});
```

---

#### 1.3 Reading Management
**File to create**: `client/src/components/reading-form.tsx`

**What to implement**:
- Form to add light readings during a session
- Inputs: light level, color temp, notes, camera settings
- Auto-capture sun position data
- Submit to POST `/api/readings`
- Display readings in session detail view

**Data to capture**:
```typescript
{
  sessionId: number,
  timestamp: Date,
  lightLevel: number,        // Lux meter reading or manual
  colorTemperature: number,  // Kelvin
  notes: string,
  // Camera settings
  iso: number,
  aperture: string,         // e.g., "f/5.6"
  shutterSpeed: string,     // e.g., "1/250"
  // Auto-captured
  sunElevation: number,
  sunAzimuth: number,
}
```

---

### Priority 2: UI Components

#### 2.1 Reusable UI Components
**Directory**: `client/src/components/ui/`

**Components to create** (based on Radix UI + Tailwind):

1. **Button** (`button.tsx`)
   - Variants: default, destructive, outline, ghost
   - Sizes: sm, md, lg
   - Use `class-variance-authority` for variants

2. **Card** (`card.tsx`)
   - Header, content, footer sections
   - Replace inline divs in pages

3. **Dialog** (`dialog.tsx`)
   - Modal wrapper using Radix Dialog
   - For session create/edit forms

4. **Input** (`input.tsx`)
   - Styled text input
   - Error state handling

5. **Select** (`select.tsx`)
   - Dropdown using Radix Select
   - For location selection

6. **Tabs** (`tabs.tsx`)
   - Using Radix Tabs
   - For session detail views

**Reference**: See shadcn/ui for implementation patterns: https://ui.shadcn.com/

---

#### 2.2 Data Visualization
**File to create**: `client/src/components/sun-position-chart.tsx`

**What to implement**:
- Visual arc showing sun path across sky
- Current sun position indicator
- Golden hour and blue hour regions highlighted
- Use SVG or Canvas
- Optional: Use Recharts library for easier implementation

**Alternative**: Simple progress bar showing sun elevation from -90° to +90°

---

### Priority 3: Enhanced Features

#### 3.1 Camera Wizard Improvements
**File to enhance**: `client/src/pages/camera-wizard.tsx`

**Enhancements needed**:

1. **Save Settings Feature**
   - Save recommended settings to a session
   - History of past recommendations
   - Compare current vs saved settings

2. **Manual Override**
   - Allow user to adjust recommendations
   - Save custom presets

3. **Photography Mode Selection**
   - Dropdown: Portrait, Landscape, Astrophotography, Wildlife
   - Adjust recommendations based on mode

4. **Better Algorithm**
   - Current algorithm is basic
   - Add more sophisticated logic:
     - Cloud cover impact on exposure
     - Wind speed for motion blur
     - Temperature for lens fog risk
     - Moon position for night shots

---

#### 3.2 Weather Data Enhancement
**File to modify**: `server/routes.ts` (weather endpoint)

**What to add**:
- Fetch forecast (not just current)
- Store weather history
- Show weather trends in session view
- Add weather alerts for photography conditions

**API Enhancement**:
```typescript
// Current: only /weather endpoint
// Add: /weather/forecast endpoint
router.post('/weather/forecast', async (req, res) => {
  // Use OpenWeather 5-day forecast API
  // https://api.openweathermap.org/data/2.5/forecast
});
```

---

#### 3.3 Mobile Optimizations
**Files to modify**: All page components

**What to add**:
1. **Bottom Navigation Bar** (mobile only)
   - Home, Sessions, Camera Wizard tabs
   - Sticky position at bottom
   - Show on screens < 768px

2. **Touch Gestures**
   - Swipe between sessions
   - Pull to refresh weather data

3. **PWA Features**
   - Add `manifest.json`
   - Service worker for offline support
   - Install prompt

---

### Priority 4: Data Persistence & Export

#### 4.1 LocalStorage Persistence
**Files to create**:
- `client/src/lib/local-storage.ts`

**What to implement**:
- Save user preferences (location, theme override, units)
- Cache weather data
- Offline session drafts

#### 4.2 Export Features
**File to create**: `client/src/lib/export.ts`

**Export formats to support**:
1. **CSV Export**
   - Sessions with all readings
   - Useful for spreadsheet analysis

2. **JSON Export**
   - Full data export
   - For backup/import

3. **PDF Report** (advanced)
   - Session summary with charts
   - Use library like jsPDF

---

## 🎨 Design System

### Color Scheme (Miami Vice Theme)

The app uses dynamic theming based on sun position:

**Night Theme** (default, sun elevation < -6°):
```css
--primary: 330 81% 60%      /* Pink */
--secondary: 217 91% 60%    /* Blue */
--accent: 280 100% 70%      /* Purple */
--background: 222 84% 5%    /* Dark blue-black */
```

**Day Theme** (sun elevation > 6°):
```css
--primary: 25 95% 53%       /* Orange */
--secondary: 45 93% 47%     /* Yellow */
--background: 0 0% 100%     /* White */
```

**Golden Hour** (-0.833° < elevation < 6°):
```css
--primary: 35 100% 60%      /* Golden orange */
--secondary: 15 90% 55%     /* Warm red-orange */
```

**Blue Hour** (-6° < elevation < -0.833°):
```css
--primary: 210 100% 60%     /* Sky blue */
--secondary: 240 80% 65%    /* Deep blue */
```

### Typography
- Headings: Bold, gradient text effects
- Body: System font stack for best performance
- Monospace: For coordinates and technical data

---

## 🔧 Development Workflow

### Getting Started on Replit

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   This starts:
   - Express server on port 3000 (API)
   - Vite dev server on port 5000 (frontend with HMR)

3. **Type Checking**
   ```bash
   npm run typecheck
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```
   Creates:
   - `dist/public/` - Static frontend files
   - `dist/server/` - Compiled server code

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

### Environment Variables

Create `.env` file (optional):
```env
# Weather API (optional - falls back to simulated data)
OPENWEATHER_API_KEY=your_key_here

# Port configuration (auto-set on Replit)
PORT=3000
NODE_ENV=development
```

Get free API key: https://openweathermap.org/api

---

## 🐛 Common Issues & Solutions

### Issue: TypeScript Errors in IDE
**Solution**: Make sure VSCode is using workspace TypeScript version:
- Cmd+Shift+P → "TypeScript: Select TypeScript Version"
- Choose "Use Workspace Version"

### Issue: API Calls Failing in Development
**Solution**: Check Vite proxy configuration in `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

### Issue: Tailwind Classes Not Working
**Solution**:
1. Check `tailwind.config.js` content paths include your files
2. Ensure `@tailwind` directives in `index.css`
3. Restart dev server

### Issue: Module Resolution Errors
**Solution**: Check path aliases in:
- `tsconfig.json` (client)
- `tsconfig.server.json` (server)
- `vite.config.ts`

All should have matching `@/` and `@shared/` aliases.

---

## 📊 Database Migration (Future)

The current implementation uses in-memory storage. To migrate to PostgreSQL:

### Step 1: Install Drizzle ORM
```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### Step 2: Create Database Schema
**File**: `db/schema.ts`
```typescript
import { pgTable, serial, text, timestamp, real } from 'drizzle-orm/pg-core';

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  locationName: text('location_name').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Add readings and weatherData tables similarly
```

### Step 3: Replace Storage Implementation
**File**: `server/storage.ts`

Replace `InMemoryStorage` class with `DrizzleStorage` that uses:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

// Then use db.select(), db.insert(), etc.
```

The interface remains the same, so no changes needed in `routes.ts`.

---

## 🎯 Implementation Checklist

Use this checklist to track implementation progress:

### Core Features
- [ ] Location search with Nominatim API
- [ ] Location persistence in localStorage
- [ ] Location context for global state
- [ ] Session create dialog
- [ ] Session detail view
- [ ] Session edit/delete functionality
- [ ] Reading form component
- [ ] Reading timeline display
- [ ] Weather data visualization

### UI Components
- [ ] Button component
- [ ] Card component
- [ ] Dialog component
- [ ] Input component
- [ ] Select component
- [ ] Tabs component
- [ ] Sun position chart
- [ ] Bottom navigation (mobile)

### Enhanced Features
- [ ] Camera wizard save settings
- [ ] Photography mode presets
- [ ] Weather forecast integration
- [ ] PWA manifest
- [ ] Service worker
- [ ] CSV export
- [ ] JSON export
- [ ] Data import

### Polish
- [ ] Loading states for all API calls
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] Responsive design testing
- [ ] Accessibility audit (ARIA labels, keyboard nav)
- [ ] Performance optimization (code splitting)

---

## 🚀 Deployment Notes

### Replit Deployment
1. Project is pre-configured with `.replit` and `replit.nix`
2. Click "Run" button to start
3. Replit will automatically:
   - Install dependencies
   - Start server on port 3000
   - Proxy to port 80 for public access

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Add `OPENWEATHER_API_KEY` secret
- [ ] Run `npm run build`
- [ ] Test production build with `npm run preview`
- [ ] Verify all API endpoints work
- [ ] Check mobile responsiveness
- [ ] Test on different browsers

---

## 📝 Code Style Guidelines

### TypeScript
- Use explicit types for function parameters and returns
- Avoid `any` - use `unknown` if type is truly unknown
- Use type inference for simple variables
- Extract complex types to `shared/schema.ts`

### React
- Prefer function components with hooks
- Use descriptive component names (PascalCase)
- Keep components under 200 lines (split if larger)
- Use `data-testid` for interactive elements
- Memoize expensive calculations with `useMemo`

### CSS
- Use Tailwind utility classes
- Use `cn()` helper for conditional classes
- Custom styles only in `index.css` for theme variables
- Mobile-first approach (default styles for mobile, `md:` for desktop)

### File Organization
- One component per file
- Group related components in subdirectories
- Index exports for cleaner imports:
  ```typescript
  // components/ui/index.ts
  export { Button } from './button';
  export { Card } from './card';
  ```

---

## 🆘 Getting Help

### Resources
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **TailwindCSS**: https://tailwindcss.com/docs
- **TanStack Query**: https://tanstack.com/query/latest/docs/react/overview
- **Radix UI**: https://www.radix-ui.com/primitives/docs/overview/introduction
- **SunCalc**: https://github.com/mourner/suncalc
- **OpenWeather API**: https://openweathermap.org/api

### Common Patterns

**Fetching data with TanStack Query**:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['sessions'],
  queryFn: getAllSessions,
});
```

**Creating data with mutation**:
```typescript
const mutation = useMutation({
  mutationFn: createSession,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['sessions'] });
  },
});
```

**Form with React Hook Form + Zod**:
```typescript
const form = useForm({
  resolver: zodResolver(sessionFormSchema),
  defaultValues: { ... },
});

const onSubmit = form.handleSubmit((data) => {
  mutation.mutate(data);
});
```

---

## 🎉 Final Notes

This scaffold provides a solid foundation for LightLog. The architecture is designed to be:

- **Type-safe**: Shared schemas between client and server
- **Scalable**: Easy to add new features and endpoints
- **Maintainable**: Clear separation of concerns
- **Performant**: Optimized build configuration
- **User-friendly**: Mobile-first, responsive design

Focus on implementing features in the priority order listed above. Start with core functionality (location search, session management) before moving to enhancements.

The dynamic theming and sun calculations already work beautifully - use them as a foundation to build an amazing photography tool!

**Happy coding! 🌅📸**
