import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../_i18n/dictionaries'
import { localizeProject } from '../../_data/localizeProject'
import { partnerProjects, withRates } from '../../_data/partners'
import { projects } from '../../_data/projects'
import PartnersContent from '../../partners/PartnersContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return { title: dict.partners.metaTitle, description: withRates(dict.partners.metaDescription, lang) }
}

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const list = partnerProjects.map((p) => localizeProject(p, dict))
  const soldOut = projects.filter((p) => p.status === 'Sold Out').map((p) => localizeProject(p, dict))
  return <PartnersContent projects={list} soldOut={soldOut} />
}
