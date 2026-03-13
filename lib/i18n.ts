export type Locale = "fi" | "en"

export const DEFAULT_LOCALE: Locale = "fi"

export interface Translations {
  // App header
  appDescription: string

  // Arrival input
  arrivedAt: string
  arrivedOn: string

  // Leave time section
  youCanLeaveAt: string
  lunchIncluded: string
  noLunch: string

  // Countdown
  timeRemaining: string

  // Done state
  doneHeading: string
  doneBody: string

  // Countdown units (used in time formatting)
  hours: string   // "t" in Finnish, "h" in English
  minutes: string // "min" in both
  seconds: string // "s" in both
}

const fi: Translations = {
  appDescription: "Katso milloin voit lähteä töistä.",

  arrivedAt: "Saapumisaika",
  arrivedOn: "Saapumispäivä",

  youCanLeaveAt: "Voit lähteä klo",
  lunchIncluded: "Sisältää 30 min lounaan",
  noLunch: "Ei lounasta (lyhyt päivä)",

  timeRemaining: "Aikaa jäljellä",

  doneHeading: "Voit lähteä kotiin!",
  doneBody: "Työpäiväsi on ohi. Kotiin siitä mars!",

  hours: "t",
  minutes: "min",
  seconds: "s",
}

const en: Translations = {
  appDescription: "Know exactly when you can leave work.",

  arrivedAt: "Arrived at",
  arrivedOn: "Arrived on",

  youCanLeaveAt: "You can leave at",
  lunchIncluded: "Includes 30 min lunch",
  noLunch: "No lunch (short day)",

  timeRemaining: "Time remaining",

  doneHeading: "You can go home!",
  doneBody: "Your work day is complete. Time to leave!",

  hours: "h",
  minutes: "min",
  seconds: "s",
}

export const translations: Record<Locale, Translations> = { fi, en }

/** Returns the translation object for the given locale. */
export function t(locale: Locale): Translations {
  return translations[locale]
}
