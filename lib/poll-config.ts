export interface Option { id: string; label: string }
export interface Question {
  id: string
  text: string
  type: "choice" | "text"
  options?: Option[]
  placeholder?: string
  maxLength?: number
}

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "What's your favourite AI tool right now?",
    type: "choice",
    options: [
      { id: "chatgpt",  label: "ChatGPT" },
      { id: "claude",   label: "Claude" },
      { id: "copilot",  label: "Copilot / Cursor" },
      { id: "gemini",   label: "Gemini" },
      { id: "other",    label: "Something else" },
    ],
  },
  {
    id: "q2",
    text: "What do you use AI for most?",
    type: "choice",
    options: [
      { id: "coding",   label: "Coding / debugging" },
      { id: "writing",  label: "Writing / editing" },
      { id: "research", label: "Research & learning" },
      { id: "creative", label: "Creative stuff" },
      { id: "nope",     label: "I don't really use it yet" },
    ],
  },
  {
    id: "q3",
    text: "Have you ever built something with AI?",
    type: "choice",
    options: [
      { id: "shipped",       label: "Yes — I've shipped something" },
      { id: "experimenting", label: "I've experimented a bit" },
      { id: "want_to",       label: "Not yet but I want to!" },
      { id: "not_yet",       label: "Not really my thing" },
    ],
  },
  {
    id: "q4",
    text: "What's a big challenge you'd love AI to help solve?",
    type: "text",
    placeholder: "e.g. mental health access, climate, education…",
    maxLength: 120,
  },
  {
    id: "q5",
    text: "If you had one week and unlimited AI — what would you build?",
    type: "text",
    placeholder: "Go wild.",
    maxLength: 120,
  },
  {
    id: "q6",
    text: "Drop a message for the room — introduce yourself, shout something out, or just say hi 👋",
    type: "text",
    placeholder: "Say something…",
    maxLength: 200,
  },
]

export interface Submission {
  id: string
  ts: number
  q1: string
  q2: string
  q3: string
  q4: string
  q5: string
  q6: string
}
