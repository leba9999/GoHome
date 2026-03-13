# GoHome – Requirements

## Overview
GoHome is a mobile-first Progressive Web App (PWA) that answers one question:
> **"What time can I go home?"**

A single user enters the time she arrived at work. The app immediately shows the earliest time she is allowed to leave.

---

## Business Rules

| Rule | Value |
|---|---|
| Required work time | 8 hours |
| Lunch break | 30 minutes, added automatically **only when the work day is ≥ 4 hours** |
| Short day (< 4 h) formula | `leave_time = arrival_time + 8h` |
| Normal day (≥ 4 h) formula | `leave_time = arrival_time + 8h 30min` |

> In practice the user always works a full day, so the normal formula applies. The < 4 h case is a safeguard, not a primary flow.

**Example (normal):** Arrived at 08:15 → can leave at **16:45**.  
**Example (short day):** Arrived at 13:00 and works until < 17:00 → no lunch added, leave at **21:00** (edge case, rarely used).

---

## Functional Requirements

### FR-1 · Arrival time input
- User can enter or pick her arrival time (hours & minutes).
- Input is a native time picker (mobile-friendly, uses the OS keyboard/wheel).
- Defaults to the **current time** when the app opens (common case: she opens it right as she arrives).
- Persists the last-entered arrival time in `localStorage` so it survives page refreshes and reopens during the same day.

### FR-2 · Leave time display
- Immediately calculates and displays the leave time whenever arrival time changes.
- Displayed prominently – large, readable at a glance.
- Shows a **countdown** ("leaves in X h Y min") when the current time is before the leave time.
- Shows **"You can go home!"** (or similar positive message) when the current time has passed the leave time.
- Countdown updates live (every minute is sufficient).
- Visually indicates whether the 30-min lunch was included in the calculation (e.g. a small label "incl. 30 min lunch").

### FR-3 · Day reset
- Persisted arrival time is automatically cleared at midnight (or on the first open of a new calendar day) so the next workday starts fresh.

### FR-4 · No accounts / no backend
- Entirely client-side. No login, no server storage, no API calls.
- All state lives in `localStorage`.

---

## Non-Functional Requirements

### NFR-1 · Mobile-first PWA (installable on Android)
- Includes a `manifest.json` (`app/manifest.ts`) with:
  - `name: "GoHome"`, `short_name: "GoHome"`
  - `display: "standalone"` (hides browser chrome after install)
  - `start_url: "/"`
  - `theme_color` and `background_color` matching the app palette
  - Icons at 192 × 192 and 512 × 512 (sourced from open-licensed icon sets, e.g. [Tabler Icons](https://tabler.io/icons) SVG exported to PNG)
- Uses **`next-pwa`** for zero-config service worker generation and offline support.
- `<meta name="viewport">` with `width=device-width, initial-scale=1` already provided by Next.js.
- Chrome on Android shows "Add to Home Screen" prompt automatically once the above criteria are met.

### NFR-2 · Performance & UX
- Fully usable with one hand on a phone screen.
- Core interaction (set arrival → read leave time) must require ≤ 2 taps.
- No heavy animations that drain battery.

### NFR-3 · Accessibility
- Time input must have a visible label and be operable by screen readers.
- Colour contrast must meet WCAG AA in both light and dark mode.

### NFR-4 · Dark mode
- Supports system-preference dark mode via the existing `ThemeProvider`.
- User can also toggle manually with the `d` hotkey (already wired up).

---

## Out of Scope (v1)
- Multiple users or profiles
- Configurable work hours per day
- Overtime tracking
- Notifications / alarms
- iOS PWA install (secondary concern; works but install UX is worse on Safari)
- History / calendar view
- **Geolocation-based arrival time guestimate** (noted as a v2 idea: use the GPS signal / Work location to auto-detect when she arrives)

---

## Suggested Page Structure

```
app/
  page.tsx          ← single-page app (the whole UI)
  layout.tsx        ← existing, keeps ThemeProvider + PWA meta tags
  manifest.ts       ← Next.js route handler returning the Web App Manifest JSON
public/
  icons/
    icon-192.png    ← generated from a Tabler Icon SVG
    icon-512.png
```

`next-pwa` generates and injects the service worker automatically at build time — no `public/sw.js` to maintain by hand.

---

## Acceptance Criteria (Definition of Done)

- [ ] User can enter an arrival time via a time input; defaults to current time on open.
- [ ] Leave time is displayed immediately and updates on change.
  - Adds 8 h 30 min when the session is ≥ 4 hours (lunch included).
  - Adds 8 h flat when the session would be < 4 hours (no lunch).
- [ ] A label indicates whether lunch was included in the calculation.
- [ ] A live countdown shows time remaining until leave time (updates every minute).
- [ ] "Go home!" state is shown once leave time has passed.
- [ ] Arrival time is persisted across page refreshes (same day).
- [ ] State resets automatically on a new calendar day.
- [ ] App passes Chrome's PWA installability criteria (Lighthouse ≥ PWA badge).
- [ ] App can be installed on an Android device via Chrome → "Add to Home Screen".
- [ ] App works fully offline after first load.
- [ ] UI is usable on a 390 px wide viewport (Pixel 7 / similar Android phone width).
