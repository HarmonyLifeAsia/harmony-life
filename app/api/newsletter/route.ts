import { NextResponse } from 'next/server'

// Newsletter signups are forwarded to the Harmony Life CRM panel. The webhook
// key must stay server-side, hence this proxy instead of a browser fetch.
const SOURCE = 'https://panel.harmonylife.asia/api/newsletter/webhook/subscribe'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  const key = process.env.NEWSLETTER_WEBHOOK_KEY
  if (!key) return NextResponse.json({ error: 'not-configured' }, { status: 503 })

  let body: { email?: unknown; language?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid-email' }, { status: 400 })
  }
  const language = typeof body.language === 'string' && ['en', 'pl', 'de'].includes(body.language)
    ? body.language
    : 'en'

  try {
    const res = await fetch(SOURCE, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, language }),
    })
    if (!res.ok) return NextResponse.json({ error: 'upstream', status: res.status }, { status: 502 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'fetch-failed' }, { status: 502 })
  }
}
