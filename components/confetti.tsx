"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

/** Fires a one-shot confetti burst when first mounted. Renders nothing. */
export function Confetti() {
  useEffect(() => {
    confetti({
      particleCount: 160,
      spread: 80,
      origin: { y: 0.6 },
    })
  }, [])

  return null
}
