"use client"

import { useState, useEffect, useCallback } from "react"
import {
  calculateLeaveTime,
  currentTimeString,
  getCountdown,
  formatTime,
  type CountdownResult,
} from "@/lib/time"
import { loadArrival, saveArrival } from "@/lib/storage"
import { useLocale } from "@/hooks/use-locale"
import { t, type Locale, type Translations } from "@/lib/i18n"

export interface WorkTimerState {
  /** "HH:MM" string bound to the <input type="time"> */
  arrivalTime: string
  /** Formatted leave time string, e.g. "16:45" */
  leaveTimeFormatted: string
  /** Whether 30-min lunch was included in the calculation */
  lunchIncluded: boolean
  /** Live countdown result */
  countdown: CountdownResult
  /** Update arrival time (called on input change) */
  setArrivalTime: (value: string) => void
  /** Active locale */
  locale: Locale
  /** Switch locale */
  setLocale: (l: Locale) => void
  /** All UI strings for the active locale */
  tr: Translations
}

const TICK_INTERVAL_MS = 30_000

export function useWorkTimer(): WorkTimerState {
  const [locale, setLocale] = useLocale()
  const tr = t(locale)

  const [arrivalTime, setArrivalTimeState] = useState<string>(currentTimeString)

  // On mount: hydrate from localStorage (or keep current-time default)
  useEffect(() => {
    const saved = loadArrival()
    if (saved) {
      setArrivalTimeState(saved)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Derive leave time synchronously from arrivalTime
  const { leaveTime, lunchIncluded } = calculateLeaveTime(arrivalTime)
  const leaveTimeFormatted = formatTime(leaveTime)

  const units = { hours: tr.hours, minutes: tr.minutes }

  // Live countdown — recalculated on every tick or locale change
  const [countdown, setCountdown] = useState<CountdownResult>(() =>
    getCountdown(leaveTime, units)
  )

  useEffect(() => {
    const { leaveTime: lt } = calculateLeaveTime(arrivalTime)
    setCountdown(getCountdown(lt, units))

    const id = setInterval(() => {
      const { leaveTime: lt2 } = calculateLeaveTime(arrivalTime)
      setCountdown(getCountdown(lt2, units))
    }, TICK_INTERVAL_MS)

    return () => clearInterval(id)
    // units is derived from locale/arrivalTime — intentionally listed via deps below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalTime, locale])

  const setArrivalTime = useCallback((value: string) => {
    setArrivalTimeState(value)
    saveArrival(value)
  }, [])

  return {
    arrivalTime,
    leaveTimeFormatted,
    lunchIncluded,
    countdown,
    setArrivalTime,
    locale,
    setLocale,
    tr,
  }
}
