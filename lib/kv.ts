import type { Submission } from "./poll-config"

const KEY     = "poll:submissions"
const DEL_KEY = "poll:deleted"

const mem:    Submission[] = []
const memDel: Set<string>  = new Set()

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
    // @upstash/redis auto-serializes objects — do NOT JSON.stringify manually
    await redis.lpush(KEY, sub as unknown as string)
  } else {
    mem.unshift(sub)
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
  let rows: Submission[]
  let deleted: Set<string>

  if (useReal()) {
    const redis = await getRedis()
    const [raw, dels] = await Promise.all([
      // @upstash/redis already deserializes JSON — cast directly to Submission[]
      redis.lrange(KEY, 0, -1) as Promise<unknown[]>,
      redis.smembers(DEL_KEY)  as Promise<string[]>,
    ])
    rows    = raw.map(r => (typeof r === "string" ? JSON.parse(r) : r) as Submission)
    deleted = new Set(dels)
  } else {
    rows    = [...mem]
    deleted = memDel
  }

  return rows.filter(s => !deleted.has(s.id))
}
