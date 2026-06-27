import { NextResponse } from "next/server"
import { pushSubmission, allSubmissions } from "@/lib/kv"
import { QUESTIONS } from "@/lib/poll-config"
import type { Submission } from "@/lib/poll-config"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    for (const q of QUESTIONS.filter(q => q.type === "choice")) {
      if (!body[q.id] || typeof body[q.id] !== "string") {
        return NextResponse.json({ error: `Missing answer for ${q.id}` }, { status: 400 })
      }
    }

    const sub: Submission = {
      id: crypto.randomUUID(),
      ts: Date.now(),
      q1: String(body.q1 ?? "").slice(0, 40),
      q2: String(body.q2 ?? "").slice(0, 40),
      q3: String(body.q3 ?? "").slice(0, 40),
      q4: String(body.q4 ?? "").slice(0, 120),
      q5: String(body.q5 ?? "").slice(0, 120),
      q6: String(body.q6 ?? "").slice(0, 200),
    }

    await pushSubmission(sub)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function GET() {
  const subs = await allSubmissions()
  const count = subs.length

  function tally(qid: "q1" | "q2" | "q3") {
    const counts: Record<string, number> = {}
    for (const s of subs) {
      const v = s[qid]
      counts[v] = (counts[v] ?? 0) + 1
    }
    return counts
  }

  return NextResponse.json({
    count,
    q1: tally("q1"),
    q2: tally("q2"),
    q3: tally("q3"),
    q4: subs.map(s => s.q4).filter(Boolean).slice(0, 30),
    q5: subs.map(s => s.q5).filter(Boolean).slice(0, 30),
    q6: subs
      .filter(s => s.q6?.trim())
      .map(s => ({ id: s.id, text: s.q6 }))
      .slice(0, 50),
  })
}
