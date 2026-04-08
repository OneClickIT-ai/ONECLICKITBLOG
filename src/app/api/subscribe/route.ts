import { type NextRequest, NextResponse } from 'next/server'
import { getWriteClient } from '@/lib/ingestion/sanity-write-client'
import { groq } from 'next-sanity'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 },
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    const client = getWriteClient()

    // Check if already subscribed
    const existing = await client.fetch(
      groq`*[_type == "subscriber" && email == $email][0]{ _id, status }`,
      { email: normalizedEmail },
    )

    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Re-activate
        await client.patch(existing._id).set({ status: 'active' }).commit()
        return NextResponse.json({ success: true, message: 'Welcome back!' })
      }
      return NextResponse.json({ success: true, message: 'Already subscribed' })
    }

    // Create new subscriber
    await client.create({
      _type: 'subscriber',
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
      status: 'active',
    })

    return NextResponse.json({ success: true, message: 'Subscribed!' })
  } catch (err) {
    console.error('Subscribe error:', err)
    const message = err instanceof Error ? err.message : 'Subscription failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
