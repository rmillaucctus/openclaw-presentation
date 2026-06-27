import type { Submission } from "./poll-config"

const KEY = "poll:submissions"

// In-memory fallback for local dev (not persistent across restarts)
const mem: string[] = []

function useReal() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

async function getRedis() {
  const { Redis } = await import("@upstash/redis")
  return Redis.fromEnv()
}

export async function pushSubmission(sub: Submission): Promise<void> {
  if (useReal()) {
    const redis = await getRedis()
    await redis.lpush(KEY, JSON.stringify(sub))
  } else {
    mem.unshift(JSON.stringify(sub))
  }
}

export async function allSubmissions(): Promise<Submission[]> {
  let raw: string[]
  if (useReal()) {
    const redis = await getRedis()
    raw = (await redis.lrange(KEY, 0, -1)) as string[]
  } else {
    raw = [...mem]
  }
  return raw.map(r => JSON.parse(r) as Submission)
}
