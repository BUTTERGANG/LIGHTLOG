# Contributing to LightLog

Thank you for your interest in contributing to LightLog! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions. We're all here to build something great together.

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Setup Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally
```bash
git clone https://github.com/YOUR_USERNAME/LIGHTLOG.git
cd LIGHTLOG
```

3. Add the upstream repository
```bash
git remote add upstream https://github.com/BUTTERGANG/LIGHTLOG.git
```

4. Install dependencies
```bash
npm install
```

5. Start the development server
```bash
npm run dev
```

## Development Guidelines

### Code Style

#### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible
- Use strict mode type checking

#### React Components
- Use functional components with hooks
- Follow the existing component structure
- Add data-testid attributes for interactive elements
- Keep components focused and single-purpose

#### Naming Conventions
- **Files**: kebab-case (e.g., `camera-wizard.tsx`)
- **Components**: PascalCase (e.g., `CameraWizard`)
- **Functions**: camelCase (e.g., `getSunPosition`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

#### File Organization
```
client/src/
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and helper functions
└── pages/         # Route page components

server/
├── routes.ts      # API endpoint definitions
└── storage.ts     # Data storage interface

shared/
└── schema.ts      # Shared types and Zod schemas
```

### Git Workflow

1. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes with clear, atomic commits
```bash
git add .
git commit -m "Add: Brief description of changes"
```

3. Keep your branch updated
```bash
git fetch upstream
git rebase upstream/main
```

4. Push to your fork
```bash
git push origin feature/your-feature-name
```

5. Create a Pull Request on GitHub

### Commit Messages

Follow this format:
```
Type: Brief description (50 chars or less)

Longer explanation if needed. Wrap at 72 characters.
Explain what changed and why, not how.
```

**Types:**
- `Add:` New feature or functionality
- `Fix:` Bug fix
- `Update:` Modify existing feature
- `Remove:` Delete code or feature
- `Refactor:` Code restructuring without behavior change
- `Docs:` Documentation only
- `Style:` Formatting, missing semicolons, etc.
- `Test:` Adding or updating tests
- `Chore:` Maintenance tasks

### Pull Request Guidelines

1. **One feature per PR** - Keep PRs focused and reviewable
2. **Update documentation** - Include relevant README or comment updates
3. **Test your changes** - Ensure the app works as expected
4. **Follow existing patterns** - Match the codebase style
5. **Describe your changes** - Explain what and why in the PR description

### Testing Your Changes

Before submitting a PR:

1. Start the development server
```bash
npm run dev
```

2. Test these scenarios:
   - Location search and selection
   - Weather data loading
   - Sun position calculations
   - Camera wizard recommendations
   - Theme switching
   - Mobile responsive design

3. Check browser console for errors

4. Verify no TypeScript errors
```bash
npm run build
```

## Project Architecture

### Frontend Architecture
- **React + TypeScript**: Type-safe component development
- **Wouter**: Lightweight client-side routing
- **TailwindCSS**: Utility-first styling with custom theme
- **TanStack Query**: Server state and caching
- **React Hook Form + Zod**: Type-safe form validation

### Backend Architecture
- **Express**: REST API framework
- **Drizzle ORM**: Type-safe database operations
- **Neon PostgreSQL**: Serverless database
- **Zod**: Runtime type validation

### Data Flow
1. User interacts with React components
2. TanStack Query manages API calls and caching
3. Express backend validates requests with Zod
4. Data stored via Drizzle ORM storage interface
5. Shared types ensure consistency across stack

### Key Design Principles

1. **Type Safety**: TypeScript everywhere, shared schemas
2. **Minimal Files**: Collapse similar components when possible
3. **Frontend First**: Keep logic in frontend, backend for data/APIs
4. **Mobile First**: Design for mobile, enhance for desktop
5. **Accessibility**: Use semantic HTML and ARIA attributes

## Areas for Contribution

### Easy Contributions
- Documentation improvements
- Bug fixes
- UI/UX enhancements
- Additional photography tips in Camera Wizard
- Test coverage improvements

### Medium Contributions
- New weather data integrations
- Enhanced sun position visualizations
- Additional camera setting presets
- Performance optimizations
- Accessibility improvements

### Advanced Contributions
- Database migration implementation
- User authentication system
- Session sharing features
- Photo upload and EXIF integration
- Advanced astronomical calculations
- PWA capabilities

## Development Tips

### Working with Astronomical Calculations
- Sun position calculations in `client/src/lib/sun-calc.ts`
- Uses SunCalc library with timezone corrections
- Test with different locations and times
- Verify against known sunrise/sunset times

### Working with Themes
- Theme system in `client/src/hooks/use-dynamic-theme.tsx`
- Based on sun position at selected location
- Test day/night/twilight transitions
- Ensure dark mode accessibility

### Working with Forms
- Use React Hook Form with Zod resolver
- Schema validation from `shared/schema.ts`
- Include data-testid for form elements
- Handle loading and error states

### Working with APIs
- Backend routes in `server/routes.ts`
- Validate with Zod schemas
- Use storage interface, not direct DB calls
- Return consistent error formats

## Need Help?

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Ask questions in issue discussions
- Tag issues with appropriate labels

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Project documentation where appropriate

Thank you for contributing to LightLog!
