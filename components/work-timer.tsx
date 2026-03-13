"use client"

import { IconHome, IconClock, IconSalad } from "@tabler/icons-react"

import { useWorkTimer } from "@/hooks/use-work-timer"
import { type Translations } from "@/lib/i18n"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function WorkTimer() {
  const {
    arrivalTime,
    leaveTimeFormatted,
    lunchIncluded,
    countdown,
    setArrivalTime,
    locale,
    setLocale,
    tr,
  } = useWorkTimer()

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
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

      <CardContent className="flex flex-col gap-6">
        {/* Arrival time input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="arrival-time" className="flex items-center gap-1.5">
            <IconClock className="size-4 text-muted-foreground" />
            {tr.arrivedAt}
          </Label>
          <Input
            id="arrival-time"
            type="time"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            className="text-base tabular-nums"
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
          <DoneState tr={tr} />
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
