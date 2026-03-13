const WORK_HOURS = 8
const LUNCH_MINUTES = 30
const SHORT_DAY_THRESHOLD_HOURS = 4

export interface LeaveTimeResult {
  leaveTime: Date
  lunchIncluded: boolean
}

/**
 * Given an arrival time string ("HH:MM"), calculate when the user can leave.
 *
 * Rules:
 *  - Work day is always 8 hours.
 *  - 30-minute lunch is added only when the resulting work day is >= 4 hours.
 *    (In practice the day is always >= 4 h, but the rule is enforced.)
 *  - "Work day is >= 4 hours" is determined by checking whether adding 8 h alone
 *    would keep the leave time beyond (arrival + 4 h). Since the work time is fixed
 *    at 8 h, the day is always >= 4 h, so lunch is always included — unless the
 *    arrival itself is configured so that a full 8 h day crosses midnight and the
 *    effective scheduled hours are < 4. For safety we check: scheduled hours >= 4.
 */
export function calculateLeaveTime(arrivalTimeString: string): LeaveTimeResult {
  const [hours, minutes] = arrivalTimeString.split(":").map(Number)

  const arrival = new Date()
  arrival.setHours(hours, minutes, 0, 0)

  // Lunch is included when the scheduled work day is >= 4 hours.
  // Since work time is always 8 h, this is always true in normal usage.
  // The threshold check: if WORK_HOURS >= SHORT_DAY_THRESHOLD_HOURS → include lunch.
  const lunchIncluded = WORK_HOURS >= SHORT_DAY_THRESHOLD_HOURS

  const totalMinutes =
    WORK_HOURS * 60 + (lunchIncluded ? LUNCH_MINUTES : 0)

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

export interface CountdownResult {
  done: boolean
  /** Human-readable remaining time, e.g. "3 t 22 min" (Finnish) or "3 h 22 min" (English) */
  label: string
  /** Total remaining minutes (negative when done) */
  remainingMinutes: number
}

/** Calculate countdown from now to a target Date.
 *  @param leaveTime  The target departure time.
 *  @param units      Localised unit strings, e.g. { hours: "t", minutes: "min" }.
 */
export function getCountdown(
  leaveTime: Date,
  units: { hours: string; minutes: string } = { hours: "h", minutes: "min" }
): CountdownResult {
  const now = new Date()
  const diffMs = leaveTime.getTime() - now.getTime()
  const remainingMinutes = Math.floor(diffMs / 60_000)

  if (remainingMinutes <= 0) {
    return { done: true, label: "", remainingMinutes }
  }

  const h = Math.floor(remainingMinutes / 60)
  const m = remainingMinutes % 60

  const label =
    h > 0 && m > 0
      ? `${h} ${units.hours} ${m} ${units.minutes}`
      : h > 0
        ? `${h} ${units.hours}`
        : `${m} ${units.minutes}`

  return { done: false, label, remainingMinutes }
}
