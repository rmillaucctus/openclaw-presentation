import type { Submission } from "./poll-config"

const KEY     = "poll:submissions"
const DEL_KEY = "poll:deleted"

const mem:    string[]  = []
const memDel: Set<string> = new Set()

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

export async function deleteSubmission(id: string): Promise<void> {
  if (useReal()) {
    const redis = await getRedis()
    await redis.sadd(DEL_KEY, id)
  } else {
    memDel.add(id)
  }
}

export async function allSubmissions(): Promise<Submission[]> {
  let raw: string[]
  let deleted: Set<string>

  if (useReal()) {
    const redis = await getRedis()
    const [rows, dels] = await Promise.all([
      redis.lrange(KEY, 0, -1) as Promise<string[]>,
      redis.smembers(DEL_KEY)  as Promise<string[]>,
    ])
    raw     = rows
    deleted = new Set(dels)
  } else {
    raw     = [...mem]
    deleted = memDel
  }

  return raw
    .map(r => JSON.parse(r) as Submission)
    .filter(s => !deleted.has(s.id))
}
