"use client"
import { useState } from "react"
import { QUESTIONS } from "@/lib/poll-config"

export default function PollPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [q1Other, setQ1Other] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle")

  const choiceQs = QUESTIONS.filter(q => q.type === "choice")
  const allChoicesAnswered = choiceQs.every(q => answers[q.id])

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
        <p style={s.tag}>QUICK POLL · 60 SECONDS</p>
        <h1 style={s.heading}>Let&apos;s hear from you.</h1>
        <p style={s.sub}>Five questions. No login needed.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "1.8rem" }}>
          {QUESTIONS.map((q, qi) => (
            <div key={q.id}>
              <p style={s.qLabel}>
                <span style={s.qNum}>{String(qi + 1).padStart(2, "0")}</span>
                {q.text}
              </p>

              {q.type === "choice" && (
                <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginTop: ".6rem" }}>
                  {q.options!.map(opt => {
                    const selected = answers[q.id] === opt.id
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
                  {q.id === "q1" && answers.q1 === "other" && (
                    <input
                      autoFocus
                      type="text"
                      maxLength={60}
                      placeholder="Which tool? (e.g. Perplexity, Grok…)"
                      value={q1Other}
                      onChange={e => setQ1Other(e.target.value)}
                      style={{ ...s.textarea, marginTop: ".2rem", resize: undefined }}
                    />
                  )}
                </div>
              )}

              {q.type === "text" && (
                <textarea
                  maxLength={q.maxLength}
                  placeholder={q.placeholder}
                  value={answers[q.id] ?? ""}
                  onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                  style={s.textarea}
                  rows={2}
                />
              )}
            </div>
          ))}
        </div>

        {status === "error" && (
          <p style={{ color: "var(--coral)", fontSize: ".85rem", marginTop: "1rem" }}>
            Something went wrong — please try again.
          </p>
        )}

        <button
          onClick={submit}
          disabled={!allChoicesAnswered || status === "submitting"}
          style={{
            ...s.submitBtn,
            opacity: allChoicesAnswered ? 1 : 0.45,
            cursor: allChoicesAnswered ? "pointer" : "not-allowed",
          }}
        >
          {status === "submitting" ? "Sending…" : "Submit →"}
        </button>

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
    padding: "2rem 1rem 4rem",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--rim)",
    borderRadius: 16,
    padding: "clamp(1.5rem,5vw,2.5rem)",
    width: "100%",
    maxWidth: 520,
    margin: "0 auto",
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
  },
  sub: {
    fontSize: ".9rem",
    color: "var(--dim)",
    marginTop: ".4rem",
  },
  qLabel: {
    fontSize: ".95rem",
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
    paddingTop: ".2rem",
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
    marginTop: ".6rem",
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
  submitBtn: {
    marginTop: "1.8rem",
    width: "100%",
    padding: ".85rem",
    background: "var(--coral)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: "1rem",
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
    letterSpacing: ".02em",
  },
}
