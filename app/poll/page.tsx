"use client"
import { useState } from "react"
import { QUESTIONS } from "@/lib/poll-config"

export default function PollPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [q1Other, setQ1Other] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle")

  const q = QUESTIONS[step]
  const total = QUESTIONS.length
  const isLast = step === total - 1

  const currentAnswer = answers[q.id] ?? ""
  const canAdvance = q.type === "text" ? true : !!currentAnswer

  async function submit() {
    setStatus("submitting")
    try {
      const payload = { ...answers }
      if (payload.q1 === "other" && q1Other.trim()) payload.q1 = q1Other.trim()
      const res = await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }

  function next() {
    if (isLast) submit()
    else setStep(s => s + 1)
  }

  if (status === "done") {
    return (
      <main style={s.page}>
        <div style={{ textAlign: "center", paddingTop: "6rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--bright)", marginBottom: ".5rem" }}>Thanks!</h1>
          <p style={{ color: "var(--dim)", fontSize: "1rem" }}>Your answers are in. See you in a sec.</p>
        </div>
      </main>
    )
  }

  return (
    <main style={s.page}>
      <div style={s.card}>
        {/* Header */}
        <p style={s.tag}>QUICK POLL · 60 SECONDS</p>
        <h1 style={s.heading}>Let&apos;s hear from you.</h1>

        {/* Progress bar */}
        <div style={s.progressTrack}>
          <div style={{ ...s.progressFill, width: `${((step + 1) / total) * 100}%` }} />
        </div>
        <p style={s.progressLabel}>{step + 1} of {total}</p>

        {/* Question */}
        <div style={{ marginTop: "1.6rem" }}>
          <p style={s.qLabel}>
            <span style={s.qNum}>{String(step + 1).padStart(2, "0")}</span>
            {q.text}
          </p>

          {q.type === "choice" && (
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginTop: ".8rem" }}>
              {q.options!.map(opt => {
                const selected = currentAnswer === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAnswers(a => ({ ...a, [q.id]: opt.id }))}
                    style={{
                      ...s.optBtn,
                      background: selected ? "var(--coral)" : "var(--surface)",
                      color: selected ? "#fff" : "var(--body)",
                      border: `1.5px solid ${selected ? "var(--coral)" : "var(--rim)"}`,
                      fontWeight: selected ? 700 : 400,
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
              {q.id === "q1" && currentAnswer === "other" && (
                <input
                  autoFocus
                  type="text"
                  maxLength={60}
                  placeholder="Which tool? (e.g. Perplexity, Grok…)"
                  value={q1Other}
                  onChange={e => setQ1Other(e.target.value)}
                  style={{ ...s.textarea, marginTop: ".4rem", resize: undefined }}
                />
              )}
            </div>
          )}

          {q.type === "text" && (
            <textarea
              autoFocus
              maxLength={q.maxLength}
              placeholder={q.placeholder}
              value={currentAnswer}
              onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
              style={s.textarea}
              rows={3}
            />
          )}
        </div>

        {status === "error" && (
          <p style={{ color: "var(--coral)", fontSize: ".85rem", marginTop: "1rem" }}>
            Something went wrong — please try again.
          </p>
        )}

        {/* Nav buttons */}
        <div style={s.nav}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={s.backBtn}>
              ← Back
            </button>
          )}
          <button
            onClick={next}
            disabled={!canAdvance || status === "submitting"}
            style={{
              ...s.nextBtn,
              opacity: canAdvance ? 1 : 0.4,
              cursor: canAdvance ? "pointer" : "not-allowed",
              marginLeft: step > 0 ? undefined : "auto",
            }}
          >
            {isLast ? (status === "submitting" ? "Sending…" : "Submit →") : "Next →"}
          </button>
        </div>

        <p style={{ fontSize: ".72rem", color: "var(--slate)", marginTop: "1rem", textAlign: "center" }}>
          Answers are anonymous and shown live on screen.
        </p>
      </div>
    </main>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--rim)",
    borderRadius: 16,
    padding: "clamp(1.5rem,5vw,2.5rem)",
    width: "100%",
    maxWidth: 520,
  },
  tag: {
    fontSize: ".6rem",
    fontWeight: 700,
    letterSpacing: ".16em",
    color: "var(--coral)",
    marginBottom: ".5rem",
  },
  heading: {
    fontSize: "clamp(1.6rem,4vw,2rem)",
    fontWeight: 800,
    color: "var(--bright)",
    lineHeight: 1.1,
    marginBottom: "1.2rem",
  },
  progressTrack: {
    height: 4,
    background: "var(--rim)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "var(--coral)",
    borderRadius: 4,
    transition: "width .25s ease",
  },
  progressLabel: {
    fontSize: ".72rem",
    color: "var(--slate)",
    marginTop: ".4rem",
    textAlign: "right" as const,
  },
  qLabel: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "var(--bright)",
    display: "flex",
    alignItems: "flex-start",
    gap: ".6rem",
    lineHeight: 1.4,
  },
  qNum: {
    fontSize: ".65rem",
    fontWeight: 700,
    color: "var(--coral)",
    letterSpacing: ".1em",
    flexShrink: 0,
    paddingTop: ".25rem",
  },
  optBtn: {
    width: "100%",
    padding: ".7rem 1rem",
    borderRadius: 8,
    cursor: "pointer",
    textAlign: "left",
    fontSize: ".9rem",
    transition: "all .12s",
    fontFamily: "inherit",
  },
  textarea: {
    marginTop: ".8rem",
    width: "100%",
    padding: ".7rem 1rem",
    borderRadius: 8,
    border: "1.5px solid var(--rim)",
    background: "var(--bg)",
    color: "var(--bright)",
    fontSize: ".9rem",
    fontFamily: "inherit",
    resize: "none",
    outline: "none",
    boxSizing: "border-box",
    lineHeight: 1.5,
  },
  nav: {
    display: "flex",
    gap: ".75rem",
    marginTop: "1.8rem",
  },
  backBtn: {
    flex: "0 0 auto",
    padding: ".75rem 1.2rem",
    background: "transparent",
    color: "var(--dim)",
    border: "1.5px solid var(--rim)",
    borderRadius: 8,
    fontSize: ".9rem",
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
  },
  nextBtn: {
    flex: 1,
    padding: ".85rem",
    background: "var(--coral)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: "1rem",
    fontWeight: 700,
    fontFamily: "inherit",
    letterSpacing: ".02em",
  },
}
