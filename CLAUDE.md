# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## IMPORTANT: Docs-First Rule

**Before writing any code**, always check the `/docs` directory for a relevant guide. If a matching doc exists, read it first and follow its conventions. Do not rely on training data assumptions when a local doc is available.

## Commands

```bash
npm run dev      # start dev server on http://localhost:3000
npm run build    # production build
npm run lint     # run ESLint
```

No test suite is configured yet.

## Stack

- **Next.js 16.2.4** with the App Router (`src/app/`) — this is a recent version; read `node_modules/next/dist/docs/` before making assumptions about APIs
- **React 19.2.4**
- **Tailwind CSS v4** via `@tailwindcss/postcss` — v4 config differs from v3 (no `tailwind.config.js`; configuration lives in CSS)
- **TypeScript**

## Architecture

This is a fresh Next.js App Router project. All routes live under `src/app/`. The root layout (`src/app/layout.tsx`) wraps the full app with Geist fonts and a flex column body. There are no additional routes, components, or data layers yet — the project is a blank canvas for a lifting diary app.
