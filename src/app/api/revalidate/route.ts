import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { revalidateSecret } from '@/sanity/env'

const tagsByType: Record<string, string[]> = {
  original_post: ['post', 'homepage'],
  buyer_guide: ['guide', 'homepage'],
  news_digest: ['digest', 'homepage'],
  trend_radar: ['trend'],
  category: ['category', 'homepage'],
  author: ['author'],
  siteSettings: ['siteSettings'],
  source: ['source'],
}

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{
      _type: string
      slug?: { current?: string }
    }>(req, revalidateSecret)

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new NextResponse('Bad request', { status: 400 })
    }

    const tags = tagsByType[body._type] || []
    for (const tag of tags) {
      revalidateTag(tag)
    }

    return NextResponse.json({
      revalidated: true,
      tags,
      type: body._type,
    })
  } catch (err) {
    console.error('Revalidation error:', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
