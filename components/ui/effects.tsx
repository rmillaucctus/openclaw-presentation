"use client"
import { motion } from "framer-motion"

/** Subtle dot-grid background, vignette-masked at edges */
export function DotGrid() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(14,25,60,0.09) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        maskImage: "radial-gradient(ellipse 92% 88% at 50% 50%, black 25%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 92% 88% at 50% 50%, black 25%, transparent 100%)",
        zIndex: 0,
      }}
    />
  )
}

/** Coral spotlight glow for the cover slide — fades in on mount */
export function CoverGlow() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, ease: "easeOut" }}
      style={{
        position: "absolute",
        top: "-20%",
        right: "-10%",
        width: "70%",
        height: "80%",
        background:
          "radial-gradient(ellipse at 60% 28%, rgba(232,54,62,0.14) 0%, rgba(232,54,62,0.05) 45%, transparent 72%)",
        pointerEvents: "none",
        filter: "blur(1px)",
        zIndex: 0,
      }}
    />
  )
}

/** Animated aurora orbs — used on Q&A break slides */
export function Aurora({ color = "amber" }: { color?: "coral" | "teal" | "amber" }) {
  const palette: Record<string, { a: string; b: string }> = {
    coral: { a: "rgba(255,74,82,0.2)", b: "rgba(255,74,82,0.08)" },
    teal: { a: "rgba(0,212,190,0.16)", b: "rgba(0,212,190,0.07)" },
    amber: { a: "rgba(245,166,35,0.2)", b: "rgba(245,166,35,0.09)" },
  }
  const { a, b } = palette[color]
  return (
    <div
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}
    >
      <motion.div
        animate={{ x: [0, 75, -45, 0], y: [0, -52, 38, 0], scale: [1, 1.14, 0.91, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-8%",
          left: "18%",
          width: "58%",
          height: "58%",
          background: `radial-gradient(circle, ${a} 0%, transparent 72%)`,
          filter: "blur(52px)",
        }}
      />
      <motion.div
        animate={{ x: [0, -52, 36, 0], y: [0, 48, -28, 0], scale: [1, 0.88, 1.16, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{
          position: "absolute",
          bottom: "4%",
          right: "12%",
          width: "50%",
          height: "52%",
          background: `radial-gradient(circle, ${b} 0%, transparent 72%)`,
          filter: "blur(60px)",
        }}
      />
    </div>
  )
}

/** Sweeping diagonal beam lines — used on the demo intro slide */
export function BeamsBg() {
  return (
    <div
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: `${-12 + i * 16}%`,
            top: "-10%",
            width: "1px",
            height: "130%",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(0,212,190,0.08) 50%, transparent 100%)",
            transform: "rotate(14deg)",
            transformOrigin: "top left",
          }}
          animate={{ opacity: [0, 0.75, 0] }}
          transition={{
            duration: 2.8,
            delay: i * 0.38,
            repeat: Infinity,
            repeatDelay: 2.8,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
