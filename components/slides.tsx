"use client"
import { useState } from "react"
import { motion } from "motion/react"
import QRCode from "react-qr-code"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { DotGrid, CoverGlow, Aurora, BeamsBg } from "./ui/effects"

export type Section = "intro" | "demo" | "qa"
export interface Slide { section: Section; component: React.FC; slug: string }

/* ─────────────────────────────────────────────
   STAGGER HELPERS (Magic UI / Motion pattern)
───────────────────────────────────────────────── */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const fadeItem = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

const SlideSec = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <motion.div variants={container} initial="hidden" animate="show" style={style}>
    {children}
  </motion.div>
)

const FI = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <motion.div variants={fadeItem} style={style}>
    {children}
  </motion.div>
)

/* ─────────────────────────────────────────────
   DESIGN TOKENS (inline-style only — no Tailwind)
───────────────────────────────────────────────── */

const H1 = ({ children, gradient }: { children: React.ReactNode; gradient?: boolean }) =>
  gradient ? (
    <h1 style={{
      fontSize: "clamp(3rem,7vw,5.5rem)", fontWeight: 900, lineHeight: 1.0,
      letterSpacing: "-.04em", textWrap: "balance" as never,
      background: "linear-gradient(118deg, var(--bright) 20%, #ff8a8e 100%)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    }}>{children}</h1>
  ) : (
    <h1 style={{ fontSize: "clamp(3rem,7vw,5.5rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-.04em", color: "var(--bright)", textWrap: "balance" as never }}>
      {children}
    </h1>
  )

const H2 = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <h2 style={{ fontSize: "clamp(2rem,4.5vw,3.6rem)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-.03em", color: "var(--bright)", textWrap: "balance" as never, ...style }}>
    {children}
  </h2>
)

const Label = ({ children, color = "slate" }: { children: React.ReactNode; color?: string }) => (
  <p style={{ fontSize: ".6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".18em", color: `var(--${color})`, marginBottom: ".5rem" }}>
    {children}
  </p>
)

const Lead = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: "clamp(.95rem,1.7vw,1.2rem)", color: "var(--dim)", maxWidth: "52ch", marginTop: "1rem", lineHeight: 1.65 }}>
    {children}
  </p>
)

const Divider = () => (
  <div style={{ height: 1, background: "var(--rim)" }} />
)

const GradientPanel = ({ children, accent = "coral" }: { children: React.ReactNode; accent?: "coral" | "teal" }) => {
  const rgb = accent === "coral" ? "255,74,82" : "0,212,190"
  return (
    <div style={{
      background: "var(--surface)",
      backgroundImage: `radial-gradient(ellipse 65% 55% at 15% 20%, rgba(${rgb},.11) 0%, transparent 70%)`,
      border: `1px solid rgba(${rgb},.2)`,
      borderRadius: 14,
      padding: "1.8rem 2rem",
    }}>
      {children}
    </div>
  )
}

const FeatureRow = ({ label, desc, color = "coral" }: { label: string; desc: React.ReactNode; color?: string }) => (
  <div style={{ paddingTop: ".75rem", marginBottom: ".1rem" }}>
    <p style={{ fontSize: ".58rem", textTransform: "uppercase", letterSpacing: ".16em", color: `var(--${color})`, fontWeight: 700, marginBottom: ".3rem" }}>{label}</p>
    <p style={{ fontSize: "clamp(.82rem,1.3vw,.94rem)", color: "var(--body)", lineHeight: 1.6, marginBottom: ".75rem" }}>{desc}</p>
    <Divider />
  </div>
)

const SectionTag = ({ section }: { section: Section }) => {
  const c = { intro: "var(--coral)", demo: "var(--teal)", qa: "var(--amber)" }[section]
  return <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: c }} />
}

const Teal = ({ children }: { children: React.ReactNode }) => <span style={{ color: "var(--teal)" }}>{children}</span>

const Pill = ({ children, color = "coral" }: { children: React.ReactNode; color?: "coral" | "teal" | "amber" | "dim" }) => {
  const s: Record<string, React.CSSProperties> = {
    coral: { background: "rgba(255,74,82,.13)", color: "var(--coral)" },
    teal:  { background: "rgba(0,212,190,.11)", color: "var(--teal)" },
    amber: { background: "rgba(245,166,35,.13)", color: "var(--amber)" },
    dim:   { background: "rgba(107,120,152,.15)", color: "var(--dim)" },
  }
  return (
    <span style={{ display: "inline-block", padding: ".18em .75em", borderRadius: 999, fontSize: ".63rem", fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", ...s[color] }}>
      {children}
    </span>
  )
}

const StepNum = ({ n, color = "coral" }: { n: number; color?: "coral" | "teal" }) => (
  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "1.8rem", height: "1.8rem", borderRadius: "50%", background: color === "teal" ? "var(--teal)" : "var(--coral)", color: color === "teal" ? "var(--bg)" : "#fff", fontSize: ".68rem", fontWeight: 700, flexShrink: 0 }}>
    {n}
  </div>
)

const Cmd = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", alignItems: "center", gap: ".7rem", background: "var(--surface)", border: "1px solid var(--rim)", borderRadius: 8, padding: ".8rem 1.3rem", fontFamily: "var(--font-mono),'SF Mono',ui-monospace,monospace", fontSize: "clamp(.75rem,1.3vw,.93rem)", color: "var(--bright)" }}>
    <span style={{ color: "var(--slate)", userSelect: "none" }}>$</span>
    {children}
  </div>
)

const GlowC = () => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 50% at 85% 50%, rgba(255,74,82,.07) 0%, transparent 68%)" }} />
)
const GlowT = () => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 50% 45% at 15% 55%, rgba(0,212,190,.06) 0%, transparent 65%)" }} />
)

/* ══════════════════════════════════════════════
   INTRO SLIDES
══════════════════════════════════════════════ */

function CoverSlide() {
  return (
    <>
      <CoverGlow />
      <DotGrid />
      <SectionTag section="intro" />
      <SlideSec style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "4vw" }}>
        <FI>
          <Label color="slate">Hackathon Workshop · 1 Hour</Label>
          <H1 gradient>Robert Mill</H1>
          <p style={{ fontSize: "clamp(1rem,1.8vw,1.35rem)", color: "var(--dim)", marginTop: ".6rem", fontWeight: 400, lineHeight: 1.5 }}>
            Founder, MakersLounge · AI Builder
          </p>
          <p style={{ fontSize: "clamp(.9rem,1.5vw,1.1rem)", color: "var(--body)", marginTop: "1rem", lineHeight: 1.65, maxWidth: "44ch" }}>
            I&apos;ve been running OpenClaw in my daily workflow for months. Today I&apos;ll show you exactly how — and help you set one up.
          </p>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginTop: "1.8rem" }}>
            <Pill color="coral">10 min intro</Pill>
            <Pill color="teal">30 min live demo</Pill>
            <Pill color="amber">20 min Q&amp;A</Pill>
          </div>
        </FI>
        <FI>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <img
              src="/Robert-Headshot.png"
              alt="Robert Mill"
              style={{ width: "clamp(8rem,13vw,11rem)", height: "clamp(8rem,13vw,11rem)", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--coral)", boxShadow: "0 0 32px rgba(255,74,82,.28)" }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: ".4rem", alignItems: "center" }}>
              <Pill color="dim">Ivey Business School</Pill>
              <Pill color="dim">🏈 National Champion</Pill>
            </div>
            <a
              href="https://luma.com/makerslounge"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem", textDecoration: "none", marginTop: ".4rem" }}
            >
              <div style={{ background: "#fff", padding: "8px", borderRadius: 8, display: "inline-block" }}>
                <QRCode value="https://luma.com/makerslounge" size={88} />
              </div>
              <p style={{ fontSize: ".58rem", textTransform: "uppercase", letterSpacing: ".14em", color: "var(--slate)", fontWeight: 700 }}>
                MakersLounge
              </p>
            </a>
          </div>
        </FI>
      </SlideSec>
    </>
  )
}

function AboutSlide() {
  const projects = [
    { name: "Lighten AI Agents", desc: "AI agent support platform" },
    { name: "Deep Research Agent", desc: "Demonstrated at Shopify" },
    { name: "Daygo.live", desc: "AI journaling with vector store" },
    { name: "Marble", desc: "AI-powered web & app builder" },
    { name: "Marketstep", desc: "LLM-driven financial analysis" },
  ]
  return (
    <>
      <DotGrid />
      <SectionTag section="intro" />
      <SlideSec style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6vw", alignItems: "start" }}>
        <FI>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <img
              src="/Robert-Headshot.png"
              alt="Robert Mill"
              style={{ width: "clamp(3.2rem,5.5vw,4.5rem)", height: "clamp(3.2rem,5.5vw,4.5rem)", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--coral)", flexShrink: 0 }}
            />
            <div>
              <Label>Who I am</Label>
              <Divider />
            </div>
          </div>
          <H2>Builder. Founder.<br />AI tinkerer.</H2>
          <p style={{ marginTop: "1.1rem", fontSize: "clamp(.88rem,1.4vw,1rem)", color: "var(--body)", lineHeight: 1.7, maxWidth: "38ch" }}>
            I run <strong style={{ color: "var(--bright)" }}>MakersLounge</strong> — a community for people who build things. Studying at <strong style={{ color: "var(--bright)" }}>Ivey Business School</strong> (Dean&apos;s List). Spent the last few years building AI tools that get used.
          </p>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginTop: "1.2rem" }}>
            <Pill color="dim">Young Entrepreneur of the Year 2017</Pill>
            <Pill color="dim">🏈 National Football Champion</Pill>
          </div>
        </FI>
        <FI>
          <Label>Things I&apos;ve shipped with AI</Label>
          <Divider />
          {projects.map((p, i) => (
            <div key={p.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".7rem 0" }}>
                <span style={{ color: "var(--bright)", fontSize: ".92rem", fontWeight: 600 }}>{p.name}</span>
                <span style={{ color: "var(--slate)", fontSize: ".78rem" }}>{p.desc}</span>
              </div>
              {i < projects.length - 1 && <Divider />}
            </div>
          ))}
        </FI>
      </SlideSec>
    </>
  )
}

function WhyOpenClawSlide() {
  const [active, setActive] = useState(0)

  const items = [
    {
      label: "Project Management",
      heading: "My whole project\nstack, from my phone.",
      features: [
        { label: "What I send", desc: "Task lists, blockers, priority questions — between meetings, from my phone." },
        { label: "What comes back", desc: "Prioritized breakdown, time estimates, next steps — formatted for mobile reading." },
        { label: "Why it works", desc: "My phone is always open. My laptop doesn't need to be." },
      ],
    },
    {
      label: "Research",
      heading: "Briefings while I'm\naway from my desk.",
      features: [
        { label: "What I send", desc: "A topic, a competitor, a question. Two sentences max." },
        { label: "What comes back", desc: "Structured briefing with key numbers, trends, and my preferred format." },
        { label: "Why it works", desc: "Send it, do something else, read the result 10 minutes later." },
      ],
    },
    {
      label: "Coding & Writing",
      heading: "Unblock myself\nwithout context-switching.",
      features: [
        { label: "What I send", desc: "An error message, a question, a draft. Paste it into Telegram." },
        { label: "What comes back", desc: "A fix, an explanation, or a rewrite. No browser tab required." },
        { label: "Why it works", desc: "It remembers my stack. I don't re-explain context every time." },
      ],
    },
  ]

  const cur = items[active]

  return (
    <>
      <GlowC />
      <DotGrid />
      <SectionTag section="intro" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <BlurFade delay={0.05}>
          <Label>My daily workflow</Label>
        </BlurFade>
        <div style={{ display: "grid", gridTemplateColumns: "190px 1fr", gap: "3.5rem", marginTop: "1rem" }}>
          <BlurFade delay={0.12}>
            <div>
              <Divider />
              {items.map((item, i) => (
                <div key={item.label} onClick={() => setActive(i)} style={{ cursor: "pointer" }}>
                  <p style={{ padding: ".65rem 0", fontSize: ".88rem", fontWeight: i === active ? 700 : 400, color: i === active ? "var(--bright)" : "var(--slate)", transition: "color .2s" }}>
                    {item.label}
                  </p>
                  <Divider />
                </div>
              ))}
            </div>
          </BlurFade>
          {/* key re-triggers fade when user switches tab */}
          <BlurFade key={active} delay={0}>
            <GradientPanel accent="coral">
              <h3 style={{ fontSize: "clamp(1.5rem,3vw,2.4rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-.03em", color: "var(--bright)", whiteSpace: "pre-line", textWrap: "balance" as never, marginBottom: "1.4rem" }}>
                {cur.heading}
              </h3>
              {cur.features.map(f => (
                <FeatureRow key={f.label} label={f.label} desc={f.desc} />
              ))}
            </GradientPanel>
          </BlurFade>
        </div>
      </div>
    </>
  )
}

function ProblemSlide() {
  return (
    <>
      <DotGrid />
      <SectionTag section="intro" />
      <SlideSec style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5vw", alignItems: "start" }}>
        <FI>
          <Label>The problem</Label>
          <Divider />
          <H2 style={{ marginTop: "1rem" }}>AI is stuck<br />in browser tabs.</H2>
          <p style={{ marginTop: "1rem", fontSize: "clamp(.9rem,1.5vw,1.05rem)", color: "var(--dim)", lineHeight: 1.7, maxWidth: "38ch" }}>
            You have to go to it. Context resets every session. Every tool is an island.
          </p>
        </FI>
        <FI>
          <Label>What should happen instead</Label>
          <Divider />
          <FeatureRow label="You're already on Telegram" desc="And WhatsApp. And Discord. Why context-switch to another browser tab?" />
          <FeatureRow label="Agents should come to you" desc="A message costs nothing to send. A tab switch costs 20 minutes of focus." />
          <div style={{ marginTop: ".75rem" }}>
            <p style={{ color: "var(--teal)", fontWeight: 700, fontSize: "clamp(.9rem,1.5vw,1.05rem)", lineHeight: 1.5 }}>
              OpenClaw puts the agent in the app you&apos;re already using.
            </p>
          </div>
        </FI>
      </SlideSec>
    </>
  )
}

function WhatIsSlide() {
  return (
    <>
      <GlowT />
      <DotGrid />
      <SectionTag section="intro" />
      <SlideSec style={{ position: "relative", zIndex: 1 }}>
        <FI>
          <Label color="teal">What is OpenClaw?</Label>
          <Divider />
          <H2 style={{ marginTop: "1rem", marginBottom: "2rem" }}>One gateway.<br />Every chat app. Any AI.</H2>
        </FI>
        <FI>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div className="card-hover" style={{ background: "var(--surface)", border: "1px solid var(--rim)", borderRadius: 10, padding: ".9rem 1.4rem", textAlign: "center" }}>
              <p style={{ fontSize: ".57rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--slate)", marginBottom: ".3rem" }}>You send from</p>
              <p style={{ fontSize: ".9rem", fontWeight: 700, color: "var(--bright)", whiteSpace: "pre-line", lineHeight: 1.4 }}>{"💬 Telegram · WhatsApp\nDiscord · Slack · iMessage"}</p>
            </div>
            <span style={{ color: "var(--slate)", fontSize: "1.1rem" }}>→</span>
            <div className="card-hover" style={{ background: "rgba(255,74,82,.07)", border: "1px solid var(--coral)", borderRadius: 10, padding: ".9rem 1.4rem", textAlign: "center" }}>
              <p style={{ fontSize: ".57rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--slate)", marginBottom: ".3rem" }}>Routes through</p>
              <p style={{ fontSize: ".9rem", fontWeight: 700, color: "var(--bright)" }}>🦞 Gateway</p>
              <p style={{ fontSize: ".72rem", color: "var(--dim)" }}>runs on your laptop</p>
            </div>
            <span style={{ color: "var(--slate)", fontSize: "1.1rem" }}>→</span>
            <div className="card-hover" style={{ background: "var(--surface)", border: "1px solid var(--rim)", borderRadius: 10, padding: ".9rem 1.4rem", textAlign: "center" }}>
              <p style={{ fontSize: ".57rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--slate)", marginBottom: ".3rem" }}>AI processes</p>
              <p style={{ fontSize: ".9rem", fontWeight: 700, color: "var(--bright)" }}>🤖 Your Agent</p>
              <p style={{ fontSize: ".72rem", color: "var(--dim)" }}>Gemini · Claude · GPT · Ollama</p>
            </div>
            <span style={{ color: "var(--slate)", fontSize: "1.1rem" }}>→</span>
            <div className="card-hover" style={{ background: "var(--surface)", border: "1px solid var(--rim)", borderRadius: 10, padding: ".9rem 1.4rem", textAlign: "center" }}>
              <p style={{ fontSize: ".57rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--slate)", marginBottom: ".3rem" }}>You receive</p>
              <p style={{ fontSize: ".9rem", fontWeight: 700, color: "var(--bright)" }}>✅ Reply</p>
            </div>
          </div>
        </FI>
        <FI>
          <div style={{ display: "flex", gap: "2.5rem", marginTop: "1.8rem" }}>
            <div><Pill color="coral">Self-hosted</Pill><p style={{ fontSize: ".8rem", color: "var(--dim)", marginTop: ".35rem" }}>Runs on your machine.</p></div>
            <div><Pill color="teal">Open source</Pill><p style={{ fontSize: ".8rem", color: "var(--dim)", marginTop: ".35rem" }}>MIT licensed.</p></div>
            <div><Pill color="coral">Multi-channel</Pill><p style={{ fontSize: ".8rem", color: "var(--dim)", marginTop: ".35rem" }}>One gateway, all apps.</p></div>
          </div>
        </FI>
      </SlideSec>
    </>
  )
}

function InstallSlide() {
  const steps = [
    { n: 1, cmd: <span>curl -fsSL https://openclaw.ai/install.sh | bash</span> },
    { n: 2, cmd: <>openclaw onboard <Teal>--install-daemon</Teal></> },
    { n: 3, cmd: <>openclaw dashboard</> },
  ]
  return (
    <>
      <DotGrid />
      <SectionTag section="intro" />
      <SlideSec style={{ position: "relative", zIndex: 1 }}>
        <FI>
          <Label>Setup</Label>
          <Divider />
          <H2 style={{ marginTop: "1rem", marginBottom: "1.8rem" }}>Three commands.<br />Five minutes.</H2>
        </FI>
        <div style={{ display: "flex", flexDirection: "column", gap: ".65rem" }}>
          {steps.map(({ n, cmd }) => (
            <FI key={n}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <StepNum n={n} />
                <Cmd>{cmd}</Cmd>
              </div>
            </FI>
          ))}
        </div>
        <FI>
          <div style={{ marginTop: "1.5rem" }}>
            <Divider />
            <p style={{ marginTop: ".8rem", fontSize: ".82rem", color: "var(--slate)", fontFamily: "var(--font-mono),ui-monospace,monospace" }}>
              Windows: <span style={{ color: "var(--teal)" }}>iwr -useb https://openclaw.ai/install.ps1 | iex</span>
              &nbsp;·&nbsp; Needs Node 22+ &nbsp;·&nbsp; Something wrong? <span style={{ color: "var(--teal)" }}>openclaw doctor</span>
            </p>
          </div>
        </FI>
      </SlideSec>
    </>
  )
}

function ShowcaseSlide() {
  const cards = [
    { icon: "🤖", title: "14-agent orchestration", desc: "One Claude orchestrator, 14 Codex workers, one gateway. Real parallel pipelines from a chat message." },
    { icon: "🛒", title: "Grocery autopilot", desc: "Meal plan → delivery slot → confirm. No API — browser control. Every Sunday, automatically." },
    { icon: "🖨️", title: "3D printer control", desc: "Live status, camera snapshot, ETA — from a single text message to the bot." },
  ]
  return (
    <>
      <DotGrid />
      <SectionTag section="intro" />
      <SlideSec style={{ position: "relative", zIndex: 1 }}>
        <FI>
          <Label>Built with OpenClaw</Label>
          <H2 style={{ marginBottom: "1.4rem" }}>Real things the<br />community shipped.</H2>
        </FI>
        <FI>
          {/* Featured card — BorderBeam animated highlight */}
          <div style={{ position: "relative", overflow: "hidden", background: "var(--surface)", backgroundImage: "radial-gradient(ellipse 55% 70% at 5% 50%, rgba(255,74,82,.09) 0%, transparent 70%)", border: "1px solid var(--rim)", borderRadius: 12, padding: "1.1rem 1.5rem", display: "flex", gap: "1.5rem", alignItems: "center", marginBottom: ".65rem" }}>
            <BorderBeam colorFrom="var(--coral)" colorTo="var(--teal)" size={120} duration={7} />
            <div style={{ fontSize: "2rem" }}>📱</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "var(--bright)", fontWeight: 700, fontSize: "clamp(.95rem,1.6vw,1.1rem)", marginBottom: ".2rem" }}>iOS app via Telegram</p>
              <p style={{ color: "var(--dim)", fontSize: ".83rem", lineHeight: 1.55 }}>Built a full iOS app with maps and voice recording, deployed to TestFlight — entirely over Telegram chat. Never opened a laptop.</p>
            </div>
            <Pill color="coral">Featured</Pill>
          </div>
        </FI>
        <FI>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".65rem" }}>
            {cards.map(p => (
              <div key={p.title} className="card-hover" style={{ background: "var(--surface)", border: "1px solid var(--rim)", borderRadius: 10, padding: ".9rem 1rem" }}>
                <div style={{ fontSize: "1.1rem", marginBottom: ".3rem" }}>{p.icon}</div>
                <p style={{ color: "var(--bright)", fontWeight: 700, fontSize: ".88rem", marginBottom: ".15rem" }}>{p.title}</p>
                <p style={{ color: "var(--dim)", fontSize: ".78rem", lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </FI>
      </SlideSec>
    </>
  )
}

function QABreak1() {
  return (
    <>
      <Aurora color="amber" />
      <div className="scanlines" style={{ position: "absolute", inset: 0, zIndex: 1 }} />
      <SectionTag section="intro" />
      <SlideSec style={{ position: "relative", zIndex: 2 }}>
        <FI><Label color="amber">Q&amp;A Break · 2 min</Label><Divider /></FI>
        <FI><H2 style={{ color: "var(--amber)", marginTop: "1.2rem" }}>Questions so far?</H2></FI>
        <FI><Lead>What would you build if your AI agent lived inside Telegram or WhatsApp?</Lead></FI>
        <FI><p style={{ marginTop: "1.5rem", fontSize: ".85rem", color: "var(--slate)" }}>Coming up: 30 minutes of live building →</p></FI>
      </SlideSec>
    </>
  )
}

/* ══════════════════════════════════════════════
   DEMO SLIDES
══════════════════════════════════════════════ */

function DemoIntroSlide() {
  return (
    <>
      <BeamsBg />
      <DotGrid />
      <SectionTag section="demo" />
      <SlideSec style={{ position: "relative", zIndex: 1, maxWidth: "68%" }}>
        <FI><Label color="teal">Live Demo · 30 min</Label></FI>
        <FI>
          <h2 style={{ fontSize: "clamp(3rem,7vw,5.5rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-.04em", color: "var(--bright)", textWrap: "balance" as never, marginTop: "1.2rem", marginBottom: "1.8rem" }}>
            This is my actual setup.
          </h2>
        </FI>
        <FI><Divider /></FI>
        <FI>
          <p style={{ fontSize: "clamp(1rem,1.7vw,1.2rem)", color: "var(--dim)", lineHeight: 1.65, marginTop: "1rem", maxWidth: "44ch" }}>
            Running on this laptop right now. I&apos;ll show you what I actually use it for every day, then help you get yours running.
          </p>
          <p style={{ marginTop: "1.5rem", fontSize: ".84rem", color: "var(--slate)", fontFamily: "var(--font-mono),ui-monospace,monospace" }}>
            Follow along → <span style={{ color: "var(--teal)" }}>openclaw.ai</span>
          </p>
        </FI>
      </SlideSec>
    </>
  )
}

function Step1Slide() {
  return (
    <>
      <DotGrid />
      <SectionTag section="demo" />
      <SlideSec style={{ position: "relative", zIndex: 1 }}>
        <FI>
          <Label color="teal">Step 1 of 5</Label>
          <Divider />
          <H2 style={{ marginTop: "1rem", marginBottom: "1.5rem" }}>My dashboard —<br />already running.</H2>
        </FI>
        <FI><Cmd>openclaw dashboard</Cmd></FI>
        <FI>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem", background: "var(--surface)", border: "1px solid var(--rim)", borderLeft: "3px solid var(--teal)", borderRadius: 8, padding: "1rem 1.2rem", marginTop: "1.2rem", maxWidth: "44rem" }}>
            <div style={{ fontFamily: "var(--font-mono),ui-monospace,monospace", fontSize: "1.8rem", fontWeight: 700, color: "var(--teal)", lineHeight: 1, flexShrink: 0, opacity: .3 }}>01</div>
            <div>
              <p style={{ color: "var(--bright)", fontWeight: 700, fontSize: "clamp(.9rem,1.4vw,1.05rem)", marginBottom: ".2rem" }}>http://127.0.0.1:18789/ — always on</p>
              <p style={{ color: "var(--dim)", fontSize: ".83rem" }}>The gateway runs as a background service — starts automatically on login. This isn&apos;t a demo environment. This is the same setup I use daily.</p>
            </div>
          </div>
          <p style={{ marginTop: "1.2rem", fontSize: ".85rem", color: "var(--dim)", fontStyle: "italic" }}>Try it now: send a message and watch it reply.</p>
        </FI>
      </SlideSec>
    </>
  )
}

function Step2Slide() {
  const steps = [
    { n: 1, text: <>Open Telegram → search <strong style={{ color: "var(--bright)" }}>@BotFather</strong> → send <code style={{ color: "var(--teal)", fontFamily: "var(--font-mono),ui-monospace,monospace" }}>/newbot</code></> },
    { n: 2, text: <>Give it a name and username → BotFather replies with your <strong style={{ color: "var(--bright)" }}>bot token</strong></> },
    { n: 3, isCmd: true },
    { n: 4, text: <>Paste the token → find your bot in Telegram → send it anything</> },
  ]
  return (
    <>
      <GlowT />
      <DotGrid />
      <SectionTag section="demo" />
      <SlideSec style={{ position: "relative", zIndex: 1 }}>
        <FI>
          <Label color="teal">Step 2 of 5</Label>
          <Divider />
          <H2 style={{ marginTop: "1rem", marginBottom: "1.5rem" }}>Telegram — how<br />I connected mine.</H2>
        </FI>
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", maxWidth: "44rem" }}>
          {steps.map(step => (
            <FI key={step.n}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <StepNum n={step.n} color="teal" />
                {step.isCmd
                  ? <Cmd>openclaw channels add <Teal>--channel telegram</Teal></Cmd>
                  : <p style={{ color: "var(--body)", fontSize: "clamp(.85rem,1.35vw,1rem)", lineHeight: 1.55 }}>{step.text}</p>
                }
              </div>
            </FI>
          ))}
        </div>
        <FI>
          <div style={{ marginTop: "1.3rem" }}>
            <Divider />
            <p style={{ marginTop: ".7rem", fontSize: ".83rem", color: "var(--slate)" }}>Takes 3 minutes. Mine has been connected for months — I&apos;ll text it live right now.</p>
          </div>
        </FI>
      </SlideSec>
    </>
  )
}

function Step3Slide() {
  const examples = [
    { label: "Morning check-in", msg: "What's my priority list today? I've got MakersLounge prep, a VC call at 2pm, and need to unblock the auth bug." },
    { label: "Coding help", msg: "My Supabase RLS policy is blocking reads for authenticated users. Here's the policy: [paste]. What's wrong?" },
    { label: "Research", msg: "Give me a quick briefing on how Cursor monetises their AI editor. Key numbers if you can find them." },
    { label: "Writing", msg: "Draft a cold DM to a founder I want to collaborate with. Context: [two sentences]. Keep it under 5 lines." },
  ]
  return (
    <>
      <DotGrid />
      <SectionTag section="demo" />
      <SlideSec style={{ position: "relative", zIndex: 1 }}>
        <FI>
          <Label color="teal">Step 3 of 5</Label>
          <Divider />
          <H2 style={{ marginTop: "1rem", marginBottom: "1.4rem" }}>What I actually<br />text it.</H2>
        </FI>
        <FI>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".7rem" }}>
            {examples.map(({ label, msg }) => (
              <div key={label} className="card-hover" style={{ background: "var(--surface)", border: "1px solid var(--rim)", borderRadius: 10, padding: "1rem 1.1rem" }}>
                <p style={{ fontSize: ".58rem", textTransform: "uppercase", letterSpacing: ".14em", color: "var(--teal)", marginBottom: ".4rem", fontWeight: 700 }}>{label}</p>
                <p style={{ fontSize: ".83rem", color: "var(--body)", lineHeight: 1.55 }}>&ldquo;{msg}&rdquo;</p>
              </div>
            ))}
          </div>
        </FI>
      </SlideSec>
    </>
  )
}

function Step4Slide() {
  return (
    <>
      <GlowT />
      <DotGrid />
      <SectionTag section="demo" />
      <SlideSec style={{ position: "relative", zIndex: 1 }}>
        <FI>
          <Label color="teal">Step 4 of 5 · Live</Label>
          <Divider />
          <H2 style={{ marginTop: "1rem", marginBottom: "1.6rem" }}>Texting it right now<br />from my phone.</H2>
        </FI>
        <FI>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>
            <div>
              <p style={{ fontSize: ".6rem", textTransform: "uppercase", letterSpacing: ".14em", color: "var(--teal)", fontWeight: 700, marginBottom: ".75rem" }}>I&apos;m sending something real</p>
              <div style={{ background: "var(--surface)", border: "1px solid var(--teal)", borderRadius: 10, padding: "1.2rem 1.4rem" }}>
                <p style={{ fontSize: ".75rem", color: "var(--slate)", marginBottom: ".5rem", fontFamily: "var(--font-mono),ui-monospace,monospace", textTransform: "uppercase", letterSpacing: ".08em" }}>Robert → Telegram</p>
                <p style={{ fontSize: "clamp(.9rem,1.5vw,1.05rem)", color: "var(--bright)", lineHeight: 1.65, fontStyle: "italic" }}>
                  &ldquo;I&apos;m presenting OpenClaw to a group of high school hackers right now. Give me three sharp one-liners that explain why self-hosting an AI agent beats using a chat UI.&rdquo;
                </p>
              </div>
            </div>
            <div>
              <p style={{ fontSize: ".6rem", textTransform: "uppercase", letterSpacing: ".14em", color: "var(--dim)", fontWeight: 700, marginBottom: ".75rem" }}>Watch the reply land</p>
              <div style={{ background: "var(--surface)", border: "1px solid var(--rim)", borderRadius: 10, padding: "1.2rem 1.4rem", minHeight: "8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "var(--slate)", fontSize: ".88rem", fontStyle: "italic", textAlign: "center" }}>reply appears here — live ↗</p>
              </div>
              <div style={{ marginTop: ".75rem" }}>
                <Divider />
                <p style={{ marginTop: ".6rem", fontSize: ".8rem", color: "var(--dim)" }}>Session memory keeps context across every message — no re-explaining who you are.</p>
              </div>
            </div>
          </div>
        </FI>
      </SlideSec>
    </>
  )
}

function QABreak2() {
  return (
    <>
      <Aurora color="amber" />
      <div className="scanlines" style={{ position: "absolute", inset: 0, zIndex: 1 }} />
      <SectionTag section="demo" />
      <SlideSec style={{ position: "relative", zIndex: 2 }}>
        <FI><Label color="amber">Q&amp;A Break · 3 min</Label><Divider /></FI>
        <FI><H2 style={{ color: "var(--amber)", marginTop: "1.2rem" }}>Try it yourself.</H2></FI>
        <FI><Lead>Text it something you&apos;re actually working on right now. Not a demo prompt — something real.</Lead></FI>
        <FI>
          <p style={{ marginTop: "1.5rem", fontSize: ".85rem", color: "var(--slate)" }}>
            Still setting up? <span style={{ color: "var(--teal)", fontFamily: "var(--font-mono),ui-monospace,monospace" }}>openclaw.ai</span> · Telegram: <span style={{ color: "var(--teal)", fontFamily: "var(--font-mono),ui-monospace,monospace" }}>@BotFather</span>
          </p>
        </FI>
      </SlideSec>
    </>
  )
}

function Step5Slide() {
  const cmds = [
    <>openclaw skills search <Teal>&quot;github&quot;</Teal></>,
    <>openclaw skills install <Teal>@openclaw/demo</Teal></>,
    <>openclaw skills update <Teal>--all</Teal></>,
  ]
  return (
    <>
      <DotGrid />
      <SectionTag section="demo" />
      <SlideSec style={{ position: "relative", zIndex: 1 }}>
        <FI>
          <Label color="teal">Step 5 of 5</Label>
          <Divider />
          <H2 style={{ marginTop: "1rem", marginBottom: "1rem" }}>Install a skill.<br />Extend the agent.</H2>
          <p style={{ fontSize: "clamp(.9rem,1.5vw,1.05rem)", color: "var(--dim)", maxWidth: "50ch", lineHeight: 1.65, marginBottom: "1.4rem" }}>
            Skills are <code style={{ color: "var(--teal)", fontFamily: "var(--font-mono),ui-monospace,monospace" }}>SKILL.md</code> instruction packs that teach the agent new workflows. ClawHub is the community marketplace — <span style={{ color: "var(--teal)" }}>clawhub.ai</span>
          </p>
        </FI>
        <div style={{ display: "flex", flexDirection: "column", gap: ".65rem", maxWidth: "44rem" }}>
          {cmds.map((cmd, i) => (
            <FI key={i}><Cmd>{cmd}</Cmd></FI>
          ))}
        </div>
        <FI>
          <div style={{ marginTop: "1.3rem" }}>
            <Divider />
            <p style={{ marginTop: ".7rem", fontSize: ".84rem", color: "var(--dim)" }}>Anyone can publish. Build something at the hackathon — ship it to ClawHub tonight.</p>
          </div>
        </FI>
      </SlideSec>
    </>
  )
}

function BuildingBlocksSlide() {
  const blocks = [
    { icon: "🔧", label: "Tools", color: "coral", desc: "Actions the agent takes — run code, search the web, control a browser, send messages, generate images." },
    { icon: "📖", label: "Skills", color: "teal", desc: "SKILL.md instruction files — a workflow, a rubric, or a command sequence loaded directly into the agent prompt." },
    { icon: "🔌", label: "Plugins", color: "dim", desc: "New runtime capabilities — new channels, new AI providers, new tools. Install from ClawHub or write your own." },
  ]
  return (
    <>
      <GlowC />
      <DotGrid />
      <SectionTag section="demo" />
      <SlideSec style={{ position: "relative", zIndex: 1 }}>
        <FI>
          <Label>What you just used</Label>
          <Divider />
          <H2 style={{ marginTop: "1rem", marginBottom: "2.5rem" }}>Tools · Skills · Plugins.</H2>
        </FI>
        <FI>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "3rem" }}>
            {blocks.map(b => (
              <div key={b.label}>
                <p style={{ fontSize: ".6rem", textTransform: "uppercase", letterSpacing: ".16em", color: `var(--${b.color})`, fontWeight: 700, marginBottom: ".6rem" }}>{b.icon} {b.label}</p>
                <p style={{ fontSize: "clamp(.84rem,1.35vw,.95rem)", color: "var(--body)", lineHeight: 1.65 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </FI>
        <FI>
          <div style={{ marginTop: "2.5rem" }}>
            <Divider />
            <p style={{ marginTop: ".8rem", fontSize: ".82rem", color: "var(--slate)" }}>
              Tools = what it <em>does</em> · Skills = what it <em>knows</em> · Plugins = what it <em>can become</em>
            </p>
          </div>
        </FI>
      </SlideSec>
    </>
  )
}

function QABreak3() {
  return (
    <>
      <Aurora color="amber" />
      <div className="scanlines" style={{ position: "absolute", inset: 0, zIndex: 1 }} />
      <SectionTag section="demo" />
      <SlideSec style={{ position: "relative", zIndex: 2 }}>
        <FI><Label color="amber">Q&amp;A Break · 3 min</Label><Divider /></FI>
        <FI><H2 style={{ color: "var(--amber)", marginTop: "1.2rem" }}>What else can it do?</H2></FI>
        <FI><Lead>Ask anything about the demo. What would you want to change or extend?</Lead></FI>
        <FI><p style={{ marginTop: "1.5rem", fontSize: ".85rem", color: "var(--slate)" }}>Coming up: project ideas + open Q&amp;A →</p></FI>
      </SlideSec>
    </>
  )
}

/* ══════════════════════════════════════════════
   Q&A SLIDES
══════════════════════════════════════════════ */

function IdeasSlide() {
  const ideas = [
    { icon: "📋", title: "Hackathon tracker", desc: "Text progress updates, ask for your task list or blockers, get a status summary when judges walk by." },
    { icon: "🔍", title: "Code review bot", desc: "Send a GitHub PR link via Telegram, get a diff review with suggestions and a merge verdict — no browser." },
    { icon: "📅", title: "Booking autopilot", desc: 'Text "book me a court at 7pm" — agent controls a browser, checks availability, and confirms.' },
    { icon: "🏠", title: "Smart home bridge", desc: "Connect Home Assistant — control lights, check sensors, get alerts — all from a chat message." },
  ]
  return (
    <>
      <DotGrid />
      <SectionTag section="qa" />
      <SlideSec style={{ position: "relative", zIndex: 1 }}>
        <FI>
          <Label color="amber">Your Turn · Q&amp;A</Label>
          <Divider />
          <H2 style={{ marginTop: "1rem", marginBottom: "1.4rem" }}>What could you<br />build today?</H2>
        </FI>
        <FI>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
            {ideas.map(p => (
              <div key={p.title} className="card-hover" style={{ background: "var(--surface)", border: "1px solid var(--rim)", borderRadius: 10, padding: "1rem 1.1rem" }}>
                <div style={{ fontSize: "1.3rem", marginBottom: ".4rem" }}>{p.icon}</div>
                <p style={{ color: "var(--bright)", fontWeight: 700, fontSize: "clamp(.95rem,1.5vw,1.05rem)", marginBottom: ".2rem" }}>{p.title}</p>
                <p style={{ color: "var(--dim)", fontSize: ".83rem", lineHeight: 1.55 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </FI>
      </SlideSec>
    </>
  )
}

function GoBuildSlide() {
  const links = [
    { label: "Install", value: "openclaw.ai" },
    { label: "Docs", value: "docs.openclaw.ai" },
    { label: "Marketplace", value: "clawhub.ai" },
    { label: "Community", value: "discord.gg/clawd" },
  ]
  return (
    <>
      <CoverGlow />
      <DotGrid />
      <SectionTag section="qa" />
      <SlideSec style={{ position: "relative", zIndex: 1 }}>
        <FI>
          <div style={{ fontSize: "3rem", lineHeight: 1, filter: "drop-shadow(0 0 18px rgba(255,74,82,.45))", marginBottom: "1.4rem" }}>🦞</div>
        </FI>
        <FI>
          <Label>Go build</Label>
          <Divider />
          <H2 style={{ marginTop: "1rem", marginBottom: "1.8rem" }}>Same setup I use.<br />Yours in 5 minutes.</H2>
        </FI>
        <FI><Cmd>curl -fsSL https://openclaw.ai/install.sh | bash</Cmd></FI>
        <FI>
          <div style={{ display: "flex", gap: "3.5rem", marginTop: "2rem", flexWrap: "wrap" }}>
            {links.map(l => (
              <div key={l.label}>
                <p style={{ fontSize: ".58rem", textTransform: "uppercase", letterSpacing: ".14em", color: "var(--slate)", marginBottom: ".35rem" }}>{l.label}</p>
                <p style={{ color: "var(--bright)", fontWeight: 700, fontSize: "1rem" }}>{l.value}</p>
              </div>
            ))}
          </div>
        </FI>
      </SlideSec>
    </>
  )
}

function OpenQASlide() {
  return (
    <>
      <Aurora color="amber" />
      <div className="scanlines" style={{ position: "absolute", inset: 0, zIndex: 1 }} />
      <SectionTag section="qa" />
      <SlideSec style={{ position: "relative", zIndex: 2 }}>
        <FI><Label color="amber">Open Q&amp;A · 20 min</Label><Divider /></FI>
        <FI><H2 style={{ color: "var(--amber)", marginTop: "1.2rem" }}>What are you<br />going to build?</H2></FI>
        <FI><Lead>Open floor — ask anything about OpenClaw, the demo, your project idea, or how to get unstuck.</Lead></FI>
        <FI>
          <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap", marginTop: "2rem" }}>
            {[{ l: "Install", v: "openclaw.ai" }, { l: "Help", v: "docs.openclaw.ai" }].map(i => (
              <div key={i.l}>
                <p style={{ fontSize: ".58rem", textTransform: "uppercase", letterSpacing: ".14em", color: "var(--slate)", marginBottom: ".35rem" }}>{i.l}</p>
                <p style={{ color: "var(--bright)", fontWeight: 600, fontSize: "1rem" }}>{i.v}</p>
              </div>
            ))}
          </div>
        </FI>
      </SlideSec>
    </>
  )
}

/* ══════════════════════════════════════════════
   SLIDES ARRAY
══════════════════════════════════════════════ */

export const slides: Slide[] = [
  { section: "intro", component: CoverSlide,          slug: "cover" },
  { section: "intro", component: AboutSlide,          slug: "about" },
  { section: "intro", component: WhyOpenClawSlide,    slug: "why-openclaw" },
  { section: "intro", component: ProblemSlide,        slug: "problem" },
  { section: "intro", component: WhatIsSlide,         slug: "what-is" },
  { section: "intro", component: InstallSlide,        slug: "install" },
  { section: "intro", component: ShowcaseSlide,       slug: "showcase" },
  { section: "intro", component: QABreak1,            slug: "qa-break-1" },
  { section: "demo",  component: DemoIntroSlide,      slug: "demo-intro" },
  { section: "demo",  component: Step1Slide,          slug: "step-1-dashboard" },
  { section: "demo",  component: Step2Slide,          slug: "step-2-telegram" },
  { section: "demo",  component: Step3Slide,          slug: "step-3-messages" },
  { section: "demo",  component: Step4Slide,          slug: "step-4-live" },
  { section: "demo",  component: QABreak2,            slug: "qa-break-2" },
  { section: "demo",  component: Step5Slide,          slug: "step-5-skills" },
  { section: "demo",  component: BuildingBlocksSlide, slug: "building-blocks" },
  { section: "demo",  component: QABreak3,            slug: "qa-break-3" },
  { section: "qa",    component: IdeasSlide,          slug: "ideas" },
  { section: "qa",    component: GoBuildSlide,        slug: "go-build" },
  { section: "qa",    component: OpenQASlide,         slug: "open-qa" },
]
