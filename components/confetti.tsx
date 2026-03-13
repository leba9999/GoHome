"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

/** Fires a one-shot confetti burst when first mounted. Renders nothing. */
export function Confetti() {
  useEffect(() => {
    confetti({
      particleCount: 160,
      spread: 180,
      origin: { y: 0.8 },
    })
  }, [])

  return null
}
