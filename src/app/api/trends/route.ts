import { type NextRequest, NextResponse } from 'next/server'
import { groq } from 'next-sanity'
import { getWriteClient } from '@/lib/ingestion/sanity-write-client'

function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  return cronSecret && authHeader === `Bearer ${cronSecret}`
}

export async function GET(req: NextRequest) {
  return handleTrends(req)
}

export async function POST(req: NextRequest) {
  return handleTrends(req)
}

// ── Stop words for keyword extraction ───────────────────────────────────────
const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','as','is','was','are','were','be','been','being','have','has',
  'had','do','does','did','will','would','could','should','may','might','can',
  'not','no','this','that','these','those','it','its','i','you','he','she',
  'we','they','what','which','who','how','when','where','why','all','new',
  'more','over','about','up','out','so','if','into','than','then','also',
  'after','get','just','now','says','said','says','first','second',
])

interface DigestItemRaw {
  headline: string
  priority?: string
  categoryTitle?: string
  categorySlug?: string
  categoryId?: string
}

interface TrendEntry {
  topic: string
  count: number
  momentum: 'rising' | 'stable'
  categoryId?: string
  categoryTitle?: string
  categorySlug?: string
}

async function handleTrends(req: NextRequest) {
  if (!checkAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const client = getWriteClient()

    // 1. Pull headlines from last 7 days of digests
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    const recentQuery = groq`*[_type == "news_digest" && publishedAt > $since] {
      "items": items[] {
        headline,
        priority,
        "categoryTitle": category->title,
        "categorySlug": category->slug.current,
        "categoryId": category->_id
      }
    }`

    const recentData = await client.fetch<{ items: DigestItemRaw[] }[]>(
      recentQuery,
      { since: sevenDaysAgo.toISOString() },
    )

    const recentHotData = await client.fetch<{ items: DigestItemRaw[] }[]>(
      recentQuery,
      { since: threeDaysAgo.toISOString() },
    )

    const allItems = recentData.flatMap((d) => d.items || [])
    const recentItems = recentHotData.flatMap((d) => d.items || [])

    if (allItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No digest items found in last 7 days' },
        { status: 200 },
      )
    }

    // 2. Extract keywords and count frequencies
    const allFreq = countKeywords(allItems)
    const recentFreq = countKeywords(recentItems)

    // 3. Determine momentum: rising if frequency in last 3 days > 50% of 7-day total
    const trends: TrendEntry[] = []
    const topTopics = Object.entries(allFreq)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 20)

    for (const [topic, data] of topTopics) {
      const recentCount = recentFreq[topic]?.count ?? 0
      const momentum: 'rising' | 'stable' =
        data.count > 0 && recentCount / data.count > 0.5 ? 'rising' : 'stable'

      trends.push({
        topic,
        count: data.count,
        momentum,
        categoryId: data.categoryId,
        categoryTitle: data.categoryTitle,
        categorySlug: data.categorySlug,
      })
    }

    // 4. Upsert trend_radar document
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    const docId = 'trend-radar-auto'

    const trendItems = trends.map((t, i) => ({
      _type: 'trendItem',
      _key: `trend-${i}-${t.topic.replace(/\s+/g, '-').toLowerCase()}`,
      title: toTitleCase(t.topic),
      description: `${t.count} mentions in the last 7 days.`,
      momentum: t.momentum,
      ...(t.categoryId
        ? { category: { _type: 'reference', _ref: t.categoryId } }
        : {}),
    }))

    await client.createOrReplace({
      _id: docId,
      _type: 'trend_radar',
      title: `Trend Radar – ${today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      slug: { _type: 'slug', current: 'trend-radar-auto' },
      publishedAt: today.toISOString(),
      description: `Auto-generated from ${allItems.length} digest items. Updated ${dateStr}.`,
      trends: trendItems,
    })

    return NextResponse.json({
      success: true,
      timestamp: today.toISOString(),
      itemsAnalyzed: allItems.length,
      trendsFound: trends.length,
    })
  } catch (err) {
    console.error('Trend discovery error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

// ── Keyword extraction ───────────────────────────────────────────────────────

interface KeywordData {
  count: number
  categoryId?: string
  categoryTitle?: string
  categorySlug?: string
}

function countKeywords(items: DigestItemRaw[]): Record<string, KeywordData> {
  const freq: Record<string, KeywordData> = {}

  for (const item of items) {
    const words = tokenize(item.headline)
    const phrases = extractPhrases(words)
    const signals = [...words, ...phrases]

    for (const signal of signals) {
      if (!freq[signal]) {
        freq[signal] = {
          count: 0,
          categoryId: item.categoryId,
          categoryTitle: item.categoryTitle,
          categorySlug: item.categorySlug,
        }
      }
      freq[signal].count++
    }
  }

  // Filter: must appear at least twice to be worth trending
  return Object.fromEntries(
    Object.entries(freq).filter(([, v]) => v.count >= 2),
  )
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w))
}

function extractPhrases(words: string[]): string[] {
  const phrases: string[] = []
  // Known tech keyphrases: 2-word combos of significant terms
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`
    if (words[i].length > 3 && words[i + 1].length > 3) {
      phrases.push(bigram)
    }
  }
  return phrases
}

function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase())
}
