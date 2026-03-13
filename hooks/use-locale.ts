"use client"

import { useState, useCallback, useEffect } from "react"
import { type Locale, DEFAULT_LOCALE } from "@/lib/i18n"

const STORAGE_KEY = "gohome_locale"

function loadLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "fi" || stored === "en") return stored
  return DEFAULT_LOCALE
}

function saveLocale(locale: Locale): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, locale)
}

export function useLocale(): [Locale, (l: Locale) => void] {
  // Start with default to avoid SSR mismatch; hydrate on mount
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    setLocaleState(loadLocale())
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    saveLocale(l)
  }, [])

  return [locale, setLocale]
}
