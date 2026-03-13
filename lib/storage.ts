const STORAGE_KEY = "gohome_arrival"

interface StoredArrival {
  /** "HH:MM" arrival time string */
  arrivalTime: string
  /** "YYYY-MM-DD" arrival date (may differ from today for late-night shifts) */
  arrivalDate: string
  /** ISO date string (YYYY-MM-DD) of the calendar day the entry was saved */
  savedDate: string
}

/** Returns today's date as "YYYY-MM-DD". */
export function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/**
 * Load the persisted arrival.
 * Returns null if nothing stored, stale (saved on a previous day), or unavailable.
 */
export function loadArrival(): { arrivalTime: string; arrivalDate: string } | null {
  if (typeof window === "undefined") return null

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed: StoredArrival = JSON.parse(raw)

    // Stale entry from a previous calendar day → auto-clear
    if (parsed.savedDate !== todayISO()) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return { arrivalTime: parsed.arrivalTime, arrivalDate: parsed.arrivalDate }
  } catch {
    return null
  }
}

/**
 * Persist the arrival time and date.
 * Safe to call on every keystroke.
 */
export function saveArrival(arrivalTime: string, arrivalDate: string): void {
  if (typeof window === "undefined") return

  try {
    const entry: StoredArrival = { arrivalTime, arrivalDate, savedDate: todayISO() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry))
  } catch {
    // Storage quota exceeded or private mode — silently ignore
  }
}

/** Explicitly clear the stored arrival (e.g. a future "reset" button). */
export function clearArrival(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
