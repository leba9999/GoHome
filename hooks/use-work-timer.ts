"use client"

import { useState, useEffect, useCallback } from "react"
import {
  calculateLeaveTime,
  currentTimeString,
  currentDateString,
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
  /** "YYYY-MM-DD" string bound to the <input type="date"> */
  arrivalDate: string
  /** Formatted leave time string, e.g. "16:45" */
  leaveTimeFormatted: string
  /** Whether 30-min lunch was included in the calculation */
  lunchIncluded: boolean
  /** Live countdown result */
  countdown: CountdownResult
  /** Update arrival time (called on input change) */
  setArrivalTime: (value: string) => void
  /** Update arrival date (called on date-input change) */
  setArrivalDate: (value: string) => void
  /** Active locale */
  locale: Locale
  /** Switch locale */
  setLocale: (l: Locale) => void
  /** All UI strings for the active locale */
  tr: Translations
}

const TICK_INTERVAL_MS = 1_000

export function useWorkTimer(): WorkTimerState {
  const [locale, setLocale] = useLocale()
  const tr = t(locale)

  const [arrivalTime, setArrivalTimeState] = useState<string>(currentTimeString)
  const [arrivalDate, setArrivalDateState] = useState<string>(currentDateString)

  // On mount: hydrate from localStorage (or keep current-time/date defaults)
  useEffect(() => {
    const saved = loadArrival()
    if (saved) {
      setArrivalTimeState(saved.arrivalTime)
      setArrivalDateState(saved.arrivalDate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Derive leave time synchronously from arrivalTime + arrivalDate
  const { leaveTime, lunchIncluded } = calculateLeaveTime(arrivalTime, arrivalDate)
  const leaveTimeFormatted = formatTime(leaveTime)

  const units = { hours: tr.hours, minutes: tr.minutes, seconds: tr.seconds }

  // Live countdown — recalculated every second or on locale/arrival change
  const [countdown, setCountdown] = useState<CountdownResult>(() =>
    getCountdown(leaveTime, units)
  )

  useEffect(() => {
    const { leaveTime: lt } = calculateLeaveTime(arrivalTime, arrivalDate)
    setCountdown(getCountdown(lt, units))

    const id = setInterval(() => {
      const { leaveTime: lt2 } = calculateLeaveTime(arrivalTime, arrivalDate)
      setCountdown(getCountdown(lt2, { hours: tr.hours, minutes: tr.minutes, seconds: tr.seconds }))
    }, TICK_INTERVAL_MS)

    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalTime, arrivalDate, locale])

  const setArrivalTime = useCallback(
    (value: string) => {
      setArrivalTimeState(value)
      saveArrival(value, arrivalDate)
    },
    [arrivalDate]
  )

  const setArrivalDate = useCallback(
    (value: string) => {
      setArrivalDateState(value)
      saveArrival(arrivalTime, value)
    },
    [arrivalTime]
  )

  return {
    arrivalTime,
    arrivalDate,
    leaveTimeFormatted,
    lunchIncluded,
    countdown,
    setArrivalTime,
    setArrivalDate,
    locale,
    setLocale,
    tr,
  }
}
