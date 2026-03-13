const STORAGE_KEY = "gohome_arrival"

interface StoredArrival {
  /** "HH:MM" arrival time string */
  arrivalTime: string
  /** ISO date string (YYYY-MM-DD) of the day the arrival was recorded */
  date: string
}

/** Returns today's date as "YYYY-MM-DD". */
function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/**
 * Load the persisted arrival time.
 * Returns null if:
 *  - nothing is stored yet
 *  - the stored entry is from a previous calendar day (auto-reset)
 *  - localStorage is unavailable (SSR / private browsing)
 */
export function loadArrival(): string | null {
  if (typeof window === "undefined") return null

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed: StoredArrival = JSON.parse(raw)

    // Stale entry from a previous day → ignore it (day reset)
    if (parsed.date !== todayISO()) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return parsed.arrivalTime
  } catch {
    return null
  }
}

/**
 * Persist the arrival time for today.
 * Safe to call on every keystroke — localStorage writes are synchronous & fast.
 */
export function saveArrival(arrivalTime: string): void {
  if (typeof window === "undefined") return

  try {
    const entry: StoredArrival = { arrivalTime, date: todayISO() }
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
