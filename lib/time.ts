const WORK_HOURS = 8
const LUNCH_MINUTES = 30
const SHORT_DAY_THRESHOLD_HOURS = 4

export interface LeaveTimeResult {
  leaveTime: Date
  lunchIncluded: boolean
}

/**
 * Given an arrival time string ("HH:MM") and an explicit arrival date string
 * ("YYYY-MM-DD"), calculate when the user can leave.
 *
 * Accepting the date separately fixes the midnight-crossing bug: if she arrives
 * at 22:00 on Monday, leaveTime falls on Tuesday — without an explicit date the
 * old code set the date to today, which is wrong when today IS Tuesday.
 *
 * Rules:
 *  - Work day is always 8 hours.
 *  - 30-minute lunch is added only when WORK_HOURS >= SHORT_DAY_THRESHOLD_HOURS.
 */
export function calculateLeaveTime(
  arrivalTimeString: string,
  arrivalDateString: string,
): LeaveTimeResult {
  const [hours, minutes] = arrivalTimeString.split(":").map(Number)
  const [year, month, day] = arrivalDateString.split("-").map(Number)

  const arrival = new Date(year, month - 1, day, hours, minutes, 0, 0)

  const lunchIncluded = WORK_HOURS >= SHORT_DAY_THRESHOLD_HOURS
  const totalMinutes = WORK_HOURS * 60 + (lunchIncluded ? LUNCH_MINUTES : 0)
  const leaveTime = new Date(arrival.getTime() + totalMinutes * 60 * 1000)

  return { leaveTime, lunchIncluded }
}

/** Format a Date as "HH:MM" (24-hour). */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

/** Return the current time as an "HH:MM" string suitable for <input type="time">. */
export function currentTimeString(): string {
  const now = new Date()
  const hh = String(now.getHours()).padStart(2, "0")
  const mm = String(now.getMinutes()).padStart(2, "0")
  return `${hh}:${mm}`
}

/** Return today's date as "YYYY-MM-DD" suitable for <input type="date">. */
export function currentDateString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export interface CountdownResult {
  done: boolean
  /** Human-readable remaining time e.g. "3 t 22 min 10 s" */
  label: string
  /** Total remaining seconds (negative when done) */
  remainingSeconds: number
}

/** Calculate countdown from now to a target Date, with second precision.
 *  @param leaveTime  The target departure time.
 *  @param units      Localised unit strings.
 */
export function getCountdown(
  leaveTime: Date,
  units: { hours: string; minutes: string; seconds: string } = {
    hours: "h",
    minutes: "min",
    seconds: "s",
  },
): CountdownResult {
  const now = new Date()
  const diffMs = leaveTime.getTime() - now.getTime()
  const remainingSeconds = Math.floor(diffMs / 1_000)

  if (remainingSeconds <= 0) {
    return { done: true, label: "", remainingSeconds }
  }

  const h = Math.floor(remainingSeconds / 3600)
  const m = Math.floor((remainingSeconds % 3600) / 60)
  const s = remainingSeconds % 60

  const parts: string[] = []
  if (h > 0) parts.push(`${h} ${units.hours}`)
  if (m > 0 || h > 0) parts.push(`${m} ${units.minutes}`)
  parts.push(`${s} ${units.seconds}`)

  return { done: false, label: parts.join(" "), remainingSeconds }
}
