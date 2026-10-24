# Changelog

All notable changes to LIGHTLOG. Newest first.

## 2026-10-23 — Security: dependency vulnerability fixes

Known advisories (OSV) in lockfiles: **1 critical, 5 high, 9 moderate, 1 low → 1 high, 1 moderate**.

- **`vite` ^6.4.5** + `@vitejs/plugin-react` ^4.7.0 — vite 5 has no patched release for the dev-server path traversal
- `npm audit fix` — `proxy-addr` (critical), `body-parser`, `source-map-js`. Run with `--legacy-peer-deps` because of a pre-existing peer conflict (`date-fns-tz@2` wants `date-fns@2`; the app uses `date-fns@3`)
- Critical/high advisories cleared in: `proxy-addr`, `body-parser`, `source-map-js`, `vite`
- Verified: client `vite build` passes. `npm run typecheck` / server build fail on a pre-existing `tsconfig.server.json` error (TS5096 `allowImportingTsExtensions`), identical before these changes
- Remaining: `zod` (high) — zod 3 has no patched release (fix is zod 4, a breaking migration) — deferred
