# 🌅 LightLog - Photography Lighting Tracker

A modern, responsive photography app for tracking sunset lighting conditions with integrated weather data, accurate astronomical calculations, and AI-powered camera settings recommendations.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Node](https://img.shields.io/badge/Node-20-green)

## ✨ Features

### 🌇 Real-Time Sun & Moon Tracking
- **Accurate Astronomical Calculations**: Precise sun elevation and azimuth using SunCalc library
- **Moon Phase Tracking**: Current moon phase and illumination percentage
- **Location-Based**: Dynamic calculations based on your selected location
- **Timezone Aware**: Accurate local times for sunrise, sunset, and photography events

### 🎨 Dynamic Miami Vice Theming
- **Location-Based Theming**: Theme changes based on sun position at selected location
- **Dark Mode**: Minimalist design with beautiful gradient accents
- **Responsive Design**: Mobile-first with touch-optimized components
- **Miami Vice Inspired**: Vibrant sunset colors and twilight gradients

### 📸 AI Photography Wizard
- **Smart Camera Settings**: Optimal ISO, aperture, and shutter speed recommendations
- **Condition-Aware**: Adapts to current lighting, weather, and celestial data
- **Pro Tips**: Contextual photography advice for each lighting scenario
- **Celestial Info**: Real-time sun and moon position data

### 🌤️ Weather Integration
- **Real-Time Data**: Current temperature, humidity, cloud cover, and visibility
- **OpenWeather API**: Reliable weather data for any location worldwide
- **Light Quality Analysis**: Automated assessment based on environmental conditions

### ⏰ Photography Timeline
- **Daily Event Schedule**: Golden hour, blue hour, civil/nautical/astronomical twilight
- **Optimal Timing**: Know exactly when to shoot for the best light
- **Visual Timeline**: Interactive display of daily photography opportunities

### 📍 Location Search
- **Global Coverage**: Search and select any location worldwide
- **Geocoding**: Powered by OpenStreetMap Nominatim API
- **Quick Access**: Save and switch between favorite locations

## 🚀 Quick Start

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager
- OpenWeather API key (optional - falls back to simulated data)

### Installation

1. Clone the repository
```bash
git clone https://github.com/BUTTERGANG/LIGHTLOG.git
cd LIGHTLOG
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (optional)
```bash
# Create a .env file in the root directory
OPENWEATHER_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser to `http://localhost:5000`

## 🏗️ Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Wouter** - Lightweight routing
- **TailwindCSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling with Zod validation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database toolkit
- **Neon Database** - Serverless PostgreSQL
- **Zod** - Schema validation

### Key Libraries
- **SunCalc** - Astronomical calculations
- **Lucide React** - Icon library
- **date-fns** - Date utilities
- **Framer Motion** - Animations

## 📱 Mobile Support

LightLog is built with a mobile-first approach:
- Responsive layouts for all screen sizes
- Bottom navigation bar for mobile devices
- Touch-optimized interactions
- Adaptive UI components using Tailwind breakpoints

## 🔧 Development

### Project Structure
```
LIGHTLOG/
├── client/              # Frontend React application
│   └── src/
│       ├── components/  # UI components
│       ├── hooks/       # Custom React hooks
│       ├── lib/         # Utilities and helpers
│       └── pages/       # Route pages
├── server/              # Backend Express application
│   ├── routes.ts        # API endpoints
│   └── storage.ts       # Data storage interface
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database and validation schemas
└── attached_assets/     # Static assets
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
```

### API Endpoints
```
POST   /api/weather              # Fetch weather data for coordinates
POST   /api/sessions             # Create new lighting session
GET    /api/sessions             # Get all sessions
GET    /api/sessions/:id         # Get specific session
POST   /api/readings             # Add lighting reading
GET    /api/sessions/:sessionId/readings    # Get session readings
POST   /api/weather-data         # Store weather data
GET    /api/sessions/:sessionId/weather     # Get session weather
```

### Environment Variables
```env
# Optional - Weather API
OPENWEATHER_API_KEY=your_key_here

# Optional - Database (auto-configured on Replit)
DATABASE_URL=postgresql://...
```

## 🎯 Core Features Explained

### Sun Position Calculation
Uses the SunCalc library to calculate:
- Sun elevation (angle above horizon)
- Sun azimuth (compass direction)
- Sunrise and sunset times
- Golden hour and blue hour timing
- Civil, nautical, and astronomical twilight

### Camera Wizard Algorithm
The AI Photography Wizard analyzes:
1. **Sun Position**: Elevation and azimuth angles
2. **Time of Day**: Hour and location timezone
3. **Weather Conditions**: Cloud cover, temperature, humidity
4. **Moon Phase**: Illumination for night photography
5. **Lighting Type**: Golden hour, blue hour, midday, night

Based on this analysis, it recommends:
- ISO sensitivity settings
- Aperture (f-stop) values
- Shutter speed
- Camera mode (Manual, Aperture Priority, etc.)
- Focus settings
- Metering mode
- Pro tips specific to current conditions

### Dynamic Theming
The theme adapts to sun position at your selected location:
- **Day** (sun above horizon): Bright, warm colors
- **Golden Hour** (sun near horizon): Warm gradients
- **Blue Hour** (sun just below horizon): Cool twilight tones
- **Night** (sun well below horizon): Dark minimalist design

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SunCalc** - Sun position calculations
- **OpenWeather** - Weather data API
- **OpenStreetMap Nominatim** - Geocoding service
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful component designs

## 📬 Contact

Project maintained by [@BUTTERGANG](https://github.com/BUTTERGANG)

Repository: [BUTTERGANG/LIGHTLOG](https://github.com/BUTTERGANG/LIGHTLOG)

---

**Built with ❤️ for photographers who chase the light**
