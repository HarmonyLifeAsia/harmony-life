import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'pl', 'de']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Strony kampanijne poza strukturą językową (czysty layout, PL-only).
  if (pathname === '/film') return

  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  request.nextUrl.pathname = `/pl${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // Skip internals, the API, the metadata routes (icon/apple-icon/manifest) and
  // any path with a file extension (images, video, og-image, sitemap.xml, robots.txt, …).
  matcher: ['/((?!_next|api|icon|apple-icon|manifest|.*\\..*).*)'],
}
