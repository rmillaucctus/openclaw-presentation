"use client"
import { useEffect, useState, useCallback } from "react"
import { QUESTIONS } from "@/lib/poll-config"

interface ResultsPayload {
  count: number
  q1: Record<string, number>
  q2: Record<string, number>
  q3: Record<string, number>
  q4: string[]
  q5: string[]
}

export default function ResultsPage() {
  const [data, setData] = useState<ResultsPayload | null>(null)

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch("/api/poll")
      if (res.ok) setData(await res.json())
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    fetch_()
    const id = setInterval(fetch_, 5000)
    return () => clearInterval(id)
  }, [fetch_])

  if (!data) {
    return (
      <div style={s.page}>
        <p style={{ color: "var(--slate)", fontSize: ".9rem" }}>Loading…</p>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <p style={s.tag}>LIVE RESULTS</p>
        <span style={s.count}>{data.count} {data.count === 1 ? "response" : "responses"}</span>
      </div>

      <div style={s.grid}>
        {(["q1", "q2", "q3"] as const).map(qid => {
          const q = QUESTIONS.find(q => q.id === qid)!
          const tally = data[qid]
          const max = Math.max(...Object.values(tally), 1)
          return (
            <div key={qid} style={s.block}>
              <p style={s.qTitle}>{q.text}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: ".45rem", marginTop: ".6rem" }}>
                {q.options!.map(opt => {
                  const n = tally[opt.id] ?? 0
                  const pct = Math.round((n / data.count) * 100) || 0
                  const barW = Math.round((n / max) * 100)
                  return (
                    <div key={opt.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".2rem" }}>
                        <span style={s.optLabel}>{opt.label}</span>
                        <span style={s.optPct}>{n > 0 ? `${pct}%` : "—"}</span>
                      </div>
                      <div style={s.barTrack}>
                        <div style={{ ...s.barFill, width: `${barW}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {(data.q4.length > 0 || data.q5.length > 0) && (
        <div style={s.grid}>
          {(["q4", "q5"] as const).map(qid => {
            const q = QUESTIONS.find(q => q.id === qid)!
            const answers = data[qid]
            if (!answers.length) return null
            return (
              <div key={qid} style={s.block}>
                <p style={s.qTitle}>{q.text}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: ".4rem", marginTop: ".6rem", maxHeight: 180, overflowY: "auto" }}>
                  {answers.slice().reverse().map((a, i) => (
                    <p key={i} style={s.answer}>&ldquo;{a}&rdquo;</p>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {data.count === 0 && (
        <p style={{ color: "var(--slate)", fontSize: ".85rem", textAlign: "center", marginTop: "1rem" }}>
          Waiting for responses… share the link or QR code.
        </p>
      )}
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    padding: "1.4rem 1.6rem 2rem",
    fontFamily: "var(--font-sans, sans-serif)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.2rem",
    borderBottom: "1px solid var(--rim)",
    paddingBottom: ".8rem",
  },
  tag: {
    fontSize: ".6rem",
    fontWeight: 700,
    letterSpacing: ".16em",
    color: "var(--coral)",
    margin: 0,
  },
  count: {
    fontSize: ".78rem",
    fontWeight: 700,
    color: "var(--dim)",
    letterSpacing: ".04em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1rem",
    marginBottom: "1rem",
  },
  block: {
    background: "var(--surface)",
    border: "1px solid var(--rim)",
    borderRadius: 12,
    padding: "1rem 1.1rem",
  },
  qTitle: {
    fontSize: ".8rem",
    fontWeight: 700,
    color: "var(--bright)",
    margin: 0,
    lineHeight: 1.35,
  },
  optLabel: {
    fontSize: ".75rem",
    color: "var(--body)",
  },
  optPct: {
    fontSize: ".72rem",
    fontWeight: 700,
    color: "var(--dim)",
  },
  barTrack: {
    height: 6,
    background: "var(--rim)",
    borderRadius: 99,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    background: "var(--coral)",
    borderRadius: 99,
    transition: "width .4s ease",
  },
  answer: {
    fontSize: ".78rem",
    color: "var(--body)",
    background: "var(--bg)",
    borderRadius: 6,
    padding: ".4rem .65rem",
    margin: 0,
    lineHeight: 1.45,
  },
}
