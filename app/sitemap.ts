import type { MetadataRoute } from 'next'
import { SITE_URL } from './_data/site'
import { locales } from './_i18n/dictionaries'
import { projects } from './_data/projects'

// Every page × every locale. Keeps Google pointed at harmonylife.co.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/projects', '/guide', '/about', '/contact', '/privacy']
  const projectPaths = projects.map((p) => `/projects/${p.slug}`)
  const allPaths = [...staticPaths, ...projectPaths, '/projects/harmony-life-oasis/model']

  const localized = locales.flatMap((lang) =>
    allPaths.map((path) => ({
      url: `${SITE_URL}/${lang}${path}`,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.7,
    }))
  )

  // Polski-only strony (jak /ubezpieczenia i /membership) — tylko wariant PL.
  const plOnly = ([] as string[] /* '/membership' — ukryte na razie */).map((path) => ({
    url: `${SITE_URL}/pl${path}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...localized, ...plOnly]
}
