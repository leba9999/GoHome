"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TimePickerProps = {
  open: boolean
  value: string // "HH:MM"
  onChange: (val: string) => void
  onClose: () => void
}

export default function TimePicker({ open, value, onChange, onClose }: TimePickerProps) {
  const [hour, setHour] = useState<string>("08")
  const [minute, setMinute] = useState<string>("00")

  useEffect(() => {
    if (!value) return
    const [h, m] = value.split(":")
    setHour(h.padStart(2, "0"))
    setMinute(m.padStart(2, "0"))
  }, [value])

  function apply() {
    onChange(`${String(Number(hour)).padStart(2, "0")}:${String(Number(minute)).padStart(2, "0")}`)
    onClose()
  }

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set time</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 items-center justify-center py-3">
          <Select onValueChange={(v) => setHour(v)} defaultValue={hour}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hours.map((h) => (
                <SelectItem key={h} value={h}>{h}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-lg">:</span>
          <Select onValueChange={(v) => setMinute(v)} defaultValue={minute}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={apply}>Set</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
