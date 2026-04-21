import Anthropic from '@anthropic-ai/sdk'
import type { NormalizedItem } from './types'

const BATCH_SIZE = 10
const MODEL = 'claude-haiku-4-5'

type Priority = 'breaking' | 'high' | 'medium' | 'low'

interface EnrichedResult {
  hash: string
  priority: Priority
  aiTake: string
}

const SYSTEM_PROMPT = `You are an editorial AI for a tech news blog. Given a batch of news headlines and summaries, classify each item and generate a brief "why it matters" insight.

For each item return:
- priority: one of "breaking" | "high" | "medium" | "low"
  - breaking: major industry-changing announcements (GPT-5 launch, critical zero-day, mega acquisition)
  - high: significant news (new model release, large funding round, major product launch, serious breach)
  - medium: noteworthy updates (feature releases, moderate funding, tool releases, industry reports)
  - low: minor news (small updates, blog posts, minor releases, opinion pieces)
- aiTake: 1-2 sentence "why it matters" written for a tech-savvy audience. Be direct and specific, no filler.

Respond ONLY with a JSON array in this exact format:
[{"hash":"<hash>","priority":"<priority>","aiTake":"<take>"},...]`

export async function enrichItems(
  items: NormalizedItem[],
): Promise<NormalizedItem[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || items.length === 0) return items

  const client = new Anthropic({ apiKey })
  const enriched = new Map<string, EnrichedResult>()

  // Process in batches to control cost
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE)
    const results = await processBatch(client, batch)
    for (const r of results) {
      enriched.set(r.hash, r)
    }
  }

  return items.map((item) => {
    const result = enriched.get(item.hash)
    if (!result) return item
    return { ...item, priority: result.priority, aiTake: result.aiTake }
  })
}

async function processBatch(
  client: Anthropic,
  batch: NormalizedItem[],
): Promise<EnrichedResult[]> {
  const userContent = batch
    .map((item) => `{"hash":"${item.hash}","headline":${JSON.stringify(item.headline)},"summary":${JSON.stringify(item.summary.slice(0, 200))}}`)
    .join('\n')

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userContent }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const parsed = JSON.parse(text) as EnrichedResult[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // If AI call fails, return items unmodified — pipeline continues
    return []
  }
}
