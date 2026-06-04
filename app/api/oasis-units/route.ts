import { NextResponse } from 'next/server'

// Live villa data for the Oasis interactive map, proxied from the Harmony Life
// CRM panel. Server-side fetch avoids CORS and sets the headers the panel needs;
// no-store keeps it real-time. Image URLs from the panel are short-lived signed
// links, so we always fetch fresh.
const SOURCE = 'https://panel.harmonylife.asia/api/public/projects/HLOASIS/units'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const res = await fetch(SOURCE, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
        Referer: 'https://panel.harmonylife.asia/p/HLOASIS/units',
      },
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'upstream', status: res.status }, { status: 502 })
    }
    const data = await res.json()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch {
    return NextResponse.json({ error: 'fetch-failed' }, { status: 502 })
  }
}
