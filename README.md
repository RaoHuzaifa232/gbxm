# GBXM

## Overview

GBXM is an Angular 19 application using standalone components, SSR, and a Material-based UI. The app is organized around a main layout shell with feature areas such as Operator Console and Campaigns.

## Tech Stack

- Angular 19 (standalone components, signals-ready)
- Angular Material + CDK
- SSR with @angular/ssr and Express
- SCSS with shared variables

## Project Structure

- src/app/app.config.ts: app-level providers and routing
- src/app/app.routes.ts: lazy feature routes
- src/app/layout: layout shell (header, sidebar, main layout)
- src/app/layout/items: feature screens (operator console, campaigns)
- src/styles: global SCSS utilities and variables

## Styling (SCSS Control and Variables)

Centralized SCSS tokens live in src/styles/\_variables.scss and are consumed via @use in component styles, for example:

```scss
@use '@gbxm/styles/_variables.scss' as *;

.header {
  color: $color-text-strong;
}
```

Global styles and Material theme imports are in src/styles.scss. Keep component styles scoped and use variables for colors, spacing, and typography so design changes remain centralized.

## Signals and Change Detection

- Zoneless change detection is enabled via provideExperimentalZonelessChangeDetection().
- Components use ChangeDetectionStrategy.OnPush for stable, predictable renders.
- Signals are preferred for local state (signal(), computed()) and for component I/O (input(), output()).

If you add new stateful components, use signals instead of RxJS where possible.

## Routing and Code Splitting

Feature areas are lazy-loaded using loadComponent in src/app/app.routes.ts. Keep new feature screens lazy to reduce initial bundle size.

## SSR

SSR is enabled with @angular/ssr and an Express server entry at src/server.ts. To run SSR locally:

```bash
npm run build
npm run serve:ssr:gbxm
```

Then open http://localhost:4000.

## Scripts

```bash
npm run start        # dev server (client only)
npm run build        # production build
npm run serve:ssr:gbxm  # SSR server
npm run test         # unit tests
```

## Development Notes

- Keep Material imports per component (avoid a shared MaterialModule).
- Use NgOptimizedImage for images and supply width/height for layout stability.
- Prefer @for and @if control flow in templates.
