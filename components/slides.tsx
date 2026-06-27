"use client"
import { DotGrid, CoverGlow, Aurora, BeamsBg } from "./ui/effects"

export type Section = "intro" | "demo" | "qa"

export interface Slide {
  section: Section
  component: React.FC
}

/* ── Shared primitives ── */
const Eyebrow = ({ children, color = "coral" }: { children: React.ReactNode; color?: "coral" | "teal" | "amber" }) => {
  const c = { coral: "var(--coral)", teal: "var(--teal)", amber: "var(--amber)" }[color]
  return (
    <p style={{ color: c, fontSize: "clamp(.6rem,1vw,.75rem)", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: ".9rem" }}>
      {children}
    </p>
  )
}

const H1 = ({ children, gradient }: { children: React.ReactNode; gradient?: boolean }) => (
  gradient ? (
    <h1 style={{
      fontSize: "clamp(2.8rem,6vw,5rem)", fontWeight: 800, lineHeight: 1.04,
      letterSpacing: "-.035em", textWrap: "balance" as never,
      background: "linear-gradient(118deg, var(--bright) 20%, #ff8a8e 100%)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    }}>
      {children}
    </h1>
  ) : (
    <h1 style={{ fontSize: "clamp(2.8rem,6vw,5rem)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-.035em", color: "var(--bright)", textWrap: "balance" as never }}>
      {children}
    </h1>
  )
)

const H2 = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <h2 style={{ fontSize: "clamp(2rem,4.2vw,3.4rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-.03em", color: "var(--bright)", textWrap: "balance" as never, ...style }}>
    {children}
  </h2>
)

const Lead = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: "clamp(.95rem,1.7vw,1.25rem)", color: "var(--dim)", maxWidth: "52ch", marginTop: "1rem", lineHeight: 1.6 }}>
    {children}
  </p>
)

const Rule = ({ color = "coral" }: { color?: "coral" | "teal" | "amber" }) => {
  const c = { coral: "var(--coral)", teal: "var(--teal)", amber: "var(--amber)" }[color]
  return <div style={{ width: 32, height: 3, background: c, borderRadius: 2, marginBottom: "1.3rem" }} />
}

const Card = ({ children, accent }: { children: React.ReactNode; accent?: string }) => (
  <div className="card-hover" style={{ background: "var(--surface)", border: `1px solid ${accent ?? "var(--rim)"}`, borderRadius: 10, padding: "1rem 1.2rem" }}>
    {children}
  </div>
)

const Cmd = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", alignItems: "center", gap: ".7rem", background: "var(--surface)", border: "1px solid var(--rim)", borderRadius: 8, padding: ".8rem 1.3rem", fontFamily: "var(--font-mono), 'SF Mono', ui-monospace, monospace", fontSize: "clamp(.75rem,1.3vw,.93rem)", color: "var(--bright)" }}>
    <span style={{ color: "var(--slate)", userSelect: "none" }}>$</span>
    {children}
  </div>
)

const Teal = ({ children }: { children: React.ReactNode }) => <span style={{ color: "var(--teal)" }}>{children}</span>

const Pill = ({ children, color = "coral" }: { children: React.ReactNode; color?: "coral" | "teal" | "amber" | "dim" }) => {
  const styles: Record<string, React.CSSProperties> = {
    coral: { background: "rgba(255,74,82,.13)", color: "var(--coral)" },
    teal:  { background: "rgba(0,212,190,.11)", color: "var(--teal)" },
    amber: { background: "rgba(245,166,35,.13)", color: "var(--amber)" },
    dim:   { background: "rgba(107,120,152,.15)", color: "var(--dim)" },
  }
  return (
    <span style={{ display: "inline-block", padding: ".18em .7em", borderRadius: 999, fontSize: ".65rem", fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", ...styles[color] }}>
      {children}
    </span>
  )
}

const StepNum = ({ n, color = "coral" }: { n: number; color?: "coral" | "teal" }) => {
  const bg = color === "teal" ? "var(--teal)" : "var(--coral)"
  const fg = color === "teal" ? "var(--bg)" : "#fff"
  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "1.8rem", height: "1.8rem", borderRadius: "50%", background: bg, color: fg, fontSize: ".68rem", fontWeight: 700, flexShrink: 0 }}>
      {n}
    </div>
  )
}

const SectionTag = ({ section }: { section: Section }) => {
  const c = { intro: "var(--coral)", demo: "var(--teal)", qa: "var(--amber)" }[section]
  return <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: c }} />
}

const GlowC = () => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 65% 55% at 85% 50%, rgba(255,74,82,.07) 0%, transparent 68%)" }} />
)
const GlowT = () => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 50% at 15% 55%, rgba(0,212,190,.06) 0%, transparent 65%)" }} />
)

/* ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
   INTRO SLIDES
── ── ── ── ── ── ── ── ── ── ── ── ── ── ── */

function CoverSlide() {
  return (
    <>
      <CoverGlow />
      <DotGrid />
      <SectionTag section="intro" />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{ fontSize: "4rem", lineHeight: 1, filter: "drop-shadow(0 0 22px rgba(255,74,82,.52))", marginBottom: "1.4rem" }}>🦞</div>
        <Eyebrow>Hackathon Workshop · 1 Hour</Eyebrow>
        <H1 gradient>Robert Mill</H1>
        <p style={{ fontSize: "clamp(1.1rem,2vw,1.5rem)", color: "var(--dim)", marginTop: ".5rem", fontWeight: 500 }}>
          Founder, MakersLounge · AI Builder
        </p>
        <Lead>Today: how I use OpenClaw in my stack, and how you can build something real with it in the next hour.</Lead>
        <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", marginTop: "1.8rem" }}>
          <Pill color="coral">10 min intro</Pill>
          <Pill color="teal">30 min live demo</Pill>
          <Pill color="amber">20 min Q&amp;A</Pill>
          <Pill color="dim">Toronto · Ivey Business School</Pill>
        </div>
      </div>
    </>
  )
}

function AboutSlide() {
  return (
    <>
      <DotGrid />
      <SectionTag section="intro" />
      <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5vw", alignItems: "start" }}>
        <div>
          <Rule />
          <Eyebrow>Who I Am</Eyebrow>
          <H2>Builder. Founder.<br />AI tinkerer.</H2>
          <p style={{ marginTop: "1rem", fontSize: "clamp(.88rem,1.4vw,1rem)", color: "var(--body)", lineHeight: 1.6, maxWidth: "38ch" }}>
            I run <strong style={{ color: "var(--bright)" }}>MakersLounge</strong> — a community for people who build things. I study at <strong style={{ color: "var(--bright)" }}>Ivey Business School</strong> (Dean&apos;s List) and I&apos;ve spent the last few years building AI tools that actually get used.
          </p>
          <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", marginTop: "1.2rem" }}>
            <Pill color="dim">Young Entrepreneur of the Year 2017</Pill>
            <Pill color="dim">🏈 National Football Champion</Pill>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: ".7rem" }}>
          <p style={{ fontSize: ".68rem", textTransform: "uppercase", letterSpacing: ".12em", color: "var(--slate)", marginBottom: ".2rem" }}>Things I&apos;ve built with AI</p>
          {[
            { name: "Lighten AI Agents", desc: "AI agent support platform" },
            { name: "Deep Research Agent", desc: "Demonstrated at Shopify" },
            { name: "Daygo.live", desc: "AI journaling agent with vector store" },
            { name: "Marble", desc: "AI-powered web & app builder" },
            { name: "Marketstep", desc: "LLM-driven financial analysis" },
          ].map(p => (
            <div key={p.name} className="card-hover" style={{ background: "var(--surface)", border: "1px solid var(--rim)", borderRadius: 8, padding: ".65rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--bright)", fontSize: ".9rem", fontWeight: 600 }}>{p.name}</span>
              <span style={{ color: "var(--dim)", fontSize: ".78rem" }}>{p.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function WhyOpenClawSlide() {
  return (
    <>
      <GlowC />
      <DotGrid />
      <SectionTag section="intro" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Rule />
        <Eyebrow>Why I&apos;m Here</Eyebrow>
        <H2>I build AI tools<br />for a living.<br /><span style={{ color: "var(--coral)" }}>OpenClaw is in my stack.</span></H2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".85rem", marginTop: "1.8rem" }}>
          <Card>
            <p style={{ fontSize: ".68rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--slate)", marginBottom: ".4rem" }}>I use it for</p>
            <p style={{ color: "var(--bright)", fontSize: ".9rem", fontWeight: 600, marginBottom: ".25rem" }}>Managing projects from Telegram</p>
            <p style={{ color: "var(--dim)", fontSize: ".82rem" }}>Text my agent from my phone, get task breakdowns and status updates without opening a laptop.</p>
          </Card>
          <Card>
            <p style={{ fontSize: ".68rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--slate)", marginBottom: ".4rem" }}>I use it for</p>
            <p style={{ color: "var(--bright)", fontSize: ".9rem", fontWeight: 600, marginBottom: ".25rem" }}>Running research agents</p>
            <p style={{ color: "var(--dim)", fontSize: ".82rem" }}>Trigger deep research from a chat message. Results come back to my phone while I&apos;m doing something else.</p>
          </Card>
          <Card accent="var(--coral)">
            <p style={{ fontSize: ".68rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--slate)", marginBottom: ".4rem" }}>Why self-hosted</p>
            <p style={{ color: "var(--bright)", fontSize: ".9rem", fontWeight: 600, marginBottom: ".25rem" }}>My data. My rules.</p>
            <p style={{ color: "var(--dim)", fontSize: ".82rem" }}>Nothing goes to a third-party server. Open source, MIT licensed — I can read every line of code.</p>
          </Card>
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
      <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5vw", alignItems: "center" }}>
        <div>
          <Rule />
          <Eyebrow>The Problem</Eyebrow>
          <H2>AI is stuck<br />in browser tabs.</H2>
          <p style={{ marginTop: "1rem", fontSize: "clamp(.9rem,1.5vw,1.1rem)", color: "var(--dim)", lineHeight: 1.6, maxWidth: "38ch" }}>
            You have to go to it. Context resets every session. Every tool is an island — your AI doesn&apos;t know what you were building yesterday.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <Card>
            <p style={{ color: "var(--bright)", fontSize: ".9rem", fontWeight: 600, marginBottom: ".2rem" }}>You&apos;re already on Telegram</p>
            <p style={{ color: "var(--dim)", fontSize: ".83rem" }}>And WhatsApp. And Discord. Why context-switch to another browser tab?</p>
          </Card>
          <Card>
            <p style={{ color: "var(--bright)", fontSize: ".9rem", fontWeight: 600, marginBottom: ".2rem" }}>Agents should come to you</p>
            <p style={{ color: "var(--dim)", fontSize: ".83rem" }}>A message costs nothing to send. A tab switch costs 20 minutes of focus.</p>
          </Card>
          <Card accent="var(--teal)">
            <p style={{ color: "var(--teal)", fontWeight: 600, fontSize: ".88rem" }}>OpenClaw puts the agent in the app you&apos;re already using.</p>
          </Card>
        </div>
      </div>
    </>
  )
}

function WhatIsSlide() {
  return (
    <>
      <GlowT />
      <DotGrid />
      <SectionTag section="intro" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Eyebrow color="teal">What is OpenClaw?</Eyebrow>
        <H2>One gateway.<br />Every chat app. Any AI.</H2>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1.8rem", flexWrap: "wrap" }}>
          {[
            { lbl: "You send from", name: "💬 Telegram · WhatsApp\nDiscord · Slack · iMessage" },
          ].map(n => (
            <div key={n.lbl} style={{ background: "var(--surface)", border: "1px solid var(--rim)", borderRadius: 10, padding: ".8rem 1.3rem", textAlign: "center" }}>
              <p style={{ fontSize: ".58rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--slate)", marginBottom: ".25rem" }}>{n.lbl}</p>
              <p style={{ fontSize: ".88rem", fontWeight: 700, color: "var(--bright)", whiteSpace: "pre-line" }}>{n.name}</p>
            </div>
          ))}
          <span style={{ color: "var(--slate)", fontSize: "1.1rem" }}>→</span>
          <div style={{ background: "rgba(255,74,82,.07)", border: "1px solid var(--coral)", borderRadius: 10, padding: ".8rem 1.3rem", textAlign: "center" }}>
            <p style={{ fontSize: ".58rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--slate)", marginBottom: ".25rem" }}>Routes through</p>
            <p style={{ fontSize: ".88rem", fontWeight: 700, color: "var(--bright)" }}>🦞 Gateway</p>
            <p style={{ fontSize: ".72rem", color: "var(--dim)" }}>runs on your laptop</p>
          </div>
          <span style={{ color: "var(--slate)", fontSize: "1.1rem" }}>→</span>
          <div style={{ background: "var(--surface)", border: "1px solid var(--rim)", borderRadius: 10, padding: ".8rem 1.3rem", textAlign: "center" }}>
            <p style={{ fontSize: ".58rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--slate)", marginBottom: ".25rem" }}>AI processes</p>
            <p style={{ fontSize: ".88rem", fontWeight: 700, color: "var(--bright)" }}>🤖 Your Agent</p>
            <p style={{ fontSize: ".72rem", color: "var(--dim)" }}>Gemini · Claude · GPT · Ollama</p>
          </div>
          <span style={{ color: "var(--slate)", fontSize: "1.1rem" }}>→</span>
          <div style={{ background: "var(--surface)", border: "1px solid var(--rim)", borderRadius: 10, padding: ".8rem 1.3rem", textAlign: "center" }}>
            <p style={{ fontSize: ".58rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--slate)", marginBottom: ".25rem" }}>You receive</p>
            <p style={{ fontSize: ".88rem", fontWeight: 700, color: "var(--bright)" }}>✅ Reply</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.8rem", flexWrap: "wrap" }}>
          <div><Pill color="coral">Self-hosted</Pill><p style={{ fontSize: ".8rem", marginTop: ".35rem" }}>Runs on your machine. Data never leaves.</p></div>
          <div><Pill color="teal">Open source</Pill><p style={{ fontSize: ".8rem", marginTop: ".35rem" }}>MIT licensed. Fork it, own it.</p></div>
          <div><Pill color="coral">Multi-channel</Pill><p style={{ fontSize: ".8rem", marginTop: ".35rem" }}>One gateway, all apps at once.</p></div>
        </div>
      </div>
    </>
  )
}

function InstallSlide() {
  return (
    <>
      <DotGrid />
      <SectionTag section="intro" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Rule />
        <Eyebrow>Setup</Eyebrow>
        <H2>Three commands.<br />Five minutes.</H2>
        <div style={{ display: "flex", flexDirection: "column", gap: ".65rem", marginTop: "1.6rem" }}>
          {[
            { n: 1, cmd: <>curl -fsSL https://openclaw.ai/install.sh | bash</> },
            { n: 2, cmd: <>openclaw onboard <Teal>--install-daemon</Teal></> },
            { n: 3, cmd: <>openclaw dashboard</> },
          ].map(({ n, cmd }) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <StepNum n={n} />
              <Cmd>{cmd}</Cmd>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "1.5rem", fontSize: ".84rem", color: "var(--slate)", fontFamily: "var(--font-mono), ui-monospace, monospace" }}>
          Windows: <span style={{ color: "var(--teal)" }}>iwr -useb https://openclaw.ai/install.ps1 | iex</span>
          &nbsp;·&nbsp; Needs Node 22+ (installer handles it)
          &nbsp;·&nbsp; Something wrong? <span style={{ color: "var(--teal)" }}>openclaw doctor</span>
        </p>
      </div>
    </>
  )
}

function ShowcaseSlide() {
  const projects = [
    { icon: "📱", title: "iOS app via Telegram", desc: "Built a full iOS app with maps and voice recording, deployed to TestFlight — entirely over Telegram chat. Never opened a laptop." },
    { icon: "🤖", title: "14-agent orchestration", desc: "One Claude orchestrator delegating to 14 Codex workers under a single gateway. Real parallel pipelines from a chat message." },
    { icon: "🛒", title: "Grocery autopilot", desc: "Weekly meal plan → book delivery slot → confirm order. No API — just browser control. Runs every Sunday automatically." },
    { icon: "🖨️", title: "3D printer control", desc: 'Text "check my print job" — agent replies with live status, camera snapshot, and ETA from the printer.' },
  ]
  return (
    <>
      <DotGrid />
      <SectionTag section="intro" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Rule />
        <Eyebrow>Built with OpenClaw</Eyebrow>
        <H2>Real things the<br />community shipped.</H2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".85rem", marginTop: "1.4rem" }}>
          {projects.map(p => (
            <Card key={p.title}>
              <div style={{ fontSize: "1.4rem", marginBottom: ".45rem", lineHeight: 1 }}>{p.icon}</div>
              <p style={{ color: "var(--bright)", fontWeight: 700, fontSize: "clamp(.95rem,1.5vw,1.1rem)", marginBottom: ".2rem" }}>{p.title}</p>
              <p style={{ color: "var(--dim)", fontSize: ".83rem", lineHeight: 1.55, maxWidth: "none" }}>{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}

function QABreak1() {
  return (
    <>
      <Aurora color="amber" />
      <div className="scanlines" style={{ position: "absolute", inset: 0, zIndex: 1 }} />
      <SectionTag section="intro" />
      <div style={{ position: "relative", zIndex: 2 }}>
        <Rule color="amber" />
        <Eyebrow color="amber">Q&amp;A Break · 2 min</Eyebrow>
        <H2 style={{ color: "var(--amber)" }}>Questions so far?</H2>
        <Lead>What would you build if your AI agent lived inside Telegram or WhatsApp?</Lead>
        <p style={{ marginTop: "1.5rem", fontSize: ".88rem", color: "var(--slate)" }}>Coming up next: 30 minutes of live building →</p>
      </div>
    </>
  )
}

/* ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
   DEMO SLIDES
── ── ── ── ── ── ── ── ── ── ── ── ── ── ── */

function DemoIntroSlide() {
  return (
    <>
      <BeamsBg />
      <GlowT />
      <DotGrid />
      <SectionTag section="demo" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Eyebrow color="teal">Live Demo · 30 min</Eyebrow>
        <H2>We&apos;re building a<br />Hackathon Project<br />Assistant.</H2>
        <Lead>Text your AI agent from Telegram with a project idea. It breaks it into tasks, answers coding questions, and tracks your progress — all from your phone.</Lead>
        <p style={{ marginTop: "1.5rem", fontSize: ".88rem", color: "var(--dim)" }}>Follow along on your own laptop. Install: <span style={{ color: "var(--teal)", fontFamily: "var(--font-mono), ui-monospace, monospace" }}>openclaw.ai</span></p>
      </div>
    </>
  )
}

function Step1Slide() {
  return (
    <>
      <DotGrid />
      <SectionTag section="demo" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Rule color="teal" />
        <Eyebrow color="teal">Step 1 of 5</Eyebrow>
        <H2>Open the dashboard.</H2>
        <div style={{ marginTop: "1.5rem", maxWidth: "42rem" }}>
          <Cmd>openclaw dashboard</Cmd>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem", background: "var(--surface)", border: "1px solid var(--rim)", borderLeft: "3px solid var(--teal)", borderRadius: 8, padding: "1rem 1.2rem", marginTop: "1.5rem", maxWidth: "44rem" }}>
          <div style={{ fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: "1.8rem", fontWeight: 700, color: "var(--teal)", lineHeight: 1, flexShrink: 0, opacity: .35 }}>01</div>
          <div>
            <p style={{ color: "var(--bright)", fontWeight: 700, fontSize: "clamp(.9rem,1.4vw,1.05rem)", marginBottom: ".2rem" }}>Browser opens at http://127.0.0.1:18789/</p>
            <p style={{ color: "var(--dim)", fontSize: ".83rem", maxWidth: "none" }}>This is the Control UI — a full chat interface running locally. Send a message now to verify your Gemini connection is working.</p>
          </div>
        </div>
        <p style={{ marginTop: "1.3rem", fontSize: ".85rem", color: "var(--dim)", fontStyle: "italic" }}>&ldquo;What can you help me build at a hackathon?&rdquo;</p>
      </div>
    </>
  )
}

function Step2Slide() {
  return (
    <>
      <GlowT />
      <DotGrid />
      <SectionTag section="demo" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Rule color="teal" />
        <Eyebrow color="teal">Step 2 of 5</Eyebrow>
        <H2>Connect Telegram.<br />Chat from your phone.</H2>
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", marginTop: "1.5rem", maxWidth: "44rem" }}>
          {[
            { n: 1, text: <>Open Telegram → search <strong style={{ color: "var(--bright)" }}>@BotFather</strong> → send <code style={{ color: "var(--teal)", fontFamily: "var(--font-mono), ui-monospace, monospace" }}>/newbot</code></> },
            { n: 2, text: <>Give it a name and username → BotFather gives you a <strong style={{ color: "var(--bright)" }}>bot token</strong></> },
            { n: 3, isCmd: true },
            { n: 4, text: <>Paste your bot token when prompted → find your bot in Telegram → send it a message</> },
          ].map(step => (
            <div key={step.n} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <StepNum n={step.n} color="teal" />
              {step.isCmd
                ? <Cmd>openclaw configure <Teal>--section telegram</Teal></Cmd>
                : <p style={{ color: "var(--body)", fontSize: "clamp(.85rem,1.35vw,1rem)", lineHeight: 1.55 }}>{step.text}</p>
              }
            </div>
          ))}
        </div>
        <p style={{ marginTop: "1.3rem", fontSize: ".84rem", color: "var(--slate)" }}>Telegram is the fastest channel — just a bot token, no app install, works on any phone.</p>
      </div>
    </>
  )
}

function Step3Slide() {
  return (
    <>
      <DotGrid />
      <SectionTag section="demo" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Rule color="teal" />
        <Eyebrow color="teal">Step 3 of 5</Eyebrow>
        <H2>Text it your<br />project idea.</H2>
        <div style={{ background: "var(--surface)", border: "1px solid var(--teal)", borderRadius: 10, padding: "1.2rem 1.5rem", marginTop: "1.5rem", maxWidth: "50rem" }}>
          <p style={{ fontSize: ".8rem", color: "var(--slate)", marginBottom: ".5rem", fontFamily: "var(--font-mono), ui-monospace, monospace", textTransform: "uppercase", letterSpacing: ".08em" }}>You → Telegram</p>
          <p style={{ fontSize: "clamp(.95rem,1.6vw,1.1rem)", color: "var(--bright)", lineHeight: 1.6 }}>
            &ldquo;I want to build a web app that lets students anonymously submit questions during a class, and the teacher sees them in real time. I have 24 hours. Break this into tasks.&rdquo;
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem", background: "var(--surface)", border: "1px solid var(--rim)", borderLeft: "3px solid var(--teal)", borderRadius: 8, padding: "1rem 1.2rem", marginTop: "1.2rem", maxWidth: "50rem" }}>
          <div style={{ fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: "1.8rem", fontWeight: 700, color: "var(--teal)", lineHeight: 1, flexShrink: 0, opacity: .35 }}>→</div>
          <div>
            <p style={{ color: "var(--bright)", fontWeight: 700, fontSize: "clamp(.9rem,1.4vw,1.05rem)", marginBottom: ".2rem" }}>Watch it reply to your phone</p>
            <p style={{ color: "var(--dim)", fontSize: ".83rem", maxWidth: "none" }}>The agent breaks the project into a prioritised task list, flags the hardest parts, and suggests where to start. No tab switching — it comes to you.</p>
          </div>
        </div>
      </div>
    </>
  )
}

function Step4Slide() {
  const examples = [
    '"How do I set up real-time with WebSockets in Node.js? Show me the server code."',
    '"My Express server keeps crashing on POST requests, here\'s the error: [paste error]"',
    '"We finished the backend. What should we tackle next based on our task list?"',
  ]
  return (
    <>
      <GlowT />
      <DotGrid />
      <SectionTag section="demo" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Rule color="teal" />
        <Eyebrow color="teal">Step 4 of 5</Eyebrow>
        <H2>Ask it coding<br />questions mid-build.</H2>
        <div style={{ display: "flex", flexDirection: "column", gap: ".7rem", marginTop: "1.5rem", maxWidth: "50rem" }}>
          {examples.map(ex => (
            <Card key={ex}>
              <p style={{ fontSize: ".88rem", color: "var(--body)", lineHeight: 1.55, maxWidth: "none" }}>{ex}</p>
            </Card>
          ))}
        </div>
        <p style={{ marginTop: "1.3rem", fontSize: ".85rem", color: "var(--dim)" }}>The agent has session memory — it remembers your project from step 3. You don&apos;t re-explain context on every message.</p>
      </div>
    </>
  )
}

function QABreak2() {
  return (
    <>
      <Aurora color="amber" />
      <div className="scanlines" style={{ position: "absolute", inset: 0, zIndex: 1 }} />
      <SectionTag section="demo" />
      <div style={{ position: "relative", zIndex: 2 }}>
        <Rule color="amber" />
        <Eyebrow color="amber">Q&amp;A Break · 3 min</Eyebrow>
        <H2 style={{ color: "var(--amber)" }}>Try it yourself.</H2>
        <Lead>Text your own project idea to the agent. What does it say?</Lead>
        <p style={{ marginTop: "1.5rem", fontSize: ".88rem", color: "var(--slate)" }}>Still setting up? <span style={{ color: "var(--teal)", fontFamily: "var(--font-mono), ui-monospace, monospace" }}>openclaw.ai</span> for install · <span style={{ color: "var(--teal)", fontFamily: "var(--font-mono), ui-monospace, monospace" }}>@BotFather</span> for Telegram</p>
      </div>
    </>
  )
}

function Step5Slide() {
  return (
    <>
      <DotGrid />
      <SectionTag section="demo" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Rule color="teal" />
        <Eyebrow color="teal">Step 5 of 5</Eyebrow>
        <H2>Install a skill.<br />Extend the agent.</H2>
        <p style={{ marginTop: "1rem", fontSize: "clamp(.9rem,1.5vw,1.1rem)", color: "var(--dim)", maxWidth: "50ch", lineHeight: 1.6 }}>
          Skills are <code style={{ color: "var(--teal)", fontFamily: "var(--font-mono), ui-monospace, monospace" }}>SKILL.md</code> instruction packs that teach the agent new workflows. ClawHub is the community marketplace — <span style={{ color: "var(--teal)" }}>clawhub.ai</span>
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: ".65rem", marginTop: "1.5rem", maxWidth: "44rem" }}>
          {[
            <>openclaw skills search <Teal>&quot;github&quot;</Teal></>,
            <>openclaw skills install <Teal>@openclaw/demo</Teal></>,
            <>openclaw skills update <Teal>--all</Teal></>,
          ].map((cmd, i) => <Cmd key={i}>{cmd}</Cmd>)}
        </div>
        <p style={{ marginTop: "1.3rem", fontSize: ".85rem", color: "var(--dim)" }}>Anyone can publish. Build something at the hackathon — ship it to ClawHub tonight.</p>
      </div>
    </>
  )
}

function BuildingBlocksSlide() {
  const blocks = [
    { icon: "🔧", title: "Tools", color: "var(--coral)", desc: "Actions the agent takes — run code, search the web, control a browser, send messages, generate images." },
    { icon: "📖", title: "Skills", color: "var(--teal)", desc: <><code style={{ color: "var(--teal)", fontFamily: "var(--font-mono), ui-monospace, monospace" }}>SKILL.md</code> instruction files — a workflow, a rubric, or a command sequence loaded into the agent prompt.</> },
    { icon: "🔌", title: "Plugins", color: "var(--dim)", desc: "New runtime capabilities — new channels, new AI providers, new tools. Install from ClawHub or build your own." },
  ]
  return (
    <>
      <GlowC />
      <DotGrid />
      <SectionTag section="demo" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Eyebrow>What You Just Used</Eyebrow>
        <H2>Tools · Skills · Plugins.</H2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".85rem", marginTop: "1.8rem" }}>
          {blocks.map(b => (
            <Card key={b.title} accent={b.color !== "var(--dim)" ? b.color : undefined}>
              <div style={{ fontSize: "1.4rem", marginBottom: ".45rem", lineHeight: 1 }}>{b.icon}</div>
              <p style={{ color: b.color, fontWeight: 700, fontSize: "clamp(.95rem,1.5vw,1.1rem)", marginBottom: ".2rem" }}>{b.title}</p>
              <p style={{ color: "var(--dim)", fontSize: ".83rem", lineHeight: 1.55, maxWidth: "none" }}>{b.desc}</p>
            </Card>
          ))}
        </div>
        <p style={{ marginTop: "1.3rem", fontSize: ".85rem", color: "var(--dim)" }}>
          Tools = what it <em>does</em> · Skills = what it <em>knows</em> · Plugins = what it <em>can become</em>
        </p>
      </div>
    </>
  )
}

function QABreak3() {
  return (
    <>
      <Aurora color="amber" />
      <div className="scanlines" style={{ position: "absolute", inset: 0, zIndex: 1 }} />
      <SectionTag section="demo" />
      <div style={{ position: "relative", zIndex: 2 }}>
        <Rule color="amber" />
        <Eyebrow color="amber">Q&amp;A Break · 3 min</Eyebrow>
        <H2 style={{ color: "var(--amber)" }}>What else can it do?</H2>
        <Lead>Ask anything about the demo. What would you want to change or extend?</Lead>
        <p style={{ marginTop: "1.5rem", fontSize: ".88rem", color: "var(--slate)" }}>Coming up: project ideas + open Q&amp;A →</p>
      </div>
    </>
  )
}

/* ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
   Q&A SLIDES
── ── ── ── ── ── ── ── ── ── ── ── ── ── ── */

function IdeasSlide() {
  const ideas = [
    { icon: "📋", title: "Hackathon tracker", desc: "Text progress updates, ask for your task list or blockers, get a status summary when the judges walk by." },
    { icon: "🔍", title: "Code review bot", desc: "Send a GitHub PR link via Telegram, get a diff review with suggestions and a merge verdict — no browser." },
    { icon: "📅", title: "Booking autopilot", desc: 'Text "book me a court at 7pm" — agent controls a browser, checks availability, and confirms for you.' },
    { icon: "🏠", title: "Smart home bridge", desc: "Connect Home Assistant — control lights, check sensors, get alerts — all from a chat message." },
  ]
  return (
    <>
      <DotGrid />
      <SectionTag section="qa" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Rule color="amber" />
        <Eyebrow color="amber">Your Turn · Q&amp;A</Eyebrow>
        <H2>What could you<br />build today?</H2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".85rem", marginTop: "1.4rem" }}>
          {ideas.map(p => (
            <Card key={p.title}>
              <div style={{ fontSize: "1.4rem", marginBottom: ".45rem", lineHeight: 1 }}>{p.icon}</div>
              <p style={{ color: "var(--bright)", fontWeight: 700, fontSize: "clamp(.95rem,1.5vw,1.1rem)", marginBottom: ".2rem" }}>{p.title}</p>
              <p style={{ color: "var(--dim)", fontSize: ".83rem", lineHeight: 1.55, maxWidth: "none" }}>{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>
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
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "3.2rem", lineHeight: 1, filter: "drop-shadow(0 0 18px rgba(255,74,82,.45))", marginBottom: "1.3rem" }}>🦞</div>
        <Eyebrow>Go Build</Eyebrow>
        <H2>Install. Connect.<br />Ship something today.</H2>
        <Cmd>curl -fsSL https://openclaw.ai/install.sh | bash</Cmd>
        <div style={{ display: "flex", gap: "3rem", marginTop: "2.2rem", flexWrap: "wrap" }}>
          {links.map(l => (
            <div key={l.label}>
              <p style={{ fontSize: ".62rem", textTransform: "uppercase", letterSpacing: ".12em", color: "var(--slate)", marginBottom: ".35rem" }}>{l.label}</p>
              <p style={{ color: "var(--bright)", fontWeight: 700, fontSize: "1rem" }}>{l.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function OpenQASlide() {
  return (
    <>
      <Aurora color="amber" />
      <div className="scanlines" style={{ position: "absolute", inset: 0, zIndex: 1 }} />
      <SectionTag section="qa" />
      <div style={{ position: "relative", zIndex: 2 }}>
        <Rule color="amber" />
        <Eyebrow color="amber">Open Q&amp;A · 20 min</Eyebrow>
        <H2 style={{ color: "var(--amber)" }}>What are you<br />going to build?</H2>
        <Lead>Open floor — ask anything about OpenClaw, the demo, your project idea, or how to get unstuck.</Lead>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginTop: "2rem" }}>
          {[{ l: "Install", v: "openclaw.ai" }, { l: "Help", v: "docs.openclaw.ai" }].map(i => (
            <div key={i.l}>
              <p style={{ fontSize: ".62rem", textTransform: "uppercase", letterSpacing: ".12em", color: "var(--slate)", marginBottom: ".35rem" }}>{i.l}</p>
              <p style={{ color: "var(--bright)", fontWeight: 600 }}>{i.v}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
   SLIDES ARRAY
── ── ── ── ── ── ── ── ── ── ── ── ── ── ── */

export const slides: Slide[] = [
  // Intro
  { section: "intro", component: CoverSlide },
  { section: "intro", component: AboutSlide },
  { section: "intro", component: WhyOpenClawSlide },
  { section: "intro", component: ProblemSlide },
  { section: "intro", component: WhatIsSlide },
  { section: "intro", component: InstallSlide },
  { section: "intro", component: ShowcaseSlide },
  { section: "intro", component: QABreak1 },
  // Demo
  { section: "demo", component: DemoIntroSlide },
  { section: "demo", component: Step1Slide },
  { section: "demo", component: Step2Slide },
  { section: "demo", component: Step3Slide },
  { section: "demo", component: Step4Slide },
  { section: "demo", component: QABreak2 },
  { section: "demo", component: Step5Slide },
  { section: "demo", component: BuildingBlocksSlide },
  { section: "demo", component: QABreak3 },
  // Q&A
  { section: "qa", component: IdeasSlide },
  { section: "qa", component: GoBuildSlide },
  { section: "qa", component: OpenQASlide },
]
