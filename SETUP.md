# LightLog - Quick Setup Guide

This is a quick-start guide for getting LightLog running on Replit.

## 🚀 Quick Start (3 steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

This starts:
- **Backend API** on port 3000
- **Frontend** on port 5000 with hot reload

### 3. Open in Browser
Navigate to the URL shown in the console (usually port 5000).

---

## 📁 Project Overview

```
LIGHTLOG/
├── client/          # React frontend (TypeScript)
├── server/          # Express backend (TypeScript → JavaScript)
├── shared/          # Shared types and schemas
└── package.json     # All dependencies configured
```

---

## 🔑 Optional: Weather API Key

The app works without an API key (uses simulated data). For real weather:

1. Get free key: https://openweathermap.org/api
2. Add to Replit Secrets or create `.env`:
   ```env
   OPENWEATHER_API_KEY=your_key_here
   ```

---

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start dev servers (backend + frontend)

# Type checking
npm run typecheck        # Check TypeScript errors

# Production
npm run build            # Build for production
npm run preview          # Preview production build
npm start                # Run production server
```

---

## 📖 Full Documentation

- **README.md** - Project overview and features
- **IMPLEMENTATION.md** - Comprehensive implementation guide
- **CONTRIBUTING.md** - Development guidelines

---

## 🎯 Current Status

### ✅ Working
- Project structure and configuration
- TypeScript compilation
- Express API with all endpoints
- React app with routing
- Sun/moon calculations
- Weather API integration (with fallback)
- Dynamic theming
- Replit deployment configuration

### 🚧 To Implement
See `IMPLEMENTATION.md` for detailed implementation guide:
- Location search functionality
- Session management UI
- Reading creation and display
- UI component library
- Data visualization
- Export features

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill existing processes
pkill -f node
# Then restart
npm run dev
```

### TypeScript Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Module Not Found
```bash
# Ensure all dependencies installed
npm install
```

---

## 💡 Development Tips

1. **Hot Reload**: Frontend changes auto-reload. Backend requires restart.
2. **Type Safety**: Run `npm run typecheck` before committing.
3. **API Testing**: Use `/api/health` endpoint to verify backend is running.
4. **Shared Types**: Import from `@shared/schema` in both client and server.

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Routing | Wouter |
| Styling | TailwindCSS |
| State | TanStack Query |
| Backend | Express + TypeScript |
| Validation | Zod |
| Calculations | SunCalc |
| Build | Vite |

---

## 📞 Need Help?

1. Check **IMPLEMENTATION.md** for detailed guidance
2. Review **CONTRIBUTING.md** for development patterns
3. Check console for error messages
4. Verify all dependencies installed with `npm install`

---

**Ready to build something amazing! 🌅📸**
