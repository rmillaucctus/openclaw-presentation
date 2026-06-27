"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import { slides, type Section } from "./slides"

const SECTION_META: Record<Section, { label: string; color: string }> = {
  intro: { label: "Intro · 10 min",    color: "var(--coral)" },
  demo:  { label: "Live Demo · 30 min", color: "var(--teal)"  },
  qa:    { label: "Q&A · 20 min",      color: "var(--amber)" },
}

const DOT_COLOR: Record<Section, string> = {
  intro: "var(--coral)",
  demo:  "var(--teal)",
  qa:    "var(--amber)",
}

const slideVariants = {
  enter: (dir: "right" | "left") => ({
    x: dir === "right" ? "3vw" : "-3vw",
    opacity: 0,
    filter: "blur(10px)",
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
  },
  exit: (dir: "right" | "left") => ({
    x: dir === "right" ? "-3vw" : "3vw",
    opacity: 0,
    filter: "blur(8px)",
    scale: 0.98,
  }),
}

export default function Deck() {
  const [cur, setCur] = useState(() => {
    if (typeof window === "undefined") return 0
    const hash = window.location.hash.replace("#", "")
    const idx = slides.findIndex(s => s.slug === hash)
    return idx >= 0 ? idx : 0
  })
  const [dir, setDir] = useState<"right" | "left">("right")

  const go = useCallback((n: number) => {
    if (n < 0 || n >= slides.length || n === cur) return
    setDir(n > cur ? "right" : "left")
    setCur(n)
    window.location.hash = slides[n].slug
  }, [cur])

  // Set initial hash on mount
  useEffect(() => {
    if (!window.location.hash) window.location.hash = slides[cur].slug
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync with browser back/forward
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      const idx = slides.findIndex(s => s.slug === hash)
      if (idx >= 0 && idx !== cur) {
        setDir(idx > cur ? "right" : "left")
        setCur(idx)
      }
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [cur])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ([" ", "ArrowRight", "ArrowDown"].includes(e.key)) { e.preventDefault(); go(cur + 1) }
      if (["ArrowLeft", "ArrowUp"].includes(e.key))         { e.preventDefault(); go(cur - 1) }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [cur, go])

  const touchX = useRef(0)
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    const dx = touchX.current - e.changedTouches[0].clientX
    if (Math.abs(dx) > 48) go(cur + (dx > 0 ? 1 : -1))
  }

  const { section } = slides[cur]
  const meta = SECTION_META[section]
  const CurrentSlide = slides[cur].component

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "var(--bg)" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, display: "flex", gap: 2, zIndex: 200 }}>
        {slides.map((s, i) => (
          <div
            key={i}
            onClick={() => go(i)}
            style={{
              flex: 1,
              background: i <= cur ? DOT_COLOR[s.section] : "var(--slate)",
              opacity: i <= cur ? 1 : 0.25,
              cursor: "pointer",
              transition: "background .3s, opacity .3s",
            }}
          />
        ))}
      </div>

      {/* Section badge */}
      <div style={{ position: "fixed", top: 18, right: 40, zIndex: 200, fontSize: ".65rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: meta.color, transition: "color .3s" }}>
        {meta.label}
      </div>

      {/* Current slide — AnimatePresence for proper enter + exit */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={cur}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "7vh 9vw" }}
        >
          <CurrentSlide />
        </motion.div>
      </AnimatePresence>

      {/* Prev/Next arrows */}
      {cur > 0 && (
        <button
          onClick={() => go(cur - 1)}
          aria-label="Previous slide"
          style={{ position: "fixed", left: 16, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--rim)", background: "var(--surface)", color: "var(--dim)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 99, fontSize: "1rem", transition: "border-color .2s, color .2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--coral)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--coral)" }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--rim)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--dim)" }}
        >
          ←
        </button>
      )}
      {cur < slides.length - 1 && (
        <button
          onClick={() => go(cur + 1)}
          aria-label="Next slide"
          style={{ position: "fixed", right: 16, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--rim)", background: "var(--surface)", color: "var(--dim)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 99, fontSize: "1rem", transition: "border-color .2s, color .2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--coral)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--coral)" }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--rim)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--dim)" }}
        >
          →
        </button>
      )}

      {/* Dots */}
      <div style={{ position: "fixed", bottom: 24, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6, zIndex: 99 }}>
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === cur ? 18 : 6,
              height: 6,
              borderRadius: 3,
              border: "none",
              background: i === cur ? DOT_COLOR[s.section] : "var(--slate)",
              opacity: i === cur ? 1 : 0.35,
              cursor: "pointer",
              padding: 0,
              transition: "width .25s, background .2s, opacity .2s",
            }}
          />
        ))}
      </div>

      {/* Counter */}
      <div style={{ position: "fixed", bottom: 22, right: 40, fontSize: ".7rem", color: "var(--slate)", fontVariantNumeric: "tabular-nums", zIndex: 99 }}>
        {cur + 1} / {slides.length}
      </div>
    </div>
  )
}
