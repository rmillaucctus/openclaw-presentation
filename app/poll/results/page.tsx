"use client"
import { useEffect, useState, useCallback } from "react"
import { QUESTIONS } from "@/lib/poll-config"

interface Message { id: string; text: string }

interface ResultsPayload {
  count: number
  q1: Record<string, number>
  q2: Record<string, number>
  q3: Record<string, number>
  q4: string[]
  q5: string[]
  q6: Message[]
}

export default function ResultsPage() {
  const [data, setData] = useState<ResultsPayload | null>(null)
  const [deleting, setDeleting] = useState<Set<string>>(new Set())

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/poll")
      if (res.ok) setData(await res.json())
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 5000)
    return () => clearInterval(id)
  }, [refresh])

  async function deleteMsg(id: string) {
    setDeleting(prev => new Set(prev).add(id))
    await fetch(`/api/poll/${id}`, { method: "DELETE" })
    await refresh()
    setDeleting(prev => { const s = new Set(prev); s.delete(id); return s })
  }

  if (!data) {
    return <div style={s.page}><p style={{ color: "var(--slate)", fontSize: ".9rem" }}>Loading…</p></div>
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <p style={s.tag}>LIVE RESULTS</p>
        <span style={s.count}>{data.count} {data.count === 1 ? "response" : "responses"}</span>
      </div>

      {/* Choice charts */}
      <div style={s.grid3}>
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
                  return (
                    <div key={opt.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".2rem" }}>
                        <span style={s.optLabel}>{opt.label}</span>
                        <span style={s.optPct}>{n > 0 ? `${pct}%` : "—"}</span>
                      </div>
                      <div style={s.barTrack}>
                        <div style={{ ...s.barFill, width: `${Math.round((n / max) * 100)}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Free-text Q4 + Q5 */}
      {(data.q4.length > 0 || data.q5.length > 0) && (
        <div style={s.grid2}>
          {(["q4", "q5"] as const).map(qid => {
            const q = QUESTIONS.find(q => q.id === qid)!
            const answers = data[qid]
            if (!answers.length) return null
            return (
              <div key={qid} style={s.block}>
                <p style={s.qTitle}>{q.text}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: ".4rem", marginTop: ".6rem", maxHeight: 160, overflowY: "auto" }}>
                  {[...answers].reverse().map((a, i) => (
                    <p key={i} style={s.answer}>&ldquo;{a}&rdquo;</p>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Message wall — Q6 */}
      {data.q6.length > 0 && (
        <div style={s.block}>
          <p style={s.qTitle}>
            {QUESTIONS.find(q => q.id === "q6")!.text}
            <span style={{ marginLeft: ".5rem", fontWeight: 400, color: "var(--slate)", fontSize: ".7rem" }}>
              — click × to remove
            </span>
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginTop: ".8rem" }}>
            {[...data.q6].reverse().map(msg => (
              <div key={msg.id} style={s.msgBubble}>
                <span style={s.msgText}>{msg.text}</span>
                <button
                  onClick={() => deleteMsg(msg.id)}
                  disabled={deleting.has(msg.id)}
                  title="Remove"
                  style={s.deleteBtn}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.count === 0 && (
        <p style={{ color: "var(--slate)", fontSize: ".85rem", textAlign: "center", marginTop: "1.5rem" }}>
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
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1rem",
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
  optLabel: { fontSize: ".75rem", color: "var(--body)" },
  optPct:   { fontSize: ".72rem", fontWeight: 700, color: "var(--dim)" },
  barTrack: { height: 6, background: "var(--rim)", borderRadius: 99, overflow: "hidden" },
  barFill:  { height: "100%", background: "var(--coral)", borderRadius: 99, transition: "width .4s ease" },
  answer: {
    fontSize: ".78rem",
    color: "var(--body)",
    background: "var(--bg)",
    borderRadius: 6,
    padding: ".4rem .65rem",
    margin: 0,
    lineHeight: 1.45,
  },
  msgBubble: {
    display: "inline-flex",
    alignItems: "center",
    gap: ".4rem",
    background: "var(--bg)",
    border: "1px solid var(--rim)",
    borderRadius: 999,
    padding: ".35rem .75rem .35rem .9rem",
    maxWidth: "100%",
  },
  msgText: {
    fontSize: ".82rem",
    color: "var(--body)",
    lineHeight: 1.4,
  },
  deleteBtn: {
    flexShrink: 0,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--slate)",
    fontSize: "1rem",
    lineHeight: 1,
    padding: "0 .1rem",
    fontFamily: "inherit",
    transition: "color .1s",
  },
}
