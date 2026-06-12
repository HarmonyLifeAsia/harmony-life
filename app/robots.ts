import type { MetadataRoute } from 'next'
import { SITE_URL } from './_data/site'

// Explicitly welcome AI crawlers/answer engines (in addition to the default *),
// so the site can surface in AI search (ChatGPT, Claude, Perplexity, Gemini, etc.).
const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'anthropic-ai', 'Claude-Web', 'Claude-SearchBot',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot', 'Applebot-Extended',
  'CCBot', 'Amazonbot', 'cohere-ai', 'YouBot', 'Bytespider', 'DuckAssistBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_BOTS.map((ua) => ({ userAgent: ua, allow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
