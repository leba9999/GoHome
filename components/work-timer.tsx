"use client"

import { useRef, useEffect } from "react"
import { IconHome, IconClock, IconSalad, IconCalendar } from "@tabler/icons-react"

import { useWorkTimer } from "@/hooks/use-work-timer"
import { type Translations } from "@/lib/i18n"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Confetti } from "@/components/confetti"
import { cn } from "@/lib/utils"

export function WorkTimer() {
  const {
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
  } = useWorkTimer()

  const timeRef = useRef<HTMLInputElement | null>(null)
  const dateRef = useRef<HTMLInputElement | null>(null)

  function scrollIntoViewSafe(el: HTMLElement | null) {
    if (!el) return
    // wait a tick for native picker to open in some UIs, then center the input
    setTimeout(() => {
      try {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      } catch {
        // fallback: window scroll
        const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" })
      }
    }, 350)
  }

  // Fire confetti only on the first transition into done state
  const firedRef = useRef(false)
  const showConfetti = countdown.done && !firedRef.current
  useEffect(() => {
    if (countdown.done) firedRef.current = true
    if (!countdown.done) firedRef.current = false
  }, [countdown.done])

  return (
  <Card className="w-full max-w-sm mx-auto px-4 sm:px-0">
      <CardHeader>
  <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2">
            <IconHome className="size-5 text-primary" />
            <CardTitle className="text-lg">GoHome</CardTitle>
          </div>
          {/* Language toggle */}
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setLocale(locale === "fi" ? "en" : "fi")}
            aria-label="Toggle language"
            className="font-mono text-xs text-muted-foreground"
          >
            {locale === "fi" ? "EN" : "FI"}
          </Button>
        </div>
        <CardDescription>{tr.appDescription}</CardDescription>
      </CardHeader>

  <CardContent
        className="flex flex-col gap-6 min-w-0 pb-12 sm:pb-8"
        // add extra bottom padding to avoid native picker controls ("Set" button) being
        // obscured on narrow/installed PWAs; include safe-area inset for gesture bars
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 3rem)" }}
      >
        {/* Arrival time input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="arrival-time" className="flex items-center gap-1.5">
            <IconClock className="size-4 text-muted-foreground" />
            {tr.arrivedAt}
          </Label>
          <Input
            id="arrival-time"
            ref={timeRef}
            type="time"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            onFocus={() => scrollIntoViewSafe(timeRef.current)}
            className="w-full text-base tabular-nums"
          />
        </div>

        {/* Arrival date input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="arrival-date" className="flex items-center gap-1.5">
            <IconCalendar className="size-4 text-muted-foreground" />
            {tr.arrivedOn}
          </Label>
          <Input
            id="arrival-date"
            ref={dateRef}
            type="date"
            value={arrivalDate}
            onChange={(e) => setArrivalDate(e.target.value)}
            onFocus={() => scrollIntoViewSafe(dateRef.current)}
            className="w-full text-base tabular-nums"
          />
        </div>

        <Separator />

        {/* Leave time */}
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">{tr.youCanLeaveAt}</p>
          <p className="text-6xl font-bold tabular-nums tracking-tight text-primary">
            {leaveTimeFormatted}
          </p>

          {/* Lunch badge */}
          <div className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <IconSalad className="size-3.5" />
            {lunchIncluded ? tr.lunchIncluded : tr.noLunch}
          </div>
        </div>

        <Separator />

        {/* Countdown / done state */}
        {countdown.done ? (
          <>
            {showConfetti && <Confetti />}
            <DoneState tr={tr} />
          </>
        ) : (
          <CountdownState label={countdown.label} heading={tr.timeRemaining} />
        )}
      </CardContent>
    </Card>
  )
}

function CountdownState({ label, heading }: { label: string; heading: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{heading}</p>
      <p className="text-2xl font-semibold tabular-nums">{label}</p>
    </div>
  )
}

function DoneState({ tr }: { tr: Translations }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl bg-primary/10 px-4 py-5 text-center",
      )}
    >
      <span className="text-3xl">🏠</span>
      <p className="text-lg font-semibold text-primary">{tr.doneHeading}</p>
      <p className="text-sm text-muted-foreground">{tr.doneBody}</p>
    </div>
  )
}
