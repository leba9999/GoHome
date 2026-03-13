# GoHome 🏠

A mobile-first **Progressive Web App** that answers one question: *"Milloin voit lähteä töistä?"* ("When can you leave work?")

Enter your arrival time — GoHome instantly shows the earliest time you can leave, with a live countdown. Installable on Android via Chrome "Add to Home Screen".

---

## Features

- ⏰ **Arrival time input** — defaults to current time on open
- 🧮 **Automatic leave time** — 8 h work + 30 min lunch (lunch omitted for days < 4 h)
- 🔄 **Live countdown** — updates every 30 seconds
- 🏠 **"Go home!" state** — shown once leave time has passed
- 💾 **Persists across refreshes** — arrival time saved in `localStorage`, auto-cleared at midnight
- 🌍 **Finnish / English** — defaults to Finnish, toggle in the top-right corner
- 📱 **PWA** — installable on Android, works fully offline

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + shadcn/ui (`radix-nova`) + Tailwind CSS v4 |
| Icons | Tabler Icons |
| Offline | `next-pwa` (Workbox service worker) |
| Language | TypeScript |

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000  (service worker disabled in dev)
```

## Developer Commands

```bash
npm run dev        # Dev server with Turbopack
npm run build      # Production build with webpack (generates sw.js)
npm run start      # Serve the production build locally
npm run typecheck  # tsc --noEmit
npm run lint       # ESLint
npm run format     # Prettier
```

> **Note:** `npm run build` uses `--webpack` (not Turbopack) because `next-pwa` requires webpack to generate the service worker.

---

## Project Structure

```
app/
  page.tsx          ← Single-page app shell
  layout.tsx        ← ThemeProvider + PWA meta tags
  manifest.ts       ← Web App Manifest (name, icons, display:standalone)
  globals.css       ← Tailwind v4 theme tokens (oklch colours)
components/
  work-timer.tsx    ← Main UI component
  ui/               ← shadcn/ui primitives (do not edit by hand)
hooks/
  use-work-timer.ts ← All timer state, localStorage hydration, locale
  use-locale.ts     ← Locale preference persisted in localStorage
lib/
  time.ts           ← Pure time calculation & formatting functions
  storage.ts        ← localStorage helpers with day-reset logic
  i18n.ts           ← Finnish & English translation dictionary
public/
  icons/            ← PWA icons (192×192, 512×512)
```

---

## Installing on Android

1. Deploy to Vercel (or any HTTPS host): `npx vercel`
2. Open the deployed URL in **Chrome on Android**
3. Tap ⋮ → **"Add to Home Screen"**
4. The app installs with its own icon and runs full-screen, offline

---

## Business Rules

| Scenario | Formula |
|---|---|
| Normal day (≥ 4 h) | `leave = arrival + 8 h 30 min` |
| Short day (< 4 h) | `leave = arrival + 8 h` |
